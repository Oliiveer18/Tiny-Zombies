import { TEST } from './test.js';
import { player } from './player.js'; import { wp } from './weapons.js'; import { state } from './zombies.js';
const $=id=>document.getElementById(id);const hp=$('hp').firstElementChild,st=$('st').firstElementChild,info=$('info'),msg=$('msg');
export function updateUI(){hp.style.width=Math.max(player.hp,0)+'%';st.style.width=player.stam+'%';st.style.opacity=player.stam<20?.5:1;
  info.textContent=`${TEST?'PRUEBA':'Oleada '+state.wave} · ${wp.reload>0?'recargando…':wp.ammo+'/'+wp.mag} · 💣 ${wp.grenades} · ${state.score} pts`;}
export function showMsg(t){msg.textContent=t;msg.classList.remove('hide');} export function hideMsg(){msg.classList.add('hide');}
export function flashWave(w){info.dataset.w=w;}
