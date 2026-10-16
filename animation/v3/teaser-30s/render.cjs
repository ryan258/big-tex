const fs=require('node:fs'),path=require('node:path');
const {spawn,spawnSync}=require('node:child_process');
const {once}=require('node:events');
const {prepare,Art,C,createCanvas}=require('../art.cjs');
const scenes=require('../scenes.cjs');
const plan=require('./timeline.json');
const OUT=__dirname,FPS=24,W=1080,H=1920;
const lut=`lut3d=file=${path.join(OUT,'sun-faded-texas.cube')}:interp=tetrahedral`;
function draw(art,t){
 let index=0;while(index+1<plan.shots.length&&t>=plan.shots[index+1].start-1e-7)index++;
 const shot=plan.shots[index];let l=0,r=plan.hits.length;
 while(l<r){const m=(l+r)>>1;if(plan.hits[m].time<=t+1/48)l=m+1;else r=m;}
 const hit=plan.hits[l-1],elapsed=hit?t-hit.time:100;
 const pulse=elapsed<.2?Math.exp(-Math.max(0,elapsed)*22)*Math.min(1,hit.strength/1.4):0;
 scenes.render(art,t,{shot,index,pulse});return index;
}
function grade(source,output){
 const result=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',source,'-vf',lut,'-frames:v','1','-update','1',output],{stdio:'inherit'});
 if(result.status!==0)throw Error('Still color treatment failed');
}
function stills(art){
 const work=path.join(OUT,'work');fs.mkdirSync(work,{recursive:true});
 const cw=360,ch=640,gap=36,cols=4;
 const sheet=createCanvas(cw*cols,Math.ceil(plan.shots.length/cols)*(ch+gap)+80),c=sheet.getContext('2d');
 c.fillStyle=C.paper;c.fillRect(0,0,sheet.width,sheet.height);c.fillStyle=C.ink;c.font='27px CutTitle';
 c.fillText('BIG TEX: REWIRED / v3 / 30s TEXAS TEASER',20,50);
 plan.shots.forEach((shot,i)=>{
  draw(art,shot.start+shot.duration*.55);const x=i%cols*cw,y=80+Math.floor(i/cols)*(ch+gap);
  c.drawImage(art.canvas,x,y,cw,ch);c.fillStyle=C.ink;c.font='14px CutTitle';
  c.fillText(`${shot.start.toFixed(2)}s / ${shot.kind}`,x+10,y+ch+24);
 });
 const sourceSheet=path.join(work,'storyboard-source.png');fs.writeFileSync(sourceSheet,sheet.toBuffer('image/png'));
 grade(sourceSheet,path.join(OUT,'storyboard.jpg'));
 for(const [t,name] of [[0,'hook'],[12.5,'traffic'],[19,'coupons'],[28,'poster']]){
  draw(art,t);const source=path.join(work,name+'-source.png');fs.writeFileSync(source,art.canvas.toBuffer('image/png'));
  grade(source,path.join(OUT,name+'.jpg'));
 }
 console.log('Color-treated storyboard and key stills ready.');
}
async function video(art){
 const output=path.join(OUT,'big-tex-rewired-v03-30s-vertical-teaser.mp4');
 const args=['-hide_banner','-loglevel','warning','-y','-f','rawvideo','-pixel_format','rgba','-video_size',`${W}x${H}`,'-framerate','24','-i','pipe:0',
  '-i',path.join(OUT,'soundtrack.wav'),'-map','0:v:0','-map','1:a:0','-vf',lut,'-t','30',
  '-c:v','libx264','-preset','veryfast','-crf','18','-threads','4','-pix_fmt','yuv420p','-c:a','aac','-b:a','320k','-movflags','+faststart',
  '-metadata','title=Big Tex: Rewired — v3 Texas Jokes / 30-second Vertical Teaser',
  '-metadata','comment=Re-edited v3 Texas monster comedy. Sun-faded turquoise, coral, cream, and petrol-blue treatment. Continuous score at original tempo; strongest excerpt attack drives the final title.',output];
 const encoder=spawn('ffmpeg',args,{stdio:['pipe','inherit','inherit']});
 let failure;encoder.stdin.on('error',error=>{failure=error;});
 const done=new Promise((resolve,reject)=>{encoder.once('error',reject);encoder.once('close',code=>code===0?resolve():reject(Error('Encoder exit '+code)));});
 for(let frame=0;frame<720;frame++){
  if(failure)throw failure;draw(art,frame/FPS);
  if(!encoder.stdin.write(art.canvas.data()))await once(encoder.stdin,'drain');
  if(frame%240===0)console.log(`Rendered ${frame/24} / 30 seconds with color treatment.`);
 }
 encoder.stdin.end();await done;console.log('Complete: '+output);
}
(async()=>{await prepare();const art=new Art(W,H);stills(art);if(process.argv.includes('--render'))await video(art);})().catch(error=>{console.error(error);process.exitCode=1;});
