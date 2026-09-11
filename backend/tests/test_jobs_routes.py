"""
Tests for app.routes.jobs — in particular the shared/broadcast scrape model
(see MVP review §04 item 4: "runs while you sleep" is a shared on-demand
scrape, not a per-user or cron-dependent one). The DPSA scraper itself is
monkeypatched here so these tests never touch the real network — that's
covered separately in test_dpsa_scraper.py against real-format fixture text.
"""
from datetime import datetime, timedelta, timezone

from app.models import ScrapedJob
from app.routes import jobs as jobs_router


def make_job(n: int) -> ScrapedJob:
    return ScrapedJob(
        id=f"job-{n}",
        title=f"Test Post {n}",
        company="Department of Testing",
        location="Gauteng: Pretoria",
        description="A test vacancy.",
        url=f"https://www.dpsa.gov.za/test-{n}.pdf",
        source="dpsa",
    )


async def _fake_scrape(*, keywords, location, max_results):
    return [make_job(1), make_job(2)]


def test_public_feed_needs_no_auth(client):
    res = client.get("/jobs/public")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_manual_job_can_be_added_and_fetched(client):
    res = client.post("/jobs/manual", json={
        "title": "Data Capturer",
        "company": "Department of Home Affairs",
        "location": "Western Cape: Cape Town",
        "description": "Capture data accurately.",
    })
    assert res.status_code == 200
    job_id = res.json()["id"]

    fetched = client.get(f"/jobs/{job_id}")
    assert fetched.status_code == 200
    assert fetched.json()["title"] == "Data Capturer"
    assert fetched.json()["source"] == "manual"


def test_scrape_returns_cached_data_within_the_freshness_window(client, monkeypatch):
    """A scrape from a few hours ago should be served from cache to the next
    caller — nobody re-scrapes just because they clicked the button too."""
    from app import firebase_client as db

    monkeypatch.setattr(jobs_router.scrapers["dpsa"], "scrape", _fake_scrape)
    recent = (datetime.now(timezone.utc) - timedelta(hours=2)).isoformat()
    db.set_scrape_state({"in_progress": False, "last_completed_at": recent})

    def fail_if_called(*a, **k):
        raise AssertionError("scraper.scrape should not run inside the freshness window")
    monkeypatch.setattr(jobs_router.scrapers["dpsa"], "scrape", fail_if_called)

    res = client.post("/jobs/scrape", json={"keywords": [], "location": "South Africa"})
    assert res.status_code == 200
    assert res.json()["cached"] is True


def test_scrape_runs_when_stale(client, monkeypatch):
    """Past the freshness window (DPSA circulars are weekly), the next caller
    should trigger a real scrape and get fresh results."""
    from app import firebase_client as db

    monkeypatch.setattr(jobs_router.scrapers["dpsa"], "scrape", _fake_scrape)
    stale = (datetime.now(timezone.utc) - timedelta(days=30)).isoformat()
    db.set_scrape_state({"in_progress": False, "last_completed_at": stale})

    res = client.post("/jobs/scrape", json={"keywords": [], "location": "South Africa"})
    assert res.status_code == 200
    body = res.json()
    assert body["cached"] is False
    assert body["saved"] >= 1


def test_scrape_force_bypasses_the_cache(client, monkeypatch):
    from app import firebase_client as db

    recent = datetime.now(timezone.utc).isoformat()
    db.set_scrape_state({"in_progress": False, "last_completed_at": recent})
    monkeypatch.setattr(jobs_router.scrapers["dpsa"], "scrape", _fake_scrape)

    res = client.post("/jobs/scrape", json={"keywords": [], "location": "South Africa", "force": True})
    assert res.status_code == 200
    assert res.json()["cached"] is False
