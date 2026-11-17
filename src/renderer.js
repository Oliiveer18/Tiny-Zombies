// Dibujo base: renderer, escena, cámara y post-proceso (bloom). Sin lógica de juego.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
export const touch=matchMedia('(pointer:coarse)').matches; const dpr=Math.min(devicePixelRatio,touch?3:2);
export const renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance'});
const Q=new URLSearchParams(location.search); // ?res=1.5|2|3 y ?msaa=0|4 para comparar calidad en el móvil
renderer.setPixelRatio(Number(Q.get('res'))||(touch?Math.min(dpr,3):dpr));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=0.85;document.body.prepend(renderer.domElement);
export const scene=new THREE.Scene();export const cam=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.5,120);
// Cámara definitiva «Tiny» (DECISIONES 2.1, 17 nov): 16,4 m, 58°, campo de visión 38°, centrada en el jugador. Sin menú de cámaras.
const CAM_Y=14,CAM_Z=8.6;
export const OFF=new THREE.Vector3(0,CAM_Y,CAM_Z);
export const CAM={k:Math.hypot(CAM_Y,CAM_Z)/Math.hypot(7.6,4.9),vel:1.55}; // k = distancia respecto a la cámara «cerca» antigua (escala retícula y chispas); vel = velocidad para que el paso en pantalla se vea natural
// Antialiasing real (MSAA) en el post-proceso: sin él, con antialias:false el personaje sale con bordes de sierra y «pixelado».
const msaa=Q.has('msaa')?Number(Q.get('msaa')):(touch?2:4); // móvil: calidad «B · Nítida» por defecto (resolución nativa hasta 3, suavizado ×2, sombra 2 048), elegida por el usuario el 17 nov (DECISIONES 2.15)
const rt=new THREE.WebGLRenderTarget(innerWidth*renderer.getPixelRatio(),innerHeight*renderer.getPixelRatio(),{type:THREE.HalfFloatType,samples:msaa});
export const comp=new EffectComposer(renderer,rt);comp.addPass(new RenderPass(scene,cam));
export const bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth/2,innerHeight/2),touch?.25:.4,.6,.85);comp.addPass(bloom);comp.addPass(new OutputPass());
addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);comp.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();});
// Solo para la prueba de carga (?carga, PAQ-G1): cambia resolución, MSAA y bloom en vivo. El juego normal no lo llama.
export function setCalidad({res,msaa:m,bloomOn}){
  if(res!==undefined){renderer.setPixelRatio(res);comp.setPixelRatio(res);comp.setSize(innerWidth,innerHeight);}
  if(m!==undefined){for(const t of [comp.renderTarget1,comp.renderTarget2]){t.samples=m;t.dispose();}}
  if(bloomOn!==undefined)bloom.enabled=bloomOn;}
export const calidadActual=()=>({res:renderer.getPixelRatio(),msaa:comp.renderTarget1.samples,bloomOn:bloom.enabled,
  msaaGL:comp.renderTarget1.samples>0===[comp.renderTarget1,comp.renderTarget2].some(t=>!!renderer.properties.get(t).__webglMultisampledFramebuffer)}); // msaaGL: el antialias que hay de verdad en la tarjeta coincide con el pedido
