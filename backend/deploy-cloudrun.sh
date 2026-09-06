#!/usr/bin/env bash
# Deploy the CareerGate AI server (Zara) to Google Cloud Run.
#
# Prerequisites (one-time):
#   gcloud auth login
#   gcloud config set project jobs-e038b
#   gcloud services enable run.googleapis.com cloudbuild.googleapis.com \
#       artifactregistry.googleapis.com firestore.googleapis.com
#
# The DeepSeek key is stored in Secret Manager, not in this file:
#   printf '%s' 'YOUR_DEEPSEEK_KEY' | gcloud secrets create DEEPSEEK_API_KEY --data-file=-
#   gcloud secrets add-iam-policy-binding DEEPSEEK_API_KEY \
#       --member="serviceAccount:$(gcloud projects describe jobs-e038b --format='value(projectNumber)')-compute@developer.gserviceaccount.com" \
#       --role=roles/secretmanager.secretAccessor
#
# Firebase needs NO key file on Cloud Run — the runtime service account is used
# via Application Default Credentials. Just grant it Firestore + Storage access.

set -euo pipefail

PROJECT_ID="${PROJECT_ID:-jobs-e038b}"
REGION="${REGION:-africa-south1}"
SERVICE="${SERVICE:-careergate-api}"
STORAGE_BUCKET="${STORAGE_BUCKET:-jobs-e038b-documents}"

gcloud run deploy "$SERVICE" \
  --project "$PROJECT_ID" \
  --region "$REGION" \
  --source . \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --concurrency 20 \
  --min-instances 0 \
  --max-instances 5 \
  --set-env-vars "GOOGLE_CLOUD_PROJECT=${PROJECT_ID},FIREBASE_STORAGE_BUCKET=${STORAGE_BUCKET},DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions,DEMO_MODE_ENABLED=true" \
  --set-secrets "DEEPSEEK_API_KEY=DEEPSEEK_API_KEY:latest"

echo
echo "Deployed. Service URL:"
gcloud run services describe "$SERVICE" --project "$PROJECT_ID" --region "$REGION" --format 'value(status.url)'
echo "Put that URL in the frontend .env as VITE_API_URL"
