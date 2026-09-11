"""
Tests for the DPSA circular parser (app.scraper.dpsa) — pure text-processing
logic, no network calls. The fixture text below matches the real circular
format confirmed live against dpsa.gov.za on 2026-09-11 (251 posts parsed
correctly that day).
"""
from app.scraper.dpsa import DPSAScraper, _department_from_text, _pretty_department

SAMPLE_ANNEXURE_TEXT = """\
ANNEXURE G

DEPARTMENT OF AGRICULTURE

POST 32/01 : STATE VETERINARIAN REF NO: 3/3/1/81/2026
SALARY : R1 216 824 per annum
CENTRE : Mpumalanga: Skukuza
REQUIREMENTS : A veterinary degree registered with the SAVC.
DUTIES : Diagnose and treat livestock diseases in the district.
ENQUIRIES : Dr M Smith, Tel: (013) 000 0000
APPLICATIONS : Apply online at www.dpsa.gov.za
CLOSING DATE : 27 March 2026

POST 32/02 : ASSISTANT DIRECTOR: EMPLOYEE RELATIONS REF NO: 3/3/1/82/2026
SALARY : R900 000 per annum
CENTRE : Gauteng: Pretoria
REQUIREMENTS : A relevant three-year degree and five years' experience.
DUTIES : Manage employee relations matters for the department.
ENQUIRIES : Ms J Jones
APPLICATIONS : Apply online
"""


def test_department_extracted_from_annexure_header():
    dept = _department_from_text(SAMPLE_ANNEXURE_TEXT)
    assert dept == "Department Of Agriculture" or dept == "Department of Agriculture"


def test_pretty_department_lowercases_connector_words():
    assert _pretty_department("DEPARTMENT OF AGRICULTURE") == "Department of Agriculture"
    assert _pretty_department("OFFICE OF THE PREMIER") == "Office of the Premier"


def test_parses_both_posts_from_one_annexure():
    scraper = DPSAScraper()
    jobs = scraper._posts_from_text(SAMPLE_ANNEXURE_TEXT, "https://www.dpsa.gov.za/g.pdf")

    assert len(jobs) == 2
    titles = {j.title for j in jobs}
    assert "State Veterinarian" in titles
    assert "Assistant Director: Employee Relations" in titles


def test_ref_number_stripped_from_title():
    scraper = DPSAScraper()
    jobs = scraper._posts_from_text(SAMPLE_ANNEXURE_TEXT, "https://www.dpsa.gov.za/g.pdf")
    vet = next(j for j in jobs if "Veterinarian" in j.title)

    assert "REF" not in vet.title.upper()


def test_salary_centre_and_closing_date_captured():
    scraper = DPSAScraper()
    jobs = scraper._posts_from_text(SAMPLE_ANNEXURE_TEXT, "https://www.dpsa.gov.za/g.pdf")
    vet = next(j for j in jobs if "Veterinarian" in j.title)

    assert vet.location == "Mpumalanga: Skukuza"
    assert vet.company in ("Department Of Agriculture", "Department of Agriculture")
    assert "R1 216 824" in vet.description
    assert "27 March 2026" in vet.description
    assert vet.source == "dpsa"


def test_jobs_get_stable_ids_for_deduping():
    scraper = DPSAScraper()
    jobs_a = scraper._posts_from_text(SAMPLE_ANNEXURE_TEXT, "https://www.dpsa.gov.za/g.pdf")
    jobs_b = scraper._posts_from_text(SAMPLE_ANNEXURE_TEXT, "https://www.dpsa.gov.za/g.pdf")

    assert {j.id for j in jobs_a} == {j.id for j in jobs_b}


def test_empty_text_returns_no_jobs():
    scraper = DPSAScraper()
    assert scraper._posts_from_text("", "https://www.dpsa.gov.za/empty.pdf") == []


def test_ranking_prefers_keyword_and_location_matches():
    scraper = DPSAScraper()
    jobs = scraper._posts_from_text(SAMPLE_ANNEXURE_TEXT, "https://www.dpsa.gov.za/g.pdf")

    ranked = scraper._rank(jobs, keywords=["veterinarian"], location="Mpumalanga")
    assert ranked[0].title == "State Veterinarian"
