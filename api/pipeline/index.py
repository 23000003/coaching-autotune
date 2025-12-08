from typing import Tuple, List
import numpy as np

from models.audio_model import AudioConfig
from utils.wav_bytes_converter import convert_to_wav_bytes
from features.filtering import apply_filtering
from features.retune_speed import retune_pitch
from features.humanize import apply_humanize
# from features.vibrato import apply_vibrato
from features.pitch import detect_pitch
from features.flex_tune import flex_tune_stabilize_pitch
from utils.logger import logger


# ------------------------------------------------------------
#  FINAL AUTOTUNE PIPELINE (FULL VERSION)
# ------------------------------------------------------------
def process_voice_autotune_pipeline(
        meta: Tuple[np.ndarray, int],
        values: AudioConfig,
    ) -> bytes:

    """
    DSP pipeline.
    """

    logger.info(f"Starting voice autotune processing pipeline with values: {values}")

    try:
        audio, sr = meta
        if len(audio) == 0:
            raise ValueError("Audio array is empty")

        logger.info(f"Audio loaded: shape={audio.shape}, sr={sr}")

        # ------------------------------
        # 1) Filtering
        # ------------------------------
        audio = apply_filtering(audio, sr)
        logger.info("Filtering done")

        # ------------------------------
        # 2) Pitch detection
        # ------------------------------
        f0_series = detect_pitch(audio, sr)
        if len(f0_series) == 0:
            raise ValueError("Pitch detection returned empty array")
        logger.info("Pitch detection done")

        # ------------------------------
        # 3) Stabilize pitch baseline (use config value)
        # ------------------------------
        # Use at least 0.3 if flex_tune is too low for processing
        flex_tune_value = max(0.3, values.flex_tune) if values.flex_tune > 0 else 0.5
        target_pitch = flex_tune_stabilize_pitch(f0_series, flex_tune_value)
        logger.info(f"Pitch stabilization done with flex_tune={flex_tune_value}")

        # ------------------------------
        # 6) Pitch correction / retune (use config value)
        # ------------------------------
        # Use at least 0.5 if retune_speed is too low
        retune_value = max(0.5, values.retune_speed) if values.retune_speed > 0 else 0.8
        corrected_audio = retune_pitch(
            audio,
            f0_series,
            target_pitch,
            retune_value,  # 0.0 natural → 1.0 hard-tune
            sr=sr  # Pass sample rate for proper pitch shifting
        )
        logger.info(f"Pitch correction done with retune_speed={retune_value}")

        # ------------------------------
        # 7) Humanization (timing & micro pitch) (use config value)
        # ------------------------------
        corrected_audio = apply_humanize(
            corrected_audio,
            sr,
            0.5
        )
        
        # ------------------------------
        # 9) Convert to WAV bytes
        # ------------------------------
        wav_bytes = convert_to_wav_bytes(corrected_audio, sr)

    except Exception as e:
        logger.error(f"Error in processing pipeline: {e}", exc_info=True)
        raise e

    logger.info("Voice autotune pipeline finished successfully")
    return wav_bytes
