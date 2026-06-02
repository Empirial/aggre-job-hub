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
