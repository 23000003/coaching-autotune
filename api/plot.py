import numpy as np
import librosa
import matplotlib.pyplot as plt

SR = 44100

# Load audio
before, sr = librosa.load("uploads/raw/kenny/2025-12-15-11h51m23s.wav", sr=SR, mono=True)
after, _ = librosa.load("uploads/processed/kenny/2025-12-15-11h51m27s.wav", sr=SR, mono=True)

# Pitch tracking
f0_before = librosa.yin(before, fmin=80, fmax=1000, sr=sr)
f0_after = librosa.yin(after, fmin=80, fmax=1000, sr=sr)

# Time axis
time = librosa.times_like(f0_before, sr=sr)

# Plot
plt.figure()
plt.plot(time, f0_before, label="Before (Original)", alpha=0.7)
plt.plot(time, f0_after, label="After (Autotuned)", alpha=0.7)
plt.xlabel("Time (seconds)")
plt.ylabel("Pitch (Hz)")
plt.title("Pitch Before vs After Autotune (C Major)")
plt.legend()
plt.grid(True)
plt.show()