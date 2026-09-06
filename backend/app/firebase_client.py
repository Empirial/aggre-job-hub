"""
Firebase Admin SDK client.
Initializes once on startup. Falls back to in-memory store if no credentials provided
so the app runs locally without Firebase during development.

Collections:
  jobs/{jobId}                            — global scraped listings
  users/{uid}/profile                     — CV + personal info (single doc)
  users/{uid}/chatHistory/{sessionId}     — per-user chat sessions
  users/{uid}/cvDrafts/{draftId}          — per-user tailored CV snapshots
  users/{uid}/savedJobs/{jobId}           — per-user bookmarked jobs
  users/{uid}/profileDocuments/{docId}    — per-user uploaded document metadata
                                             (file bytes live in Firebase Storage
                                             under users/{uid}/documents/{docId}{ext})
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
            "chatHistory": {},
            "cvDrafts": {},
            "savedJobs": {},
            "profileDocuments": {},
        }
    return _memory_store["users"][uid]


def init_firebase() -> None:
    global _db, _use_memory, firebase_initialized

    creds_json = os.getenv("FIREBASE_CREDENTIALS_JSON", "")
    creds_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "")
    # On Google Cloud Run / GCE the runtime service account is picked up
    # automatically via Application Default Credentials — no key file needed.
    use_adc = bool(
        os.getenv("K_SERVICE")
        or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        or os.getenv("GOOGLE_CLOUD_PROJECT")
    )

    if not creds_json and (not creds_path or not os.path.exists(creds_path)) and not use_adc:
        logger.warning("No Firebase credentials found — using in-memory store. Data will NOT persist.")
        _use_memory = True
        return

    try:
        import json
        import base64
        import firebase_admin
        from firebase_admin import credentials, firestore

        if not firebase_admin._apps:
            options = {"storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET", "")}
            project_id = os.getenv("GOOGLE_CLOUD_PROJECT") or os.getenv("FIREBASE_PROJECT_ID")
            if project_id:
                options["projectId"] = project_id

            if creds_json:
                cred = credentials.Certificate(json.loads(base64.b64decode(creds_json)))
            elif creds_path and os.path.exists(creds_path):
                cred = credentials.Certificate(creds_path)
            else:
                cred = credentials.ApplicationDefault()
                logger.info("Using Application Default Credentials (Cloud Run service account).")

            firebase_admin.initialize_app(cred, options)

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


# ── Profile Documents (Firebase Storage + metadata) ───────────────────────────

_memory_blobs: Dict[str, bytes] = {}


def _storage_bucket():
    from firebase_admin import storage
    return storage.bucket()


def upload_profile_document_blob(storage_path: str, content: bytes, content_type: str) -> None:
    if _use_memory or _db is None:
        _memory_blobs[storage_path] = content
        return
    blob = _storage_bucket().blob(storage_path)
    blob.upload_from_string(content, content_type=content_type)


def delete_profile_document_blob(storage_path: str) -> None:
    if _use_memory or _db is None:
        _memory_blobs.pop(storage_path, None)
        return
    blob = _storage_bucket().blob(storage_path)
    if blob.exists():
        blob.delete()


def save_profile_document(uid: str, doc_id: str, data: Dict[str, Any]) -> None:
    data.setdefault("created_at", _now())
    if _use_memory or _db is None:
        _user_mem(uid)["profileDocuments"][doc_id] = data
        return
    _user_ref(uid).collection("profileDocuments").document(doc_id).set(data)


def get_profile_documents(uid: str) -> List[Dict[str, Any]]:
    if _use_memory or _db is None:
        docs = list(_user_mem(uid)["profileDocuments"].values())
        return sorted(docs, key=lambda d: d.get("created_at", ""), reverse=True)
    docs = (
        _user_ref(uid)
        .collection("profileDocuments")
        .order_by("created_at", direction="DESCENDING")
        .stream()
    )
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]


def get_profile_document(uid: str, doc_id: str) -> Optional[Dict[str, Any]]:
    if _use_memory or _db is None:
        return _user_mem(uid)["profileDocuments"].get(doc_id)
    doc = _user_ref(uid).collection("profileDocuments").document(doc_id).get()
    return {"id": doc.id, **doc.to_dict()} if doc.exists else None


def delete_profile_document(uid: str, doc_id: str) -> Optional[Dict[str, Any]]:
    if _use_memory or _db is None:
        return _user_mem(uid)["profileDocuments"].pop(doc_id, None)
    ref = _user_ref(uid).collection("profileDocuments").document(doc_id)
    snap = ref.get()
    data = snap.to_dict() if snap.exists else None
    ref.delete()
    return data


def download_profile_document_blob(storage_path: str) -> bytes:
    if _use_memory or _db is None:
        return _memory_blobs.get(storage_path, b"")
    blob = _storage_bucket().blob(storage_path)
    return blob.download_as_bytes()


# ── User Context snapshot (for AI chat) ───────────────────────────────────────

def get_user_context(uid: str) -> Dict[str, Any]:
    """Load a lightweight snapshot of everything the AI needs to know about the user."""
    profile = get_profile(uid)
    saved_jobs = get_saved_jobs(uid)
    cv_drafts = get_cv_drafts(uid, limit=5)
    recent_jobs = get_jobs(limit=10)
    profile_documents = get_profile_documents(uid)

    return {
        "profile": profile,
        "saved_jobs": saved_jobs,
        "cv_drafts": cv_drafts,
        "recent_scraped_jobs": recent_jobs,
        "profile_documents": profile_documents,
    }


# ── Third-party integrations (Gmail OAuth tokens, etc.) ───────────────────────

def save_integration(uid: str, name: str, data: Dict[str, Any]) -> None:
    """Persist an integration record (e.g. Gmail OAuth tokens) for a user."""
    payload = {**data, "updated_at": _now()}
    if _use_memory or _db is None:
        _user_mem(uid).setdefault("integrations", {})[name] = payload
        return
    _user_ref(uid).collection("integrations").document(name).set(payload)


def get_integration(uid: str, name: str) -> Optional[Dict[str, Any]]:
    if _use_memory or _db is None:
        return _user_mem(uid).get("integrations", {}).get(name)
    doc = _user_ref(uid).collection("integrations").document(name).get()
    return doc.to_dict() if doc.exists else None


def delete_integration(uid: str, name: str) -> None:
    if _use_memory or _db is None:
        _user_mem(uid).get("integrations", {}).pop(name, None)
        return
    _user_ref(uid).collection("integrations").document(name).delete()
