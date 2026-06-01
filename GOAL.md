# Job Applier — Project Goal

## What We're Building

An AI-powered automated job application system. It scrapes job listings, tailors a CV per job using DeepSeek AI to mirror ATS requirements, sends applications automatically, and tracks everything in a React dashboard.

The user reviews and approves. The system does the rest.

---

## The Problem It Solves

Manual job applications are slow and generic. Recruiters use ATS (Applicant Tracking Systems) that filter CVs by keyword match before a human ever reads them. Most applications fail at this stage. This system fixes that by:

- Automatically finding relevant job listings daily
- Analyzing each job description for exact ATS keywords
- Rewriting the CV to mirror those keywords (truthfully)
- Sending tailored applications without manual effort

---

## How It Works

```
fly.io triggers Python at 6am daily
  → Scraper fetches new job listings (Indeed, PNet, LinkedIn)
  → Each listing saved to Firestore
  → DeepSeek analyzes job description → extracts ATS keywords, tone, seniority
  → python-docx tailors base CV template per job
  → Tailored .docx uploaded to Firebase Storage
  → React dashboard shows results for review
  → User approves → Python sends application via email
  → Application status tracked in Firestore
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Dashboard | React + TypeScript + Vite + Tailwind + shadcn-ui |
| Backend Engine | Python + FastAPI |
| Hosting (Backend) | fly.io (free tier, scheduled execution) |
| Database | Firebase Firestore |
| File Storage | Firebase Storage |
| AI Brain | DeepSeek API (deepseek-chat model) |
| CV Generation | python-docx |
| Scheduling | fly.io cron (0 6 * * *) |

---

## Core Modules

### 1. Job Scraper (`backend/app/scraper/`)
- Scrapes Indeed, PNet (SA), LinkedIn
- Extracts: title, company, description, location, date posted, source URL
- Deduplicates by URL before saving
- Saves to Firestore `jobs` collection

### 2. JD Analyzer (`backend/app/ai/`)
- Reads job description
- DeepSeek prompt extracts: keywords, required skills, nice-to-have, tone, seniority
- Returns structured JSON attached to the job record

### 3. CV Template Engine (`backend/app/cv/`)
- Base CV stored as `.docx` with placeholders: `{{name}}`, `{{summary}}`, `{{skills}}`, `{{experience_bullets}}`, etc.
- Static sections auto-filled from `userProfile` in Firestore
- Dynamic sections (summary, skills, experience bullets) rewritten per job

### 4. ATS Mirror Layer (`backend/app/cv/ats_mirror.py`)
- DeepSeek rewrites experience bullets to reflect JD keywords
- Prompt enforces truthfulness — only reframes existing experience
- Maximizes ATS pass rate without fabrication

### 5. Document Generator
- `python-docx` injects tailored content into base template
- Generates one `.docx` per job application
- Uploads to Firebase Storage, saves URL to Firestore

### 6. Application Sender (`backend/app/email_sender/`)
- Sends email with tailored CV attached
- Logs to Firestore `applications` collection with status: `sent`

---

## React Dashboard Pages

| Route | Page | Purpose |
|---|---|---|
| `/dashboard` | Overview | Stats: scraped today, CVs generated, sent, interview rate |
| `/dashboard/jobs` | Jobs Board | Table of all scraped jobs with ATS score, filters |
| `/dashboard/jobs/:id` | Job Detail | Full JD, ATS keywords panel, "Generate CV" button |
| `/dashboard/cv-editor` | CV Editor | Base vs tailored CV side-by-side, edit before sending |
| `/dashboard/applications` | Applications | Table of all sent applications + status tracking |
| `/dashboard/settings` | Settings | Profile, job preferences, API keys, email config |

---

## Firebase Structure

```
Firestore
├── jobs/
│   └── {jobId}
│       ├── title, company, location, description
│       ├── source (indeed | pnet | linkedin)
│       ├── datePosted, createdAt
│       ├── atsScore, keywords[]
│       └── cvGenerated (bool)
│
├── applications/
│   └── {appId}
│       ├── jobId, jobTitle, company
│       ├── dateApplied
│       ├── status (pending | sent | rejected | interview)
│       └── cvUrl (Firebase Storage link)
│
└── userProfile/
    └── {userId}
        ├── name, email, phone, linkedin
        ├── keywords[], locations[], jobTypes[]
        ├── deepseekApiKey, scraperSchedule
        └── senderEmail

Firebase Storage
└── cvs/
    └── {jobId}.docx
```

---

## fly.io Schedule

```toml
[[machines]]
  schedule = "0 6 * * *"   # Runs every day at 6am
```

---

## Project Phases

| Phase | Focus | Status |
|---|---|---|
| Phase 1 | Python CV editor + DeepSeek integration | Not started |
| Phase 2 | Job scraper + Firebase setup | Not started |
| Phase 3 | fly.io deployment + scheduling | Not started |
| Phase 4 | React dashboard (all 6 pages) | Not started |
| Phase 5 | Auto email sender + full pipeline test | Not started |

---

## Key Decisions

- **DeepSeek over OpenAI** — cheaper, sufficient for ATS keyword extraction and rewriting
- **fly.io over Vercel/Railway** — free tier supports scheduled execution (cron jobs)
- **Firebase over Supabase** — already familiar, free tier covers this scale
- **python-docx over PDF generation** — `.docx` is what recruiters and ATS systems prefer
- **aggre-job-hub as the shell** — existing React project reused as dashboard frontend; public job board pages remain, dashboard added under `/dashboard` route

---

## Current Project State

The `aggre-job-hub` repo currently holds a public-facing job listing aggregator (South African jobs, STEM careers, resources). The dashboard will be added as a protected `/dashboard` section of the same app. The Python backend is a separate service deployed to fly.io.
