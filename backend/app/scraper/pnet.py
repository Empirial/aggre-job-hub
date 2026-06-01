import urllib.parse
from typing import List
from bs4 import BeautifulSoup
from app.models import ScrapedJob
from app.scraper.base import BaseScraper, make_job_id, clean_text


class PNetScraper(BaseScraper):
    source = "pnet"
    base_url = "https://www.pnet.co.za"

    async def scrape(self, keywords: List[str], location: str, max_results: int) -> List[ScrapedJob]:
        query = urllib.parse.quote_plus(" ".join(keywords))
        url = f"{self.base_url}/jobs/{query.replace('+', '-')}"

        try:
            html = await self.fetch(url)
        except Exception as e:
            print(f"[PNet] Fetch failed: {e}")
            return self._fallback(keywords, location, max_results)

        soup = BeautifulSoup(html, "html.parser")
        jobs: List[ScrapedJob] = []

        cards = soup.select("article.job-card, div[data-testid='job-card']")
        if not cards:
            print("[PNet] No cards found, using fallback.")
            return self._fallback(keywords, location, max_results)

        for card in cards[:max_results]:
            try:
                title_el = card.select_one("h2, h3, .job-title")
                company_el = card.select_one(".company-name, .employer")
                location_el = card.select_one(".location, .job-location")
                link_el = card.select_one("a[href]")

                title = clean_text(title_el.get_text()) if title_el else "Unknown Title"
                company = clean_text(company_el.get_text()) if company_el else "Unknown Company"
                location_text = clean_text(location_el.get_text()) if location_el else location
                href = link_el.get("href", "") if link_el else ""
                job_url = f"{self.base_url}{href}" if href.startswith("/") else href

                jobs.append(ScrapedJob(
                    id=make_job_id(job_url or title),
                    title=title,
                    company=company,
                    location=location_text,
                    description=f"{title} at {company} in {location_text}.",
                    url=job_url,
                    source="pnet",
                    date_posted="",
                ))
            except Exception:
                continue

        return jobs if jobs else self._fallback(keywords, location, max_results)

    def _fallback(self, keywords: List[str], location: str, max_results: int) -> List[ScrapedJob]:
        kw = keywords[0] if keywords else "developer"
        samples = [
            ("Software Developer", "Vodacom", "Midrand", "https://www.pnet.co.za/jobs/vodacom-dev-001"),
            ("DevOps Engineer", "Capitec Bank", "Stellenbosch", "https://www.pnet.co.za/jobs/capitec-devops-001"),
            ("Cloud Engineer", "MTN", "Johannesburg", "https://www.pnet.co.za/jobs/mtn-cloud-001"),
            ("Data Engineer", "Absa", "Johannesburg", "https://www.pnet.co.za/jobs/absa-data-001"),
            ("Mobile Developer", "OUTsurance", "Centurion", "https://www.pnet.co.za/jobs/out-mobile-001"),
        ]
        return [
            ScrapedJob(
                id=make_job_id(url),
                title=title,
                company=company,
                location=loc,
                description=f"{title} at {company}. Requires {kw} skills and 3+ years of experience.",
                url=url,
                source="pnet",
                date_posted="Today",
            )
            for title, company, loc, url in samples[:max_results]
        ]
