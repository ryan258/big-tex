const fs=require('node:fs'),path=require('node:path');
let library;try{library=require('@napi-rs/canvas');}catch{library=require(path.join(process.env.BIG_TEX_NODE_MODULES||'/Users/ryanjohnson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules','@napi-rs/canvas'));}
const {loadImage}=library;
const scale=require('../../bystander-scale.cjs');
const assets=path.resolve(__dirname,'../../../../assets/bystanders/classic');
const manifest=JSON.parse(fs.readFileSync(path.join(assets,'animation-parts.json')));
const characters={};
async function prepare(){
 for(const actor of manifest.characters){
  const source=fs.readFileSync(path.join(assets,actor.file),'utf8');
  const slug=path.basename(actor.file,'.svg');const groups=[...source.matchAll(/<g id="[^"]+" data-part="([^"]+)" data-pivot="[^"]+">[\s\S]*?<\/g>/g)];
  characters[slug]={parts:actor.parts,images:{light:{},dark:{}}};
  for(const group of groups)for(const mode of ['light','dark']){
   const markup=(mode==='dark'?group[0].replaceAll('#191815','#F3E6CC'):group[0]).replace(/\sid="[^"]*"/g,'');
   const outline=mode==='dark'?'#191815':'#F3E6CC';
   const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="768" height="768"><g stroke="${outline}" stroke-width="1.25" stroke-linejoin="miter">${markup}</g>${markup}</svg>`;
   characters[slug].images[mode][group[1]]=await loadImage(Buffer.from(svg));
  }
  if(groups.length!==actor.parts.length)throw Error('Incomplete cast layers: '+slug);
 }
 scale.prepare(characters);
}
const radians=d=>d*Math.PI/180;
function transform(ctx,pivot,state={}){
 ctx.translate(state.x??0,state.y??0);
 if(state.angle){ctx.translate(...pivot);ctx.rotate(radians(state.angle));ctx.translate(-pivot[0],-pivot[1]);}
}
function draw(ctx,slug,x,baseline,size,{time=0,age=0,reaction=0,behavior='watch',mode='light',mirror=false,distance}={}){
 const actor=characters[slug];if(!actor)throw Error('Unknown bystander: '+slug);
 const q=Math.floor((time+1e-7)*12)/12;
 const phase=q/.76*Math.PI*2;
 const gait=Math.sin(phase),running=behavior==='run',rolling=behavior==='roll';
 const motion={},parents={};
 const set=(name,angle=0,x=0,y=0)=>{motion[name]={angle,x,y};};
 const attach=(names,chain)=>names.forEach(name=>{parents[name]=chain;});
 const virtual={};
 const wheelAngle=(radius,fallback)=>distance===undefined?age*fallback:distance/(size/256*radius)*180/Math.PI;
 let lean=0,jump=0;
 if(behavior==='flinch'){lean=-reaction*7;jump=-reaction*4;}
 if(running){lean=-4-reaction*3;jump=-Math.abs(gait)*2.5;}
 switch(slug){
  case 'snack-protector':
   attach(['head','arm-left','arm-right','corny-dog','hands'],['torso']);
   set('torso',-reaction*5);set('head',-reaction*12);
   set('arm-left',reaction*4);set('arm-right',-reaction*4);
   set('corny-dog',-reaction*4,0,reaction*3);set('hands',0,0,reaction*3);
   break;
  case 'phone-filmer':
   attach(['head','arm-far','arm-raised'],['torso']);attach(['phone','hand'],['torso','arm-raised']);
   set('head',-reaction*10);set('arm-raised',-reaction*16+Math.sin(q*3)*1.4);set('arm-far',reaction*9);
   set('torso',-reaction*3);break;
  case 'balloon-kid':
   attach(['head','arm-left','arm-right'],['torso']);attach(['cap'],['torso','head']);
   virtual['balloon-sway']={pivot:[154,143]};set('balloon-sway',Math.sin(q*2.5)*5+reaction*11);
   attach(['balloon','string'],['torso','arm-right','balloon-sway']);
   set('head',-reaction*12);set('arm-right',-reaction*7);set('arm-left',reaction*12);
   if(running){set('leg-left',gait*11);set('leg-right',-gait*11);}
   break;
  case 'stroller-parent':
   attach(['head','arm-back'],['torso']);
   set('head',-reaction*9);set('arm-back',gait*9);set('leg-left',gait*10);set('leg-right',-gait*10);
   set('wheel-rear',wheelAngle(14,340));set('wheel-front',wheelAngle(12,440));lean=0;jump=0;break;
  case 'family-on-the-move':
   virtual.upper={pivot:[131,150]};set('upper',running?-3:0);
   attach(['adult-torso','adult-head','adult-arm-back','child-torso','child-head','child-arm-free','joined-hands'],['upper']);
   set('adult-head',-reaction*8);set('child-head',-reaction*12);set('adult-arm-back',gait*10);
   set('child-arm-free',-gait*11-reaction*7);
   for(const [name,sign] of [['adult-leg-left',1],['adult-leg-right',-1],['child-leg-left',-1],['child-leg-right',1]])set(name,gait*sign*(running?13:5));
   break;
  case 'corny-dog-vendor':
   attach(['head','apron','arm-serve','arm-right'],['torso']);attach(['paper-hat'],['torso','head']);attach(['corny-dog'],['torso','arm-serve']);
   set('head',-reaction*10);set('arm-serve',-reaction*15);set('arm-right',reaction*8);
   if(rolling){set('wheel-left',wheelAngle(12,240));set('wheel-right',wheelAngle(12,240));}break;
  case 'coupon-collector':
   attach(['head','arm-left','arm-right'],['torso']);attach(['tickets','hand'],['torso','arm-right']);
   set('head',reaction*10);set('arm-right',reaction*23+(behavior==='hide-tickets'?12:0));
   set('torso',-reaction*3);set('arm-left',reaction*3);break;
  case 'unbothered-local':
   attach(['hair','glasses-bridge'],['head']);
   set('head',-3-reaction*3);lean=0;jump=0;break;
  case 'lost-tourist':
   attach(['hat'],['head']);set('head',-reaction*15+Math.sin(q*2)*3);
   set('map',Math.sin(q*4)*1.8+reaction*5);set('arm-left',reaction*2);set('arm-right',reaction*2);
   if(running){set('leg-left',gait*9);set('leg-right',-gait*9);}break;
  case 'runner':
   attach(['head','arm-back','arm-front'],['torso']);
   set('leg-back',gait*18);set('leg-front',-gait*18);set('arm-back',-gait*12);set('arm-front',gait*14);
   set('head',-reaction*11);set('flying-cap',age*40,-age*9,Math.sin(age*4)*4);break;
  case 'rolling-out':
   attach(['head','arm-push'],['torso']);attach(['cap'],['torso','head']);attach(['hand'],['torso','arm-push']);
   set('head',-reaction*9);set('arm-push',gait*9);set('wheel-rear',wheelAngle(48,260));set('caster',wheelAngle(13,580));lean=0;jump=0;break;
  case 'i30-driver':
   attach(['driver-head','raised-arm'],['driver-torso']);attach(['raised-hand'],['driver-torso','raised-arm']);
   set('driver-head',-reaction*11);set('raised-arm',reaction*18);set('wheel-left',reaction*5);set('wheel-right',reaction*5);
   lean=-reaction*2;jump=-reaction*4;break;
 }
 ctx.save();ctx.translate(x,baseline+jump*size/256);ctx.scale((mirror?-1:1)*size/256,size/256);
 ctx.translate(-128,-236);transform(ctx,[128,220],{angle:lean});
 const definitions=new Map(actor.parts.map(p=>[p.name,p]));
 for(const part of actor.parts){
  ctx.save();
  for(const parent of parents[part.name]??[]){
   const definition=definitions.get(parent)??virtual[parent];if(!definition)throw Error('Missing parent '+parent);
   transform(ctx,definition.pivot,motion[parent]);
  }
  transform(ctx,part.pivot,motion[part.name]);ctx.drawImage(actor.images[mode][part.name],0,0,256,256);ctx.restore();
 }
 ctx.restore();
}
module.exports={prepare,draw,characters};
