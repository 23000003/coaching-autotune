import numpy as np
from typing import List

def detect_pitch(audio: np.ndarray, sr: int) -> List[float]:
    """
    Detects fundamental frequency over time.
    Returns:
        list of float values representing Hz over frames
    """
    return [200.0] * 1000  # mock: flat 200Hz pitch

