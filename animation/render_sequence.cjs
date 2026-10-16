/* Original cut-paper title animation. No network, browser, or AI calls. */
const fs = require('node:fs');
const path = require('node:path');
const {spawn} = require('node:child_process');
const {once} = require('node:events');
const runtime = process.env.BIG_TEX_NODE_MODULES || '/Users/ryanjohnson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
let canvasModule;
try { canvasModule = require('@napi-rs/canvas'); }
catch { canvasModule = require(path.join(runtime, '@napi-rs/canvas')); }
const {createCanvas, loadImage, GlobalFonts} = canvasModule;
const ROOT = __dirname;
const timing = JSON.parse(fs.readFileSync(path.join(ROOT, 'timing.json')));
const W = 1920, H = 1080, FPS = 12;
const C = {ink:'#191815', red:'#C83E2D', gold:'#D5A326', paper:'#F3E6CC'};
const fontPath = process.env.BIG_TEX_FONT || '/System/Library/Fonts/Supplemental/Arial Black.ttf';
if (!GlobalFonts.registerFromPath(fontPath, 'CutTitle')) throw Error('Title font unavailable: '+fontPath);
const canvas = createCanvas(W,H);
const ctx = canvas.getContext('2d');
const images = {};
const clamp = (v,a=0,b=1) => Math.max(a,Math.min(b,v));
const ease = v => 1-Math.pow(1-clamp(v),3);
const lerp = (a,b,v) => a+(b-a)*v;
const jitter = n => Math.sin(n*78.233+19.19)*Math.cos(n*12.9898);
const sceneNames = ['Howdy, folks','Step right up','Everything is bigger','A freak storm','One strike','Steel underneath','Fifty-five feet of trouble','First footfall','Send everybody','Off the cables','The Midway is melting','Maximum voltage','Dallas after dark','Yee. Haw.','Big Tex','Rewired','See y’all next fall','End title'];

function poly(points,fill) {
  ctx.fillStyle=fill; ctx.beginPath();
  points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
  ctx.closePath(); ctx.fill();
}
function rect(x,y,w,h,color,angle=0) {
  ctx.save();ctx.translate(x,y);ctx.rotate(angle*Math.PI/180);
  ctx.fillStyle=color;ctx.fillRect(0,0,w,h);ctx.restore();
}
function word(text,x,y,size,color,options={}) {
  const {max=W-x-100, local=10, delay=0, angle=0, stagger=.045, rough=1}=options;
  ctx.save();ctx.translate(x,y);ctx.rotate(angle*Math.PI/180);
  ctx.font=`${size}px CutTitle`;ctx.textBaseline='alphabetic';
  const letters=[...text]; const gap=size*.012;
  const widths=letters.map(l=>ctx.measureText(l).width);
  const total=widths.reduce((a,b)=>a+b,0)+gap*(letters.length-1);
  ctx.scale(Math.min(1,max/total),1);
  let cursor=0;
  letters.forEach((letter,i)=>{
    const progress=ease((local-delay-i*stagger)/.35);
    if(progress>0) {
      ctx.save(); ctx.translate(cursor+widths[i]/2, (1-progress)*size*.95+jitter(i+text.length)*size*.012*rough);
      ctx.rotate(jitter(i+3)*.026*rough+(1-progress)*.12);
      ctx.fillStyle=color;ctx.fillText(letter,-widths[i]/2,0);ctx.restore();
    }
    cursor+=widths[i]+gap;
  });
  ctx.restore();
}
function icon(slug,x,y,size,angle=0,dark=false,options={}) {
  const collection=images[slug][typeof dark==='string'?dark:dark?'dark':'light'];
  ctx.save();ctx.translate(x,y);ctx.rotate(angle*Math.PI/180);ctx.scale(size/256,size/256);
  for(const [group,img] of Object.entries(collection)) {
    if(options.wheelOnly && group==='supports') continue;
    ctx.save();
    if(options.wheel!==undefined && ['wheel','gondolas','hub'].includes(group)) {
      ctx.translate(0,-9);ctx.rotate(options.wheel*Math.PI/180);ctx.translate(0,9);
    }
    if(options.fire!==undefined && ['fire','embers'].includes(group)) ctx.translate(0,options.fire);
    if(options.charge!==undefined && ['charge','eyes','palm-charge','arcs','snapped-lines'].includes(group)) {
      ctx.translate(jitter(Math.floor(options.charge*12))*2,jitter(Math.floor(options.charge*12)+2)*2);
    }
    ctx.drawImage(img,-128,-128,256,256);ctx.restore();
  }
  ctx.restore();
}

