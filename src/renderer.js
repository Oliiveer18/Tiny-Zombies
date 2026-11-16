// Dibujo base: renderer, escena, cámara y post-proceso (bloom). Sin lógica de juego.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
export const touch=matchMedia('(pointer:coarse)').matches; const dpr=Math.min(devicePixelRatio,2);
export const renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance'});
const Q=new URLSearchParams(location.search); // ?res=1.5|2|3 y ?msaa=0|4 para comparar calidad en el móvil
renderer.setPixelRatio(Number(Q.get('res'))||(touch?Math.min(dpr,2):dpr));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;document.body.prepend(renderer.domElement);
export const scene=new THREE.Scene();export const cam=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.5,120);
export const OFF=new THREE.Vector3(0,7.6,4.9); // medidas elegidas por el usuario con las barras de ?debug (16 nov, 2.ª vuelta). Tiny original: (0,14,8.6)
// Antialiasing real (MSAA) en el post-proceso: sin él, con antialias:false el personaje sale con bordes de sierra y «pixelado».
const msaa=Q.has('msaa')?Number(Q.get('msaa')):4;
const rt=new THREE.WebGLRenderTarget(innerWidth*renderer.getPixelRatio(),innerHeight*renderer.getPixelRatio(),{type:THREE.HalfFloatType,samples:msaa});
export const comp=new EffectComposer(renderer,rt);comp.addPass(new RenderPass(scene,cam));
const bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth/2,innerHeight/2),touch?.25:.4,.6,.85);comp.addPass(bloom);comp.addPass(new OutputPass());
addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);comp.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();});
