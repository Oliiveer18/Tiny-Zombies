// Prueba de carga gráfica (PAQ-G1): solo se carga con ?carga en la dirección. Mide en el propio móvil cuánta geometría,
// personajes animados, luces y opciones de calidad aguanta a ≥ 58 fps. No cambia ninguna opción por defecto del juego.
import * as THREE from 'three';
import { renderer, scene, setCalidad, calidadActual } from './renderer.js';
import { LUZ } from './world.js'; import { instance, play } from './assets.js'; import { explosion } from './effects.js';
import { player } from './player.js'; import { padState } from './gamepad.js';
const TRI=2000; // triángulos de cada objeto de la carga estática (icosaedro, detalle 9 = 20·10²)
const STR=(n,m)=>(i)=>(i*37)%m; // reparto fijo (37 es primo con 400 y con 80): sin Math.random, la prueba se repite igual
export function initCarga(){
  renderer.info.autoReset=false;
  const R=[];window.__carga=R;
  let step=null,cpuSum=0,n=0,tSum=0,worst=0,triSum=0,callSum=0,lastT=0,fase='espera',tFase=0,cola=[],fin=false,explT=0,mezc=[];
  // ---------- cargas ----------
  function tex(){const s=512,d=new Uint8Array(s*s*4);for(let y=0;y<s;y++)for(let x=0;x<s;x++){let h=Math.imul(x*7+y*131+1,2246822519);h^=h>>>13;h=Math.imul(h,3266489917);h^=h>>>16;const v=120+(h&63),i=(y*s+x)*4;d[i]=v;d[i+1]=v-10;d[i+2]=v-20;d[i+3]=255;}
    const t=new THREE.DataTexture(d,s,s);t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t;}
  const geoCarga=()=>{const N=Math.round(step.tris/TRI),g=new THREE.IcosahedronGeometry(.28,9),m=new THREE.MeshStandardMaterial({map:tex(),roughness:.8}),im=new THREE.InstancedMesh(g,m,N),o=new THREE.Object3D(),f=STR(N,400);
    for(let i=0;i<N;i++){const k=f(i);o.position.set(player.x-5+(k%20)*.53,.3,player.z-9+Math.floor(k/20)*.9);o.updateMatrix();im.setMatrixAt(i,o.matrix);}
    im.castShadow=im.receiveShadow=true;im.frustumCulled=false;scene.add(im);step.decl=N*TRI;return ()=>{scene.remove(im);g.dispose();m.map.dispose();m.dispose();im.dispose();};};
  const personajes=(N)=>{const f=STR(N,80),L=[];for(let i=0;i<N;i++){const k=f(i),c=instance('player');c.root.position.set(player.x-4.5+(k%8)*1.3,0,player.z-6.5+Math.floor(k/8)*1.3);play(c,'walk');c.mixer&&c.mixer.update(i*.037);scene.add(c.root);L.push(c);}
    mezc=L.filter(c=>c.mixer);step.mezcladores=mezc.length;return ()=>{for(const c of L)scene.remove(c.root);mezc=[];};};
  const luces=(N)=>{const L=[];for(let i=0;i<N;i++){const a=i/N*6.2832,l=new THREE.PointLight(0xffc890,40,9,2);l.position.set(player.x+Math.cos(a)*3.5,2.2,player.z+Math.sin(a)*5);scene.add(l);L.push(l);}return ()=>{for(const l of L)scene.remove(l);};};
  const explos=(N)=>{step.expl=N;explT=0;return ()=>{step.expl=0;};};
  const calidad=(c)=>{const a=calidadActual(),sh=LUZ.sun&&LUZ.sun.shadow,cs=LUZ.sun&&LUZ.sun.castShadow,ms=sh&&sh.mapSize.x;
    setCalidad(c);if(LUZ.sun){if(c.sombra===0)LUZ.sun.castShadow=false;else if(c.sombra){sh.mapSize.set(c.sombra,c.sombra);sh.map&&sh.map.dispose();sh.map=null;}}
    return ()=>{setCalidad(a);if(LUZ.sun){LUZ.sun.castShadow=cs;if(sh){sh.mapSize.set(ms,ms);sh.map&&sh.map.dispose();sh.map=null;}}};};
  // ---------- lista de escalones ----------
  const S=[];const add=(fam,nom,ap,extra)=>S.push({fam,nom,ap,...extra});
  add('base','base (mapa de prueba)',()=>()=>{});
  for(const k of [50,100,200,400,800])add('geo',k+'k tri estáticos',()=>geoCarga(),{tris:k*1000});
  for(const k of [10,20,40,60,80])add('per',k+' personajes',()=>personajes(k));
  for(const k of [2,4,8])add('luz',k+' luces puntuales',()=>luces(k));
  for(const k of [1,3])add('tra',k+' explosión/0,5 s',()=>explos(k));
  add('cal','res 3 + MSAA 4',()=>calidad({res:3,msaa:4}));
  add('cal','res 3 sin MSAA',()=>calidad({res:3,msaa:0}));
  add('cal','res 2 + sombra 2048',()=>calidad({res:2,msaa:4,sombra:2048}));
  add('cal','res 2 sin bloom',()=>calidad({res:2,msaa:4,bloomOn:false}));
  add('cal','res 2 sin sombras',()=>calidad({res:2,msaa:4,sombra:0}));
  add('comb','200k + 40 pers + 4 luces',()=>{const a=geoCarga(),b=personajes(40),c=luces(4);return ()=>{a();b();c();};},{tris:200000});
  // ---------- interfaz (PAQ-G1b) ----------
  // Estado único: 'inicio' | 'curso' | 'fin' | 'error'. Todo elemento lleva la clase «ui» para que input.js no se coma el toque.
  const VER=typeof __VER__!=='undefined'?__VER__:'',BUILD=typeof __BUILD__!=='undefined'?__BUILD__:'';
  const FAM={base:'Escena normal',geo:'Más objetos y detalle',per:'Personajes animados',luz:'Luces',tra:'Explosiones',cal:'Opciones de calidad',comb:'Todo a la vez'};
  const C={fondo:'#0e1116',texto:'#e8edf2',verde:'#3ecf6e',ambar:'#f5b942',rojo:'#ff5a5a',gris:'#8a94a0'};
  const SANS='-apple-system,system-ui,sans-serif';
  let est='inicio',salta={},wl=null,wallFrame=0,fpsN=0,fpsT=0,fpsPrev=[0,0],fpsAhora=null,errTxt=null;
  const UI=window.__cargaUI={estado:'inicio',paso:0,total:S.length,restante:null,fps:null,error:null};
  const el=(tag,css,txt,cls)=>{const e=document.createElement(tag);e.className='ui'+(cls?' '+cls:'');if(css)e.style.cssText=css;if(txt!=null)e.textContent=txt;return e;};
  const st=document.createElement('style');st.textContent='@keyframes cg-p{50%{opacity:.2}}.cg-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:'+C.verde+';animation:cg-p 1s infinite;vertical-align:middle}';document.head.appendChild(st);
  const btn=(t,f,principal)=>{const b=el('button','font:600 17px '+SANS+';min-height:48px;padding:0 22px;margin:6px 0;border-radius:12px;border:1px solid '+(principal?C.verde:'#ffffff40')+';background:'+(principal?C.verde:'transparent')+';color:'+(principal?'#06210f':C.texto)+';width:100%;max-width:340px',t);
    b.onclick=e=>{e.stopPropagation();f(b);};b.addEventListener('pointerdown',e=>e.stopPropagation());
    b.addEventListener('keydown',e=>{e.stopPropagation();if(e.code==='Enter'){e.preventDefault();if(!b.disabled)f(b);}}); // el juego usa Enter para empezar y cancelaría el clic
    return b;};
  const cab=()=>`Prueba de carga · ${VER}\npantalla ${innerWidth}×${innerHeight} · dpr ${devicePixelRatio} · ${innerHeight>=innerWidth?'vertical':'horizontal'}`;
  const pant=el('div','position:fixed;inset:0;z-index:200;background:'+C.fondo+';color:'+C.texto+';font:15px/1.4 '+SANS+';padding:max(14px,env(safe-area-inset-top)) max(14px,env(safe-area-inset-right)) max(14px,env(safe-area-inset-bottom)) max(14px,env(safe-area-inset-left));display:flex;flex-direction:column;align-items:center;overflow-y:auto;overflow-x:hidden;box-sizing:border-box');
  const panel=el('div','position:fixed;left:0;right:0;top:0;z-index:200;background:rgba(14,17,22,.88);color:'+C.texto+';font:13px/1.3 '+SANS+';padding:max(8px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) 8px max(12px,env(safe-area-inset-left));box-sizing:border-box;max-height:150px;overflow:hidden;pointer-events:none;display:none;font-variant-numeric:tabular-nums');
  const pCab=el('div','display:flex;justify-content:space-between;align-items:center'),pTit=el('div','font-weight:700;letter-spacing:.06em;color:'+C.verde),pCuenta=el('div','font:700 26px/1 '+SANS+';font-variant-numeric:tabular-nums');
  pTit.append(el('span','','','cg-dot'),document.createTextNode(' PRUEBA EN CURSO'));pCab.append(pTit,pCuenta);
  const pBarra=el('div','height:8px;border-radius:4px;background:#ffffff26;margin:7px 0 6px;overflow:hidden'),pRell=el('div','height:100%;width:0;background:'+C.verde);pBarra.append(pRell);
  const pPaso=el('div','font-weight:600'),pFase=el('div','font-size:12px;color:'+C.gris),pFps=el('div','font-weight:700;margin-top:3px');
  panel.append(pCab,pBarra,pPaso,pFase,pFps);document.body.append(pant,panel);
  const fmt=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
  function pinta(){ // actualiza el panel (como mucho 4 veces por segundo, desde un temporizador, no desde el bucle)
    if(est!=='curso')return;
    const now=performance.now(),pendientes=cola.filter(s=>!salta[s.fam]).length;let gast=0;
    if(step)gast=fase==='calentar'?(now-tFase)/1000:fase==='medir'?1+(now-tFase)/1000:0;gast=Math.min(4,Math.max(0,gast));
    const rest=Math.max(0,Math.ceil(pendientes*4+(step?4-gast:0))),prog=Math.min(1,(R.length+gast/4)/S.length);
    const paso=step?S.length-cola.length:S.length;
    pCuenta.textContent=fmt(rest);pRell.style.width=(prog*100).toFixed(1)+'%';
    pPaso.textContent=`Paso ${paso} de ${S.length}`+(step?' · '+step.nom:'');
    pFase.textContent=step?(FAM[step.fam]||'')+(fase==='calentar'?' (preparando)':' (midiendo)'):'';
    if(fpsT+fpsPrev[1]>0)fpsAhora=(fpsN+fpsPrev[0])*1000/(fpsT+fpsPrev[1]);fpsPrev=[fpsN,fpsT];fpsN=0;fpsT=0;
    pFps.textContent='FPS ahora: '+(fpsAhora==null?'…':Math.round(fpsAhora));pFps.style.color=fpsAhora==null?C.texto:fpsAhora>=58?C.verde:fpsAhora>=30?C.ambar:C.rojo;
    Object.assign(UI,{estado:est,paso,restante:rest,fps:fpsAhora==null?null:Math.round(fpsAhora),progreso:prog});
  }
  setInterval(()=>{pinta();if(est==='curso'&&!document.hidden&&performance.now()-wallFrame>8000)fallo('Bloqueo','La prueba se ha quedado parada en el paso «'+(step?step.nom:'?')+'». Cierra otras aplicaciones, quita el modo de bajo consumo y repítela.');},250);
  const pideWL=async()=>{try{if(navigator.wakeLock)wl=await navigator.wakeLock.request('screen');}catch(e){}};
  const sueltaWL=()=>{try{wl&&wl.release();}catch(e){}wl=null;};
  const cierra=()=>{location.href=location.href.replace(/([?&])carga(=[^&]*)?&?/,'$1').replace(/[?&]$/,'');};
  const tabla=(padre)=>{ // tabla de resultados: mismas columnas de siempre; textContent, nunca innerHTML
    const pre=el('pre','font:10.5px/1.3 ui-monospace,Menlo,Consolas,monospace;margin:8px 0 4px;white-space:pre;max-width:100%;overflow:hidden');
    const cabT=el('div','color:'+C.gris,'paso                     fps  peor  CPU    tri  llam');pre.append(cabT);
    for(const r of R){const nm=(r.nom+' '.repeat(24)).slice(0,24);let t,col;
      if(r.fps===null){t=nm+' —';col=C.gris;}else{t=`${nm} ${r.fps.toFixed(0).padStart(3)} ${r.peor.toFixed(0).padStart(5)} ${r.cpu.toFixed(1).padStart(5)} ${String(r.tri).padStart(6)} ${String(r.llam).padStart(4)}`;col=r.fps>=58&&r.peor<=25?C.verde:C.rojo;}
      pre.append(el('div','color:'+col,t));}
    padre.append(pre);};
  const textoPlano=()=>[cab(),...R.map(r=>r.fps===null?`${r.nom}: —`:`${r.nom}: ${r.fps.toFixed(0)} fps · peor ${r.peor.toFixed(0)} ms · CPU ${r.cpu.toFixed(1)} · ${r.tri} tri · ${r.llam} llam`)].join('\n');
  const botonesFin=()=>{const caja=el('div','display:flex;flex-direction:column;align-items:center;width:100%;margin-top:6px');
    caja.append(btn('Repetir prueba',repite,true),btn('Copiar resultados',async b=>{let ok=false;try{await Promise.race([navigator.clipboard.writeText(textoPlano()),new Promise((_,no)=>setTimeout(no,1500))]);ok=true;}catch(e){}
      b.textContent=ok?'Copiado ✔':'No se pudo copiar';setTimeout(()=>{b.textContent='Copiar resultados';},2000);}),btn('Cerrar',cierra));return caja;};
  const cabecera=()=>{const c=el('div','font:11px/1.35 ui-monospace,Menlo,monospace;color:'+C.gris+';white-space:pre;text-align:center',cab());return c;};
  function pantalla(){ // pinta inicio / fin / error en pantalla completa
    pant.replaceChildren();panel.style.display='none';pant.style.display='flex';pant.style.justifyContent='flex-start';pant.scrollTop=0;
    if(est==='inicio'){
      pant.style.justifyContent='center';
      const t=el('div','font:700 28px/1.2 '+SANS+';margin-bottom:6px','Prueba de carga');
      const info=el('div','font:12px/1.4 ui-monospace,Menlo,monospace;color:'+C.gris+';white-space:pre;text-align:center;margin-bottom:22px',VER+' · '+BUILD+'\npantalla '+innerWidth+'×'+innerHeight+' · dpr '+devicePixelRatio+' · '+(innerHeight>=innerWidth?'vertical':'horizontal'));
      const l=el('div','text-align:center;margin-bottom:24px;font-size:16px;line-height:1.7;max-width:340px','Dura unos 90 segundos\nNo toques la pantalla mientras dura\nQuita el modo de bajo consumo');l.style.whiteSpace='pre-line';
      const b=btn('Iniciar prueba',()=>{b.textContent='Prueba en curso…';b.disabled=true;b.style.opacity='.7';arranca();},true);b.style.minHeight='60px';b.style.fontSize='20px';
      pant.append(t,info,l,b);return;}
    const ok=est==='fin';
    pant.append(el('div','font:700 '+(ok?22:20)+'px/1.2 '+SANS+';color:'+(ok?C.verde:C.rojo)+';text-align:center;margin-top:2px',ok?'✔ Prueba completada':errTxt.titulo));
    pant.append(el('div','text-align:center;font-size:13px;margin:6px 0 6px;max-width:350px',ok?'Haz una captura de esta pantalla y envíasela a Fable.':errTxt.texto));
    if(ok||R.length){pant.append(cabecera());tabla(pant);}
    pant.append(botonesFin());}
  function arranca(){ // empieza (o repite) la prueba
    try{step&&step.quita&&step.quita();}catch(e){}
    R.length=0;cola=S.slice();salta={};fin=false;step=null;mezc=[];explT=0;lastT=0;fase='espera';errTxt=null;UI.error=null;
    fpsN=fpsT=0;fpsPrev=[0,0];fpsAhora=null;wallFrame=performance.now();est='curso';padState.start=true;
    pant.style.display='none';pant.replaceChildren();panel.style.display='block';pideWL();sigue();pinta();}
  const repite=()=>arranca();
  function fallo(titulo,texto){ // interrupción o error: retira la carga, restaura la calidad y muestra qué hacer
    if(est!=='curso')return;
    try{step&&step.quita&&step.quita();}catch(e){}
    if(step)step.quita=null;step=null;cola=[];mezc=[];fase='fin';sueltaWL();
    errTxt={titulo,texto};UI.error=texto;est='error';UI.estado=est;pantalla();}
  const nomPaso=()=>step?step.nom:'?';
  document.addEventListener('visibilitychange',()=>{if(est==='curso'&&document.hidden)fallo('Prueba interrumpida','La prueba se ha interrumpido porque la pantalla se apagó o cambiaste de aplicación. Repítela sin salir del juego.');});
  renderer.domElement.addEventListener('webglcontextlost',()=>{if(est==='curso')fallo('Sin memoria gráfica','El móvil se ha quedado sin memoria gráfica en el paso «'+nomPaso()+'». Es un resultado útil: haz una captura y envíala. Para repetir, cierra otras aplicaciones y recarga la página.');});
  const msgErr=e=>e&&(e.message||(e.reason&&(e.reason.message||String(e.reason)))||e.error&&e.error.message)||'error desconocido';
  addEventListener('error',e=>{if(est==='curso')fallo('Error en la prueba','Ha fallado el paso «'+nomPaso()+'»: '+msgErr(e)+'. Haz una captura y envíala a Fable. Puedes repetir la prueba.');});
  addEventListener('unhandledrejection',e=>{if(est==='curso')fallo('Error en la prueba','Ha fallado el paso «'+nomPaso()+'»: '+msgErr(e)+'. Haz una captura y envíala a Fable. Puedes repetir la prueba.');});
  pantalla();
  function sigue(){ // empieza el siguiente escalón
    if(step&&step.quita){step.quita();step.quita=null;}
    step=cola.shift();if(!step){fin=true;fase='fin';est='fin';UI.estado=est;UI.paso=S.length;UI.restante=0;sueltaWL();pantalla();return;}
    if(salta[step.fam]){R.push({fam:step.fam,nom:step.nom,fps:null});step=null;return sigue();}
    try{step.quita=step.ap();}catch(e){fallo('Error en la prueba','Ha fallado el paso «'+step.nom+'»: '+msgErr(e)+'. Haz una captura y envíala a Fable. Puedes repetir la prueba.');return;}
    fase='calentar';tFase=performance.now();n=0;cpuSum=0;tSum=0;worst=0;triSum=0;callSum=0;}
  // ---------- bucle (lo llama main.js en lugar de frame) ----------
  return {frame(dt,f){
    const t0=performance.now();renderer.info.reset();wallFrame=t0;
    if(step&&step.expl){explT-=dt;if(explT<=0){explT=.5;for(let i=0;i<step.expl;i++)explosion(player.x-2+i*2,player.z-3+i);}}
    for(const c of mezc)c.mixer.update(dt);
    f(dt);const t1=performance.now(),d=lastT?t0-lastT:16.7;lastT=t0;
    if(est==='curso'){fpsN++;fpsT+=d;}
    if(!step||fin)return;
    if(fase==='calentar'){if(t1-tFase>1000){fase='medir';tFase=t1;}return;}
    if(fase==='medir'){n++;tSum+=d;if(d>worst)worst=d;cpuSum+=t1-t0;triSum+=renderer.info.render.triangles;callSum+=renderer.info.render.calls;
      if(t1-tFase>3000){const r={fam:step.fam,nom:step.nom,fps:n*1000/tSum,peor:worst,cpu:cpuSum/n,tri:Math.round(triSum/n),llam:Math.round(callSum/n),declarados:step.decl,mezcladores:step.mezcladores};R.push(r);
        // si un escalón baja de 30 fps no se prueban los superiores de su familia
        if(r.fps<30&&step.fam!=='cal'&&step.fam!=='base')salta[step.fam]=true;sigue();}}
  }};
}
