"""
CareerJet scraper — SA listings via the CareerJet public API.

Register your affiliate ID at https://www.careerjet.co.za/partners/
Set in environment:
    CAREERJET_AFFID=your_affiliate_id

No API key required — affid is your identifier.
"""
import os
import logging
import urllib.parse
from typing import List
import httpx
from app.models import ScrapedJob
from app.scraper.base import BaseScraper, make_job_id, clean_text

logger = logging.getLogger(__name__)

CAREERJET_BASE = "http://public.api.careerjet.net/search"


class CareerJetScraper(BaseScraper):
    source = "careerjet"

    def __init__(self):
        self.affid = os.getenv("CAREERJET_AFFID", "")

    @property
    def _configured(self) -> bool:
        return bool(self.affid)

    async def scrape(self, keywords: List[str], location: str, max_results: int) -> List[ScrapedJob]:
        if not self._configured:
            logger.warning("[CareerJet] CAREERJET_AFFID not set — skipping.")
            return []

        params = {
            "locale_code": "en_ZA",
            "affid": self.affid,
            "keywords": " ".join(keywords),
            "location": location,
            "pagesize": min(max_results, 20),
            "page": 1,
            "sort": "date",
        }

        try:
            async with httpx.AsyncClient(timeout=20) as client:
                resp = await client.get(CAREERJET_BASE, params=params)
                resp.raise_for_status()
                data = resp.json()
        except Exception as e:
            logger.error("[CareerJet] API request failed: %s", e)
            return []

        if data.get("type") != "JOBS":
            logger.warning("[CareerJet] Unexpected response type: %s", data.get("type"))
            return []

        jobs: List[ScrapedJob] = []
        for item in data.get("jobs", [])[:max_results]:
            try:
                job_url = item.get("url", "")
                title = clean_text(item.get("title", "Unknown Title"))
                company = clean_text(item.get("company", "Unknown Company"))
                loc = clean_text(item.get("locations", location))
                description = clean_text(item.get("description", ""))
                date_posted = item.get("date", "")

                jobs.append(ScrapedJob(
                    id=make_job_id(job_url or title + company),
                    title=title,
                    company=company,
                    location=loc,
                    description=description or f"{title} at {company}.",
                    url=job_url,
                    source="careerjet",
                    date_posted=date_posted,
                ))
            except Exception:
                continue

        logger.info("[CareerJet] Fetched %d jobs", len(jobs))
        return jobs
