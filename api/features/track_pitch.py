import numpy as np
import librosa
from config.autotune import FRAME_LENGTH, HOP_LENGTH, FMIN, FMAX

def track_pitch(audio: np.ndarray, sr: int) -> np.ndarray:
    """
    Track pitch (fundamental frequency) of the audio using librosa's pyin method.
    
    fmin: minimum frequency to track
    
    fmax: maximum frequency to track
    
    frame_length: length of the analysis frame
    
    hop_length: number of samples between frames
    
    Returns:
        audio (f0): array of fundamental frequencies (in Hz), with np.nan for unvoiced frames
        voiced_flag: boolean array indicating whether each frame is voiced
    """
    
    # Pitch tracking
    audio_f0, _, _ = librosa.pyin(
        audio,
        frame_length=FRAME_LENGTH,
        hop_length=HOP_LENGTH,
        sr=sr,
        fmin=FMIN,
        fmax=FMAX
    )
    
    return audio_f0