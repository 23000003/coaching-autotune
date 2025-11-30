import numpy as np

def apply_filtering(audio: np.ndarray, sr: int) -> np.ndarray:
    """
    Applies noise reduction & EQ filtering.
    filtering: 0–1
    Returns:
        filtered audio array
    """
    return audio  # mock pass-through