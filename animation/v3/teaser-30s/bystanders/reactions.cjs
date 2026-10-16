const plan=require('../timeline.json');
const cast=require('./cast.cjs');
const scale=require('../../bystander-scale.cjs');
const placements={
 hook:[['phone-filmer',115,1705,300,'watch',40],['balloon-kid',950,1695,300,'watch',-30]],
 strike:[['snack-protector',175,1830,430,'flinch',-20],['phone-filmer',910,1830,420,'flinch',20]],
 eyes:[['balloon-kid',180,1840,430,'flinch',-10],['unbothered-local',875,1830,390,'watch',0]],
 'guard-card':[['corny-dog-vendor',240,1830,440,'roll',-70],['runner',840,1835,330,'run',170]],
 tank:[['runner',230,1830,370,'run',440]],
 'hat-card':[['family-on-the-move',155,1785,400,'run',180],['lost-tourist',930,1800,315,'watch',-25]],
 'hat-hit':[['phone-filmer',205,1820,480,'flinch',-35],['stroller-parent',780,1840,380,'run',290]],
 'traffic-card':[['i30-driver',535,1820,490,'flinch',0]],
 'traffic-jam':[['i30-driver',420,1835,560,'flinch',-15],['unbothered-local',915,1705,340,'watch',0]],
 'traffic-punch':[['i30-driver',450,1835,560,'flinch',0],['unbothered-local',935,1705,340,'watch',0],['lost-tourist',95,1675,300,'watch',-10]],
 stomp:[['runner',135,1830,400,'run',730],['rolling-out',770,1825,370,'roll',-310]],
 'wheel-rip':[['balloon-kid',135,1835,370,'flinch',-15],['stroller-parent',840,1840,390,'run',240]],
 'wheel-roll':[['family-on-the-move',170,1825,430,'run',410],['rolling-out',805,1830,340,'roll',-230]],
 charged:[['lost-tourist',150,1825,410,'flinch',-30],['rolling-out',850,1830,375,'roll',-180]],
 march:[['family-on-the-move',155,1835,360,'run',210],['stroller-parent',825,1830,330,'run',240],['runner',500,1830,300,'run',230]],
 coupons:[['coupon-collector',240,1820,500,'hide-tickets',-25],['unbothered-local',900,1810,370,'watch',0]],
 'corny-dog':[['snack-protector',180,1820,540,'flinch',-15],['corny-dog-vendor',880,1840,400,'watch',0]],
 hand:[['phone-filmer',905,1830,390,'flinch',15],['lost-tourist',160,1825,380,'flinch',-20]],
 'end-title':[],
};
// Each reaction starts on a nearest-frame audio attack. Major internal attacks
// can trigger another gesture while a joke card stays readable.
const byFrame=new Map();
for(const shot of plan.shots)byFrame.set(Math.round(shot.start*24),{time:shot.start,strength:shot.hit.strength,source:'shot attack'});
for(const hit of plan.hits){
 if(hit.strength<1.15||hit.time>=plan.shots.at(-1).start)continue;
 const frame=Math.round(hit.time*24),old=byFrame.get(frame);
 if(!old||hit.strength>old.strength)byFrame.set(frame,{time:frame/24,strength:hit.strength,source:'prominent internal attack'});
}
const cues=[...byFrame.values()].sort((a,b)=>a.time-b.time);
function at(t){let l=0,r=cues.length;while(l<r){const m=(l+r)>>1;if(cues[m].time<=t+1e-7)l=m+1;else r=m;}return cues[l-1];}
function draw(art,t,shot){
 const age=t-shot.start,u=Math.max(0,Math.min(1,age/shot.duration));const cue=at(t);
 const elapsed=cue?t-cue.time:100;
 const reaction=elapsed<.65?Math.exp(-Math.max(0,elapsed)*7.5)*Math.min(1.3,(cue?.strength??0)/1.0):0;
 const dark=['strike','eyes','guard-card','tank','hat-hit','traffic-card','traffic-jam','traffic-punch','stomp','wheel-roll','charged','march','coupons','hand'].includes(shot.kind);
 for(const [slug,start,baseline,preferred,behavior,travel] of placements[shot.kind]??[]){
  // Motion is linear travel on twos; separate joints and props supply the gesture.
  const stepped=Math.floor((age+1e-7)*12)/12;
  const progress=Math.min(1,stepped/shot.duration);
  const moving=['run','roll'].includes(behavior);
  const size=scale.calibrate(slug,preferred,shot.kind,true,u);
  const x=start+travel*size/preferred*(moving?progress:u);
  cast.draw(art.ctx,slug,x,baseline,size,{time:t,age:stepped,reaction,behavior,mode:dark?'dark':'light',distance:x-start});
 }
}
const usage=[...new Set(Object.values(placements).flat().map(p=>p[0]))];
module.exports={draw,cues,placements,usage,scaleInfo:scale.manifest};
