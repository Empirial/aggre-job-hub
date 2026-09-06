"""
Indeed ZA scraper.
Extracts job data from the embedded window.mosaic JSON that Indeed injects
into its HTML for server-side rendering — avoids needing a headless browser.
Falls back to BeautifulSoup card parsing. Returns no results (never mock data)
if both strategies fail — Indeed frequently blocks scrapers.
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


class IndeedScraper(BaseScraper):
    source = "indeed"
    base_url = "https://za.indeed.com"
    timeout = 20

    async def scrape(self, keywords: List[str], location: str, max_results: int) -> List[ScrapedJob]:
        query = urllib.parse.quote_plus(" ".join(keywords))
        loc = urllib.parse.quote_plus(location)
        url = f"{self.base_url}/jobs?q={query}&l={loc}&sort=date&fromage=14"

        try:
            html = await self.fetch(url)
        except Exception as e:
            logger.warning("[Indeed] Fetch failed: %s", e)
            return []

        # Try embedded mosaic JSON first
        jobs = self._parse_mosaic(html, max_results)
        if jobs:
            return jobs

        # Try BeautifulSoup card parsing
        jobs = self._parse_soup(html, max_results)
        if jobs:
            return jobs

        logger.warning("[Indeed] All parse strategies failed — returning no results.")
        return []

    def _parse_mosaic(self, html: str, max_results: int) -> List[ScrapedJob]:
        """Extract jobs from Indeed's window.mosaic embedded JSON."""
        match = re.search(
            r'window\.mosaic\.providerData\["mosaic-provider-jobcards"\]\s*=\s*(\{.*?\});',
            html,
            re.DOTALL,
        )
        if not match:
            return []

        try:
            data = json.loads(match.group(1))
            results = (
                data.get("metaData", {})
                .get("mosaicProviderJobCardsModel", {})
                .get("results", [])
            )
        except (json.JSONDecodeError, KeyError):
            return []

        jobs: List[ScrapedJob] = []
        for r in results[:max_results]:
            try:
                job_key = r.get("jobkey", "")
                job_url = f"{self.base_url}/rc/clk?jk={job_key}" if job_key else ""
                title = clean_text(r.get("title", "Unknown Title"))
                company = clean_text(r.get("company", "Unknown Company"))
                loc = clean_text(r.get("formattedLocation", "South Africa"))
                snippet = clean_text(r.get("snippet", ""))
                date_posted = r.get("pubDate", "")

                jobs.append(ScrapedJob(
                    id=make_job_id(job_url or title + company),
                    title=title,
                    company=company,
                    location=loc,
                    description=snippet or f"{title} at {company}.",
                    url=job_url,
                    source="indeed",
                    date_posted=date_posted,
                ))
            except Exception:
                continue

        logger.info("[Indeed] mosaic parse yielded %d jobs", len(jobs))
        return jobs

    def _parse_soup(self, html: str, max_results: int) -> List[ScrapedJob]:
        """BeautifulSoup fallback — works when Indeed serves plain HTML."""
        soup = BeautifulSoup(html, "html.parser")
        cards = soup.select("div.job_seen_beacon, div[data-testid='jobCard'], li.css-5lfssm")
        if not cards:
            return []

        jobs: List[ScrapedJob] = []
        for card in cards[:max_results]:
            try:
                title_el = card.select_one("h2.jobTitle span[title], h2.jobTitle span, a[data-testid='job-title']")
                company_el = card.select_one("span[data-testid='company-name'], .companyName")
                location_el = card.select_one("div[data-testid='text-location'], .companyLocation")
                link_el = card.select_one("a[data-jk], a[id^='job_'], a[data-testid='job-title']")
                snippet_el = card.select_one(".job-snippet, div[data-testid='jobcard-snippet']")

                title = clean_text(title_el.get_text()) if title_el else "Unknown Title"
                company = clean_text(company_el.get_text()) if company_el else "Unknown Company"
                location_text = clean_text(location_el.get_text()) if location_el else "South Africa"
                snippet = clean_text(snippet_el.get_text()) if snippet_el else ""

                href = link_el.get("href", "") if link_el else ""
                jk = link_el.get("data-jk", "") if link_el else ""
                if jk:
                    job_url = f"{self.base_url}/rc/clk?jk={jk}"
                elif href.startswith("/"):
                    job_url = f"{self.base_url}{href}"
                else:
                    job_url = href

                jobs.append(ScrapedJob(
                    id=make_job_id(job_url or title + company),
                    title=title,
                    company=company,
                    location=location_text,
                    description=snippet or f"{title} at {company}.",
                    url=job_url,
                    source="indeed",
                ))
            except Exception:
                continue

        logger.info("[Indeed] soup parse yielded %d jobs", len(jobs))
        return jobs
