import enum


class UserRole(str, enum.Enum):
    USER = "user"
    RECRUITER = "recruiter"
    ADMIN = "admin"


class ResumeFileType(str, enum.Enum):
    PDF = "pdf"
    DOCX = "docx"


class ResumeStatus(str, enum.Enum):
    UPLOADED = "uploaded"
    PARSING = "parsing"
    PARSED = "parsed"
    FAILED = "failed"


class JobStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    READY = "ready"
    FAILED = "failed"


MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024  # 5MB
ALLOWED_RESUME_EXTENSIONS = {".pdf", ".docx"}

COMMON_SKILLS = [
    "python", "javascript", "typescript", "java", "sql", "react",
    "next.js", "node.js", "fastapi", "django", "flask", "docker",
    "kubernetes", "aws", "postgresql", "mongodb", "redis", "git",
]