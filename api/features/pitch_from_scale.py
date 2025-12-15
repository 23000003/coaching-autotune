import scipy.signal as sig
import librosa
import numpy as np
from config.autotune import SEMITONES_IN_OCTAVE, SCALE

def degrees_from() -> np.ndarray:
    """
    Returns the pitch classes (degrees) that correspond to the given scale
    """
    
    degrees = librosa.key_to_degrees(SCALE)
    degrees = np.concatenate((degrees, [degrees[0] + SEMITONES_IN_OCTAVE]))
    return degrees


def closest_pitch_from_scale(audio_f0: np.ndarray) -> float:
    """
    Returns the pitch closest to f0 that belongs to the given scale
    """
    
    if np.isnan(audio_f0):
        return np.nan
      
    degrees = degrees_from()
    
    midi_note = librosa.hz_to_midi(audio_f0)
    
    degree = midi_note % SEMITONES_IN_OCTAVE
    
    degree_id = np.argmin(np.abs(degrees - degree))
    
    degree_difference = degree - degrees[degree_id]
    
    midi_note -= degree_difference
    
    return librosa.midi_to_hz(midi_note)


def apply_pitch_from_scale(
  audio_f0: np.ndarray, 
  retune_speed: float, 
  humanize_cents: float
) -> np.ndarray:
  
    """
    Each pitch in the f0 array is mapped to the closest pitch in the selected scale
    with retune speed and humanization applied.
    
    RETUNE SPEED: interpolate between previous pitch and target
    HUMANIZE: add small random cents variation
    """
    
    sanitized_pitch = np.zeros_like(audio_f0)
    prev_pitch = np.nan

    for i in range(audio_f0.shape[0]):
        target_pitch = closest_pitch_from_scale(audio_f0[i])

        # RETUNE SPEED
        if np.isnan(prev_pitch):
            corrected = target_pitch
        else:
            corrected = prev_pitch + retune_speed * (target_pitch - prev_pitch)

        # HUMANIZE
        if not np.isnan(corrected):
            cents_variation = np.random.uniform(-humanize_cents, humanize_cents)
            corrected *= 2 ** (cents_variation / 1200)

        sanitized_pitch[i] = corrected
        prev_pitch = corrected

    # Median smoothing to reduce artifacts
    smoothed_sanitized_pitch = sig.medfilt(sanitized_pitch, kernel_size=11)
    smoothed_sanitized_pitch[np.isnan(smoothed_sanitized_pitch)] = sanitized_pitch[np.isnan(smoothed_sanitized_pitch)]
        
    return smoothed_sanitized_pitch