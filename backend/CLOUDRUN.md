# Running Zara (the AI server) on Google Cloud Run

The AI assistant, CV tailoring, document handling and job scraping all live in
this `backend/` folder (FastAPI + DeepSeek + Firebase Admin). Cloud Run is the
host; Firebase (Firestore + Storage + Auth) is the data layer.

## 1. One-time Google Cloud setup

```bash
gcloud auth login
gcloud config set project jobs-e038b
gcloud services enable run.googleapis.com cloudbuild.googleapis.com \
    artifactregistry.googleapis.com firestore.googleapis.com secretmanager.googleapis.com
```

## 2. Store the DeepSeek key

```bash
printf '%s' 'YOUR_DEEPSEEK_KEY' | gcloud secrets create DEEPSEEK_API_KEY --data-file=-
PROJNUM=$(gcloud projects describe jobs-e038b --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding DEEPSEEK_API_KEY \
  --member="serviceAccount:${PROJNUM}-compute@developer.gserviceaccount.com" \
  --role=roles/secretmanager.secretAccessor
```

## 3. Firebase credentials — nothing to do

On Cloud Run the service account is picked up automatically (Application
Default Credentials). No service-account JSON file, no `FIREBASE_CREDENTIALS_*`
env vars. Make sure the runtime service account has:

- `roles/datastore.user` (Firestore read/write)
- `roles/storage.objectAdmin` on the documents bucket

## 4. Deploy

```bash
cd backend
./deploy-cloudrun.sh
```

It prints the service URL, e.g. `https://careergate-api-xxxxx.africa-south1.run.app`.

## 5. Point the website at it

Put the URL in the project root `.env`:

```
VITE_API_URL="https://careergate-api-xxxxx.africa-south1.run.app"
```

## 6. Job scraping — no cron needed

There is no scheduled scraper and none is needed. `POST /jobs/scrape`
(`app/routes/jobs.py`) is a shared, on-demand action: whoever triggers it
(any signed-in user pressing "Scrape" in the Jobs Board) pulls the DPSA
circular once, saves it to the shared `jobs` Firestore collection, and
every other user just reads that same data — nobody scrapes their own
copy. A 12-hour lock/cache (`SCRAPE_FRESH_HOURS`) stops back-to-back
triggers from re-scraping needlessly.

DPSA only publishes a new circular about once a week (Fridays), so a
scrape earlier in the week already has the latest data — re-scraping mid-week
just re-fetches the same circular.

## CORS

Allowed origins live in `app/main.py` (`ALLOWED_ORIGINS`) and already include
careergate.co.za, the Firebase Hosting domains, localhost, plus a regex for
Lovable preview URLs. Add any new domain there before deploying.
