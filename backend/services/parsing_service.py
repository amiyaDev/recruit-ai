import re

EMAIL_PATTERN = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
PHONE_PATTERN = re.compile(r"(\+?\d[\d\-\s]{8,}\d)")

COMMON_SKILLS = [
    "python", "javascript", "typescript", "java", "sql", "react",
    "next.js", "node.js", "fastapi", "django", "flask", "docker",
    "kubernetes", "aws", "postgresql", "mongodb", "redis", "git",
]


def parse_resume_text(text: str) -> dict:
    email_match = EMAIL_PATTERN.search(text)
    phone_match = PHONE_PATTERN.search(text)
    lowered = text.lower()
    found_skills = [skill for skill in COMMON_SKILLS if skill in lowered]

    return {
        "email": email_match.group(0) if email_match else None,
        "phone": phone_match.group(0).strip() if phone_match else None,
        "skills": found_skills,
    }