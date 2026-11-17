import * as THREE from 'three';
import { TEST, LAYOUT } from './test.js'; import { buildAlley } from './alley.js'; import { createPhysics } from './physics.js'; import MAT from './data/materiales.json'; import OBJ from './data/objetos.json'; export {OBJ}; import { impact } from './effects.js'; import { spawnDebris } from './debris.js'; import { bulletMark } from './decals.js'; import { propSource } from './assets.js'; import { mulberry, WORLD_SEED } from './sim.js'; import { initUsar, sonido, objetivo } from './usar.js';
import { R, configuraRuido } from './ruido.js'; import RUIDO from './data/ruido.json';
export const LUZ={}; // luces ajustables en vivo desde ?debug
export const obstacles=[]; export const props=[]; export const FIELD=40;
export const hooks={boom:null}; // lo rellena weapons.js (explosión de bidón)
export const phys=createPhysics(MAT,OBJ);configuraRuido(RUIDO.radios,()=>phys.tick());const PROPIO={candado:1}; // clases que dibuja alley.js (no usan malla instanciada)
let aroO=null,aroP=null; const dyn={}; const dummy=new THREE.Object3D(); dummy.rotation.order='YXZ'; const mm=new THREE.Matrix4();
export function buildWorld(scene,q){
  scene.background=new THREE.Color(0x9cc4e4); scene.fog=null; // sin niebla por decisión del usuario (16 nov). DÍA provisional (noche de Tiny: fondo/niebla 0x070b16)
  LUZ.hemi=new THREE.HemisphereLight(0xdcebff,0x6a6650,0.75); scene.add(LUZ.hemi);
  const sun=new THREE.DirectionalLight(0xfff0d2,1.5); LUZ.sun=sun; sun.position.set(-14,26,10); sun.castShadow=true;
  const s=sun.shadow; s.mapSize.set(q.shadow,q.shadow); const e=20; Object.assign(s.camera,{left:-e,right:e,top:e,bottom:-e,far:80}); s.bias=-0.0004; s.radius=3;
  scene.add(sun,sun.target);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(FIELD*2,FIELD*2),new THREE.MeshStandardMaterial({color:0x6f8a4e,roughness:1}));
  ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);
  initUsar({props,OBJ,phys,damageProp});
  {const g=new THREE.RingGeometry(.9,1,40);g.rotateX(-Math.PI/2);aroO=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.8,depthWrite:false}));
   const g2=new THREE.CircleGeometry(.9,32);g2.rotateX(-Math.PI/2);aroP=new THREE.Mesh(g2,new THREE.MeshBasicMaterial({color:0x6cf0ff,transparent:true,opacity:.5,depthWrite:false}));
   for(const m of [aroO,aroP]){m.visible=false;m.renderOrder=3;scene.add(m);}} // aro blanco bajo el objetivo de «Usar» y, al forzar, un disco que crece
  const plan={fence:26,barrel:14,barrier:12,crate:16,sack:14,car:5}; const rnd=mulberry(WORLD_SEED);
  if(TEST){for(const k in plan)delete plan[k];for(const a of LAYOUT.props)plan[a[0]]=(plan[a[0]]||0)+1;} // mapa de prueba: solo lo de la lista
  for(const [key,n] of Object.entries(plan)){ if(!n)continue; const fixed=TEST?LAYOUT.props.filter(a=>a[0]===key):null;
    const def=OBJ[key]||{},{c,meshes}=PROPIO[key]?{c:{},meshes:[]}:propSource(def.modelo||key);
    dyn[key]=meshes.map(m=>{const im=new THREE.InstancedMesh(m.geometry,m.material,n);im.castShadow=im.receiveShadow=true;im.frustumCulled=false;scene.add(im);return {im,m};});
    for(let i=0;i<n;i++){let x,z;if(fixed){x=fixed[i][1];z=fixed[i][2];}else do{x=(rnd()-.5)*FIELD*1.7;z=(rnd()-.5)*FIELD*1.7;}while(Math.hypot(x,z)<5);
      const p={id:(fixed&&fixed[i][4])||'p'+props.length,key,x,z,r:def.r||c.radius||.5,vida:def.vida||Infinity,lie:0,dead:false,idx:i,rot:fixed?fixed[i][3]:rnd()*6.28,y:0,tx:0,vx:0,vy:0,vz:0,vr:0,fly:false}; props.push(p);obstacles.push(p);phys.addProp(p);sync(p);}
  }
  if(TEST)buildAlley(scene,ground); // callejón: muros, luz de atardecer y farolas
  return sun;
}
function sync(p){
  if(!dyn[p.key]||!dyn[p.key].length)return;const d=OBJ[p.key]||{};let px=p.x,py=p.y,pz=p.z,pitch=p.tx;
  if(p.lie>0&&d.alto){const t=p.lie*Math.PI/2,s=Math.sin(t),c=Math.cos(t),h2=d.alto/2,rl=d.hl||.3, // acostado: gira alrededor de su centro, no de la base
    oy=h2*(1-s)+rl*s-h2*c,oz=-h2*s;py+=oy;px+=oz*Math.sin(p.rot);pz+=oz*Math.cos(p.rot);pitch+=t;}
  dummy.position.set(px,py,pz); dummy.rotation.set(pitch,p.rot,0); dummy.scale.setScalar(p.dead?0:(d.escala||1)); dummy.updateMatrix();
  for(const {im,m} of dyn[p.key]){mm.multiplyMatrices(dummy.matrix,m.matrixWorld);im.setMatrixAt(p.idx,mm);im.instanceMatrix.needsUpdate=true;}
}
export function crearHoja(def){ // reja con bisagra: estado en physics.js, colisión con círculos que siguen la hoja
  const h=phys.addHinge(def);if(!h)return null;const o=OBJ[def.clase];
  for(let k=0;k<5;k++){const ob={id:'o_'+def.id+'_'+k,key:def.clase,x:h.px,z:h.pz,r:.18,fly:false,wall:true,hoja:h,k};obstacles.push(ob);h.obs.push(ob);}
  moverObs(h);return h;}
