const fs=require('node:fs'),path=require('node:path');
const plan=require('../timeline.json');
const cast=require('../teaser-30s/bystanders/cast.cjs');
const scale=require('../bystander-scale.cjs');
const short=require('../teaser-30s/bystanders/reactions.cjs');

// Tuples: character, start x, baseline, SVG size, behavior, signed travel.
const portrait={...short.placements,
 'off-cables':[['family-on-the-move',160,1835,390,'run',390],['runner',830,1830,340,'run',410]],
 helicopter:[['phone-filmer',195,1820,430,'flinch',-20],['snack-protector',880,1830,390,'flinch',10]],
 'wheel-card':[['balloon-kid',140,1825,370,'flinch',-15],['lost-tourist',910,1820,360,'watch',-20]],
 'wheel-chase':[['family-on-the-move',145,1835,380,'run',390],['stroller-parent',820,1840,340,'run',300]],
 'charger-card':[['lost-tourist',170,1830,430,'flinch',-25],['coupon-collector',870,1830,360,'hide-tickets',0]],
 'pylon-rip':[['phone-filmer',150,1830,410,'flinch',-20],['rolling-out',850,1830,360,'roll',-170]],
 city:[['family-on-the-move',155,1835,370,'run',230],['runner',800,1830,330,'run',350]],
 skull:[['snack-protector',180,1830,420,'flinch',-15],['phone-filmer',890,1830,390,'flinch',20]],
 'tex-card':[['phone-filmer',155,1830,390,'flinch',-15],['unbothered-local',895,1830,350,'watch',0]],
 'main-title':[],
 aftermath:[['snack-protector',175,1830,410,'flinch',-15],['unbothered-local',890,1820,370,'watch',0]],
};
const wide={
 hook:[['phone-filmer',315,1010,290,'watch',30],['balloon-kid',1780,1015,280,'watch',-15]],
 strike:[['snack-protector',240,1025,340,'flinch',-20],['phone-filmer',1680,1020,345,'flinch',15]],
 eyes:[['balloon-kid',220,1035,330,'flinch',-10],['unbothered-local',1690,1025,300,'watch',0]],
 'off-cables':[['family-on-the-move',255,1020,350,'run',540],['runner',1640,1025,315,'run',400]],
 stomp:[['runner',250,1025,360,'run',1060],['rolling-out',1610,1025,330,'roll',-500]],
 march:[['family-on-the-move',240,1035,330,'run',430],['stroller-parent',1620,1035,300,'run',350],['runner',930,1030,280,'run',350]],
 'guard-card':[['corny-dog-vendor',265,1030,380,'roll',-70],['runner',1570,1030,300,'run',400]],
 tank:[['runner',320,1030,330,'run',1050],['rolling-out',1690,1030,300,'roll',-250]],
 helicopter:[['phone-filmer',300,1025,365,'flinch',-15],['snack-protector',1660,1025,330,'flinch',10]],
 'hat-card':[['family-on-the-move',265,1025,350,'run',330],['lost-tourist',1770,1025,300,'watch',-20]],
 'hat-hit':[['phone-filmer',330,1030,430,'flinch',-25],['stroller-parent',1540,1035,330,'run',420]],
 'traffic-card':[['i30-driver',600,1030,430,'flinch',0],['lost-tourist',1750,1015,280,'watch',0]],
 'traffic-jam':[['i30-driver',535,1030,460,'flinch',-10],['unbothered-local',1750,1020,290,'watch',0]],
 'traffic-punch':[['i30-driver',590,1030,470,'flinch',0],['lost-tourist',200,1025,285,'watch',-10],['unbothered-local',1740,1020,300,'watch',0]],
 'wheel-card':[['balloon-kid',285,1025,330,'flinch',-15],['lost-tourist',1745,1025,320,'watch',-15]],
 'wheel-rip':[['balloon-kid',240,1030,330,'flinch',-10],['stroller-parent',1640,1035,340,'run',280]],
 'wheel-roll':[['family-on-the-move',260,1035,350,'run',540],['rolling-out',1610,1035,320,'roll',-400]],
 'wheel-chase':[['family-on-the-move',230,1035,340,'run',500],['stroller-parent',1450,1035,320,'run',440],['rolling-out',1050,1030,300,'roll',-300]],
 'charger-card':[['lost-tourist',300,1030,360,'flinch',-15],['coupon-collector',1690,1030,330,'hide-tickets',0]],
 'pylon-rip':[['phone-filmer',230,1030,370,'flinch',-15],['rolling-out',1710,1030,330,'roll',-200]],
 hand:[['lost-tourist',230,1030,340,'flinch',-15],['phone-filmer',1700,1030,355,'flinch',15]],
 charged:[['lost-tourist',260,1030,360,'flinch',-20],['rolling-out',1710,1030,330,'roll',-200]],
 city:[['family-on-the-move',260,1030,350,'run',500],['runner',1530,1030,315,'run',400],['stroller-parent',990,1035,300,'run',300]],
 skull:[['snack-protector',250,1030,350,'flinch',-15],['phone-filmer',1700,1030,340,'flinch',15]],
 'tex-card':[['phone-filmer',285,1030,350,'flinch',-15],['unbothered-local',1770,1025,305,'watch',0]],
 'main-title':[],
 aftermath:[['snack-protector',300,1030,350,'flinch',-15],['unbothered-local',1700,1025,330,'watch',0]],
 coupons:[['coupon-collector',420,1030,465,'hide-tickets',-15],['unbothered-local',1030,1025,320,'watch',0]],
 'corny-dog':[['snack-protector',340,1030,450,'flinch',-10],['corny-dog-vendor',1710,1040,360,'watch',0]],
 'end-title':[],
};
const protectedKinds=new Set(['main-title','end-title']);
const shotAt=t=>plan.shots.find(s=>t>=s.start-1e-7&&t<s.end-1e-7)??plan.shots.at(-1);
const byFrame=new Map();
function add(detected,strength,source){
 const frame=Math.round(detected*plan.fps),time=frame/plan.fps;
 if(protectedKinds.has(shotAt(time).kind))return;
 const previous=byFrame.get(frame);
 if(previous&&previous.strength>=strength)return;
 byFrame.set(frame,{frame,time,detected_time:detected,strength,source,sync_error_ms:+((time-detected)*1000).toFixed(3)});
}
for(const shot of plan.shots)if(shot.hit)add(shot.hit.time,shot.hit.strength,'shot attack');
for(const hit of plan.hits)if(hit.strength>=1.15)add(hit.time,hit.strength,'prominent internal attack');
const cues=[...byFrame.values()].sort((a,b)=>a.frame-b.frame);
function cueAt(t){let l=0,r=cues.length;while(l<r){const m=(l+r)>>1;if(cues[m].time<=t+1e-7)l=m+1;else r=m;}return cues[l-1];}

