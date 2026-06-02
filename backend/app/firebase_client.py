"""
Firebase Admin SDK client.
Initializes once on startup. Falls back to in-memory store if no credentials provided
so the app runs locally without Firebase during development.
"""
import os
from typing import List, Optional, Dict, Any

_db = None
_use_memory = False
_memory_store: Dict[str, Dict[str, Any]] = {"jobs": {}, "applications": {}, "userProfile": {}}


def init_firebase() -> None:
    global _db, _use_memory

    # Support credentials as inline JSON env var (fly.io free tier)
    creds_json = os.getenv("FIREBASE_CREDENTIALS_JSON", "")
    creds_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "")

    if not creds_json and (not creds_path or not os.path.exists(creds_path)):
        print("[Firebase] No credentials found — using in-memory store (dev mode).")
        _use_memory = True
        return

    try:
        import json
        import firebase_admin
        from firebase_admin import credentials, firestore

        if not firebase_admin._apps:
            if creds_json:
                cred = credentials.Certificate(json.loads(creds_json))
            else:
                cred = credentials.Certificate(creds_path)
            firebase_admin.initialize_app(cred, {
                "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET", ""),
            })

        _db = firestore.client()
        print("[Firebase] Connected to Firestore.")
    except Exception as e:
        print(f"[Firebase] Init failed: {e} — falling back to in-memory store.")
        _use_memory = True


# ── Jobs ──────────────────────────────────────────────────────────────────────

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
    """Deduplicate by URL before saving."""
    if _use_memory or _db is None:
        return any(j.get("url") == url for j in _memory_store["jobs"].values())
    docs = _db.collection("jobs").where("url", "==", url).limit(1).stream()
    return any(True for _ in docs)


# ── Applications ──────────────────────────────────────────────────────────────

def save_application(app_data: Dict[str, Any]) -> str:
    app_id = app_data.get("id") or app_data.get("job_id", "")[:12]
    if _use_memory or _db is None:
        _memory_store["applications"][app_id] = app_data
        return app_id
    _db.collection("applications").document(app_id).set(app_data)
    return app_id


def get_applications(limit: int = 100) -> List[Dict[str, Any]]:
    if _use_memory or _db is None:
        apps = list(_memory_store["applications"].values())
        return sorted(apps, key=lambda a: a.get("date_applied", ""), reverse=True)[:limit]
    docs = _db.collection("applications").order_by("date_applied", direction="DESCENDING").limit(limit).stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]


def update_application(app_id: str, data: Dict[str, Any]) -> None:
    if _use_memory or _db is None:
        if app_id in _memory_store["applications"]:
            _memory_store["applications"][app_id].update(data)
        return
    _db.collection("applications").document(app_id).update(data)
