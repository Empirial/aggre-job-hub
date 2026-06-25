"""
Reed.co.uk scraper — covers remote/international roles posted by SA employers.

Register at https://www.reed.co.uk/developers/jobseeker (free).
Set in environment:
    REED_API_KEY=your_api_key
"""
import os
import logging
from typing import List
import httpx
from app.models import ScrapedJob
from app.scraper.base import BaseScraper, make_job_id, clean_text

logger = logging.getLogger(__name__)

REED_BASE = "https://www.reed.co.uk/api/1.0/search"
REED_JOB_BASE = "https://www.reed.co.uk/jobs"


class ReedScraper(BaseScraper):
    source = "reed"

    def __init__(self):
        self.api_key = os.getenv("REED_API_KEY", "")

    @property
    def _configured(self) -> bool:
        return bool(self.api_key)

    async def scrape(self, keywords: List[str], location: str, max_results: int) -> List[ScrapedJob]:
        if not self._configured:
            logger.warning("[Reed] REED_API_KEY not set — skipping.")
            return []

        params = {
            "keywords": " ".join(keywords),
            "locationName": location,
            "resultsToTake": min(max_results, 100),
            "resultsToSkip": 0,
        }

        try:
            async with httpx.AsyncClient(timeout=20) as client:
                resp = await client.get(
                    REED_BASE,
                    params=params,
                    auth=(self.api_key, ""),  # Reed uses API key as Basic auth username
                )
                resp.raise_for_status()
                data = resp.json()
        except Exception as e:
            logger.error("[Reed] API request failed: %s", e)
            return []

        jobs: List[ScrapedJob] = []
        for item in data.get("results", [])[:max_results]:
            try:
                job_id = item.get("jobId", "")
                job_url = item.get("jobUrl") or (f"{REED_JOB_BASE}/{job_id}" if job_id else "")
                title = clean_text(item.get("jobTitle", "Unknown Title"))
                company = clean_text(item.get("employerName", "Unknown Company"))
                loc = clean_text(item.get("locationName", location))
                description = clean_text(item.get("jobDescription", ""))
                date_posted = str(item.get("date", ""))[:10]
                salary = item.get("minimumSalary")
                salary_max = item.get("maximumSalary")

                if salary and salary_max:
                    description = f"Salary: R{salary:,.0f}–R{salary_max:,.0f}. {description}"

                jobs.append(ScrapedJob(
                    id=make_job_id(job_url or title + company),
                    title=title,
                    company=company,
                    location=loc,
                    description=description or f"{title} at {company}.",
                    url=job_url,
                    source="reed",
                    date_posted=date_posted,
                ))
            except Exception:
                continue

        logger.info("[Reed] Fetched %d jobs", len(jobs))
        return jobs
