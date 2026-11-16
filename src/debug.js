// Medidor ?debug: fps, peor cuadro, tiempo de CPU, triángulos y recursos. Sin ?debug no hace nada.
import { renderer, OFF } from './renderer.js';
import { MOVE } from './player.js';
import { state } from './zombies.js';
export const DEBUG=new URLSearchParams(location.search).has('debug');
let el,t0=0,last=0,frames=0,acc=0,shown=0,cpu=0,cpuMax=0,worst=0;const hist=[];let fps=0,worstWin=0,cpuWin=0;
if(DEBUG){renderer.info.autoReset=false;
  el=document.createElement('div');el.style.cssText='position:fixed;top:4px;right:4px;z-index:99;pointer-events:none;font:11px/1.35 monospace;color:#9f9;background:rgba(0,0,0,.6);padding:4px 6px;border-radius:4px;white-space:pre;text-align:left';
  document.body.appendChild(el);
  // Ajuste de cámara: altura (Y) y distancia hacia atrás (Z). Mueve OFF en vivo; el usuario dicta los números.
  const box=document.createElement('div');
  box.style.cssText='position:fixed;left:50%;top:92px;transform:translateX(-50%);width:58%;z-index:99;font:13px/1.3 monospace;color:#fff;background:rgba(0,0,0,.55);padding:6px 10px;border-radius:8px';
  const row=(name,min,max,key)=>{const r=document.createElement('div');const l=document.createElement('span');
    const s=document.createElement('input');s.type='range';s.min=min;s.max=max;s.step=.1;s.value=OFF[key];s.style.cssText='width:100%;margin:2px 0 6px';
    const show=()=>{l.textContent=name+' '+Number(OFF[key]).toFixed(1);};show();
    s.oninput=()=>{OFF[key]=Number(s.value);show();info();};r.append(l,s);box.append(r);};
  const inf=document.createElement('div');inf.style.cssText='opacity:.8';box.append(inf);
  const info=()=>{inf.textContent='distancia '+Math.hypot(OFF.y,OFF.z).toFixed(1)+' · ángulo '+(Math.atan2(OFF.y,OFF.z)*57.3).toFixed(0)+'°';};
  row('Altura',2,30,'y');row('Atrás',0,20,'z');
  {const r=document.createElement('div'),l=document.createElement('span'),s=document.createElement('input');s.type='range';s.min=.3;s.max=2;s.step=.05;s.value=1;s.style.cssText='width:100%;margin:2px 0 6px';
   const show=()=>{l.textContent='Velocidad ×'+MOVE.mult.toFixed(2)+' (andar '+(MOVE.walk*MOVE.mult).toFixed(1)+' · correr '+(MOVE.run*MOVE.mult).toFixed(1)+')';};show();s.oninput=()=>{MOVE.mult=Number(s.value);show();};r.append(l,s);box.append(r);}
  info();
  for(const ev of ['pointerdown','touchstart','touchmove'])box.addEventListener(ev,e=>e.stopPropagation(),{passive:true});
  document.body.appendChild(box);}
export function debugStart(){if(!DEBUG)return;const n=performance.now();t0=n;
  if(last){const d=n-last;frames++;acc+=d;hist.push([n,d]);if(d>worst)worst=d;}
  last=n;renderer.info.reset();}
export function debugEnd(){if(!DEBUG)return;const n=performance.now();cpu=n-t0;cpuMax=Math.max(cpuMax,cpu);
  while(hist.length&&n-hist[0][0]>5000)hist.shift();
  if(n-shown<500)return;shown=n;
  fps=acc?frames*1000/acc:0;frames=0;acc=0;
  worstWin=0;for(const h of hist)if(h[1]>worstWin)worstWin=h[1];
  const i=renderer.info,tri=i.render.triangles,bad=fps<58||worstWin>25||tri>40000;
  el.style.color=bad?'#f88':'#9f9';
  el.textContent=`versión ${__BUILD__}\nfps ${fps.toFixed(0)}  (meta ≥58)\npeor cuadro 5 s ${worstWin.toFixed(1)} ms (meta ≤25)\nCPU cuadro ${cpu.toFixed(1)} ms (máx ${cpuMax.toFixed(1)})\ntriángulos ${tri} (meta <40000, todas las pasadas)\nllamadas ${i.render.calls}\ngeometrías ${i.memory.geometries} · texturas ${i.memory.textures}\nzombis vivos ${state.alive}`;
  cpuMax=0;}
