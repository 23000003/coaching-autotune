import numpy as np
from typing import List

def detect_pitch(audio: np.ndarray, sr: int) -> np.ndarray:
    """Detect fundamental frequency (F0) using autocorrelation."""
    # Very basic pitch estimation using autocorrelation
    frame_size = 1024
    hop_size = 512
    pitches = []

    for i in range(0, len(audio) - frame_size, hop_size):
        frame = audio[i:i+frame_size]
        corr = np.correlate(frame, frame, mode='full')
        corr = corr[len(corr)//2:]
        d = np.diff(corr)
        
        # Find where derivative is positive
        positive_indices = np.nonzero(d > 0)[0]
        
        # Handle case where no positive derivatives found
        if len(positive_indices) == 0:
            pitches.append(0)  # No valid pitch detected
            continue
            
        start = positive_indices[0]
        peak = np.argmax(corr[start:]) + start
        pitch = sr / peak if peak != 0 else 0
        pitches.append(pitch)

    return np.array(pitches)

