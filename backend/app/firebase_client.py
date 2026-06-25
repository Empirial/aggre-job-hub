"""
Firebase Admin SDK client.
Initializes once on startup. Falls back to in-memory store if no credentials provided
so the app runs locally without Firebase during development.

Collections:
  jobs/{jobId}                          — global scraped listings
  users/{uid}/profile                   — CV + personal info (single doc)
  users/{uid}/applications/{appId}      — per-user job applications
  users/{uid}/chatHistory/{sessionId}   — per-user chat sessions
  users/{uid}/cvDrafts/{draftId}        — per-user tailored CV snapshots
  users/{uid}/savedJobs/{jobId}         — per-user bookmarked jobs
"""
import os
import logging
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any

logger = logging.getLogger(__name__)

_db = None
_use_memory = False
_memory_store: Dict[str, Any] = {
    "jobs": {},
    # keyed by uid
    "users": {},
}

firebase_initialized: bool = False


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _user_mem(uid: str) -> Dict[str, Any]:
    """Return (creating if needed) the in-memory user bucket."""
    if uid not in _memory_store["users"]:
        _memory_store["users"][uid] = {
            "profile": {},
            "applications": {},
            "chatHistory": {},
            "cvDrafts": {},
            "savedJobs": {},
        }
    return _memory_store["users"][uid]


def init_firebase() -> None:
    global _db, _use_memory, firebase_initialized

    creds_json = os.getenv("FIREBASE_CREDENTIALS_JSON", "")
    creds_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "")

    if not creds_json and (not creds_path or not os.path.exists(creds_path)):
        logger.warning("No Firebase credentials found — using in-memory store. Data will NOT persist.")
        _use_memory = True
        return

    try:
        import json
        import base64
        import firebase_admin
        from firebase_admin import credentials, firestore

        if not firebase_admin._apps:
            if creds_json:
                cred = credentials.Certificate(json.loads(base64.b64decode(creds_json)))
            else:
                cred = credentials.Certificate(creds_path)
            firebase_admin.initialize_app(cred, {
                "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET", ""),
            })

        _db = firestore.client()
        firebase_initialized = True
        logger.info("Connected to Firestore.")
    except Exception as e:
        logger.error("Firebase init failed: %s — falling back to in-memory store.", e, exc_info=True)
        _use_memory = True


# ── Helpers ───────────────────────────────────────────────────────────────────

def _user_ref(uid: str):
    return _db.collection("users").document(uid)


# ── Global Jobs ───────────────────────────────────────────────────────────────

def save_job(job_data: Dict[str, Any]) -> str:
    job_id = job_data.get("id") or job_data.get("url", "")[:12]
    if _use_memory or _db is None:
        _memory_store["jobs"][job_id] = job_data
        return job_id
    _db.collection("jobs").document(job_id).set(job_data)
    return job_id


def get_jobs(limit: int = 50) -> List[Dict[str, Any]]:
    if _use_memory or _db is None:
        jobs = list(_memory_store["jobs"].values())
        return sorted(jobs, key=lambda j: j.get("created_at", ""), reverse=True)[:limit]
    docs = _db.collection("jobs").order_by("created_at", direction="DESCENDING").limit(limit).stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]


def get_job(job_id: str) -> Optional[Dict[str, Any]]:
    if _use_memory or _db is None:
        return _memory_store["jobs"].get(job_id)
    doc = _db.collection("jobs").document(job_id).get()
    return {"id": doc.id, **doc.to_dict()} if doc.exists else None


def update_job(job_id: str, data: Dict[str, Any]) -> None:
    if _use_memory or _db is None:
        if job_id in _memory_store["jobs"]:
            _memory_store["jobs"][job_id].update(data)
        return
    _db.collection("jobs").document(job_id).update(data)


def job_exists(url: str) -> bool:
    if _use_memory or _db is None:
        return any(j.get("url") == url for j in _memory_store["jobs"].values())
    docs = _db.collection("jobs").where("url", "==", url).limit(1).stream()
    return any(True for _ in docs)


# ── User Profile ──────────────────────────────────────────────────────────────

def get_profile(uid: str) -> Dict[str, Any]:
    if _use_memory or _db is None:
        return _user_mem(uid)["profile"]
    doc = _user_ref(uid).collection("profile").document("data").get()
    return doc.to_dict() or {} if doc.exists else {}


def save_profile(uid: str, profile: Dict[str, Any]) -> None:
    if _use_memory or _db is None:
        _user_mem(uid)["profile"] = profile
        return
    _user_ref(uid).collection("profile").document("data").set(profile)


# ── Per-user Applications ─────────────────────────────────────────────────────

def save_application(uid: str, app_data: Dict[str, Any]) -> str:
    app_id = app_data.get("id") or app_data.get("job_id", "")[:12]
    app_data.setdefault("created_at", _now())
    if _use_memory or _db is None:
        _user_mem(uid)["applications"][app_id] = app_data
        return app_id
    _user_ref(uid).collection("applications").document(app_id).set(app_data)
    return app_id


def get_applications(uid: str, limit: int = 100) -> List[Dict[str, Any]]:
    if _use_memory or _db is None:
        apps = list(_user_mem(uid)["applications"].values())
        return sorted(apps, key=lambda a: a.get("date_applied", ""), reverse=True)[:limit]
    docs = (
        _user_ref(uid)
        .collection("applications")
        .order_by("date_applied", direction="DESCENDING")
        .limit(limit)
        .stream()
    )
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]


