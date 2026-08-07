from core.constants import COMMON_SKILLS


def extract_skills(text: str) -> list[str]:
    lowered = text.lower()
    return [skill for skill in COMMON_SKILLS if skill in lowered]