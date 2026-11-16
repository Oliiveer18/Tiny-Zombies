// Marcas en suelo, muros y objetos (agujeros de bala, sangre, quemaduras). Diseño: 005 §3.
// UNA malla instanciada de 64 cuadrados con un atlas dibujado por código: 1 llamada de dibujo. Solo dibujo: no se guarda ni se sincroniza.
import * as THREE from 'three';
const N=96,B0=0,B1=40,S0=40,S1=56,Q0=56,Q1=64,F0=64; // bala 0-39 · sangre 40-55 · quemadura 56-63 (colas circulares)
// casillas del atlas 4×4: 0-3 agujeros · 4 desconchón · 5 grieta · 6-9 sangre · 10-12 quemadura · 13 charco · 14-15 mancha
const ro=a=>{let s=a>>>0;return()=>{s=Math.imul(s^s>>>15,2246822519)>>>0;s=(s+0x9e3779b9)>>>0;return(s^s>>>13)/4294967296+.5;};};
function atlas(){
  const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d'),r=ro(7);
  const blob=(cx,cy,R,col,n,j)=>{g.fillStyle=col;for(let i=0;i<n;i++){const a=i/n*6.283,d=R*(1-j*r());g.beginPath();g.arc(cx+Math.cos(a)*d*.5,cy+Math.sin(a)*d*.5,R*(.35+.3*r()),0,6.283);g.fill();}};
  for(let k=0;k<16;k++){const x=k%4*64+32,y=(k>>2)*64+32;g.save();g.translate(0,0);
    if(k<4){const R=7+k*2;blob(x,y,R*1.5,'rgba(10,8,8,.55)',8,.5);blob(x,y,R*.8,'rgba(0,0,0,.95)',7,.2);} // agujero con borde desconchado
    else if(k===4){blob(x,y,26,'rgba(20,18,16,.5)',10,.6);blob(x,y,14,'rgba(0,0,0,.8)',8,.4);}
    else if(k===5){g.strokeStyle='rgba(0,0,0,.8)';g.lineWidth=2;g.beginPath();g.moveTo(x-28,y-6);for(let i=1;i<7;i++)g.lineTo(x-28+i*9,y-6+(r()-.5)*18);g.stroke();}
    else if(k<10){const R=14+(k-6)*5;blob(x,y,R*2,'rgba(90,6,8,.85)',12,.7);blob(x,y,R,'rgba(55,3,5,.95)',9,.4);for(let i=0;i<5;i++)blob(x+(r()-.5)*44,y+(r()-.5)*44,4,'rgba(80,5,8,.9)',3,.2);}
    else if(k<13){const R=18+(k-10)*4;blob(x,y,R*2.2,'rgba(6,5,5,.35)',14,.7);blob(x,y,R*1.3,'rgba(0,0,0,.65)',12,.5);}
    else if(k===13){blob(x,y,17,'rgba(25,34,52,.6)',14,.5);blob(x,y,9,'rgba(60,78,110,.35)',9,.3);} // charco
    else if(k===14)blob(x,y,15,'rgba(15,12,6,.65)',12,.6);
    else{for(let i=0;i<2;i++){g.fillStyle='rgba(200,165,70,.75)';g.fillRect(x-30,y-8+i*0,60,14);}g.fillStyle='rgba(0,0,0,.35)';for(let i=0;i<40;i++)g.fillRect(x-30+r()*60,y-8+r()*14,2+r()*5,1+r()*3);} // pintura vial desgastada
    g.restore();}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
let mesh,cell,alpha;const D=[];const nxt={b:B0,s:S0,q:Q0,f:F0};const dummy=new THREE.Object3D();dummy.rotation.order='YXZ';let rn=0;
export function initDecals(scene){
  const g=new THREE.PlaneGeometry(1,1);cell=new THREE.InstancedBufferAttribute(new Float32Array(N),1);alpha=new THREE.InstancedBufferAttribute(new Float32Array(N),1);
  g.setAttribute('cell',cell);g.setAttribute('alpha',alpha);
  const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2,uniforms:{map:{value:atlas()}},
    vertexShader:`attribute float cell;attribute float alpha;varying vec2 vu;varying float va;void main(){vec2 o=vec2(mod(cell,4.),floor(cell/4.));vu=(uv+o)/4.;vu.y=1.-vu.y;va=alpha;gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.);}`,
    fragmentShader:`uniform sampler2D map;varying vec2 vu;varying float va;void main(){vec4 c=texture2D(map,vu);gl_FragColor=vec4(c.rgb*.6,c.a*va);}`});
  mesh=new THREE.InstancedMesh(g,m,N);mesh.frustumCulled=false;mesh.renderOrder=1;scene.add(mesh);
  const z=new THREE.Matrix4().makeScale(0,0,0);for(let i=0;i<N;i++){mesh.setMatrixAt(i,z);D.push({on:false,i,t:0,life:0,p:null});}}
