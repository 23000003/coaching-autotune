import numpy as np

def apply_humanize(audio: np.ndarray, sr: int, humanize: float) -> np.ndarray:
    """
    Adds slow, random pitch variations to make audio less robotic.
    Uses sample rate to create a smooth modulation over time.
    humanize: 0.0 = off, 1.0 = subtle, 2.0+ = stronger effect
    """
    if humanize <= 0:
        return audio

    # duration_sec = len(audio) / sr

    # lfo_freq = max(0.5, 5.0 / humanize) # Testing different values
    lfo_freq = max(0.3, 8.0 / humanize)

    # t = np.linspace(0, duration_sec, len(audio))

    # Generate smooth random noise by filtering white noise
    # Start with white noise and smooth it by lowpass filtering via convolution
    raw_noise = np.random.randn(len(audio))
    window_size = int(sr / lfo_freq)
    window = np.hanning(window_size)
    window /= np.sum(window)

    smooth_noise = np.convolve(raw_noise, window, mode='same')

    smooth_noise /= np.max(np.abs(smooth_noise))

    # Pitch deviation in semitones: max ±0.05 * humanize
    # max_semitone_deviation = 0.1  # Testing different values
    max_semitone_deviation = 0.3 
    pitch_delta = smooth_noise * min(0.05 * humanize, max_semitone_deviation)

    # Convert pitch change → playback speed factor
    speed_factor = 2 ** (pitch_delta / 12)

    # Cumulative “playback position” based on drift
    positions = np.cumsum(speed_factor)
    positions = positions / positions[-1] * (len(audio) - 1)

    # Resample audio at warped positions (micro time-stretch)
    humanized = np.interp(positions, np.arange(len(audio)), audio)

    return humanized