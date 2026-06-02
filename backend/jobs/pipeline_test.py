"""
Full end-to-end pipeline test.

Tests every phase without sending a real email.

Usage:
    python jobs/pipeline_test.py
    python jobs/pipeline_test.py --send-email --recipient test@example.com
"""

import asyncio
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from dotenv import load_dotenv
load_dotenv()

from app import firebase_client as db
from app.scraper.indeed import IndeedScraper
from app.scraper.pnet import PNetScraper
from app.scraper.linkedin import LinkedInScraper
from app.ai.deepseek_client import DeepSeekClient
from app.cv.ats_mirror import ATSMirror
from app.cv.docx_generator import generate_cv_docx
from app.email_sender.sender import send_application
from app.models import CVProfile, JobAnalysisRequest

PROFILE = CVProfile(
    name="Lufuno Mphela",
    email="lufuno@mphelaindustries.co.za",
    phone="+27 73 000 0000",
    linkedin="linkedin.com/in/lufunomphela",
    summary=(
        "Full-stack developer with 4 years experience in React, Python, Node.js. "
        "Strong background in API design and cloud infrastructure."
    ),
    skills=["React", "TypeScript", "Python", "Node.js", "PostgreSQL", "Docker", "AWS"],
    experience=[
        "Built internal tools using React and Node.js to streamline procurement workflows",
        "Designed RESTful APIs consumed by mobile and web clients",
        "Managed PostgreSQL database schema and wrote complex queries",
        "Deployed microservices to AWS using Docker and CI/CD pipelines",
    ],
    education="BSc Computer Science — UNISA (In Progress, 2026)",
)

PASS = "\033[92mPASS\033[0m"
FAIL = "\033[91mFAIL\033[0m"


def check(label: str, condition: bool, detail: str = ""):
    status = PASS if condition else FAIL
    print(f"  [{status}] {label}" + (f" — {detail}" if detail else ""))
    return condition


async def run(send_email: bool = False, recipient: str = ""):
    results = []
    print("\n=== JobApplier Full Pipeline Test ===\n")

    # ── Phase 1: Firebase init ────────────────────────────────────────────────
    print("[Phase 1] Firebase")
    db.init_firebase()
    results.append(check("Firebase initialised", True))

    # ── Phase 2: Scrapers ─────────────────────────────────────────────────────
    print("\n[Phase 2] Scrapers")
    scrapers = {
        "Indeed": IndeedScraper(),
        "PNet": PNetScraper(),
        "LinkedIn": LinkedInScraper(),
    }
    all_jobs = []
    for name, scraper in scrapers.items():
        jobs = await scraper.scrape(["python developer"], "South Africa", 3)
        ok = check(f"{name} scraper", len(jobs) > 0, f"{len(jobs)} jobs")
        results.append(ok)
        all_jobs.extend(jobs)

    # Save to store
    saved = 0
    for j in all_jobs:
        if not db.job_exists(j.url):
            db.save_job(j.model_dump())
            saved += 1
    results.append(check("Jobs saved to store", saved > 0, f"{saved} new jobs"))

    stored = db.get_jobs()
    results.append(check("Jobs retrievable", len(stored) > 0, f"{len(stored)} total"))

    # ── Phase 1: DeepSeek analysis ────────────────────────────────────────────
    print("\n[Phase 1] DeepSeek Analysis")
    import os
    api_key = os.getenv("DEEPSEEK_API_KEY", "")
    client = DeepSeekClient(api_key=api_key)

    test_job = stored[0]
    job_req = JobAnalysisRequest(
        title=test_job["title"],
        company=test_job.get("company"),
        location=test_job.get("location"),
        description=test_job["description"],
    )
    analysis = await client.analyze_job_description(job_req)
    results.append(check("JD analysis returned keywords", len(analysis.keywords) > 0, str(analysis.keywords[:3])))
    results.append(check("Seniority extracted", bool(analysis.seniority), analysis.seniority))

    # ── Phase 1: CV tailoring ─────────────────────────────────────────────────
    print("\n[Phase 1] CV Tailoring")
    summary = ATSMirror.rewrite_summary(PROFILE.summary or "", job_req, analysis)
    skills = ATSMirror.rewrite_skills(PROFILE.skills, job_req, analysis)
    experience = ATSMirror.rewrite_experience(PROFILE.experience, job_req, analysis)

    results.append(check("Summary rewritten", len(summary) > len(PROFILE.summary or ""), f"{len(summary)} chars"))
    results.append(check("Skills enriched", len(skills) >= len(PROFILE.skills), f"{len(skills)} skills"))
    results.append(check("Experience rewritten", len(experience) == len(PROFILE.experience)))

    # ── Phase 1: .docx generation ─────────────────────────────────────────────
    print("\n[Phase 1] .docx Generation")
    output_path = Path("output/pipeline_test_cv.docx")
    generate_cv_docx(
        profile=PROFILE,
        summary=summary,
        skills=skills,
        experience=experience,
        education=PROFILE.education,
        output_path=output_path,
    )
    results.append(check(".docx file created", output_path.exists(), str(output_path.resolve())))

    # ── Phase 5: Email sender ─────────────────────────────────────────────────
    print("\n[Phase 5] Email Sender")
    if send_email and recipient:
        result = send_application(
            recipient_email=recipient,
            applicant_name=PROFILE.name,
            job_title=test_job["title"],
            company=test_job.get("company", ""),
            cv_path=output_path,
        )
        results.append(check("Email sent", result["success"], result.get("error", "")))
    else:
        sender_configured = bool(os.getenv("SENDER_EMAIL") and os.getenv("SENDER_PASSWORD"))
        results.append(check(
            "Email config present",
            sender_configured,
            "skipping send (pass --send-email --recipient to test)"
        ))

    # ── Application record ────────────────────────────────────────────────────
    print("\n[Phase 5] Application Tracking")
    from app.models import Application
    import hashlib
    app_id = hashlib.md5(f"{test_job['id']}{PROFILE.email}".encode()).hexdigest()[:12]
    app = Application(
        id=app_id,
        job_id=test_job["id"],
        job_title=test_job["title"],
        company=test_job.get("company", ""),
        status="sent" if (send_email and recipient) else "pending",
        cv_path=str(output_path),
    )
    db.save_application(app.model_dump())
    retrieved = db.get_applications()
    results.append(check("Application saved", len(retrieved) > 0))
    results.append(check("Application retrievable", retrieved[0]["job_title"] == test_job["title"]))

    # ── Summary ───────────────────────────────────────────────────────────────
    passed = sum(results)
    total = len(results)
    print(f"\n{'='*40}")
    print(f"Result: {passed}/{total} checks passed")
    if passed == total:
        print("All systems operational.")
    else:
        print(f"{total - passed} check(s) failed — review output above.")
    print("="*40)

    return passed == total


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--send-email", action="store_true")
    parser.add_argument("--recipient", default="")
    args = parser.parse_args()

    success = asyncio.run(run(send_email=args.send_email, recipient=args.recipient))
    sys.exit(0 if success else 1)
