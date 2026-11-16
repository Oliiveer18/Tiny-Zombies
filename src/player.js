import * as THREE from 'three';
import { instance, play } from './assets.js';
import { input } from './input.js';
import { obstacles, FIELD } from './world.js';
import { wp } from './weapons.js';
// Velocidades (unidades/s). Tiny original: 4.2 / 7 con cámara a 16.4; con la cámara a 10.1 se ajustan para que la velocidad en pantalla sea parecida.
export const MOVE={walk:1.4,run:1.4,aim:.4,crouch:.5,runAt:.85,mult:1,acc:9,dec:14,dead:.12,curve:1.5,
  // Velocidad (unidades del juego/s) que recorre cada animación al paso 1: medida en el GLB (andar 1,10 · correr ~3,4 · disparar 1,40 por 0,53 de escala).
  clipWalk:.58,clipRun:1.8,clipShoot:.74,blendA:.7,blendB:1.2,step:1};
const vel=new THREE.Vector2();
export const player={id:'j1',x:0,z:0,hp:100,stam:100,exhausted:false,aimX:0,aimZ:-1,ax:0,az:-6,inst:null,t:0,hurt:0,shootT:0,moving:false};
const ray=new THREE.Raycaster(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),0),hit=new THREE.Vector3();
export function initPlayer(scene){player.inst=instance('player');scene.add(player.inst.root);
  const ring=new THREE.Mesh(new THREE.RingGeometry(.22,.3,20),new THREE.MeshBasicMaterial({color:0xff5a3a,transparent:true,opacity:.8,depthTest:false}));
  ring.rotation.x=-Math.PI/2;ring.renderOrder=9;scene.add(ring);player.reticle=ring;}
