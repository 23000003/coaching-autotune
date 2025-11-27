from fastapi import HTTPException, File, UploadFile, APIRouter, Form
from fastapi.responses import FileResponse
import os
from services.audio_processing import process_audio
from utils.logger import logger
from utils.api_response import ApiResponse
from models.audio_model import *
from utils.upload_audio import upload_raw_audio_file

router = APIRouter(
    prefix="/audio",
    tags=["audio"]
)

@router.post("/upload_audio", response_model=ApiResponse[UploadAudioData])
async def upload_audio(
  file: UploadFile = File(...),
  username: str = Form(...),
  volume: int = Form(...),
  # add more config params
):
  
  try:
    file_path = upload_raw_audio_file(username, file)
      
    data = AudioConfig(
      file_path=file_path, 
      volume=volume
      
    )
    
    processed_file_path = await process_audio(data)
    
    return ApiResponse(
      success=True,
      message="File uploaded successfully",
      data=UploadAudioData(file_url=f"/uploads/{processed_file_path}")
    )
  except Exception as e:
    logger.error(f"Error uploading audio: {e}")
    raise HTTPException(
      status_code=500,
      detail="Internal Server Error"
    )
