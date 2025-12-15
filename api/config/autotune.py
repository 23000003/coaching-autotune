import librosa


SEMITONES_IN_OCTAVE = 12

SCALE = 'C:maj'

FRAME_LENGTH = 2048

HOP_LENGTH = FRAME_LENGTH // 4

FMIN = librosa.note_to_hz('C2')

FMAX = librosa.note_to_hz('C7')