import numpy as np

def apply_vibrato(audio: np.ndarray, sr: int, vibrato: float) -> np.ndarray:
    """
    Adds vibrato via LFO-based delay modulation.
    vibrato: intensity (0 = none, 1 = light, 2 = strong, capped internally)
    """

    # if vibrato <= 0:
    #     return audio

    # max_vibrato = 3.0
    # vibrato = min(vibrato, max_vibrato)

    # # Tone down max depth further to reduce wobble
    # base_depth = 0.0003
    # max_depth = 0.0015

    # depth = base_depth + (max_depth - base_depth) * (vibrato / max_vibrato)**0.6

    # min_rate = 5.0
    # max_rate = 8.0

    # rate = min_rate + (max_rate - min_rate) * (vibrato / max_vibrato)

    # t = np.arange(len(audio)) / sr

    # lfo = depth * np.sin(2 * np.pi * rate * t)

    # positions = (t + lfo) * sr
    # positions = np.clip(positions, 0, len(audio) - 1)

    # vibrato_audio = np.interp(positions, np.arange(len(audio)), audio)

    return audio # mock