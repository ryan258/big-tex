"""Local waveform analysis; never alters the source score."""
from pathlib import Path
import json
import wave
import numpy as np

ROOT = Path(__file__).resolve().parent
score = ROOT.parent / 'Hoooowdy, folks... Trailer Score (Epic Outlaw).wav'
with wave.open(str(score)) as w:
    sr = w.getframerate()
    samples = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2')
    mono = samples.reshape(-1, w.getnchannels()).mean(axis=1) / 32768

hop = 480
window = 2048
previous = np.zeros(window // 2 + 1)
flux = []
energy = []
for offset in range(0, len(mono) - window, hop):
    chunk = mono[offset:offset + window]
    spectrum = np.abs(np.fft.rfft(chunk * np.hanning(window)))
    # Favor percussive attacks, retaining both bass and high-frequency attacks.
    difference = np.maximum(0, spectrum - previous)
    flux.append(float(difference[:200].sum()))
    energy.append(float(np.sqrt(np.mean(chunk * chunk))))
    previous = spectrum
flux = np.array(flux)
local = np.convolve(flux, np.ones(61) / 61, mode='same')
novelty = np.maximum(0, flux - local)
candidates = [i for i in range(2, len(flux) - 2)
              if novelty[i] == max(novelty[i - 2:i + 3]) and novelty[i] > 2]
chosen = []
for i in sorted(candidates, key=lambda n: novelty[n], reverse=True):
    if all(abs(i - j) >= 28 for j in chosen):
        chosen.append(i)
onsets = sorted(round(i * hop / sr, 3) for i in chosen)
duration = len(mono) / sr
cuts = [0]
for target in range(8, 137, 8):
    nearby = [t for t in onsets if abs(t - target) < .65]
    if nearby:
        # Prefer proximity; avoid shifting the narrative by a full beat.
        value = min(nearby, key=lambda t: abs(t-target))
    else:
        value = target
    cuts.append(round(value * 12) / 12)
cuts.append(duration)
envelope = []
for frame in range(int(np.ceil(duration * 12))):
    chunk = mono[round(frame * sr / 12):round((frame + 1) * sr / 12)]
    envelope.append(round(float(np.sqrt(np.mean(chunk * chunk))), 5))
result = dict(score=score.name, duration=duration, fps=12, cuts=cuts,
              onsets=onsets, envelope=envelope,
              method='Positive spectral flux with local-average subtraction; scene cuts snapped near eight-second landmarks.')
(ROOT / 'timing.json').write_text(json.dumps(result, indent=2) + '\n')
print(f'Analyzed {duration:.2f}s; {len(cuts)-1} scenes, {len(onsets)} local attack landmarks.')
