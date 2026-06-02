from typing import List, Optional, Literal
from pydantic import BaseModel, Field
from datetime import datetime


# ── Job scraping ──────────────────────────────────────────────────────────────

class ScrapedJob(BaseModel):
    id: Optional[str] = None
    title: str
    company: str
    location: str
    description: str
    url: str
    source: Literal["indeed", "pnet", "linkedin"]
    date_posted: Optional[str] = None
    ats_score: Optional[int] = None
    keywords: List[str] = Field(default_factory=list)
    cv_generated: bool = False
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class ScrapeRequest(BaseModel):
    keywords: List[str] = Field(default=["software engineer", "developer"])
    location: str = "South Africa"
    max_per_source: int = 10


class ScrapeResponse(BaseModel):
    scraped: int
    saved: int
    jobs: List[ScrapedJob]


# ── CV tailoring ──────────────────────────────────────────────────────────────

class JobAnalysisRequest(BaseModel):
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    description: str


class JobAnalysisResponse(BaseModel):
    keywords: List[str]
    required_skills: List[str]
    nice_to_have: List[str]
    seniority: str
    tone: str
    summary: str


class CVProfile(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    summary: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    experience: List[str] = Field(default_factory=list)
    education: Optional[str] = None


class CVTailorRequest(BaseModel):
    profile: CVProfile
    job: JobAnalysisRequest
    analysis: Optional[JobAnalysisResponse] = None


class CVTailorResponse(BaseModel):
    summary: str
    skills: List[str]
    experience: List[str]
    education: Optional[str] = None
    docx_path: Optional[str] = None


# ── Applications ──────────────────────────────────────────────────────────────

class Application(BaseModel):
    id: Optional[str] = None
    job_id: str
    job_title: str
    company: str
    date_applied: str = Field(default_factory=lambda: datetime.utcnow().date().isoformat())
    status: Literal["pending", "sent", "rejected", "interview"] = "pending"
    cv_path: Optional[str] = None
    cv_url: Optional[str] = None
    recipient_email: Optional[str] = None


class SendApplicationRequest(BaseModel):
    job_id: str
    profile: CVProfile
    recipient_email: str
    cover_note: Optional[str] = None