def update_application(uid: str, app_id: str, data: Dict[str, Any]) -> None:
    if _use_memory or _db is None:
        bucket = _user_mem(uid)["applications"]
        if app_id in bucket:
            bucket[app_id].update(data)
        return
    _user_ref(uid).collection("applications").document(app_id).update(data)


# ── Chat History ──────────────────────────────────────────────────────────────

def save_chat_session(uid: str, session_id: str, messages: List[Dict[str, Any]]) -> None:
    """Persist a full chat session (list of {role, content, timestamp})."""
    payload = {
        "session_id": session_id,
        "messages": messages,
        "updated_at": _now(),
    }
    if _use_memory or _db is None:
        _user_mem(uid)["chatHistory"][session_id] = payload
        return
    _user_ref(uid).collection("chatHistory").document(session_id).set(payload)


def get_chat_session(uid: str, session_id: str) -> Optional[Dict[str, Any]]:
    if _use_memory or _db is None:
        return _user_mem(uid)["chatHistory"].get(session_id)
    doc = _user_ref(uid).collection("chatHistory").document(session_id).get()
    return doc.to_dict() if doc.exists else None


def list_chat_sessions(uid: str, limit: int = 20) -> List[Dict[str, Any]]:
    if _use_memory or _db is None:
        sessions = list(_user_mem(uid)["chatHistory"].values())
        return sorted(sessions, key=lambda s: s.get("updated_at", ""), reverse=True)[:limit]
    docs = (
        _user_ref(uid)
        .collection("chatHistory")
        .order_by("updated_at", direction="DESCENDING")
        .limit(limit)
        .stream()
    )
    return [doc.to_dict() for doc in docs]


def delete_chat_session(uid: str, session_id: str) -> None:
    if _use_memory or _db is None:
        _user_mem(uid)["chatHistory"].pop(session_id, None)
        return
    _user_ref(uid).collection("chatHistory").document(session_id).delete()


# ── CV Drafts ─────────────────────────────────────────────────────────────────

def save_cv_draft(uid: str, draft_id: str, draft: Dict[str, Any]) -> str:
    draft.setdefault("created_at", _now())
    draft["draft_id"] = draft_id
    if _use_memory or _db is None:
        _user_mem(uid)["cvDrafts"][draft_id] = draft
        return draft_id
    _user_ref(uid).collection("cvDrafts").document(draft_id).set(draft)
    return draft_id


def get_cv_drafts(uid: str, limit: int = 20) -> List[Dict[str, Any]]:
    if _use_memory or _db is None:
        drafts = list(_user_mem(uid)["cvDrafts"].values())
        return sorted(drafts, key=lambda d: d.get("created_at", ""), reverse=True)[:limit]
    docs = (
        _user_ref(uid)
        .collection("cvDrafts")
        .order_by("created_at", direction="DESCENDING")
        .limit(limit)
        .stream()
    )
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]


def delete_cv_draft(uid: str, draft_id: str) -> None:
    if _use_memory or _db is None:
        _user_mem(uid)["cvDrafts"].pop(draft_id, None)
        return
    _user_ref(uid).collection("cvDrafts").document(draft_id).delete()


# ── Saved Jobs ────────────────────────────────────────────────────────────────

def save_job_bookmark(uid: str, job_id: str, job_data: Dict[str, Any]) -> None:
    payload = {**job_data, "job_id": job_id, "saved_at": _now()}
    if _use_memory or _db is None:
        _user_mem(uid)["savedJobs"][job_id] = payload
        return
    _user_ref(uid).collection("savedJobs").document(job_id).set(payload)


def remove_job_bookmark(uid: str, job_id: str) -> None:
    if _use_memory or _db is None:
        _user_mem(uid)["savedJobs"].pop(job_id, None)
        return
    _user_ref(uid).collection("savedJobs").document(job_id).delete()


def get_saved_jobs(uid: str) -> List[Dict[str, Any]]:
    if _use_memory or _db is None:
        saved = list(_user_mem(uid)["savedJobs"].values())
        return sorted(saved, key=lambda j: j.get("saved_at", ""), reverse=True)
    docs = (
        _user_ref(uid)
        .collection("savedJobs")
        .order_by("saved_at", direction="DESCENDING")
        .stream()
    )
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]


def is_job_saved(uid: str, job_id: str) -> bool:
    if _use_memory or _db is None:
        return job_id in _user_mem(uid)["savedJobs"]
    doc = _user_ref(uid).collection("savedJobs").document(job_id).get()
    return doc.exists


# ── User Context snapshot (for AI chat) ───────────────────────────────────────

def get_user_context(uid: str) -> Dict[str, Any]:
    """Load a lightweight snapshot of everything the AI needs to know about the user."""
    profile = get_profile(uid)
    applications = get_applications(uid, limit=10)
    saved_jobs = get_saved_jobs(uid)
    cv_drafts = get_cv_drafts(uid, limit=5)
    recent_jobs = get_jobs(limit=10)

    return {
        "profile": profile,
        "applications": applications,
        "saved_jobs": saved_jobs,
        "cv_drafts": cv_drafts,
        "recent_scraped_jobs": recent_jobs,
    }
