import numpy as np
from scipy.signal import  lfilter, butter

def apply_filtering(audio: np.ndarray, sr: int) -> np.ndarray:
    """
    Applies noise reduction & EQ filtering.
    filtering: 0–1
    Returns:
        filtered audio array
    """
    nyquist = sr / 2
    cutoff = 80 / nyquist
    b, a = butter(2, cutoff, btype='high')
    filtered_audio = lfilter(b, a, audio)
    return filtered_audio