// Fine, deterministic print grain; repositions on twos for a subtle paper boil.
const grain=createCanvas(W,H), gc=grain.getContext('2d');
let randomSeed=1847;
function rand(){randomSeed=(randomSeed*1664525+1013904223)>>>0;return randomSeed/4294967296;}
for(let i=0;i<34000;i++){
  gc.fillStyle=i%3?'rgba(30,24,18,.035)':'rgba(255,247,225,.06)';
  gc.fillRect(rand()*W,rand()*H,rand()*1.4+.3,rand()*1.4+.3);
}

function pulseAt(t){
  let low=0,high=timing.onsets.length;
  while(low<high){let mid=(low+high)>>1;if(timing.onsets[mid]<=t)low=mid+1;else high=mid;}
  const elapsed=t-(timing.onsets[low-1]??-100);
  return elapsed<.22?Math.exp(-elapsed*19):0;
}

function draw(t, override=null){
  t=Math.floor(t*FPS)/FPS;
  let scene=0;
  while(scene+1<timing.cuts.length-1 && t>=timing.cuts[scene+1]) scene++;
  if(override) scene=override.scene;
  const local=override?.local??t-timing.cuts[scene], duration=override?.duration??timing.cuts[scene+1]-timing.cuts[scene];
  const u=override?.progress??clamp(local/duration), enter=ease(local/.85), pulse=override?.pulse??pulseAt(t);
  const tick=Math.floor(local*6);
  const dark=[3,5,8,12,15,17].includes(scene);
  const bg=dark?C.ink:[2,4,10,16].includes(scene)?C.red:[7,11].includes(scene)?C.gold:C.paper;
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  ctx.save();
  switch(scene){
    case 0:
      poly([[0,140],[lerp(0,670,enter),112],[lerp(0,650,enter),150],[0,180]],C.red);
      rect(1550+(1-enter)*600,-100,95,1250,C.ink,13);
      word('HOOOOWDY,',110,400,175,C.ink,{local,delay:.2,max:1650});
      word('FOLKS.',630,735,270,C.red,{local,delay:1.1,max:1120,angle:-3});
      icon('cowboy-hat',260,800,400,-12,false);
      break;
    case 1:
      icon('ferris-wheel',550-(1-enter)*900,540,1000,0,false,{wheel:local*17});
      rect(1130,80,810,910,C.red,-3);
      word('STEP',1200,350,175,C.paper,{local,max:640});
      word('RIGHT',1180,580,165,C.paper,{local,delay:.5,max:650,angle:-3});
      word('UP.',1230,840,240,C.ink,{local,delay:1,max:550,angle:3});
      break;
    case 2:
      poly([[0,870],[1920,990],[1920,1080],[0,1080]],C.ink);
      icon('corny-dog',580,550+(1-enter)*1000,960,-13+Math.floor(local*3)%2*3,'red');
      word('EVERYTHING',1040,440,106,C.paper,{local,delay:.3,max:770,angle:-3});
      word('IS BIGGER.',1040,610,133,C.ink,{local,delay:.8,max:760,angle:2});
      icon('cowboy-hat',1550,175,360,12,false);
      break;
    case 3:
      for(let n=0;n<4;n++) poly([[0,50+n*45],[1400,5+n*52],[1920,70+n*38],[1920,87+n*38],[0,85+n*45]],n%2?C.red:C.gold);
      icon('power-tower',1430+(1-enter)*900,620,1060,-4,true,{charge:t});
      word('A FREAK',110,470,160,C.paper,{local,max:1050});
      word('STORM.',110,710,210,C.red,{local,delay:.6,max:1080,angle:-3});
      break;
    case 4:
      rect(-150,260,2300,165,C.ink,-14);
      rect(-100,700,2300,115,C.ink,8);
      icon('lightning',960+jitter(tick)*pulse*10,510-(1-enter)*1500,1280*(1+pulse*.035),-8,'red');
      poly([[450,887],[1540,863],[1560,1030],[470,1050]],C.ink);
      word('ONE STRIKE.',485,990,108,C.paper,{local,delay:1,max:1100,angle:-2});
      break;
    case 5:
      icon('steel-skull',1290,555,1000*(1+.04*u),jitter(tick)*pulse*2,true,{charge:t});
      word('FIBERGLASS.',110,350,100,C.paper,{local,max:890});
      if(local>1.7) {
        rect(75,290,lerp(0,970,ease((local-1.7)/.3)),35,C.red,-1);
        word('STEEL.',105,690,230,C.red,{local:local-2,max:990,angle:-4});
      }
      break;
    case 6:
      poly([[1000,0],[1920,0],[1920,1080],[1060,1080]],C.red);
      icon('big-tex',570,570+(1-enter)*1100,1220,-3,false,{charge:t});
      word('FIFTY-FIVE',1120,320,105,C.paper,{local,max:700});
      word('FEET',1110,590,240,C.ink,{local,delay:.5,max:690,angle:3});
      word('OF TROUBLE.',1120,790,100,C.paper,{local,delay:1,max:700,angle:-2});
      break;
    case 7:
      rect(-100,910,2200,220,C.ink,-2);
      icon('cowboy-boot',1330+jitter(tick)*pulse*8,485-(1-enter)*1350+pulse*12,1100,-8,false);
      word('FIRST',110,380,190,C.ink,{local,max:950});
      word('FOOTFALL.',110,620,140,C.red,{local,delay:.45,max:1000,angle:-3});
      if(local>.65) for(let n=0;n<7;n++){
        const x=250+n*265;
        poly([[x,940],[x+80,910],[x+38,985],[x+110,1040],[x+12,1007]],C.red);
      }
      break;
    case 8:
      word('SEND',110,220,140,C.paper,{local,max:740});
      word('EVERYBODY.',110,365,135,C.red,{local,delay:.5,max:1150,angle:-2});
      icon('helicopter',lerp(2200,1330,enter)+u*140,620+Math.floor(local*4)%2*14,780,-8,true);
      icon('tank',lerp(-530,580,enter)+u*240,850,780,1,true);
      rect(0,1020,1920,60,C.red,-1);
      break;
    case 9:
      icon('power-tower',320-(u>.7?(u-.7)*1600:0),600,740,-10-u*12,false,{charge:t});
      for(let n=0;n<3;n++) rect(600,185+n*292,1410,240,n===1?C.red:C.ink,n%2?2:-2);
      word('OFF',750,370,210,C.paper,{local,max:1000});
      word('THE',940,665,205,C.paper,{local,delay:.4,max:800,angle:2});
      word('CABLES.',660,950,205,C.paper,{local,delay:.8,max:1160,angle:-2});
      break;
    case 10:
      word('THE MIDWAY',110,230,145,C.paper,{local,max:1690,angle:-2});
      word('IS MELTING.',110,425,145,C.ink,{local,delay:.45,max:1690,angle:2});
      icon('dallas-skyline',1590,870,620,0,false,{fire:Math.sin(t*10)*2});
      icon('ferris-wheel',lerp(150,2000,u),850,1180,-u*390,false,{wheelOnly:true});
      break;
    case 11:
      poly([[0,1000],[1920,870],[1920,1080],[0,1080]],C.red);
      icon('electric-hand',575-(1-enter)*1100,570,1250,-9+Math.floor(local*3)%2*2,false,{charge:t});
      word('MAXIMUM',1090,440,123,C.ink,{local,max:730,angle:2});
      word('VOLTAGE.',1060,650,150,C.red,{local,delay:.5,max:770,angle:-4});
      rect(1130,740,650,22,C.ink,-3);
      break;
    case 12:
      word('DALLAS',110,225,170,C.paper,{local,max:1350,angle:-2});
      word('AFTER DARK.',120,350,100,C.red,{local,delay:.5,max:1500});
      icon('dallas-skyline',1130,970+(1-enter)*1000,1500,0,true,{fire:jitter(tick)*3});
      break;
    case 13: {
      const cut=override?.montageIndex??Math.floor(local/.8);
      const montage=['cowboy-hat','steel-skull','tank','electric-hand','lightning','cowboy-boot','helicopter','big-tex'];
      const reversed=cut%2===1;
      ctx.fillStyle=reversed?C.ink:C.paper;ctx.fillRect(0,0,W,H);
      for(let n=0;n<5;n++) rect(-100,100+n*245,2300,50,C.red,n%2?12:-11);
      icon(montage[cut%montage.length],960,540,1220+pulse*50,cut%2?12:-12,reversed,{charge:t});
      if(!override?.silentMontage) word(cut%2?'HAW.':'YEE.',cut%2?110:1340,cut%2?930:230,190,C.red,{max:560,angle:cut%2?-5:5});
      break;
    }
    case 14:
      rect(0,20,lerp(0,1920,enter),37,C.red,-1);
      word('BIG',105,450,430,C.ink,{local,max:1040,stagger:.16,angle:-3});
      word('TEX',690,890,480,C.ink,{local,delay:.8,max:1100,stagger:.16,angle:2});
      icon('cowboy-hat',1510,220-(1-enter)*600,560,12,false);
      icon('lightning',400,800,340,-20,false);
      if(!override?.tight) word('FIFTY-FIVE FEET. ZERO RESTRAINT.',100,1025,49,C.red,{local,delay:2,max:1700,rough:.3});
      break;
    case 15:
      for(let n=0;n<5;n++) poly([[0,n*40+50],[1920,140+n*35],[1920,155+n*35],[0,n*40+72]],n%2?C.red:C.gold);
      icon('steel-skull',1630,360,380,8,true,{charge:t});
      word('BIG TEX:',110,405,110,C.paper,{local,max:1050});
      word('REWIRED',100,730,305,C.paper,{local,delay:.5,max:1740,stagger:.08,angle:-2});
      rect(-30,815,2050,36,C.red,-2);
      word('EVERYTHING IS BIGGER.',110,1000,66,C.gold,{local,delay:1.5,max:1660,rough:.4});
      break;
    case 16:
      icon('big-tex',1710,605,1270,-4,'red',{charge:t});
      rect(90,160,1350,240,C.ink,-3);
      word('SEE Y’ALL...',125,340,160,C.paper,{local,max:1260,angle:-3});
      word('NEXT',110,650,240,C.paper,{local,delay:.6,max:1170,angle:2});
      word('FALL.',115,960,300,C.ink,{local,delay:1.2,max:1100,angle:-3});
      break;
    case 17:
      rect(0,0,53,1080,C.red,0);
      word('BIG TEX:',120,410,220,C.paper,{local,max:1460,stagger:.055,angle:-2});
      word('REWIRED',105,730,295,C.paper,{local,delay:.35,max:1710,stagger:.055,angle:1});
      icon('lightning',1660,300,490,-10,false);
      word('SEE Y’ALL NEXT FALL.',125,960,65,C.red,{local,delay:1.2,max:1650,rough:.4});
      break;
  }
  ctx.restore();
  ctx.save();
  ctx.translate((Math.floor(t*6)%3-1)*2,(Math.floor(t*6)%2)*2);
  ctx.drawImage(grain,-2,-2,W+4,H+4);ctx.restore();
  // Short physical-paper shutter transitions; hard cuts remain the main rhythm.
  if(!override?.hardCut && scene>0 && local<.18){
    const remaining=1-local/.18;
    poly([[0,0],[W*remaining,0],[W*remaining-150,H],[0,H]],scene%2?C.red:C.ink);
  }
  if(!override && t<.4){ctx.fillStyle=`rgba(25,24,21,${1-t/.4})`;ctx.fillRect(0,0,W,H);}
  if(!override && t>timing.duration-1){ctx.fillStyle=`rgba(25,24,21,${clamp((t-timing.duration+1)/.85)})`;ctx.fillRect(0,0,W,H);}
  return scene;
}

