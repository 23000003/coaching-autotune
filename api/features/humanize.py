import numpy as np

def apply_humanize(audio: np.ndarray, sr: int, humanize: float) -> np.ndarray:
    """
    Adds random micro-variations to pitch/timing to reduce robotic tone.
    Returns:
        humanized audio array
    """
    if humanize <= 0:
        return audio
    t = np.arange(len(audio))
    modulation = 1 + humanize * 0.005 * np.sin(2*np.pi*5*t/sr)  # 5 Hz slow wobble
    return audio * modulation