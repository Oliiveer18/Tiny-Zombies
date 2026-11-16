// Pantalla «Controles»: engranaje en la esquina (o botón Options del mando). Pausa el juego mientras está abierta.
import { cfg, padState, hooks, ACTIONS, NAMES, save, resetCfg } from './gamepad.js';
export function initControls(){
  const gear=document.createElement('div');gear.id='gear';gear.className='ui';gear.textContent='⚙';
  const menu=document.createElement('div');menu.id='cfgm';menu.className='ui';
  document.body.append(gear,menu);
  const stop=e=>e.stopPropagation(); // que tocar aquí no empiece ni reinicie la partida
  gear.addEventListener('pointerdown',stop);menu.addEventListener('pointerdown',stop);
  const setOpen=v=>{padState.open=v;padState.listen=null;menu.style.display=v?'flex':'none';render();};
  const render=()=>{
    if(!padState.open)return;
    const rows=ACTIONS.map(([k,n])=>`<div class="r"><span>${n}</span><button data-a="${k}">${padState.listen===k?'Pulsa un botón…':NAMES[cfg.map[k]]||('B'+cfg.map[k])}</button></div>`).join('');
    menu.innerHTML=`<div class="r"><h3>Controles</h3><span><button data-x="reset">Restaurar</button> <button data-x="close">Cerrar</button></span></div><div class="s">${padState.on?'Mando conectado ✔':'Sin mando: conéctalo por Bluetooth y pulsa un botón'}</div>
      ${rows}
      <div class="r"><span>Moverte / apuntar</span><button data-sw="1">${cfg.swap?'Izq. apunta · Der. mueve':'Izq. mueve · Der. apunta'}</button></div>
      <div class="r"><span>Zona muerta ${Math.round(cfg.dead*100)}%</span><input type="range" data-k="dead" min="0.05" max="0.4" step="0.01" value="${cfg.dead}"></div>
      <div class="r"><span>Sensibilidad ${cfg.sens.toFixed(2)}</span><input type="range" data-k="sens" min="0.5" max="1.5" step="0.05" value="${cfg.sens}"></div>
      <div class="s">Options abre y cierra este menú. Inclinar el stick de apuntar también dispara.</div>`;
  };
  menu.addEventListener('click',e=>{
    const t=e.target.closest('button');if(!t)return;
    if(t.dataset.a){padState.listen=padState.on?t.dataset.a:null;render();if(!padState.on)menu.querySelector('.s').textContent='Primero conecta el mando y pulsa un botón';}
    else if(t.dataset.sw){cfg.swap=!cfg.swap;save();render();}
    else if(t.dataset.x==='reset'){resetCfg();render();}
    else if(t.dataset.x==='close')setOpen(false);
  });
  menu.addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.k;if(!k)return;cfg[k]=parseFloat(e.target.value);save();
    const sp=e.target.previousElementSibling;if(sp)sp.textContent=k==='dead'?`Zona muerta ${Math.round(cfg.dead*100)}%`:`Sensibilidad ${cfg.sens.toFixed(2)}`;}); // sin repintar para no soltar el deslizador
  gear.addEventListener('click',()=>setOpen(!padState.open));
  hooks.toggle=()=>setOpen(!padState.open);hooks.refresh=render;
}