async function prepare(){
 await cast.prepare();
 // Preserve dark heads against paper while feet remain readable on the ink floor.
 for(const actor of Object.values(cast.characters)){
  actor.images.floor=Object.fromEntries(actor.parts.map(part=>[part.name,actor.images[/leg|wheel|caster/.test(part.name)?'dark':'light'][part.name]]));
 }
}
function draw(art,t,shot){
 if(protectedKinds.has(shot.kind))return;
 const age=t-shot.start,stepped=Math.floor((age+1e-7)*12)/12;
 const progress=Math.max(0,Math.min(1,stepped/shot.duration));
 const cue=cueAt(t),elapsed=cue?t-cue.time:100;
 const gain=t<21?1.5:1.1;
 const recoil=elapsed<.65?Math.exp(-Math.max(0,elapsed)*7.5)*Math.min(1.35,(cue?.strength??0)/gain):0;
 const dark=new Set(['strike','eyes','guard-card','tank','helicopter','hat-hit','traffic-card','traffic-jam','traffic-punch','stomp','wheel-roll','wheel-chase','charger-card','pylon-rip','hand','charged','skull','aftermath','coupons']);
 const layout=art.portrait?portrait:wide;
 for(const [slug,start,baseline,preferred,behavior,travel] of layout[shot.kind]??[]){
  const size=scale.calibrate(slug,preferred,shot.kind,art.portrait,age/shot.duration);
  const x=start+travel*size/preferred*progress;
  let mode=dark.has(shot.kind)?'dark':'light';
  if(['off-cables','hat-card'].includes(shot.kind))mode='floor';
  if(shot.kind==='hook')mode=art.portrait?'light':'floor';
  if(shot.kind==='march')mode=art.portrait?'dark':'floor';
  if(shot.kind==='tex-card'&&art.portrait)mode='dark';
  cast.draw(art.ctx,slug,x,baseline,size,{time:t,age:stepped,reaction:shot.kind==='hook'?0:recoil,behavior,mode,distance:x-start});
 }
}
const usage=[...new Set([...Object.values(portrait),...Object.values(wide)].flat().map(p=>p[0]))];
function manifest(){return {source_timeline:'../timeline.json',cast_source:'../../../assets/bystanders/classic',characters:usage,layouts:{wide,portrait},cues,scale:scale.manifest(),
 protected_shots:plan.shots.filter(s=>protectedKinds.has(s.kind)).map(s=>({kind:s.kind,start:s.start,end:s.end})),
 motion:'SVG pivots and attached props; travel and gait on twos, 24 fps score cues. Recoil grows with score attack strength. Wheeled bystanders rotate from signed travel distance.'};}
module.exports={prepare,draw,cues,usage,portrait,wide,manifest};
