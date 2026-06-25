import hashlib
import logging
from pathlib import Path
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request
from app.models import Application, SendApplicationRequest
from app.ai.deepseek_client import DeepSeekClient
from app.cv.ats_mirror import ATSMirror
from app.cv.docx_generator import generate_cv_docx
from app.email_sender.sender import send_application
from app.models import JobAnalysisRequest
from app.limiter import limiter
from app.auth import require_auth
from app import firebase_client as db
import os
import re

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/applications", tags=["applications"])

OUTPUT_DIR = Path(__file__).resolve().parents[2] / "output"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")


@router.get("", response_model=List[Application])
def list_applications(uid: str = Depends(require_auth)):
    try:
        raw = db.get_applications(uid)
        return [Application(**a) for a in raw]
    except Exception as e:
        logger.error("list_applications failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="An internal error occurred")


@router.post("/send", response_model=Application)
@limiter.limit("5/minute")
async def send_job_application(request: Request, body: SendApplicationRequest, uid: str = Depends(require_auth)):
    job_data = db.get_job(body.job_id)
    if not job_data:
        raise HTTPException(status_code=404, detail=f"Job {body.job_id} not found")

    client = DeepSeekClient(api_key=DEEPSEEK_API_KEY)
    job_req = JobAnalysisRequest(
        title=job_data["title"],
        company=job_data.get("company"),
        location=job_data.get("location"),
        description=job_data["description"],
    )
    analysis = await client.analyze_job_description(job_req)

    summary = ATSMirror.rewrite_summary(body.profile.summary or "", job_req, analysis)
    skills = ATSMirror.rewrite_skills(body.profile.skills, job_req, analysis)
    experience = await client.rewrite_experience(body.profile, analysis)

    safe_name = re.sub(r'[^\w\-]', '_', body.profile.name)
    safe_title = re.sub(r'[^\w\-]', '_', job_data["title"])
    filename = f"{safe_name}_{safe_title}.docx"
    cv_path = OUTPUT_DIR / filename

    generate_cv_docx(
        profile=body.profile,
        summary=summary,
        skills=skills,
        experience=experience,
        education=body.profile.education,
        output_path=cv_path,
    )

    result = send_application(
        recipient_email=body.recipient_email,
        applicant_name=body.profile.name,
        job_title=job_data["title"],
        company=job_data.get("company", ""),
        cv_path=cv_path,
        cover_note=body.cover_note,
    )

    status = "sent" if result["success"] else "pending"
    if not result["success"]:
        logger.warning("Email send failed: %s", result.get("error"))

    app_id = hashlib.md5(f"{body.job_id}{body.profile.email}".encode()).hexdigest()[:12]
    application = Application(
        id=app_id,
        job_id=body.job_id,
        job_title=job_data["title"],
        company=job_data.get("company", ""),
        status=status,
        cv_path=str(cv_path),
        recipient_email=body.recipient_email,
    )
    db.save_application(uid, application.model_dump())
    db.update_job(body.job_id, {"cv_generated": True})

    return application
