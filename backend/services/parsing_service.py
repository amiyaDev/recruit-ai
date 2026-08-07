import re

from services.keyward_service import extract_skills

EMAIL_PATTERN = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
PHONE_PATTERN = re.compile(r"(\+?\d[\d\-\s]{8,}\d)")


def parse_resume_text(text: str) -> dict:
    email_match = EMAIL_PATTERN.search(text)
    phone_match = PHONE_PATTERN.search(text)

    return {
        "email": email_match.group(0) if email_match else None,
        "phone": phone_match.group(0).strip() if phone_match else None,
        "skills": extract_skills(text),
    }