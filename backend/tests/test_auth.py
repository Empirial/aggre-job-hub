"""
Tests for app.auth — the fail-closed-on-Cloud-Run behavior is the single
highest-stakes piece of logic in this codebase (see MVP review §04-05).
"""
import pytest
from fastapi import HTTPException
from starlette.requests import Request

from app import auth as auth_module


def make_request(headers: dict | None = None, client_host: str = "203.0.113.7") -> Request:
    headers = headers or {}
    scope = {
        "type": "http",
        "headers": [(k.lower().encode(), v.encode()) for k, v in headers.items()],
        "client": (client_host, 12345),
    }
    return Request(scope)


# ── require_auth: local dev (genuine, no Cloud Run signal) ────────────────────

async def test_local_dev_without_firebase_returns_dev_user(monkeypatch):
    monkeypatch.setattr(auth_module, "firebase_initialized", False)
    monkeypatch.delenv("K_SERVICE", raising=False)

    uid = await auth_module.require_auth(authorization="")
    assert uid == "local-dev-user"


# ── require_auth: the fail-closed fix itself ──────────────────────────────────

async def test_uninitialized_firebase_on_cloud_run_fails_closed(monkeypatch):
    """This is the actual security fix from the MVP review: a Cloud Run
    deployment with broken Firebase must refuse requests, not silently let
    them through as an unauthenticated dev user."""
    monkeypatch.setattr(auth_module, "firebase_initialized", False)
    monkeypatch.setenv("K_SERVICE", "careergate-api")

    with pytest.raises(HTTPException) as exc:
        await auth_module.require_auth(authorization="")
    assert exc.value.status_code == 503


# ── require_auth: normal token verification ───────────────────────────────────

async def test_missing_bearer_token_is_401(monkeypatch):
    monkeypatch.setattr(auth_module, "firebase_initialized", True)

    with pytest.raises(HTTPException) as exc:
        await auth_module.require_auth(authorization="")
    assert exc.value.status_code == 401


async def test_invalid_token_is_401(monkeypatch):
    monkeypatch.setattr(auth_module, "firebase_initialized", True)
    monkeypatch.setattr(
        auth_module.firebase_auth, "verify_id_token",
        lambda token: (_ for _ in ()).throw(ValueError("bad token")),
    )

    with pytest.raises(HTTPException) as exc:
        await auth_module.require_auth(authorization="Bearer not-a-real-token")
    assert exc.value.status_code == 401


async def test_valid_token_returns_uid(monkeypatch):
    monkeypatch.setattr(auth_module, "firebase_initialized", True)
    monkeypatch.setattr(
        auth_module.firebase_auth, "verify_id_token",
        lambda token: {"uid": "real-user-42"},
    )

    uid = await auth_module.require_auth(authorization="Bearer some-valid-token")
    assert uid == "real-user-42"


# ── require_auth: demo-mode bypass must stay gone ─────────────────────────────

async def test_demo_mode_header_no_longer_bypasses_auth(monkeypatch):
    """Regression test: the demo-mode bypass was removed entirely. Sending the
    old header must not grant access — require_auth doesn't even accept an
    x_demo_mode parameter any more, so this just confirms a request with no
    real token still gets rejected."""
    monkeypatch.setattr(auth_module, "firebase_initialized", True)

    with pytest.raises(HTTPException) as exc:
        await auth_module.require_auth(authorization="")
    assert exc.value.status_code == 401
    assert "x_demo_mode" not in auth_module.require_auth.__code__.co_varnames


# ── rate_limit_key: per-account, falling back to IP ───────────────────────────

def test_rate_limit_key_uses_uid_for_authenticated_requests(monkeypatch):
    monkeypatch.setattr(auth_module, "firebase_initialized", True)
    monkeypatch.setattr(
        auth_module.firebase_auth, "verify_id_token",
        lambda token: {"uid": "user-99"},
    )
    request = make_request({"authorization": "Bearer some-token"})

    assert auth_module.rate_limit_key(request) == "uid:user-99"


def test_rate_limit_key_falls_back_to_ip_when_unauthenticated(monkeypatch):
    monkeypatch.setattr(auth_module, "firebase_initialized", True)
    request = make_request({})  # no Authorization header at all

    key = auth_module.rate_limit_key(request)
    assert key == "203.0.113.7"


def test_rate_limit_key_falls_back_to_ip_on_invalid_token(monkeypatch):
    monkeypatch.setattr(auth_module, "firebase_initialized", True)
    monkeypatch.setattr(
        auth_module.firebase_auth, "verify_id_token",
        lambda token: (_ for _ in ()).throw(ValueError("expired")),
    )
    request = make_request({"authorization": "Bearer garbage"})

    key = auth_module.rate_limit_key(request)
    assert key == "203.0.113.7"
