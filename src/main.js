// Arranque: carga de recursos, creación del mundo y bucle de animación.
import { loadAll } from './assets.js'; import { initInput } from './input.js'; import { initControls } from './controls.js';
import { buildWorld } from './world.js'; import { initEffects } from './effects.js';
import { initPlayer, player } from './player.js';
import { initZombies, state } from './zombies.js';
import { initWeapons, wp } from './weapons.js'; import { showMsg } from './ui.js';
import { touch, renderer, scene, cam, OFF } from './renderer.js';
import { G, setSun, die, frame } from './game.js'; import { TEST } from './test.js'; import { obstacles } from './world.js'; import { zombies } from './zombies.js';
async function main(){
  showMsg('Cargando…');await loadAll();initInput(renderer.domElement);initControls();
  setSun(buildWorld(scene,{shadow:touch?1024:2048}));initEffects(scene);initPlayer(scene);initZombies(scene);initWeapons(scene);
  if(TEST)window.__tz={player,obstacles,zombies,state}; // ayuda para las pruebas automáticas del mapa de prueba
  state.onHurt=d=>{if(!G.run)return;player.hp-=d;player.hurt=.25;if(player.hp<=0)die();};wp.onSelfHit=state.onHurt;
  state.onWave=()=>{wp.grenades=Math.min(wp.grenades+1,5);};
  showMsg(touch?'TINY ZOMBIES\nJoystick izq: mover · der: apuntar y disparar\nToca para empezar':'TINY ZOMBIES\nWASD mover · Shift correr · Clic disparar\nR recargar · E granada\nClic para empezar');
  cam.position.copy(OFF);cam.lookAt(0,0,0);let last=performance.now();
  renderer.setAnimationLoop(t=>{const dt=Math.min((t-last)/1000,.05);last=t;frame(dt);});
}
main();
