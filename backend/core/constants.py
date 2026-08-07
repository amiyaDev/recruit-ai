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


class LLMFeature(str, enum.Enum):
    ATS_SUGGESTIONS = "ats_suggestions"


MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024  # 5MB
ALLOWED_RESUME_EXTENSIONS = {".pdf", ".docx"}

COMMON_SKILLS = [
    # Languages
    "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust",
    "ruby", "php", "kotlin", "swift", "scala", "r",
    # Frontend
    "react", "vue", "angular", "next.js", "nuxt.js", "svelte", "html", "css",
    "sass", "tailwind", "bootstrap", "redux", "webpack", "vite",
    # Backend
    "node.js", "express", "fastapi", "django", "flask", "spring", "spring boot",
    "rails", "laravel", "nestjs", "graphql", "rest api", "grpc",
    # Databases
    "sql", "postgresql", "mysql", "mongodb", "redis", "sqlite", "cassandra",
    "dynamodb", "elasticsearch", "oracle", "firebase",
    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins",
    "ansible", "nginx", "ci/cd", "github actions",
    # Tools & practices
    "git", "github", "gitlab", "jira", "agile", "scrum", "microservices",
    "kafka", "rabbitmq",
    # Data & ML
    "pandas", "numpy", "tensorflow", "pytorch", "scikit-learn",
    "machine learning", "deep learning", "data science", "nlp",
    # Testing
    "jest", "pytest", "selenium", "cypress", "junit",
    # Mobile
    "react native", "flutter", "android", "ios",
]

RESUMES_COLLECTION = "resumes"
JOBS_COLLECTION = "jobs"

GPT_4O_MINI_INPUT_PRICE_PER_1M = 0.15
GPT_4O_MINI_OUTPUT_PRICE_PER_1M = 0.60