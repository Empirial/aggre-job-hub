import logging
from typing import Any, Dict, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.auth import require_auth
from app import firebase_client as db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/profile", tags=["profile"])


class ProfilePayload(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    linkedin: str = ""
    summary: str = ""
    skills: List[str] = []
    experience: List[str] = []
    education: str = ""
    keywords: List[str] = []
    locations: List[str] = []
    jobTypes: Dict[str, bool] = {}


class CVDraftPayload(BaseModel):
    draft_id: str
    job_id: str = ""
    job_title: str = ""
    summary: str = ""
    skills: List[str] = []
    experience: List[str] = []
    education: str = ""


@router.get("")
def get_profile(uid: str = Depends(require_auth)):
    try:
        return db.get_profile(uid)
    except Exception as e:
        logger.error("get_profile failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch profile")


@router.post("")
def save_profile(body: ProfilePayload, uid: str = Depends(require_auth)):
    try:
        db.save_profile(uid, body.model_dump())
        return {"status": "saved"}
    except Exception as e:
        logger.error("save_profile failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to save profile")


# ── CV Drafts ─────────────────────────────────────────────────────────────────

@router.get("/cv-drafts")
def list_cv_drafts(uid: str = Depends(require_auth)):
    try:
        return db.get_cv_drafts(uid)
    except Exception as e:
        logger.error("list_cv_drafts failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch CV drafts")


@router.post("/cv-drafts")
def save_cv_draft(body: CVDraftPayload, uid: str = Depends(require_auth)):
    try:
        db.save_cv_draft(uid, body.draft_id, body.model_dump())
        return {"status": "saved", "draft_id": body.draft_id}
    except Exception as e:
        logger.error("save_cv_draft failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to save CV draft")


@router.delete("/cv-drafts/{draft_id}")
def delete_cv_draft(draft_id: str, uid: str = Depends(require_auth)):
    try:
        db.delete_cv_draft(uid, draft_id)
        return {"status": "deleted"}
    except Exception as e:
        logger.error("delete_cv_draft failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to delete CV draft")


# ── Saved Jobs ────────────────────────────────────────────────────────────────

@router.get("/saved-jobs")
def list_saved_jobs(uid: str = Depends(require_auth)):
    try:
        return db.get_saved_jobs(uid)
    except Exception as e:
        logger.error("list_saved_jobs failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch saved jobs")


@router.post("/saved-jobs/{job_id}")
def bookmark_job(job_id: str, uid: str = Depends(require_auth)):
    try:
        job = db.get_job(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        db.save_job_bookmark(uid, job_id, job)
        return {"status": "saved"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error("bookmark_job failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to save job")


@router.delete("/saved-jobs/{job_id}")
def remove_bookmark(job_id: str, uid: str = Depends(require_auth)):
    try:
        db.remove_job_bookmark(uid, job_id)
        return {"status": "removed"}
    except Exception as e:
        logger.error("remove_bookmark failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to remove bookmark")


@router.get("/saved-jobs/{job_id}/status")
def check_bookmark(job_id: str, uid: str = Depends(require_auth)):
    return {"saved": db.is_job_saved(uid, job_id)}
