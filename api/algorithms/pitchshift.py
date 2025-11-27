import librosa
import soundfile as sf

def pitch_shift_audio(input_file, output_file, semitones):
    """
    Shift the pitch of an audio file by a number of semitones.

    Parameters:
        input_file (str): Path to input WAV/MP3 file
        output_file (str): Path to save the output WAV file
        semitones (float): Number of semitones to shift (+ up, - down)
    """
    # Load audio
    y, sr = librosa.load(input_file, sr=None)

    # Apply pitch shift
    y_shifted = librosa.effects.pitch_shift(y, sr=sr, n_steps=semitones)

    # Save output
    sf.write(output_file, y_shifted, sr)
    print(f"Saved pitch-shifted audio to: {output_file}")


