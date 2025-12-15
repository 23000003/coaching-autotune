from models.audio_model import AudioConfig
import numpy as np
from pedalboard import Pedalboard, HighShelfFilter, Compressor, Chorus, Reverb, Delay


def apply_audio_fx(config: AudioConfig, audio: np.ndarray, sr: int) -> np.ndarray:
    
    """
    Apply audio effects based on the provided configuration.
    Returns:
        Processed audio array with effects applied.
    """
    
    board = Pedalboard([
        HighShelfFilter(cutoff_frequency_hz=400, gain_db=config.air),
        Compressor(
            threshold_db=-20 - config.compression*10,
            ratio=1 + config.compression*4
        ),
        Chorus(rate_hz=1.5, depth=0.7, mix=config.chorus),
        Reverb(room_size=0.1, wet_level=config.reverb),
        Delay(delay_seconds=0.1, feedback=0.25, mix=config.delay),
    ])
    
    return board(audio, sr)