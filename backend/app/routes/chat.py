import logging
import os
from datetime import datetime, timezone
from typing import List, Literal, Optional
import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from app.limiter import limiter
from app.auth import require_auth
from app import firebase_client as db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/chat", tags=["chat"])

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_URL = os.getenv("DEEPSEEK_API_URL", "https://api.deepseek.com/v1/chat/completions")

BASE_SYSTEM_PROMPT = """You are CareerGate AI, a specialist job search assistant for South African job seekers.
You help users tailor CVs, extract ATS keywords, write cover letters, prepare for interviews, and understand the local job market.

Context:
- South African market: DPSA government jobs, Indeed, PNet, LinkedIn
- Key industries: banking (FNB, Standard Bank, Absa, Nedbank), tech, mining, retail (Shoprite, Pick n Pay)
- Government forms: Z83, DPSA listings
- Local ATS platforms: Taleo, SAP SuccessFactors, Oracle HCM
- Currency: South African Rand (ZAR)
- Relevant legislation: POPIA, BCEA, BBBEE, Employment Equity Act

Rules:
- Be concise and practical. No fluff.
- Always tailor advice to the South African market.
- When giving salary benchmarks, use ZAR monthly gross figures.
- When listing ATS keywords, be specific to the job posting context.
- Format responses with markdown: **bold** for emphasis, numbered lists for steps, tables for salary data.
- When the user's profile is available, ALWAYS personalise your answer using their actual name, skills, experience, and job applications."""


def _build_system_prompt(ctx: dict) -> str:
    """Inject the user's full context into the system prompt."""
    profile = ctx.get("profile") or {}
    applications = ctx.get("applications") or []
    saved_jobs = ctx.get("saved_jobs") or []
    cv_drafts = ctx.get("cv_drafts") or []
    recent_jobs = ctx.get("recent_scraped_jobs") or []

    lines = [BASE_SYSTEM_PROMPT, "\n\n--- USER CONTEXT ---"]

    if profile:
        lines.append(f"Name: {profile.get('name', 'Unknown')}")
        if profile.get("email"):
            lines.append(f"Email: {profile['email']}")
        if profile.get("summary"):
            lines.append(f"Professional Summary: {profile['summary']}")
        if profile.get("skills"):
            lines.append(f"Skills: {', '.join(profile['skills'])}")
        if profile.get("experience"):
            exp = profile["experience"]
            if isinstance(exp, list):
                lines.append("Experience:\n" + "\n".join(f"  - {e}" for e in exp[:5]))
            else:
                lines.append(f"Experience: {exp}")
        if profile.get("education"):
            lines.append(f"Education: {profile['education']}")
        if profile.get("locations"):
            lines.append(f"Preferred Locations: {', '.join(profile['locations'])}")
        if profile.get("keywords"):
            lines.append(f"Job Keywords: {', '.join(profile['keywords'])}")
    else:
        lines.append("Profile: Not set up yet.")

    if applications:
        lines.append(f"\nRecent Applications ({len(applications)}):")
        for a in applications[:5]:
            lines.append(f"  - {a.get('job_title', '?')} at {a.get('company', '?')} [{a.get('status', '?')}]")

    if saved_jobs:
        lines.append(f"\nSaved Jobs ({len(saved_jobs)}):")
        for j in saved_jobs[:5]:
            lines.append(f"  - {j.get('title', '?')} at {j.get('company', '?')} ({j.get('location', '?')})")

    if cv_drafts:
        lines.append(f"\nCV Drafts saved: {len(cv_drafts)}")
        for d in cv_drafts[:3]:
            lines.append(f"  - Tailored for: {d.get('job_title', '?')}")

    if recent_jobs:
        lines.append(f"\nRecently scraped jobs on platform ({len(recent_jobs)}):")
        for j in recent_jobs[:5]:
            lines.append(f"  - {j.get('title', '?')} at {j.get('company', '?')} via {j.get('source', '?')}")

    lines.append("--- END USER CONTEXT ---")
    return "\n".join(lines)


