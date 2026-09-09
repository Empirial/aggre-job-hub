import logging
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from app.models import ManualJobRequest, ScrapedJob, ScrapeRequest, ScrapeResponse
from app.scraper.dpsa import DPSAScraper
from app.scraper.base import make_job_id
from app.limiter import limiter
from app.auth import require_auth
from app import firebase_client as db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/jobs", tags=["jobs"])

# Government-only by design: DPSA circulars carry every national and provincial
# department (Sports, Arts & Culture; Agriculture; Health; Basic Education...).
# Private-company boards are intentionally not scraped.
scrapers = {
    "dpsa": DPSAScraper(),
}


@router.get("", response_model=List[ScrapedJob])
@limiter.limit("60/minute")
def list_jobs(request: Request, limit: int = Query(default=50, le=200), uid: str = Depends(require_auth)):
    try:
        raw = db.get_jobs(limit=limit)
        return [ScrapedJob(**j) for j in raw]
    except Exception as e:
        logger.error("list_jobs failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="An internal error occurred")


@router.get("/public", response_model=List[ScrapedJob])
@limiter.limit("60/minute")
def list_public_jobs(request: Request, limit: int = Query(default=200, le=500)):
    """Open feed for the landing page — no sign-in required."""
    try:
        raw = db.get_jobs(limit=limit)
        return [ScrapedJob(**j) for j in raw]
    except Exception as e:
        logger.error("list_public_jobs failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="An internal error occurred")


@router.get("/{job_id}", response_model=ScrapedJob)
@limiter.limit("60/minute")
def get_job(request: Request, job_id: str, uid: str = Depends(require_auth)):
    job = db.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return ScrapedJob(**job)


@router.post("/manual", response_model=ScrapedJob)
@limiter.limit("20/minute")
def add_manual_job(request: Request, body: ManualJobRequest, uid: str = Depends(require_auth)):
    url = body.url or f"manual://{uid}/{datetime.now(timezone.utc).timestamp()}"
    job = ScrapedJob(
        id=make_job_id(url),
        title=body.title,
        company=body.company,
        location=body.location,
        description=body.description,
        url=url,
        source="manual",
        date_posted=datetime.now(timezone.utc).date().isoformat(),
    )
    try:
        job_id = db.save_job(job.model_dump())
        saved = db.get_job(job_id)
        return ScrapedJob(**saved) if saved else job
    except Exception as e:
        logger.error("add_manual_job failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="An internal error occurred")


# How long a fresh scrape is considered good for everyone on the site.
SCRAPE_FRESH_HOURS = 12
# If a scrape started less than this many minutes ago, assume it is still running.
SCRAPE_LOCK_MINUTES = 10


def _hours_since(iso: str | None) -> float:
    if not iso:
        return 1e9
    try:
        then = datetime.fromisoformat(iso)
        if then.tzinfo is None:
            then = then.replace(tzinfo=timezone.utc)
    except ValueError:
        return 1e9
    return (datetime.now(timezone.utc) - then).total_seconds() / 3600


@router.post("/scrape", response_model=ScrapeResponse)
@limiter.limit("10/minute")
async def scrape_jobs(request: Request, body: ScrapeRequest, uid: str = Depends(require_auth)):
    # Shared across all users: if someone already refreshed recently (or is
    # refreshing right now), just hand back what is already in the database.
    state = {}
    try:
        state = db.get_scrape_state() or {}
    except Exception as e:
        logger.warning("could not read scrape state: %s", e)

    if not body.force:
        since_done = _hours_since(state.get("last_completed_at"))
        since_start = _hours_since(state.get("last_started_at"))
        in_progress = bool(state.get("in_progress")) and since_start < SCRAPE_LOCK_MINUTES / 60
        if since_done < SCRAPE_FRESH_HOURS or in_progress:
            cached = [ScrapedJob(**j) for j in db.get_jobs(limit=250)]
            return ScrapeResponse(
                scraped=0,
                saved=0,
                jobs=cached,
                cached=True,
                last_updated=state.get("last_completed_at"),
            )

    started_at = datetime.now(timezone.utc).isoformat()
    try:
        db.set_scrape_state({"in_progress": True, "last_started_at": started_at})
    except Exception as e:
        logger.warning("could not set scrape state: %s", e)

    all_jobs: List[ScrapedJob] = []


    for source, scraper in scrapers.items():
        try:
            # One DPSA circular carries every national + provincial department,
            # so it gets a much larger budget than the per-board scrapers.
            limit = max(body.max_per_source, 250) if source == "dpsa" else body.max_per_source
            jobs = await scraper.scrape(
                keywords=body.keywords,
                location=body.location,
                max_results=limit,
            )
            all_jobs.extend(jobs)
            logger.info("[%s] scraped %d jobs", source, len(jobs))
        except Exception as e:
            logger.error("[%s] scraper error: %s", source, e, exc_info=True)

    saved = 0
    for job in all_jobs:
        if not db.job_exists(job.url):
            db.save_job(job.model_dump())
            saved += 1

    return ScrapeResponse(
        scraped=len(all_jobs),
        saved=saved,
        jobs=all_jobs,
    )
