import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { loadAll } from './assets.js'; import { input, initInput, pollKeys } from './input.js';
import { buildWorld, updateProps } from './world.js'; import { initEffects, updateEffects } from './effects.js';
import { initPlayer, updatePlayer, player, resetPlayer } from './player.js';
import { initZombies, updateZombies, resetZombies, state } from './zombies.js';
import { initWeapons, updateWeapons, resetWeapons, wp } from './weapons.js'; import { updateUI, showMsg, hideMsg } from './ui.js';
const touch=matchMedia('(pointer:coarse)').matches; const dpr=Math.min(devicePixelRatio,2);
const renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance'});
renderer.setPixelRatio(touch?Math.min(dpr,1.5):dpr);renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;document.body.prepend(renderer.domElement);
const scene=new THREE.Scene();const cam=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.5,120);
const OFF=new THREE.Vector3(0,14,8.6); // pitch ≈ 58°
const comp=new EffectComposer(renderer);comp.addPass(new RenderPass(scene,cam));
const bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth/2,innerHeight/2),touch?.25:.4,.6,.85);comp.addPass(bloom);comp.addPass(new OutputPass());
addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);comp.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();});
const G={run:false,over:false};let sun;
function start(){resetPlayer();resetZombies();resetWeapons();G.run=true;G.over=false;hideMsg();}
function begin(e){if(!G.run&&(!G.over||performance.now()-G.overT>800)){e.preventDefault?.();start();}}
addEventListener('pointerdown',begin);addEventListener('keydown',e=>{if(e.code==='Enter')begin(e);});
async function main(){
  showMsg('Cargando…');await loadAll();initInput(renderer.domElement);
  sun=buildWorld(scene,{shadow:touch?1024:2048});initEffects(scene);initPlayer(scene);initZombies(scene);initWeapons(scene);
  state.onHurt=d=>{if(!G.run)return;player.hp-=d;player.hurt=.25;if(player.hp<=0)die();};wp.onSelfHit=state.onHurt;
  state.onWave=()=>{wp.grenades=Math.min(wp.grenades+1,5);};
  showMsg(touch?'TINY ZOMBIES\nJoystick izq: mover · der: apuntar y disparar\nToca para empezar':'TINY ZOMBIES\nWASD mover · Shift correr · Clic disparar\nR recargar · E granada\nClic para empezar');
  cam.position.copy(OFF);cam.lookAt(0,0,0);let last=performance.now();
  renderer.setAnimationLoop(t=>{const dt=Math.min((t-last)/1000,.05);last=t;frame(dt);});
}
function die(){G.run=false;G.over=true;G.overT=performance.now();input.fire=false;showMsg(`HAS MUERTO\nOleada ${state.wave} · ${state.score} pts\n${touch?'Toca':'Clic'} para reintentar`);}
const tgt=new THREE.Vector3();
function frame(dt){
  pollKeys();
  if(G.run){updatePlayer(dt,cam);updateWeapons(dt,true);}
  updateZombies(G.run?dt:dt*.3);updateProps(dt);updateEffects(dt);updateUI();
  tgt.set(player.x+(player.ax-player.x)*.12,0,player.z+(player.az-player.z)*.12);
  const s=wp.shake;cam.position.lerp(tgt.clone().add(OFF),1-Math.pow(.0005,dt));
  cam.position.x+=(Math.random()-.5)*s;cam.position.z+=(Math.random()-.5)*s;cam.lookAt(cam.position.x-OFF.x+0,0,cam.position.z-OFF.z);
  sun.position.set(player.x-14,26,player.z+10);sun.target.position.set(player.x,0,player.z);
  comp.render();
}
main();
