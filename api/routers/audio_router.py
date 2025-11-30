from fastapi import HTTPException, File, UploadFile, APIRouter, Form
from services.audio_service import process_audio, get_audio_files_for_user
from utils.logger import logger
from utils.api_response import ApiResponse
from models.audio_model import *
from utils.upload_audio import upload_raw_audio_file

router = APIRouter(
    prefix="/audio",
    tags=["audio"]
)

@router.get("/all-audio-files/{username}", response_model=ApiResponse[AllAudioFilesResponse])
async def get_all_audio_files(username: str):
  try:
    audio_files = get_audio_files_for_user(username)
    return ApiResponse(
      success=True,
      message="Audio files retrieved successfully",
      data=audio_files
    )
  except Exception as e:
    logger.error(f"Error retrieving audio files: {e}")
    raise HTTPException(
      status_code=500,
      detail="Internal Server Error"
    )


@router.post("/upload_audio", response_model=ApiResponse[UploadAudioData])
async def upload_audio(
  file: UploadFile = File(...),
  username: str = Form(...),
  volume: int = Form(...),
  retune_speed: int = Form(...),
  flex_tune: int = Form(...),
  humanize: int = Form(...),
  vibrato: int = Form(...)
):
  try:
    file_path = upload_raw_audio_file(username, file)
      
    data = AudioConfig(
      username=username,
      file_path=file_path, 
      volume=volume,
      flex_tune=flex_tune,
      retune_speed=retune_speed,
      humanize=humanize,
      vibrato=vibrato
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
