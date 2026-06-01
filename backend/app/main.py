import os
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from app.ai.deepseek_client import DeepSeekClient
from app.cv.ats_mirror import ATSMirror
from app.cv.docx_generator import generate_cv_docx
from app.models import CVTailorRequest, CVTailorResponse, JobAnalysisRequest, JobAnalysisResponse
from app import firebase_client
from app.routes import jobs as jobs_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    firebase_client.init_firebase()
    yield


app = FastAPI(title="JobApplier Backend", version="0.2.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs_router.router)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_API_URL = os.getenv("DEEPSEEK_API_URL", "https://api.deepseek.com/v1/chat/completions")

OUTPUT_DIR = Path(__file__).resolve().parents[1] / "output"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

deepseek = DeepSeekClient(api_key=DEEPSEEK_API_KEY, api_url=DEEPSEEK_API_URL)


@app.get("/health")
def health():
    return {"status": "ok", "phase": "phase-2"}


@app.post("/analyze", response_model=JobAnalysisResponse)
async def analyze_job(request: JobAnalysisRequest):
    try:
        return await deepseek.analyze_job_description(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/tailor-cv", response_model=CVTailorResponse)
async def tailor_cv(request: CVTailorRequest):
    try:
        if request.analysis is None:
            request.analysis = await deepseek.analyze_job_description(request.job)

        tailored_summary = ATSMirror.rewrite_summary(
            request.profile.summary or "", request.job, request.analysis
        )
        tailored_skills = ATSMirror.rewrite_skills(
            request.profile.skills or [], request.job, request.analysis
        )
        tailored_experience = ATSMirror.rewrite_experience(
            request.profile.experience or [], request.job, request.analysis
        )

        safe_name = request.profile.name.replace(" ", "_")
        safe_title = request.job.title.replace(" ", "_")
        output_filename = f"{safe_name}_{safe_title}.docx"
        output_path = OUTPUT_DIR / output_filename

        generate_cv_docx(
            profile=request.profile,
            summary=tailored_summary,
            skills=tailored_skills,
            experience=tailored_experience,
            education=request.profile.education,
            output_path=output_path,
        )

        return CVTailorResponse(
            summary=tailored_summary,
            skills=tailored_skills,
            experience=tailored_experience,
            education=request.profile.education,
            docx_path=str(output_path),
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/download/{filename}")
def download_cv(filename: str):
    safe_filename = Path(filename).name
    file_path = OUTPUT_DIR / safe_filename
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
