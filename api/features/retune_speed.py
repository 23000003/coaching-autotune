import numpy as np
from typing import List


def retune_pitch(
    audio: np.ndarray,
    f0_series: List[float],
    target_pitch: List[float],
    retune_speed: float,
) -> np.ndarray:
    """
    Adjust audio pitch toward target pitch over time.
    Returns:
        pitch corrected audio array
    """
    if retune_speed <= 0:
        return audio

    f0 = np.array(f0_series)
    target = np.array(target_pitch)

    # Avoid division by zero / unvoiced frames

    mask = (f0 > 0) & (target > 0)
    corrected = f0.copy()
    alpha = np.clip(retune_speed, 0.001, 1.0)

    for i in range(1, len(f0)):
        if not mask[i]:
            corrected[i] = f0[i]
            continue
        corrected[i] = corrected[i - 1] + alpha * (target[i] - corrected[i - 1])

    eps = 1e-6
    safe_f0 = np.where(f0 > eps, f0, 1.0)

    pitch_delta = np.zeros_like(f0)
    pitch_delta[mask] = 12 * np.log2(corrected[mask] / safe_f0[mask])
    pitch_delta[~mask] = 0.0

    n_frames = len(pitch_delta)
    pitch_curve = np.interp(
        np.linspace(0, n_frames - 1, len(audio)),
        np.arange(n_frames),
        pitch_delta,
    )

    speed_factor = 2 ** (pitch_curve / 12)
    positions = np.cumsum(speed_factor)
    positions = positions / positions[-1] * (len(audio) - 1)

    tuned = np.interp(positions, np.arange(len(audio)), audio)

    return tuned