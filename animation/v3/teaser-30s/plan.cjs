const fs=require('node:fs'),path=require('node:path');
const evidence=require('../../timing-30s-teaser-v03.json');
const targets=[
 [0,'hook'],[2.65,'strike'],[3.42,'eyes'],
 [4.15,'guard-card'],[5.75,'tank'],[6.35,'hat-card'],[8.45,'hat-hit'],
 [9.65,'traffic-card'],[11.1,'traffic-jam'],[11.8,'traffic-punch'],
 [13.8,'stomp'],[14.45,'wheel-rip'],[15.2,'wheel-roll'],[16.35,'charged'],
 [17.55,'march'],[18.6,'coupons'],[20.7,'corny-dog'],
 [22.8,'wheel-roll'],[23.7,'hand'],[24.45,'march'],[25.4,'strike'],
 [25.8,'eyes'],
];
const shots=[];
for(const [target,kind] of targets){
 let hit;
 if(target===0)hit=evidence.hits[0];
 else{
  const near=evidence.hits.filter(h=>Math.abs(h.time-target)<.34&&h.time>(shots.at(-1)?.start??0)+.32&&h.time<26);
  if(!near.length)throw Error('No attack at '+target);
  hit=near.reduce((a,b)=>a.strength>b.strength?a:b);
 }
 shots.push({kind,start:Math.round(hit.time*24)/24,hit});
}
const title=evidence.hits.filter(h=>h.time>25.95&&h.time<27).reduce((a,b)=>a.strength>b.strength?a:b);
shots.push({kind:'end-title',start:Math.round(title.time*24)/24,hit:title});
for(let i=0;i<shots.length;i++){
 const s=shots[i];s.end=shots[i+1]?.start??30;s.duration=s.end-s.start;
 s.sync_error_ms=Number(((s.start-s.hit.time)*1000).toFixed(3));
 if(s.duration<.29)throw Error('Shot too short: '+s.kind);
}
const plan={duration:30,fps:24,width:1080,height:1920,source:'90-second v3 story and character rig',
 score:evidence.score,source_offset:evidence.source_offset,
 treatment:'Sun-faded turquoise, hot coral, warm cream, and deep petrol blue; new palette applied with an affine 3D LUT to preserve flat inks and antialiasing.',
 method:'Existing strong-attack evidence selects a native-tempo 30-second score passage; new story cut boundaries round to nearest 24 fps frame.',
 shots,hits:evidence.hits};
fs.writeFileSync(path.join(__dirname,'timeline.json'),JSON.stringify(plan,null,2)+'\n');
for(const s of shots)console.log(`${s.start.toFixed(3)}–${s.end.toFixed(3)} ${s.kind}`);
