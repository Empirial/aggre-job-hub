"""
Tests for app.firebase_client.init_firebase — the other half of the
fail-closed-on-Cloud-Run fix (see MVP review §04-05). Mirrors test_auth.py's
coverage of the same pattern applied to the database layer instead of auth.
"""
import pytest

from app import firebase_client as fc


@pytest.fixture(autouse=True)
def _reset_module_state():
    """init_firebase mutates module globals — reset them around every test."""
    before = (fc._db, fc._use_memory, fc.firebase_initialized)
    yield
    fc._db, fc._use_memory, fc.firebase_initialized = before


def test_local_dev_without_credentials_uses_memory_store(monkeypatch):
    monkeypatch.delenv("K_SERVICE", raising=False)
    monkeypatch.delenv("GOOGLE_APPLICATION_CREDENTIALS", raising=False)
    monkeypatch.delenv("GOOGLE_CLOUD_PROJECT", raising=False)
    monkeypatch.delenv("FIREBASE_CREDENTIALS_JSON", raising=False)
    monkeypatch.delenv("FIREBASE_CREDENTIALS_PATH", raising=False)

    fc.init_firebase()

    assert fc._use_memory is True
    assert fc.firebase_initialized is False


def test_missing_credentials_on_cloud_run_refuses_to_start(monkeypatch):
    """The actual fix: no credentials + K_SERVICE set must raise, not silently
    fall back to a per-instance in-memory store that forgets everything on
    restart."""
    monkeypatch.setenv("K_SERVICE", "careergate-api")
    monkeypatch.delenv("GOOGLE_APPLICATION_CREDENTIALS", raising=False)
    monkeypatch.delenv("GOOGLE_CLOUD_PROJECT", raising=False)
    monkeypatch.delenv("FIREBASE_CREDENTIALS_JSON", raising=False)
    monkeypatch.delenv("FIREBASE_CREDENTIALS_PATH", raising=False)

    with pytest.raises(RuntimeError):
        fc.init_firebase()


def test_save_and_get_job_round_trips_in_memory_store(monkeypatch):
    monkeypatch.delenv("K_SERVICE", raising=False)
    fc.init_firebase()  # ensure memory mode

    job_id = fc.save_job({"id": "job-1", "title": "Data Clerk", "url": "https://x/job-1", "created_at": "2026-01-01"})
    fetched = fc.get_job(job_id)

    assert fetched is not None
    assert fetched["title"] == "Data Clerk"
    assert fc.job_exists("https://x/job-1") is True
    assert fc.job_exists("https://x/does-not-exist") is False