export function resetPlayer(){Object.assign(player,{x:0,z:0,hp:100,stam:100,exhausted:false,hurt:0});vel.set(0,0);player.crouch=false;input.crouch=false;if(player.inst){player.inst.blendReady=false;player.inst.dead=false;}}
export function updatePlayer(dt,cam){
  const m=input.move.clone();if(m.length()>1)m.normalize();
  const ml=m.length(); if(ml<MOVE.dead)m.set(0,0); else m.multiplyScalar((ml-MOVE.dead)/(1-MOVE.dead)/ml); // zona muerta: sin salto brusco
  player.exhausted=player.exhausted?player.stam<20:player.stam<=0;
  {const ml2=m.length(); if(ml2>0)m.multiplyScalar(Math.pow(ml2,MOVE.curve)/ml2);} // curva: inclinaciones pequeñas = movimiento fino
  if(input.crouchToggle){player.crouch=!player.crouch;input.crouchToggle=false;} input.crouch=player.crouch; // agacharse: más lento (y más sigilo cuando exista el ruido)
  const aiming=input.aimActive||input.fire; // apuntando: más lento y sin correr, para ser preciso
  const run=input.run&&!aiming&&!player.exhausted&&m.length()>.1;
  player.stam=THREE.MathUtils.clamp(player.stam+(run?-28:16)*dt,0,100);
  const sp=(run?MOVE.run:MOVE.walk)*MOVE.mult*(aiming?MOVE.aim:1)*(player.crouch?MOVE.crouch:1);
  // aceleración y frenada suaves
  const tx=m.x*sp,tz=m.y*sp,k=Math.min(1,dt*(m.length()>0?MOVE.acc:MOVE.dec));
  vel.x+=(tx-vel.x)*k;vel.y+=(tz-vel.y)*k;
  const speed=vel.length(); player.moving=speed>.15||m.length()>.1;
  player.x+=vel.x*dt;player.z+=vel.y*dt;
  for(const o of obstacles){if(o.fly)continue;const dx=player.x-o.x,dz=player.z-o.z,d=Math.hypot(dx,dz),min=o.r+.25;if(d<min&&d>1e-4){const nx=dx/d,nz=dz/d;player.x=o.x+nx*min;player.z=o.z+nz*min;const vn=vel.x*nx+vel.y*nz;if(vn<0){vel.x-=vn*nx;vel.y-=vn*nz;}}}
  const L=FIELD-2;player.x=THREE.MathUtils.clamp(player.x,-L,L);player.z=THREE.MathUtils.clamp(player.z,-L,L);
  // apuntado
  if(input.touch){ if(input.aimActive){const l=Math.hypot(input.aim.x,input.aim.y);player.aimX=input.aim.x/l;player.aimZ=input.aim.y/l;}
    else if(m.length()>.1){player.aimX=m.x/m.length();player.aimZ=m.y/m.length();}
    player.ax=player.x+player.aimX*8;player.az=player.z+player.aimZ*8;
  } else { ray.setFromCamera(input.mouse,cam); if(ray.ray.intersectPlane(plane,hit)){player.ax=hit.x;player.az=hit.z;}
    const dx=player.ax-player.x,dz=player.az-player.z,l=Math.hypot(dx,dz)||1;player.aimX=dx/l;player.aimZ=dz/l; }
  {const b=player.inst.body,tgt=player.crouch?1:0;player.cr=(player.cr||0)+(tgt-(player.cr||0))*Math.min(1,dt*10); // PROVISIONAL sin clip de agachado: encoge y se inclina
   b.scale.y=.53*(1-.2*player.cr);b.rotation.x=.22*player.cr;}
  const r=player.inst.root;r.position.set(player.x,0,player.z);r.rotation.y=Math.atan2(player.aimX,player.aimZ);
  player.reticle.position.set(player.ax,.05,player.az);
  // animación: clips si existen, si no código
  player.t+=dt*(run?14:9);player.shootT=Math.max(0,player.shootT-dt);player.hurt=Math.max(0,player.hurt-dt);
  if(player.inst.mixer){
    const inst=player.inst,a=inst.actions;
    if(!inst.blendReady){for(const n in a){a[n].stop();a[n].enabled=true;a[n].setLoop(n==='die'?THREE.LoopOnce:THREE.LoopRepeat);a[n].clampWhenFinished=true;a[n].play();a[n].setEffectiveWeight(n==='idle'?1:0);}inst.cur=null;inst.blendReady=true;inst.w={idle:1};}
    // Pesos objetivo: reload > shoot > locomoción (quieto / andar / correr mezclados por la velocidad real)
    const tg={idle:0,walk:0,run:0,shoot_side:0,shoot_fwd:0,shoot_back:0,reload:0,die:0};
    const sp0=Math.max(speed,.01),fn=(vel.x*player.aimX+vel.y*player.aimZ)/sp0; // fn: 1 = avanzas hacia donde apuntas, -1 = de espaldas
    const shooting=input.fire&&a.shoot_side;
    if(wp.reload>0&&a.reload)tg.reload=1;
    else if(shooting){const mw=THREE.MathUtils.clamp(speed/.25,0,1); // quieto: disparo lateral; andando: según la dirección respecto a donde apuntas
      tg.shoot_fwd=mw*Math.max(0,fn);tg.shoot_back=mw*Math.max(0,-fn);tg.shoot_side=(1-mw)+mw*(1-Math.abs(fn));}
    else{const wi=THREE.MathUtils.clamp(1-speed/.25,0,1),tt=THREE.MathUtils.smoothstep(speed,MOVE.blendA,MOVE.blendB);tg.idle=wi;tg.walk=(1-wi)*(1-tt);tg.run=(1-wi)*tt;}
    const k=Math.min(1,dt*12);
    for(const n in a){inst.w[n]=(inst.w[n]||0)+(tg[n]-(inst.w[n]||0))*k;a[n].setEffectiveWeight(inst.w[n]);}
    // Cadencia = velocidad real / velocidad que el clip recorre de verdad (medida en el GLB): los pies no patinan
    const back=(vel.x*player.aimX+vel.y*player.aimZ)<-.35*Math.max(speed,.01)?-1:1,st=MOVE.step;
    const C=THREE.MathUtils.clamp;
    if(a.walk)a.walk.timeScale=back*st*C(speed/MOVE.clipWalk,.4,2.2);
    if(a.run)a.run.timeScale=back*st*C(speed/MOVE.clipRun,.5,2.2);
    if(a.shoot_back)a.shoot_back.timeScale=C(speed/.34,.6,1.6); // clip «inplace»: ya va hacia atrás por sí mismo
    if(a.shoot_fwd)a.shoot_fwd.timeScale=C(speed/.2,.7,1.6);
    inst.mixer.update(dt);}
  else{player.inst.body.position.y=player.moving?Math.abs(Math.sin(player.t))*.07:0;player.inst.body.rotation.x=player.moving?.12:0;player.inst.body.rotation.z=Math.sin(player.t)*(player.moving?.08:0);}
}

// Animación de muerte: solo el clip «die», una vez y se queda en el suelo
export function playDeath(dt){const inst=player.inst;if(!inst?.mixer||!inst.actions.die)return;
  if(!inst.dead){for(const n in inst.actions)inst.actions[n].setEffectiveWeight(n==='die'?1:0);inst.actions.die.reset().play();inst.dead=true;}
  inst.mixer.update(dt);}