function put(d){ // calcula la matriz de una marca (si está pegada a un objeto, sigue al objeto)
  let x=d.x,z=d.z,yaw=d.yaw;
  if(d.p){const p=d.p,a=p.rot,c=Math.cos(a),s=Math.sin(a);x=p.x+d.lx*c+d.lz*s;z=p.z-d.lx*s+d.lz*c;yaw=d.yaw+(a-d.a0);}
  if(d.flat)dummy.rotation.set(-Math.PI/2,0,d.roll);else dummy.rotation.set(0,yaw,d.roll);
  dummy.position.set(x,d.y,z);dummy.scale.set(d.size,d.size,1);dummy.updateMatrix();mesh.setMatrixAt(d.i,dummy.matrix);mesh.instanceMatrix.needsUpdate=true;}
function add(q,lo,hi,c,x,y,z,size,flat,nx,nz,prop,life){
  if(!mesh)return;const d=D[nxt[q]];nxt[q]=nxt[q]+1>=hi?lo:nxt[q]+1;
  rn=(rn*1664525+1013904223)>>>0;d.on=true;d.t=0;d.life=life;d.x=x;d.y=y;d.z=z;d.size=size;d.flat=flat;d.roll=(rn>>>8)/16777216*6.283;
  d.yaw=Math.atan2(nx,nz);d.p=prop||null;if(d.p){const o=x-prop.x,w=z-prop.z,a=prop.rot,cc=Math.cos(a),ss=Math.sin(a);d.lx=o*cc-w*ss;d.lz=o*ss+w*cc;d.a0=a;} // pasa al marco del objeto
  cell.setX(d.i,c);alpha.setX(d.i,1);cell.needsUpdate=alpha.needsUpdate=true;put(d);}
const per=new Map(); // marcas de bala por objeto (tope 6)
// Agujero de bala en un objeto o muro: mirando al tirador. Sobre un objeto móvil se pega a él.
export function bulletMark(x,y,z,dx,dz,prop){
  if(prop&&prop.id){const n=(per.get(prop.id)||0);if(n>=6)return;per.set(prop.id,n+1);}
  rn=(rn*1664525+1013904223)>>>0;add('b',B0,B1,(rn>>>12)%4,x-dx*.02,y,z-dz*.02,.18+((rn>>>4)&7)*.015,false,-dx,-dz,prop&&prop.body?prop:null,1e9);}
export function blood(x,z,size=1,c=null){rn=(rn*1664525+1013904223)>>>0;add('s',S0,S1,c??6+(rn>>>10)%4,x,.025,z,size,true,0,1,null,60);}
export function burn(x,z,size=3){rn=(rn*1664525+1013904223)>>>0;add('q',Q0,Q1,10+(rn>>>10)%3,x,.022,z,size,true,0,1,null,120);}
export function staticDecal(c,x,z,size,roll=0){const i=nxt.f;add('f',F0,N,c,x,.02,z,size,true,0,1,null,1e9);const d=D[i];d.roll=roll;put(d);alpha.setX(i,c===5||c===4||c===14?.5:c===15?.55:.8);alpha.needsUpdate=true;} // marca fija del lugar (no se borra)
export function updateDecals(dt){
  if(!mesh)return;for(const d of D){if(!d.on)continue;d.t+=dt;
    if(d.life<1e8&&d.t>d.life-3){const a=Math.max(0,(d.life-d.t)/3);alpha.setX(d.i,a);alpha.needsUpdate=true;if(a<=0){d.on=false;mesh.setMatrixAt(d.i,new THREE.Matrix4().makeScale(0,0,0));mesh.instanceMatrix.needsUpdate=true;continue;}}
    if(d.p){if(d.p.dead){d.on=false;mesh.setMatrixAt(d.i,new THREE.Matrix4().makeScale(0,0,0));mesh.instanceMatrix.needsUpdate=true;}else if(d.p.body&&d.p.body.dirty)put(d);}}}
