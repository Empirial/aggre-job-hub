"""
Gmail integration — lets Zara create a ready-to-send draft in the user's own
Gmail account with the tailored CV attached.

Flow:
  1. POST /gmail/auth-url  -> Google consent URL (server builds it, client id stays server-side)
  2. Google redirects back to the app with ?code=...
  3. POST /gmail/exchange  -> swaps the code for tokens, stores the refresh token per user
  4. POST /gmail/draft     -> builds a MIME message (+ PDF attachment) and creates a Gmail DRAFT

Drafts only. We never send mail on the user's behalf — they review and hit send.
Requires GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET in the environment.
"""
import base64
import logging
import os
import secrets
from email.message import EmailMessage
from typing import List, Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field

from app.auth import require_auth
from app.limiter import limiter
from app import firebase_client as db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/gmail", tags=["gmail"])

INTEGRATION = "gmail"
AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token"
USERINFO_ENDPOINT = "https://www.googleapis.com/oauth2/v2/userinfo"
DRAFTS_ENDPOINT = "https://gmail.googleapis.com/gmail/v1/users/me/drafts"

SCOPES = [
    "https://www.googleapis.com/auth/gmail.compose",
    "https://www.googleapis.com/auth/userinfo.email",
]


def _client_id() -> str:
    return os.getenv("GOOGLE_OAUTH_CLIENT_ID", "").strip()


def _client_secret() -> str:
    return os.getenv("GOOGLE_OAUTH_CLIENT_SECRET", "").strip()


def _require_config() -> None:
    if not _client_id() or not _client_secret():
        raise HTTPException(
            status_code=503,
            detail="Gmail is not configured on the server yet (missing Google OAuth client).",
        )


# ── Models ────────────────────────────────────────────────────────────────────

class AuthUrlRequest(BaseModel):
    redirect_uri: str = Field(max_length=500)


class ExchangeRequest(BaseModel):
    code: str = Field(max_length=1000)
    redirect_uri: str = Field(max_length=500)


class DraftRequest(BaseModel):
    to: str = Field(default="", max_length=320)
    subject: str = Field(max_length=300)
    body: str = Field(max_length=20000)
    cc: List[str] = Field(default_factory=list)
    attachment_filename: Optional[str] = Field(default=None, max_length=200)
    attachment_base64: Optional[str] = Field(default=None, max_length=14_000_000)


# ── OAuth ─────────────────────────────────────────────────────────────────────

@router.get("/status")
async def status(uid: str = Depends(require_auth)):
    record = db.get_integration(uid, INTEGRATION) or {}
    return {
        "configured": bool(_client_id() and _client_secret()),
        "connected": bool(record.get("refresh_token")),
        "email": record.get("email", ""),
        "connected_at": record.get("updated_at", ""),
    }


@router.post("/auth-url")
@limiter.limit("20/minute")
async def auth_url(request: Request, body: AuthUrlRequest, uid: str = Depends(require_auth)):
    _require_config()
    params = {
        "client_id": _client_id(),
        "redirect_uri": body.redirect_uri,
        "response_type": "code",
        "scope": " ".join(SCOPES),
        "access_type": "offline",
        "prompt": "consent",
        "include_granted_scopes": "true",
        "state": secrets.token_urlsafe(16),
    }
    return {"url": f"{AUTH_ENDPOINT}?{httpx.QueryParams(params)}", "state": params["state"]}


@router.post("/exchange")
@limiter.limit("20/minute")
async def exchange(request: Request, body: ExchangeRequest, uid: str = Depends(require_auth)):
    _require_config()
    async with httpx.AsyncClient(timeout=30) as client:
        res = await client.post(TOKEN_ENDPOINT, data={
            "code": body.code,
            "client_id": _client_id(),
            "client_secret": _client_secret(),
            "redirect_uri": body.redirect_uri,
            "grant_type": "authorization_code",
        })
        if res.status_code >= 400:
            logger.error("Gmail token exchange failed [%s]: %s", res.status_code, res.text)
            raise HTTPException(status_code=400, detail="Google rejected the sign-in. Please try connecting again.")
        tokens = res.json()

        email = ""
        try:
            me = await client.get(USERINFO_ENDPOINT, headers={"Authorization": f"Bearer {tokens.get('access_token','')}"})
            if me.status_code < 400:
                email = me.json().get("email", "")
        except Exception:
            pass

    refresh_token = tokens.get("refresh_token")
    if not refresh_token:
        existing = db.get_integration(uid, INTEGRATION) or {}
        refresh_token = existing.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=400,
            detail="Google did not return a refresh token. Remove CareerGate from your Google account permissions and connect again.",
        )

    db.save_integration(uid, INTEGRATION, {"refresh_token": refresh_token, "email": email})
    return {"status": "connected", "email": email}


@router.delete("/disconnect")
async def disconnect(uid: str = Depends(require_auth)):
    db.delete_integration(uid, INTEGRATION)
    return {"status": "disconnected"}


async def _access_token(uid: str) -> str:
    record = db.get_integration(uid, INTEGRATION) or {}
    refresh_token = record.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=428, detail="Gmail is not connected for this account.")

    async with httpx.AsyncClient(timeout=30) as client:
        res = await client.post(TOKEN_ENDPOINT, data={
            "refresh_token": refresh_token,
            "client_id": _client_id(),
            "client_secret": _client_secret(),
            "grant_type": "refresh_token",
        })
    if res.status_code >= 400:
        logger.error("Gmail refresh failed [%s]: %s", res.status_code, res.text)
        db.delete_integration(uid, INTEGRATION)
        raise HTTPException(status_code=428, detail="Gmail access expired. Please reconnect your Gmail account.")
    return res.json().get("access_token", "")


# ── Drafts ────────────────────────────────────────────────────────────────────

@router.post("/draft")
@limiter.limit("20/minute")
async def create_draft(request: Request, body: DraftRequest, uid: str = Depends(require_auth)):
    _require_config()
    token = await _access_token(uid)

    message = EmailMessage()
    if body.to:
        message["To"] = body.to
    if body.cc:
        message["Cc"] = ", ".join(body.cc[:10])
    message["Subject"] = body.subject
    message.set_content(body.body)

    if body.attachment_base64 and body.attachment_filename:
        try:
            raw = base64.b64decode(body.attachment_base64)
        except Exception:
            raise HTTPException(status_code=400, detail="Attachment could not be read.")
        if len(raw) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Attachment is larger than 10MB.")
        subtype = "pdf" if body.attachment_filename.lower().endswith(".pdf") else "octet-stream"
        message.add_attachment(raw, maintype="application", subtype=subtype, filename=body.attachment_filename)

    encoded = base64.urlsafe_b64encode(message.as_bytes()).decode()

    async with httpx.AsyncClient(timeout=60) as client:
        res = await client.post(
            DRAFTS_ENDPOINT,
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            json={"message": {"raw": encoded}},
        )
    if res.status_code >= 400:
        logger.error("Gmail draft failed [%s]: %s", res.status_code, res.text)
        raise HTTPException(status_code=res.status_code, detail=f"Gmail rejected the draft: {res.text[:300]}")

    data = res.json()
    draft_id = data.get("id", "")
    return {
        "status": "draft_created",
        "draft_id": draft_id,
        "gmail_url": f"https://mail.google.com/mail/u/0/#drafts?compose={data.get('message', {}).get('id', draft_id)}",
    }
