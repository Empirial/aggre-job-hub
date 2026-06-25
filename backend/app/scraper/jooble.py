"""
Jooble scraper — real SA listings via the Jooble Jobs API.

Sign up at https://jooble.org/api/about (free tier: 500 req/day).
Set in environment:
    JOOBLE_API_KEY=your_api_key
"""
import os
import logging
from typing import List
import httpx
from app.models import ScrapedJob
from app.scraper.base import BaseScraper, make_job_id, clean_text

logger = logging.getLogger(__name__)

JOOBLE_BASE = "https://jooble.org/api"


class JooblesScraper(BaseScraper):
    source = "jooble"

    def __init__(self):
        self.api_key = os.getenv("JOOBLE_API_KEY", "")

    @property
    def _configured(self) -> bool:
        return bool(self.api_key)

    async def scrape(self, keywords: List[str], location: str, max_results: int) -> List[ScrapedJob]:
        if not self._configured:
            logger.warning("[Jooble] JOOBLE_API_KEY not set — skipping.")
            return []

        payload = {
            "keywords": " ".join(keywords),
            "location": location,
            "page": "1",
            "ResultsOnPage": min(max_results, 20),
        }

        try:
            async with httpx.AsyncClient(timeout=20) as client:
                resp = await client.post(
                    f"{JOOBLE_BASE}/{self.api_key}",
                    json=payload,
                    headers={"Content-Type": "application/json"},
                )
                resp.raise_for_status()
                data = resp.json()
        except Exception as e:
            logger.error("[Jooble] API request failed: %s", e)
            return []

        jobs: List[ScrapedJob] = []
        for item in data.get("jobs", [])[:max_results]:
            try:
                job_url = item.get("link", "")
                title = clean_text(item.get("title", "Unknown Title"))
                company = clean_text(item.get("company", "Unknown Company"))
                loc = clean_text(item.get("location", location))
                description = clean_text(item.get("snippet", ""))
                date_posted = item.get("updated", "")[:10]

                jobs.append(ScrapedJob(
                    id=make_job_id(job_url or title + company),
                    title=title,
                    company=company,
                    location=loc,
                    description=description or f"{title} at {company}.",
                    url=job_url,
                    source="jooble",
                    date_posted=date_posted,
                ))
            except Exception:
                continue

        logger.info("[Jooble] Fetched %d jobs", len(jobs))
        return jobs
