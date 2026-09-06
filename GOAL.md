# CareerGate — Project Goal

## What We're Building

An AI-powered job application assistant for South African job seekers. It scrapes real job listings from Adzuna (and fallback sources), tailors a CV per job using DeepSeek AI to mirror ATS requirements, and lets the user download the tailored CV to submit themselves.

The user reviews, generates, and downloads. Sending the application is a manual step outside the platform.

---

## The Problem It Solves

Manual job applications are slow and generic. Recruiters use ATS (Applicant Tracking Systems) that filter CVs by keyword match before a human ever reads them. Most applications fail at this stage. This system fixes that by:

- Automatically finding relevant SA job listings daily
- Analyzing each job description for exact ATS keywords
- Rewriting the CV to mirror those keywords (truthfully)
- Producing a ready-to-download tailored CV in seconds

---

## How It Works

```
Cloud Scheduler triggers Python at 6am daily  ← NOT YET ACTIVE
  → Adzuna API fetches real SA job listings
  → Each listing saved to Firestore (with localStorage fallback)
  → DeepSeek analyzes job description → extracts ATS keywords, tone, seniority
  → python-docx tailors base CV template per job
  → Tailored .docx saved locally on backend
  → React dashboard shows results for review
  → User selects job → CV Editor shows duties + tailored output
  → User downloads the tailored .docx and applies manually
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Dashboard | React + TypeScript + Vite + Tailwind + shadcn/ui |
| Backend Engine | Python + FastAPI |
| Hosting (Backend) | Google Cloud Run (`careergate-api-93102026777.africa-south1.run.app`) |
| Hosting (Frontend) | Firebase Hosting |
| Database | Firebase Firestore (with localStorage fallback) |
| File Storage | Firebase Storage |
| AI Brain | DeepSeek API (deepseek-chat model) |
| CV Generation | python-docx |
| Job Source | Adzuna Jobs API (primary) + Indeed/PNet fallback (mock) |
| Auth | Firebase Auth + demo bypass (sessionStorage) |
| Scheduling | Cloud Scheduler — not yet configured |

---

## Core Modules

### 1. Job Scraper (`backend/app/scraper/`)
- **Adzuna** (`adzuna.py`) — real SA listings via API. Requires `ADZUNA_APP_ID` + `ADZUNA_APP_KEY`
- **Indeed** (`indeed.py`) — HTML scraper, falls back to mock data (bot protection)
- **PNet** (`pnet.py`) — HTML scraper, falls back to mock data
- **LinkedIn** (`linkedin.py`) — always mock (ToS restricts scraping)
- Deduplicates by URL before saving to Firestore

### 2. JD Analyzer (`backend/app/ai/deepseek_client.py`)
- DeepSeek prompt extracts: keywords, required skills, nice-to-have, tone, seniority
- Returns structured JSON; fallback analysis if API unreachable
- Used by `/analyze` and `/tailor-cv` endpoints

### 3. CV Template Engine (`backend/app/cv/`)
- Profile sourced from request body (frontend sends it)
- Dynamic sections (summary, skills, experience bullets) rewritten per job by DeepSeek

### 4. ATS Mirror Layer (`backend/app/cv/ats_mirror.py`)
- DeepSeek rewrites experience bullets to reflect JD keywords
- Enforces truthfulness — only reframes existing experience
- Maximises ATS pass rate without fabrication

### 5. Document Generator
- `python-docx` generates one `.docx` per job application
- Saved to local backend storage; download URL returned to frontend
- User downloads the file directly from Job Detail / CV Editor and applies manually — the platform does not send applications

### 6. AI Chatbot (`src/components/ChatBot.tsx`)
- Floating widget on every dashboard page
- Page-aware context — prompts and welcome message change per route
- Mobile: full-screen bottom sheet. Desktop: fixed panel
- Powered by DeepSeek via `/chat` endpoint

---

## React Dashboard Pages

| Route | Page | Status | Purpose |
|---|---|---|---|
| `/login` | Login | Done | Email/password + "Try Demo" bypass |
| `/` | Overview | Done | Pipeline stats, 7-day chart, scraper trigger |
| `/jobs` | Jobs Board | Done | Scraped jobs table, search + filter |
| `/jobs/:id` | Job Detail | Done | Full JD, ATS keywords, generate CV |
| `/cv-editor` | CV Editor | Done | Job picker from scraped list, duties preview, AI tailor, download |
| `/preview` | Document AI | Done | PDF upload, field extraction, document chat |
| `/settings` | Settings | Done | Profile, summary, skills, experience, education, job preferences |

---

## Firebase / Storage Structure

```
Firestore
├── jobs/
│   └── {jobId}
│       ├── title, company, location, description
│       ├── source (adzuna | indeed | pnet | linkedin)
│       ├── date_posted, created_at
│       ├── ats_score, keywords[]
│       └── cv_generated (bool)
│
└── userProfile/
    └── default
        ├── name, email, phone, linkedin
        ├── summary, skills[], experience[], education
        ├── keywords[], locations[], jobTypes{}
        └── (falls back to localStorage if Firestore rules block writes)

Backend local storage
└── /uploads/
    ├── profile/      ← uploaded CVs and supporting docs
    └── *.docx        ← generated tailored CVs
```

---

## Google Cloud Run Deployment

- **Service URL:** `https://careergate-api-93102026777.africa-south1.run.app`
- **Region:** `africa-south1` (Johannesburg)
- **Resources:** scales to zero when idle (cold starts possible)
- **HTTPS:** enforced
- **Required secrets:** `DEEPSEEK_API_KEY`, `FIREBASE_CREDENTIALS_JSON`, `FIREBASE_STORAGE_BUCKET`, `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`
- **Cron:** not yet configured — use Cloud Scheduler to POST `/jobs/scrape` at 06:00 SAST daily

---

## Project Phases

| Phase | Focus | Status | Notes |
|---|---|---|---|
| Phase 1 | Python CV editor + DeepSeek integration | **~80% done** | Tailor, ATS mirror, DOCX gen working. Cover letter generation not yet built |
| Phase 2 | Job scraper + Firebase setup | **~90% done** | Adzuna live, Firebase wired. Indeed/PNet/LinkedIn mostly mock |
| Phase 3 | Cloud Run deployment + scheduling | **~70% done** | Backend deployed on Cloud Run. Daily cron via Cloud Scheduler not yet configured |
| Phase 4 | React dashboard | **Done** | All pages built. CV download replaces the send flow |
| Phase 5 | Full pipeline test | **Not started** | Scrape → tailor → download, full flow with real data |

**Overall: ~80% complete**

---

## What's Left (Priority Order)

1. **Configure Cloud Scheduler daily cron** — create a Cloud Scheduler job to POST `/jobs/scrape` at 06:00 SAST automatically
2. **Cover letter generation** — DeepSeek prompt to generate a cover letter per job alongside the tailored CV
3. **End-to-end pipeline test** — scrape → tailor → download, full flow with real data

---

## Key Decisions

- **DeepSeek over OpenAI** — cheaper, sufficient for ATS keyword extraction and rewriting
- **Adzuna over scraping** — reliable SA job API vs brittle HTML scraping
- **Cloud Run over Vercel/Railway** — scales to zero, `africa-south1` region keeps latency low for SA users, integrates natively with Cloud Scheduler and Firebase
- **Firebase over Supabase** — Firestore + Storage + Auth in one SDK
- **localStorage fallback** — profile and settings persist in browser when Firestore rules block client writes
- **python-docx over PDF** — `.docx` is what recruiters and ATS systems prefer
- **Demo bypass** — `sessionStorage` flag skips Firebase Auth for demos without creating a test account
