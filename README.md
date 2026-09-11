# CareerGate

An AI-powered job application assistant for South African job seekers — focused
on **government jobs**. CareerGate pulls listings straight from the DPSA
(Department of Public Service and Administration) circular, tailors a CV per
job with DeepSeek to mirror ATS requirements, and auto-fills the Z83
government application form. The user reviews, downloads the tailored CV and
filled Z83, and applies directly on the government's own application site —
CareerGate never submits an application on anyone's behalf.

See [`GOAL.md`](GOAL.md) for the full architecture, [`PRODUCT.md`](PRODUCT.md)
for the product vision, and [`DESIGN.md`](DESIGN.md) for the design system.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui |
| Backend | Python + FastAPI |
| Database | Firebase Firestore |
| File storage | Firebase Storage |
| Auth | Firebase Auth (email/password + Google) |
| AI | DeepSeek (`deepseek-chat`) |
| Hosting | Firebase Hosting (frontend) · Google Cloud Run (backend) |

## Project structure

```
src/                    React frontend
backend/                FastAPI backend
  app/routes/           API endpoints (jobs, documents, chat, profile)
  app/scraper/           DPSA circular scraper
  app/ai/                DeepSeek client
  app/cv/                CV tailoring + .docx generation
.github/workflows/      CI/CD pipeline
GOAL.md, PRODUCT.md, DESIGN.md   product and design docs
```

## Getting started

### Prerequisites

- Node.js 20+
- Python 3.11+
- A Firebase project with Auth, Firestore, and Storage enabled
- A [DeepSeek](https://platform.deepseek.com) API key (optional for local dev —
  the app falls back to canned responses without one)

### 1. Clone and install the frontend

```bash
git clone https://github.com/Empirial/aggre-job-hub.git
cd aggre-job-hub
npm install
```

### 2. Configure the frontend

```bash
cp .env.example .env
```

Fill in your Firebase web app config (Firebase Console → Project Settings →
General → Your apps):

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_API_URL=http://localhost:8000
```

Leaving these blank still runs the app — sign-in and Firestore-backed features
are just disabled until they're set.

### 3. Run the frontend

```bash
npm run dev
```

Opens at **http://localhost:8080**.

### 4. Set up the backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate      # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Fill in `backend/.env`:

```
DEEPSEEK_API_KEY=                              # optional — canned responses if unset
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json   # a service-account key, local dev only
FIREBASE_STORAGE_BUCKET=
```

Without Firebase credentials, the backend still runs locally against an
in-memory store that resets on restart — enough to poke around without a
Firebase project set up. (On a real deployment, missing credentials cause the
backend to refuse to start rather than run in that mode — see `GOAL.md`.)

`tesseract-ocr` needs to be installed system-wide for the OCR fallback on
scanned PDFs (the Docker image installs it automatically; for local dev,
`apt install tesseract-ocr` / `brew install tesseract` / the
[Windows installer](https://github.com/UB-Mannheim/tesseract/wiki)).

### 5. Run the backend

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Auto-generated API docs at **http://localhost:8000/docs**.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Frontend dev server |
| `npm run build` | Production frontend build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type-check the frontend |
| `npm test` | Frontend test suite (Vitest) |

Backend tests: from `backend/`, `pip install -r requirements-dev.txt` then `pytest`.

## CI/CD

Every push is linted, type-checked, tested, and built automatically
(`.github/workflows/ci-cd.yml`) — both the frontend (Vitest) and backend
(pytest) suites have to pass before anything can deploy. A push to `main`
also redeploys both services — see that file for the GitHub secrets it needs
to actually deploy.

## Deployment

- **Backend → Google Cloud Run**: see [`backend/DEPLOYMENT.md`](backend/DEPLOYMENT.md)
  and [`backend/CLOUDRUN.md`](backend/CLOUDRUN.md)
- **Frontend → Firebase Hosting**: `firebase deploy`
