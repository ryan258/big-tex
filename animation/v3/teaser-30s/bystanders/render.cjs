const fs=require('node:fs'),path=require('node:path');
const {spawn,spawnSync}=require('node:child_process');
const {once}=require('node:events');
const {prepare,Art,C,createCanvas}=require('../../art.cjs');
const scenes=require('../../scenes.cjs');
const plan=require('../timeline.json');
const cast=require('./cast.cjs'),reactions=require('./reactions.cjs');
const OUT=__dirname,W=1080,H=1920;
const parent=path.resolve(OUT,'..');
const originalVideo=path.join(parent,'big-tex-rewired-v03-30s-vertical-teaser.mp4');
const lut=`lut3d=file=${path.join(parent,'sun-faded-texas.cube')}:interp=tetrahedral`;
function draw(art,t){
 let index=0;while(index+1<plan.shots.length&&t>=plan.shots[index+1].start-1e-7)index++;
 const shot=plan.shots[index];let l=0,r=plan.hits.length;
 while(l<r){const m=(l+r)>>1;if(plan.hits[m].time<=t+1/48)l=m+1;else r=m;}
 const hit=plan.hits[l-1],elapsed=hit?t-hit.time:100;
 const pulse=elapsed<.2?Math.exp(-Math.max(0,elapsed)*22)*Math.min(1,hit.strength/1.4):0;
 scenes.render(art,t,{shot,index,pulse});reactions.draw(art,t,shot);
 return index;
}
function grade(source,output){
 const result=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',source,'-vf',lut,'-frames:v','1','-update','1',output],{stdio:'inherit'});
 if(result.status!==0)throw Error('Preview treatment failed');
}
function stills(art){
 const work=path.join(OUT,'work');fs.mkdirSync(work,{recursive:true});
 const samples=[0,2.75,3.50,4.5,7.2,9.2,10.2,11.5,12.3,13.55,14.67,15.25,16.2,17.7,18.67,20.5,22.6,23.6,25.5,28];
 const cw=360,ch=640,gap=35,cols=4;
 const sheet=createCanvas(cw*cols,Math.ceil(samples.length/cols)*(ch+gap)+80),c=sheet.getContext('2d');
 c.fillStyle=C.paper;c.fillRect(0,0,sheet.width,sheet.height);c.fillStyle=C.ink;c.font='27px CutTitle';
 c.fillText('BIG TEX: REWIRED / 30s / BYSTANDER REACTIONS',20,50);
 samples.forEach((t,i)=>{
  const index=draw(art,t),x=i%cols*cw,y=80+Math.floor(i/cols)*(ch+gap);
  c.drawImage(art.canvas,x,y,cw,ch);c.fillStyle=C.ink;c.font='14px CutTitle';
  c.fillText(`${t.toFixed(2)}s / ${plan.shots[index].kind}`,x+10,y+ch+24);
 });
 const source=path.join(work,'storyboard-source.png');fs.writeFileSync(source,sheet.toBuffer('image/png'));grade(source,path.join(OUT,'storyboard.jpg'));
 for(const [t,name] of [[0,'hook'],[9.2,'filmer'],[12.3,'traffic'],[18.67,'coupons'],[20.5,'snack'],[28,'poster']]){
  draw(art,t);const raw=path.join(work,name+'-source.png');fs.writeFileSync(raw,art.canvas.toBuffer('image/png'));grade(raw,path.join(OUT,name+'.jpg'));
 }
 // An isolated filmstrip makes the articulated phone/hand movement inspectable.
 const sheet2=createCanvas(1440,560),c2=sheet2.getContext('2d');c2.fillStyle=C.paper;c2.fillRect(0,0,1440,560);
 for(let i=0;i<4;i++){
  const t=i*.125,a=new Art(360,520);a.ctx.fillStyle=C.paper;a.ctx.fillRect(0,0,360,520);
  cast.draw(a.ctx,'phone-filmer',180,490,480,{time:t,age:t,reaction:Math.exp(-t*7.5),behavior:'flinch'});
  c2.drawImage(a.canvas,i*360,0);c2.fillStyle=C.ink;c2.font='18px CutTitle';c2.fillText(`Hit + ${t.toFixed(3)}s`,i*360+15,547);
 }
 const motion=path.join(work,'motion-source.png');fs.writeFileSync(motion,sheet2.toBuffer('image/png'));grade(motion,path.join(OUT,'joint-motion.jpg'));
 const cues={source_timeline:'../timeline.json',cast_source:'../../../../assets/bystanders/classic',characters:reactions.usage,
  placements:reactions.placements,cues:reactions.cues,scale:reactions.scaleInfo(),motion:'Group rotations use SVG pivots. Phones, hands, hats, balloons, and other attached props follow parent transformations. Movement is stepped at 12 fps; cuts and cue starts use 24 fps.',
  title_clear_from:plan.shots.at(-1).start};
 fs.writeFileSync(path.join(OUT,'reaction-cues.json'),JSON.stringify(cues,null,2)+'\n');
 console.log('Bystander storyboards and motion previews ready.');
}
async function video(art){
 const output=path.join(OUT,'big-tex-rewired-v03-30s-vertical-bystanders-v02.mp4');
 const args=['-hide_banner','-loglevel','warning','-y','-f','rawvideo','-pixel_format','rgba','-video_size',`${W}x${H}`,'-framerate','24','-i','pipe:0',
  '-i',originalVideo,'-map','0:v:0','-map','1:a:0','-vf',lut,'-t','30',
  '-c:v','libx264','-preset','veryfast','-crf','18','-threads','4','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart',
  '-metadata','title=Big Tex: Rewired — 30-second Vertical Teaser / Bystander Reactions',
  '-metadata','comment=Original v3 Texas jokes, score, and sun-faded color treatment. Twelve bystander characters with articulated, hit-aligned reactions. Audio copied from the existing local teaser export.',output];
 const encoder=spawn('ffmpeg',args,{stdio:['pipe','inherit','inherit']});
 let failure;encoder.stdin.on('error',error=>{failure=error;});
 const done=new Promise((resolve,reject)=>{encoder.once('error',reject);encoder.once('close',code=>code===0?resolve():reject(Error('Encoder exit '+code)));});
 for(let frame=0;frame<720;frame++){
  if(failure)throw failure;draw(art,frame/24);
  if(!encoder.stdin.write(art.canvas.data()))await once(encoder.stdin,'drain');
  if(frame%240===0)console.log(`Rendered ${frame/24} / 30 seconds with bystander reactions.`);
 }
 encoder.stdin.end();await done;console.log('Complete: '+output);
}
(async()=>{await Promise.all([prepare(),cast.prepare()]);const art=new Art(W,H);stills(art);if(process.argv.includes('--render'))await video(art);})().catch(error=>{console.error(error);process.exitCode=1;});
