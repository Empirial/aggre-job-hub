import hashlib
from pathlib import Path
from typing import List
from fastapi import APIRouter, HTTPException
from app.models import Application, SendApplicationRequest
from app.ai.deepseek_client import DeepSeekClient
from app.cv.ats_mirror import ATSMirror
from app.cv.docx_generator import generate_cv_docx
from app.email_sender.sender import send_application
from app.models import JobAnalysisRequest
from app import firebase_client as db
import os

router = APIRouter(prefix="/applications", tags=["applications"])

OUTPUT_DIR = Path(__file__).resolve().parents[2] / "output"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")


@router.get("", response_model=List[Application])
def list_applications():
    try:
        raw = db.get_applications()
        return [Application(**a) for a in raw]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/send", response_model=Application)
async def send_job_application(request: SendApplicationRequest):
    # 1. Fetch job from store
    job_data = db.get_job(request.job_id)
    if not job_data:
        raise HTTPException(status_code=404, detail=f"Job {request.job_id} not found")

    # 2. Analyze JD with DeepSeek
    client = DeepSeekClient(api_key=DEEPSEEK_API_KEY)
    job_req = JobAnalysisRequest(
        title=job_data["title"],
        company=job_data.get("company"),
        location=job_data.get("location"),
        description=job_data["description"],
    )
    analysis = await client.analyze_job_description(job_req)

    # 3. Tailor CV
    summary = ATSMirror.rewrite_summary(request.profile.summary or "", job_req, analysis)
    skills = ATSMirror.rewrite_skills(request.profile.skills, job_req, analysis)
    experience = await client.rewrite_experience(request.profile, analysis)

    # 4. Generate .docx
    safe_name = request.profile.name.replace(" ", "_")
    safe_title = job_data["title"].replace(" ", "_")
    filename = f"{safe_name}_{safe_title}.docx"
    cv_path = OUTPUT_DIR / filename

    generate_cv_docx(
        profile=request.profile,
        summary=summary,
        skills=skills,
        experience=experience,
        education=request.profile.education,
        output_path=cv_path,
    )

    # 5. Send email
    result = send_application(
        recipient_email=request.recipient_email,
        applicant_name=request.profile.name,
        job_title=job_data["title"],
        company=job_data.get("company", ""),
        cv_path=cv_path,
        cover_note=request.cover_note,
    )

    status = "sent" if result["success"] else "pending"
    if not result["success"]:
        print(f"[Email] Send failed: {result['error']}")

    # 6. Save application record
    app_id = hashlib.md5(f"{request.job_id}{request.profile.email}".encode()).hexdigest()[:12]
    application = Application(
        id=app_id,
        job_id=request.job_id,
        job_title=job_data["title"],
        company=job_data.get("company", ""),
        status=status,
        cv_path=str(cv_path),
        recipient_email=request.recipient_email,
    )
    db.save_application(application.model_dump())

    # 7. Mark job as cv_generated
    db.update_job(request.job_id, {"cv_generated": True})

    return application
