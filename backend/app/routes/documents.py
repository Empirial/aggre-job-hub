import io
import json
import os
from pathlib import Path
from typing import Optional

import httpx
import pdfplumber
import pypdf
from fastapi import APIRouter, Form, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

router = APIRouter(prefix="/documents", tags=["documents"])

MAX_SIZE_MB = 20
UPLOADS_DIR = Path(__file__).resolve().parents[2] / "uploads" / "profile"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc", ".jpg", ".jpeg", ".png"}
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_URL = os.getenv("DEEPSEEK_API_URL", "https://api.deepseek.com/v1/chat/completions")


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
async def extract_pdf(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    content = await file.read()
    if len(content) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"File exceeds {MAX_SIZE_MB} MB limit")

    # Extract text
    try:
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            pages = [page.extract_text() or "" for page in pdf.pages]
        full_text = "\n\n".join(pages).strip()
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse PDF: {e}")

    # Extract AcroForm fields
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
    }


# ── Chat ─────────────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    document_text: str
    messages: list[ChatMessage]
    message: str


@router.post("/chat")
async def chat_with_document(request: ChatRequest):
    system = (
        "You are a document assistant. The user has uploaded a PDF document. "
        "Help them understand it, extract key information, identify requirements, "
        "assist with form filling, or tailor their CV to a job description in the document.\n\n"
        f"Full document text:\n\n{request.document_text[:4000]}"
    )
    history = [{"role": m.role, "content": m.content} for m in request.messages[-8:]]
    history.append({"role": "user", "content": request.message})

    reply = await _deepseek(
        [{"role": "system", "content": system}] + history,
        max_tokens=700,
    )

    if not reply:
        reply = _fallback_reply(request.message, request.document_text)

    return {"reply": reply}


def _fallback_reply(msg: str, doc_text: str) -> str:
    q = msg.lower()
    if any(w in q for w in ["summarise", "summarize", "summary", "what is", "about"]):
        snippet = doc_text[:500].replace("\n", " ")
        return f"Here's what I can see:\n\n{snippet}...\n\nWhat specifically would you like to know?"
    if any(w in q for w in ["fill", "form", "field", "complete"]):
        return "Click the **Fill Form** button in the top bar — I'll use your saved profile to suggest values for every field in this document."
    if "keyword" in q:
        words = list({w for w in doc_text.split() if len(w) > 5})[:12]
        return "Keywords found:\n\n" + "\n".join(f"• {w}" for w in words)
    if any(w in q for w in ["require", "qualify", "eligib", "must"]):
        lines = [l.strip() for l in doc_text.split("\n") if len(l.strip()) > 30][:6]
        return "Key lines from the document:\n\n" + "\n".join(f"• {l}" for l in lines)
    return (
        "I have this document loaded. You can ask me to:\n\n"
        "• Summarise it\n"
        "• Extract requirements or qualifications\n"
        "• Identify keywords\n"
        "• Help understand specific sections\n\n"
        "Or click **Fill Form** to auto-populate all fields using your profile."
    )


# ── Suggest fill values ───────────────────────────────────────────────────────

class SuggestFillRequest(BaseModel):
    fields: list[str]
    document_text: str
    profile: Optional[dict] = None


@router.post("/suggest-fill")
async def suggest_fill(request: SuggestFillRequest):
    profile_str = json.dumps(request.profile or {}, indent=2)
    field_list = "\n".join(f"- {f}" for f in request.fields)

    system = (
        "You are a form-filling assistant. Given PDF form field names, document context, "
        "and user profile data, suggest appropriate string values for each field. "
        "Return ONLY a valid JSON object where keys are the exact field names provided "
        "and values are strings. Use empty string if a field cannot be inferred."
    )
    user = (
        f"Document context:\n{request.document_text[:2000]}\n\n"
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

    # Ensure every field has an entry
    for f in request.fields:
        if f not in suggestions:
            suggestions[f] = ""

    return {"suggestions": suggestions}


# ── Fill and return PDF ───────────────────────────────────────────────────────

@router.post("/upload-profile")
async def upload_profile_doc(file: UploadFile = File(...), doc_type: str = Form("supporting")):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type {ext} not allowed")

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File exceeds 10 MB limit")

    safe_name = Path(file.filename).name
    dest = (UPLOADS_DIR / safe_name).resolve()
    if not dest.is_relative_to(UPLOADS_DIR.resolve()):
        raise HTTPException(status_code=400, detail="Invalid filename")

    dest.write_bytes(content)
    return {"filename": safe_name, "doc_type": doc_type, "size": len(content)}


@router.post("/fill")
async def fill_pdf(file: UploadFile = File(...), values: str = Form(...)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    content = await file.read()

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
                pass  # page has no form fields — skip

        output = io.BytesIO()
        writer.write(output)
        output.seek(0)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not fill PDF: {e}")

    safe_name = f"filled_{file.filename}"
    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{safe_name}"'},
    )
