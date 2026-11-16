import * as THREE from 'three'; import { CAM } from './renderer.js';
const MAX=600; let pts,pos,col,life,vel,mx,grav,siz,head=0,mat,tm; const tracers=[];
export function initEffects(scene){
  const g=new THREE.BufferGeometry(); pos=new Float32Array(MAX*3);col=new Float32Array(MAX*3);siz=new Float32Array(MAX);
  life=new Float32Array(MAX);mx=new Float32Array(MAX);vel=new Float32Array(MAX*3);grav=new Float32Array(MAX);
  g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));g.setAttribute('size',new THREE.BufferAttribute(siz,1));
  mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,vertexColors:true,uniforms:{k:{value:600}},
    vertexShader:`attribute float size;varying vec3 vc;uniform float k;void main(){vc=color;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=size*k/-mv.z;gl_Position=projectionMatrix*mv;}`,
    fragmentShader:`varying vec3 vc;void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;gl_FragColor=vec4(vc*(1.-d*d),1.);}`});
  pts=new THREE.Points(g,mat);pts.frustumCulled=false;scene.add(pts);for(let i=0;i<MAX;i++)pos[i*3+1]=-999;
  tm=new THREE.LineSegments(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:0xffd27a,transparent:true,opacity:.9}));
  tm.frustumCulled=false;tm.geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(48*6),3));tm.geometry.setDrawRange(0,0);scene.add(tm);
}
function emit(x,y,z,vx,vy,vz,r,g,b,l,s,gr=0){const i=head++%MAX;pos.set([x,y,z],i*3);vel.set([vx,vy,vz],i*3);col.set([r,g,b],i*3);life[i]=mx[i]=l;siz[i]=s;grav[i]=gr;}
const R=()=>Math.random()-.5;
export function muzzle(x,y,z,dx,dz){emit(x,y,z,dx*2,0,dz*2,1,.8,.4,.06,.6);for(let i=0;i<3;i++)emit(x,y,z,dx*8+R()*3,Math.random()*2,dz*8+R()*3,1,.7,.2,.15,.14);}
export function impact(x,y,z,c=[.9,.25,.1],n=5){for(let i=0;i<n;i++)emit(x,y,z,R()*5,Math.random()*4,R()*5,...c,.35,.14,10);}
export function tracer(x0,z0,x1,z1){tracers.push({x0,z0,x1,z1,t:.07});}
export function explosion(x,z){
  for(let i=0;i<60;i++){const a=Math.random()*6.28,s=Math.random()*9;emit(x,.4,z,Math.cos(a)*s,Math.random()*5,Math.sin(a)*s,1,.5+Math.random()*.3,.1,.5+Math.random()*.4,1.4+Math.random());}
  for(let i=0;i<35;i++){const a=Math.random()*6.28,s=Math.random()*3;emit(x,.8,z,Math.cos(a)*s,1+Math.random()*3,Math.sin(a)*s,.25,.22,.25,1.4+Math.random(),2.2,-.5);}
  for(let i=0;i<40;i++){const a=Math.random()*6.28,s=6+Math.random()*10;emit(x,.5,z,Math.cos(a)*s,4+Math.random()*8,Math.sin(a)*s,1,.9,.5,.7,.16,22);}
}
export function updateEffects(dt){
  mat.uniforms.k.value=innerHeight*.9*Math.sqrt(CAM.k); // con la cámara lejos las chispas se agrandan un poco para que se lean
  for(let i=0;i<MAX;i++){if(life[i]<=0)continue;life[i]-=dt;
    vel[i*3+1]-=grav[i]*dt;for(let k=0;k<3;k++)pos[i*3+k]+=vel[i*3+k]*dt;
    if(pos[i*3+1]<.02&&grav[i]>0){pos[i*3+1]=.02;vel[i*3+1]*=-.3;}
    if(life[i]<=0)pos[i*3+1]=-999;else{col[i*3+1]*=1-dt*1.2;col[i*3+2]*=1-dt*1.2;}}
  pts.geometry.attributes.position.needsUpdate=pts.geometry.attributes.color.needsUpdate=true;
  const a=tm.geometry.attributes.position.array;let n=0;
  for(let i=tracers.length-1;i>=0;i--){const t=tracers[i];t.t-=dt;if(t.t<=0){tracers.splice(i,1);continue;}if(n<48){a.set([t.x0,.9,t.z0,t.x1,.9,t.z1],n*6);n++;}}
  tm.geometry.setDrawRange(0,n*2);tm.geometry.attributes.position.needsUpdate=true;
}
