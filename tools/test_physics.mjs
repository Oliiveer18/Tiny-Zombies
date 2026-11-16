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
