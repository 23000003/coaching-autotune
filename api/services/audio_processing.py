from models.audio_model import AudioConfig
from algorithms.humanizer import autotune_with_humanize
from algorithms.pitchshift import pitch_shift_audio

async def process_audio(data: AudioConfig) -> str:
    
    pitch_shift_audio(data.file_path, "../uploads/processed/test.wav", 5)
    return data.file_path