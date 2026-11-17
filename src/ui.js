import { TEST } from './test.js';
import { player } from './player.js'; import { objetivo } from './usar.js'; import { input } from './input.js'; import { padState, cfg, NAMES } from './gamepad.js'; import { wp } from './weapons.js'; import { state } from './zombies.js';
const $=id=>document.getElementById(id);const hp=$('hp').firstElementChild,st=$('st').firstElementChild,info=$('info'),msg=$('msg');
export function updateUI(){hp.style.width=Math.max(player.hp,0)+'%';st.style.width=player.stam+'%';st.style.opacity=player.stam<20?.5:1;
  usarUI();info.textContent=`${TEST?'PRUEBA':'Oleada '+state.wave} · ${wp.reload>0?'recargando…':wp.ammo+'/'+wp.mag} · 💣 ${wp.grenades} · ${state.score} pts`;}
const bu=$('bu'),ul=$('ul');
function usarUI(){const v=objetivo.id?objetivo.verbo:null,T=v?v[0].toUpperCase()+v.slice(1):'';
  bu.classList.toggle('on',!!v);if(v&&bu.textContent!==T.toUpperCase())bu.textContent=T.toUpperCase(); // el botón redondo solo aparece cuando hay objetivo
  const t=v&&(padState.on||!input.touch);ul.classList.toggle('on',!!t);if(t)ul.textContent=(padState.on?(NAMES[cfg.map.use]||'B'+cfg.map.use):'F')+' '+T+(v==='forzar'||v==='arrastrar'?' (mantener)':'');} // etiqueta junto al HUD en mando y teclado
export function showMsg(t){msg.textContent=t;msg.classList.remove('hide');} export function hideMsg(){msg.classList.add('hide');}
let avT=0;const av=$('av');
export function mensaje(t,s=2.5){av.textContent=t;av.classList.add('on');clearTimeout(avT);avT=setTimeout(()=>av.classList.remove('on'),s*1000);} // aviso breve arriba, bajo el HUD (disparadores, «Has caído»)
export function flashWave(w){info.dataset.w=w;}
