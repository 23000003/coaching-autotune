import numpy as np

def apply_vibrato(audio: np.ndarray, sr: int, vibrato: float) -> np.ndarray:
    """
    Adds vibrato / modulation effect.
    Returns:
        vibrato-processed audio array
    """
    if vibrato <= 0:
        return audio
    t = np.arange(len(audio))
    modulation = np.sin(2*np.pi*6*t/sr)  # 6 Hz vibrato
    return audio * (1 + vibrato * 0.02 * modulation)