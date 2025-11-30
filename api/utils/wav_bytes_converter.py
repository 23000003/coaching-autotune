import io
import soundfile as sf
import numpy as np

def convert_to_wav_bytes(audio: np.ndarray, sr: int) -> bytes:
    """
    Converts numpy audio array into a WAV file stored in memory.
    Returns the WAV data as bytes.
    """

    audio = audio.astype(np.float32)

    buffer = io.BytesIO()
    sf.write(buffer, audio, sr, format="WAV", subtype="PCM_16")

    wav_bytes = buffer.getvalue()
    buffer.close()

    return wav_bytes
