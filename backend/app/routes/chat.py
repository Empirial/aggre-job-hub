import os
from typing import List, Literal
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/chat", tags=["chat"])

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_URL = os.getenv("DEEPSEEK_API_URL", "https://api.deepseek.com/v1/chat/completions")

SYSTEM_PROMPT = """You are CareerGate AI, a specialist job search assistant for South African job seekers.
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
- Format responses with markdown: **bold** for emphasis, numbered lists for steps, tables for salary data."""


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]


class ChatResponse(BaseModel):
    reply: str


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


def _fallback(messages: List[ChatMessage]) -> str:
    last = messages[-1].content.lower() if messages else ""
    if any(w in last for w in ["salary", "pay", "earn", "rate", "compensation"]):
        return FALLBACK_RESPONSES["salary"]
    if any(w in last for w in ["cv", "resume", "ats", "keyword", "tailor", "optimis"]):
        return FALLBACK_RESPONSES["cv"]
    return FALLBACK_RESPONSES["default"]


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.messages:
        raise HTTPException(status_code=400, detail="No messages provided")

    if not DEEPSEEK_API_KEY:
        return ChatResponse(reply=_fallback(request.messages))

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages += [{"role": m.role, "content": m.content} for m in request.messages[-20:]]

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.post(
                DEEPSEEK_URL,
                json={
                    "model": "deepseek-chat",
                    "messages": messages,
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
            return ChatResponse(reply=reply)
    except Exception as exc:
        return ChatResponse(reply=_fallback(request.messages))
