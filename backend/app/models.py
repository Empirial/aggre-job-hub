from typing import List, Optional
from pydantic import BaseModel, Field


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
