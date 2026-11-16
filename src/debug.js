// Medidor ?debug: fps, peor cuadro, tiempo de CPU, triángulos y recursos. Sin ?debug no hace nada.
import { renderer, OFF, CAM } from './renderer.js'; import { charFrac } from './game.js';
import { MOVE, topSpeed } from './player.js';
import { LUZ } from './world.js';
import { state } from './zombies.js';
export const DEBUG=new URLSearchParams(location.search).has('debug');
let el,t0=0,last=0,frames=0,acc=0,shown=0,cpu=0,cpuMax=0,worst=0;const hist=[];let fps=0,worstWin=0,cpuWin=0;
if(DEBUG){renderer.info.autoReset=false;
  el=document.createElement('div');el.style.cssText='position:fixed;top:44px;right:4px;z-index:99;pointer-events:none;font:11px/1.35 monospace;color:#9f9;background:rgba(0,0,0,.6);padding:4px 6px;border-radius:4px;white-space:pre;text-align:left';
  document.body.appendChild(el);
  // Ajuste de cámara: altura (Y) y distancia hacia atrás (Z). Mueve OFF en vivo; el usuario dicta los números.
  const box=document.createElement('div');
  box.style.cssText='position:fixed;left:50%;top:92px;transform:translateX(-50%);width:58%;z-index:99;font:13px/1.3 monospace;color:#fff;background:rgba(0,0,0,.55);padding:6px 10px;border-radius:8px';
  const row=(name,min,max,key)=>{const r=document.createElement('div');const l=document.createElement('span');
    const s=document.createElement('input');s.type='range';s.min=min;s.max=max;s.step=.1;s.value=OFF[key];s.style.cssText='width:100%;margin:2px 0 6px';
    const show=()=>{l.textContent=name+' '+Number(OFF[key]).toFixed(1);};show();
    s.oninput=()=>{OFF[key]=Number(s.value);show();info();};r.append(l,s);box.append(r);sync.push(()=>{s.value=OFF[key];show();info();});};const sync=[];CAM.onChange=()=>sync.forEach(f=>f());
  const inf=document.createElement('div');inf.style.cssText='opacity:.8';box.append(inf);
  const info=()=>{inf.textContent='distancia '+Math.hypot(OFF.y,OFF.z).toFixed(1)+' · ángulo '+(Math.atan2(OFF.y,OFF.z)*57.3).toFixed(0)+'°';};
  row('Altura',2,30,'y');row('Atrás',0,20,'z');
  {const r=document.createElement('div'),l=document.createElement('span'),s=document.createElement('input');s.type='range';s.min=.3;s.max=2;s.step=.05;s.value=1;s.style.cssText='width:100%;margin:2px 0 6px';
   const show=()=>{l.textContent='Velocidad ×'+MOVE.mult.toFixed(2)+' (máx '+topSpeed().toFixed(1)+')';};show();s.oninput=()=>{MOVE.mult=Number(s.value);show();};r.append(l,s);box.append(r);}
  const sl=(name,min,max,get,set,st=.05)=>{const r=document.createElement('div'),l=document.createElement('span'),s=document.createElement('input');s.type='range';s.min=min;s.max=max;s.step=st;s.value=get();s.style.cssText='width:100%;margin:2px 0 6px';
    const show=()=>{l.textContent=name+' '+Number(get()).toFixed(2);};show();s.oninput=()=>{set(Number(s.value));show();};r.append(l,s);box.append(r);};
  sl('Exposición',.3,1.6,()=>renderer.toneMappingExposure,v=>renderer.toneMappingExposure=v);
  sl('Sol',0,4,()=>LUZ.sun?LUZ.sun.intensity:0,v=>{if(LUZ.sun)LUZ.sun.intensity=v;});
  sl('Ambiente',0,2,()=>LUZ.hemi?LUZ.hemi.intensity:0,v=>{if(LUZ.hemi)LUZ.hemi.intensity=v;});
  sl('Velocidad al apuntar ×',.2,1,()=>MOVE.aim,v=>MOVE.aim=v);
  sl('Paso (cadencia)',.5,1.6,()=>MOVE.step,v=>MOVE.step=v);
  sl('Tamaño del personaje ×',.8,2.2,()=>MOVE.size,v=>MOVE.size=v);
  info();
  // Paneles escondidos por defecto: un botón pequeño los muestra u oculta
  const btn=document.createElement('div');btn.textContent='📊';btn.style.cssText='position:fixed;top:max(12px,env(safe-area-inset-top));right:calc(max(12px,env(safe-area-inset-right)) + 46px);z-index:100;width:38px;height:38px;line-height:38px;text-align:center;font-size:18px;color:#fff;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.25);border-radius:50%;box-sizing:border-box';
  let on=false;const vis=()=>{el.style.display=on?'':'none';box.style.display=on?'':'none';};vis();
  const tog=e=>{e.stopPropagation();e.preventDefault();on=!on;vis();};btn.addEventListener('touchstart',tog,{passive:false});btn.addEventListener('click',tog);
  document.body.appendChild(btn);
  for(const ev of ['pointerdown','touchstart','touchmove'])box.addEventListener(ev,e=>e.stopPropagation(),{passive:true});
  document.body.appendChild(box);}
export function debugStart(){if(!DEBUG)return;const n=performance.now();t0=n;
  if(last&&n>6000){const d=n-last;frames++;acc+=d;hist.push([n,d]);if(d>worst)worst=d;}
  last=n;renderer.info.reset();}
export function debugEnd(){if(!DEBUG)return;const n=performance.now();cpu=n-t0;cpuMax=Math.max(cpuMax,cpu);
  while(hist.length&&n-hist[0][0]>5000)hist.shift();
  if(n-shown<500)return;shown=n;
  fps=acc?frames*1000/acc:0;frames=0;acc=0;
  worstWin=0;for(const h of hist)if(h[1]>worstWin)worstWin=h[1];
  const i=renderer.info,tri=i.render.triangles,bad=fps<58||worstWin>25||tri>40000;
  el.style.color=bad?'#f88':'#9f9';
  el.textContent=`versión ${__BUILD__}\nfps ${fps.toFixed(0)}  (meta ≥58)\npeor cuadro 5 s ${worstWin.toFixed(1)} ms (meta ≤25)\nCPU cuadro ${cpu.toFixed(1)} ms (máx ${cpuMax.toFixed(1)})\ntriángulos ${tri} (meta <40000, todas las pasadas)\nllamadas ${i.render.calls}\ngeometrías ${i.memory.geometries} · texturas ${i.memory.textures}\nzombis vivos ${state.alive}\ncámara ${CAM.id} · personaje 1/${(1/Math.max(charFrac(),.001)).toFixed(1)} del alto`;
  cpuMax=0;}
