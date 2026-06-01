import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse

from app.ai.deepseek_client import DeepSeekClient
from app.cv.ats_mirror import ATSMirror
from app.cv.docx_generator import generate_cv_docx
from app.models import CVTailorRequest, CVTailorResponse, JobAnalysisRequest, JobAnalysisResponse

app = FastAPI(title="Aggre Job Hub Backend", version="0.1.0")

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_API_URL = os.getenv("DEEPSEEK_API_URL", "https://api.deepseek.ai/v1/chat/completions")

OUTPUT_DIR = Path(__file__).resolve().parents[1] / "output"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

deepseek = DeepSeekClient(api_key=DEEPSEEK_API_KEY, api_url=DEEPSEEK_API_URL)


@app.get("/health")
def health():
    return {"status": "ok", "phase": "phase-1-backend"}


@app.post("/analyze", response_model=JobAnalysisResponse)
async def analyze_job(request: JobAnalysisRequest):
    try:
        analysis = await deepseek.analyze_job_description(request)
        return analysis
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/tailor-cv", response_model=CVTailorResponse)
async def tailor_cv(request: CVTailorRequest):
    try:
        if request.analysis is None:
            request.analysis = await deepseek.analyze_job_description(request.job)

        tailored_summary = ATSMirror.rewrite_summary(request.profile.summary or "", request.job, request.analysis)
        tailored_skills = ATSMirror.rewrite_skills(request.profile.skills or [], request.job, request.analysis)
        tailored_experience = ATSMirror.rewrite_experience(request.profile.experience or [], request.job, request.analysis)

        output_filename = f"{request.profile.name.replace(' ', '_')}_{request.job.title.replace(' ', '_')}.docx"
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
            docx_path=str(output_path.relative_to(Path.cwd())),
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/download/{filename}")
def download_cv(filename: str):
    file_path = OUTPUT_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="CV file not found")
    return FileResponse(path=file_path, filename=filename, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
