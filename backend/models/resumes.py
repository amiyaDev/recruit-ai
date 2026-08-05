from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from models.base import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    extracted_text = Column(String, nullable=True)