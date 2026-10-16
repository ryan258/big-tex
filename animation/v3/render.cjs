const fs=require('node:fs'),path=require('node:path');
const {spawn}=require('node:child_process');
const {once}=require('node:events');
const {prepare,Art,C,createCanvas}=require('./art.cjs');
const {render,plan}=require('./scenes.cjs');
const OUT=__dirname;
function snapshot(art,t,file){render(art,t);fs.writeFileSync(path.join(OUT,file),art.canvas.toBuffer('image/jpeg',93));}
function stills(wide,portrait){
 const picks=['hook','strike','off-cables','guard-card','hat-card','hat-hit','traffic-punch','wheel-card','pylon-rip','main-title','coupons','end-title'];
 const make=(art,isPortrait)=>{
  const cellW=isPortrait?360:640,cellH=isPortrait?640:360,cols=3,gap=42;
  const sheet=createCanvas(cols*cellW,Math.ceil(picks.length/cols)*(cellH+gap)+90),c=sheet.getContext('2d');
  c.fillStyle=C.paper;c.fillRect(0,0,sheet.width,sheet.height);c.fillStyle=C.ink;c.font='25px CutTitle';
  c.fillText(`BIG TEX: REWIRED / 90s v3 / ${isPortrait?'PORTRAIT':'WIDE'}`,20,52);
  picks.forEach((kind,i)=>{
   const shot=plan.shots.find(s=>s.kind===kind);const t=shot.start+Math.min(shot.duration*.58,1.1);
   render(art,t);const x=i%cols*cellW,y=90+Math.floor(i/cols)*(cellH+gap);
   c.drawImage(art.canvas,x,y,cellW,cellH);c.fillStyle=C.ink;c.font='15px CutTitle';c.fillText(`${shot.start.toFixed(2)}s / ${kind}`,x+12,y+cellH+26);
  });
  fs.writeFileSync(path.join(OUT,`storyboard-${isPortrait?'vertical':'wide'}-v03.jpg`),sheet.toBuffer('image/jpeg',89));
 };
 make(wide,false);make(portrait,true);
 snapshot(wide,0,'hook-wide-v03.jpg');snapshot(portrait,0,'hook-vertical-v03.jpg');
 snapshot(wide,87,'poster-wide-v03.jpg');snapshot(portrait,87,'poster-vertical-v03.jpg');
 snapshot(wide,25,'hat-card-wide-v03.jpg');snapshot(portrait,25,'hat-card-vertical-v03.jpg');
 console.log('Wide and portrait storyboards, hooks, and posters ready.');
}
function encoder(art,vertical){
 const output=path.join(OUT,vertical?'big-tex-rewired-90s-v03-vertical.mp4':'big-tex-rewired-90s-v03.mp4');
 const args=['-hide_banner','-loglevel','warning','-y','-f','rawvideo','-pixel_format','rgba','-video_size',`${art.W}x${art.H}`,'-framerate','24','-i','pipe:0',
  '-i',path.join(OUT,'soundtrack-v03.wav'),'-map','0:v:0','-map','1:a:0','-t','90',
  '-c:v','libx264','-preset','veryfast','-crf','18','-threads','4','-pix_fmt','yuv420p','-c:a','aac','-b:a','320k','-movflags','+faststart',
  '-metadata',`title=Big Tex: Rewired — 90-second v3 ${vertical?'Portrait':'Widescreen'} Demo`,
  '-metadata','comment=Original animated monster-comedy concept. Texas fair references are fictionalized for the story. Original supplied score at native tempo, with locally synthesized effects and a brief music duck for the comedy button.',output];
 const process=spawn('ffmpeg',args,{stdio:['pipe','inherit','inherit']});
 let failure;process.stdin.on('error',error=>{failure=error;});
 const done=new Promise((resolve,reject)=>{process.once('error',reject);process.once('close',code=>code===0?resolve():reject(Error('Encoder exit '+code)));});
 return {art,process,done,output,write:async()=>{if(failure)throw failure;if(!process.stdin.write(art.canvas.data()))await once(process.stdin,'drain');}};
}
async function video(wide,portrait){
 const targets=[encoder(wide,false),encoder(portrait,true)];
 const start=Date.now();
 for(let frame=0;frame<2160;frame++){
  for(const target of targets)render(target.art,frame/24);
  await Promise.all(targets.map(target=>target.write()));
  if(frame%240===0)console.log(`Both formats: ${frame/24} / 90 seconds; ${((Date.now()-start)/1000).toFixed(1)}s elapsed.`);
 }
 for(const target of targets)target.process.stdin.end();
 await Promise.all(targets.map(target=>target.done));
 console.log('Completed both 90-second v3 videos.');
}
(async()=>{await prepare();const wide=new Art(1920,1080),portrait=new Art(1080,1920);stills(wide,portrait);if(process.argv.includes('--render'))await video(wide,portrait);})().catch(error=>{console.error(error);process.exitCode=1;});
