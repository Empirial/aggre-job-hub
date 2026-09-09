import io
import json
import logging
import mimetypes
import os
import uuid
from pathlib import Path
from typing import List, Optional

import fitz  # PyMuPDF
import httpx
import pdfplumber
import pypdf
import pytesseract
from PIL import Image
from fastapi import APIRouter, Depends, Form, HTTPException, Request, UploadFile, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.auth import require_auth
from app.limiter import limiter
from app import firebase_client as db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/documents", tags=["documents"])

MAX_SIZE_MB = 10

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc", ".jpg", ".jpeg", ".png"}
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_URL = os.getenv("DEEPSEEK_API_URL", "https://api.deepseek.com/v1/chat/completions")

# Magic bytes for file type validation
MAGIC_BYTES = {
    ".pdf": b"%PDF",
    ".docx": b"PK",
    ".doc": b"\xd0\xcf",
    ".jpg": b"\xff\xd8",
    ".jpeg": b"\xff\xd8",
    ".png": b"\x89PNG",
}


OCR_MAX_PAGES = 20


def _ocr_pdf_bytes(content: bytes) -> str:
    """OCR fallback for scanned/image-only PDFs with no extractable text layer."""
    try:
        doc = fitz.open(stream=content, filetype="pdf")
    except Exception as e:
        logger.warning("OCR: failed to open PDF: %s", e)
        return ""

    texts = []
    try:
        for i, page in enumerate(doc):
            if i >= OCR_MAX_PAGES:
                break
            try:
                pix = page.get_pixmap(dpi=200)
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                texts.append(pytesseract.image_to_string(img))
            except Exception as e:
                logger.warning("OCR: failed on page %d: %s", i, e)
    finally:
        doc.close()

    return "\n\n".join(texts).strip()


async def _deepseek(messages: list[dict], max_tokens: int = 600) -> str:
    if not DEEPSEEK_API_KEY:
        return ""
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "deepseek-chat",
        "messages": messages,
        "temperature": 0.3,
        "max_tokens": max_tokens,
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        res = await client.post(DEEPSEEK_URL, json=payload, headers=headers)
        res.raise_for_status()
        data = res.json()
    return data["choices"][0]["message"]["content"].strip()


@router.post("/extract")
@limiter.limit("10/minute")
async def extract_pdf(request: Request, file: UploadFile = File(...), uid: str = Depends(require_auth)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    content = await file.read()
    if len(content) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"File exceeds {MAX_SIZE_MB} MB limit")

    if not content.startswith(b"%PDF"):
        raise HTTPException(status_code=400, detail="File content does not match PDF format")

    try:
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            pages = [page.extract_text() or "" for page in pdf.pages]
        full_text = "\n\n".join(pages).strip()
    except Exception as e:
        logger.error("extract_pdf failed: %s", e, exc_info=True)
        raise HTTPException(status_code=422, detail="Could not parse PDF")

    ocr_used = False
    if not full_text:
        full_text = _ocr_pdf_bytes(content)
        ocr_used = True

    fields: list[str] = []
    try:
        reader = pypdf.PdfReader(io.BytesIO(content))
        raw_fields = reader.get_fields() or {}
        fields = list(raw_fields.keys())
    except Exception:
        pass

    return {
        "filename": file.filename,
        "page_count": len(pages),
        "text": full_text,
        "char_count": len(full_text),
        "fields": fields,
        "is_fillable": len(fields) > 0,
        "ocr_used": ocr_used,
    }


# ── Suggest fill values ───────────────────────────────────────────────────────

class SuggestFillRequest(BaseModel):
    fields: list[str]
    document_text: str
    profile: Optional[dict] = None


@router.post("/suggest-fill")
@limiter.limit("20/minute")
async def suggest_fill(request: Request, body: SuggestFillRequest, uid: str = Depends(require_auth)):
    profile_str = json.dumps(body.profile or {}, indent=2)
    field_list = "\n".join(f"- {f}" for f in body.fields)

    system = (
        "You are a form-filling assistant. Given PDF form field names, document context, "
        "and user profile data, suggest appropriate string values for each field. "
        "Return ONLY a valid JSON object where keys are the exact field names provided "
        "and values are strings. Use empty string if a field cannot be inferred."
    )
    user = (
        f"Document context:\n{body.document_text[:2000]}\n\n"
        f"User profile:\n{profile_str}\n\n"
        f"Form fields:\n{field_list}\n\n"
        "Return a JSON object mapping each field name to its suggested value."
    )

    raw = await _deepseek(
        [{"role": "system", "content": system}, {"role": "user", "content": user}],
        max_tokens=900,
    )

    suggestions: dict = {}
    if raw:
        try:
            clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            suggestions = json.loads(clean)
        except json.JSONDecodeError:
            pass

    for f in body.fields:
        if f not in suggestions:
            suggestions[f] = ""

    return {"suggestions": suggestions}


