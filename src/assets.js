import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { MODELS } from './models.config.js'; import { clipsZombi } from './anim_zombi.js'; import { clipsHumano } from './anim_humano.js';
import { renderer } from './renderer.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
let env=null; // reflejos suaves de estudio, solo para el personaje (ver A0f)
function getEnv(){ if(!env){const pm=new THREE.PMREMGenerator(renderer);env=pm.fromScene(new RoomEnvironment(),0.04).texture;pm.dispose();} return env; }
// Costuras de textura (PAQ-G3): las texturas de Meshy son cientos de trozos de colores distintos pegados sin margen. Al verse el modelo pequeño,
// la textura reducida mezcla trozos vecinos y salen motas claras en las costuras. Sin rehacer el modelo se reduce así: (1) la textura se lee un
// nivel más nítida (menos mezcla entre trozos), con más filtrado anisótropo para que no parpadee; (2) las coordenadas se toman dentro del
// triángulo («centroid»), para que el suavizado de bordes no lea fuera de él. Se puede apagar desde el menú (Comparar) o con ?costuras=0 para ver la diferencia.
let off=false;try{off=localStorage.getItem('tz_costuras')==='0';}catch(e){}
export const SEAM=!off&&!/[?&]costuras=0/.test(location.search);const SESGO=(/[?&]sesgo=([\d.]+)/.exec(location.search)||[])[1]||'1.5';
const cen=c=>c.replace(/varying vec2 (vMapUv|vNormalMapUv)/g,'centroid varying vec2 $1');
function costuras(m){m.onBeforeCompile=sh=>{
  sh.vertexShader=sh.vertexShader.replace('#include <uv_pars_vertex>',cen(THREE.ShaderChunk.uv_pars_vertex));
  sh.fragmentShader=sh.fragmentShader.replace('#include <uv_pars_fragment>',cen(THREE.ShaderChunk.uv_pars_fragment))
    .replace('#include <map_fragment>',THREE.ShaderChunk.map_fragment.replace('texture2D( map, vMapUv )','texture2D( map, vMapUv, -'+SESGO+' )'))
    .replace('#include <normal_fragment_maps>',THREE.ShaderChunk.normal_fragment_maps.replace('texture2D( normalMap, vNormalMapUv )','texture2D( normalMap, vNormalMapUv, -'+SESGO+' )'));};
  m.customProgramCacheKey=()=>'costuras'+SESGO;}
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
      if(c.anims){const ua=import.meta.env.BASE_URL+'models/'+c.anims,ra=await fetch(ua); if(!ra.ok||(ra.headers.get('content-type')||'').includes('html'))throw 0;
        g.animations=(await loader.parseAsync(await ra.arrayBuffer(),ua.replace(/[^/]*$/,''))).animations;} // clips compartidos (006 P1): vienen de un GLB aparte
      if(c.gen)g.animations=(c.gen==='humano'?clipsHumano:clipsZombi)(g.scene); // clips generados por código para el esqueleto propio
      g.scene.updateMatrixWorld(true);
      g.scene.traverse(o=>{if(!o.isMesh)return; o.castShadow=true;
        if(o.isSkinnedMesh){o.skeleton.update();o.computeBoundingSphere();o.boundingSphere.radius*=2;o.frustumCulled=true;} // PAQ-G3: no se dibuja ni sombrea lo que queda fuera de la cámara. La esfera se dobla porque la animación (andar, caer al morir) mueve el cuerpo fuera de su volumen en reposo
        for(const m of [].concat(o.material)){ m.metalness=0; m.metalnessMap=null; // sin mapa de entorno, el metal sale negro
          for(const t of [m.map,m.normalMap])if(t)t.anisotropy=SEAM?8:4;
          if(SEAM)costuras(m);
          if(k==='player'&&!c.gen){m.envMap=getEnv();m.envMapIntensity=.9;m.roughness=.62;}
          else if(c.relleno){m.envMap=getEnv();m.envMapIntensity=c.relleno;m.roughness=1;m.roughnessMap=null;} /* luz de relleno mate (sin brillo): para que la ropa oscura no se funda con el suelo */ m.needsUpdate=true; }});
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
