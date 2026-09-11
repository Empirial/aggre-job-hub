from typing import List, Tuple
from app.models import JobAnalysisResponse


class ATSMirror:
    @staticmethod
    def compute_match(
        summary: str, skills: List[str], experience: List[str], analysis: JobAnalysisResponse
    ) -> Tuple[int, List[str], List[str]]:
        """Real ATS match score: what fraction of the job's own extracted
        keywords/required skills actually show up in the tailored CV text.
        Returns (score_0_to_100, matched_keywords, missing_keywords)."""
        targets = list(dict.fromkeys([*analysis.keywords, *analysis.required_skills]))
        if not targets:
            return 0, [], []

        cv_text = " ".join([summary or "", *skills, *experience]).lower()
        matched = [kw for kw in targets if kw.lower() in cv_text]
        missing = [kw for kw in targets if kw not in matched]
        score = round((len(matched) / len(targets)) * 100)
        return score, matched, missing

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
