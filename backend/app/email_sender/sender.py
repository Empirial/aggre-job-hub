"""
Email sender — sends tailored CV application via Gmail SMTP.

Requires in .env:
    SENDER_EMAIL=you@gmail.com
    SENDER_PASSWORD=your-app-password   (Gmail App Password, not your login password)
    SMTP_SERVER=smtp.gmail.com          (optional, defaults to Gmail)
    SMTP_PORT=587                       (optional)

To generate a Gmail App Password:
    Google Account > Security > 2-Step Verification > App passwords
"""

import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from pathlib import Path
from typing import Optional


SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD", "")


def build_email_body(
    applicant_name: str,
    job_title: str,
    company: str,
    cover_note: Optional[str] = None,
) -> str:
    default_note = (
        f"Please find attached my CV for the {job_title} position at {company}.\n\n"
        f"I am excited about this opportunity and believe my experience aligns well "
        f"with your requirements. I look forward to discussing how I can contribute to your team.\n\n"
        f"Kind regards,\n{applicant_name}"
    )
    return cover_note or default_note


def send_application(
    recipient_email: str,
    applicant_name: str,
    job_title: str,
    company: str,
    cv_path: Path,
    cover_note: Optional[str] = None,
) -> dict:
    """
    Send a job application email with the tailored CV attached.
    Returns {"success": True} or {"success": False, "error": str}.
    """
    if not SENDER_EMAIL or not SENDER_PASSWORD:
        return {
            "success": False,
            "error": "SENDER_EMAIL or SENDER_PASSWORD not configured in .env",
        }

    if not cv_path.exists():
        return {"success": False, "error": f"CV file not found: {cv_path}"}

    msg = MIMEMultipart()
    msg["From"] = SENDER_EMAIL
    msg["To"] = recipient_email
    msg["Subject"] = f"Application for {job_title} — {applicant_name}"

    body = build_email_body(applicant_name, job_title, company, cover_note)
    msg.attach(MIMEText(body, "plain"))

    # Attach CV
    with open(cv_path, "rb") as f:
        part = MIMEBase("application", "octet-stream")
        part.set_payload(f.read())
    encoders.encode_base64(part)
    part.add_header(
        "Content-Disposition",
        f'attachment; filename="{applicant_name.replace(" ", "_")}_CV.docx"',
    )
    msg.attach(part)

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, recipient_email, msg.as_string())
        return {"success": True}
    except smtplib.SMTPAuthenticationError:
        return {
            "success": False,
            "error": "SMTP authentication failed. Check SENDER_EMAIL and SENDER_PASSWORD (use Gmail App Password).",
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
