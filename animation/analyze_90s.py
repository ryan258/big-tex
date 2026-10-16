"""Find prominent audio attacks and make a frame-accurate 90-second edit plan."""
import json
from pathlib import Path
import wave
import numpy as np

ROOT = Path(__file__).resolve().parent
SCORE = ROOT.parent / 'Hoooowdy, folks... Trailer Score (Epic Outlaw).wav'
DURATION = 90
FPS = 24
with wave.open(str(SCORE)) as w:
    sr = w.getframerate()
    full = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').reshape(-1, w.getnchannels())
offset = len(full) / sr - DURATION
mono = full[round(offset*sr):].mean(axis=1) / 32768
hop, window = 240, 2048
previous = np.zeros(window//2+1)
flux, bass, rms = [], [], []
for i in range(0, len(mono)-window, hop):
    chunk = mono[i:i+window]
    spectrum = np.abs(np.fft.rfft(chunk*np.hanning(window)))
    difference = np.maximum(0, spectrum-previous)
    flux.append(float(difference[2:300].sum()))
    bass.append(float(difference[2:12].sum()))
    rms.append(float(np.sqrt(np.mean(chunk*chunk))))
    previous = spectrum
flux, bass, rms = map(np.array, [flux, bass, rms])
def prominence(values):
    average = np.convolve(values,np.ones(101)/101,mode='same')
    return np.maximum(0,values-average)
strength = .7*prominence(flux)/(np.percentile(flux,95)+1e-9) + .3*prominence(bass)/(np.percentile(bass,95)+1e-9)
peaks = [i for i in range(5,len(strength)-5) if strength[i]==max(strength[i-5:i+6]) and strength[i]>.1]
selected = []
for i in sorted(peaks,key=lambda j:strength[j],reverse=True):
    if all(abs(i-j)*hop/sr>=.24 for j in selected):selected.append(i)
hits = [dict(time=round(i*hop/sr,4),strength=round(float(strength[i]),4)) for i in sorted(selected)]

# First choose narrative landmarks on strong attacks, then fill the action
# stretches with shorter hit-driven inserts. Title beats stay long enough to read.
anchors = [
    (0,0,'opening'), (3.2,1,'fairground'), (5.6,2,'fairground'),
    (8.0,3,'storm'), (11.4,4,'strike'), (14.0,5,'awakening'),
    (17.1,6,'reveal'), (20.8,7,'stomp'), (23.6,8,'response'),
    (27.0,9,'rupture'), (30.0,10,'havoc'), (33.0,11,'havoc'),
    (36.0,12,'havoc'), (39.4,7,'stomp'), (42.0,8,'response'),
    (45.0,11,'havoc'), (48.0,10,'havoc'), (51.0,6,'reveal'),
    (54.0,12,'havoc'), (57.0,9,'rupture'), (60.0,11,'havoc'),
    (63.0,7,'stomp'), (66.0,6,'reveal'), (69.0,14,'title'),
    (73.5,15,'title'), (77.2,13,'montage'), (80.0,16,'stinger'),
    (85.0,17,'end-title'),
]
shots=[]
for target,scene,kind in anchors:
    if target==0:
        time=0;hit=None
    else:
        candidates=[h for h in hits if abs(h['time']-target)<.62]
        if not candidates:raise RuntimeError(f'No attack at landmark {target}')
        hit=max(candidates,key=lambda h:h['strength']*(1-.35*abs(h['time']-target)/.62))
        time=round(hit['time']*FPS)/FPS
    shots.append(dict(start=time,scene=scene,kind=kind,hit=hit))

inserts=[]
for i,shot in enumerate(shots[:-1]):
    end=shots[i+1]['start']
    if shot['kind'] in {'havoc','response','stomp','montage'}:
        candidates=[h for h in hits if shot['start']+1.2<h['time']<end-.65]
        if candidates:
            h=max(candidates,key=lambda h:h['strength'])
            inserts.append(dict(start=round(h['time']*FPS)/FPS,scene=13,kind='hit-insert',hit=h,montageIndex=(i*3)%8))
    # Extra fast attacks in the peak section: 0.5–1.2 second cuts.
    if 43<shot['start']<69 or shot['kind']=='montage':
        possible=sorted([h for h in hits if shot['start']+.65<h['time']<end-.4],key=lambda h:h['strength'],reverse=True)
        nearby=[s['start'] for s in inserts]+[s['start'] for s in shots]
        for h in possible:
            t=round(h['time']*FPS)/FPS
            if all(abs(t-n)>.55 for n in nearby):
                inserts.append(dict(start=t,scene=13,kind='hit-insert',hit=h,montageIndex=(i+len(inserts))%8))
                nearby.append(t)
                break
shots=sorted(shots+inserts,key=lambda s:s['start'])
for i,shot in enumerate(shots):
    shot['end']=shots[i+1]['start'] if i+1<len(shots) else DURATION
    shot['duration']=shot['end']-shot['start']
    if shot['hit']:
        shot['sync_error_ms']=round((shot['start']-shot['hit']['time'])*1000,2)
    if shot['scene']==13 and 'montageIndex' not in shot:shot['montageIndex']=4
    if i and shot['scene']==13 and shots[i-1]['scene']==13 and shot['montageIndex']==shots[i-1]['montageIndex']:
        shot['montageIndex']=(shot['montageIndex']+3)%8
assert all(s['duration']>.3 for s in shots)
report=dict(duration=DURATION,source_offset=offset,score=SCORE.name,fps=FPS,
            method='Positive spectral-flux prominence, weighted 70% broadband / 30% bass; prominent local attacks guide narrative landmarks and action inserts. Nearest video-frame cut alignment.',
            shots=shots,hits=hits)
(ROOT/'timing-90s-v02.json').write_text(json.dumps(report,indent=2)+'\n')
print(f'{len(shots)} shots, {len(hits)} audio attacks, source {offset:.2f}–{offset+DURATION:.2f}s.')
print('Longest shot: %.2fs; median: %.2fs; maximum cut-to-attack error: %.2fms.' % (max(s['duration'] for s in shots), np.median([s['duration'] for s in shots]),max(abs(s.get('sync_error_ms',0)) for s in shots)))
print('Major hits used: '+', '.join(f"{s['start']:.2f}" for s in shots if s['hit'] and s['hit']['strength']>1))
