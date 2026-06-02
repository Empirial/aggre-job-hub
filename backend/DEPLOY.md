# Deploying to fly.io

## Prerequisites

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login
```

## First deploy

```bash
cd backend

# Launch app (only once)
fly launch --name job-applier-api --region jnb --no-deploy

# Set secrets (never commit these)
fly secrets set DEEPSEEK_API_KEY=sk-your-key-here
fly secrets set FIREBASE_CREDENTIALS_PATH=/app/firebase-credentials.json
fly secrets set FIREBASE_STORAGE_BUCKET=jobs-e038b.firebasestorage.app

# Upload Firebase credentials file as a secret volume
fly secrets set FIREBASE_CREDENTIALS=$(cat firebase-credentials.json | base64)

# Deploy
fly deploy
```

## Re-deploy after changes

```bash
cd backend
fly deploy
```

## Set up daily cron (6am SAST = 4am UTC)

```bash
# Create a scheduled machine that runs the scraper daily
fly machine run . \
  --app job-applier-api \
  --region jnb \
  --schedule "0 4 * * *" \
  --entrypoint "python jobs/schedule.py" \
  --env DEEPSEEK_API_KEY=sk-your-key \
  --env FIREBASE_CREDENTIALS_PATH=/app/firebase-credentials.json \
  --env FIREBASE_STORAGE_BUCKET=jobs-e038b.firebasestorage.app
```

## Useful commands

```bash
# View logs
fly logs --app job-applier-api

# SSH into the machine
fly ssh console --app job-applier-api

# Run scraper manually on fly
fly ssh console --app job-applier-api -C "python jobs/schedule.py"

# Run dry-run
fly ssh console --app job-applier-api -C "python jobs/schedule.py --dry-run"

# Check status
fly status --app job-applier-api

# List machines (including cron)
fly machine list --app job-applier-api
```

## Environment variables

| Variable | Description |
|---|---|
| `DEEPSEEK_API_KEY` | DeepSeek API key from platform.deepseek.com |
| `FIREBASE_CREDENTIALS_PATH` | Path to service account JSON inside container |
| `FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket (jobs-e038b.firebasestorage.app) |

## Handling Firebase credentials on fly.io

fly.io doesn't have persistent volumes on free tier. Options:

1. **Inline secret** (recommended for free tier):
   ```bash
   fly secrets set FIREBASE_CREDENTIALS_JSON="$(cat firebase-credentials.json)"
   ```
   Then in `firebase_client.py`, read from env var instead of file.

2. **fly.io volumes** (paid): mount a persistent volume and store the file there.
