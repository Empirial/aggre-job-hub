"""
CLI script — run the full CV tailoring pipeline without the server.

Usage:
    python tailor.py --name "Lufuno Mphela" --email "you@example.com" \
                     --jd "path/to/job_description.txt" \
                     --out "output/my_cv.docx"

Or with inline JD:
    python tailor.py --name "Lufuno Mphela" --email "you@example.com" \
                     --title "Senior Software Engineer" --company "FNB" \
                     --jd-text "We are looking for a senior engineer..."
"""

import asyncio
import argparse
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

from app.ai.deepseek_client import DeepSeekClient
from app.cv.ats_mirror import ATSMirror
from app.cv.docx_generator import generate_cv_docx
from app.models import CVProfile, JobAnalysisRequest

# ── Default profile — edit this or pass via args ──────────────────────────────
DEFAULT_PROFILE = CVProfile(
    name="Lufuno Mphela",
    email="lufuno@mphelaindustries.co.za",
    phone="+27 73 000 0000",
    linkedin="linkedin.com/in/lufunomphela",
    summary=(
        "Full-stack software developer with 4 years of experience building scalable "
        "web applications. Proficient in React, TypeScript, Node.js, and Python. "
        "Strong background in API design and cloud infrastructure."
    ),
    skills=["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "Redis", "Docker", "AWS", "Git"],
    experience=[
        "Built internal tools using React and Node.js to streamline procurement workflows",
        "Designed RESTful APIs consumed by mobile and web clients",
        "Managed PostgreSQL database schema and wrote complex queries",
        "Developed client websites using React and Tailwind CSS",
        "Integrated third-party APIs including payment gateways and mapping services",
        "Delivered 8 projects on time across retail and services industries",
    ],
    education="BSc Computer Science — UNISA (In Progress, 2026)",
)
# ─────────────────────────────────────────────────────────────────────────────


async def run(profile: CVProfile, job: JobAnalysisRequest, output_path: Path) -> None:
    api_key = os.getenv("DEEPSEEK_API_KEY", "")
    client = DeepSeekClient(api_key=api_key)

    print(f"Analyzing job: {job.title} @ {job.company or 'Unknown'}...")
    analysis = await client.analyze_job_description(job)

    print(f"Keywords extracted: {', '.join(analysis.keywords)}")
    print(f"Seniority: {analysis.seniority} | Tone: {analysis.tone}")

    print("Tailoring CV...")
    summary = ATSMirror.rewrite_summary(profile.summary or "", job, analysis)
    skills = ATSMirror.rewrite_skills(profile.skills, job, analysis)

    print("Rewriting experience bullets...")
    if api_key:
        experience = await client.rewrite_experience(profile, analysis)
    else:
        experience = ATSMirror.rewrite_experience(profile.experience, job, analysis)

    print(f"Generating .docx -> {output_path}")
    generate_cv_docx(
        profile=profile,
        summary=summary,
        skills=skills,
        experience=experience,
        education=profile.education,
        output_path=output_path,
    )

    print("\nDone.")
    print(f"  Summary  : {summary[:80]}...")
    print(f"  Skills   : {', '.join(skills[:6])}")
    print(f"  Bullets  : {len(experience)} experience items")
    print(f"  Output   : {output_path.resolve()}")


def main():
    parser = argparse.ArgumentParser(description="Tailor a CV for a job description")
    parser.add_argument("--name", default=DEFAULT_PROFILE.name)
    parser.add_argument("--email", default=DEFAULT_PROFILE.email)
    parser.add_argument("--title", default="Software Engineer", help="Job title")
    parser.add_argument("--company", default=None, help="Company name")
    parser.add_argument("--location", default=None, help="Job location")
    parser.add_argument("--jd", default=None, help="Path to a .txt file with the job description")
    parser.add_argument("--jd-text", default=None, help="Inline job description text")
    parser.add_argument("--out", default=None, help="Output .docx path")
    args = parser.parse_args()

    if args.jd:
        jd_text = Path(args.jd).read_text(encoding="utf-8")
    elif args.jd_text:
        jd_text = args.jd_text
    else:
        # Demo JD if nothing provided
        jd_text = (
            "We are looking for a Senior Software Engineer with strong experience in Python, "
            "microservices, Docker, and REST APIs. The ideal candidate has 5+ years of experience "
            "and is comfortable working in an Agile environment. Experience with AWS and CI/CD is required."
        )
        print("No JD provided — using demo job description.\n")

    job = JobAnalysisRequest(
        title=args.title,
        company=args.company,
        location=args.location,
        description=jd_text,
    )

    profile = DEFAULT_PROFILE.model_copy(update={"name": args.name, "email": args.email})

    output_path = Path(args.out) if args.out else (
        Path("output") / f"{args.name.replace(' ', '_')}_{args.title.replace(' ', '_')}.docx"
    )

    asyncio.run(run(profile, job, output_path))


if __name__ == "__main__":
    main()
