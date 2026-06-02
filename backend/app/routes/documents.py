import io
import pdfplumber
from fastapi import APIRouter, HTTPException, UploadFile, File

router = APIRouter(prefix="/documents", tags=["documents"])

MAX_SIZE_MB = 20


@router.post("/extract")
async def extract_pdf_text(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    content = await file.read()
    if len(content) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"File exceeds {MAX_SIZE_MB} MB limit")

    try:
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            pages = []
            for page in pdf.pages:
                text = page.extract_text() or ""
                pages.append(text)
        full_text = "\n\n".join(pages).strip()
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse PDF: {e}")

    if not full_text:
        raise HTTPException(status_code=422, detail="PDF appears to be scanned or image-only — no extractable text")

    return {
        "filename": file.filename,
        "page_count": len(pages),
        "text": full_text,
        "char_count": len(full_text),
    }
