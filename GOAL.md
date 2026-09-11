# CareerGate — Project Goal

## What We're Building

An AI-powered job application assistant for South African job seekers — focused
specifically on **government jobs**. It pulls listings straight from the DPSA
(Department of Public Service and Administration) circular, tailors a CV per
job using DeepSeek AI to mirror ATS requirements, auto-fills the Z83 government
application form, and lets the user download the tailored CV / drafted email
to submit themselves.

The user reviews, generates, and downloads. Government jobs are applied for
directly on the government's own application site, so downloading the tailored
CV and the filled Z83 is the whole job — sending the application is a manual
step outside the platform.

---

## The Problem It Solves

Manual job applications are slow and generic, and government applications
specifically require the Z83 form — a rigid, easy-to-get-wrong document.
Recruiters' ATS systems also filter CVs by keyword match before a human ever
reads them. This system fixes both:

- Surfacing every current DPSA circular listing in one place
- Analyzing each job description for exact ATS keywords
- Rewriting the CV to mirror those keywords (truthfully)
- Auto-filling the Z83 form from the user's profile + uploaded documents
- Producing a ready-to-download tailored CV and cover letter in seconds

---

## How It Works

```
User clicks "Scrape" (anyone, anytime — not on a schedule)
  → DPSA circular fetched + parsed
  → Every listing saved to the shared `jobs` Firestore collection
  → A ~7-day shared lock means nobody re-scrapes until the next DPSA circular
    is actually due (DPSA publishes weekly, on Fridays)
  → Every user reads that same shared listings feed — nobody scrapes their own copy
  → DeepSeek analyzes a chosen job description → extracts ATS keywords, tone, seniority
  → python-docx tailors the user's CV per job
  → Tailored .docx + Z83 form saved per-user in Firestore/Storage
  → React dashboard shows results for review
  → User reviews → downloads the tailored CV/Z83 and applies on the gov site directly
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Dashboard | React + TypeScript + Vite + Tailwind + shadcn/ui |
| Backend Engine | Python + FastAPI |
| Hosting (Backend) | Google Cloud Run (`careergate-api-93102026777.africa-south1.run.app`) |
| Hosting (Frontend) | Firebase Hosting |
| Database | Firebase Firestore (in-memory fallback for local dev only — never in production) |
| File Storage | Firebase Storage |
| AI Brain | DeepSeek API (deepseek-chat model) |
| CV Generation | python-docx |
| Job Source | DPSA circular only — government jobs by design, no private-sector boards |
| Auth | Firebase Auth — email/password + Google sign-in |
| Scraping | On-demand, shared/broadcast (see above) — no cron, no scheduler |

---

## Core Modules

### 1. Job Scraper (`backend/app/scraper/`)
- **DPSA** (`dpsa.py`) — the only source. One circular carries every national
  and provincial department (Health, Basic Education, Agriculture, Sports...).
  Government-only by design; private-company boards are intentionally not scraped.
- Deduplicates by URL before saving to Firestore
- Triggered by `POST /jobs/scrape` (`app/routes/jobs.py`) — shared across all
  users via a `meta/scrape` lock doc, not per-user, not cron-driven

### 2. JD Analyzer (`backend/app/ai/deepseek_client.py`)
- DeepSeek prompt extracts: keywords, required skills, nice-to-have, tone, seniority
- Returns structured JSON; canned fallback analysis if API key unreachable/unset
- Used by `/analyze` and `/tailor-cv` endpoints

### 3. CV Template Engine (`backend/app/cv/`)
- Profile sourced from Firestore (`users/{uid}/profile`)
- Dynamic sections (summary, skills, experience bullets) rewritten per job by DeepSeek

### 4. ATS Mirror Layer (`backend/app/cv/ats_mirror.py`)
- DeepSeek rewrites experience bullets to reflect JD keywords
- Enforces truthfulness — only reframes existing experience
- Maximises ATS pass rate without fabrication

### 5. Document Generator
- `python-docx` generates one `.docx` per job application
- Saved per-user; download URL returned to frontend
- User downloads the file directly from Job Detail / CV Editor and applies manually — the platform does not send applications

### 6. Z83 Form Filler (`backend/app/routes/documents.py`, `src/pages/dashboard/Z83Form.tsx`)
- Extracts fields from an uploaded/blank Z83 PDF (OCR fallback via pytesseract for scanned forms)
- DeepSeek suggests field values from the user's profile + uploaded documents
- Conversational form-chat lets the user correct fields before download

### 7. AI Chatbot — Zara (`src/components/ChatBot.tsx`, `src/pages/dashboard/Chat.tsx`)
- Floating widget on every dashboard page, plus a full chat page
- Page-aware context — prompts and welcome message change per route
- Can take agentic actions (update profile, extract/update CV, add a job) —
  each action is allowlist-validated server-side before it's trusted
- Powered by DeepSeek via `/chat` and `/chat/agent`

### 8. ~~Gmail Drafting~~ — removed
Government jobs are applied for directly on the government's application site,
not by email, so the Gmail OAuth flow and "draft in Gmail" button were removed.
Users download the tailored CV and filled Z83 and apply on the gov site themselves.

---

## React Dashboard Pages

| Route | Page | Purpose |
|---|---|---|
| `/login` | Login | Email/password + Google sign-in |
| `/dashboard` | Overview | Pipeline stats, 7-day chart, scrape trigger |
| `/jobs` | Jobs Board | Shared DPSA listings, search + filter, scrape trigger |
| `/jobs/:id` | Job Detail | Full JD, ATS keywords, generate CV |
| `/cv-editor` | CV List | Saved CV drafts + uploaded documents |
| `/cv-editor/tailor` | CV Editor | Job picker, AI tailor, cover letter, download |
| `/cv-editor/:id` | CV Workspace | Edit a tailored draft, export PDF |
| `/chat` | Chat | Full Zara conversation |
| `/z83` | Z83 Form | Upload/extract/auto-fill/download the government application form |
| `/settings` | Settings | Profile, documents, job preferences |

---

## Firestore / Storage Structure

```
Firestore
├── jobs/{jobId}                          — shared DPSA listings (write: backend only)
├── meta/scrape                           — shared scrape lock/state
└── users/{uid}/
    ├── profile/data                      — name, contact, summary, skills[], experience[], education, preferences
    ├── chatHistory/{sessionId}
    ├── cvDrafts/{draftId}
    ├── savedJobs/{jobId}
    ├── profileDocuments/{docId}          — metadata; file bytes in Storage under users/{uid}/documents/{docId}{ext}
    └── integrations/{name}               — unused today, kept generic for a future OAuth integration
