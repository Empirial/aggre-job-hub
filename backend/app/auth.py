"""
Firebase ID token verification dependency for FastAPI.
Frontend must send: Authorization: Bearer <firebase_id_token>
"""
import os
import logging
from fastapi import Header, HTTPException, Request, status
from firebase_admin import auth as firebase_auth
from slowapi.util import get_remote_address
from app.firebase_client import firebase_initialized

logger = logging.getLogger(__name__)

def _on_cloud_run() -> bool:
    """Cloud Run sets K_SERVICE automatically — used to tell "really deployed"
    apart from a developer running the backend locally with no Firebase
    credentials set up. A function (not a module-level constant) so tests can
    monkeypatch the env var without needing to reimport this module."""
    return bool(os.getenv("K_SERVICE"))


async def require_auth(
    authorization: str = Header(default=""),
) -> str:
    """Returns the verified Firebase uid, or raises 401/503."""
    if not firebase_initialized:
        if _on_cloud_run():
            # Firebase Admin failed to initialize on a real deployment — this is a
            # misconfiguration (bad ADC/service account), not a green light to let
            # every request through unauthenticated. Fail closed and make noise.
            logger.error("require_auth: Firebase Admin not initialized on Cloud Run — rejecting request")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Auth service unavailable",
            )
        # Genuine local development with no Firebase credentials configured.
        return "local-dev-user"

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


def rate_limit_key(request: Request) -> str:
    """Rate-limit by account, not IP, so the limit follows the user rather than
    their network. Falls back to IP for unauthenticated/invalid-token requests
    (e.g. the public jobs feed, or a request that's about to 401 anyway)."""
    authorization = request.headers.get("authorization", "")
    if authorization.startswith("Bearer ") and firebase_initialized:
        try:
            decoded = firebase_auth.verify_id_token(authorization.removeprefix("Bearer ").strip())
            return f"uid:{decoded['uid']}"
        except Exception:
            pass
    return get_remote_address(request)
