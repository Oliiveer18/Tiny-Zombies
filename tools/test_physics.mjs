// Prueba de la física sin navegador: node tools/test_physics.mjs (determinismo tras 600 pasos y coste por paso con ~24 activos)
import {createPhysics} from '../src/physics.js';
import fs from 'node:fs';
const mats=JSON.parse(fs.readFileSync(new URL('../src/data/materiales.json',import.meta.url))),objs=JSON.parse(fs.readFileSync(new URL('../src/data/objetos.json',import.meta.url)));
function run(){
  const ph=createPhysics(mats,objs);ph.addBox('wall',0,-10,6,.5,0);
  const mk=(id,key,x,z,rot)=>ph.addProp({id,key,x,z,rot});
  const crate=mk('p0','crate',0,-3,0.3),barrel=mk('p1','barrel',2,-3,0),barrier=mk('p2','barrier',-2,-3,0),car=mk('p3','car',4,-6,1.2),sack=mk('p4','sack',-4,-3,0);
  for(let i=0;i<600;i++){
    if(i%8===0&&i<100){ph.hit(crate,0,-1,crate.x+.2,crate.z);ph.hit(barrel,0,-1,barrel.x+.1,barrel.z);ph.hit(barrier,0,-1,barrier.x,barrier.z);ph.hit(car,0,-1,car.x,car.z);}
    if(i===150)ph.blast(0,-1,7,400);
    ph.step(1/60);
  }
  return {st:ph.state(),b:{crate:[crate.x,crate.z],barrel:[barrel.x,barrel.z],barrier:[barrier.x,barrier.z],car:[car.x,car.z]},crate};
}
const a=run(),b=run();
console.log('determinista:',a.st===b.st);
for(const[k,v]of Object.entries(a.b))console.log(k,v.map(x=>+x.toFixed(2)));
// rendimiento: 24 activos
const ph=createPhysics(mats,objs);let seed=12345;const rnd=()=>(seed=(Math.imul(seed,1103515245)+12345)&0x7fffffff)/0x7fffffff;
ph.addBox('w1',0,-12,10,.5,0);ph.addBox('w2',0,12,10,.5,0);ph.addBox('w3',-10,0,.5,12,0);ph.addBox('w4',10,0,.5,12,0);
const keys=['crate','barrel','sack','crate','barrel'];
for(let i=0;i<48;i++){const k=keys[i%5];const b=ph.addProp({id:'q'+i,key:k,x:(rnd()-.5)*16,z:(rnd()-.5)*16,rot:rnd()*6});}
for(const b of ph.bodies)if(!b.statico){b.vx=(rnd()-.5)*8;b.vz=(rnd()-.5)*8;b.asleep=false;b.w=(rnd()-.5)*4;}
let t0=process.hrtime.bigint(),steps=0,maxAct=0;
for(let i=0;i<300;i++){ph.step(1/60);steps++;maxAct=Math.max(maxAct,ph.bodies.filter(b=>!b.statico&&!b.asleep).length);}
const ms=Number(process.hrtime.bigint()-t0)/1e6/steps;
console.log('ms por paso (hasta',maxAct,'activos, 52 cuerpos):',ms.toFixed(3));
// ---- PAQ-02: reja con bisagra, empujón y barras ----
{
  const mk=()=>{const p=createPhysics(mats,objs);const L=p.addHinge({id:'reja_i',clase:'reja_hoja',pivote:[-1.5,-17],largo:1.5,candado:'cand1'}),R=p.addHinge({id:'reja_d',clase:'reja_hoja',pivote:[1.5,-17],largo:1.5,candado:'cand1'});return {p,L,R};};
  // 1. con candado la hoja no se mueve, por muchos impulsos que reciba
  {const {p,L}=mk();for(let i=0;i<120;i++){p.hingeHit(L,0,-1,-.8,-17);p.step(1/60);}console.log('hoja con candado: a =',L.a.toFixed(4),'(esperado 0)',L.a===0?'OK':'FALLO');}
  // 2. sin candado una bala la mueve (unos 14°) y no pasa de 100°
  {const {p,L}=mk();L.candado=false;p.hingeHit(L,0,-1,-.8,-17);for(let i=0;i<180;i++)p.step(1/60);console.log('una bala sin candado: a =',(L.a*57.3).toFixed(1),'°');
   for(let i=0;i<40;i++){p.hingeHit(L,0,-1,-.8,-17);p.step(1/60);}for(let i=0;i<300;i++)p.step(1/60);console.log('muchas balas: a =',(L.a*57.3).toFixed(1),'° (máx 100)',L.a<=1.7454?'OK':'FALLO');}
  // 3. abrir (w=5): ≥ 90° en ≤ 1,2 s
  {const {p,L}=mk();L.candado=false;L.w=5;let t=0;while(L.a<1.5708&&t<120){p.step(1/60);t++;}console.log('abrir: 90° en',(t/60).toFixed(2),'s',t<=72?'OK':'FALLO');}
  // 4. determinismo con bisagras (misma secuencia → mismo estado)
  {const run=()=>{const {p,L,R}=mk();const c=p.addProp({id:'c',key:'crate',x:0,z:-14,rot:0});for(let i=0;i<400;i++){if(i===10)L.candado=R.candado=false;if(i%20===0)p.hingeHit(L,.2,-.98,-.8,-17);if(i===100)p.impulse(c,0,-1,60);p.step(1/60);}return p.state();};console.log('determinista con bisagras:',run()===run()?'OK':'FALLO');}
  // 5. empujón de 60 kg·m/s a una caja de 15 kg: recorrido 1,0-1,6 m
  {const p=createPhysics(mats,objs);const c=p.addProp({id:'c',key:'crate',x:0,z:0,rot:0});p.impulse(c,0,-1,60);for(let i=0;i<240;i++)p.step(1/60);console.log('empujón a caja de 15 kg:',Math.abs(c.z).toFixed(2),'m',Math.abs(c.z)>=1&&Math.abs(c.z)<=1.6?'OK':'FALLO');}
  // 6. barra kBala: con kBala=0 la bala no mueve; con 10 sí
  {const r=k=>{const p=createPhysics(mats,objs);p.params.kBala=k;const c=p.addProp({id:'c',key:'crate',x:0,z:0,rot:0});p.hit(c,0,-1,0,.3);for(let i=0;i<120;i++)p.step(1/60);return Math.abs(c.z);};console.log('kBala 0 →',r(0).toFixed(2),'m · kBala 10 →',r(10).toFixed(2),'m',r(0)<.01&&r(10)>.05?'OK':'FALLO');}
  // 7. masa ×2 y rozamiento de la clase
  {const p=createPhysics(mats,objs);const c=p.addProp({id:'c',key:'crate',x:0,z:0,rot:0});p.setMasa('crate',2);p.setMu('crate',1);p.impulse(c,0,-1,60);for(let i=0;i<240;i++)p.step(1/60);console.log('caja masa×2 y mu 1: recorrido',Math.abs(c.z).toFixed(2),'m (menos que 1,0)',Math.abs(c.z)<1?'OK':'FALLO');}
}
// ---- PAQ-02: «Usar» (usar.js) con la simulación real, sin navegador ----
{
  const U=await import('../src/usar.js');
  const mkw=()=>{const phys=createPhysics(mats,objs),props=[];const add=(id,key,x,z,rot,r)=>{const p={id,key,x,z,r:r||.5,rot,dead:false,vida:objs[key].vida||Infinity};p.body=phys.addProp(p);props.push(p);return p;};
    U.ruido.length=0;U.ordenes.length=0;U.initUsar({props,OBJ:objs,phys,damageProp:(p)=>{p.dead=true;}});return {phys,props,add};};
  const J=(x,z,ax,az,mueve=false,extra={})=>({id:'j1',x,z,ax,az,mueve,mx:mueve?ax:0,mz:mueve?az:0,dispara:false,...extra});
  const avanza=(w,j,e,s)=>{for(let i=0;i<s*60;i++){U.tickUsar(1/60,j,e);w.phys.step(1/60);}};
  // objetivo: más cercano, ±60°, empate → menor id
  {const w=mkw();w.add('b','crate',0,-1.2,0);w.add('a','crate',0,-1.2,0);w.add('c','crate',3,0,0);let o=U.tickUsar(1/60,J(0,0,0,-1),{hold:false});console.log('objetivo (empate → menor id):',o.id,o.id==='a'?'OK':'FALLO');
    o=U.tickUsar(1/60,J(0,0,0,1),{hold:false});console.log('apuntando al lado contrario: objetivo',o.id,o.id===null?'OK':'FALLO');
    o=U.tickUsar(1/60,J(0,0,-.5,-.87),{hold:false});console.log('a 30° del objetivo:',o.id?'visible OK':'FALLO');
    o=U.tickUsar(1/60,J(0,0,-.95,-.31),{hold:false});console.log('a 72° del objetivo:',o.id===null?'no visible OK':'FALLO');}
  // empujar: orden → 60 kg·m/s, ruido 4 m
  {const w=mkw(),c=w.add('p0','crate',0,-1.2,0,.5);U.tickUsar(1/60,J(0,0,0,-1),{hold:false});U.ordenes.push({t:'usar',j:'j1',obj:'p0',verbo:'empujar'});avanza(w,J(0,0,0,-1),{hold:false},.1);const r4=U.ruido.map(r=>r.radio).join();avanza(w,J(0,0,0,-1),{hold:false},2.9);
    console.log('orden empujar: caja avanza',Math.abs(c.body.z+1.2).toFixed(2),'m · ruido',r4,Math.abs(c.body.z+1.2)>1&&r4==='4'?'OK':'FALLO');
    U.ruido.length=0;U.ordenes.push({t:'usar',j:'j1',obj:'p0',verbo:'forzar'});avanza(w,J(0,0,0,-1),{hold:false},.2);console.log('orden con verbo no permitido: ignorada',U.ruido.length===0?'OK':'FALLO');
    U.ordenes.push({t:'usar',j:'j1',obj:'p0',verbo:'empujar'});avanza(w,J(0,9,0,-1),{hold:false},.1);console.log('orden desde lejos: ignorada',U.ruido.length===0?'OK':'FALLO');}
  // arrastrar: 1,4-1,8 m en 2 s, ruido 5
  {const w=mkw(),c=w.add('p1','contenedor',0,-2.5,1.57,1.4);const z0=c.body.z;U.tickUsar(1/60,J(0,-.2,0,-1,true),{hold:true});U.ordenes.push({t:'usar',j:'j1',obj:'p1',verbo:'arrastrar'});avanza(w,J(0,-.2,0,-1,true),{hold:true},2);
    console.log('arrastrar 2 s: contenedor',Math.abs(c.body.z-z0).toFixed(2),'m · ruido',[...new Set(U.ruido.map(r=>r.radio))].join(),(Math.abs(c.body.z-z0)>=1.4&&Math.abs(c.body.z-z0)<=1.8)?'OK':'FALLO');
    const z1=c.body.z;avanza(w,J(0,-.2,0,-1,true),{hold:false},1);console.log('soltar: se frena',Math.abs(c.body.z-z1)<.3?'OK':'FALLO');}
  // forzar: 4 s con el candado; se cancela al moverse; ruido 8
  {const w=mkw(),cand=w.add('cand1','candado',0,-1.6,0,.15);const h=w.phys.addHinge({id:'reja_i',clase:'reja_hoja',pivote:[-1.5,-1.6],largo:1.5,candado:'cand1'});h.vida=40;
    U.tickUsar(1/60,J(-.4,0,0,-1),{hold:false});const id=U.objetivo.id;U.ordenes.push({t:'usar',j:'j1',obj:id,verbo:'forzar'});avanza(w,J(-.4,0,0,-1),{hold:true},3.5);console.log('forzar 3,5 s: candado sigue',!cand.dead?'OK':'FALLO','· progreso',U.objetivo.prog.toFixed(2));
    avanza(w,J(-.4,0,0,-1),{hold:true},.7);console.log('forzar 4,2 s: candado roto',cand.dead?'OK':'FALLO','· ruido',[...new Set(U.ruido.map(r=>r.radio))].join());
    cand.dead=false;U.ordenes.push({t:'usar',j:'j1',obj:id,verbo:'forzar'});avanza(w,J(-.4,0,0,-1),{hold:true},2);avanza(w,J(.2,0,0,-1),{hold:true},3);console.log('moverse >0,3 m cancela',!cand.dead?'OK':'FALLO');
    // abrir (sin candado): ≥90° en ≤1,2 s
    h.candado=false;U.ordenes.push({t:'usar',j:'j1',obj:id,verbo:'abrir'});let t=0;while(h.a<1.5708&&t<120){U.tickUsar(1/60,J(-.4,0,0,-1),{hold:false});w.phys.step(1/60);t++;}console.log('abrir: 90° en',(t/60).toFixed(2),'s ·',[...new Set(U.ruido.map(r=>r.radio))].join(),t<=72?'OK':'FALLO');}
  // el ruido caduca a los 2 s
  {const w=mkw();U.sonido(0,0,30,'j1');avanza(w,J(0,0,0,-1),{hold:false},1.5);const a=U.ruido.length;avanza(w,J(0,0,0,-1),{hold:false},.8);console.log('ruido: a 1,5 s',a,'entrada · a 2,3 s',U.ruido.length,a===1&&U.ruido.length===0?'OK':'FALLO');}
}
