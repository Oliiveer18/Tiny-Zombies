// Pantalla «Controles»: engranaje en la esquina (o botón Options del mando). Pausa el juego mientras está abierta.
import { TEST, setTest } from './test.js'; import { setCalidad, calidadActual } from './renderer.js'; import { LUZ } from './world.js'; import { renderer } from './renderer.js'; import { SEAM } from './assets.js';
// Calidad gráfica (DECISIONES 2.15): «B · Nítida» es la predeterminada (elegida por el usuario en su iPhone el 17 nov) y es la que arranca el juego;
// A y C quedan como alternativas en el menú y se recuerdan. Medido en iPhone 14 con 20 personajes: A 41 fps · B 41 fps · C 58 fps.
const CAL={A:'Anterior',B:'Nítida',C:'Fluida'};let cal='B',cal0=null;
function aplicaCal(k,guarda=true){if(!cal0)cal0={...calidadActual(),sombra:LUZ.sun?LUZ.sun.shadow.mapSize.x:2048}; // cal0 = la predeterminada (B) tal como arrancó
  const c=k==='A'?{res:Math.min(cal0.res,2),msaa:4,sombra:1024}:k==='C'?{res:Math.min(cal0.res,2),msaa:2,sombra:2048}:cal0;
  setCalidad({res:c.res,msaa:c.msaa});const sh=LUZ.sun&&LUZ.sun.shadow;if(sh&&sh.mapSize.x!==c.sombra){sh.mapSize.set(c.sombra,c.sombra);sh.map&&sh.map.dispose();sh.map=null;}
  cal=CAL[k]?k:'B';if(guarda)try{localStorage.setItem('tz_cal2',cal);}catch(e){}}
  import { cfg, padState, hooks, ACTIONS, NAMES, save, resetCfg } from './gamepad.js';
