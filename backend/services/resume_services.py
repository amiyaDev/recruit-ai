import uuid
from pathlib import Path

from sqlalchemy.orm import Session

from core.constants import ALLOWED_RESUME_EXTENSIONS, MAX_RESUME_SIZE_BYTES, ResumeFileType, ResumeStatus
from core.exceptions import NotFoundError, ValidationError
from models.resumes import Resume
from repositories.ats_repository import ATSRepository
from repositories.resume_repository import ResumeRepository
from services.parsing_service import parse_resume_text
from utils.docx_extractor import extract_text_from_docx
from utils.pdf_extractor import extract_text_from_pdf
from services.embedding_service import delete_vector, upsert_vector
from core.constants import RESUMES_COLLECTION

UPLOAD_DIR = Path("uploads/resumes")


class ResumeService:

    @staticmethod
    def upload(db: Session, user_id: uuid.UUID, filename: str, contents: bytes) -> Resume:
        extension = Path(filename).suffix.lower()
        if extension not in ALLOWED_RESUME_EXTENSIONS:
            raise ValidationError("Only PDF and DOCX files are supported")

        if len(contents) > MAX_RESUME_SIZE_BYTES:
            raise ValidationError("File exceeds the 5MB size limit")

        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        stored_name = f"{uuid.uuid4().hex}{extension}"
        destination = UPLOAD_DIR / stored_name

        with open(destination, "wb") as buffer:
            buffer.write(contents)

        file_type = ResumeFileType.PDF if extension == ".pdf" else ResumeFileType.DOCX

        resume = ResumeRepository.create(
            db,
            {
                "user_id": user_id,
                "filename": filename,
                "file_path": str(destination),
                "file_type": file_type,
                "status": ResumeStatus.UPLOADED,
            },
        )

        return ResumeService._process(db, resume)

    @staticmethod
    def _process(db: Session, resume: Resume) -> Resume:
        try:
            ResumeRepository.update(db, resume, {"status": ResumeStatus.PARSING})

            if resume.file_type == ResumeFileType.PDF:
                text = extract_text_from_pdf(resume.file_path)
            else:
                text = extract_text_from_docx(resume.file_path)

            if not text.strip():
                raise ValueError("No extractable text found — likely a scanned/image-based file")

            parsed_data = parse_resume_text(text)
            upsert_vector(
                RESUMES_COLLECTION,
                resume.id,
                text,
                payload={"resume_id": str(resume.id), "user_id": str(resume.user_id)},
            )
            return ResumeRepository.update(
                db,
                resume,
                {"raw_text": text, "parsed_data": parsed_data, "status": ResumeStatus.PARSED},
            )
        except Exception:
            return ResumeRepository.update(db, resume, {"status": ResumeStatus.FAILED})

    @staticmethod
    def list_for_user(db: Session, user_id: uuid.UUID, skip: int, limit: int) -> list[Resume]:
        return ResumeRepository.list_by_user(db, user_id, skip, limit)

    @staticmethod
    def get_owned(db: Session, user_id: uuid.UUID, resume_id: uuid.UUID) -> Resume:
        resume = ResumeRepository.get_by_id(db, resume_id)
        if not resume or resume.user_id != user_id:
            raise NotFoundError("Resume not found")
        return resume

    @staticmethod
    def delete(db: Session, user_id: uuid.UUID, resume_id: uuid.UUID) -> None:
        resume = ResumeService.get_owned(db, user_id, resume_id)
        ATSRepository.delete_by_resume(db, resume.id)
        delete_vector(RESUMES_COLLECTION, resume.id)
        file_path = Path(resume.file_path)
        if file_path.exists():
            file_path.unlink()
        ResumeRepository.delete(db, resume)

    @staticmethod
    def reparse(db: Session, user_id: uuid.UUID, resume_id: uuid.UUID) -> Resume:
        resume = ResumeService.get_owned(db, user_id, resume_id)
        return ResumeService._process(db, resume)