// Estado de la partida (jugando / muerto), inicio, muerte y bucle de cuadro.
import * as THREE from 'three';
import { input, pollKeys } from './input.js';
import { updateProps } from './world.js'; import { updateDebris } from './debris.js'; import { updateDecals } from './decals.js'; import { updateMuros } from './alley.js';
import { updateEffects } from './effects.js';
import { updatePlayer, player, resetPlayer,playDeath } from './player.js';
import { updateZombies, resetZombies, state } from './zombies.js';
import { updateWeapons, resetWeapons, wp } from './weapons.js';
import { TEST, CARGA, VIVO, LUGAR } from './test.js'; import { initDisparadores, pasoDisparadores } from './disparadores.js'; import { props, phys } from './world.js'; import { despertarZona } from './zombies.js'; import { mensaje } from './ui.js'; import { pollPad, padState } from './gamepad.js'; import { updateUI, showMsg, hideMsg } from './ui.js';
import { touch, cam, comp, OFF, CAM } from './renderer.js'; import { debugStart, debugEnd } from './debug.js'; import { advanceClock, resetClock } from './sim.js';
export const G={run:false,over:false};let sun;
export function setSun(s){sun=s;}
export function start(){resetClock();resetPlayer();resetZombies();resetWeapons();G.run=true;G.over=false;hideMsg();}
function begin(e){if(!G.run&&(!G.over||performance.now()-G.overT>800)){e.preventDefault?.();start();}}
addEventListener('pointerdown',begin);addEventListener('keydown',e=>{if(e.code==='Enter')begin(e);});
initDisparadores(LUGAR.disparadores);
const MD={j:player,zonas:LUGAR.zonas,roto:id=>{const p=props.find(q=>q.id===id);return !!p&&!!p.dead;},abierta:id=>{const h=phys.hinges.find(q=>q.id===id);return !!h&&Math.abs(h.a)>.7854;}};
function disparadores(){for(const a of pasoDisparadores(MD)){if(a.t==='mensaje')mensaje(a.txt);else if(a.t==='despertar'){const z=LUGAR.zonas.find(q=>q.id===a.zona);if(z)despertarZona(z.rect);}}}
// Mapa de prueba vivo (DECISIONES 4.5): al caer no hay pantalla de fin; 2 s después se reaparece en el inicio con la vida llena y los zombis vuelven a su sitio, dormidos. Reja, candado y objetos quedan como estén.
function caer(){if(G.caido>0)return;G.caido=2;player.caido=true;player.hp=0;input.fire=false;mensaje('Has caído',2);}
export function die(){if(VIVO){caer();return;}G.run=false;G.over=true;G.overT=performance.now();input.fire=false;showMsg(`HAS MUERTO\nOleada ${state.wave} · ${state.score} pts\n${touch?'Toca':'Clic'} para reintentar`);}
const CAM_LEAD=0; // Tiny original: .12 (la cámara se adelanta hacia donde apuntas). 0 = el jugador siempre en el centro, como la referencia.
const tgt=new THREE.Vector3(),pa=new THREE.Vector3(),pb=new THREE.Vector3();
// Qué parte del alto de la pantalla ocupa el personaje (criterio de R1: entre 1/10 y 1/12)
export function charFrac(){pa.set(player.x,0,player.z).project(cam);pb.set(player.x,player.alto||1.5,player.z).project(cam);return Math.abs(pb.y-pa.y)/2;}
function camFollow(dt){
  tgt.set(player.x+(player.ax-player.x)*CAM_LEAD,0,player.z+(player.az-player.z)*CAM_LEAD);
  const s=wp.shake;cam.position.lerp(tgt.clone().add(OFF),1-Math.pow(.0005,dt));
  cam.position.x+=(Math.random()-.5)*s;cam.position.z+=(Math.random()-.5)*s;cam.lookAt(cam.position.x-OFF.x+0,0,cam.position.z-OFF.z);
  if(player.reticle)player.reticle.scale.setScalar(CAM.k);
}
export function frame(dt){
  debugStart();pollKeys();pollPad(dt);if(padState.start&&!G.run)begin({});
  if(TEST&&G.run){wp.grenades=Math.max(wp.grenades,5);if(CARGA&&player.hp<100)player.hp=100;} // prueba: granadas infinitas; sin morir solo en ?carga
  if(G.caido>0){G.caido-=dt;if(G.caido<=0){G.caido=0;player.caido=false;resetPlayer();resetZombies();}}
  const pz=padState.open; // menú de Controles abierto = juego en pausa
  if(pz){updateUI();camFollow(dt);comp.render();debugEnd();return;} // en pausa la cámara sigue colocándose: así se ve al momento la cámara elegida en el menú
  if(G.run&&!(G.caido>0)){advanceClock(dt);updatePlayer(dt,cam);updateWeapons(dt,true);if(VIVO)disparadores();}
  if(!G.run&&G.over)playDeath(dt);
  updateZombies(G.run?dt:dt*.3);updateProps(dt);updateDebris(dt);updateDecals(dt);updateEffects(dt);updateUI();
  camFollow(dt);updateMuros(dt,cam.position.x,cam.position.y,cam.position.z,player.x,player.z);
  sun.position.set(player.x-14,26,player.z+10);sun.target.position.set(player.x,0,player.z);
  comp.render();debugEnd();
}
