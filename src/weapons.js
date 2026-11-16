import * as THREE from 'three';
import { input } from './input.js';
import { player } from './player.js';
import { zombies, hurt } from './zombies.js';
import { obstacles, blast } from './world.js';
import { muzzle, impact, tracer, explosion } from './effects.js';
// Temblor de cámara. Tiny original: disparo .04, explosión .6. Disparo sin temblor por petición del usuario (16 nov); explosión más suave porque la cámara está más cerca.
const SHAKE_SHOT=0,SHAKE_BOOM=.2;
export const wp={mag:30,ammo:30,cd:0,reload:0,grenades:3,shake:0,onShake:null};
const nades=[];
export function initWeapons(scene){for(let i=0;i<4;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.12,8,6),new THREE.MeshStandardMaterial({color:0x445533}));m.visible=false;m.castShadow=true;scene.add(m);nades.push({m,on:false,t:0,x0:0,z0:0,x1:0,z1:0});}}
export function resetWeapons(){Object.assign(wp,{ammo:30,cd:0,reload:0,grenades:3,shake:0});for(const n of nades){n.on=false;n.m.visible=false;}}
function shoot(){
  const sp=(Math.random()-.5)*.06,c=Math.cos(sp),s=Math.sin(sp);
  const dx=player.aimX*c-player.aimZ*s,dz=player.aimX*s+player.aimZ*c;
  const ox=player.x+dx*.5,oz=player.z+dz*.5;let best=28,hz=null,wall=false;
  for(const o of obstacles){if(o.fly||o.key==='sack')continue;const t=rayCircle(ox,oz,dx,dz,o.x,o.z,o.r*.8);if(t!==null&&t<best){best=t;wall=true;}}
  for(const z of zombies){if(!z.alive)continue;const t=rayCircle(ox,oz,dx,dz,z.x,z.z,z.t.r+.12);if(t!==null&&t<best){best=t;hz=z;wall=false;}}
  tracer(ox,oz,ox+dx*best,oz+dz*best);muzzle(ox,.75,oz,dx,dz);
  if(hz){hurt(hz,1,dx,dz);impact(ox+dx*best,.7,oz+dz*best,[.5,.9,.3]);}else if(wall)impact(ox+dx*best,.5,oz+dz*best);
  wp.ammo--;wp.cd=.11;wp.shake=Math.max(wp.shake,SHAKE_SHOT);player.shootT=.1;
}
function rayCircle(ox,oz,dx,dz,cx,cz,r){const fx=cx-ox,fz=cz-oz,t=fx*dx+fz*dz;if(t<0)return null;const px=fx-dx*t,pz=fz-dz*t,d2=px*px+pz*pz;if(d2>r*r)return null;return t-Math.sqrt(r*r-d2);}
export function updateWeapons(dt,active){
  wp.cd-=dt;wp.shake=Math.max(0,wp.shake-dt*1.5);
  if(input.reload){input.reload=false;if(active&&!wp.reload&&wp.ammo<wp.mag)wp.reload=1.5;}
  if(wp.reload>0){wp.reload-=dt;if(wp.reload<=0){wp.ammo=wp.mag;wp.reload=0;}}
  else if(active&&input.fire&&wp.cd<=0){if(wp.ammo>0)shoot();else wp.reload=1.5;}
  if(input.grenade){input.grenade=false;if(active&&wp.grenades>0){const n=nades.find(n=>!n.on);if(n){wp.grenades--;n.on=true;n.t=0;n.x0=player.x;n.z0=player.z;
    const dx=player.ax-player.x,dz=player.az-player.z,l=Math.hypot(dx,dz)||1,d=Math.min(Math.max(l,3),12);n.x1=player.x+dx/l*d;n.z1=player.z+dz/l*d;n.m.visible=true;}}}
  for(const n of nades){if(!n.on)continue;n.t+=dt/.9;const k=Math.min(n.t,1);n.m.position.set(n.x0+(n.x1-n.x0)*k,.6+Math.sin(k*Math.PI)*3,n.z0+(n.z1-n.z0)*k);n.m.rotation.x+=dt*10;
    if(n.t>=1){n.on=false;n.m.visible=false;detonate(n.x1,n.z1);}}
}
function detonate(x,z){
  explosion(x,z);blast(x,z,7,16);wp.shake=SHAKE_BOOM;
  for(const zb of zombies){if(!zb.alive)continue;const dx=zb.x-x,dz=zb.z-z,d=Math.hypot(dx,dz);if(d<6){hurt(zb,Math.ceil(14*(1-d/6)),dx/(d||1)*14,dz/(d||1)*14);}}
  const dp=Math.hypot(player.x-x,player.z-z);if(dp<4)wp.onSelfHit?.(Math.round(30*(1-dp/4)));
}
