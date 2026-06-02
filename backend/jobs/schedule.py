"""
Daily job runner — triggered by fly.io cron at 4am UTC (6am SAST).

Can also be run manually:
    python jobs/schedule.py
    python jobs/schedule.py --dry-run
"""

import asyncio
import argparse
import os
import sys
from datetime import datetime
from pathlib import Path

# Ensure backend root is on the path when run directly
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from dotenv import load_dotenv
load_dotenv()

from app import firebase_client as db
from app.scraper.indeed import IndeedScraper
from app.scraper.pnet import PNetScraper
from app.scraper.linkedin import LinkedInScraper
from app.ai.deepseek_client import DeepSeekClient
from app.models import JobAnalysisRequest

# ── Config ────────────────────────────────────────────────────────────────────

SEARCH_KEYWORDS = [
    "software engineer",
    "python developer",
    "react developer",
    "full stack developer",
    "backend engineer",
]
LOCATION = "South Africa"
MAX_PER_SOURCE = 15

# ─────────────────────────────────────────────────────────────────────────────


async def run_scraper(dry_run: bool = False) -> dict:
    print(f"\n[{datetime.now().isoformat()}] Starting daily job scrape...")

    scrapers = {
        "indeed": IndeedScraper(),
        "pnet": PNetScraper(),
        "linkedin": LinkedInScraper(),
    }

    all_jobs = []
    for name, scraper in scrapers.items():
        try:
            jobs = await scraper.scrape(SEARCH_KEYWORDS, LOCATION, MAX_PER_SOURCE)
            print(f"  [{name}] scraped {len(jobs)} jobs")
            all_jobs.extend(jobs)
        except Exception as e:
            print(f"  [{name}] ERROR: {e}")

    print(f"\n  Total scraped: {len(all_jobs)}")

    if dry_run:
        print("  [dry-run] Skipping save.")
        return {"scraped": len(all_jobs), "saved": 0, "new": 0}

    saved = 0
    for job in all_jobs:
        if not db.job_exists(job.url):
            db.save_job(job.model_dump())
            saved += 1

    print(f"  New jobs saved: {saved} (duplicates skipped: {len(all_jobs) - saved})")
    return {"scraped": len(all_jobs), "saved": saved}


async def run_ats_scoring(dry_run: bool = False) -> int:
    """Score any jobs that don't have an ATS score yet."""
    print("\n  Scoring unscored jobs with DeepSeek...")

    api_key = os.getenv("DEEPSEEK_API_KEY", "")
    if not api_key:
        print("  [skip] No DEEPSEEK_API_KEY — skipping ATS scoring.")
        return 0

    client = DeepSeekClient(api_key=api_key)
    jobs = db.get_jobs(limit=100)
    unscored = [j for j in jobs if not j.get("ats_score")]

    print(f"  Found {len(unscored)} unscored jobs")

    scored = 0
    for job in unscored[:20]:  # Cap at 20 per run to stay within API limits
        try:
            req = JobAnalysisRequest(
                title=job["title"],
                company=job.get("company"),
                location=job.get("location"),
                description=job["description"],
            )
            analysis = await client.analyze_job_description(req)

            # Score = percentage of required_skills present in description
            desc_lower = job["description"].lower()
            matched = sum(1 for s in analysis.required_skills if s.lower() in desc_lower)
            total = len(analysis.required_skills) or 1
            score = min(99, int((matched / total) * 100) + 50)  # Base 50, max 99

            if not dry_run:
                db.update_job(job["id"], {
                    "ats_score": score,
                    "keywords": analysis.keywords,
                })

            scored += 1
            print(f"    Scored: {job['title']} @ {job.get('company')} — {score}%")
        except Exception as e:
            print(f"    ERROR scoring {job.get('title')}: {e}")

    return scored


async def main(dry_run: bool = False):
    db.init_firebase()

    scrape_result = await run_scraper(dry_run=dry_run)
    scored = await run_ats_scoring(dry_run=dry_run)

    print(f"\n[Done] scraped={scrape_result['scraped']} saved={scrape_result['saved']} scored={scored}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Daily job scraper + ATS scorer")
    parser.add_argument("--dry-run", action="store_true", help="Scrape but do not save")
    args = parser.parse_args()

    asyncio.run(main(dry_run=args.dry_run))
