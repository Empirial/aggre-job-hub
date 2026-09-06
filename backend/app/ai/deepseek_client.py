import os
import json
from typing import List
import httpx
from app.models import JobAnalysisRequest, JobAnalysisResponse, CVProfile


class DeepSeekClient:
    def __init__(self, api_key: str, api_url: str = "https://api.deepseek.com/v1/chat/completions"):
        self.api_key = api_key
        self.api_url = api_url

    async def analyze_job_description(self, job: JobAnalysisRequest) -> JobAnalysisResponse:
        if not self.api_key:
            return self._fallback_analysis(job)

        system_prompt = (
            "You are a job description analyzer. Extract ATS-friendly metadata from a job posting. "
            "Return a valid JSON object only."
        )
        user_prompt = (
            f"Job title: {job.title}\n"
            f"Company: {job.company or 'Unknown'}\n"
            f"Location: {job.location or 'Unknown'}\n"
            f"Description: {job.description}\n\n"
            "Provide the following keys: keywords, required_skills, nice_to_have, seniority, tone, summary. "
            "keywords should be a short list of 6-10 ATS terms. "
            "summary should be a concise 2-3 sentence overview of the job and the voice/tone the ideal candidate should use."
        )
        payload = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0.2,
            "max_tokens": 450,
        }
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(self.api_url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()

        content = self._extract_json_content(data)
        try:
            parsed = json.loads(content)
        except json.JSONDecodeError:
            return self._fallback_analysis(job)
        return JobAnalysisResponse(
            keywords=parsed.get("keywords", []),
            required_skills=parsed.get("required_skills", []),
            nice_to_have=parsed.get("nice_to_have", []),
            seniority=parsed.get("seniority", ""),
            tone=parsed.get("tone", ""),
            summary=parsed.get("summary", ""),
        )

    def _extract_json_content(self, data: dict) -> str:
        if "choices" in data and data["choices"]:
            message = data["choices"][0].get("message", {})
            return message.get("content", "{}").strip()
        if "output" in data:
            return json.dumps(data["output"])
        return "{}"

    def _fallback_analysis(self, job: JobAnalysisRequest) -> JobAnalysisResponse:
        text = f"{job.title} {job.company or ''} {job.description}"
        tokens = [token.strip(".,()[]:;-\n\r") for token in text.split() if len(token) > 3]
        keywords = list(dict.fromkeys([token.lower() for token in tokens if token.lower().istitle() or token.isupper()]))[:8]
        if not keywords:
            keywords = [word.lower() for word in tokens[:6]]

        required_skills = [k for k in keywords if k.lower() not in {"the", "and", "with", "for"}][:6]
        nice_to_have = [skill for skill in required_skills[3:]] if len(required_skills) > 3 else []
        seniority = "Mid-level" if "senior" in text.lower() else "Entry-level" if "junior" in text.lower() else "Mid-level"
        tone = "professional and results-oriented"
        summary = (
            f"This role is a {seniority} position focused on {job.title} with an emphasis on {', '.join(required_skills[:3])}. "
            "It requires a proactive team player who can deliver measurable outcomes in a fast-paced environment."
        )

        return JobAnalysisResponse(
            keywords=keywords,
            required_skills=required_skills,
            nice_to_have=nice_to_have,
            seniority=seniority,
            tone=tone,
            summary=summary,
        )

    async def rewrite_experience(self, profile: CVProfile, job_analysis: JobAnalysisResponse) -> List[str]:
        if not self.api_key:
            return self._fallback_experience(profile.experience, job_analysis)

        prompt = (
            f"Rewrite the following experience bullets to mirror the job keywords and tone. "
            f"Keep all accomplishments truthful and avoid fabrication.\n\n"
            f"Job keywords: {', '.join(job_analysis.keywords)}\n"
            f"Experience bullets:\n" + "\n".join(profile.experience)
        )
        payload = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": "You are a professional career resume writer."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.3,
            "max_tokens": 450,
        }
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(self.api_url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()

        content = self._extract_json_content(data)
        bullets = [line.strip("- ") for line in content.splitlines() if line.strip()]
        return bullets or self._fallback_experience(profile.experience, job_analysis)

    def _fallback_experience(self, experience: List[str], job_analysis: JobAnalysisResponse) -> List[str]:
        if not experience:
            return ["Able to adapt existing experience to new ATS keyword requirements."]

        rewritten = []
        keywords_joined = ", ".join(job_analysis.keywords[:3])
        for bullet in experience:
            if any(keyword.lower() in bullet.lower() for keyword in job_analysis.keywords):
                rewritten.append(bullet)
            else:
                rewritten.append(f"{bullet} Experienced in {keywords_joined}.")
        return rewritten

    async def generate_cover_letter(
        self,
        profile: CVProfile,
        job: JobAnalysisRequest,
        analysis: JobAnalysisResponse,
    ) -> str:
        if not self.api_key:
            return self._fallback_cover_letter(profile, job, analysis)

        skills_preview = ", ".join(profile.skills[:6]) if profile.skills else "relevant technical skills"
        keywords_preview = ", ".join(analysis.keywords[:6]) if analysis.keywords else job.title
        experience_preview = "\n".join(profile.experience[:4]) if profile.experience else "extensive experience in the field"

        system_prompt = (
            "You are a professional South African cover letter writer. "
            "Write concise, confident, and professional cover letters tailored to ATS requirements. "
            "Use a warm but formal South African business tone. Do not use flowery language or clichés. "
            "Output plain text only — no markdown, no headers, no bullet points."
        )
        user_prompt = (
            f"Write a 3-paragraph cover letter for the following:\n\n"
            f"Candidate: {profile.name}\n"
            f"Summary: {profile.summary or 'Experienced professional'}\n"
            f"Key skills: {skills_preview}\n"
            f"Experience highlights:\n{experience_preview}\n\n"
            f"Job title: {job.title}\n"
            f"Company: {job.company or 'the company'}\n"
            f"Seniority: {analysis.seniority}\n"
            f"Tone required: {analysis.tone}\n"
            f"ATS keywords to include naturally: {keywords_preview}\n\n"
            "Paragraph 1 — Opening: Why this specific role and company excites the candidate. "
            "Mention the job title and company name.\n"
            "Paragraph 2 — Middle: Relevant experience and how it maps to the role. "
            "Weave in the ATS keywords naturally.\n"
            "Paragraph 3 — Closing: Call to action. Express availability for an interview. "
            "Keep it confident and professional.\n\n"
            "Start directly with the first paragraph. Do not include a greeting or sign-off."
        )

        payload = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0.4,
            "max_tokens": 600,
        }
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(self.api_url, json=payload, headers=headers)
                response.raise_for_status()
                data = response.json()

            if "choices" in data and data["choices"]:
                content = data["choices"][0].get("message", {}).get("content", "").strip()
                if content:
                    return content
        except Exception:
            pass

        return self._fallback_cover_letter(profile, job, analysis)

    def _fallback_cover_letter(
        self,
        profile: CVProfile,
        job: JobAnalysisRequest,
        analysis: JobAnalysisResponse,
    ) -> str:
        company = job.company or "your organisation"
        skills_preview = ", ".join(profile.skills[:4]) if profile.skills else "relevant skills"
        keywords_preview = ", ".join(analysis.keywords[:3]) if analysis.keywords else job.title

        return (
            f"I am writing to express my keen interest in the {job.title} position at {company}. "
            f"Having followed {company}'s work closely, I am confident that my background aligns "
            f"well with your team's goals and the requirements of this role.\n\n"
            f"Throughout my career I have developed strong capabilities in {skills_preview}. "
            f"My experience has given me hands-on exposure to {keywords_preview}, which I believe "
            f"are central to the success of this role. I am committed to delivering measurable "
            f"results and have consistently demonstrated the ability to contribute effectively "
            f"within fast-paced, collaborative environments.\n\n"
            f"I would welcome the opportunity to discuss how my experience can add value to {company}. "
            f"I am available for an interview at your earliest convenience and look forward to "
            f"hearing from you."
        )
