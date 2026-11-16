// Suelo del lugar: asfalto con relieve (normales), aceras con juntas, variación a gran escala y marcas fijas. Todo generado por código, sin archivos.
// Aspecto propio (no copia de ningún juego). Cifras: 2 texturas de 512² + 1 de 128² (≈ 3 MB 💡). Datos del lugar: bloque «suelo» del JSON.
import * as THREE from 'three';
import { staticDecal } from './decals.js';
const hash=(x,y,s)=>{let h=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^Math.imul(s|0,2147483647);h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967296;};
const smooth=t=>t*t*(3-2*t);
function vnoise(x,y,per,s){const xi=Math.floor(x),yi=Math.floor(y),fx=smooth(x-xi),fy=smooth(y-yi),m=v=>((v%per)+per)%per;
  const a=hash(m(xi),m(yi),s),b=hash(m(xi+1),m(yi),s),c=hash(m(xi),m(yi+1),s),d=hash(m(xi+1),m(yi+1),s);return a+(b-a)*fx+(c-a)*fy+(a-b-c+d)*fx*fy;}
function fbm(x,y,s,oct=4,base=4){let v=0,a=.5,f=base,t=0;for(let o=0;o<oct;o++){v+=a*vnoise(x*f,y*f,f,s+o*17);t+=a;a*=.5;f*=2;}return v/t;} // x,y en 0..1 y repetible
function dt(d,S,cs,an){const t=new THREE.DataTexture(d,S,S,THREE.RGBAFormat);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=an;if(cs)t.colorSpace=THREE.SRGBColorSpace;t.needsUpdate=true;return t;}
function tex(S,fn,srgb){ // fn(x,y) -> [r,g,b,alto]
  const alb=new Uint8ClampedArray(S*S*4),h=new Float32Array(S*S);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const [r,g,b,hh]=fn(x/S,y/S,x,y);const i=(y*S+x)*4;alb[i]=r;alb[i+1]=g;alb[i+2]=b;alb[i+3]=255;h[y*S+x]=hh;}
  const nor=new Uint8ClampedArray(S*S*4),K=4.5,w=v=>(v+S)%S;
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const dx=(h[y*S+w(x-1)]-h[y*S+w(x+1)])*K,dy=(h[w(y+1)*S+x]-h[w(y-1)*S+x])*K,l=Math.hypot(dx,dy,1),i=(y*S+x)*4;
    nor[i]=(dx/l*.5+.5)*255;nor[i+1]=(dy/l*.5+.5)*255;nor[i+2]=(1/l*.5+.5)*255;nor[i+3]=255;}
  const mk=(d,cs)=>dt(d,S,cs,4);
  return {map:mk(alb,true),normalMap:mk(nor,false)};}
function asfalto(){ // grano, gravilla, grietas largas y manchas de aceite
  const cr=[];for(let k=0;k<5;k++){let x=hash(k,1,9),y=hash(k,2,9),a=hash(k,3,9)*6.28;for(let i=0;i<60;i++){cr.push([x,y]);a+=(hash(k,i+10,9)-.5)*.7;x=(x+Math.cos(a)*.006+1)%1;y=(y+Math.sin(a)*.006+1)%1;}}
  const cm=new Set(cr.map(([x,y])=>Math.floor(x*256)+','+Math.floor(y*256)));
  return tex(512,(u,v,px,py)=>{const n=fbm(u,v,3,5,3),g=hash(px,py,5),big=fbm(u,v,8,3,2),
      sp=g>.99?22:g<.05?-14:0,crack=cm.has(Math.floor(u*256)+','+Math.floor(v*256))?1:0,oil=Math.max(0,fbm(u,v,21,3,2)-.62)*5;
    let c=92+(n-.5)*28+(big-.5)*20+(g-.5)*8+sp;c*=1-crack*.3;c*=1-Math.min(.45,oil);
    return [c*.97,c*1.0,c*1.1,.5+n*.35+(g-.5)*.12+sp*.01-crack*.4];},true);}
function losas(){ // 2×2 losas de hormigón con juntas, desconchones y tinte propio
  return tex(512,(u,v,px,py)=>{const lx=Math.floor(u*2),ly=Math.floor(v*2),ix=(u*2)%1,iy=(v*2)%1,jt=Math.min(ix,1-ix,iy,1-iy),joint=jt<.018?1:jt<.03?.5:0,
      tint=hash(lx,ly,31),n=fbm(u,v,4,5,4),g=hash(px,py,6),chip=fbm(u+lx*.3,v+ly*.3,5,3,6)>.7?1:0;
    let c=92+(tint-.5)*20+(n-.5)*22+(g-.5)*10;c*=1-joint*.65;c*=1-chip*.18;
    return [c*.98,c*1.0,c*1.06,.55+n*.2+(g-.5)*.08-joint*.5-chip*.15];},true);}
function macro(){ const S=128,d=new Uint8ClampedArray(S*S*4);for(let y=0;y<S;y++)for(let x=0;x<S;x++){const n=fbm(x/S,y/S,11,4,2),v=(.35+n*.3)*255,i=(y*S+x)*4;d[i]=v;d[i+1]=v;d[i+2]=v;d[i+3]=255;}return dt(d,S,false,1);}
export function buildGround(scene,ground,lugar){
  const t0=performance.now();
  const cfg=lugar.suelo||{},tile=cfg.tile||4,as=asfalto(),sl=losas(),mc=macro(),F=80/tile;
  for(const t of [as.map,as.normalMap]){t.repeat.set(F,F);}
  const m=ground.material;m.color.set(0xffffff);m.map=as.map;m.normalMap=as.normalMap;m.normalScale.set(.9,.9);m.roughness=.95;
  m.onBeforeCompile=sh=>{sh.uniforms.macro={value:mc};
    sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 vWP;').replace('#include <begin_vertex>','#include <begin_vertex>\nvWP=(modelMatrix*vec4(transformed,1.)).xz;');
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec2 vWP;uniform sampler2D macro;').replace('#include <map_fragment>','#include <map_fragment>\ndiffuseColor.rgb*=texture2D(macro,vWP/26.).rgb*2.;');};
  m.needsUpdate=true;
  // aceras: franjas bajas (7 cm) con losas, pegadas por dentro de los muros largos del callejón
  const W=cfg.acera||1.1,H=.07,sm=new THREE.MeshStandardMaterial({color:0xffffff,map:sl.map,normalMap:sl.normalMap,roughness:.9});
  for(const [x1,z1,x2,z2] of lugar.muros){const L=Math.hypot(x2-x1,z2-z1);if(L<6||Math.abs(x1)>4.1&&Math.abs(x2)>4.1&&Math.abs(z1)<39)continue;
    const vert=Math.abs(x1-x2)<.01,cx=(x1+x2)/2,cz=(z1+z2)/2,g=new THREE.BoxGeometry(vert?W:L,H,vert?L:W),uv=g.attributes.uv;
    const sx=(vert?W:L)/2,sz=(vert?L:W)/2;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*(vert?W:L)/2,uv.getY(i)*(vert?L:W)/2); // 1 repetición cada 2 m
    const s=new THREE.Mesh(g,sm);const ix=vert?(cx<0?1:-1)*W/2:0,iz=vert?0:(cz<-20?1:-1)*W/2;s.position.set(cx+ix,H/2,cz+iz);s.receiveShadow=true;s.castShadow=false;scene.add(s);}
  for(const [cell,x,z,size,a] of cfg.decals||[])staticDecal(cell,x,z,size,a);
  window.__groundMs=Math.round(performance.now()-t0); // tiempo de generar el suelo (se mira con ?debug en el móvil)
}
