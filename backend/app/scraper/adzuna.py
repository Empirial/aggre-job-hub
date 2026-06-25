"""
Adzuna job scraper — real SA listings via the Adzuna Jobs API.

Sign up at https://developer.adzuna.com/ (free, 250 req/day).
Set in environment:
    ADZUNA_APP_ID=your_app_id
    ADZUNA_APP_KEY=your_app_key
"""
import os
import logging
from typing import List
import httpx
from app.models import ScrapedJob
from app.scraper.base import BaseScraper, make_job_id, clean_text

logger = logging.getLogger(__name__)

ADZUNA_BASE = "https://api.adzuna.com/v1/api/jobs/za/search"


class AdzunaScraper(BaseScraper):
    source = "adzuna"

    def __init__(self):
        self.app_id = os.getenv("ADZUNA_APP_ID", "")
        self.app_key = os.getenv("ADZUNA_APP_KEY", "")

    @property
    def _configured(self) -> bool:
        return bool(self.app_id and self.app_key)

    async def scrape(self, keywords: List[str], location: str, max_results: int) -> List[ScrapedJob]:
        if not self._configured:
            logger.warning("[Adzuna] ADZUNA_APP_ID / ADZUNA_APP_KEY not set — skipping.")
            return []

        query = " ".join(keywords)
        params = {
            "app_id": self.app_id,
            "app_key": self.app_key,
            "what": query,
            "where": location,
            "results_per_page": min(max_results, 50),
            "content-type": "application/json",
            "sort_by": "date",
        }

        try:
            async with httpx.AsyncClient(timeout=20) as client:
                resp = await client.get(f"{ADZUNA_BASE}/1", params=params)
                resp.raise_for_status()
                data = resp.json()
        except Exception as e:
            logger.error("[Adzuna] API request failed: %s", e)
            return []

        jobs: List[ScrapedJob] = []
        for result in data.get("results", [])[:max_results]:
            try:
                job_url = result.get("redirect_url", "")
                title = clean_text(result.get("title", "Unknown Title"))
                company = clean_text(
                    result.get("company", {}).get("display_name", "Unknown Company")
                )
                loc = clean_text(
                    result.get("location", {}).get("display_name", location)
                )
                description = clean_text(result.get("description", ""))
                date_posted = result.get("created", "")[:10]  # ISO date

                # Adzuna descriptions can be truncated — append a note
                if description and not description.endswith("."):
                    description += "."

                jobs.append(
                    ScrapedJob(
                        id=make_job_id(job_url or title + company),
                        title=title,
                        company=company,
                        location=loc,
                        description=description,
                        url=job_url,
                        source="adzuna",
                        date_posted=date_posted,
                    )
                )
            except Exception as e:
                logger.warning("[Adzuna] Failed to parse result: %s", e)
                continue

        logger.info("[Adzuna] Fetched %d real jobs for '%s' in '%s'", len(jobs), query, location)
        return jobs
