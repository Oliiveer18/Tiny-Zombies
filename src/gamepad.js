// Mando (Gamepad API): lectura de sticks y botones, ajustes guardados y asignación de botones.
// Pensado para PlayStation (DualShock/DualSense) por Bluetooth en iPhone; vale cualquier mando con mapeo estándar.
import { input } from './input.js';
export const NAMES=['✕','○','□','△','L1','R1','L2','R2','Create','Options','L3','R3','↑','↓','←','→'];
export const ACTIONS=[['fire','Disparar'],['aim','Apuntar'],['grenade','Granada'],['run','Correr'],['reload','Recargar'],['crouch','Agacharse'],['weapon','Cambiar arma']];
const OPTIONS=9; // reservado: abre y cierra el menú de Controles
const DEF={map:{fire:7,aim:6,grenade:5,run:10,reload:2,crouch:1,weapon:3},dead:.15,sens:1};
const clone=o=>JSON.parse(JSON.stringify(o));
function load(){try{const s=JSON.parse(localStorage.getItem('tz_pad2')||'null');if(s)return {...clone(DEF),...s,map:{...DEF.map,...s.map}};}catch(e){}return clone(DEF);}
export const cfg=load();
export const padState={open:false,on:false,listen:null,start:false};
export const hooks={toggle:null,refresh:null}; // los rellena controls.js
export function save(){try{localStorage.setItem('tz_pad2',JSON.stringify(cfg));}catch(e){}}
export function resetCfg(){const d=clone(DEF);cfg.map=d.map;cfg.dead=d.dead;cfg.sens=d.sens;save();}
let prev=[];
// zona muerta circular + sensibilidad (más sensibilidad = llegas antes al máximo)
function stick(x,y){const l=Math.hypot(x,y);if(l<cfg.dead)return [0,0];const k=Math.min(1,(l-cfg.dead)/(1-cfg.dead)*cfg.sens)/l;return [x*k,y*k];}
function release(){input.move.set(0,0);input.aim.set(0,0);input.nadeAim.set(0,0);input.aimActive=false;input.fire=false;input.aimHold=false;input.nadeHold=false;input.run=false;}
const sm=[0,0];
export function pollPad(dt){
  padState.start=false;
  const gps=navigator.getGamepads?navigator.getGamepads():[];let g=null;
  for(const p of gps)if(p&&p.connected){g=p;break;}
  if(!!g!==padState.on){padState.on=!!g;document.body.classList.toggle('pad',padState.on);prev=[];if(!g){release();input.pad=false;}hooks.refresh&&hooks.refresh();}
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
  const ax=g.axes,A=cfg.map;input.pad=true;
  const L=stick(ax[0]||0,ax[1]||0),R=stick(ax[2]||0,ax[3]||0);
  const held=a=>now[A[a]],ed=a=>e(A[a]),rel=a=>!now[A[a]]&&!!last[A[a]];
  {const k=1-Math.exp(-(dt||.016)/.045),tx=L[0],ty=L[1]; // filtro suave: quita el temblor del stick y los saltos entre cuadros
   sm[0]+=(tx-sm[0])*k;sm[1]+=(ty-sm[1])*k;if(!tx&&!ty&&Math.hypot(sm[0],sm[1])<.03){sm[0]=0;sm[1]=0;}L[0]=sm[0];L[1]=sm[1];}
  // Granada: mantén el botón y apunta con el stick izquierdo (no caminas); al soltar, se lanza
  const gh=held('grenade'),gr=rel('grenade');
  input.nadeHold=gh||gr;
  if(gh){input.nadeAim.set(L[0],L[1]);}else if(!gr)input.nadeAim.set(0,0); // al soltar se conserva la última dirección ese cuadro
  if(gh||gr)input.move.set(0,0);else input.move.set(L[0],L[1]);
  if(gr)input.grenade=true;
  input.aim.set(R[0],R[1]);input.aimActive=Math.hypot(R[0],R[1])>.05; // stick derecho: solo dirección; cualquier inclinación fuera de la zona muerta cuenta
  input.fire=held('fire');input.aimHold=held('aim');
  input.run=held('run')&&Math.hypot(L[0],L[1])>.3&&!gh; // pulsar el stick izquierdo mientras caminas = correr
  if(ed('reload'))input.reload=true;
  if(ed('crouch'))input.crouchToggle=true;
  if(ed('weapon'))input.weapon=true;
  for(const i of [0,1,2,3])if(e(i)&&last.length)padState.start=true; // cualquier botón de la derecha empieza o reintenta la partida
}
