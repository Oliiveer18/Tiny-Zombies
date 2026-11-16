import * as THREE from 'three';
export const input={move:new THREE.Vector2(),aim:new THREE.Vector2(),aimActive:false,fire:false,run:false,runHold:false,reload:false,grenade:false,touch:false,mouse:new THREE.Vector2()};
const keys={};
export function initInput(canvas){
  input.touch=matchMedia('(pointer:coarse)').matches||'ontouchstart' in window; document.body.classList.toggle('touch',input.touch);
  addEventListener('keydown',e=>{keys[e.code]=1;if(e.code==='KeyR')input.reload=true;if(e.code==='KeyE')input.grenade=true;});
  addEventListener('keyup',e=>keys[e.code]=0);
  canvas.addEventListener('mousemove',e=>input.mouse.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1));
  canvas.addEventListener('mousedown',e=>{if(e.button===0&&!input.touch)input.fire=true;});
  addEventListener('mouseup',()=>{if(!input.touch)input.fire=false;});
  addEventListener('contextmenu',e=>e.preventDefault());
  if(input.touch){
    // Joysticks flotantes: aparecen donde pones el pulgar (mitad izquierda = mover, derecha = apuntar/disparar)
    // Correr = toque rápido y, enseguida, otro toque que se mantiene (como «clic y mantener»); al soltar vuelves a andar
    let lastTap=0;
    floatStick('sl',(x,y)=>x<innerWidth*.5&&y>innerHeight*.18,(x,y)=>input.move.set(x,y),
      ()=>{input.runHold=performance.now()-lastTap<350;document.getElementById('sl').style.borderColor=input.runHold?'#f93':'';},
      (dur,moved)=>{input.runHold=false;document.getElementById('sl').style.borderColor='';if(dur<220&&moved<14)lastTap=performance.now();});
    floatStick('sr',(x,y)=>x>=innerWidth*.5&&y>innerHeight*.18,(x,y,on)=>{input.aim.set(x,y);input.aimActive=on&&Math.hypot(x,y)>.25;input.fire=input.aimActive;});
    // Sin zoom, sin menú de mantener pulsado, sin gestos del navegador
    for(const ev of ['gesturestart','gesturechange','gestureend','dblclick'])document.addEventListener(ev,e=>e.preventDefault());
  }
  const tap=(id,fn)=>document.getElementById(id).addEventListener('touchstart',e=>{e.preventDefault();fn();},{passive:false});
  tap('bg',()=>input.grenade=true); tap('br',()=>input.reload=true);

}
export function pollKeys(){
  if(!input.touch)input.move.set((keys.KeyD?1:0)-(keys.KeyA?1:0),(keys.KeyS?1:0)-(keys.KeyW?1:0));
  input.run=!!(keys.ShiftLeft||keys.ShiftRight)||(input.touch&&input.runHold);
}
function floatStick(id,inZone,cb,onStart,onEnd){
  const el=document.getElementById(id),knob=el.firstElementChild;let tid=null,ox=0,oy=0,t0=0,sx=0,sy=0,mv=0;const R=60,K=45,H=65;
  const place=()=>{el.style.left=(ox-H)+'px';el.style.top=(oy-H)+'px';el.style.right='auto';el.style.bottom='auto';};
  const upd=t=>{mv=Math.max(mv,Math.hypot(t.clientX-sx,t.clientY-sy));let dx=t.clientX-ox,dy=t.clientY-oy;const d=Math.hypot(dx,dy);
    if(d>R){const k=(d-R)/d;ox+=dx*k;oy+=dy*k;place();dx=t.clientX-ox;dy=t.clientY-oy;} // si el dedo se aleja, el centro lo sigue: nunca «se sale»
    knob.style.transform=`translate(${dx*K/R}px,${dy*K/R}px)`;cb(dx/R,dy/R,true);};
  document.addEventListener('touchstart',e=>{if(tid!==null)return;if(e.target.closest&&e.target.closest('.btn'))return;
    for(const t of e.changedTouches){if(!inZone(t.clientX,t.clientY))continue;tid=t.identifier;ox=t.clientX;oy=t.clientY;sx=ox;sy=oy;mv=0;t0=performance.now();place();el.style.opacity='1';onStart&&onStart();upd(t);e.preventDefault();break;}},{passive:false});
  document.addEventListener('touchmove',e=>{for(const t of e.changedTouches)if(t.identifier===tid){e.preventDefault();upd(t);}},{passive:false});
  const end=e=>{for(const t of e.changedTouches)if(t.identifier===tid){tid=null;onEnd&&onEnd(performance.now()-t0,mv);knob.style.transform='';el.style.left=el.style.top=el.style.right=el.style.bottom='';el.style.opacity='';cb(0,0,false);}};
  document.addEventListener('touchend',end);document.addEventListener('touchcancel',end);
}
