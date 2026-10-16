const fs=require('node:fs'),path=require('node:path');
let lib;try{lib=require('@napi-rs/canvas');}catch{lib=require(path.join(process.env.BIG_TEX_NODE_MODULES||'/Users/ryanjohnson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules','@napi-rs/canvas'));}
const {createCanvas,loadImage,GlobalFonts}=lib;
const C={ink:'#191815',red:'#C83E2D',gold:'#D5A326',paper:'#F3E6CC'};
const images={};
function variant(text,mode){
 if(mode==='dark')return text.replaceAll(C.ink,C.paper);
 if(mode==='red')return text.replaceAll(C.gold,C.ink).replaceAll(C.red,C.paper);
 return text;
}
async function imageSvg(markup,mode='light'){
 return loadImage(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1536" viewBox="0 0 256 256">${variant(markup,mode)}</svg>`));
}
async function prepare(){
 const font=process.env.BIG_TEX_FONT||'/System/Library/Fonts/Supplemental/Arial Black.ttf';
 if(!GlobalFonts.registerFromPath(font,'CutTitle'))throw Error('Missing title font');
 const dir=path.resolve(__dirname,'../../assets/title-sequence/icons');
 for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.svg'))){
  const slug=file.slice(0,-4),source=fs.readFileSync(path.join(dir,file),'utf8');
  images[slug]={light:{},dark:{},red:{}};
  const groups=[...source.matchAll(/<g id="([^"]+)"[^>]*>[\s\S]*?<\/g>/g)];
  for(const group of groups)for(const mode of ['light','dark','red'])
   images[slug][mode][group[1].slice(slug.length+1)]=await imageSvg(group[0],mode);
  if(slug==='big-tex'){
   const figure=groups.find(g=>g[1]==='big-tex-figure')[0];
   const charge=groups.find(g=>g[1]==='big-tex-charge')[0];
   const fp=[...figure.matchAll(/<path[\s\S]*?\/>/g)].map(m=>m[0]);
   const cp=[...charge.matchAll(/<path[\s\S]*?\/>/g)].map(m=>m[0]);
   images.parts={};
   for(const mode of ['light','dark','red'])images.parts[mode]={
    face:await imageSvg(`<g fill="${C.ink}">${fp.slice(1).join('')}</g>`,mode),
    hat:await imageSvg(`<g fill="${C.ink}">${fp[0]}</g>`,mode),
    collar:await imageSvg(`<g fill="${C.red}">${cp[1]}</g>`,mode),
    charge:await imageSvg(`<g fill="${C.red}">${cp[0]}</g>`,mode),
   };
  }
 }
}
const clamp=v=>Math.max(0,Math.min(1,v));
const noise=n=>Math.sin(n*78.233+19.19)*Math.cos(n*12.9898);
class Art{
 constructor(w,h){
  this.W=w;this.H=h;this.portrait=h>w;this.canvas=createCanvas(w,h);this.ctx=this.canvas.getContext('2d');
  this.grain=createCanvas(w,h);const g=this.grain.getContext('2d');let seed=1847;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<30000;i++){g.fillStyle=i%3?'rgba(30,24,18,.032)':'rgba(255,247,225,.055)';g.fillRect(random()*w,random()*h,random()*1.3+.4,random()*1.3+.4);}
 }
 poly(points,color){const c=this.ctx;c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
 rect(x,y,w,h,color,angle=0){const c=this.ctx;c.save();c.translate(x,y);c.rotate(angle*Math.PI/180);c.fillStyle=color;c.fillRect(0,0,w,h);c.restore();}
 word(text,x,y,size,color,{max=this.W-x-70,angle=0,rough=1}={}){
  const c=this.ctx;c.save();c.translate(x,y);c.rotate(angle*Math.PI/180);c.font=`${size}px CutTitle`;c.textBaseline='alphabetic';
  const glyphs=[...text],gap=size*.01,widths=glyphs.map(t=>c.measureText(t).width);
  const total=widths.reduce((a,b)=>a+b,0)+gap*(glyphs.length-1);c.scale(Math.min(1,max/total),1);
  let cursor=0;glyphs.forEach((glyph,i)=>{c.save();c.translate(cursor+widths[i]/2,noise(i+text.length)*size*.009*rough);c.rotate(noise(i+3)*.018*rough);c.fillStyle=color;c.fillText(glyph,-widths[i]/2,0);c.restore();cursor+=widths[i]+gap;});c.restore();
 }
 icon(slug,x,y,size,angle=0,mode='light',options={}){
  const c=this.ctx;c.save();c.translate(x,y);c.rotate(angle*Math.PI/180);c.scale(size/256,size/256);
  for(const [group,img] of Object.entries(images[slug][mode])){
   if(options.only&&!options.only.includes(group))continue;
   if(options.skip?.includes(group))continue;
   c.save();
   if(options.wheel!==undefined&&['wheel','gondolas','hub'].includes(group)){c.translate(0,-9);c.rotate(options.wheel*Math.PI/180);c.translate(0,9);}
   if(options.charge&&['charge','arcs','palm-charge','eyes','snapped-lines'].includes(group))c.translate(noise(Math.floor(options.charge*12))*2,noise(Math.floor(options.charge*12)+2)*2);
   if(options.fire!==undefined&&['fire','embers'].includes(group))c.translate(0,options.fire);
   c.drawImage(img,-128,-128,256,256);c.restore();
  }c.restore();
 }
 head(x,y,size,{powered=true,hat=true,mode='light',angle=0}={}){
  const c=this.ctx,p=images.parts[mode];c.save();c.translate(x,y);c.rotate(angle*Math.PI/180);c.scale(size/256,size/256);
  c.drawImage(p.face,-128,-128,256,256);c.drawImage(p.collar,-128,-128,256,256);
  if(powered){c.drawImage(p.charge,-128,-128,256,256);this.poly([[-32,-8],[-15,-5],[-18,3],[-33,0]],C.red);this.poly([[16,-3],[31,-8],[30,2],[17,5]],C.red);}
  if(hat)c.drawImage(p.hat,-128,-128,256,256);c.restore();
 }
 puppet(x,y,scale,{time=0,wave=false,walk=false,powered=true,hat=true,mode='light',pylon=false}={}){
  const c=this.ctx,ink=mode==='dark'?C.paper:C.ink;c.save();c.translate(x,y);c.scale(scale,scale);
  const phase=Math.floor(time*12)/12*8,bob=walk?Math.abs(Math.sin(phase))*7:0;c.translate(0,-bob);
  // Segmented arms and legs have independent pivots rather than moving as one icon.
  for(const side of [-1,1]){
   c.save();c.translate(side*62,92);c.rotate(walk?Math.sin(phase+(side<0?Math.PI:0))*.15:side*-.035);
   this.poly([[-40,-10],[41,0],[47,160],[30,285],[-43,285],[-38,151]],ink);
   this.poly([[-45,249],[31,253],[52,299],[130,319],[135,359],[95,380],[-48,372]],ink);
   this.poly([[-28,275],[-10,296],[4,280],[21,306],[0,334],[-8,316]],C.red);c.restore();
  }
  for(const side of [-1,1]){
   c.save();c.translate(side*105,-120);
   const arm=wave&&side===1?-2+Math.sin(time*3)*.04:walk?Math.sin(phase+(side<0?0:Math.PI))*.22:-side*.17;
   c.rotate(arm);this.poly([[-27,-18],[33,-4],[37,152],[-29,161]],ink);c.translate(3,145);
   c.rotate(wave&&side===1?-.8+Math.sin(Math.floor(time*8)/8*4)*.22:side*.1);
   this.poly([[-30,0],[32,-4],[38,155],[-34,163]],ink);
   this.poly([[-34,137],[38,139],[43,195],[26,210],[-29,204]],ink);
   if(wave&&side===1){
    for(let n=0;n<4;n++)this.poly([[-26+n*18,190],[-31+n*18,254+(n%3)*9],[-19+n*18,260+(n%3)*9],[-10+n*18,194]],ink);
    this.poly([[-27,163],[-70,198],[-62,213],[-20,192]],ink);
   }
   c.restore();
  }
  this.poly([[-111,-145],[97,-150],[129,-35],[92,145],[-93,136],[-126,-26]],ink);
  this.poly([[-45,-118],[0,-80],[38,-120],[72,-98],[13,-49],[-8,-51],[-71,-97]],C.red);
  this.poly([[-92,84],[94,82],[96,112],[-94,110]],C.gold);
  this.poly([[-17,79],[20,79],[23,116],[-19,114]],C.red);
  this.head(0,-242,380,{powered,hat,mode});
  if(pylon)this.icon('power-tower',269,-90,570,-28,mode,{charge:time});
  c.restore();
 }
 caption(lines,{color=C.paper,accent=C.red,wideLines=lines,tag=null,size=null,top=null}={}){
  const p=this.portrait,W=this.W,H=this.H;
  const selected=p?lines:wideLines;
  const font=size??(p?112:116),x=p?75:95,y=top??(p?H*.155:H*.30),step=font*1.18;
  const max=p?W-150:W*.48;
  if(tag)this.word(tag,x,p?H*.064:75,p?31:27,color,{max:p?W-150:W*.7,rough:.2});
  selected.forEach((line,i)=>this.word(line,x,y+i*step,font,i===selected.length-1?accent:color,{max,angle:i%2?1.2:-1.2}));
 }
 car(x,y,size,angle=0,color=C.red){
  const c=this.ctx;c.save();c.translate(x,y);c.rotate(angle*Math.PI/180);c.scale(size/200,size/200);
  this.poly([[-100,-12],[-65,-20],[-40,-52],[39,-47],[65,-17],[98,-8],[102,30],[-99,28]],color);
  this.poly([[-38,-42],[-5,-42],[-5,-19],[-55,-18]],C.paper);this.poly([[4,-41],[35,-37],[53,-18],[4,-18]],C.paper);
  this.poly([[-78,18],[-43,19],[-42,44],[-76,44]],C.ink);this.poly([[45,20],[78,20],[76,45],[43,44]],C.ink);c.restore();
 }
 coupon(x,y,size,angle=0){
  const c=this.ctx;c.save();c.translate(x,y);c.rotate(angle*Math.PI/180);c.scale(size/400,size/400);
  this.poly([[-200,-60],[-172,-69],[-162,-49],[-131,-65],[196,-59],[184,-24],[202,2],[182,28],[195,61],[-199,67],[-186,28],[-203,0],[-184,-27]],C.paper);
  for(let n=0;n<5;n++)this.rect(-128,-45+n*21,8,10,C.red);
  this.word('COUPONS',-99,20,48,C.ink,{max:275,rough:.3});c.restore();
 }
 finish(t){const c=this.ctx;c.save();c.translate((Math.floor(t*6)%3-1)*2,(Math.floor(t*6)%2)*2);c.drawImage(this.grain,-2,-2,this.W+4,this.H+4);c.restore();}
}
module.exports={prepare,Art,C,images,createCanvas,clamp};
