from typing import List
import numpy as np

def flex_tune_stabilize_pitch(f0_series: np.ndarray, flex_tune: float) -> np.ndarray:
    """Smooth pitch using moving average."""
    # Handle empty array
    if len(f0_series) == 0:
        return f0_series
    
    # Clamp flex_tune to valid range
    flex_tune = np.clip(flex_tune, 0, 1)
    
    window_size = max(1, int(flex_tune * 10) + 1)
    smoothed = np.convolve(f0_series, np.ones(window_size) / window_size, mode='same')
    return smoothed