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
  const R=[],cargas=[];window.__carga=R;
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
  // ---------- interfaz ----------
  const ui=document.createElement('div');ui.style.cssText='position:fixed;inset:0;z-index:200;background:#000;color:#fff;font:11px/1.35 monospace;padding:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;white-space:pre;text-align:left;overflow:auto';
  const btn=(t,f)=>{const b=document.createElement('button');b.textContent=t;b.style.cssText='font:16px sans-serif;padding:14px 26px;margin:8px;border-radius:10px;border:1px solid #fff6;background:#2a5;color:#fff';b.onclick=e=>{e.stopPropagation();f();};b.addEventListener('pointerdown',e=>e.stopPropagation());return b;};
  const txt=document.createElement('div');ui.append(txt);document.body.appendChild(ui);
  const ini=btn('Iniciar prueba',()=>{ui.style.display='none';ini.remove();padState.start=true;cola=S.slice();salta={};sigue();});
  const cab=()=>`PRUEBA DE CARGA · ${typeof __BUILD__!=='undefined'?__BUILD__:''}\npantalla ${innerWidth}×${innerHeight} · dpr ${devicePixelRatio} · ${innerHeight>=innerWidth?'vertical':'horizontal'}`;
  txt.textContent=cab()+'\n\nDuración ≈ 90 s. No toques la pantalla.\nMóvil sin modo de bajo consumo.';ui.append(ini);
  let salta={};
  const barra=document.createElement('div');barra.style.cssText='position:fixed;left:6px;top:6px;z-index:201;color:#ff0;font:11px monospace;background:#0008;padding:2px 6px;border-radius:4px;display:none';document.body.appendChild(barra);
  function sigue(){ // empieza el siguiente escalón
    if(step&&step.quita){step.quita();step.quita=null;}
    step=cola.shift();if(!step){fin=true;fase='fin';barra.style.display='none';muestra();return;}
    if(salta[step.fam]){R.push({fam:step.fam,nom:step.nom,fps:null});step=null;return sigue();}
    step.quita=step.ap();fase='calentar';tFase=performance.now();n=0;cpuSum=0;tSum=0;worst=0;triSum=0;callSum=0;barra.style.display='';barra.textContent='probando: '+step.nom+' ('+(S.length-cola.length)+'/'+S.length+')';}
  function muestra(){
    const L=[cab(),'','paso                     fps  peor  CPU    tri  llam'];
    for(const r of R){const nm=(r.nom+' '.repeat(24)).slice(0,24);if(r.fps===null){L.push(`<span style="color:#aaa">${nm} —</span>`);continue;}
      const ok=r.fps>=58&&r.peor<=25;L.push(`<span style="color:${ok?'#6f6':'#f66'}">${nm} ${r.fps.toFixed(0).padStart(3)} ${r.peor.toFixed(0).padStart(5)} ${r.cpu.toFixed(1).padStart(5)} ${String(r.tri).padStart(6)} ${String(r.llam).padStart(4)}</span>`);}
    txt.innerHTML=L.join('\n').replace(/\n/g,'\n');ui.style.display='flex';ui.style.justifyContent='flex-start';
    const plano=[cab(),...R.map(r=>r.fps===null?`${r.nom}: —`:`${r.nom}: ${r.fps.toFixed(0)} fps · peor ${r.peor.toFixed(0)} ms · CPU ${r.cpu.toFixed(1)} · ${r.tri} tri · ${r.llam} llam`)].join('\n');
    ui.append(btn('Copiar',()=>{try{navigator.clipboard.writeText(plano);}catch(e){}}),btn('Cerrar',()=>{location.href=location.href.replace(/([?&])carga(=[^&]*)?&?/,'$1').replace(/[?&]$/,'');}));}
  // ---------- bucle (lo llama main.js en lugar de frame) ----------
  return {frame(dt,f){
    const t0=performance.now();renderer.info.reset();
    if(step&&step.expl){explT-=dt;if(explT<=0){explT=.5;for(let i=0;i<step.expl;i++)explosion(player.x-2+i*2,player.z-3+i);}}
    for(const c of mezc)c.mixer.update(dt);
    f(dt);const t1=performance.now(),d=lastT?t0-lastT:16.7;lastT=t0;
    if(!step||fin)return;
    if(fase==='calentar'){if(t1-tFase>1000){fase='medir';tFase=t1;}return;}
    if(fase==='medir'){n++;tSum+=d;if(d>worst)worst=d;cpuSum+=t1-t0;triSum+=renderer.info.render.triangles;callSum+=renderer.info.render.calls;
      if(t1-tFase>3000){const r={fam:step.fam,nom:step.nom,fps:n*1000/tSum,peor:worst,cpu:cpuSum/n,tri:Math.round(triSum/n),llam:Math.round(callSum/n),declarados:step.decl,mezcladores:step.mezcladores};R.push(r);
        // si un escalón baja de 30 fps no se prueban los superiores de su familia
        if(r.fps<30&&step.fam!=='cal'&&step.fam!=='base')salta[step.fam]=true;sigue();}}
  }};
}
