"""Mix the existing score with restrained, locally synthesized effects."""
from pathlib import Path
import json
import wave
import numpy as np

ROOT=Path(__file__).resolve().parent
plan=json.loads((ROOT/'timeline.json').read_text())
with wave.open(str(ROOT.parent.parent/plan['score'])) as w:
    sr=w.getframerate()
    channels=w.getnchannels()
    source=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').reshape(-1,channels).astype(np.float32)/32768
start=round(plan['source_offset']*sr)
samples=source[start:start+90*sr].copy()
t=np.arange(len(samples))/sr
gain=np.full(len(samples),.86,dtype=np.float32)
# Let the coupons/corny-dog button read, then restore the score on the end title.
duck_in=79.70;duck_full=79.92;duck_out=84.40;restore=84.6666666667
gain*=1-.62*np.clip((t-duck_in)/(duck_full-duck_in),0,1)*np.clip((restore-t)/(restore-duck_out),0,1)
samples*=gain[:,None]
rng=np.random.default_rng(1847)
effects=[]
for shot in plan['shots']:
    kind=shot['kind']
    if kind not in {'strike','stomp','hat-hit','wheel-rip','pylon-rip'}:continue
    duration=.46 if kind=='strike' else .32
    q=np.arange(round(duration*sr))/sr
    if kind=='hat-hit':
        raw=rng.standard_normal(len(q)).astype(np.float32)
        raw=np.convolve(raw,np.ones(21)/21,mode='same')
        effect=raw*np.sin(np.pi*q/duration)**2*.15
        level='soft paper-air swish'
    else:
        raw=rng.standard_normal(len(q)).astype(np.float32)
        filtered=np.convolve(raw,np.ones(33)/33,mode='same')
        frequency=48 if kind=='strike' else 58
        envelope=(1-np.exp(-q*800))*np.exp(-q*(11 if kind=='strike' else 17))
        effect=(np.sin(2*np.pi*(frequency*q-10*q*q))*.13+filtered*.09)*envelope
        level='low impact / paper crack'
    offset=round(shot['start']*sr);n=min(len(effect),len(samples)-offset)
    samples[offset:offset+n,0]+=effect[:n]
    samples[offset:offset+n,1]+=effect[:n]*.94
    effects.append(dict(time=shot['start'],kind=kind,effect=level))
# Endpoint fades apply to audio only; the last picture is the readable title.
samples*=np.minimum(1,t/.012)[:,None]
samples*=np.minimum(1,(90-t)/.65)[:,None]
peak=float(np.max(np.abs(samples)))
samples=np.clip(samples,-.99,.99)
with wave.open(str(ROOT/'soundtrack-v03.wav'),'wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr)
    w.writeframes((samples*32767).astype('<i2').tobytes())
report=dict(source_score=plan['score'],source_offset=plan['source_offset'],duration=90,sample_rate=sr,
    score_gain=.86,comedy_button_duck_factor=.38,duck_interval=[duck_in,restore],effects=effects,
    peak_before_safety_clip=peak,source_unchanged=True)
(ROOT/'audio-mix.json').write_text(json.dumps(report,indent=2)+'\n')
print(f'Mixed 90-second score with {len(effects)} restrained effects; peak {peak:.3f}.')
