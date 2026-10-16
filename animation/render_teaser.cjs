/* v03: lightning on frame one, hit-driven action, title through the last frame. */
const fs=require('node:fs'),path=require('node:path');
const {spawn}=require('node:child_process');
const {once}=require('node:events');
const base=require('./render_sequence.cjs');
const {canvas,ctx,icon,word,poly,rect,C,W,H,grain,prepare}=base;
let library;
try{library=require('@napi-rs/canvas');}catch{library=require(path.join(process.env.BIG_TEX_NODE_MODULES||'/Users/ryanjohnson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules','@napi-rs/canvas'));}
const {createCanvas}=library;
const plan=JSON.parse(fs.readFileSync(path.join(__dirname,'timing-30s-teaser-v03.json')));
const clamp=v=>Math.max(0,Math.min(1,v));

function draw(t){
  let i=0;
  while(i+1<plan.shots.length&&t>=plan.shots[i+1].start-1e-7)i++;
  const shot=plan.shots[i],age=t-shot.start,u=clamp(age/shot.duration);
  const q=Math.floor(age*12)/12;
  const hit=plan.hits.filter(h=>h.time<=t+1/48).at(-1);
  const elapsed=hit?t-hit.time:100;
  const pulse=elapsed<.20?Math.exp(-Math.max(0,elapsed)*22)*Math.min(1,hit.strength/1.4):0;
  const dark=['skull','pylon','helicopter','city','off-cables','title'].includes(shot.kind);
  const bg=dark?C.ink:['strike','hand','wheel'].includes(shot.kind)?C.red:shot.kind==='boot'?C.gold:C.paper;
  ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  ctx.save();
  if(shot.kind!=='title'&&pulse>.3)ctx.translate((i%2?1:-1)*pulse*9,pulse*5);
  switch(shot.kind){
    case 'strike':
      rect(-150,260,2300,165,C.ink,-14);rect(-100,700,2300,115,C.ink,8);
      icon('lightning',960,535,1280+pulse*90,-8,'red');
      break;
    case 'skull':
      rect(-80,220,2100,40,C.red,-8);rect(-50,890,2100,24,C.gold,6);
      icon('steel-skull',1050,550,1250+u*110,-5,true,{charge:t*2});
      break;
    case 'hero':
      poly([[1030,0],[1920,0],[1920,1080],[960,1080]],C.red);
      icon('big-tex',960+(i%2?70:-70)*u,570,1390+pulse*35,-3,false,{charge:t*2});
      break;
    case 'pylon':
      for(let n=0;n<4;n++)poly([[0,100+n*215],[1920,40+n*240],[1920,55+n*240],[0,120+n*215]],n%2?C.red:C.gold);
      icon('power-tower',960,560,1260,-9-u*5,true,{charge:t*2});
      break;
    case 'boot':
      rect(-100,900,2200,220,C.ink,-2);
      icon('cowboy-boot',1030,440+pulse*25,1280,-9,false);
      for(let n=0;n<7;n++)poly([[130+n*285,940],[210+n*285,908],[168+n*285,984],[240+n*285,1040],[142+n*285,1007]],C.red);
      break;
    case 'hand':
      rect(-150,100,2300,74,C.ink,12);rect(-50,1000,2300,32,C.ink,-6);
      icon('electric-hand',960,560,1320,-10+Math.floor(q*6)%2*2,'red',{charge:t*2});
      break;
    case 'helicopter':
      for(let n=0;n<3;n++)rect(-100,130+n*360,2200,36,C.red,n%2?-9:7);
      icon('helicopter',1090-u*320,570,1460,-8,true);
      break;
    case 'tank':
      poly([[0,750],[1920,820],[1920,1080],[0,1080]],C.red);
      icon('tank',830+u*210,570,1370,-2,false);
      break;
    case 'wheel':
      rect(-100,965,2200,130,C.ink,-3);
      icon('ferris-wheel',640+u*650,590,1340,-u*160,'red',{wheelOnly:true});
      break;
    case 'city':
      icon('dallas-skyline',960,700,1770,-2,true,{fire:Math.floor(q*8)%2*3});
      break;
    case 'off-cables':
      for(let n=0;n<3;n++)rect(-70,130+n*320,2100,245,n===1?C.red:C.paper,n%2?3:-3);
      word('OFF',180,355,230,C.ink,{max:1580,angle:-3});
      word('THE',800,680,210,C.paper,{max:1000,angle:3});
      word('CABLES.',165,1000,220,C.ink,{max:1600,angle:-3});
      break;
    case 'title':
      rect(0,0,55,H,C.red);
      poly([[95,106],[1850,80],[1850,103],[95,132]],C.red);
      word('BIG TEX:',125,420,220,C.paper,{max:1480,angle:-2});
      word('REWIRED',112,760,295,C.paper,{max:1700,angle:1});
      icon('lightning',1665,295,490,-10,false);
      poly([[125,855],[1800,831],[1800,849],[125,879]],C.red);
      // Title remains completely readable, including the final encoded frame.
      if(age<.18){ctx.fillStyle=C.red;ctx.fillRect(0,1025,W*pulse,20);}
      break;
  }
  ctx.restore();ctx.save();
  ctx.translate((Math.floor(t*6)%3-1)*2,(Math.floor(t*6)%2)*2);
  ctx.drawImage(grain,-2,-2,W+4,H+4);ctx.restore();
  return i;
}

