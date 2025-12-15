from pathlib import Path
import librosa
import numpy as np
import soundfile as sf
import scipy.signal as sig
import psola
from pedalboard import Pedalboard, HighShelfFilter, Compressor, Chorus, Reverb, Delay

SEMITONES_IN_OCTAVE = 12
HARD_CODED_SCALE = 'C:maj'  # C Major

# Values to test
# 0.1 10 -> Normal
# 1.0 0 -> T Pain
# 

# ============================
# HARD-CODED RETUNE / HUMANIZE
# ============================
RETUNE_SPEED = 1  # Between 0 (instant) and 1 (very slow)
HUMANIZE_CENTS = 0 # random ±10 cents variation

# ============================
# SCALE HELPER FUNCTIONS
# ============================

def degrees_from(scale: str):
    """Return the pitch classes (degrees) that correspond to the given scale"""
    degrees = librosa.key_to_degrees(scale)
    degrees = np.concatenate((degrees, [degrees[0] + SEMITONES_IN_OCTAVE]))
    return degrees

def closest_pitch_from_scale(f0, scale):
    """Return the pitch closest to f0 that belongs to the given scale"""
    
    if np.isnan(f0):
        return np.nan
    
    degrees = degrees_from(scale)
    
    midi_note = librosa.hz_to_midi(f0)
    
    degree = midi_note % SEMITONES_IN_OCTAVE
    
    degree_id = np.argmin(np.abs(degrees - degree))
    
    degree_difference = degree - degrees[degree_id]
    
    midi_note -= degree_difference
    
    return librosa.midi_to_hz(midi_note)

def aclosest_pitch_from_scale(f0, scale):
    """Map each pitch in the f0 array to the closest pitch belonging to the given scale,
       with retune speed and humanization applied"""
       
    sanitized_pitch = np.zeros_like(f0)
    prev_pitch = np.nan

    for i in range(f0.shape[0]):
        target_pitch = closest_pitch_from_scale(f0[i], scale)

        # RETUNE SPEED: interpolate between previous pitch and target
        if np.isnan(prev_pitch):
            corrected = target_pitch
        else:
            corrected = prev_pitch + RETUNE_SPEED * (target_pitch - prev_pitch)

        # HUMANIZE: add small random cents variation
        if not np.isnan(corrected):
            cents_variation = np.random.uniform(-HUMANIZE_CENTS, HUMANIZE_CENTS)
            corrected *= 2 ** (cents_variation / 1200)

        sanitized_pitch[i] = corrected
        prev_pitch = corrected

    # Median smoothing to reduce artifacts
    smoothed_sanitized_pitch = sig.medfilt(sanitized_pitch, kernel_size=11)
    smoothed_sanitized_pitch[np.isnan(smoothed_sanitized_pitch)] = \
        sanitized_pitch[np.isnan(smoothed_sanitized_pitch)]
    return smoothed_sanitized_pitch

# ============================
# AUTOTUNE FUNCTION
# ============================

def autotune(audio, sr):
    frame_length = 2048
    hop_length = frame_length // 4
    fmin = librosa.note_to_hz('C2')
    fmax = librosa.note_to_hz('C7')

    # Pitch tracking
    f0, voiced_flag, _ = librosa.pyin(
        audio,
        frame_length=frame_length,
        hop_length=hop_length,
        sr=sr,
        fmin=fmin,
        fmax=fmax
    )

    # Snap pitch to C Major with retune speed and humanization
    corrected_f0 = aclosest_pitch_from_scale(f0, HARD_CODED_SCALE)

    # Apply PSOLA vocoder
    return psola.vocode(audio, sample_rate=int(sr), target_pitch=corrected_f0, fmin=fmin, fmax=fmax)

# ============================
# ENTRY POINT
# ============================

def start():
    input_file = "uploads/raw/kenny/2025-12-14-15h44m41s.wav"
    output_file = "autotuned.wav"

    audio, sr = librosa.load(input_file, sr=None, mono=True)

    tuned_audio = autotune(audio, sr)
    
    # tuned_audio = librosa.effects.pitch_shift(
    #     audio,
    #     sr=sr,
    #     n_steps=10  # shift UP by 3 semitones
    # )
    
    # board = Pedalboard([
    #     HighShelfFilter(cutoff_frequency_hz=400, gain_db=3.0),  # <- corrected
    #     Compressor(threshold_db=-20, ratio=3.0),
    #     Chorus(rate_hz=1.5, depth=0.7, mix=0.2),
    #     Reverb(room_size=0.1, wet_level=0.3),
    #     Delay(delay_seconds=0.1, feedback=0.25, mix=0.2),
    # ])
    
    # processed = board(tuned_audio, sr)

    sf.write(output_file, tuned_audio, sr)
    print("Autotune complete → autotuned.wav")


# ============================
# RUN
# ============================
start()




# EFFECTS
# Construct effects
# board = Pedalboard([
#     HighShelfFilter(cutoff_frequency_hz=400, gain_db=audioConfig['air']),
#     Compressor(
#         threshold_db=-20 - audioConfig['compression']*10,
#         ratio=1 + audioConfig['compression']*4
#     ),
#     Chorus(rate_hz=1.5, depth=0.7, mix=audioConfig['chorus']),
#     Reverb(room_size=0.1, wet_level=audioConfig['reverb']),
#     Delay(delay_seconds=0.1, feedback=0.25, mix=audioConfig['delay']),
# ])
# processed = board(audio, sr)