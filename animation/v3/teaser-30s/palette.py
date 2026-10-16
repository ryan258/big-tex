from pathlib import Path
import json
import numpy as np
ROOT=Path(__file__).resolve().parent
anchors=[
 ('ink','#191815','#103B46'),
 ('red','#C83E2D','#E64F39'),
 ('gold','#D5A326','#4CB7AD'),
 ('paper','#F3E6CC','#F5E9CD'),
]
def rgb(value):return [int(value[i:i+2],16)/255 for i in [1,3,5]]
source=np.array([rgb(a[1])+[1] for a in anchors])
target=np.array([rgb(a[2]) for a in anchors])
matrix=np.linalg.solve(source,target)
size=33
with (ROOT/'sun-faded-texas.cube').open('w') as f:
 f.write('TITLE "Sun-faded Texas / v3 teaser"\nLUT_3D_SIZE 33\nDOMAIN_MIN 0 0 0\nDOMAIN_MAX 1 1 1\n')
 for b in np.linspace(0,1,size):
  for g in np.linspace(0,1,size):
   for r in np.linspace(0,1,size):
    out=np.clip(np.array([r,g,b,1])@matrix,0,1)
    f.write(' '.join(f'{v:.7f}' for v in out)+'\n')
report=dict(name='Sun-faded Texas',palette=[dict(name=n,original=s,treated=t) for n,s,t in anchors],
 affine_matrix=matrix.tolist(),lut_size=size)
(ROOT/'palette.json').write_text(json.dumps(report,indent=2)+'\n')
print('Created turquoise / hot coral / warm cream / petrol-blue treatment.')
