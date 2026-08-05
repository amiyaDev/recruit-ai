from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from services.resume_services import ResumeService


router = APIRouter()

@router.post('/')
async def upload_resume(file: UploadFile = File(...)):
    result = ResumeService.upload(file)
    return result