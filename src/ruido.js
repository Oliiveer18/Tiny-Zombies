// Ruido (PAQ-03): simulación pura, sin THREE ni DOM (norma 3). Una lista de registros {x,z,radio,tick,quien} que los zombis leen.
// Los radios están en src/data/ruido.json; quien arranca el juego (o la prueba de Node) los carga con configuraRuido().
export const R={}; // radios por causa (disparo, explosion, andar...). Se pueden cambiar en vivo desde ?debug
export const ruido=[];
const VIDA=120; // pasos de simulación (2 s) que se conserva un registro
let reloj=()=>0;
export function configuraRuido(datos,fReloj){Object.assign(R,datos);if(fReloj)reloj=fReloj;}
export const tickRuido=()=>reloj();
export function sonido(x,z,radio,quien){const T=reloj();while(ruido.length&&T-ruido[0].tick>VIDA)ruido.shift();if(radio>0)ruido.push({x,z,radio,tick:T,quien:quien||'j1'});}
// ¿Se cortan los segmentos a-b y el muro [x1,z1,x2,z2]? Solo + - * /.
export function corta(ax,az,bx,bz,m){const rx=bx-ax,rz=bz-az,sx=m[2]-m[0],sz=m[3]-m[1],den=rx*sz-rz*sx;if(den===0)return false;
  const qx=m[0]-ax,qz=m[1]-az,t=(qx*sz-qz*sx)/den,u=(qx*rz-qz*rx)/den;return t>=0&&t<=1&&u>=0&&u<=1;}
export function murosEntre(ax,az,bx,bz,muros){let n=0;for(const m of muros)if(corta(ax,az,bx,bz,m))n++;return n;}
// ¿Llega el registro `r` a un oyente en (x,z)? Cada muro en medio divide el radio por 2; con 3 o más no se oye. Rejas y objetos no cuentan.
export function oye(x,z,r,muros){const dx=r.x-x,dz=r.z-z,d2=dx*dx+dz*dz;if(d2>r.radio*r.radio)return false;
  const n=murosEntre(r.x,r.z,x,z,muros);if(n>2)return false;const rad=n===0?r.radio:n===1?r.radio/2:r.radio/4;return d2<=rad*rad;}
