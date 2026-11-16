import * as THREE from 'three';
import { TEST, LAYOUT } from './test.js'; import { buildAlley } from './alley.js'; import { createPhysics } from './physics.js'; import MAT from './data/materiales.json'; import OBJ from './data/objetos.json'; import { propSource } from './assets.js'; import { mulberry, WORLD_SEED } from './sim.js';
export const LUZ={}; // luces ajustables en vivo desde ?debug
export const obstacles=[]; export const props=[]; export const FIELD=40;
export const phys=createPhysics(MAT,OBJ); const dyn={}; const dummy=new THREE.Object3D(); const mm=new THREE.Matrix4();
export function buildWorld(scene,q){
  scene.background=new THREE.Color(0x9cc4e4); scene.fog=null; // sin niebla por decisión del usuario (16 nov). DÍA provisional (noche de Tiny: fondo/niebla 0x070b16)
  LUZ.hemi=new THREE.HemisphereLight(0xdcebff,0x6a6650,0.75); scene.add(LUZ.hemi);
  const sun=new THREE.DirectionalLight(0xfff0d2,1.5); LUZ.sun=sun; sun.position.set(-14,26,10); sun.castShadow=true;
  const s=sun.shadow; s.mapSize.set(q.shadow,q.shadow); const e=20; Object.assign(s.camera,{left:-e,right:e,top:e,bottom:-e,far:80}); s.bias=-0.0004; s.radius=3;
  scene.add(sun,sun.target);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(FIELD*2,FIELD*2),new THREE.MeshStandardMaterial({color:0x6f8a4e,roughness:1}));
  ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);
  const plan={fence:26,barrel:14,barrier:12,crate:16,sack:14,car:5}; const rnd=mulberry(WORLD_SEED);
  if(TEST)for(const k in plan)plan[k]=LAYOUT.props.filter(a=>a[0]===k).length; // mapa de prueba: solo lo de la lista
  for(const [key,n] of Object.entries(plan)){ if(!n)continue; const fixed=TEST?LAYOUT.props.filter(a=>a[0]===key):null;
    const {c,meshes}=propSource(key);
    dyn[key]=meshes.map(m=>{const im=new THREE.InstancedMesh(m.geometry,m.material,n);im.castShadow=im.receiveShadow=true;im.frustumCulled=false;scene.add(im);return {im,m};});
    for(let i=0;i<n;i++){let x,z;if(fixed){x=fixed[i][1];z=fixed[i][2];}else do{x=(rnd()-.5)*FIELD*1.7;z=(rnd()-.5)*FIELD*1.7;}while(Math.hypot(x,z)<5);
      const p={id:'p'+props.length,key,x,z,r:c.radius||.5,idx:i,rot:fixed?fixed[i][3]:rnd()*6.28,y:0,tx:0,vx:0,vy:0,vz:0,vr:0,fly:false}; props.push(p);obstacles.push(p);phys.addProp(p);sync(p);}
  }
  if(TEST)buildAlley(scene,ground); // callejón: muros, luz de atardecer y farolas
  return sun;
}
function sync(p){
  dummy.position.set(p.x,p.y,p.z); dummy.rotation.set(p.tx,p.rot,0); dummy.updateMatrix();
  for(const {im,m} of dyn[p.key]){mm.multiplyMatrices(dummy.matrix,m.matrixWorld);im.setMatrixAt(p.idx,mm);im.instanceMatrix.needsUpdate=true;}
}
export function updateProps(dt){
  phys.step(dt); // física propia (src/physics.js): se mueve lo que se despierta; lo dormido no cuesta nada
  for(const b of phys.bodies){if(!b.dirty||!b.prop)continue;const p=b.prop;
    p.x=b.x;p.z=b.z;p.y=b.y;p.rot=Math.atan2(-b.cz,b.cx);p.fly=b.y>.15; // fly: en el aire (como antes) no choca ni para balas
    p.tx=b.y>.02?p.tx+b.w*.5*dt:p.tx*Math.max(0,1-dt*8); // giro de volteo solo visual
    sync(p);if(b.asleep){b.dirty=false;p.tx=0;sync(p);}}
}
export function blast(x,z,R,force){phys.blast(x,z,R,force*25);} // granada: impulso J = 400·(1−d/R) con force=16
export function bump(p,dx,dz,hx,hz){if(p&&p.body)phys.hit(p.body,dx,dz,hx,hz);} // impacto de bala en un objeto
