import sys
import librosa
import json
import numpy as np

def analyze_music(file_path):
    y, sr = librosa.load(file_path)
    
    # Extract features
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
    rms = librosa.feature.rms(y=y)
    zcr = librosa.feature.zero_crossing_rate(y=y)
    harmony = librosa.effects.harmonic(y)
    
    # Calculate energy (based on RMS and spectral centroid)
    energy = np.mean(rms) * np.mean(spectral_centroid)
    
    # Calculate danceability (based on tempo and zero crossing rate)
    danceability = (tempo / 200) * np.mean(zcr) * 10
    
    analysis = {
        'bpm': float(tempo),
        'spectral_centroid': float(np.mean(spectral_centroid)),
        'energy': float(energy),
        'danceability': float(danceability),
        'harmony': float(np.mean(harmony))
    }
    
    return analysis

if __name__ == '__main__':
    file_path = sys.argv[1]
    analysis = analyze_music(file_path)
    print(json.dumps(analysis))
