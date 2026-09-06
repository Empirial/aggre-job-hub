import os
import re
import logging
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from app.ai.deepseek_client import DeepSeekClient
from app.cv.ats_mirror import ATSMirror
from app.cv.docx_generator import generate_cv_docx
from app.models import CVDocxRequest, CVDocxResponse, CVTailorRequest, CVTailorResponse, JobAnalysisRequest, JobAnalysisResponse
from app import firebase_client
from app.auth import require_auth
from app.limiter import limiter
from app.routes import jobs as jobs_router
from app.routes import documents as documents_router
from app.routes import chat as chat_router
from app.routes import profile as profile_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    firebase_client.init_firebase()
    yield


app = FastAPI(title="JobApplier Backend", version="0.2.0", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:4173",
    "http://localhost:8080",
    "http://localhost:8081",
    "https://careergate.co.za",
    "https://www.careergate.co.za",
    "https://aggre-job-hub.web.app",
    "https://aggre-job-hub.firebaseapp.com",
    "https://jobs-e038b.web.app",
    "https://jobs-e038b.firebaseapp.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept", "X-Demo-Mode"],
)

app.include_router(jobs_router.router)
app.include_router(documents_router.router)
app.include_router(chat_router.router)
app.include_router(profile_router.router)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_API_URL = os.getenv("DEEPSEEK_API_URL", "https://api.deepseek.com/v1/chat/completions")

OUTPUT_DIR = Path(__file__).resolve().parents[1] / "output"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

deepseek = DeepSeekClient(api_key=DEEPSEEK_API_KEY, api_url=DEEPSEEK_API_URL)


@app.get("/health")
def health():
    return {"status": "ok", "phase": "phase-2"}


@app.post("/analyze", response_model=JobAnalysisResponse)
@limiter.limit("20/minute")
async def analyze_job(request: Request, body: JobAnalysisRequest, uid: str = Depends(require_auth)):
    try:
        return await deepseek.analyze_job_description(body)
    except Exception as exc:
        logger.error("analyze_job failed: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="An internal error occurred")


@app.post("/tailor-cv", response_model=CVTailorResponse)
@limiter.limit("20/minute")
async def tailor_cv(request: Request, body: CVTailorRequest, uid: str = Depends(require_auth)):
    try:
        if body.analysis is None:
            body.analysis = await deepseek.analyze_job_description(body.job)

        tailored_summary = ATSMirror.rewrite_summary(
            body.profile.summary or "", body.job, body.analysis
        )
        tailored_skills = ATSMirror.rewrite_skills(
            body.profile.skills or [], body.job, body.analysis
        )
        tailored_experience = ATSMirror.rewrite_experience(
            body.profile.experience or [], body.job, body.analysis
        )

        safe_name = re.sub(r'[^\w\-]', '_', body.profile.name)
        safe_title = re.sub(r'[^\w\-]', '_', body.job.title)
        output_filename = f"{safe_name}_{safe_title}.docx"
        user_dir = OUTPUT_DIR / uid
        user_dir.mkdir(parents=True, exist_ok=True)
        output_path = user_dir / output_filename

        generate_cv_docx(
            profile=body.profile,
            summary=tailored_summary,
            skills=tailored_skills,
            experience=tailored_experience,
            education=body.profile.education,
            output_path=output_path,
        )

        return CVTailorResponse(
            summary=tailored_summary,
            skills=tailored_skills,
            experience=tailored_experience,
            education=body.profile.education,
            docx_path=str(output_path),
        )
    except Exception as exc:
        logger.error("tailor_cv failed: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="An internal error occurred")


@app.post("/cv/generate-docx", response_model=CVDocxResponse)
@limiter.limit("20/minute")
def generate_docx(request: Request, body: CVDocxRequest, uid: str = Depends(require_auth)):
    try:
        safe_name = re.sub(r'[^\w\-]', '_', body.profile.name or "cv")
        safe_title = re.sub(r'[^\w\-]', '_', body.job_title or "General_CV")
        output_filename = f"{safe_name}_{safe_title}.docx"
        user_dir = OUTPUT_DIR / uid
        user_dir.mkdir(parents=True, exist_ok=True)
        output_path = user_dir / output_filename

        generate_cv_docx(
            profile=body.profile,
            summary=body.summary,
            skills=body.skills,
            experience=body.experience,
            education=body.education,
            output_path=output_path,
        )

        return CVDocxResponse(docx_path=str(output_path))
    except Exception as exc:
        logger.error("generate_docx failed: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="An internal error occurred")


@app.post("/cover-letter")
@limiter.limit("10/minute")
async def cover_letter(request: Request, body: CVTailorRequest, uid: str = Depends(require_auth)):
    try:
        if body.analysis is None:
            body.analysis = await deepseek.analyze_job_description(body.job)

        text = await deepseek.generate_cover_letter(body.profile, body.job, body.analysis)
        return {"cover_letter": text}
    except Exception as exc:
        logger.error("cover_letter failed: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="An internal error occurred")


@app.get("/download/{filename}")
@limiter.limit("30/minute")
def download_cv(request: Request, filename: str, uid: str = Depends(require_auth)):
    if not re.match(r'^[\w\-. ]+$', filename):
        raise HTTPException(status_code=400, detail="Invalid filename")
    user_dir = (OUTPUT_DIR / uid).resolve()
    safe_filename = Path(filename).name
    file_path = (user_dir / safe_filename).resolve()
    if not file_path.is_relative_to(user_dir):
        raise HTTPException(status_code=400, detail="Invalid filename")
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(
        path=file_path,
        filename=safe_filename,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
