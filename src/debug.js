// Medidor ?debug: fps, peor cuadro, tiempo de CPU, triángulos y recursos. Sin ?debug no hace nada.
import { renderer, scene, OFF, CAM } from './renderer.js'; import { charFrac } from './game.js';
import { MOVE, topSpeed } from './player.js';
import { LUZ, phys } from './world.js';
import { state, cuenta } from './zombies.js'; import { R } from './ruido.js'; import { P } from './percepcion.js'; import { VIVO } from './test.js';
export const DEBUG=new URLSearchParams(location.search).has('debug');
let el,t0=0,last=0,frames=0,acc=0,shown=0,cpu=0,cpuMax=0,worst=0;const hist=[];let fps=0,worstWin=0,cpuWin=0;
let SYNC=null,syncT=0;
if(DEBUG){renderer.info.autoReset=false;
  el=document.createElement('div');el.style.cssText='position:fixed;top:44px;right:4px;z-index:99;pointer-events:none;font:11px/1.35 monospace;color:#9f9;background:rgba(0,0,0,.6);padding:4px 6px;border-radius:4px;white-space:pre-wrap;text-align:left;left:4px;box-sizing:border-box';
  document.body.appendChild(el);
  // Ajuste de cámara: altura (Y) y distancia hacia atrás (Z). Mueve OFF en vivo; el usuario dicta los números.
  const box=document.createElement('div');
  box.style.cssText='position:fixed;left:50%;top:230px;transform:translateX(-50%);width:58%;max-height:calc(100% - 250px);overflow-y:auto;z-index:99;font:13px/1.3 monospace;color:#fff;background:rgba(0,0,0,.55);padding:6px 10px;border-radius:8px';
  const row=(name,min,max,key)=>{const r=document.createElement('div');const l=document.createElement('span');
    const s=document.createElement('input');s.type='range';s.min=min;s.max=max;s.step=.1;s.value=OFF[key];s.style.cssText='width:100%;margin:2px 0 6px';
    const show=()=>{l.textContent=name+' '+Number(OFF[key]).toFixed(1);};show();
    s.oninput=()=>{OFF[key]=Number(s.value);show();info();};r.append(l,s);box.append(r);sync.push(()=>{s.value=OFF[key];show();info();});};const sync=[];
  const inf=document.createElement('div');inf.style.cssText='opacity:.8';box.append(inf);
  const info=()=>{inf.textContent='distancia '+Math.hypot(OFF.y,OFF.z).toFixed(1)+' · ángulo '+(Math.atan2(OFF.y,OFF.z)*57.3).toFixed(0)+'°';};
  row('Altura',2,30,'y');row('Atrás',0,20,'z');
  {const r=document.createElement('div'),l=document.createElement('span'),s=document.createElement('input');s.type='range';s.min=.3;s.max=2;s.step=.05;s.value=1;s.style.cssText='width:100%;margin:2px 0 6px';
   const show=()=>{const t=topSpeed();l.textContent='Velocidad ×'+MOVE.mult.toFixed(2)+' (máx '+(isFinite(t)?t.toFixed(1):'—')+')';};show();s.oninput=()=>{MOVE.mult=Number(s.value);show();};r.append(l,s);box.append(r);sync.push(()=>{s.value=MOVE.mult;show();});}
  const sl=(name,min,max,get,set,st=.05)=>{const r=document.createElement('div'),l=document.createElement('span'),s=document.createElement('input');s.type='range';s.min=min;s.max=max;s.step=st;s.value=get();s.style.cssText='width:100%;margin:2px 0 6px';
    const show=()=>{l.textContent=(typeof name==='function'?name():name)+' '+Number(get()).toFixed(2);};show();s.oninput=()=>{set(Number(s.value));show();};r.append(l,s);box.append(r);sync.push(()=>{s.value=get();show();});}; // al mostrar el panel se relee el valor real (las luces y el jugador se crean después que las barras)
  sl('Exposición',.3,1.6,()=>renderer.toneMappingExposure,v=>renderer.toneMappingExposure=v);
  sl('Sol',0,4,()=>LUZ.sun?LUZ.sun.intensity:0,v=>{if(LUZ.sun)LUZ.sun.intensity=v;});
  sl('Ambiente',0,2,()=>LUZ.hemi?LUZ.hemi.intensity:0,v=>{if(LUZ.hemi)LUZ.hemi.intensity=v;});
  sl('Velocidad al apuntar ×',.2,1,()=>MOVE.aim,v=>MOVE.aim=v);
  sl('Paso (cadencia)',.5,1.6,()=>MOVE.step,v=>MOVE.step=v);
  sl('Tamaño del personaje ×',.8,2.2,()=>MOVE.size,v=>MOVE.size=v);
  // Física (PAQ-02): se cambian en vivo y no se guardan. Masa y rozamiento son de la clase del último objeto golpeado.
  sl('kBala (empuje de bala)',0,10,()=>phys.params.kBala,v=>phys.params.kBala=v,.1);
  sl('Fuerza de granada',0,800,()=>phys.params.fGranada,v=>phys.params.fGranada=v,10);
  {const u=()=>phys.params.ultimo,ci=()=>u()&&phys.claseInfo(u());
   sl(()=>'Masa × de '+(u()||'(dispara a algo)'),.2,5,()=>ci()?ci().k:1,v=>{if(u())phys.setMasa(u(),v);},.1);
   sl(()=>'Rozamiento de '+(u()||'(dispara a algo)'),0,1.5,()=>ci()?ci().mu:.6,v=>{if(u())phys.setMu(u(),v);},.05);}
  // Ruido y zombis (PAQ-03): se cambian en vivo y no se guardan
  sl('Ruido: disparo (m)',0,60,()=>R.disparo,v=>R.disparo=v,1);sl('Ruido: andar (m)',0,10,()=>R.andar,v=>R.andar=v,.5);sl('Ruido: correr (m)',0,15,()=>R.correr,v=>R.correr=v,.5);
  sl('Vista de los zombis (m)',0,15,()=>P.vista,v=>P.vista=v,.5);sl('Velocidad zombis ×',.2,2.5,()=>P.velX,v=>P.velX=v,.05);
  SYNC=sync;info();
  // Paneles escondidos por defecto: un botón pequeño los muestra u oculta
  const btn=document.createElement('div');btn.textContent='📊';btn.style.cssText='position:fixed;top:max(12px,env(safe-area-inset-top));right:calc(max(12px,env(safe-area-inset-right)) + 46px);z-index:100;width:38px;height:38px;line-height:38px;text-align:center;font-size:18px;color:#fff;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.25);border-radius:50%;box-sizing:border-box';
  let on=false;const vis=()=>{el.style.display=on?'':'none';box.style.display=on?'':'none';if(on){sync.forEach(f=>f());requestAnimationFrame(()=>{box.style.top=(el.getBoundingClientRect().bottom+6)+'px';box.style.maxHeight='calc(100% - '+(el.getBoundingClientRect().bottom+16)+'px)';});}};vis(); // las barras van siempre debajo del texto, sin taparlo
  const tog=e=>{e.stopPropagation();e.preventDefault();on=!on;vis();};btn.addEventListener('touchstart',tog,{passive:false});btn.addEventListener('click',tog);
  document.body.appendChild(btn);
  for(const ev of ['pointerdown','touchstart','touchmove'])box.addEventListener(ev,e=>e.stopPropagation(),{passive:true});
  document.body.appendChild(box);}
