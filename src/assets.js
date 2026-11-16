import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { MODELS } from './models.config.js';
import { renderer } from './renderer.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
let env=null; // reflejos suaves de estudio, solo para el personaje (ver A0f)
function getEnv(){ if(!env){const pm=new THREE.PMREMGenerator(renderer);env=pm.fromScene(new RoomEnvironment(),0.04).texture;pm.dispose();} return env; }
const loader = new GLTFLoader(); const cache = {};
function placeholder(p){
  let g; const m=new THREE.MeshStandardMaterial({color:p.color,roughness:.8});
  if(p.shape==='capsule'){g=new THREE.CapsuleGeometry(0.22,p.h-0.44,3,8);g.translate(0,p.h/2,0);}
  else if(p.shape==='cyl'){g=new THREE.CylinderGeometry(p.s[0],p.s[0],p.s[1],10);g.translate(0,p.s[1]/2,0);}
  else {g=new THREE.BoxGeometry(...p.s);g.translate(0,p.s[1]/2,0);}
  const mesh=new THREE.Mesh(g,m); mesh.castShadow=true; const o=new THREE.Group(); o.add(mesh); return {scene:o,animations:[]};
}
export async function loadAll(){
  await Promise.all(Object.entries(MODELS).map(async([k,c])=>{
    try{
      const url=import.meta.env.BASE_URL+'models/'+c.file;
      const r=await fetch(url); if(!r.ok||(r.headers.get('content-type')||'').includes('html'))throw 0;
      const g=await loader.parseAsync(await r.arrayBuffer(),url.replace(/[^/]*$/,''));
      g.scene.traverse(o=>{if(!o.isMesh)return; o.castShadow=true;
        if(o.isSkinnedMesh)o.frustumCulled=false; // receta 003 §3: la caja de un modelo animado no sigue a los huesos
        for(const m of [].concat(o.material)){ m.metalness=0; m.metalnessMap=null; // sin mapa de entorno, el metal sale negro
          for(const t of [m.map,m.normalMap])if(t)t.anisotropy=4;
          if(k==='player'){m.envMap=getEnv();m.envMapIntensity=.9;m.roughness=.62;} m.needsUpdate=true; }});
      cache[k]=g;
    }catch{ cache[k]=placeholder(c.placeholder); }
  }));
}
export function instance(key){
  const c=MODELS[key], src=cache[key];
  const root=new THREE.Group(), body=SkeletonUtils.clone(src.scene);
  body.scale.setScalar(c.scale); body.position.set(...c.offset); root.add(body);
  let mixer=null; const actions={};
  if(src.animations.length){ mixer=new THREE.AnimationMixer(body);
    for(const [k,name] of Object.entries(c.clips||{})){const clip=src.animations.find(a=>a.name===name); if(clip)actions[k]=mixer.clipAction(clip);} }
  return {root,body,mixer,actions,cur:null};
}
export function play(inst,name,once){
  const a=inst.actions[name]; if(!inst.mixer||inst.cur===name||!a)return;
  inst.actions[inst.cur]?.fadeOut(.15); a.reset(); if(once){a.setLoop(THREE.LoopOnce);a.clampWhenFinished=true;} a.fadeIn(.15).play(); inst.cur=name;
}
export function propSource(key){
  const meshes=[]; cache[key].scene.updateMatrixWorld(true); cache[key].scene.traverse(o=>{if(o.isMesh)meshes.push(o)});
  return {c:MODELS[key],meshes};
}
