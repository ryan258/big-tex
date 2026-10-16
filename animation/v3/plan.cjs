const fs=require('node:fs');
const path=require('node:path');
const prior=JSON.parse(fs.readFileSync(path.join(__dirname,'../timing-90s-v02.json')));
const targets=[
 [0,'hook'],[3.3,'strike'],[5.7,'eyes'],[7.9,'off-cables'],
 [11,'stomp'],[14,'march'],[16.9,'guard-card'],[20.2,'tank'],
 [21.5,'helicopter'],[23.4,'hat-card'],[26.1,'hat-hit'],[27.0,'eyes'],
 [29.9,'traffic-card'],[31.4,'traffic-jam'],[32.9,'traffic-punch'],
 [35.9,'stomp'],[37.5,'wheel-card'],[39.3,'wheel-rip'],[41.2,'wheel-roll'],
 [42.0,'wheel-chase'],[44.3,'charger-card'],[45.8,'pylon-rip'],
 [47.3,'hand'],[48.1,'strike'],[49,'charged'],[50.3,'eyes'],
 [51.1,'city'],[52.6,'helicopter'],[54.1,'tank'],[54.9,'stomp'],
 [55.7,'wheel-roll'],[57.2,'hand'],[58,'march'],[60.2,'charged'],
 [61.2,'strike'],[61.9,'skull'],[62.9,'stomp'],[64.4,'pylon-rip'],
 [65.0,'tank'],[65.9,'march'],[66.8,'eyes'],[69,'tex-card'],
 [73.5,'main-title'],[76.9,'aftermath'],[79.9,'coupons'],
 [82.2,'corny-dog'],[85,'end-title'],
];
const shots=[];
for(const [target,kind] of targets){
 let hit=null,start=0;
 if(target){
  const near=prior.hits.filter(h=>Math.abs(h.time-target)<.33&&h.time>(shots.at(-1)?.start??0)+.28);
  if(!near.length)throw Error('No attack near '+target);
  hit=near.reduce((a,b)=>a.strength>b.strength?a:b);
  start=Math.round(hit.time*24)/24;
 }
 shots.push({kind,start,hit});
}
for(let i=0;i<shots.length;i++){
 const shot=shots[i];shot.end=shots[i+1]?.start??90;shot.duration=shot.end-shot.start;
 shot.sync_error_ms=shot.hit?Number(((shot.start-shot.hit.time)*1000).toFixed(3)):0;
 if(shot.duration<.29)throw Error('Shot too short: '+shot.kind);
}
const plan={duration:90,fps:24,version:'90s-v03',score:prior.score,source_offset:prior.source_offset,
 premise:'He was only supposed to wave.',
 treatment:'Original Texas monster-comedy demo: wave → strike → escape → Guard/hat joke → I-30 joke → Texas Star wheel → power pylon → title → coupons/corny-dog button → final title.',
 method:'Edit boundaries snap to prominent attacks in the supplied score; movement is stepped on twos. Derived waveform evidence from timing-90s-v02.json.',
 shots,hits:prior.hits,
 references:[{title:'State Fair of Texas coupons FAQ',url:'https://bigtex.com/faqs/coupons/'},{title:'State Fair of Texas food',url:'https://bigtex.com/plan-your-visit/food/'}]};
fs.writeFileSync(path.join(__dirname,'timeline.json'),JSON.stringify(plan,null,2)+'\n');
console.log(`v3: ${shots.length} shots, 90 seconds; title ${shots.find(s=>s.kind==='main-title').start.toFixed(3)}s; final title ${shots.at(-1).start.toFixed(3)}s.`);
