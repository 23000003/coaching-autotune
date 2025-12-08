import numpy as np
import librosa
import soundfile as sf
from utils.upload_audio import upload_processed_audio_file
from pipeline.index import process_voice_autotune_pipeline
import os
from models.audio_model import AudioConfig

# ----------- HARD CODED PATHS -----------
INPUT_WAV = r"uploads/raw/kenny/2025-12-08-07h16m36s.wav"
OUTPUT_WAV = r"uploads/processed_1234.wav"
# ----------------------------------------

def process_audio() -> str:
    """Processes audio base from config values

    Args:
        data (AudioConfig): contains all audio processing config

    Returns:
        str: message
    """
    
    audio, sr = librosa.load(INPUT_WAV, sr=None, mono=True)
    
    data = AudioConfig(
      username="kenny",
      file_path=INPUT_WAV, 
      volume=5,
      flex_tune=0.5,
      retune_speed=5,
      humanize=5,
      vibrato=5
    )
    
    processed_audio_bytes = process_voice_autotune_pipeline(
        meta=(audio, sr),
        values=data
    )
    
    output_path = os.path.join("uploads/", "processed.wav")

    with open(output_path, "wb") as f:
      f.write(processed_audio_bytes)
     
    return "Processing complete."


process_audio()