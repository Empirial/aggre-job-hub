import asyncio
import hashlib
import random
import re
from abc import ABC, abstractmethod
from typing import List
import httpx
from app.models import ScrapedJob

# Rotating pool of real Chrome UAs across different OS/versions
_USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15",
]


def _browser_headers(ua: str, referer: str = "") -> dict:
    """Build a full browser-like header set that passes Cloudflare fingerprinting."""
    is_firefox = "Firefox" in ua
    is_safari = "Safari" in ua and "Chrome" not in ua

    headers = {
        "User-Agent": ua,
        "Accept-Language": "en-ZA,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "DNT": "1",
    }

    if referer:
        headers["Referer"] = referer

    if is_firefox:
        headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
    elif is_safari:
        headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    else:
        # Chrome — include full sec-ch-ua fingerprint headers
        headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
        headers["sec-ch-ua"] = '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"'
        headers["sec-ch-ua-mobile"] = "?0"
        headers["sec-ch-ua-platform"] = '"Windows"' if "Windows" in ua else '"macOS"' if "Mac" in ua else '"Linux"'
        headers["Sec-Fetch-Dest"] = "document"
        headers["Sec-Fetch-Mode"] = "navigate"
        headers["Sec-Fetch-Site"] = "none" if not referer else "same-origin"
        headers["Sec-Fetch-User"] = "?1"

    return headers


def make_job_id(url: str) -> str:
    return hashlib.md5(url.encode()).hexdigest()[:12]


def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()


class BaseScraper(ABC):
    source: str = ""
    timeout: int = 20
    _max_retries: int = 3

    async def fetch(self, url: str, referer: str = "") -> str:
        """
        Fetch a URL with rotating User-Agent, full browser headers,
        cookie persistence, and exponential backoff on 403/429/5xx.
        """
        last_exc: Exception = Exception("No attempts made")

        for attempt in range(self._max_retries):
            ua = random.choice(_USER_AGENTS)
            headers = _browser_headers(ua, referer=referer)

            # Small random delay to avoid burst detection (skip on first attempt)
            if attempt > 0:
                await asyncio.sleep(random.uniform(1.5, 3.5) * attempt)

            try:
                async with httpx.AsyncClient(
                    headers=headers,
                    timeout=self.timeout,
                    follow_redirects=True,
                    # Persist cookies across redirects (helps with Cloudflare challenge cookies)
                    cookies=httpx.Cookies(),
                ) as client:
                    response = await client.get(url)

                    if response.status_code in (403, 429):
                        # Blocked — retry with different UA
                        last_exc = Exception(f"HTTP {response.status_code} on attempt {attempt + 1}")
                        continue

                    response.raise_for_status()
                    return response.text

            except httpx.TimeoutException as e:
                last_exc = e
                continue
            except httpx.HTTPStatusError as e:
                if e.response.status_code in (403, 429, 503):
                    last_exc = e
                    continue
                raise

        raise last_exc

    @abstractmethod
    async def scrape(self, keywords: List[str], location: str, max_results: int) -> List[ScrapedJob]:
        pass
