import os
import glob
import base64
import numpy as np
import soundfile as sf
from utils.logger import logger
from typing import List
from typing import Tuple
from pipeline.index import process_voice_autotune_pipeline
from models.audio_model import AllAudioFilesResponse, AudioConfig, MetadataInfo
from fastapi.responses import FileResponse
from utils.upload_audio import upload_processed_audio_file


def get_audio_files_for_user(username: str) -> AllAudioFilesResponse:
    """
    Get all wav files for a specific user from both raw and processed directories.
    Includes filename + Base64 encoded content.
    """
    raw_files: List[MetadataInfo] = []
    processed_files: List[MetadataInfo] = []

    raw_dir = f"uploads/raw/{username}"
    processed_dir = f"uploads/processed/{username}"

    if os.path.exists(raw_dir):
        raw_wav_files = glob.glob(os.path.join(raw_dir, "*.wav"))
        for file_path in raw_wav_files:
            try:
                with open(file_path, "rb") as f:
                    file_data = f.read()
                    encoded_data = base64.b64encode(file_data).decode("utf-8")

                    raw_files.append(MetadataInfo(
                        filename=os.path.basename(file_path),
                        encoded_data=encoded_data
                    ))
            except Exception as e:
                logger.warning(f"Could not read raw file {file_path}: {e}")
                raise e

    if os.path.exists(processed_dir):
        processed_wav_files = glob.glob(os.path.join(processed_dir, "*.wav"))
        for file_path in processed_wav_files:
            try:
                with open(file_path, "rb") as f:
                    file_data = f.read()
                    encoded_data = base64.b64encode(file_data).decode("utf-8")

                    processed_files.append(MetadataInfo(
                        filename=os.path.basename(file_path),
                        encoded_data=encoded_data
                    ))
            except Exception as e:
                logger.warning(f"Could not read processed file {file_path}: {e}")
                raise e

    raw_files.sort(key=lambda x: x.filename)
    processed_files.sort(key=lambda x: x.filename)

    return AllAudioFilesResponse(
        username=username,
        raw_files=raw_files,
        processed_files=processed_files
    )

async def process_audio(data: AudioConfig) -> str:
    """Processes audio base from config values

    Args:
        data (AudioConfig): contains all audio processing config

    Returns:
        str: message
    """
    
    audio, sr = sf.read(data.file_path)

    # Ensure mono
    if len(audio.shape) > 1:
        audio = np.mean(audio, axis=1).astype(np.float32)

    # Normalize audio amplitude to [-1,1]
    audio = audio.astype(np.float32)
    
    max_val = np.max(np.abs(audio))
    
    if max_val > 0:
        audio /= max_val
        
    processed_audio_bytes = process_voice_autotune_pipeline(
        meta=(audio, sr),
        values=data
    )
    
    upload_processed_audio_file(data.username, processed_audio_bytes)
     
    return "Processing complete."