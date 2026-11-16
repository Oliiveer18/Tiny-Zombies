// Mando (Gamepad API): lectura de sticks y botones, ajustes guardados y asignación de botones.
// Pensado para PlayStation (DualShock/DualSense) por Bluetooth en iPhone; vale cualquier mando con mapeo estándar.
import { input } from './input.js';
export const NAMES=['✕','○','□','△','L1','R1','L2','R2','Create','Options','L3','R3','↑','↓','←','→'];
export const ACTIONS=[['fire','Disparar'],['reload','Recargar'],['grenade','Granada'],['crouch','Agacharse']];
const OPTIONS=9; // reservado: abre y cierra el menú de Controles
const DEF={map:{fire:7,reload:0,grenade:1,crouch:10},dead:.15,sens:1,swap:false};
const clone=o=>JSON.parse(JSON.stringify(o));
function load(){try{const s=JSON.parse(localStorage.getItem('tz_pad')||'null');if(s)return {...clone(DEF),...s,map:{...DEF.map,...s.map}};}catch(e){}return clone(DEF);}
export const cfg=load();
export const padState={open:false,on:false,listen:null,start:false};
export const hooks={toggle:null,refresh:null}; // los rellena controls.js
export function save(){try{localStorage.setItem('tz_pad',JSON.stringify(cfg));}catch(e){}}
export function resetCfg(){const d=clone(DEF);cfg.map=d.map;cfg.dead=d.dead;cfg.sens=d.sens;cfg.swap=d.swap;save();}
let prev=[];
// zona muerta circular + sensibilidad (más sensibilidad = llegas antes al máximo)
function stick(x,y){const l=Math.hypot(x,y);if(l<cfg.dead)return [0,0];const k=Math.min(1,(l-cfg.dead)/(1-cfg.dead)*cfg.sens)/l;return [x*k,y*k];}
function release(){input.move.set(0,0);input.aim.set(0,0);input.aimActive=false;input.fire=false;}
export function pollPad(){
  padState.start=false;
  const gps=navigator.getGamepads?navigator.getGamepads():[];let g=null;
  for(const p of gps)if(p&&p.connected){g=p;break;}
  if(!!g!==padState.on){padState.on=!!g;document.body.classList.toggle('pad',padState.on);prev=[];if(!g)release();hooks.refresh&&hooks.refresh();}
  if(!g)return;
  const now=g.buttons.map(b=>!!b&&(b.pressed||b.value>.5));
  const last=prev;prev=now;
  const e=i=>now[i]&&!last[i];
  if(e(OPTIONS)){hooks.toggle&&hooks.toggle();return;}
  if(padState.open){
    release();
    if(padState.listen){for(let i=0;i<now.length;i++){if(i===OPTIONS||!e(i))continue;
      const k=padState.listen;for(const [a] of ACTIONS)if(a!==k&&cfg.map[a]===i)cfg.map[a]=cfg.map[k]; // si ya estaba en otra acción, se intercambian
      cfg.map[k]=i;padState.listen=null;save();hooks.refresh&&hooks.refresh();break;}}
    return;
  }
  const ax=g.axes;let L=stick(ax[0]||0,ax[1]||0),R=stick(ax[2]||0,ax[3]||0);
  if(cfg.swap){const t=L;L=R;R=t;}
  input.move.set(L[0],L[1]);input.aim.set(R[0],R[1]);
  input.aimActive=Math.hypot(R[0],R[1])>.25;
  input.fire=input.aimActive||now[cfg.map.fire]; // inclinar el stick de apuntar dispara (como el joystick táctil); el botón también
  if(e(cfg.map.reload))input.reload=true;
  if(e(cfg.map.grenade))input.grenade=true;
  if(e(cfg.map.crouch))input.crouchToggle=true;
  for(const i of [0,1,2,3])if(e(i)&&last.length)padState.start=true; // cualquier botón de la derecha empieza o reintenta la partida
}
