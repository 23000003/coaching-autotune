import shutil
import uuid
from fastapi import File
import os

UPLOAD_RAW_DIR = "../uploads/raw"
UPLOAD_PROCESSED_DIR = "../uploads/processed"

os.makedirs(UPLOAD_RAW_DIR, exist_ok=True)
os.makedirs(UPLOAD_PROCESSED_DIR, exist_ok=True)

def upload_raw_audio_file(username: str, file: File) -> str:
  filename = f"{uuid.uuid4()}.wav"
  
  user_dir = os.path.join(UPLOAD_RAW_DIR, username)
  os.makedirs(user_dir, exist_ok=True)
  
  file_path = os.path.join(user_dir, filename)
  
  with open(file_path, "wb") as buffer:
    shutil.copyfileobj(file.file, buffer)

  return file_path

def upload_processed_audio_file(username: str, file: any) -> str:
  filename = f"{uuid.uuid4()}.wav"
  return "file_path"