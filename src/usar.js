// Acción «Usar» (PAQ-02): simulación pura, sin THREE ni DOM (norma 3). La entrada solo crea órdenes {t:'usar', j, obj, verbo};
// aquí se validan y se aplican. El dibujo y la interfaz solo leen `objetivo` y `ruido`.
// Verbos: empujar (toque), abrir (toque), arrastrar (mantener), forzar (mantener 4 s).
import { ruido, sonido, R, configuraRuido } from './ruido.js';
export { ruido, sonido }; // la lista de ruido vive en ruido.js (PAQ-03); se reexporta para quien ya la importaba de aquí
export const ordenes=[];
export const objetivo={id:null,verbo:null,x:0,z:0,r:0,prog:0}; // lo que se resalta en pantalla
const DIST=1.6,COS60=.5,EMPUJE=60,V_ARRASTRE=.8,T_FORZAR=4,V_ABRIR=5,CONTACTO=15,TCONT=15; // TCONT: pasos entre empujones al caminar contra la reja
let C=null;const ses={},cont={};
export function initUsar(c){C=c;configuraRuido({},()=>C.phys.tick());if(typeof window!=='undefined')window.__usar={objetivo,ruido,ordenes,ses}; /* ayuda para pruebas */}
export const tickDe=()=>C?C.phys.tick():0;
const hojaPorId=id=>C.phys.hinges.find(h=>h.id===id);
function busca(id){const p=C.props.find(q=>q.id===id&&!q.dead);if(p&&C.OBJ[p.key]&&C.OBJ[p.key].usar)return {tipo:'prop',p,verbo:C.OBJ[p.key].usar,x:p.x,z:p.z,r:p.r};
  const h=hojaPorId(id);if(h&&!h.roto)return {tipo:'hoja',h,verbo:h.candado?'forzar':'abrir',x:h.px+h.dx*h.largo/2,z:h.pz+h.dz*h.largo/2,r:.45};return null;}
function distA(t,j){if(t.tipo==='hoja'){const n=C.phys.hingeNear(t.h,j.x,j.z);t.x=n.qx;t.z=n.qz;return n.dist;}return Math.max(0,Math.hypot(t.x-j.x,t.z-j.z)-(t.p.body?t.p.body.rad:0));} // a un objeto se le mide la distancia hasta su borde (el contenedor tiene un círculo de choque grande y el jugador no puede acercarse a menos de ~1,6 m de su centro)
function elige(j){let mejor=null,md=1e9;const al=Math.hypot(j.ax,j.az)||1,ax=j.ax/al,az=j.az/al;
  const cand=[];for(const p of C.props)if(!p.dead&&C.OBJ[p.key]&&C.OBJ[p.key].usar)cand.push(p.id);for(const h of C.phys.hinges)if(!h.roto)cand.push(h.id);
  for(const id of cand){const t=busca(id);if(!t)continue;const d=distA(t,j);if(d>DIST)continue;
    const dx=t.x-j.x,dz=t.z-j.z,l=Math.hypot(dx,dz);if(l>1e-6&&(dx*ax+dz*az)/l<COS60)continue;
    if(d<md-1e-6||(Math.abs(d-md)<=1e-6&&mejor&&id<mejor.id)){md=d;mejor={id,...t};}}
  return mejor;}
function aplica(o,j){
  const t=busca(o.obj);if(!t||o.t!=='usar'||t.verbo!==o.verbo)return;if(distA(t,j)>DIST+.05)return;
  const al=Math.hypot(j.ax,j.az)||1,ax=j.ax/al,az=j.az/al;
  if(o.verbo==='empujar'){C.phys.impulse(t.p.body,ax,az,EMPUJE);sonido(t.x,t.z,R.empujar,o.j);}
  else if(o.verbo==='abrir'){for(const h of C.phys.hinges)if(!h.roto&&!h.candado&&h.cand===t.h.cand){h.w=V_ABRIR;}sonido(t.x,t.z,R.abrir,o.j);}
  else if(o.verbo==='arrastrar'||o.verbo==='forzar'){ses[o.j]={obj:o.obj,verbo:o.verbo,t:0,x0:j.x,z0:j.z,tr:0};sonido(t.x,t.z,R[o.verbo],o.j);}
}
// Un paso por cuadro. j: {id,x,z,ax,az,mueve,mx,mz,dispara}; e: {hold}. Devuelve el objetivo para la interfaz.
export function tickUsar(dt,j,e){
  if(!C)return objetivo;
  for(const o of ordenes.splice(0))aplica(o,j);
  const s=ses[j.id];objetivo.prog=0;
  if(s){const t=busca(s.obj);
    if(!e.hold||!t||(s.verbo==='forzar'&&(Math.hypot(j.x-s.x0,j.z-s.z0)>.3||j.dispara))||(s.verbo==='arrastrar'&&distA(t,j)>2))delete ses[j.id]; // soltar, moverse o disparar cancela
    else{s.t+=dt;s.tr+=dt;if(s.tr>=1){s.tr=0;sonido(t.x,t.z,R[s.verbo],j.id);}
      if(s.verbo==='arrastrar'){if(j.mueve){const dx=t.x-j.x,dz=t.z-j.z,l=Math.hypot(dx,dz)||1,b=t.p.body;b.asleep=false;b.still=0;b.vx=dx/l*V_ARRASTRE;b.vz=dz/l*V_ARRASTRE;}}
      else{objetivo.prog=Math.min(1,s.t/T_FORZAR);if(s.t>=T_FORZAR){const cand=C.props.find(q=>q.id===t.h.cand&&!q.dead);delete ses[j.id];if(cand)C.damageProp(cand,cand.vida+1);objetivo.prog=0;}}}}
  const t=ses[j.id]?busca(ses[j.id].obj):elige(j);
  if(t){objetivo.id=t.p?t.p.id:t.h.id;objetivo.verbo=t.verbo;objetivo.x=t.x;objetivo.z=t.z;objetivo.r=(t.r||.45)+.15;}else{objetivo.id=null;objetivo.verbo=null;}
  // caminar contra una reja sin candado la empuja (15 kg·m/s por contacto, como mucho cada TCONT pasos)
  const T=tickDe();if(j.mueve){const l=Math.hypot(j.mx,j.mz)||1;for(const h of C.phys.hinges){if(h.roto||h.candado)continue;const n=C.phys.hingeNear(h,j.x,j.z);
    if(n.dist<.7&&(cont[h.id]===undefined||T-cont[h.id]>=TCONT)){const px=n.qx-j.x,pz=n.qz-j.z,pl=Math.hypot(px,pz)||1;if((j.mx*px+j.mz*pz)/(l*pl)>.3){cont[h.id]=T;C.phys.hingeImpulse(h,j.mx/l*CONTACTO,j.mz/l*CONTACTO,Math.max(n.along,.2));}}}}
  while(ruido.length&&T-ruido[0].tick>120)ruido.shift();
  return objetivo;
}