let texT=0,texV=0; // memoria estimada de texturas en MB: ancho × alto × 4 bytes × 1,33 (mipmaps), de cada textura distinta de la escena; se recalcula cada 2 s
function texMB(){const n=performance.now();if(n-texT<2000)return texV;texT=n;const seen=new Set();let b=0;
  scene.traverse(o=>{if(!o.material)return;for(const m of [].concat(o.material))for(const k in m){const t=m[k];if(t&&t.isTexture&&!seen.has(t)){seen.add(t);const im=t.image;if(im&&im.width&&im.height)b+=im.width*im.height*4*(t.generateMipmaps||t.minFilter>1002?1.33:1);}}});
  texV=b/1048576;return texV;}
let sesN=0,sesT=0,ses40=0,ses30=0;const sesH=new Uint32Array(100); // cuadros, ms totales, ms pasados por debajo de 40 y de 30 fps, e histograma de ms por cuadro
function sesion(){if(sesN<60)return 'sesión: midiendo…';let k=Math.ceil(sesN*.01),b=99;while(b>0&&(k-=sesH[b])>0)b--; // b = ms del 1 % de cuadros más lentos
  return `sesión ${(sesT/60000).toFixed(1)} min: media ${(sesN*1000/sesT).toFixed(0)} fps · 1 % peor ${(1000/Math.max(b,1)).toFixed(0)} fps\n  tiempo bajo 40 fps: ${(ses40*100/sesT).toFixed(0)} % · bajo 30: ${(ses30*100/sesT).toFixed(0)} %`;}
export function debugStart(){if(!DEBUG)return;const n=performance.now();t0=n;
  if(last&&n>6000){const d=n-last;frames++;acc+=d;hist.push([n,d]);if(d>worst)worst=d;
    if(d<1000){sesN++;sesT+=d;if(d>25)ses40+=d;if(d>33.4)ses30+=d;sesH[Math.min(99,d|0)]++;}} // resumen de sesión (pausas de más de 1 s no cuentan: es salir de la página)
  last=n;renderer.info.reset();}
export function debugEnd(){if(!DEBUG)return;if(SYNC&&el&&el.style.display!=='none'&&performance.now()-syncT>500){syncT=performance.now();for(const f of SYNC)f();}const n=performance.now();cpu=n-t0;cpuMax=Math.max(cpuMax,cpu);
  while(hist.length&&n-hist[0][0]>5000)hist.shift();
  if(n-shown<500)return;shown=n;
  fps=acc?frames*1000/acc:0;frames=0;acc=0;
  worstWin=0;for(const h of hist)if(h[1]>worstWin)worstWin=h[1];
  const i=renderer.info,tri=i.render.triangles;
  el.style.color=fps<30?'#f88':fps<40||worstWin>33.4?'#fc6':'#9f9';
  el.textContent=`versión ${__BUILD__}\nfps ${fps.toFixed(0)}  (mín 30 · objetivo 40 · ideal 60)\npeor cuadro 5 s ${worstWin.toFixed(1)} ms (meta ≤33)\n${sesion()}\nCPU cuadro ${cpu.toFixed(1)} ms (máx ${cpuMax.toFixed(1)})\ntriángulos ${tri} (todas las pasadas)\nllamadas ${i.render.calls}\ngeometrías ${i.memory.geometries} · texturas ${i.memory.textures} · memoria texturas ≈ ${texMB().toFixed(1)} MB\nzombis vivos ${state.alive}${VIVO?(c=>` · D ${c.dormido} · ! ${c.despertando} · P ${c.persigue} · W ${c.deambula}`)(cuenta()):''}\ncámara ${Math.hypot(OFF.y,OFF.z).toFixed(1)} m · ${(Math.atan2(OFF.y,OFF.z)*57.3).toFixed(0)}° · personaje 1/${(1/Math.max(charFrac(),.001)).toFixed(1)} del alto`;
  cpuMax=0;}
