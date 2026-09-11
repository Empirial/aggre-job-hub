"""
Tests for ATSMirror.compute_match — the real, backend-computed ATS score that
replaced the old client-side word-overlap heuristic (see MVP review §03).
"""
from app.cv.ats_mirror import ATSMirror
from app.models import JobAnalysisResponse


def make_analysis(keywords=None, required_skills=None) -> JobAnalysisResponse:
    return JobAnalysisResponse(
        keywords=keywords or [],
        required_skills=required_skills or [],
        nice_to_have=[],
        seniority="Mid",
        tone="Formal",
        summary="A role requiring the listed skills.",
    )


def test_full_match_scores_100():
    analysis = make_analysis(keywords=["Python", "FastAPI"], required_skills=["SQL"])
    score, matched, missing = ATSMirror.compute_match(
        summary="Experienced with Python and FastAPI.",
        skills=["SQL", "Docker"],
        experience=[],
        analysis=analysis,
    )
    assert score == 100
    assert set(matched) == {"Python", "FastAPI", "SQL"}
    assert missing == []


def test_partial_match_scores_between_0_and_100():
    analysis = make_analysis(keywords=["Python", "Kubernetes"], required_skills=["SQL"])
    score, matched, missing = ATSMirror.compute_match(
        summary="Experienced with Python.",
        skills=[],
        experience=[],
        analysis=analysis,
    )
    assert 0 < score < 100
    assert matched == ["Python"]
    assert set(missing) == {"Kubernetes", "SQL"}


def test_no_match_scores_0():
    analysis = make_analysis(keywords=["Rust"], required_skills=["Erlang"])
    score, matched, missing = ATSMirror.compute_match(
        summary="Experienced with Python.",
        skills=["JavaScript"],
        experience=[],
        analysis=analysis,
    )
    assert score == 0
    assert matched == []
    assert set(missing) == {"Rust", "Erlang"}


def test_no_extracted_keywords_scores_0_not_a_crash():
    """A job description DeepSeek couldn't extract anything from shouldn't
    divide by zero — it should just score 0."""
    analysis = make_analysis(keywords=[], required_skills=[])
    score, matched, missing = ATSMirror.compute_match(
        summary="Anything at all.", skills=[], experience=[], analysis=analysis
    )
    assert score == 0
    assert matched == []
    assert missing == []


def test_match_is_case_insensitive():
    analysis = make_analysis(keywords=["python"])
    score, matched, _ = ATSMirror.compute_match(
        summary="I know PYTHON well.", skills=[], experience=[], analysis=analysis
    )
    assert score == 100
    assert matched == ["python"]


def test_keywords_and_required_skills_are_deduplicated():
    """The same term appearing in both keywords and required_skills should
    only count once toward the total, not double the denominator."""
    analysis = make_analysis(keywords=["Python"], required_skills=["Python"])
    score, matched, missing = ATSMirror.compute_match(
        summary="Python experience.", skills=[], experience=[], analysis=analysis
    )
    assert score == 100
    assert matched == ["Python"]
    assert missing == []
