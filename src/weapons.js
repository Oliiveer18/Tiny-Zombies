import * as THREE from 'three';
import { input } from './input.js';
import { player } from './player.js';
import { zombies, hurt } from './zombies.js';
import { obstacles, blast, hitProp, hooks, OBJ } from './world.js';
import { tickUsar, ordenes, objetivo, sonido } from './usar.js'; import { blood, burn } from './decals.js'; import { muzzle, impact, tracer, explosion } from './effects.js';
// Temblor de cámara. Tiny original: disparo .04, explosión .6. Disparo sin temblor por petición del usuario (16 nov); explosión más suave porque la cámara está más cerca.
const MUZZLE=.55,SHAKE_SHOT=0,SHAKE_BOOM=.2;
export const wp={mag:30,ammo:30,cd:0,reload:0,grenades:3,shake:0,onShake:null};
const nades=[];
export function initWeapons(scene){for(let i=0;i<4;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.12,8,6),new THREE.MeshStandardMaterial({color:0x445533}));m.visible=false;m.castShadow=true;scene.add(m);nades.push({m,on:false,t:0,x0:0,z0:0,x1:0,z1:0});}}
export function resetWeapons(){Object.assign(wp,{ammo:30,cd:0,reload:0,grenades:3,shake:0});for(const n of nades){n.on=false;n.m.visible=false;}}
function shoot(){
  const sp=(Math.random()-.5)*.06*(input.aimHold?.35:1),c=Math.cos(sp),s=Math.sin(sp);
  const dx=player.aimX*c-player.aimZ*s,dz=player.aimX*s+player.aimZ*c;
  const al=Math.hypot(player.aimX,player.aimZ)||1,mx=player.x+player.aimX/al*MUZZLE,mz=player.z+player.aimZ/al*MUZZLE; // punto de salida fijo (luego será el cañón del arma); la dispersión solo gira la dirección
  const ox=player.x,oz=player.z;let best=28,hz=null,wall=false,bo=null;
  const thru=[];for(const o of obstacles){if(o.fly||o.key==='sack')continue;const t=rayCircle(ox,oz,dx,dz,o.x,o.z,o.r*.8);if(t===null)continue;if(OBJ[o.key]&&OBJ[o.key].pasa){thru.push([o,t]);continue;}if(t<best){best=t;wall=true;bo=o;}} // el cartón no frena la bala: la traspasa y se rompe
  for(const z of zombies){if(!z.alive)continue;const t=rayCircle(ox,oz,dx,dz,z.x,z.z,z.t.r+.12);if(t!==null&&t<best){best=t;hz=z;wall=false;bo=null;}}
  tracer(mx,mz,ox+dx*Math.max(best,MUZZLE),oz+dz*Math.max(best,MUZZLE));muzzle(mx,.75,mz,dx,dz);
  if(hz){hurt(hz,1,dx,dz);impact(ox+dx*best,.7,oz+dz*best,[.5,.9,.3]);if(Math.random()<.34)blood(ox+dx*(best+.6),oz+dz*(best+.6),.5);}else if(wall){if(!hitProp(bo,dx,dz,ox+dx*best,oz+dz*best))impact(ox+dx*best,.5,oz+dz*best);}
  const vistas=new Set();for(const [o,t] of thru)if(t<best){if(o.hoja){if(vistas.has(o.hoja))continue;vistas.add(o.hoja);} // la reja son varios círculos: una bala cuenta una sola vez
    hitProp(o,dx,dz,ox+dx*t,oz+dz*t);}
  wp.ammo--;wp.disp=true;sonido(player.x,player.z,30,'j1');wp.cd=.11;wp.shake=Math.max(wp.shake,SHAKE_SHOT);player.shootT=.1;
}
// Entrada → orden → simulación (norma 3): aquí solo se lee la entrada y se crea la orden; la lógica está en usar.js
function usarGlue(dt,active){
  if(active){if(input.use&&objetivo.id)ordenes.push({t:'usar',j:'j1',obj:objetivo.id,verbo:objetivo.verbo});
    const al=Math.hypot(player.aimX,player.aimZ)||1,m=Math.hypot(input.move.x,input.move.y);
    tickUsar(dt,{id:'j1',x:player.x,z:player.z,ax:player.aimX/al,az:player.aimZ/al,mueve:m>.2,mx:input.move.x,mz:input.move.y,dispara:!!wp.disp},{hold:input.useHold});}
  input.use=false;wp.disp=false;}
function rayCircle(ox,oz,dx,dz,cx,cz,r){const fx=cx-ox,fz=cz-oz,t=fx*dx+fz*dz;if(t<0)return null;const px=fx-dx*t,pz=fz-dz*t,d2=px*px+pz*pz;if(d2>r*r)return null;return t-Math.sqrt(r*r-d2);}
export function updateWeapons(dt,active){
  usarGlue(dt,active);wp.cd-=dt;input.weapon=false; // «cambiar arma»: de momento solo hay un arma
  wp.shake=Math.max(0,wp.shake-dt*1.5);
  if(input.reload){input.reload=false;if(active&&!wp.reload&&wp.ammo<wp.mag)wp.reload=1.5;}
  if(wp.reload>0){wp.reload-=dt;if(wp.reload<=0){wp.ammo=wp.mag;wp.reload=0;}}
  else if(active&&input.fire&&wp.cd<=0){if(wp.ammo>0)shoot();else wp.reload=1.5;}
  if(input.grenade){input.grenade=false;if(active&&wp.grenades>0){const n=nades.find(n=>!n.on);if(n){wp.grenades--;n.on=true;n.t=0;n.x0=player.x;n.z0=player.z;
    const dx=player.ax-player.x,dz=player.az-player.z,l=Math.hypot(dx,dz)||1,d=Math.min(Math.max(l,3),12);n.x1=player.x+dx/l*d;n.z1=player.z+dz/l*d;n.m.visible=true;}}}
  for(const n of nades){if(!n.on)continue;n.t+=dt/.9;const k=Math.min(n.t,1);n.m.position.set(n.x0+(n.x1-n.x0)*k,.6+Math.sin(k*Math.PI)*3,n.z0+(n.z1-n.z0)*k);n.m.rotation.x+=dt*10;
    if(n.t>=1){n.on=false;n.m.visible=false;detonate(n.x1,n.z1);}}
}
hooks.boom=(x,z)=>detonate(x,z); // bidón explosivo: misma explosión que la granada
function detonate(x,z){
  sonido(x,z,60,'j1');
  explosion(x,z);burn(x,z,3);blast(x,z,7,16);wp.shake=SHAKE_BOOM;
  for(const zb of zombies){if(!zb.alive)continue;const dx=zb.x-x,dz=zb.z-z,d=Math.hypot(dx,dz);if(d<6){hurt(zb,Math.ceil(14*(1-d/6)),dx/(d||1)*14,dz/(d||1)*14);}}
  const dp=Math.hypot(player.x-x,player.z-z);if(dp<4)wp.onSelfHit?.(Math.round(30*(1-dp/4)));
}
