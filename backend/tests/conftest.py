"""
Shared test fixtures.

Tests run with no Firebase credentials and no K_SERVICE set, so the app
starts in local-dev mode (in-memory store) — the same "genuine local
development" path require_auth and firebase_client already special-case.
"""
import os
import pytest


@pytest.fixture(autouse=True)
def _clean_cloud_run_env(monkeypatch):
    """Every test starts from a clean slate: not on Cloud Run, no real
    Firebase creds — matching a fresh CI checkout."""
    for var in (
        "K_SERVICE",
        "GOOGLE_APPLICATION_CREDENTIALS",
        "GOOGLE_CLOUD_PROJECT",
        "FIREBASE_CREDENTIALS_JSON",
        "FIREBASE_CREDENTIALS_PATH",
    ):
        monkeypatch.delenv(var, raising=False)


@pytest.fixture(autouse=True)
def _reset_memory_store():
    """The in-memory Firestore fallback is a module-level dict, shared by
    every test in the process — without this, jobs saved in one test file
    leak into another's /jobs/public response and fail validation there."""
    from app import firebase_client as fc

    fc._memory_store["jobs"].clear()
    fc._memory_store["users"].clear()
    fc._memory_store.pop("scrape_state", None)
    yield
    fc._memory_store["jobs"].clear()
    fc._memory_store["users"].clear()
    fc._memory_store.pop("scrape_state", None)


@pytest.fixture
def client():
    """A TestClient for the full app, imported lazily so the env fixture above
    is already active before app.main (and its lifespan) ever runs."""
    from fastapi.testclient import TestClient
    from app.main import app

    with TestClient(app) as c:
        yield c
