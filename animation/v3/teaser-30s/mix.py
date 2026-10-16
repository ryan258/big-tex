from pathlib import Path
import json,wave
import numpy as np
ROOT=Path(__file__).resolve().parent
plan=json.loads((ROOT/'timeline.json').read_text())
source=ROOT.parents[2]/plan['score']
with wave.open(str(source)) as w:
 sr=w.getframerate();channels=w.getnchannels()
 full=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').reshape(-1,channels).astype(np.float32)/32768
start=round(plan['source_offset']*sr);samples=full[start:start+30*sr].copy()
t=np.arange(len(samples))/sr;gain=np.full(len(samples),.86,dtype=np.float32)
button=next(s['start'] for s in plan['shots'] if s['kind']=='coupons')
restore=next(s['end'] for s in plan['shots'] if s['kind']=='corny-dog')
gain*=1-.52*np.clip((t-(button-.12))/.12,0,1)*np.clip((restore-t)/.14,0,1)
samples*=gain[:,None]
rng=np.random.default_rng(1847);effects=[]
for shot in plan['shots']:
 kind=shot['kind']
 if kind not in {'strike','stomp','hat-hit','wheel-rip'}:continue
 duration=.46 if kind=='strike' else .32;q=np.arange(round(duration*sr))/sr
 raw=rng.standard_normal(len(q)).astype(np.float32)
 if kind=='hat-hit':
  effect=np.convolve(raw,np.ones(21)/21,mode='same')*np.sin(np.pi*q/duration)**2*.15
 else:
  noise=np.convolve(raw,np.ones(33)/33,mode='same')
  env=(1-np.exp(-q*800))*np.exp(-q*(11 if kind=='strike' else 17))
  effect=(np.sin(2*np.pi*(48*q-10*q*q))*.13+noise*.09)*env
 offset=round(shot['start']*sr);n=min(len(effect),len(samples)-offset)
 samples[offset:offset+n,0]+=effect[:n];samples[offset:offset+n,1]+=effect[:n]*.94
 effects.append(dict(time=shot['start'],kind=kind))
samples*=np.minimum(1,t/.003)[:,None]
samples*=np.minimum(1,(30-t)/.35)[:,None]
peak=float(np.max(np.abs(samples)));samples=np.clip(samples,-.99,.99)
with wave.open(str(ROOT/'soundtrack.wav'),'wb') as w:
 w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((samples*32767).astype('<i2').tobytes())
(ROOT/'audio-mix.json').write_text(json.dumps(dict(source_score=plan['score'],source_offset=plan['source_offset'],duration=30,
 score_gain=.86,button_duck_factor=.48,duck_interval=[button,restore],effects=effects,peak_before_clip=peak,source_unchanged=True),indent=2)+'\n')
print(f'30-second mix ready; {len(effects)} effect cues; peak {peak:.3f}.')