```

---

## Google Cloud Run Deployment

- **Service URL:** `https://careergate-api-93102026777.africa-south1.run.app`
- **Region:** `africa-south1` (Johannesburg)
- **Resources:** scales to zero when idle (cold starts possible)
- **HTTPS:** enforced
- **Required secrets:** `DEEPSEEK_API_KEY` (Firebase Admin uses Application Default Credentials — no key file)
- **Scheduling:** none — scraping is on-demand and shared (see Core Modules #1)

---

## Project Phases

| Phase | Focus | Status |
|---|---|---|
| Phase 1 | CV editor + DeepSeek integration | Done — tailor, ATS mirror, cover letter, DOCX gen all working |
| Phase 2 | DPSA scraper + Firebase setup | Done — shared on-demand scrape, Firestore wired |
| Phase 3 | Cloud Run deployment | Done — no scheduling needed, see above |
| Phase 4 | React dashboard | Done — all pages built, including Z83 form filler and saved-jobs bookmarking |
| Phase 5 | Security hardening | **In progress** — demo-mode bypass removed, auth fails closed on Cloud Run misconfiguration, Firestore fallback fails closed on Cloud Run too, CORS credentials dropped, dependencies pinned, per-account rate limiting on chat |
| Phase 6 | Automated test coverage | **In progress** — 31 backend pytest tests + 15 frontend Vitest tests, both enforced by CI on every push. Highest-value logic (auth fail-closed, DPSA parsing, ATS scoring, scrape caching) is covered; most routes/components still aren't |

---

## What's Left (Priority Order)

1. **Grow test coverage** — the routes/components not yet covered (documents.py, chat.py's DeepSeek path, profile.py, most React pages)
2. **Error monitoring** — Sentry, planned for a later pass
3. **Commit, push, and deploy** — everything above exists only in the local working tree until this happens

---

## Key Decisions

- **DeepSeek over OpenAI** — cheaper, sufficient for ATS keyword extraction and rewriting
- **DPSA only, no private-sector scraping** — government jobs is the whole point of the product, and most private boards (Indeed, LinkedIn, PNet, etc.) block automated scraping anyway
- **Shared, on-demand scrape — no cron** — DPSA updates weekly; one user's scrape refreshes the listings for everyone, so a schedule would just be redundant infrastructure
- **Cloud Run over Vercel/Railway** — scales to zero, `africa-south1` region keeps latency low for SA users
- **Firebase over Supabase** — Firestore + Storage + Auth in one SDK
- **No demo-mode bypass** — removed entirely; every request authenticates with a real Firebase ID token
- **No Gmail integration** — government jobs are applied for on the government's own site, not by email, so the OAuth flow and "draft in Gmail" button were removed; download-and-apply-yourself is the whole flow
- **Real ATS match score** — `/tailor-cv` now returns a score computed from the job's own DeepSeek-extracted keywords actually present in the tailored CV, not a client-side guess
- **python-docx over PDF** — `.docx` is what recruiters and ATS systems prefer
