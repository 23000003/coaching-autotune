from typing import Tuple
import numpy as np
from models.audio_model import AudioConfig
from utils.wav_bytes_converter import convert_to_wav_bytes
from features.filtering import apply_filtering
from features.retune_speed import retune_pitch
from features.humanize import apply_humanize
from features.vibrato import apply_vibrato
from features.pitch import detect_pitch
from features.flex_tune import flex_tune_stabilize_pitch
from utils.logger import logger

def process_voice_autotune_pipeline(
        meta: Tuple[np.ndarray, int],
        values: AudioConfig,
    ) -> bytes:
    
    """
    Runs the DSP pipeline on the audio file and returns processed output as WAV bytes.
    """
    
    logger.info(f"Starting voice autotune processing pipeline with values: {values}")    
    try:
        # 1) Load wav file
        audio, sr = meta

        # 2) Filtering (pre-cleaning) (jeil)
        audio = apply_filtering(audio, sr) 

        # 3) F0 extraction (pitch detection) (jeil)
        f0_series = detect_pitch(audio, sr)

        # 4) Determine optimal pitch baseline (based on moving average or smoothing) (kenny)
        # where the pitch correction / pitch shifting happens. (research needed)
        target_pitch = flex_tune_stabilize_pitch(f0_series, values.flex_tune)

        # 5) Apply pitch correction / pitch shifting (kenny)
        corrected_audio = retune_pitch(
            audio,
            f0_series,
            target_pitch,
            values.retune_speed
        )

        # 6) Apply voice humanization (clarence)
        corrected_audio = apply_humanize(
            corrected_audio,
            sr,
            values.humanize
        )

        # 7) Vibrato post-effect (clarence)
        corrected_audio = apply_vibrato(
            corrected_audio,
            sr,
            values.vibrato
        )

        # 8) Output as WAV file/bytes
        result_wav_bytes = convert_to_wav_bytes(corrected_audio, sr)
        
    except Exception as e:
        logger.error(f"Error in processing pipeline: {e}")
        raise e
    
    logger.info("Voice autotune processing pipeline completed successfully")
    
    return result_wav_bytes