async function prepare(){
  const dir=path.resolve(ROOT,'../assets/title-sequence/icons');
  for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.svg'))){
    const slug=file.slice(0,-4), source=fs.readFileSync(path.join(dir,file),'utf8');
    images[slug]={light:{},dark:{},red:{}};
    const groups=[...source.matchAll(/<g id="([^"]+)"[^>]*>[\s\S]*?<\/g>/g)];
    for(const match of groups){
      const key=match[1].slice(slug.length+1);
      for(const mode of ['light','dark','red']){
        let markup=match[0];
        if(mode==='dark') markup=markup.replaceAll(C.ink,C.paper);
        if(mode==='red') markup=markup.replaceAll(C.gold,C.ink).replaceAll(C.red,C.paper);
        const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1536" viewBox="0 0 256 256">${markup}</svg>`;
        images[slug][mode][key]=await loadImage(Buffer.from(svg));
      }
    }
    if(!groups.length) throw Error('No SVG groups in '+file);
  }
}

async function stills(){
  const contact=createCanvas(1920,18/3*410+100), cc=contact.getContext('2d');
  cc.fillStyle=C.paper;cc.fillRect(0,0,contact.width,contact.height);
  cc.font='30px CutTitle';cc.fillStyle=C.ink;cc.fillText('BIG TEX: REWIRED / MOTION STORYBOARD',35,62);
  const posterTime=timing.cuts[15]+3;
  for(let i=0;i<sceneNames.length;i++){
    const t=timing.cuts[i]+Math.min(4.5,(timing.cuts[i+1]-timing.cuts[i])*.6);
    draw(t);
    const x=(i%3)*640, y=100+Math.floor(i/3)*410;
    cc.drawImage(canvas,x,y,640,360);
    cc.fillStyle=C.ink;cc.font='16px CutTitle';
    cc.fillText(`${String(i+1).padStart(2,'0')} / ${timing.cuts[i].toFixed(2)}s / ${sceneNames[i]}`,x+15,y+390);
  }
  fs.writeFileSync(path.join(ROOT,'storyboard.jpg'),contact.toBuffer('image/jpeg',90));
  draw(posterTime);fs.writeFileSync(path.join(ROOT,'poster.jpg'),canvas.toBuffer('image/jpeg',94));
  fs.writeFileSync(path.join(ROOT,'edit-map.json'),JSON.stringify(sceneNames.map((name,i)=>({name,start:timing.cuts[i],end:timing.cuts[i+1]})),null,2)+'\n');
  console.log('Wrote storyboard, poster, and editable scene map.');
}

