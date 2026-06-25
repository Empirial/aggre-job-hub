"""
The Muse scraper — tech/startup roles, good for remote-friendly positions.

Free API, no key required for basic access (100 req/hour).
Optional: set THEMUSE_API_KEY for higher rate limits.
API docs: https://www.themuse.com/developers/api/v2
"""
import os
import logging
from typing import List
import httpx
from app.models import ScrapedJob
from app.scraper.base import BaseScraper, make_job_id, clean_text

logger = logging.getLogger(__name__)

THEMUSE_BASE = "https://www.themuse.com/api/public/jobs"


class TheMuseScraper(BaseScraper):
    source = "themuse"

    def __init__(self):
        self.api_key = os.getenv("THEMUSE_API_KEY", "")

    async def scrape(self, keywords: List[str], location: str, max_results: int) -> List[ScrapedJob]:
        # The Muse doesn't support keyword search directly — filter by category
        # Map common keywords to Muse job categories
        category = self._map_category(keywords)

        params: dict = {
            "page": 0,
            "descending": "true",
        }
        if category:
            params["category"] = category
        if self.api_key:
            params["api_key"] = self.api_key

        try:
            async with httpx.AsyncClient(timeout=20) as client:
                resp = await client.get(THEMUSE_BASE, params=params)
                resp.raise_for_status()
                data = resp.json()
        except Exception as e:
            logger.error("[TheMuse] API request failed: %s", e)
            return []

        keyword_set = {k.lower() for k in keywords}
        jobs: List[ScrapedJob] = []

        for item in data.get("results", []):
            if len(jobs) >= max_results:
                break
            try:
                title = clean_text(item.get("name", "Unknown Title"))
                # Filter by keyword relevance — Muse has no server-side keyword filter
                if not any(k in title.lower() for k in keyword_set):
                    continue

                company = clean_text(
                    item.get("company", {}).get("name", "Unknown Company")
                    if isinstance(item.get("company"), dict) else "Unknown Company"
                )

                locations = item.get("locations", [])
                loc = clean_text(
                    ", ".join(l.get("name", "") for l in locations) if locations else "Remote"
                )

                job_url = item.get("refs", {}).get("landing_page", "")
                contents = item.get("contents", "")
                # Strip HTML tags from description
                import re
                description = clean_text(re.sub(r"<[^>]+>", " ", contents))[:500]

                date_posted = item.get("publication_date", "")[:10]
                levels = item.get("levels", [])
                level = levels[0].get("name", "") if levels else ""

                full_title = f"{title} ({level})" if level else title

                jobs.append(ScrapedJob(
                    id=make_job_id(job_url or title + company),
                    title=full_title,
                    company=company,
                    location=loc or "Remote",
                    description=description or f"{title} at {company}.",
                    url=job_url,
                    source="themuse",
                    date_posted=date_posted,
                ))
            except Exception:
                continue

        logger.info("[TheMuse] Fetched %d jobs", len(jobs))
        return jobs

    def _map_category(self, keywords: List[str]) -> str:
        kw = " ".join(keywords).lower()
        if any(w in kw for w in ["engineer", "developer", "software", "python", "react", "backend", "frontend", "fullstack", "full stack"]):
            return "Software Engineer"
        if any(w in kw for w in ["data", "analyst", "analytics", "bi", "ml", "machine learning"]):
            return "Data Science"
        if any(w in kw for w in ["design", "ui", "ux"]):
            return "Design & UX"
        if any(w in kw for w in ["product", "manager", "pm"]):
            return "Product"
        if any(w in kw for w in ["devops", "cloud", "infra", "sre"]):
            return "IT"
        return "Software Engineer"
