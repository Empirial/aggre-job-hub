import hashlib
import re
from abc import ABC, abstractmethod
from typing import List
import httpx
from app.models import ScrapedJob


HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-ZA,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}


def make_job_id(url: str) -> str:
    return hashlib.md5(url.encode()).hexdigest()[:12]


def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()


class BaseScraper(ABC):
    source: str = ""
    timeout: int = 15

    async def fetch(self, url: str) -> str:
        async with httpx.AsyncClient(headers=HEADERS, timeout=self.timeout, follow_redirects=True) as client:
            response = await client.get(url)
            response.raise_for_status()
            return response.text

    @abstractmethod
    async def scrape(self, keywords: List[str], location: str, max_results: int) -> List[ScrapedJob]:
        pass
