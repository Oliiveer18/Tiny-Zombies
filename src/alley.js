// Callejón (lugar de prueba y futuro lugar del juego real): muros, luz de atardecer y farolas, leídos de src/data/lugares/callejon_01.json.
import { spawnDebris } from './debris.js';
// Los objetos y los zombis los coloca world.js / zombies.js desde el mismo archivo (vía test.js).
import * as THREE from 'three';
import { LUGAR } from './test.js'; import { buildGround } from './ground.js';
import { renderer, cam } from './renderer.js'; import { obstacles, LUZ, phys } from './world.js';
function glow(radio,color){ // charco de luz falso: disco aditivo con degradado, una sola malla
  const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),gr=g.createRadialGradient(32,32,0,32,32,32);
  gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);
  const m=new THREE.Mesh(new THREE.CircleGeometry(radio,24),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),color,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:.35}));
  m.rotation.x=-Math.PI/2;m.renderOrder=2;return m;}
export const MUROS=[]; // tramos de muro dibujados (para volverlos translúcidos si tapan al jugador)
const ALTO_MURO=3.2,OP_TAPA=.25;
// Muros que no tapan al jugador (PAQ-01 §2): si el segmento cámara→jugador (en planta) cruza el muro (ensanchado 0,5 m por cada extremo) y la altura de la línea de visión ahí es menor que la del muro, el tramo baja a opacidad .25 en ≈ 0,15 s.
export function updateMuros(dt,cx,cy,cz,px,pz){
  const rx=px-cx,rz=pz-cz;
  for(const w of MUROS){let tapa=false;
    const ex=w.x2-w.x1,ez=w.z2-w.z1,l=Math.hypot(ex,ez)||1,ux=ex/l,uz=ez/l,ax=w.x1-ux*.5,az=w.z1-uz*.5,bl=l+1;
    const den=rx*uz-rz*ux; // cruce del rayo (cx,cz)+t·r con el muro (ax,az)+u·bl·(ux,uz)
    if(Math.abs(den)>1e-6){const qx=ax-cx,qz=az-cz,t=(qx*uz-qz*ux)/den,u=(qx*rz-qz*rx)/den; // u en metros a lo largo del muro
      if(t>0&&t<1&&u>=0&&u<=bl&&cy*(1-t)+.9*t<ALTO_MURO)tapa=true;}
    const obj=tapa?OP_TAPA:1,k=Math.min(1,dt/.15);w.op+=(obj-w.op)*k;if(Math.abs(w.op-obj)<.01)w.op=obj;
    const m=w.mat,tr=w.op<.999;m.opacity=w.op;if(m.transparent!==tr){m.transparent=tr;m.depthWrite=!tr;}
    w.tapa=tapa;}
}
export function buildAlley(scene,ground){
  // luz de atardecer, sin niebla: cielo azul oscuro, hemisférica fría, sol bajo y naranja
  scene.background=new THREE.Color(0x0b1020);
  LUZ.hemi.color.set(0xa0abc4);LUZ.hemi.groundColor.set(0x3a3a44);LUZ.hemi.intensity=2.0;renderer.toneMappingExposure=1.15; // más claro que el día de Tiny a propósito: en el móvil el atardecer se veía casi negro
  LUZ.sun.color.set(0xff9a50);LUZ.sun.intensity=1.6;
  ground.material.color.set(0x5a5d68);
  buildGround(scene,ground,LUGAR); // suelo con relieve, aceras y marcas fijas (ground.js)
  // muros: una caja por tramo (dibujo) + una fila de círculos (colisión y balas, como el resto de obstáculos)
  const mat0=new THREE.MeshStandardMaterial({color:0x4a4440,roughness:1});
  LUGAR.muros.forEach((m,i)=>{const [x1,z1,x2,z2]=m,L=Math.hypot(x2-x1,z2-z1);
    const mat=mat0.clone();const mesh=new THREE.Mesh(new THREE.BoxGeometry(L+1,3.2,1),mat);MUROS.push({mat,x1,z1,x2,z2,op:1,L}); // material propio por tramo: así cada uno se vuelve translúcido por separado
    mesh.position.set((x1+x2)/2,1.6,(z1+z2)/2);mesh.rotation.y=-Math.atan2(z2-z1,x2-x1);mesh.castShadow=mesh.receiveShadow=true;scene.add(mesh);phys.addBox('m'+i,(x1+x2)/2,(z1+z2)/2,(L+1)/2,.5,Math.atan2(-(z2-z1),x2-x1)); // muro estático del motor de física
    const n=Math.ceil(L/.6);for(let k=0;k<=n;k++){const t=n?k/n:0;obstacles.push({id:'m'+i+'_'+k,key:'wall',x:x1+(x2-x1)*t,z:z1+(z2-z1)*t,r:.5,fly:false,wall:true});}});
  // luces: farolas (puntual real, sin sombra, ≤ 2) y charcos falsos
  let n=0;
  for(const l of LUGAR.luces){
    if(l.tipo==='farola'){
      const pole=new THREE.Mesh(new THREE.CylinderGeometry(.08,.1,3.6,8),new THREE.MeshStandardMaterial({color:0x1b1c20,roughness:.8}));pole.position.set(l.x,1.8,l.z);pole.castShadow=true;scene.add(pole);
      const lamp=new THREE.Mesh(new THREE.SphereGeometry(.22,10,8),new THREE.MeshBasicMaterial({color:new THREE.Color(l.color).multiplyScalar(2.2)}));lamp.position.set(l.x,3.7,l.z);scene.add(lamp);
      const pl=new THREE.PointLight(new THREE.Color(l.color),LUZ.farola||60,l.radio,2);pl.position.set(l.x,3.4,l.z);scene.add(pl);LUZ['farola'+(n++)]=pl;
      obstacles.push({id:'f_'+l.id,key:'lamp',x:l.x,z:l.z,r:.3,fly:false,wall:true,mat:'metal',vida:2,onBreak:()=>{pl.intensity=0;lamp.material.color.set(0x15151a);spawnDebris(l.x,l.z,'esquirla',0xcfd8e8,8);}}); // al romperse la farola se apaga
      const g=glow(l.radio*.7,new THREE.Color(l.color));g.position.set(l.x,.03,l.z);scene.add(g);
    }else{const g=glow(l.radio,new THREE.Color(l.color));g.position.set(l.x,.03,l.z);scene.add(g);}
  }
}
