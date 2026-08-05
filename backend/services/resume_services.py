import shutil
from pathlib import Path
from utils.pdf_extractor import extract_text_from_pdf


UPLOAD_DIR = Path("uploads/resumes")

class ResumeService:
    
    @staticmethod
    def upload(file):
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        
        destination = UPLOAD_DIR/file.filename
        
        with open (destination, 'wb') as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        extracted_text = extract_text_from_pdf(str(destination))
        return {
            "filename" : file.filename,
            "path" : str(destination),
            "text" : extracted_text,
        }