FALLBACK_RESPONSES = {
    "cv": """Here's how to optimise your CV for South African ATS systems:

1. **Mirror the job description** — use exact phrases from the posting
2. **Quantify achievements** — "reduced latency by 40%" beats "improved performance"
3. **Single-column layout** — most ATS parsers fail on multi-column CVs
4. **Skills near the top** — ATS scores the first 60% of your CV higher
5. **No tables or text boxes** — they break parsing

For banking roles (FNB, Absa, Standard Bank), include: Java, Python, REST APIs, Microservices, Docker, CI/CD, POPIA, FICA, Agile/SAFe.""",

    "salary": """2026 South African tech salary benchmarks (monthly gross, Johannesburg):

| Role | Junior | Mid | Senior |
|---|---|---|---|
| Python Developer | R28k–R38k | R42k–R58k | R65k–R90k |
| Full Stack (React/Node) | R30k–R42k | R45k–R62k | R68k–R95k |
| DevOps / Cloud | R35k–R48k | R52k–R72k | R78k–R110k |
| Data Engineer | R32k–R45k | R50k–R68k | R72k–R100k |

Banking sector pays 15–25% above market. Remote roles add 10–20%.""",

    "default": """I can help you with CV tailoring, ATS keyword extraction, cover letters, interview preparation, and South African job market insights.

Try asking:
- "What ATS keywords should I use for a banking developer role?"
- "What salary should I expect as a Python developer in Johannesburg?"
- "Write a cover letter for a Full Stack Developer role at Takealot"
- "How do I prepare for a technical interview at FNB?"

What do you need help with?""",
}


def _fallback(messages: List[dict]) -> str:
    last = messages[-1]["content"].lower() if messages else ""
    if any(w in last for w in ["salary", "pay", "earn", "rate", "compensation"]):
        return FALLBACK_RESPONSES["salary"]
    if any(w in last for w in ["cv", "resume", "ats", "keyword", "tailor", "optimis"]):
        return FALLBACK_RESPONSES["cv"]
    return FALLBACK_RESPONSES["default"]


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(max_length=2000)


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str
    session_id: str


class ChatSession(BaseModel):
    session_id: str
    messages: List[dict]
    updated_at: str


@router.post("", response_model=ChatResponse)
@limiter.limit("30/minute")
async def chat(request: Request, body: ChatRequest, uid: str = Depends(require_auth)):
    if not body.messages:
        raise HTTPException(status_code=400, detail="No messages provided")

    session_id = body.session_id or datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")

    # Load existing session or start fresh
    existing = db.get_chat_session(uid, session_id)
    stored_messages: List[dict] = existing["messages"] if existing else []

    # Build context-aware system prompt
    try:
        user_ctx = db.get_user_context(uid)
        system_prompt = _build_system_prompt(user_ctx)
    except Exception:
        system_prompt = BASE_SYSTEM_PROMPT

    raw_messages = [{"role": m.role, "content": m.content} for m in body.messages[-20:]]

    if not DEEPSEEK_API_KEY:
        reply = _fallback(raw_messages)
    else:
        payload = [{"role": "system", "content": system_prompt}] + raw_messages
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(
                    DEEPSEEK_URL,
                    json={
                        "model": "deepseek-chat",
                        "messages": payload,
                        "temperature": 0.5,
                        "max_tokens": 800,
                    },
                    headers={
                        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                        "Content-Type": "application/json",
                    },
                )
                res.raise_for_status()
                reply = res.json()["choices"][0]["message"]["content"].strip()
        except Exception as exc:
            logger.error("chat endpoint failed: %s", exc, exc_info=True)
            reply = _fallback(raw_messages)

    # Persist full session
    now = datetime.now(timezone.utc).isoformat()
    new_entries = [
        *[{"role": m.role, "content": m.content, "timestamp": now} for m in body.messages[-1:]],
        {"role": "assistant", "content": reply, "timestamp": now},
    ]
    updated_messages = stored_messages + new_entries

    try:
        db.save_chat_session(uid, session_id, updated_messages)
    except Exception as e:
        logger.warning("Failed to save chat session: %s", e)

    return ChatResponse(reply=reply, session_id=session_id)


@router.get("/sessions", response_model=List[ChatSession])
def list_sessions(uid: str = Depends(require_auth)):
    sessions = db.list_chat_sessions(uid)
    return [ChatSession(**s) for s in sessions]


@router.get("/sessions/{session_id}", response_model=ChatSession)
def get_session(session_id: str, uid: str = Depends(require_auth)):
    session = db.get_chat_session(uid, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return ChatSession(**session)


@router.delete("/sessions/{session_id}")
def delete_session(session_id: str, uid: str = Depends(require_auth)):
    db.delete_chat_session(uid, session_id)
    return {"status": "deleted"}
