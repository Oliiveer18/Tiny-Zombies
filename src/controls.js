// Pantalla «Controles»: engranaje en la esquina (o botón Options del mando). Pausa el juego mientras está abierta.
import { TEST, setTest } from './test.js'; import { setCalidad, calidadActual } from './renderer.js'; import { LUZ } from './world.js';
// Calidad gráfica a comparar en el móvil (PAQ-G3). «A» es la de siempre y sigue siendo la que sale por defecto: nada cambia hasta que el usuario elija.
// Medido en iPhone 14 con 20 personajes (coordinacion/mediciones): A 41 fps · B 41 fps (más nítida) · C 58 fps (bordes algo menos suaves). La sombra de 2 048 no cuesta.
const CAL={A:'Actual',B:'Nítida',C:'Fluida'};let cal='A',cal0=null;
function aplicaCal(k){if(!cal0)cal0={...calidadActual(),sombra:LUZ.sun?LUZ.sun.shadow.mapSize.x:1024};
  const nat=Math.min(devicePixelRatio||1,3),c=k==='B'?{res:nat,msaa:2,sombra:2048}:k==='C'?{res:cal0.res,msaa:2,sombra:2048}:{res:cal0.res,msaa:cal0.msaa,sombra:cal0.sombra};
  setCalidad({res:c.res,msaa:c.msaa});const sh=LUZ.sun&&LUZ.sun.shadow;if(sh&&sh.mapSize.x!==c.sombra){sh.mapSize.set(c.sombra,c.sombra);sh.map&&sh.map.dispose();sh.map=null;}
  cal=CAL[k]?k:'A';try{localStorage.setItem('tz_cal',cal);}catch(e){}}  import { cfg, padState, hooks, ACTIONS, NAMES, save, resetCfg } from './gamepad.js';
export function initControls(){
  const ver=()=>{document.getElementById('ver').textContent=__VER__+(TEST?' · prueba':'')+(cal!=='A'?' · calidad '+cal:'');};
  if(!/[?&](carga|res|msaa)\b/.test(location.search)){let k='A';try{k=localStorage.getItem('tz_cal')||'A';}catch(e){}if(k!=='A'&&CAL[k])aplicaCal(k);} // la prueba de carga siempre mide con la calidad por defecto
  ver(); // versión: sube sola con cada cambio publicado
  const gear=document.createElement('div');gear.id='gear';gear.className='ui';gear.textContent='⚙';
  const menu=document.createElement('div');menu.id='cfgm';menu.className='ui';
  document.body.append(gear,menu);
  const stop=e=>e.stopPropagation(); // que tocar aquí no empiece ni reinicie la partida
  gear.addEventListener('pointerdown',stop);menu.addEventListener('pointerdown',stop);
  const setOpen=v=>{padState.open=v;padState.listen=null;menu.style.display=v?'flex':'none';render();};
  const render=()=>{
    if(!padState.open)return;
    const rows=ACTIONS.map(([k,n])=>`<div class="r c"><span>${n}</span><button data-a="${k}">${padState.listen===k?'Pulsa un botón…':NAMES[cfg.map[k]]||('B'+cfg.map[k])}</button></div>`).join('');
    menu.innerHTML=`<div class="r"><h3>Controles</h3><span><button data-x="reset">Restaurar</button> <button data-x="close">Cerrar</button></span></div><div class="s">${padState.on?'Mando conectado ✔':'Sin mando: conéctalo por Bluetooth y pulsa un botón'}</div>
      <div class="g">${rows}</div>
      <div class="r"><span>Zona muerta ${Math.round(cfg.dead*100)}%</span><input type="range" data-k="dead" min="0.05" max="0.4" step="0.01" value="${cfg.dead}"></div>
      <div class="r"><span>Sensibilidad ${cfg.sens.toFixed(2)}</span><input type="range" data-k="sens" min="0.5" max="1.5" step="0.05" value="${cfg.sens}"></div>
      <div class="r"><span>Calidad gráfica (comparar)</span><span>${Object.keys(CAL).map(k=>`<button data-q="${k}"${k===cal?' style="outline:2px solid #6cf"':''}>${k} · ${CAL[k]}</button>`).join(' ')}</span></div>
      <div class="r"><span>Mapa de prueba (zombis quietos)</span><span><button data-t="mode">${TEST?'Desactivar':'Activar'}</button>${TEST?' <button data-t="reload">Reiniciar</button>':''}</span></div>
      <div class="s">Stick izq. camina · stick der. apunta · pulsar el stick izq. mientras caminas = correr. Granada: mantén el botón, apunta con el stick izq. y suelta para lanzar. Options abre y cierra este menú.</div>`;
  };
  menu.addEventListener('click',e=>{
    const t=e.target.closest('button');if(!t)return;
    if(t.dataset.a){padState.listen=padState.on?t.dataset.a:null;render();if(!padState.on)menu.querySelector('.s').textContent='Primero conecta el mando y pulsa un botón';}
    else if(t.dataset.q){aplicaCal(t.dataset.q);ver();render();}
    else if(t.dataset.t==='mode'){setTest(!TEST);location.reload();}
    else if(t.dataset.t==='reload')location.reload();
    else if(t.dataset.x==='reset'){resetCfg();render();}
    else if(t.dataset.x==='close')setOpen(false);
  });
  menu.addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.k;if(!k)return;cfg[k]=parseFloat(e.target.value);save();
    const sp=e.target.previousElementSibling;if(sp)sp.textContent=k==='dead'?`Zona muerta ${Math.round(cfg.dead*100)}%`:`Sensibilidad ${cfg.sens.toFixed(2)}`;}); // sin repintar para no soltar el deslizador
  // medida en vivo de la cámara elegida (el juego sigue dibujando en pausa)
  gear.addEventListener('click',()=>setOpen(!padState.open));
  hooks.toggle=()=>setOpen(!padState.open);hooks.refresh=render;
}