async function render(){
  const destination=path.join(ROOT,'big-tex-rewired-title-sequence-v01.mp4');
  const score=path.resolve(ROOT,'..',timing.score);
  const args=['-hide_banner','-loglevel','warning','-y','-f','rawvideo','-pixel_format','rgba','-video_size',`${W}x${H}`,'-framerate',String(FPS),'-i','pipe:0','-i',score,'-map','0:v:0','-map','1:a:0','-t',String(timing.duration),'-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-r','24','-c:a','aac','-b:a','320k','-af',`afade=t=out:st=${timing.duration-.65}:d=0.65`,'-movflags','+faststart','-metadata','title=Big Tex: Rewired — Cut-paper Title Sequence','-metadata','comment=Original SVG animation. Full supplied trailer score; final 0.65-second audio fade.',destination];
  const ff=spawn('ffmpeg',args,{stdio:['pipe','inherit','inherit']});
  let encoderFailure;
  ff.stdin.on('error',error=>{encoderFailure=error;});
  const finished=new Promise((resolve,reject)=>{
    ff.once('error',reject);
    ff.once('close',code=>code===0?resolve():reject(Error('FFmpeg exited '+code)));
  });
  const frames=Math.ceil(timing.duration*FPS);
  const start=Date.now();
  for(let i=0;i<frames;i++){
    if(encoderFailure) throw encoderFailure;
    draw(i/FPS);
    if(!ff.stdin.write(canvas.data())) await once(ff.stdin,'drain');
    if(i%144===0) console.log(`Rendered ${(i/FPS).toFixed(0)} / ${timing.duration.toFixed(2)} sec (${((Date.now()-start)/1000).toFixed(1)} sec elapsed)`);
  }
  ff.stdin.end();await finished;
  console.log('Video complete: '+destination);
}

module.exports={prepare,draw,canvas,ctx,icon,word,poly,rect,C,W,H,sceneNames,grain};
if(require.main===module) (async()=>{await prepare();await stills();if(process.argv.includes('--render'))await render();})().catch(error=>{console.error(error);process.exitCode=1;});
