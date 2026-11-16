// Medidor ?debug: fps, peor cuadro, tiempo de CPU, triángulos y recursos. Sin ?debug no hace nada.
import { renderer } from './renderer.js';
import { state } from './zombies.js';
export const DEBUG=new URLSearchParams(location.search).has('debug');
let el,t0=0,last=0,frames=0,acc=0,shown=0,cpu=0,cpuMax=0,worst=0;const hist=[];let fps=0,worstWin=0,cpuWin=0;
if(DEBUG){renderer.info.autoReset=false;
  el=document.createElement('div');el.style.cssText='position:fixed;top:4px;right:4px;z-index:99;pointer-events:none;font:11px/1.35 monospace;color:#9f9;background:rgba(0,0,0,.6);padding:4px 6px;border-radius:4px;white-space:pre;text-align:left';
  document.body.appendChild(el);}
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