export function initControls(){
  const ver=()=>{document.getElementById('ver').textContent=__VER__+(TEST?' · prueba':'')+(cal!=='B'?' · calidad '+cal:'');};
  if(!/[?&](carga|res|msaa)\b/.test(location.search)){try{localStorage.removeItem('tz_cal2');}catch(e){} /* A y C descartadas por el usuario (17 nov): siempre B */} // la prueba de carga mide siempre con la predeterminada
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
      <div class="r"><span>Lupa y costuras (revisar modelos)</span><span><button data-x="cmp">${barra&&barra.style.display!=='none'?'Quitar barra':'Mostrar barra'}</button></span></div>
      <div class="r"><span>Mapa de prueba (zombis quietos)</span><span><button data-t="mode">${TEST?'Desactivar':'Activar'}</button>${TEST?' <button data-t="reload">Reiniciar</button>':''}</span></div>
      <div class="s">Stick izq. camina · stick der. apunta · pulsar el stick izq. mientras caminas = correr. Granada: mantén el botón, apunta con el stick izq. y suelta para lanzar. Options abre y cierra este menú.</div>`;
  };
  menu.addEventListener('click',e=>{
    const t=e.target.closest('button');if(!t)return;
    if(t.dataset.a){padState.listen=padState.on?t.dataset.a:null;render();if(!padState.on)menu.querySelector('.s').textContent='Primero conecta el mando y pulsa un botón';}
    else if(t.dataset.q){aplicaCal(t.dataset.q);ver();render();}
    else if(t.dataset.x==='cmp'){comparar(!(barra&&barra.style.display!=='none'));setOpen(false);}
    else if(t.dataset.t==='mode'){setTest(!TEST);location.reload();}
    else if(t.dataset.t==='reload')location.reload();
    else if(t.dataset.x==='reset'){resetCfg();render();}
    else if(t.dataset.x==='close')setOpen(false);
  });
  menu.addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.k;if(!k)return;cfg[k]=parseFloat(e.target.value);save();
    const sp=e.target.previousElementSibling;if(sp)sp.textContent=k==='dead'?`Zona muerta ${Math.round(cfg.dead*100)}%`:`Sensibilidad ${cfg.sens.toFixed(2)}`;}); // sin repintar para no soltar el deslizador
  // Barra de comparación (PAQ-G3): se queda en pantalla mientras se juega. Lupa = amplía el centro de la imagen (donde está el jugador)
  // mostrando los píxeles reales, para ver de cerca lo que a tamaño normal no se distingue. No cambia nada del juego por sí misma.
  let barra=null,lupa=1;const cv=renderer.domElement;
  const pintaBarra=()=>{if(!barra)return;const q=calidadActual(),sh=LUZ.sun&&LUZ.sun.shadow;
    barra.innerHTML=`      <div><button data-l="1" class="${lupa===1?'on':''}">Sin lupa</button><button data-l="4" class="${lupa===4?'on':''}">Lupa ×4</button><button data-l="8" class="${lupa===8?'on':''}">Lupa ×8</button></div>
      <div><button data-c="1" class="${SEAM?'on':''}">Costuras: corregidas</button><button data-c="0" class="${SEAM?'':'on'}">sin corregir</button><button data-l="x">✕</button></div>
      <div class="i">imagen ${cv.width}×${cv.height} píxeles · suavizado ×${q.msaa||1} · sombra ${sh?sh.mapSize.x:'—'}</div>`;};
  const ponLupa=n=>{lupa=n;cv.style.transformOrigin='50% 50%';cv.style.transform=n>1?`translateY(16%) scale(${n})`:''; // algo más abajo, para que la barra no tape al personaje
    cv.style.imageRendering=n>1?'pixelated':'';};
  function comparar(v){
    if(!barra){barra=document.createElement('div');barra.id='cmpb';barra.className='ui';document.body.appendChild(barra);
      const st=document.createElement('style');st.textContent='#cmpb{position:fixed;left:50%;transform:translateX(-50%);top:calc(max(12px,env(safe-area-inset-top)) + 64px);z-index:98;background:rgba(10,14,20,.86);border:1px solid #ffffff30;border-radius:12px;padding:6px 8px;font:12px/1.3 -apple-system,system-ui,sans-serif;color:#e8edf2;width:min(350px,94vw);box-sizing:border-box;text-align:center}#cmpb div{display:flex;gap:5px;justify-content:center;margin:3px 0}#cmpb button{flex:1;min-height:36px;border-radius:9px;border:1px solid #ffffff40;background:transparent;color:#e8edf2;font:600 12px -apple-system,system-ui,sans-serif;padding:0 4px}#cmpb button.on{background:#3ecf6e;color:#06210f;border-color:#3ecf6e}#cmpb button[data-l="x"]{flex:0 0 40px}#cmpb .i{display:block;color:#9aa5b1;font-size:11px;font-variant-numeric:tabular-nums}';document.head.appendChild(st);
      barra.addEventListener('pointerdown',stop);
      barra.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
        if(t.dataset.q){aplicaCal(t.dataset.q);ver();}
        else if(t.dataset.l==='x'){comparar(false);return;}
        else if(t.dataset.l)ponLupa(+t.dataset.l);
        else if(t.dataset.c){if((t.dataset.c==='1')!==SEAM){try{localStorage.setItem('tz_costuras',t.dataset.c);localStorage.setItem('tz_cmp','1');}catch(e){}location.reload();return;}}
        pintaBarra();});}
    barra.style.display=v?'':'none';if(!v){ponLupa(1);try{localStorage.removeItem('tz_cmp');}catch(e){}}else pintaBarra();}
  try{if(localStorage.getItem('tz_cmp')==='1')comparar(true);}catch(e){} // tras recargar por el cambio de costuras, la barra sigue abierta
  // medida en vivo de la cámara elegida (el juego sigue dibujando en pausa)
  gear.addEventListener('click',()=>setOpen(!padState.open));
  hooks.toggle=()=>setOpen(!padState.open);hooks.refresh=render;
}
