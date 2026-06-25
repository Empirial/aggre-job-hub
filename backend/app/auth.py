"""
Firebase ID token verification dependency for FastAPI.
Frontend must send: Authorization: Bearer <firebase_id_token>
Demo mode: send X-Demo-Mode: true header instead of a token.
"""
import os
from fastapi import Header, HTTPException, status
from firebase_admin import auth as firebase_auth
from app.firebase_client import firebase_initialized

DEMO_ENABLED = os.getenv("DEMO_MODE_ENABLED", "true").lower() == "true"


async def require_auth(
    authorization: str = Header(default=""),
    x_demo_mode: str = Header(default=""),
) -> str:
    """Returns the verified Firebase uid, or raises 401."""
    if not firebase_initialized:
        return "local-dev-user"

    if DEMO_ENABLED and x_demo_mode.lower() == "true":
        return "demo-user"

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing auth token",
        )

    token = authorization.removeprefix("Bearer ").strip()
    try:
        decoded = firebase_auth.verify_id_token(token)
        return decoded["uid"]
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
