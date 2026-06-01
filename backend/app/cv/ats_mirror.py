from typing import List
from app.models import JobAnalysisResponse


class ATSMirror:
    @staticmethod
    def rewrite_summary(base_summary: str, job: object, analysis: JobAnalysisResponse) -> str:
        if base_summary:
            return f"{analysis.summary} {base_summary}"
        return analysis.summary

    @staticmethod
    def rewrite_skills(base_skills: List[str], job: object, analysis: JobAnalysisResponse) -> List[str]:
        result = []
        for skill in base_skills:
            if any(keyword.lower() in skill.lower() for keyword in analysis.keywords):
                result.append(skill)
            else:
                result.append(skill)
        for extra in analysis.required_skills:
            if extra not in result:
                result.append(extra)
        return result[:12]

    @staticmethod
    def rewrite_experience(base_experience: List[str], job: object, analysis: JobAnalysisResponse) -> List[str]:
        rewritten = []
        top_keywords = analysis.keywords[:4]
        join_keywords = ", ".join(top_keywords)
        for item in base_experience:
            if any(keyword.lower() in item.lower() for keyword in top_keywords):
                rewritten.append(item)
            else:
                rewritten.append(f"{item} Demonstrated experience with {join_keywords} in a target-driven environment.")
        return rewritten or [
            f"Proven experience aligned with {join_keywords} and the tone of the job description."
        ]
