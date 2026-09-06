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
    source: Literal["indeed", "pnet", "linkedin", "adzuna", "jooble", "careerjet", "reed", "themuse", "dpsa", "manual"]
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


class ManualJobRequest(BaseModel):
    title: str = Field(max_length=200)
    company: str = Field(max_length=200)
    location: str = Field(max_length=200)
    description: str = Field(max_length=6000)
    url: Optional[str] = Field(default=None, max_length=500)


# ── CV tailoring ──────────────────────────────────────────────────────────────

class JobAnalysisRequest(BaseModel):
    title: str = Field(max_length=200)
    company: Optional[str] = Field(default=None, max_length=200)
    location: Optional[str] = Field(default=None, max_length=200)
    description: str = Field(max_length=6000)


class JobAnalysisResponse(BaseModel):
    keywords: List[str]
    required_skills: List[str]
    nice_to_have: List[str]
    seniority: str
    tone: str
    summary: str


class CVProfile(BaseModel):
    name: str = Field(max_length=200)
    email: str = Field(max_length=200)
    phone: Optional[str] = Field(default=None, max_length=50)
    linkedin: Optional[str] = Field(default=None, max_length=200)
    summary: Optional[str] = Field(default=None, max_length=6000)
    skills: List[str] = Field(default_factory=list)
    experience: List[str] = Field(default_factory=list)
    education: Optional[str] = Field(default=None, max_length=2000)


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


class CVDocxRequest(BaseModel):
    profile: CVProfile
    summary: str = Field(default="", max_length=6000)
    skills: List[str] = Field(default_factory=list)
    experience: List[str] = Field(default_factory=list)
    education: Optional[str] = Field(default=None, max_length=2000)
    job_title: Optional[str] = Field(default=None, max_length=200)


class CVDocxResponse(BaseModel):
    docx_path: str


