"""
LinkedIn scraper stub — NOT a real data source.
Real LinkedIn scraping requires authenticated sessions and risks ToS violation.
There is no free API for this; a paid third-party provider (e.g. ScrapingBee,
Proxycurl) would be required to make this real. Until then this returns clearly
labeled demo listings so they can never be mistaken for real job postings.
"""
import logging
from typing import List
from app.models import ScrapedJob
from app.scraper.base import BaseScraper, make_job_id

logger = logging.getLogger(__name__)


class LinkedInScraper(BaseScraper):
    source = "linkedin"

    async def scrape(self, keywords: List[str], location: str, max_results: int) -> List[ScrapedJob]:
        logger.warning("[LinkedIn] No real integration configured — returning labeled demo data.")
        return self._demo(keywords, location, max_results)

    def _demo(self, keywords: List[str], location: str, max_results: int) -> List[ScrapedJob]:
        kw = keywords[0] if keywords else "developer"
        samples = [
            ("Senior React Developer", "Naspers", "Cape Town", "https://linkedin.com/jobs/view/naspers-react-001"),
            ("Software Architect", "Investec", "Johannesburg", "https://linkedin.com/jobs/view/investec-arch-001"),
            ("Platform Engineer", "Shoprite", "Brackenfell", "https://linkedin.com/jobs/view/shoprite-platform-001"),
            ("API Developer", "Nedbank", "Johannesburg", "https://linkedin.com/jobs/view/nedbank-api-001"),
            ("Systems Engineer", "Eskom", "Johannesburg", "https://linkedin.com/jobs/view/eskom-sys-001"),
        ]
        return [
            ScrapedJob(
                id=make_job_id(url),
                title=f"[Demo — not a real listing] {title}",
                company=company,
                location=loc,
                description=(
                    f"DEMO DATA: LinkedIn scraping isn't wired to a real API yet, so this listing "
                    f"is a placeholder and does not reflect an actual open role. {title} at {company}. "
                    f"Strong {kw} background required."
                ),
                url=url,
                source="linkedin",
                date_posted="1 day ago",
            )
            for title, company, loc, url in samples[:max_results]
        ]
