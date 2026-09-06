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


@router.post("/scrape", response_model=ScrapeResponse)
@limiter.limit("10/minute")
async def scrape_jobs(request: Request, body: ScrapeRequest, uid: str = Depends(require_auth)):
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
