import * as THREE from 'three';
import { instance, play } from './assets.js';
import { input } from './input.js';
import { obstacles, FIELD } from './world.js';
import { wp } from './weapons.js';
// Velocidades (unidades/s). Tiny original: 4.2 / 7 con cámara a 16.4; con la cámara a 10.1 se ajustan para que la velocidad en pantalla sea parecida.
export const MOVE={walk:2.6,run:4.3,mult:1,acc:9,dec:14,dead:.12};
const vel=new THREE.Vector2();
export const player={id:'j1',x:0,z:0,hp:100,stam:100,exhausted:false,aimX:0,aimZ:-1,ax:0,az:-6,inst:null,t:0,hurt:0,shootT:0,moving:false};
const ray=new THREE.Raycaster(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),0),hit=new THREE.Vector3();
export function initPlayer(scene){player.inst=instance('player');scene.add(player.inst.root);
  const ring=new THREE.Mesh(new THREE.RingGeometry(.22,.3,20),new THREE.MeshBasicMaterial({color:0xff5a3a,transparent:true,opacity:.8,depthTest:false}));
  ring.rotation.x=-Math.PI/2;ring.renderOrder=9;scene.add(ring);player.reticle=ring;}
export function resetPlayer(){Object.assign(player,{x:0,z:0,hp:100,stam:100,exhausted:false,hurt:0});vel.set(0,0);}
export function updatePlayer(dt,cam){
  const m=input.move.clone();if(m.length()>1)m.normalize();
  const ml=m.length(); if(ml<MOVE.dead)m.set(0,0); else m.multiplyScalar((ml-MOVE.dead)/(1-MOVE.dead)/ml); // zona muerta: sin salto brusco
  player.exhausted=player.exhausted?player.stam<20:player.stam<=0;
  const run=input.run&&!player.exhausted&&m.length()>.1;
  player.stam=THREE.MathUtils.clamp(player.stam+(run?-28:16)*dt,0,100);
  const sp=(run?MOVE.run:MOVE.walk)*MOVE.mult*(input.fire?.8:1);
  // aceleración y frenada suaves
  const tx=m.x*sp,tz=m.y*sp,k=Math.min(1,dt*(m.length()>0?MOVE.acc:MOVE.dec));
  vel.x+=(tx-vel.x)*k;vel.y+=(tz-vel.y)*k;
  const speed=vel.length(); player.moving=speed>.15||m.length()>.1;
  player.x+=vel.x*dt;player.z+=vel.y*dt;
  for(const o of obstacles){if(o.fly)continue;const dx=player.x-o.x,dz=player.z-o.z,d=Math.hypot(dx,dz),min=o.r+.25;if(d<min&&d>1e-4){player.x=o.x+dx/d*min;player.z=o.z+dz/d*min;}}
  const L=FIELD-2;player.x=THREE.MathUtils.clamp(player.x,-L,L);player.z=THREE.MathUtils.clamp(player.z,-L,L);
  // apuntado
  if(input.touch){ if(input.aimActive){const l=Math.hypot(input.aim.x,input.aim.y);player.aimX=input.aim.x/l;player.aimZ=input.aim.y/l;}
    else if(m.length()>.1){player.aimX=m.x/m.length();player.aimZ=m.y/m.length();}
    player.ax=player.x+player.aimX*8;player.az=player.z+player.aimZ*8;
  } else { ray.setFromCamera(input.mouse,cam); if(ray.ray.intersectPlane(plane,hit)){player.ax=hit.x;player.az=hit.z;}
    const dx=player.ax-player.x,dz=player.az-player.z,l=Math.hypot(dx,dz)||1;player.aimX=dx/l;player.aimZ=dz/l; }
  const r=player.inst.root;r.position.set(player.x,0,player.z);r.rotation.y=Math.atan2(player.aimX,player.aimZ);
  player.reticle.position.set(player.ax,.05,player.az);
  // animación: clips si existen, si no código
  player.t+=dt*(run?14:9);player.shootT=Math.max(0,player.shootT-dt);player.hurt=Math.max(0,player.hurt-dt);
  if(player.inst.mixer){
    const a=player.inst.actions; let clip='idle';
    if(wp.reload>0&&a.reload)clip='reload'; else if(input.fire&&a.shoot)clip='shoot';
    else if(speed>.15)clip=(speed>3.2&&a.run)||!a.walk?'run':'walk';
    play(player.inst,clip);
    const act=a[clip]; if(act)act.timeScale=clip==='run'?THREE.MathUtils.clamp(speed/2.6,.6,2):clip==='walk'?THREE.MathUtils.clamp(speed/1.1,.5,2.2):1;
    player.inst.mixer.update(dt);}
  else{player.inst.body.position.y=player.moving?Math.abs(Math.sin(player.t))*.07:0;player.inst.body.rotation.x=player.moving?.12:0;player.inst.body.rotation.z=Math.sin(player.t)*(player.moving?.08:0);}
}
