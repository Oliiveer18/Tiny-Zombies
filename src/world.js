import * as THREE from 'three';
import { propSource } from './assets.js'; import { mulberry, WORLD_SEED } from './sim.js';
export const obstacles=[]; export const props=[]; export const FIELD=40;
const dyn={}; const dummy=new THREE.Object3D(); const mm=new THREE.Matrix4();
export function buildWorld(scene,q){
  scene.background=new THREE.Color(0x070b16); scene.fog=new THREE.FogExp2(0x070b16,0.03);
  scene.add(new THREE.HemisphereLight(0x3a4f80,0x0a0c14,0.6));
  const sun=new THREE.DirectionalLight(0x7f9cff,0.9); sun.position.set(-14,26,10); sun.castShadow=true;
  const s=sun.shadow; s.mapSize.set(q.shadow,q.shadow); const e=20; Object.assign(s.camera,{left:-e,right:e,top:e,bottom:-e,far:80}); s.bias=-0.0004; s.radius=3;
  scene.add(sun,sun.target);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(FIELD*2,FIELD*2),new THREE.MeshStandardMaterial({color:0x101a33,roughness:1}));
  ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);
  const plan={fence:26,barrel:14,barrier:12,crate:16,sack:14,car:5}; const rnd=mulberry(WORLD_SEED);
  for(const [key,n] of Object.entries(plan)){
    const {c,meshes}=propSource(key);
    dyn[key]=meshes.map(m=>{const im=new THREE.InstancedMesh(m.geometry,m.material,n);im.castShadow=im.receiveShadow=true;im.frustumCulled=false;scene.add(im);return {im,m};});
    for(let i=0;i<n;i++){let x,z;do{x=(rnd()-.5)*FIELD*1.7;z=(rnd()-.5)*FIELD*1.7;}while(Math.hypot(x,z)<5);
      const p={id:'p'+props.length,key,x,z,r:c.radius||.5,idx:i,rot:rnd()*6.28,y:0,tx:0,vx:0,vy:0,vz:0,vr:0,fly:false}; props.push(p);obstacles.push(p);sync(p);}
  }
  return sun;
}
function sync(p){
  dummy.position.set(p.x,p.y,p.z); dummy.rotation.set(p.tx,p.rot,0); dummy.updateMatrix();
  for(const {im,m} of dyn[p.key]){mm.multiplyMatrices(dummy.matrix,m.matrixWorld);im.setMatrixAt(p.idx,mm);im.instanceMatrix.needsUpdate=true;}
}
export function updateProps(dt){
  for(const p of props){ if(!p.fly)continue;
    p.vy-=22*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.rot+=p.vr*dt;p.tx+=p.vr*.5*dt;
    if(p.y<=0){p.y=0;if(Math.abs(p.vy)>2.5){p.vy*=-.35;p.vx*=.6;p.vz*=.6;p.vr*=.6;}else{p.vy=0;p.vx*=.85;p.vz*=.85;p.vr*=.85;if(Math.hypot(p.vx,p.vz)<.2){p.fly=false;p.tx=0;}}}
    sync(p);}
}
export function blast(x,z,R,force){
  for(const p of props){const dx=p.x-x,dz=p.z-z,d=Math.hypot(dx,dz);if(d<R){const f=(1-d/R)*force,m=p.key==='car'?.35:1;
    p.vx+=dx/(d||1)*f*m;p.vz+=dz/(d||1)*f*m;p.vy+=(6+f*.3)*m;p.vr+=(Math.random()-.5)*8;p.fly=true;}}
}
