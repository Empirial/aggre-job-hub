# Aggre Job Hub Backend (Phase 1)

This backend contains the Phase 1 Python service for:

- DeepSeek job description analysis
- ATS-friendly CV tailoring
- `.docx` resume generation with `python-docx`

## Setup

```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

## Environment

Set your DeepSeek key if available:

```bash
set DEEPSEEK_API_KEY=your_key_here
```

Optionally override the DeepSeek endpoint:

```bash
set DEEPSEEK_API_URL=https://api.deepseek.ai/v1/chat/completions
```

## Run

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Endpoints

- `GET /health`
- `POST /analyze` - analyze job descriptions and return ATS metadata
- `POST /tailor-cv` - tailor a CV for a job and generate a `.docx` file
- `GET /download/{filename}` - download generated CV
