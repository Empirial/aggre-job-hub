"""
DPSA Public Service Vacancy Circular scraper.

The Department of Public Service and Administration publishes every national
and provincial government vacancy in a weekly circular:
    https://www.dpsa.gov.za/newsroom/psvc/

Each circular page links one combined PDF plus one PDF per annexure
(a.pdf, b.pdf, ... = one department each). Individual posts inside those PDFs
follow a stable layout:

    POST 32/01 : CHIEF AUDIT EXECUTIVE REF NO: 3/3/1/81/2026
    SALARY : R1 216 824 per annum
    CENTRE : Gauteng: Pretoria
    REQUIREMENTS : ...
    DUTIES : ...
    ENQUIRIES : ...
    APPLICATIONS : ...

This scraper downloads the annexure PDFs of the latest circular(s), extracts
the text with pypdf, and turns each POST block into a ScrapedJob.
Returns an empty list (never mock data) when anything fails.
"""
import asyncio
import io
import logging
import re
from typing import List, Optional

import httpx
from pypdf import PdfReader

from app.models import ScrapedJob
from app.scraper.base import BaseScraper, make_job_id, clean_text

logger = logging.getLogger(__name__)

BASE = "https://www.dpsa.gov.za"
CIRCULAR_INDEX = f"{BASE}/newsroom/psvc/"

FIELD_NAMES = [
    "SALARY",
    "CENTRE",
    "REQUIREMENTS",
    "DUTIES",
    "ENQUIRIES",
    "APPLICATIONS",
    "NOTE",
    "CLOSING DATE",
]
_FIELD_RE = re.compile(
    r"^(?P<field>" + "|".join(FIELD_NAMES) + r")\s*:\s*(?P<value>.*)$",
    re.IGNORECASE,
)
_POST_RE = re.compile(r"^POST\s+(?P<ref>\d+\s*/\s*\d+)\s*:\s*(?P<title>.*)$", re.IGNORECASE)
_DEPT_RE = re.compile(r"^\s*((?:NATIONAL\s+)?DEPARTMENT|PROVINCIAL\s+ADMINISTRATION|OFFICE)\b.*$", re.IGNORECASE)


def _normalise(raw_text: str) -> List[str]:
    """Collapse the PDF's hard-wrapped, hyphen-spaced text into logical lines."""
    lines: List[str] = []
    for line in raw_text.splitlines():
        line = re.sub(r"\s+", " ", line).strip()
        if not line or line.isdigit():
            continue
        # PDF extraction inserts stray spaces inside words ("t he", "d river")
        if _POST_RE.match(line) or _FIELD_RE.match(line) or _DEPT_RE.match(line):
            lines.append(line)
        elif lines:
            lines[-1] = f"{lines[-1]} {line}"
        else:
            lines.append(line)
    return lines


