import * as THREE from 'three';
export const input={move:new THREE.Vector2(),aim:new THREE.Vector2(),aimActive:false,fire:false,run:false,reload:false,grenade:false,touch:false,mouse:new THREE.Vector2()};
const keys={};
export function initInput(canvas){
  input.touch=matchMedia('(pointer:coarse)').matches||'ontouchstart' in window; document.body.classList.toggle('touch',input.touch);
  addEventListener('keydown',e=>{keys[e.code]=1;if(e.code==='KeyR')input.reload=true;if(e.code==='KeyE')input.grenade=true;});
  addEventListener('keyup',e=>keys[e.code]=0);
  canvas.addEventListener('mousemove',e=>input.mouse.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1));
  canvas.addEventListener('mousedown',e=>{if(e.button===0&&!input.touch)input.fire=true;});
  addEventListener('mouseup',()=>{if(!input.touch)input.fire=false;});
  addEventListener('contextmenu',e=>e.preventDefault());
  stick('sl',(x,y)=>input.move.set(x,y));
  stick('sr',(x,y,on)=>{input.aim.set(x,y);input.aimActive=on&&Math.hypot(x,y)>.25;input.fire=input.aimActive;});
  const tap=(id,fn)=>document.getElementById(id).addEventListener('touchstart',e=>{e.preventDefault();fn();},{passive:false});
  tap('bg',()=>input.grenade=true); tap('br',()=>input.reload=true);
}
export function pollKeys(){
  if(!input.touch)input.move.set((keys.KeyD?1:0)-(keys.KeyA?1:0),(keys.KeyS?1:0)-(keys.KeyW?1:0));
  input.run=!!(keys.ShiftLeft||keys.ShiftRight)||(input.touch&&input.move.length()>.92);
}
function stick(id,cb){
  const el=document.getElementById(id),knob=el.firstElementChild;let tid=null;const R=45;
  const upd=t=>{const r=el.getBoundingClientRect();let x=(t.clientX-r.left-65)/R,y=(t.clientY-r.top-65)/R;const l=Math.hypot(x,y);if(l>1){x/=l;y/=l;}
    knob.style.transform=`translate(${x*R}px,${y*R}px)`;cb(x,y,true);};
  el.addEventListener('touchstart',e=>{e.preventDefault();tid=e.changedTouches[0].identifier;upd(e.changedTouches[0]);},{passive:false});
  el.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches)if(t.identifier===tid)upd(t);},{passive:false});
  const end=e=>{for(const t of e.changedTouches)if(t.identifier===tid){tid=null;knob.style.transform='';cb(0,0,false);}};
  el.addEventListener('touchend',end);el.addEventListener('touchcancel',end);
}
