// Estado de la partida (jugando / muerto), inicio, muerte y bucle de cuadro.
import * as THREE from 'three';
import { input, pollKeys } from './input.js';
import { updateProps } from './world.js';
import { updateEffects } from './effects.js';
import { updatePlayer, player, resetPlayer } from './player.js';
import { updateZombies, resetZombies, state } from './zombies.js';
import { updateWeapons, resetWeapons, wp } from './weapons.js';
import { updateUI, showMsg, hideMsg } from './ui.js';
import { touch, cam, comp, OFF } from './renderer.js'; import { debugStart, debugEnd } from './debug.js';
export const G={run:false,over:false};let sun;
export function setSun(s){sun=s;}
export function start(){resetPlayer();resetZombies();resetWeapons();G.run=true;G.over=false;hideMsg();}
function begin(e){if(!G.run&&(!G.over||performance.now()-G.overT>800)){e.preventDefault?.();start();}}
addEventListener('pointerdown',begin);addEventListener('keydown',e=>{if(e.code==='Enter')begin(e);});
export function die(){G.run=false;G.over=true;G.overT=performance.now();input.fire=false;showMsg(`HAS MUERTO\nOleada ${state.wave} · ${state.score} pts\n${touch?'Toca':'Clic'} para reintentar`);}
const tgt=new THREE.Vector3();
export function frame(dt){
  debugStart();pollKeys();
  if(G.run){updatePlayer(dt,cam);updateWeapons(dt,true);}
  updateZombies(G.run?dt:dt*.3);updateProps(dt);updateEffects(dt);updateUI();
  tgt.set(player.x+(player.ax-player.x)*.12,0,player.z+(player.az-player.z)*.12);
  const s=wp.shake;cam.position.lerp(tgt.clone().add(OFF),1-Math.pow(.0005,dt));
  cam.position.x+=(Math.random()-.5)*s;cam.position.z+=(Math.random()-.5)*s;cam.lookAt(cam.position.x-OFF.x+0,0,cam.position.z-OFF.z);
  sun.position.set(player.x-14,26,player.z+10);sun.target.position.set(player.x,0,player.z);
  comp.render();debugEnd();
}