# ── Profile documents (Firebase Storage + Firestore metadata) ────────────────

class ProfileDocument(BaseModel):
    id: str
    original_filename: str
    doc_type: str
    size: int
    content_type: str
    text_excerpt: Optional[str] = None
    created_at: str


def _extract_text_excerpt(ext: str, content: bytes) -> Optional[str]:
    if ext != ".pdf":
        return None
    text = ""
    try:
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            pages = [p.extract_text() or "" for p in pdf.pages]
        text = "\n\n".join(pages).strip()
    except Exception:
        pass

    if not text:
        try:
            text = _ocr_pdf_bytes(content)
        except Exception:
            pass

    return text or None


def _save_document(uid: str, filename: str, content: bytes, doc_type: str) -> ProfileDocument:
    ext = Path(filename).suffix.lower()
    doc_id = str(uuid.uuid4())
    storage_path = f"users/{uid}/documents/{doc_id}{ext}"
    content_type = mimetypes.guess_type(filename)[0] or "application/octet-stream"

    db.upload_profile_document_blob(storage_path, content, content_type)

    doc_data: dict = {
        "original_filename": filename,
        "doc_type": doc_type,
        "size": len(content),
        "content_type": content_type,
        "storage_path": storage_path,
        "text_excerpt": _extract_text_excerpt(ext, content),
    }
    db.save_profile_document(uid, doc_id, doc_data)

    return ProfileDocument(
        id=doc_id,
        original_filename=doc_data["original_filename"],
        doc_type=doc_data["doc_type"],
        size=doc_data["size"],
        content_type=doc_data["content_type"],
        text_excerpt=doc_data["text_excerpt"],
        created_at=doc_data["created_at"],
    )


@router.post("/upload-profile", response_model=ProfileDocument)
@limiter.limit("10/minute")
async def upload_profile_doc(
    request: Request,
    file: UploadFile = File(...),
    doc_type: str = Form("supporting"),
    uid: str = Depends(require_auth),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type {ext} not allowed")

    content = await file.read()
    if len(content) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"File exceeds {MAX_SIZE_MB} MB limit")

    expected_magic = MAGIC_BYTES.get(ext)
    if expected_magic and not content.startswith(expected_magic):
        raise HTTPException(status_code=400, detail=f"File content does not match {ext} format")

    try:
        return _save_document(uid, file.filename, content, doc_type)
    except Exception as e:
        logger.error("Storage upload failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to store document")


@router.post("/profile-docs/reprocess")
@limiter.limit("5/minute")
def reprocess_profile_docs(request: Request, uid: str = Depends(require_auth)):
    """Re-extract text_excerpt for existing PDF uploads with the current (uncapped) extraction logic."""
    docs = db.get_profile_documents(uid)
    reprocessed = 0
    for d in docs:
        ext = Path(d.get("original_filename", "")).suffix.lower()
        storage_path = d.get("storage_path")
        if ext != ".pdf" or not storage_path:
            continue
        try:
            content = db.download_profile_document_blob(storage_path)
        except Exception as e:
            logger.warning("Reprocess: failed to download %s: %s", d.get("id"), e)
            continue
        data = {**d, "text_excerpt": _extract_text_excerpt(ext, content)}
        data.pop("id", None)
        db.save_profile_document(uid, d["id"], data)
        reprocessed += 1
    return {"reprocessed": reprocessed, "total": len(docs)}


@router.get("/profile-docs", response_model=List[ProfileDocument])
def list_profile_docs(uid: str = Depends(require_auth)):
    docs = db.get_profile_documents(uid)
    return [
        ProfileDocument(
            id=d["id"],
            original_filename=d.get("original_filename", "document"),
            doc_type=d.get("doc_type", "supporting"),
            size=d.get("size", 0),
            content_type=d.get("content_type", "application/octet-stream"),
            text_excerpt=d.get("text_excerpt"),
            created_at=d.get("created_at", ""),
        )
        for d in docs
    ]