class DPSAScraper(BaseScraper):
    source = "dpsa"
    timeout = 45
    max_circulars = 1
    max_annexures = 12

    async def scrape(self, keywords: List[str], location: str, max_results: int) -> List[ScrapedJob]:
        try:
            circulars = await self._latest_circulars()
        except Exception as e:
            logger.warning("[DPSA] circular index fetch failed: %s", e)
            return []

        jobs: List[ScrapedJob] = []
        for circular_url in circulars:
            try:
                pdf_urls = await self._annexure_pdfs(circular_url)
            except Exception as e:
                logger.warning("[DPSA] circular page failed (%s): %s", circular_url, e)
                continue

            results = await asyncio.gather(
                *[self._parse_annexure(u) for u in pdf_urls[: self.max_annexures]],
                return_exceptions=True,
            )
            for res in results:
                if isinstance(res, Exception):
                    logger.warning("[DPSA] annexure failed: %s", res)
                    continue
                jobs.extend(res)

        jobs = self._dedupe(jobs)
        jobs = self._rank(jobs, keywords, location)
        logger.info("[DPSA] parsed %d posts, returning %d", len(jobs), min(len(jobs), max_results))
        return jobs[:max_results]

    # ── discovery ─────────────────────────────────────────────────────────────

    async def _latest_circulars(self) -> List[str]:
        html = await self.fetch(CIRCULAR_INDEX)
        found = re.findall(r"""href=['"](/newsroom/psvc/circular-(\d+)-of-(\d+)/)['"]""", html)
        if not found:
            return []
        # newest = highest (year, circular number)
        ordered = sorted(found, key=lambda m: (int(m[2]), int(m[1])), reverse=True)
        seen, urls = set(), []
        for path, _num, _year in ordered:
            if path in seen:
                continue
            seen.add(path)
            urls.append(f"{BASE}{path}")
            if len(urls) >= self.max_circulars:
                break
        return urls

    async def _annexure_pdfs(self, circular_url: str) -> List[str]:
        html = await self.fetch(circular_url, referer=CIRCULAR_INDEX)
        urls = re.findall(r"""href=["']([^"']+/documents/vacancies/\d{4}/\d+/[a-z]+\.pdf)["']""", html, re.I)
        clean: List[str] = []
        for u in urls:
            full = u if u.startswith("http") else f"{BASE}{u}"
            if full not in clean:
                clean.append(full)
        return clean

    # ── parsing ───────────────────────────────────────────────────────────────

    async def _parse_annexure(self, pdf_url: str) -> List[ScrapedJob]:
        async with httpx.AsyncClient(timeout=self.timeout, follow_redirects=True) as client:
            res = await client.get(pdf_url, headers={"User-Agent": "Mozilla/5.0 (compatible; CareerGate/1.0)"})
            res.raise_for_status()
            data = res.content

        text = await asyncio.to_thread(self._pdf_text, data)
        if not text.strip():
            return []
        return self._posts_from_text(text, pdf_url)

    @staticmethod
    def _pdf_text(data: bytes) -> str:
        reader = PdfReader(io.BytesIO(data))
        return "\n".join((page.extract_text() or "") for page in reader.pages)

    def _posts_from_text(self, text: str, pdf_url: str) -> List[ScrapedJob]:
        lines = _normalise(text)

        department = "Department of Public Service and Administration"
        circular_closing: Optional[str] = None
        jobs: List[ScrapedJob] = []
        current: Optional[dict] = None
        active_field: Optional[str] = None

        def flush():
            if current:
                job = self._build_job(current, department, circular_closing, pdf_url)
                if job:
                    jobs.append(job)

        for line in lines:
            dept_match = _DEPT_RE.match(line)
            if dept_match and current is None and len(line) < 120:
                department = clean_text(line).title()
                continue

            post_match = _POST_RE.match(line)
            if post_match:
                flush()
                current = {
                    "ref": re.sub(r"\s+", "", post_match.group("ref")),
                    "title": clean_text(post_match.group("title")),
                    "fields": {},
                }
                active_field = "TITLE"
                continue

            field_match = _FIELD_RE.match(line)
            if field_match:
                field = field_match.group("field").upper()
                value = clean_text(field_match.group("value"))
                if current is None:
                    if field == "CLOSING DATE":
                        circular_closing = value
                    continue
                current["fields"][field] = value
                active_field = field
                continue

            if current is not None and active_field:
                if active_field == "TITLE":
                    current["title"] = clean_text(f"{current['title']} {line}")
                else:
                    current["fields"][active_field] = clean_text(
                        f"{current['fields'].get(active_field, '')} {line}"
                    )

        flush()
        return jobs

    def _build_job(self, post: dict, department: str, closing: Optional[str], pdf_url: str) -> Optional[ScrapedJob]:
        fields = post["fields"]
        title = re.sub(r"\s*\(?REF(ERENCE)?\s*(NO)?[:.]?.*$", "", post["title"], flags=re.I).strip(" :.-")
        title = clean_text(title).title()
        if len(title) < 3:
            return None

        centre = clean_text(fields.get("CENTRE", "")) or "South Africa"
        salary = clean_text(fields.get("SALARY", ""))
        closing_date = clean_text(fields.get("CLOSING DATE", "") or closing or "")

        parts = []
        if salary:
            parts.append(f"Salary: {salary}")
        if closing_date:
            parts.append(f"Closing date: {closing_date}")
        parts.append(f"Reference: POST {post['ref']}")
        for label in ("REQUIREMENTS", "DUTIES", "ENQUIRIES", "APPLICATIONS", "NOTE"):
            value = clean_text(fields.get(label, ""))
            if value:
                parts.append(f"{label.title()}: {value}")

        description = "\n\n".join(parts)[:6000]
        url = f"{pdf_url}#post-{post['ref'].replace('/', '-')}"

        return ScrapedJob(
            id=make_job_id(url),
            title=title,
            company=department,
            location=centre,
            description=description,
            url=url,
            source="dpsa",
            date_posted=closing_date or None,
        )

    # ── ranking ───────────────────────────────────────────────────────────────

    @staticmethod
    def _dedupe(jobs: List[ScrapedJob]) -> List[ScrapedJob]:
        seen, out = set(), []
        for job in jobs:
            if job.url in seen:
                continue
            seen.add(job.url)
            out.append(job)
        return out

    @staticmethod
    def _rank(jobs: List[ScrapedJob], keywords: List[str], location: str) -> List[ScrapedJob]:
        terms = [k.lower() for k in (keywords or []) if k]
        loc = (location or "").lower().replace("south africa", "").strip()

        def score(job: ScrapedJob) -> int:
            haystack = f"{job.title} {job.description}".lower()
            value = sum(2 for t in terms if t in job.title.lower())
            value += sum(1 for t in terms if t in haystack)
            if loc and loc in job.location.lower():
                value += 2
            return -value

        return sorted(jobs, key=score)
