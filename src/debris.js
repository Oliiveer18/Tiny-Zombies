// Trozos al romperse los objetos (tablas, esquirlas): una sola malla instanciada, solo dibujo (no se guardan ni chocan entre sí). Diseño: 005 §3.
import * as THREE from 'three';
const N=48,G=18,LIFE=8; let mesh;const P=[];const d=new THREE.Object3D(),col=new THREE.Color();let next=0;
export function initDebris(scene){
  mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({roughness:.9}),N);
  mesh.castShadow=true;mesh.frustumCulled=false;
  for(let i=0;i<N;i++){P.push({on:false,x:0,y:0,z:0,vx:0,vy:0,vz:0,rx:0,ry:0,rz:0,wx:0,wy:0,wz:0,sx:0,sy:0,sz:0,t:0,b:0});d.scale.set(0,0,0);d.updateMatrix();mesh.setMatrixAt(i,d.matrix);mesh.setColorAt(i,col.set(0xffffff));}
  scene.add(mesh);}
const SIZE={tabla:[.5,.05,.12],trozo:[.16,.1,.14],esquirla:[.07,.04,.07]};
export function spawnDebris(x,z,tipo,hex,n,dx=0,dz=0){
  if(!mesh)return;const s=SIZE[tipo]||SIZE.trozo;
  for(let k=0;k<n;k++){const p=P[next];next=(next+1)%N;const a=Math.random()*6.283,v=1.5+Math.random()*3.5;
    Object.assign(p,{on:true,x:x+Math.cos(a)*.2,y:.3+Math.random()*.4,z:z+Math.sin(a)*.2,vx:Math.cos(a)*v+dx*2,vy:2+Math.random()*3,vz:Math.sin(a)*v+dz*2,
      rx:Math.random()*3,ry:Math.random()*6,rz:Math.random()*3,wx:(Math.random()-.5)*14,wy:(Math.random()-.5)*14,wz:(Math.random()-.5)*14,
      sx:s[0]*(.7+Math.random()*.6),sy:s[1],sz:s[2]*(.7+Math.random()*.6),t:0,b:0});
    mesh.setColorAt(P.indexOf(p),col.set(hex).multiplyScalar(.75+Math.random()*.4));}
  if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;}
export function updateDebris(dt){
  if(!mesh)return;let any=false;
  for(let i=0;i<N;i++){const p=P[i];if(!p.on)continue;any=true;p.t+=dt;
    if(p.y>p.sy/2||p.vy>0){p.vy-=G*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.rx+=p.wx*dt;p.ry+=p.wy*dt;p.rz+=p.wz*dt;
      if(p.y<=p.sy/2){p.y=p.sy/2;if(!p.b&&p.vy<-2){p.vy*=-.3;p.vx*=.6;p.vz*=.6;p.b=1;}else{p.vy=0;p.vx=p.vz=0;p.wx=p.wy=p.wz=0;}}}
    const k=p.t>LIFE-.5?Math.max(0,(LIFE-p.t)/.5):1;if(p.t>=LIFE){p.on=false;}
    d.position.set(p.x,p.y,p.z);d.rotation.set(p.rx,p.ry,p.rz);d.scale.set(p.sx*k,p.sy*k,p.sz*k);d.updateMatrix();mesh.setMatrixAt(i,d.matrix);}
  if(any)mesh.instanceMatrix.needsUpdate=true;}
