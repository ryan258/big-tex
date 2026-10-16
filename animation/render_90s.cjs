/* Tight v02: 90 seconds, native-tempo score excerpt, 24 fps hit-aligned cuts. */
const fs=require('node:fs');
const path=require('node:path');
const {spawn}=require('node:child_process');
const {once}=require('node:events');
const base=require('./render_sequence.cjs');
const {canvas:art,ctx:artContext,C,W,H,prepare}=base;
const runtime=process.env.BIG_TEX_NODE_MODULES||'/Users/ryanjohnson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
let library;try{library=require('@napi-rs/canvas');}catch{library=require(path.join(runtime,'@napi-rs/canvas'));}
const {createCanvas}=library;
const canvas=createCanvas(W,H),ctx=canvas.getContext('2d');
const ROOT=__dirname, FPS=24;
const plan=JSON.parse(fs.readFileSync(path.join(ROOT,'timing-90s-v02.json')));
const clamp=v=>Math.max(0,Math.min(1,v));

function lastHit(t){
  let left=0,right=plan.hits.length;
  while(left<right){let m=(left+right)>>1;if(plan.hits[m].time<=t+1/48)left=m+1;else right=m;}
  return plan.hits[left-1];
}
function draw(t){
  let i=0;
  while(i+1<plan.shots.length&&t>=plan.shots[i+1].start-1e-7)i++;
  const shot=plan.shots[i],age=t-shot.start;
  const steppedAge=Math.floor((age+1e-7)*12)/12;
  const hit=lastHit(t),elapsed=hit?t-hit.time:100;
  const pulse=elapsed>=-1/48&&elapsed<.19?Math.exp(-Math.max(0,elapsed)*23)*Math.min(1,hit.strength/1.4):0;
  let local=steppedAge*Math.max(1.7,3.7/shot.duration);
  if(shot.duration<1.8)local+=2.4;
  if([4,7].includes(shot.scene))local+=1;
  if([15,17].includes(shot.scene))local+=4;
  base.draw(t,{scene:shot.scene,local,duration:8,progress:clamp(age/shot.duration),pulse,
    montageIndex:shot.montageIndex,hardCut:true,tight:true,silentMontage:i%3!==1});
  ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=C.ink;ctx.fillRect(0,0,W,H);
  const insert=shot.scene===13;
  const zoom=insert?1.02+.04*clamp(age/shot.duration)+pulse*.025:1;
  ctx.save();ctx.translate(W/2,H/2);ctx.scale(zoom,zoom);
  // Small two-frame registration kick on the biggest impacts; typography holds.
  if(pulse>.5&&![0,1,2,14,15,16,17].includes(shot.scene))ctx.translate((i%2?1:-1)*pulse*9,pulse*4);
  ctx.drawImage(art,-W/2,-H/2);ctx.restore();
  // Additional graphic emphasis on strong hits inside the title hold.
  if(shot.scene===15&&pulse>.28){
    ctx.fillStyle=C.red;ctx.fillRect(0,1025,W*pulse,22);
  }
  if(t<.16){ctx.fillStyle=`rgba(25,24,21,${1-t/.16})`;ctx.fillRect(0,0,W,H);}
  if(t>89.25){ctx.fillStyle=`rgba(25,24,21,${clamp((t-89.25)/.65)})`;ctx.fillRect(0,0,W,H);}
  return i;
}
function stills(){
  const sheet=createCanvas(1920,Math.ceil(plan.shots.length/4)*312+90),s=sheet.getContext('2d');
  s.fillStyle=C.paper;s.fillRect(0,0,sheet.width,sheet.height);
  s.fillStyle=C.ink;s.font='32px CutTitle';s.fillText('BIG TEX: REWIRED / 90-SECOND HIT CUT / v02',25,55);
  plan.shots.forEach((shot,i)=>{
    draw(shot.start+Math.min(shot.duration*.72,1.7));
    const x=i%4*480,y=90+Math.floor(i/4)*312;
    s.drawImage(canvas,x,y,480,270);s.fillStyle=C.ink;s.font='14px CutTitle';
    s.fillText(`${String(i+1).padStart(2,'0')} / ${shot.start.toFixed(2)}s / ${shot.duration.toFixed(2)}s / ${shot.kind}`,x+10,y+296);
  });
  fs.writeFileSync(path.join(ROOT,'storyboard-90s-v02.jpg'),sheet.toBuffer('image/jpeg',88));
  draw(74);fs.writeFileSync(path.join(ROOT,'poster-90s-v02.jpg'),canvas.toBuffer('image/jpeg',94));
  console.log('90-second storyboard and poster ready.');
}
async function render(){
  const output=path.join(ROOT,'big-tex-rewired-90s-v02.mp4');
  const score=path.resolve(ROOT,'..',plan.score);
  const args=['-hide_banner','-loglevel','warning','-y','-f','rawvideo','-pixel_format','rgba',
    '-video_size',`${W}x${H}`,'-framerate',String(FPS),'-i','pipe:0','-ss',String(plan.source_offset),'-i',score,
    '-map','0:v:0','-map','1:a:0','-t','90','-c:v','libx264','-preset','veryfast','-crf','18',
    '-pix_fmt','yuv420p','-c:a','aac','-b:a','320k','-af','afade=t=in:st=0:d=0.015,afade=t=out:st=89.35:d=0.65',
    '-movflags','+faststart','-metadata','title=Big Tex: Rewired — 90-second Hit Cut v02',
    '-metadata',`comment=Original SVG animation. 50 hit-aligned shots. Score excerpt ${plan.source_offset.toFixed(2)}–139.92 seconds, original tempo.`,output];
  const ff=spawn('ffmpeg',args,{stdio:['pipe','inherit','inherit']});
  let failure;ff.stdin.on('error',error=>{failure=error;});
  const done=new Promise((resolve,reject)=>{ff.once('error',reject);ff.once('close',code=>code===0?resolve():reject(Error('Encoder exit '+code)));});
  const start=Date.now();
  for(let i=0;i<90*FPS;i++){
    if(failure)throw failure;
    draw(i/FPS);if(!ff.stdin.write(canvas.data()))await once(ff.stdin,'drain');
    if(i%(FPS*15)===0)console.log(`Rendered ${i/FPS} / 90 sec; ${((Date.now()-start)/1000).toFixed(1)} sec elapsed.`);
  }
  ff.stdin.end();await done;console.log('Complete: '+output);
}
(async()=>{await prepare();stills();if(process.argv.includes('--render'))await render();})().catch(error=>{console.error(error);process.exitCode=1;});
