import librosa
import numpy as np
import soundfile as sf

def detect_notes(y, sr, frame_length=2048, hop_length=256):
    """Detect pitch for each frame."""
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr, n_fft=frame_length, hop_length=hop_length)

    pitch_track = []
    for i in range(len(pitches[0])):
        index = magnitudes[:, i].argmax()
        pitch = pitches[index, i]
        pitch_track.append(pitch if pitch > 0 else np.nan)

    return np.array(pitch_track)


def quantize_pitch(pitch, scale_freqs):
    """Snap pitch to nearest note frequency."""
    diffs = np.abs(scale_freqs - pitch)
    return scale_freqs[np.argmin(diffs)]


def apply_humanize(pitch_track, humanize_amount=0.5):
    """
    humanize_amount: 0 = robotic, 1 = natural
    Longer sustained pitches get less correction.
    """
    corrected = pitch_track.copy()
    
    # Detect sustained notes
    window = 8  # frames for smoothing
    for i in range(len(pitch_track)):
        window_pitches = pitch_track[max(0, i-window): i+1]
        
        # If pitch is stable = long note
        stability = np.nanstd(window_pitches)
        
        # High stability → long note → apply more humanize (less correction)
        blend = min(1.0, stability * 20)  # adjust sensitivity
        blend *= humanize_amount
        
        # Blend original pitch with corrected pitch (less correction on long notes)
        corrected[i] = (1 - blend) * corrected[i] + blend * pitch_track[i]
    
    return corrected


def pitch_shift_frame(frame, sr, shift_semitones):
    return librosa.effects.pitch_shift(
        y=frame.astype("float32"),
        sr=sr,
        n_steps=shift_semitones
    )


def autotune_with_humanize(audio_path, output_path, humanize=0.0):
    # Load audio
    y, sr = librosa.load(audio_path)

    # Detect pitch per frame
    pitch_track = detect_notes(y, sr)

    # MIDI note frequencies
    notes = librosa.hz_to_midi(pitch_track)
    notes_rounded = np.round(notes)
    snapped_freqs = librosa.midi_to_hz(notes_rounded)

    # Apply Humanize (important step)
    humanized_freqs = apply_humanize(snapped_freqs, humanize_amount=humanize)

    # Convert to semitone shifts
    shift = librosa.hz_to_midi(humanized_freqs) - librosa.hz_to_midi(pitch_track)
    shift = np.nan_to_num(shift)

    # Frame parameters
    hop = 512
    frame_len = 2048

    y_out = np.zeros_like(y)

    # Apply pitch shifting frame-by-frame
    for i in range(0, len(y) - frame_len, hop):
        frame = y[i:i+frame_len]
        semitones = shift[i // hop]
        if np.isnan(semitones):
             semitones = 0

        shifted = pitch_shift_frame(frame, sr, semitones)

        # Overlap-add
        y_out[i:i+len(shifted)] += shifted

    # Save result
    sf.write(output_path, y_out, sr, format="WAV")
    print("Done:", output_path)
