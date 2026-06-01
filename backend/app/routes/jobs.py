from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.models import ScrapedJob, ScrapeRequest, ScrapeResponse
from app.scraper.indeed import IndeedScraper
from app.scraper.pnet import PNetScraper
from app.scraper.linkedin import LinkedInScraper
from app import firebase_client as db

router = APIRouter(prefix="/jobs", tags=["jobs"])

scrapers = {
    "indeed": IndeedScraper(),
    "pnet": PNetScraper(),
    "linkedin": LinkedInScraper(),
}


@router.get("", response_model=List[ScrapedJob])
def list_jobs(limit: int = Query(default=50, le=200)):
    try:
        raw = db.get_jobs(limit=limit)
        return [ScrapedJob(**j) for j in raw]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{job_id}", response_model=ScrapedJob)
def get_job(job_id: str):
    job = db.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return ScrapedJob(**job)


@router.post("/scrape", response_model=ScrapeResponse)
async def scrape_jobs(request: ScrapeRequest):
    all_jobs: List[ScrapedJob] = []

    for source, scraper in scrapers.items():
        try:
            jobs = await scraper.scrape(
                keywords=request.keywords,
                location=request.location,
                max_results=request.max_per_source,
            )
            all_jobs.extend(jobs)
            print(f"[{source}] scraped {len(jobs)} jobs")
        except Exception as e:
            print(f"[{source}] scraper error: {e}")

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
