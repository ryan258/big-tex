/* Select a continuous, native-tempo 30-second score passage and its hit cuts. */
const fs=require('node:fs');
const path=require('node:path');
const ROOT=__dirname;
const prior=JSON.parse(fs.readFileSync(path.join(ROOT,'timing-90s-v02.json')));
const candidates=[];
for(const start of prior.hits){
  if(start.time+30>90||start.strength<1)continue;
  const closing=prior.hits.filter(h=>h.time-start.time>25.5&&h.time-start.time<27.5);
  if(!closing.length)continue;
  const title=closing.reduce((a,b)=>a.strength>b.strength?a:b);
  const action=prior.hits.filter(h=>h.time>start.time&&h.time<start.time+25.5).map(h=>h.strength).sort((a,b)=>b-a).slice(0,12);
  const rank=start.strength*1.5+title.strength*2+action.reduce((a,b)=>a+b,0)*.08;
  candidates.push({start,title,rank});
}
const choice=candidates.sort((a,b)=>b.rank-a.rank)[0];
if(!choice)throw Error('No suitable 30-second passage.');
const offset=Number((prior.source_offset+choice.start.time).toFixed(6));
const hits=prior.hits.filter(h=>h.time>=choice.start.time&&h.time<choice.start.time+30)
  .map(h=>({time:Number((h.time-choice.start.time).toFixed(6)),strength:h.strength}));
const titleHit=hits.find(h=>Math.abs(h.time-(choice.title.time-choice.start.time))<.001);
const targets=[
  [0,'strike'],[1.4,'skull'],[3,'hero'],[4.7,'pylon'],[6.1,'boot'],
  [7.6,'hand'],[9,'helicopter'],[10.2,'tank'],[11.3,'wheel'],[12.5,'city'],
  [13.8,'off-cables'],[15.1,'hero'],[16.4,'hand'],[17.5,'skull'],
  [18.3,'boot'],[19.1,'helicopter'],[19.9,'tank'],[20.7,'wheel'],
  [21.5,'pylon'],[22.25,'hand'],[23,'skull'],[23.7,'strike'],
  [24.4,'hero'],[25.35,'hand'],[25.8,'strike'],
];
const shots=[];
for(const [target,kind] of targets){
  let hit;
  if(target===0)hit=hits[0];
  else {
    const previous=shots.at(-1).start;
    const possible=hits.filter(h=>Math.abs(h.time-target)<.36&&h.time>previous+.32&&h.time<titleHit.time-.2);
    if(!possible.length)throw Error('No cut hit near '+target);
    hit=possible.reduce((a,b)=>a.strength>b.strength?a:b);
  }
  shots.push({kind,start:Math.round(hit.time*24)/24,hit});
}
shots.push({kind:'title',start:Math.round(titleHit.time*24)/24,hit:titleHit});
for(let i=0;i<shots.length;i++){
  shots[i].end=shots[i+1]?.start??30;
  shots[i].duration=shots[i].end-shots[i].start;
  shots[i].sync_error_ms=Number(((shots[i].start-shots[i].hit.time)*1000).toFixed(3));
  if(shots[i].duration<.29)throw Error('Shot too short.');
}
const durations=shots.map(s=>s.duration).sort((a,b)=>a-b);
const plan={duration:30,fps:24,score:prior.score,source_offset:offset,
  source_end:offset+30,selection_method:'Ranked continuous 30-second passages for a strong opening attack, a prominent title attack at 25.5–27.5 seconds, and strong action attacks between. Uses the 70% broadband / 30% bass spectral-flux evidence from timing-90s-v02.json.',
  opening_attack_strength:choice.start.strength,title_attack_strength:choice.title.strength,
  median_shot_seconds:durations.length%2?durations[durations.length>>1]:(durations[durations.length/2-1]+durations[durations.length/2])/2,
  shots,hits};
fs.writeFileSync(path.join(ROOT,'timing-30s-teaser-v03.json'),JSON.stringify(plan,null,2)+'\n');
console.log(`Planned ${shots.length} shots: source ${offset.toFixed(3)}–${(offset+30).toFixed(3)}s; title ${shots.at(-1).start.toFixed(3)}s; median ${plan.median_shot_seconds.toFixed(3)}s.`);
