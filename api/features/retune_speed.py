import numpy as np
from typing import List
import librosa

def retune_pitch(
    audio: np.ndarray,
    f0_series: List[float],
    target_pitch: List[float],
    retune_speed: float,
    sr: int = 22050
) -> np.ndarray:
    """
    Adjust audio pitch toward target pitch over time using proper pitch shifting.
    Returns:
        pitch corrected audio array (same length as input)
    """
    # Handle empty or invalid input
    if len(audio) == 0:
        return audio
    
    f0_series = np.array(f0_series)
    target_pitch = np.array(target_pitch)
    
    # Filter out zero/invalid pitch values
    valid_f0 = f0_series[f0_series > 0]
    valid_target = target_pitch[target_pitch > 0]
    
    # If no valid pitch data, return original audio
    if len(valid_f0) == 0 or len(valid_target) == 0:
        return audio
    
    # Calculate average pitch difference
    avg_f0 = np.mean(valid_f0)
    avg_target = np.mean(valid_target)
    
    if avg_f0 == 0:
        return audio
    
    # Calculate pitch shift in semitones
    # Formula: semitones = 12 * log2(freq_ratio)
    freq_ratio = avg_target / avg_f0
    semitones = 12 * np.log2(freq_ratio) * retune_speed
    
    # Clip to reasonable range (-12 to +12 semitones = 1 octave)
    semitones = np.clip(semitones, -12, 12)
    
    # Apply pitch shift using librosa (maintains audio length)
    shifted_audio = librosa.effects.pitch_shift(audio, n_steps=semitones, sr=sr)
    
    return shifted_audio