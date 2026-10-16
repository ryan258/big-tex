const {C,clamp}=require('./art.cjs');
const plan=require('./timeline.json');
// Canvas angles increase clockwise. Match travel to the SVG wheel's 96-unit radius.
const rollingAngle=(distance,size)=>distance/(size*96/256)*180/Math.PI;
function hitAt(t){let l=0,r=plan.hits.length;while(l<r){const m=(l+r)>>1;if(plan.hits[m].time<=t+1/48)l=m+1;else r=m;}return plan.hits[l-1];}
function shotAt(t){let i=0;while(i+1<plan.shots.length&&t>=plan.shots[i+1].start-1e-7)i++;return {shot:plan.shots[i],index:i};}
function render(a,t,override=null){
 const {shot,index}=override??shotAt(t),age=t-shot.start,u=clamp(age/shot.duration),q=Math.floor(t*12)/12;
 const {W,H,portrait:p,ctx:c}=a;
 const hit=hitAt(t),elapsed=hit?t-hit.time:100;
 const pulse=override?.pulse??(elapsed<.2?Math.exp(-Math.max(0,elapsed)*22)*Math.min(1,hit.strength/1.4):0);
 const dark=['eyes','guard-card','helicopter','hat-hit','charger-card','pylon-rip','charged','city','skull','main-title','aftermath','coupons','end-title'].includes(shot.kind);
 const red=['strike','traffic-punch','wheel-roll','wheel-chase'].includes(shot.kind);
 const bg=dark?C.ink:red?C.red:['stomp','hand'].includes(shot.kind)?C.gold:C.paper;
 c.setTransform(1,0,0,1,0,0);c.fillStyle=bg;c.fillRect(0,0,W,H);
 const stage={x:p?W*.5:W*.73,y:p?H*.64:H*.55,size:p?W*1.26:H*1.15};
 const actor={x:p?W*.5:W*.73,y:p?H*.63:H*.53,scale:p?1.08:.97};
 const cap=(lines,options={})=>a.caption(lines,{color:dark||red?C.paper:C.ink,accent:red?C.ink:C.red,...options});
 const floor=()=>a.poly([[0,H*.91],[W,H*.88],[W,H],[0,H]],dark?C.red:C.ink);
 const road=()=>{
  a.poly([[0,H*.75],[W,H*.70],[W,H],[0,H]],C.ink);
  for(let n=0;n<9;n++)a.rect(n*W/8-u*100,H*.86,W/17,10,C.gold,-2);
 };
 const traffic=(chaos=false)=>{
  road();const y=p?H*.79:H*.8;
  for(let n=0;n<7;n++){
   const x=(n+.4)*W/6;
   a.car(x+(chaos?Math.sin(q*5+n)*pulse*35:0),y+(n%2?85:0)-(chaos&&n>3?u*180:0),p?235:290,chaos&&n>3?(n-3)*-u*40:0,n%2?C.red:C.gold);
  }
 };
 c.save();
 if(pulse>.45&&!['hook','traffic-punch','main-title','end-title','coupons','corny-dog'].includes(shot.kind))c.translate((index%2?1:-1)*pulse*7,pulse*4);
 switch(shot.kind){
  case 'hook':
   floor();a.puppet(actor.x,actor.y,actor.scale,{time:q,wave:true,powered:false});
   cap(['HE WAS ONLY','SUPPOSED','TO WAVE.'],{tag:'FAIR PARK / DALLAS',size:p?110:119});
   break;
  case 'strike':
   a.rect(-100,H*.20,W+300,H*.12,C.ink,-12);a.rect(-100,H*.74,W+300,H*.09,C.ink,8);
   a.icon('lightning',W*.5,H*.48,p?H*1.18:H*1.30,-8,'red');
   break;
  case 'eyes':
   a.head(W*.5,p?H*.43:H*.39,p?W*1.67:H*1.55,{powered:true,angle:-3});
   a.rect(-100,H*.87,W+250,24,C.red,-4);
   break;
  case 'off-cables':
   floor();a.puppet(actor.x,actor.y,actor.scale,{time:q,walk:true});
   cap(["HE'S OFF",'THE CABLES.'],{size:p?112:121});
   for(let n=0;n<4;n++)a.poly([[actor.x-210+n*140,H*.94],[actor.x-180+n*140,H*.89],[actor.x-160+n*140,H*.96]],C.red);
   break;
  case 'stomp':
   floor();a.icon('cowboy-boot',p?W*.5:W*.62,p?H*.56:H*.43,p?W*1.65:H*1.34,-9);
   for(let n=0;n<8;n++)a.poly([[n*W/7,H*.92],[n*W/7+70,H*.88],[n*W/7+40,H*.97],[n*W/7+100,H]],C.red);
   break;
  case 'march':
   a.icon('dallas-skyline',p?W*.38:W*.24,H*.80,p?W*.9:H*.8,0,'light',{fire:Math.sin(q*8)*2});floor();
   a.puppet(p?W*.55:W*.65,actor.y,(p?1.12:1.05)+u*.035,{time:q,walk:true});
   break;
  case 'guard-card':
   cap(['THEY SENT','THE GUARD.']);
   a.icon('tank',stage.x,stage.y,stage.size,-2,'dark');
   break;
  case 'tank':
   road();a.icon('tank',W*(.38+u*.25),p?H*.57:H*.50,p?W*1.5:H*1.4,-2);
   break;
  case 'helicopter':
   for(let n=0;n<3;n++)a.rect(-100,H*(.15+n*.3),W+200,25,C.red,n%2?-8:7);
   a.icon('helicopter',W*(.65-u*.25),H*.53,p?W*1.50:H*1.4,-8,'dark');
   break;
  case 'hat-card':
   floor();a.puppet(actor.x,actor.y,actor.scale,{time:q,hat:false});
   a.icon('cowboy-hat',p?W*.73:W*.85,p?H*.43:H*.20,p?440:490,-20-u*25);
   cap(['HE SENT','HIS HAT.']);
   break;
  case 'hat-hit': {
   const falling=Math.max(0,u-.42);
   a.icon('helicopter',W*.59,H*.48+falling*H*.75,p?W*1.15:H*1.08,-5+falling*330,'dark');
   for(let n=0;n<3;n++){c.globalAlpha=.10+n*.07;a.icon('cowboy-hat',W*(-.25+u*1.8)-n*W*.075,H*.46,p?W*.8:H*.75,u*580, 'dark');}c.globalAlpha=1;
   a.icon('cowboy-hat',W*(-.25+u*1.8),H*.46,p?W*.8:H*.75,u*580,'dark');
   if(u>.45)for(let n=0;n<6;n++)a.rect(W*.57+(n-3)*u*90,H*.46+(n%3-1)*u*150,35,13,n%2?C.red:C.gold,n*31);
   break;
  }
  case 'traffic-card':
   cap(['TRAFFIC','ON I-30:'],{size:p?122:139});traffic();
   a.poly([[stage.x-120,H*.52],[stage.x+95,H*.50],[stage.x+110,H*.61],[stage.x,H*.66],[stage.x-125,H*.61]],C.red);
   a.word('I-30',stage.x-83,H*.60,72,C.paper,{max:170});
   break;
  case 'traffic-jam':
   traffic(true);a.icon('cowboy-boot',W*.67,H*(.18+u*.25),p?W*1.7:H*1.35,-8);
   break;
  case 'traffic-punch':
   cap(['SOMEHOW,','WORSE.'],{size:p?137:153});traffic(true);
   break;
  case 'wheel-card':
   cap(['HE TOOK','THE WHEEL.']);
   a.icon('ferris-wheel',stage.x,stage.y,stage.size,0,'light',{wheel:q*35});
   break;
  case 'wheel-rip':
   a.icon('ferris-wheel',W*.50,H*.58,p?W*1.43:H*1.12,0,'light',{only:['supports']});
   a.icon('ferris-wheel',W*(.50+u*.14),H*(.58-u*.20),p?W*1.43:H*1.12,-u*80,'light',{only:['wheel','gondolas','hub']});
   break;
  case 'wheel-roll': {
   const size=p?W*1.5:H*1.2;
   road();a.icon('ferris-wheel',W*(-.10+u*1.2),p?H*.57:H*.55,size,0,'red',{only:['wheel','gondolas','hub'],wheel:rollingAngle(u*W*1.2,size)});
   break;
  }
  case 'wheel-chase': {
   const size=p?W*1.15:H*1.0;
   a.icon('dallas-skyline',W*.68,H*.80,p?W:H*.9,0,'red');
   a.puppet(p?W*.24:W*.24,p?H*.62:H*.55,p?.86:.78,{time:q,walk:true});
   a.icon('ferris-wheel',W*(.5+u*.45),H*.61,size,0,'red',{only:['wheel','gondolas','hub'],wheel:rollingAngle(u*W*.45,size)});
   break;
  }
  case 'charger-card':
   cap(['HE FOUND','A CHARGER.']);
   a.icon('power-tower',stage.x,stage.y,stage.size,-12,'dark',{charge:q});
   break;
  case 'pylon-rip':
   a.puppet(p?W*.37:W*.43,p?H*.62:H*.55,p?1.03:1.02,{time:q,walk:true,mode:'dark',pylon:true});
   for(let n=0;n<4;n++)a.poly([[0,H*(.1+n*.24)],[W,H*(.17+n*.19)],[W,H*(.18+n*.19)],[0,H*(.12+n*.24)]],n%2?C.red:C.gold);
   break;
  case 'hand':
   a.icon('electric-hand',W*.5,H*.52,p?W*1.6:H*1.4,-10+Math.floor(q*4)%2*2,'light',{charge:q});
   break;
  case 'charged':
   a.puppet(W*.48,p?H*.62:H*.55,p?1.15:1.08,{time:q,mode:'dark',pylon:true});
   for(let n=0;n<3;n++){
    const y=H*(.1+n*.32)+pulse*22;
    a.poly([[W*.07,y],[W*.42,y+65],[W*.36,y+89],[W*.9,y+145],[W*.46,y+56],[W*.49,y+31]],n%2?C.red:C.gold);
   }break;
  case 'city':
   a.icon('dallas-skyline',W*.5,H*.62,p?W*1.65:H*1.75,0,'dark',{fire:Math.floor(q*6)%2*3});
   break;
  case 'skull':
   a.icon('steel-skull',W*.5,H*.5,p?W*1.55:H*1.40,-7,'dark',{charge:q});
   break;
  case 'tex-card':
   a.head(p?W*.5:W*.73,p?H*.57:H*.45,p?W*1.45:H*1.1,{powered:true});
   cap(['HOOOOWDY,','FOLKS.'],{size:p?120:131,tag:'FAIR PARK / AFTER DARK'});
   break;
  case 'main-title':
  case 'end-title': {
   a.rect(0,0,p?35:53,H,C.red);
   a.poly([[W*.08,H*.10],[W*.94,H*.08],[W*.94,H*.095],[W*.08,H*.116]],C.red);
   const x=p?75:115,y=p?H*.38:H*.39;
   a.word('BIG TEX:',x,y,p?195:220,C.paper,{max:W-x-(p?75:180),angle:-1.5});
   a.word('REWIRED',x,p?y+245:y+325,p?220:310,C.paper,{max:W-x-(p?75:120),angle:1});
   a.icon('lightning',p?W*.77:W*.88,p?H*.21:H*.22,p?460:470,-10,'light');
   a.poly([[x,p?H*.62:H*.78],[W*.94,p?H*.61:H*.76],[W*.94,p?H*.622:H*.777],[x,p?H*.633:H*.798]],C.red);
   if(shot.kind==='end-title'){
    if(p){a.word('KEEP YOUR',x,H*.73,70,C.red,{max:W-150});a.word('CORNY DOG CLOSE.',x,H*.78,66,C.paper,{max:W-150});}
    else a.word('KEEP YOUR CORNY DOG CLOSE.',x,H*.91,53,C.red,{max:W-230});
   }
   break;
  }
  case 'aftermath':
   a.puppet(W*.5,p?H*.62:H*.54,p?1.12:1.03,{time:q,wave:true,mode:'dark'});
   a.poly([[0,H*.7],[W*.24,H*.58],[W*.16,H],[0,H]],C.red);
   break;
  case 'coupons':
   a.head(p?stage.x:W*.80,p?H*.62:H*.48,p?W*1.15:H*1.12,{powered:true,mode:'dark'});
   cap(['GOT ANY','COUPONS?'],{size:p?135:146});
   a.coupon(p?W*.55:W*.79,H*.85,p?600:620,-7+u*6);
   break;
  case 'corny-dog':
   a.puppet(p?W*.75:W*.83,p?H*.64:H*.59,p?.72:.67,{time:q,wave:true});
   a.icon('corny-dog',p?W*.48:W*.67,p?H*.63:H*.55,p?W*1.12:H*1.07,-9+u*5);
   cap(['FOR ONE','CORNY DOG.'],{size:p?121:126});
   break;
 }
 c.restore();a.finish(t);
 return {shot,index};
}
module.exports={render,plan,shotAt,rollingAngle};
