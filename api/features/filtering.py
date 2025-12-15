import numpy as np

def apply_filtering(
    audio: np.ndarray, 
    sr: int, 
    voice_gain: float = 1.6,
    noise_attenuation: float = 0.4
) -> np.ndarray:
    """
    Emphasizes human voice by boosting voice frequencies
    and attenuating non-voice frequencies.

    Human voice range ≈ 300–3400 Hz
    """

    fft_data = np.fft.fft(audio)
    freqs = np.fft.fftfreq(len(fft_data), 1 / sr)

    # Voice frequency mask
    voice_mask = (
        (np.abs(freqs) >= 300) &
        (np.abs(freqs) <= 3400)
    )

    fft_data_filtered = fft_data.copy()

    # Boost voice frequencies
    fft_data_filtered[voice_mask] = voice_gain

    # Reduce non-voice frequencies (instead of zeroing)
    fft_data_filtered[~voice_mask]= noise_attenuation

    # Back to time domain
    filtered_audio = np.fft.ifft(fft_data_filtered)
    filtered_audio = np.real(filtered_audio).astype(np.float32)

    return filtered_audio