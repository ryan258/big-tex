const {createCanvas}=require('./art.cjs');
const TEX_FEET=55,ADULT_FEET=6;
// Puppet hat top and boot sole, before the per-shot puppet scale.
const TEX_UNITS=380-(-242+(26-128)*380/256);
const bodyKinds=new Set(['hook','off-cables','march','hat-card','wheel-chase','pylon-rip','charged','aftermath','corny-dog']);
const metrics={};
function included(slug,part){
 if(slug==='family-on-the-move')return part.startsWith('adult-');
 if(slug==='phone-filmer')return part!=='phone';
 if(slug==='balloon-kid')return !['balloon','string'].includes(part);
 if(slug==='stroller-parent')return !['stroller-frame','canopy','blanket','wheel-rear','wheel-front'].includes(part);
 if(slug==='coupon-collector')return part!=='tickets';
 if(slug==='runner')return part!=='flying-cap';
 return true;
}
function prepare(characters){
 const canvas=createCanvas(256,256),ctx=canvas.getContext('2d');
 for(const [slug,actor] of Object.entries(characters)){
  ctx.clearRect(0,0,256,256);
  for(const part of actor.parts)if(included(slug,part.name))ctx.drawImage(actor.images.light[part.name],0,0,256,256);
  const pixels=ctx.getImageData(0,0,256,256).data;let top=256,bottom=-1;
  for(let y=0;y<256;y++)for(let x=0;x<256;x++)if(pixels[(y*256+x)*4+3]>128){top=Math.min(top,y);bottom=Math.max(bottom,y);}
  if(bottom<top)throw Error('Missing body bounds: '+slug);
  metrics[slug]={body_span_units:bottom-top+1,reference_height_feet:slug==='balloon-kid'?4:slug==='rolling-out'?4.5:ADULT_FEET};
 }
}
function heroScale(kind,portrait,u=0){
 if(kind==='march')return (portrait?1.12:1.05)+u*.035;
 if(kind==='wheel-chase')return portrait?.86:.78;
 if(kind==='pylon-rip')return portrait?1.03:1.02;
 if(kind==='charged')return portrait?1.15:1.08;
 if(kind==='aftermath')return portrait?1.12:1.03;
 if(kind==='corny-dog')return portrait?.72:.67;
 return portrait?1.08:.97;
}
function calibrate(slug,preferred,kind,portrait,u=0){
 if(!bodyKinds.has(kind))return preferred;
 const metric=metrics[slug];if(!metric)throw Error('Scale calibration not prepared: '+slug);
 const height=TEX_UNITS*heroScale(kind,portrait,u)*metric.reference_height_feet/TEX_FEET;
 return height*256/metric.body_span_units;
}
function manifest(){return {reference:'https://bigtex.com/about-us/big-tex/',big_tex_height_feet:TEX_FEET,standing_adult_height_feet:ADULT_FEET,
 standing_adults_per_big_tex:TEX_FEET/ADULT_FEET,puppet_hat_to_sole_units:TEX_UNITS,full_body_kinds:[...bodyKinds],characters:metrics,
 method:'Match visible body span to the per-shot puppet height. Exclude raised phones, balloons, flying hats, and stroller props from person height. Travel scales with character size. Close reactions without a full-body Tex remain larger.'};}
module.exports={prepare,calibrate,heroScale,manifest};