@router.delete("/profile-docs/{doc_id}")
def delete_profile_doc(doc_id: str, uid: str = Depends(require_auth)):
    data = db.delete_profile_document(uid, doc_id)
    if data and data.get("storage_path"):
        try:
            db.delete_profile_document_blob(data["storage_path"])
        except Exception as e:
            logger.warning("Failed to delete storage blob: %s", e)
    return {"status": "deleted"}


@router.get("/profile-docs/{doc_id}/download")
def download_profile_doc(doc_id: str, uid: str = Depends(require_auth)):
    data = db.get_profile_document(uid, doc_id)
    if not data or not data.get("storage_path"):
        raise HTTPException(status_code=404, detail="Document not found")

    try:
        content = db.download_profile_document_blob(data["storage_path"])
    except Exception as e:
        logger.error("Storage download failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to retrieve document")

    return StreamingResponse(
        io.BytesIO(content),
        media_type=data.get("content_type", "application/octet-stream"),
        headers={"Content-Disposition": f'attachment; filename="{data.get("original_filename", "document")}"'},
    )


# ── Fill a PDF form and save it as a profile document ─────────────────────────

@router.post("/fill", response_model=ProfileDocument)
@limiter.limit("10/minute")
async def fill_pdf(
    request: Request,
    file: UploadFile = File(...),
    values: str = Form(...),
    uid: str = Depends(require_auth),
):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    content = await file.read()

    if not content.startswith(b"%PDF"):
        raise HTTPException(status_code=400, detail="File content does not match PDF format")

    try:
        field_values: dict = json.loads(values)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid field values JSON")

    try:
        reader = pypdf.PdfReader(io.BytesIO(content))
        writer = pypdf.PdfWriter()
        writer.append(reader)

        for page in writer.pages:
            try:
                writer.update_page_form_field_values(page, field_values)
            except Exception:
                pass

        output = io.BytesIO()
        writer.write(output)
        filled_content = output.getvalue()
    except Exception as e:
        logger.error("fill_pdf failed: %s", e, exc_info=True)
        raise HTTPException(status_code=422, detail="Could not fill PDF")

    filled_name = f"Filled_{Path(file.filename).stem}.pdf"
    try:
        return _save_document(uid, filled_name, filled_content, "filled_form")
    except Exception as e:
        logger.error("Storage upload failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to save filled document")


# ── Conversational form filling (Z83 and other government forms) ─────────────

class FormChatRequest(BaseModel):
    instruction: str
    fields: list[str]
    values: dict = {}
    document_text: str = ""
    profile: Optional[dict] = None


@router.post("/form-chat")
@limiter.limit("20/minute")
async def form_chat(request: Request, body: FormChatRequest, uid: str = Depends(require_auth)):
    """Apply a plain-language instruction to the current form values.

    Returns a short reply plus the full updated value map, so the UI can
    show the change immediately and let the user keep editing by hand.
    """
    system = (
        "You help a South African job seeker fill in a government application form "
        "(usually a Z83). You are given the form's field names, the values filled in "
        "so far, the user's saved profile and an instruction in plain language.\n"
        "Apply the instruction to the values. Only change the fields the instruction "
        "affects, unless the user clearly asks you to fill in everything.\n"
        "Never invent qualifications, ID numbers or dates that are not in the profile "
        "or the instruction — leave those blank instead.\n"
        'Return ONLY valid JSON: {"reply": "one short sentence", "values": {"<field>": "<value>"}} '
        "where values contains every field name given, with its final value."
    )
    user = (
        f"Form fields:\n{json.dumps(body.fields)}\n\n"
        f"Current values:\n{json.dumps(body.values, indent=2)}\n\n"
        f"User profile:\n{json.dumps(body.profile or {}, indent=2)}\n\n"
        f"Form text (for context):\n{body.document_text[:2000]}\n\n"
        f"Instruction:\n{body.instruction}"
    )

    raw = await _deepseek(
        [{"role": "system", "content": system}, {"role": "user", "content": user}],
        max_tokens=1200,
    )

    values = dict(body.values)
    reply = ""
    if raw:
        try:
            clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            parsed = json.loads(clean)
            reply = str(parsed.get("reply", "")).strip()
            new_values = parsed.get("values") or {}
            if isinstance(new_values, dict):
                for k, v in new_values.items():
                    if k in body.fields:
                        values[k] = "" if v is None else str(v)
        except json.JSONDecodeError:
            reply = raw.strip()

    if not reply:
        reply = "I could not work out that change — try naming the exact field, or edit it directly on the left."

    for f in body.fields:
        values.setdefault(f, "")

    return {"reply": reply, "values": values}
