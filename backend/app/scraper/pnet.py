"""
PNet ZA scraper.
PNet is a Next.js app — job data is embedded in __NEXT_DATA__ JSON on the
search results page, so no headless browser is needed.
Falls back to BeautifulSoup. Returns no results (never mock data) if both
strategies fail.
"""
import json
import re
import urllib.parse
from typing import List
from bs4 import BeautifulSoup
from app.models import ScrapedJob
from app.scraper.base import BaseScraper, make_job_id, clean_text
import logging

logger = logging.getLogger(__name__)


class PNetScraper(BaseScraper):
    source = "pnet"
    base_url = "https://www.pnet.co.za"
    timeout = 20

    async def scrape(self, keywords: List[str], location: str, max_results: int) -> List[ScrapedJob]:
        # PNet search URL format
        slug = "-".join(k.lower().replace(" ", "-") for k in keywords[:2])
        url = f"{self.base_url}/jobs/{slug}/south-africa/"

        try:
            html = await self.fetch(url)
        except Exception as e:
            logger.warning("[PNet] Fetch failed: %s", e)
            return []

        # Try __NEXT_DATA__ first (Next.js SSR)
        jobs = self._parse_next_data(html, max_results)
        if jobs:
            return jobs

        # Try BeautifulSoup
        jobs = self._parse_soup(html, max_results, location)
        if jobs:
            return jobs

        logger.warning("[PNet] All parse strategies failed — returning no results.")
        return []

    def _parse_next_data(self, html: str, max_results: int) -> List[ScrapedJob]:
        """Extract jobs from Next.js __NEXT_DATA__ script tag."""
        match = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.DOTALL)
        if not match:
            return []

        try:
            data = json.loads(match.group(1))
        except json.JSONDecodeError:
            return []

        # Navigate PNet's Next.js page props — structure may vary
        page_props = (
            data.get("props", {})
            .get("pageProps", {})
        )

        # Try common locations for job arrays in PNet's data
        job_list = (
            page_props.get("jobs")
            or page_props.get("jobListings")
            or page_props.get("searchResults", {}).get("jobs")
            or page_props.get("data", {}).get("jobs")
            or []
        )

        if not job_list:
            # Try deeper nesting
            for key in page_props:
                val = page_props[key]
                if isinstance(val, dict):
                    for subkey in val:
                        if isinstance(val[subkey], list) and len(val[subkey]) > 0:
                            first = val[subkey][0]
                            if isinstance(first, dict) and ("title" in first or "jobTitle" in first):
                                job_list = val[subkey]
                                break

        if not job_list:
            return []

        jobs: List[ScrapedJob] = []
        for item in job_list[:max_results]:
            try:
                title = clean_text(
                    item.get("title") or item.get("jobTitle") or item.get("name") or "Unknown Title"
                )
                company = clean_text(
                    item.get("company") or item.get("companyName") or item.get("advertiser", {}).get("name", "Unknown Company")
                    if isinstance(item.get("advertiser"), dict) else item.get("advertiser", "Unknown Company")
                )
                loc = clean_text(
                    item.get("location") or item.get("locationName") or item.get("city") or "South Africa"
                )
                description = clean_text(
                    item.get("description") or item.get("snippet") or item.get("summary") or ""
                )
                href = item.get("url") or item.get("href") or item.get("applyUrl") or ""
                job_url = href if href.startswith("http") else f"{self.base_url}{href}"
                date_posted = item.get("datePosted") or item.get("date") or ""

                jobs.append(ScrapedJob(
                    id=make_job_id(job_url or title + company),
                    title=title,
                    company=company,
                    location=loc,
                    description=description or f"{title} at {company} in {loc}.",
                    url=job_url,
                    source="pnet",
                    date_posted=date_posted,
                ))
            except Exception:
                continue

        logger.info("[PNet] __NEXT_DATA__ parse yielded %d jobs", len(jobs))
        return jobs

    def _parse_soup(self, html: str, max_results: int, location: str) -> List[ScrapedJob]:
        """BeautifulSoup fallback for server-side rendered cards."""
        soup = BeautifulSoup(html, "html.parser")

        # Try multiple card selectors PNet has used over time
        cards = (
            soup.select("article.job-card")
            or soup.select("div[data-testid='job-card']")
            or soup.select("div.search-result")
            or soup.select("li[data-job-id]")
            or soup.select("div.jobResult")
        )

        if not cards:
            return []

        jobs: List[ScrapedJob] = []
        for card in cards[:max_results]:
            try:
                title_el = card.select_one("h2, h3, .job-title, [data-testid='job-title']")
                company_el = card.select_one(".company-name, .employer, [data-testid='company-name']")
                location_el = card.select_one(".location, .job-location, [data-testid='location']")
                link_el = card.select_one("a[href]")
                desc_el = card.select_one(".description, .snippet, [data-testid='snippet']")

                title = clean_text(title_el.get_text()) if title_el else "Unknown Title"
                company = clean_text(company_el.get_text()) if company_el else "Unknown Company"
                location_text = clean_text(location_el.get_text()) if location_el else location
                description = clean_text(desc_el.get_text()) if desc_el else f"{title} at {company}."
                href = link_el.get("href", "") if link_el else ""
                job_url = f"{self.base_url}{href}" if href.startswith("/") else href

                jobs.append(ScrapedJob(
                    id=make_job_id(job_url or title + company),
                    title=title,
                    company=company,
                    location=location_text,
                    description=description,
                    url=job_url,
                    source="pnet",
                ))
            except Exception:
                continue

        logger.info("[PNet] soup parse yielded %d jobs", len(jobs))
        return jobs
