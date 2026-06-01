"""
LinkedIn scraper stub.
Real LinkedIn scraping requires authenticated sessions and risks ToS violation.
This stub returns mock data. Replace with the LinkedIn Jobs API or a third-party
provider (e.g. ScrapingBee, Proxycurl) when ready.
"""
from typing import List
from app.models import ScrapedJob
from app.scraper.base import BaseScraper, make_job_id


class LinkedInScraper(BaseScraper):
    source = "linkedin"

    async def scrape(self, keywords: List[str], location: str, max_results: int) -> List[ScrapedJob]:
        print("[LinkedIn] Stub active — returning mock data. Replace with API integration.")
        return self._mock(keywords, location, max_results)

    def _mock(self, keywords: List[str], location: str, max_results: int) -> List[ScrapedJob]:
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
                title=title,
                company=company,
                location=loc,
                description=f"{title} at {company}. Strong {kw} background required.",
                url=url,
                source="linkedin",
                date_posted="1 day ago",
            )
            for title, company, loc, url in samples[:max_results]
        ]
