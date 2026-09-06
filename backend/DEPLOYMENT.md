# Backend Deployment

| | |
|---|---|
| **Service** | `careergate-api` |
| **API URL** | https://careergate-api-93102026777.africa-south1.run.app |
| **Project** | `jobs-e038b` |
| **Region** | `africa-south1` |
| **Platform** | Google Cloud Run |

## Deploy

```bash
cd backend
gcloud run deploy careergate-api --source . --region africa-south1
```

Builds from the local `Dockerfile` and deploys as a new revision. Existing env vars/secrets on the service are preserved across deploys — only override them if you're intentionally changing config.

## Secrets / env vars

Set via `gcloud run services update` (persist across future `deploy` calls):

```bash
gcloud run services update careergate-api --region africa-south1 \
  --update-env-vars DEEPSEEK_API_KEY=your-key,FIREBASE_STORAGE_BUCKET=jobs-e038b.firebasestorage.app
```

Check current config:

```bash
gcloud run services describe careergate-api --region africa-south1
```

## Logs

```bash
gcloud run services logs read careergate-api --region africa-south1
```