function moverObs(h){for(const ob of h.obs){const t=(ob.k+.5)*h.largo/5;ob.x=h.px+h.dx*t;ob.z=h.pz+h.dz*t;}}
export function damageHoja(h,n){if(h.roto)return;h.vida-=n;if(h.vida>0)return;h.roto=true;phys.remove(h.body);
  for(const ob of h.obs){const i=obstacles.indexOf(ob);if(i>=0)obstacles.splice(i,1);}
  const cx=h.px+h.dx*h.largo/2,cz=h.pz+h.dz*h.largo/2;spawnDebris(cx,cz,'barrote',(MAT.metal||{}).hex||0x2e4a3a,OBJ[h.clase].rompe.n);sonido(cx,cz,R.reja_rota,'mundo');}
export function updateProps(dt){
  phys.step(dt);for(const h of phys.hinges)if(!h.roto)moverObs(h);
  if(aroO){const on=!!objetivo.id;aroO.visible=on;aroP.visible=on&&objetivo.prog>0;if(on){aroO.position.set(objetivo.x,.05,objetivo.z);aroO.scale.setScalar(objetivo.r);aroP.position.set(objetivo.x,.05,objetivo.z);aroP.scale.setScalar(Math.max(.01,objetivo.r*objetivo.prog));}} // física propia (src/physics.js): se mueve lo que se despierta; lo dormido no cuesta nada
  for(const b of phys.bodies){const p=b.prop;if(!p)continue;const lying=b.tumbado&&p.lie<1;if(!b.dirty&&!lying)continue;
    if(lying)p.lie=Math.min(1,p.lie+dt*4);
    p.x=b.x;p.z=b.z;p.y=b.y;p.rot=Math.atan2(-b.cz,b.cx);p.fly=b.y>.15; // fly: en el aire (como antes) no choca ni para balas
    p.tx=b.y>.02?p.tx+b.w*.5*dt:p.tx*Math.max(0,1-dt*8); // giro de volteo solo visual
    sync(p);if(b.asleep&&!lying){b.dirty=false;p.tx=0;sync(p);}}
}
const matOf=p=>p.mat||(OBJ[p.key]&&OBJ[p.key].mat)||(p.key==='wall'?'hormigon':null);
function breakProp(p){ // rotura: sale de la partida, quedan trozos y, si explota, una explosión
  if(p.dead)return;p.dead=true;sonido(p.x,p.z,p.key==='candado'?R.candado_roto:R.objeto_roto,'mundo');if(p.key==='candado')for(const h of phys.hinges)if(h.cand===p.id)h.candado=false;const d=OBJ[p.key]||{},m=MAT[matOf(p)]||{};
  const i=obstacles.indexOf(p);if(i>=0)obstacles.splice(i,1);if(p.body){phys.remove(p.body);p.body=null;}
  if(p.idx!==undefined&&dyn[p.key])sync(p);
  if(d.rompe)spawnDebris(p.x,p.z,d.rompe.tipo,m.hex||0x888888,d.rompe.n);
  if(d.explota&&hooks.boom)hooks.boom(p.x,p.z);
  if(p.onBreak)p.onBreak(p);}
export function damageProp(p,n){if(!p||p.dead||p.vida===undefined||p.vida===Infinity)return;p.vida-=n;if(p.vida<=0)breakProp(p);}
// Impacto de bala en un objeto o muro: partículas según el material, empujón y daño. Devuelve true si lo ha tratado.
export function hitProp(p,dx,dz,hx,hz){
  if(!p)return false;const m=MAT[matOf(p)];if(!m)return false;
  if(p.hoja){impact(hx,.9,hz,m.col,2);phys.hingeHit(p.hoja,dx,dz,hx,hz);damageHoja(p.hoja,1);return true;} // la reja: la bala la atraviesa (−1 de vida), sin marca de bala
  impact(hx,.5,hz,m.col,m.n);if(p.body)phys.hit(p.body,dx,dz,hx,hz);if(p.vida===undefined||p.vida>1)bulletMark(hx,.45+(hx*7.3%1)*.2,hz,dx,dz,p);damageProp(p,1);return true;}
export function blast(x,z,R,force){ // granada o bidón: empujón J = 400·(1−d/R) (force=16) y daño a lo que se rompe
  const J0=force*25*phys.params.fGranada/400;phys.blast(x,z,R,J0);
  for(const h of phys.hinges){if(h.roto)continue;const cx=h.px+h.dx*h.largo/2,cz=h.pz+h.dz*h.largo/2,dx=cx-x,dz=cz-z,d=Math.hypot(dx,dz);
    if(d<3)damageHoja(h,h.vida+1);else if(d<R)phys.hingeImpulse(h,dx/d*J0*(1-d/R),dz/d*J0*(1-d/R),h.largo*.75);} // < 3 m: se rompe; más lejos: la empuja
  for(const p of props){if(p.dead||p.vida===Infinity)continue;const d=Math.hypot(p.x-x,p.z-z);if(d<R)damageProp(p,Math.ceil(force*.5*(1-d/R)));}}
