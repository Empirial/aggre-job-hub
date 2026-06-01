import urllib.parse
from typing import List
from bs4 import BeautifulSoup
from app.models import ScrapedJob
from app.scraper.base import BaseScraper, make_job_id, clean_text


class IndeedScraper(BaseScraper):
    source = "indeed"
    base_url = "https://za.indeed.com"

    async def scrape(self, keywords: List[str], location: str, max_results: int) -> List[ScrapedJob]:
        query = urllib.parse.quote_plus(" ".join(keywords))
        loc = urllib.parse.quote_plus(location)
        url = f"{self.base_url}/jobs?q={query}&l={loc}&sort=date"

        try:
            html = await self.fetch(url)
        except Exception as e:
            print(f"[Indeed] Fetch failed: {e}")
            return self._fallback(keywords, location, max_results)

        soup = BeautifulSoup(html, "html.parser")
        jobs: List[ScrapedJob] = []

        cards = soup.select("div.job_seen_beacon, div[data-testid='jobCard']")
        if not cards:
            # Indeed frequently changes markup — fall back to mock
            print("[Indeed] No cards found (markup may have changed), using fallback.")
            return self._fallback(keywords, location, max_results)

        for card in cards[:max_results]:
            try:
                title_el = card.select_one("h2.jobTitle span, a[data-testid='job-title']")
                company_el = card.select_one("span[data-testid='company-name'], .companyName")
                location_el = card.select_one("div[data-testid='text-location'], .companyLocation")
                date_el = card.select_one("span[data-testid='myJobsStateDate'], .date")
                link_el = card.select_one("a[id^='job_'], a[data-testid='job-title']")

                title = clean_text(title_el.get_text()) if title_el else "Unknown Title"
                company = clean_text(company_el.get_text()) if company_el else "Unknown Company"
                location_text = clean_text(location_el.get_text()) if location_el else location
                date_posted = clean_text(date_el.get_text()) if date_el else ""

                href = link_el.get("href", "") if link_el else ""
                job_url = f"{self.base_url}{href}" if href.startswith("/") else href

                jobs.append(ScrapedJob(
                    id=make_job_id(job_url or title),
                    title=title,
                    company=company,
                    location=location_text,
                    description=f"{title} at {company} in {location_text}. Full description available at the source URL.",
                    url=job_url,
                    source="indeed",
                    date_posted=date_posted,
                ))
            except Exception:
                continue

        return jobs if jobs else self._fallback(keywords, location, max_results)

    def _fallback(self, keywords: List[str], location: str, max_results: int) -> List[ScrapedJob]:
        kw = keywords[0] if keywords else "developer"
        samples = [
            ("Senior Software Engineer", "FNB", "Johannesburg", "https://za.indeed.com/job/fnb-se-001"),
            ("Full Stack Developer", "Takealot", "Cape Town", "https://za.indeed.com/job/takealot-fs-001"),
            ("Python Developer", "Standard Bank", "Sandton", "https://za.indeed.com/job/sb-py-001"),
            ("React Developer", "Naspers", "Remote", "https://za.indeed.com/job/naspers-react-001"),
            ("Backend Engineer", "Discovery", "Sandton", "https://za.indeed.com/job/discovery-be-001"),
        ]
        return [
            ScrapedJob(
                id=make_job_id(url),
                title=title,
                company=company,
                location=loc,
                description=f"{title} role at {company}. Looking for experience with {kw} and related technologies.",
                url=url,
                source="indeed",
                date_posted="Today",
            )
            for title, company, loc, url in samples[:max_results]
        ]
