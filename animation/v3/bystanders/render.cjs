const fs=require('node:fs'),path=require('node:path');
const {spawn,spawnSync}=require('node:child_process');
const {once}=require('node:events');
const {prepare,Art,C,createCanvas}=require('../art.cjs');
const scenes=require('../scenes.cjs'),reactions=require('./reactions.cjs');
const OUT=__dirname,plan=scenes.plan;
const lut=path.resolve(OUT,'../teaser-30s/sun-faded-texas.cube');
const filter=`lut3d=file=${lut}:interp=tetrahedral`;
const formats=[{name:'wide',width:1920,height:1080,source:'big-tex-rewired-90s-v03.mp4',output:'big-tex-rewired-90s-v03-bystanders.mp4'},
 {name:'vertical',width:1080,height:1920,source:'big-tex-rewired-90s-v03-vertical.mp4',output:'big-tex-rewired-90s-v03-bystanders-vertical.mp4'}];
function draw(art,t){const {shot,index}=scenes.render(art,t);reactions.draw(art,t,shot);return {shot,index};}
function grade(source,target){
 const result=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',source,'-vf',filter,'-frames:v','1','-update','1',target],{stdio:'inherit'});
 if(result.status!==0)throw Error('Still treatment failed');
}
const picks=[0,3.7,8.6,17.6,24.5,26.4,30.2,33.4,38,40.1,43,46.3,51.6,60.5,70.1,74.5,77.3,80.5,83,87];
function stills(targets){
 const work=path.join(OUT,'work');fs.mkdirSync(work,{recursive:true});
 for(const {format,art} of targets){
  const cw=format.name==='wide'?480:270,ch=format.name==='wide'?270:480,cols=4,gap=32;
  const sheet=createCanvas(cw*cols,Math.ceil(picks.length/cols)*(ch+gap)+64),c=sheet.getContext('2d');
  c.fillStyle=C.paper;c.fillRect(0,0,sheet.width,sheet.height);c.fillStyle=C.ink;c.font='22px CutTitle';c.fillText(`BIG TEX: REWIRED / 90s / BYSTANDERS / ${format.name.toUpperCase()}`,14,40);
  picks.forEach((t,i)=>{
   const {shot}=draw(art,t),x=i%cols*cw,y=64+Math.floor(i/cols)*(ch+gap);
   c.drawImage(art.canvas,x,y,cw,ch);c.fillStyle=C.ink;c.font='14px CutTitle';c.fillText(`${t.toFixed(2)}s / ${shot.kind}`,x+10,y+ch+22);
  });
  const raw=path.join(work,`storyboard-${format.name}.png`);fs.writeFileSync(raw,sheet.toBuffer('image/png'));grade(raw,path.join(OUT,`storyboard-${format.name}.jpg`));
  for(const [t,label] of [[0,'hook'],[26.4,'hat-hit'],[33.4,'traffic'],[43,'wheel-chase'],[46.3,'pylon'],[80.5,'coupons'],[83,'snack'],[87,'poster']]){
   draw(art,t);const raw=path.join(work,`${label}-${format.name}.png`);fs.writeFileSync(raw,art.canvas.toBuffer('image/png'));grade(raw,path.join(OUT,`${label}-${format.name}.jpg`));
  }
 }
 fs.writeFileSync(path.join(OUT,'reaction-cues.json'),JSON.stringify(reactions.manifest(),null,2)+'\n');
 console.log('Both 90-second bystander storyboards and keyframes ready.');
}
function encoder(target){
 const {art,format}=target,output=path.join(OUT,format.output);
 const args=['-hide_banner','-loglevel','warning','-y','-f','rawvideo','-pixel_format','rgba','-video_size',`${art.W}x${art.H}`,'-framerate','24','-i','pipe:0',
  '-i',path.resolve(OUT,'..',format.source),'-map','0:v:0','-map','1:a:0','-vf',filter,'-t','90',
  '-c:v','libx264','-preset','veryfast','-crf','18','-threads','4','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart',
  '-metadata',`title=Big Tex: Rewired — 90-second v3 / Bystanders / ${format.name}`,
  '-metadata','comment=Original Texas jokes and 90-second soundtrack. Twelve articulated bystanders react to saved score attacks. Sun-faded turquoise/coral treatment. Clockwise wheel rotation follows rightward travel.',output];
 const child=spawn('ffmpeg',args,{stdio:['pipe','inherit','inherit']});let failure;child.stdin.on('error',error=>{failure=error;});
 const done=new Promise((resolve,reject)=>{child.once('error',reject);child.once('close',code=>code===0?resolve():reject(Error('Encoder exit '+code)));});
 return {...target,child,done,output,write:async()=>{if(failure)throw failure;if(!child.stdin.write(art.canvas.data()))await once(child.stdin,'drain');}};
}
async function video(targets){
 const encoders=targets.map(encoder),start=Date.now();
 for(let frame=0;frame<2160;frame++){
  for(const target of encoders)draw(target.art,frame/24);
  await Promise.all(encoders.map(target=>target.write()));
  if(frame%240===0)console.log(`90s bystanders: ${frame/24} / 90 seconds; ${((Date.now()-start)/1000).toFixed(1)}s elapsed.`);
 }
 for(const target of encoders)target.child.stdin.end();await Promise.all(encoders.map(target=>target.done));
 for(const target of encoders)console.log('Complete: '+target.output);
}
(async()=>{
 await Promise.all([prepare(),reactions.prepare()]);
 const targets=formats.filter(f=>!process.argv.includes('--wide-only')||f.name==='wide').filter(f=>!process.argv.includes('--vertical-only')||f.name==='vertical').map(format=>({format,art:new Art(format.width,format.height)}));
 if(!process.argv.includes('--video-only'))stills(targets);
 if(process.argv.includes('--render'))await video(targets);
})().catch(error=>{console.error(error);process.exitCode=1;});
