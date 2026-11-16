import * as THREE from 'three';
import { instance, play } from './assets.js';
import { obstacles, FIELD } from './world.js';
import { player } from './player.js';
import { impact } from './effects.js'; import { mulberry, hash, WORLD_SEED } from './sim.js';
export const TYPES={normal:{model:'zombie',hp:3,sp:2.3,dmg:8,r:.35,pts:10,pool:36},runner:{model:'runner',hp:2,sp:4.3,dmg:5,r:.3,pts:15,pool:24},tank:{model:'tank',hp:14,sp:1.6,dmg:20,r:.55,pts:50,pool:6}};
export const zombies=[]; const free={};let scene;const rnd=mulberry(hash(WORLD_SEED,1)); // canal 1 = zombis
export const state={wave:0,queue:0,spawnT:0,inter:2,score:0,alive:0,onHurt:null};
export function initZombies(s){scene=s;for(const [k,t] of Object.entries(TYPES)){free[k]=[];for(let i=0;i<t.pool;i++){
  const inst=instance(t.model);inst.root.visible=false;scene.add(inst.root);const z={id:'z'+zombies.length,type:k,t,inst,alive:false,x:0,z:0,hp:0,atk:0,dead:0,ph:rnd()*6,vx:0,vz:0};zombies.push(z);free[k].push(z);}}}
export function resetZombies(){for(const z of zombies)kill(z,true);Object.assign(state,{wave:0,queue:0,spawnT:0,inter:2,score:0});}
function spawn(){
  const w=state.wave;let k='normal',r=rnd();if(w>=3&&r<Math.min(.03*w,.15))k='tank';else if(w>=2&&r<Math.min(.12+.04*w,.4))k='runner';
  const z=free[k].pop();if(!z)return false;
  const a=rnd()*6.28,d=22;z.x=player.x+Math.cos(a)*d;z.z=player.z+Math.sin(a)*d;
  const L=FIELD-1;z.x=THREE.MathUtils.clamp(z.x,-L,L);z.z=THREE.MathUtils.clamp(z.z,-L,L);
  z.hp=z.t.hp+Math.floor(w/4);z.alive=true;z.dead=0;z.atk=0;z.inst.root.visible=true;z.inst.root.rotation.set(0,0,0);z.inst.body.rotation.set(0,0,0);z.inst.body.position.y=0;
  state.alive++;return true;}
function kill(z){z.dying=false;if(z.alive)state.alive--;z.alive=false;z.dead=0;z.inst.root.visible=false;if(!free[z.type].includes(z))free[z.type].push(z);}
export function hurt(z,dmg,kx=0,kz=0){
  if(!z.alive||z.dead)return;z.hp-=dmg;z.x+=kx*.1;z.z+=kz*.1;
  if(z.hp<=0){z.dead=.0001;state.score+=z.t.pts;state.alive--;z.alive=false;z.dying=true;if(z.inst.actions.die)play(z.inst,'die',true);}
}
export function updateZombies(dt){
  // oleadas
  if(state.queue<=0&&state.alive===0){state.inter-=dt;if(state.inter<=0){state.wave++;state.queue=6+state.wave*4;state.inter=3;state.spawnT=0;state.onWave?.(state.wave);}}
  if(state.queue>0){state.spawnT-=dt;if(state.spawnT<=0&&state.alive<40){if(spawn())state.queue--;state.spawnT=Math.max(.25,.8-state.wave*.05);}}
  for(const z of zombies){
    if(z.dying){z.dead+=dt;const f=Math.min(z.dead/.4,1);if(!z.inst.mixer)z.inst.body.rotation.x=-f*1.5;z.inst.mixer?.update(dt);
      if(z.dead>1.6){z.dying=false;z.inst.root.visible=false;free[z.type].push(z);}continue;}
    if(!z.alive)continue;
    let dx=player.x-z.x,dz=player.z-z.z;const d=Math.hypot(dx,dz)||1;dx/=d;dz/=d;
    let sx=dx,sz=dz;
    for(const o of obstacles){if(o.fly)continue;const ox=z.x-o.x,oz=z.z-o.z,od=Math.hypot(ox,oz),min=o.r+z.t.r;
      if(od<min+1.1){const w=(min+1.1-od)/1.1;const cross=ox*dz-oz*dx;const sg=cross>0?1:-1; // rodear por el lado más corto
        sx+=(ox/od)*w*1.6+(-dz*sg)*w*.8;sz+=(oz/od)*w*1.6+(dx*sg)*w*.8;}}
    for(const o of zombies){if(o===z||!o.alive)continue;const ox=z.x-o.x,oz=z.z-o.z,od=Math.hypot(ox,oz);if(od<.7&&od>1e-4){sx+=ox/od*.5;sz+=oz/od*.5;}}
    const sl=Math.hypot(sx,sz)||1;sx/=sl;sz/=sl;
    const near=d<.7*(z.t.r/.35>1.3?1.3:1)+.2;const sp=near?0:z.t.sp*(1+state.wave*.02);
    z.x+=sx*sp*dt;z.z+=sz*sp*dt;
    for(const o of obstacles){if(o.fly)continue;const ox=z.x-o.x,oz=z.z-o.z,od=Math.hypot(ox,oz),min=o.r+z.t.r;if(od<min&&od>1e-4){z.x=o.x+ox/od*min;z.z=o.z+oz/od*min;}}
    z.atk-=dt;if(near&&z.atk<=0){z.atk=.9;state.onHurt?.(z.t.dmg);}
    const r=z.inst.root;r.position.set(z.x,0,z.z);r.rotation.y=Math.atan2(dx,dz);
    if(z.inst.mixer){play(z.inst,near?'attack':'run');z.inst.mixer.update(dt);}
    else{z.ph+=dt*sp*3.5+dt;z.inst.body.position.y=Math.abs(Math.sin(z.ph))*.08;z.inst.body.rotation.z=Math.sin(z.ph)*.12;z.inst.body.rotation.x=near?Math.sin(z.ph*6)*.25+.2:.25;}
  }
}