function stills(){
  const sheet=createCanvas(1920,Math.ceil(plan.shots.length/4)*312+90),s=sheet.getContext('2d');
  s.fillStyle=C.paper;s.fillRect(0,0,sheet.width,sheet.height);
  s.fillStyle=C.ink;s.font='32px CutTitle';s.fillText('BIG TEX: REWIRED / 30-SECOND TEASER / v03',25,55);
  plan.shots.forEach((shot,i)=>{
    draw(shot.start+shot.duration*.5);const x=i%4*480,y=90+Math.floor(i/4)*312;
    s.drawImage(canvas,x,y,480,270);s.fillStyle=C.ink;s.font='14px CutTitle';
    s.fillText(`${String(i+1).padStart(2,'0')} / ${shot.start.toFixed(2)}s / ${shot.kind}`,x+10,y+296);
  });
  fs.writeFileSync(path.join(__dirname,'storyboard-30s-teaser-v03.jpg'),sheet.toBuffer('image/jpeg',90));
  draw(29);fs.writeFileSync(path.join(__dirname,'poster-30s-teaser-v03.jpg'),canvas.toBuffer('image/jpeg',94));
  console.log('Teaser storyboard and poster ready.');
}

async function render(){
  const output=path.join(__dirname,'big-tex-rewired-30s-teaser-v03.mp4');
  const args=['-hide_banner','-loglevel','warning','-y','-f','rawvideo','-pixel_format','rgba','-video_size',`${W}x${H}`,'-framerate','24','-i','pipe:0',
    '-ss',String(plan.source_offset),'-i',path.resolve(__dirname,'..',plan.score),'-map','0:v:0','-map','1:a:0','-t','30',
    '-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','320k',
    '-af','afade=t=in:st=0:d=0.003,afade=t=out:st=29.65:d=0.35','-movflags','+faststart',
    '-metadata','title=Big Tex: Rewired — 30-second Teaser v03',
    '-metadata',`comment=Lightning strike on first frame; title through final frame. Continuous score excerpt ${plan.source_offset.toFixed(3)}–${plan.source_end.toFixed(3)} seconds at original tempo.`,output];
  const ff=spawn('ffmpeg',args,{stdio:['pipe','inherit','inherit']});
  let failure;ff.stdin.on('error',error=>{failure=error;});
  const done=new Promise((resolve,reject)=>{ff.once('error',reject);ff.once('close',code=>code===0?resolve():reject(Error('Encoder exit '+code)));});
  for(let frame=0;frame<720;frame++){
    if(failure)throw failure;draw(frame/24);
    if(!ff.stdin.write(canvas.data()))await once(ff.stdin,'drain');
    if(frame%240===0)console.log(`Rendered ${frame/24} / 30 seconds.`);
  }
  ff.stdin.end();await done;console.log('Complete: '+output);
}
(async()=>{await prepare();stills();if(process.argv.includes('--render'))await render();})().catch(error=>{console.error(error);process.exitCode=1;});
