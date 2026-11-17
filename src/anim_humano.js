// Clips del protagonista y demás humanos con el esqueleto de tools/esqueleto_auto.mjs, generados por código con el mismo generador que los zombis.
// Nombres lógicos = los que ya usa player.js: idle · walk · run · shoot_side (apuntar quieto) · shoot_fwd / shoot_back (apuntar andando) · reload · die.
// Ejes: X cabecear (+ hacia delante) · Y girar · Z ladear; el brazo izquierdo (+X) se lleva hacia delante con Y negativo, el derecho con Y positivo.
// Sin arma en las manos todavía: el arma será una pieza (3.11) y se colocará en la mano derecha; la postura ya es la de sostener un fusil.
import { generaClips } from './anim_zombi.js';
const S=p=>Math.sin(6.2831853*p),C=p=>Math.cos(6.2831853*p),pos=v=>v>0?v:0,sua=t=>{t=t<0?0:t>1?1:t;return t*t*(3-2*t);};
export const CLIPS_H={idle:{dur:3.4,loop:true},walk:{dur:1.0,loop:true,zancada:24,rodilla:38},run:{dur:.66,loop:true,zancada:40,rodilla:84},
  shoot_side:{dur:1.6,loop:true},shoot_fwd:{dur:.95,loop:true,zancada:20,rodilla:30},shoot_back:{dur:.95,loop:true,zancada:-20,rodilla:30},reload:{dur:1.8,loop:true},die:{dur:1.2,loop:false}};
// Velocidad que recorre cada clip, en alturas del modelo por segundo (pierna ≈ 0,38): la usa player.js para que los pies no patinen
export const VEL_H=Object.fromEntries(Object.entries(CLIPS_H).filter(([,c])=>c.zancada).map(([n,c])=>[n,Math.abs(4*.38*Math.sin(c.zancada*Math.PI/180)/c.dur)]));
const BR=70; // brazos caídos desde la pose T (solo para morir)
// Visto en el vídeo de referencia: el fusil va SIEMPRE en las manos (los brazos no se balancean), el torso y la cabeza se mantienen estables mirando hacia donde se apunta
// y son las piernas, las caderas y los hombros los que marcan el paso; al correr, el cuerpo se echa hacia delante.
const listo=(o,alto)=>{o.LeftArm=[14,-60-alto*8,-44+alto*12];o.RightArm=[8,66+alto*6,40-alto*10];o.LeftForeArm=[0,-54,0];o.RightForeArm=[0,42,0];o.LeftHand=[0,0,-10];o.RightHand=[0,0,10];}; // arma baja, lista
const apunta=(o,b)=>{o.LeftArm=[0,-78,-26+b];o.RightArm=[0,80,26-b];o.LeftForeArm=[0,-34,0];o.RightForeArm=[0,26,0];o.LeftHand=[0,0,-10];o.RightHand=[0,0,10];o.Spine=[(o.Spine||[0])[0]+3,-14,0];o.Spine2=[2,-10,0];o.Neck=[0,12,0];o.Head=[-4,14,0];}; // fusil al hombro, torso algo girado
// Zancada con peso: el balanceo no es un seno puro, se detiene un instante al apoyar (tercer armónico) y la rodilla se levanta justo después de pasar la pierna
const paso=(p,A)=>A*(S(p)+.16*S(p*3)),rod=(p,K,lado)=>K*Math.pow(pos(lado*C(p-.08)),1.4);
function pose(n,p){const c=CLIPS_H[n],o={LeftArm:[0,0,-BR],RightArm:[0,0,BR],LeftForeArm:[0,-14,0],RightForeArm:[0,14,0],hy:0,hz:0};
  if(n==='idle'){const s=S(p),r=S(p*2.3);listo(o,0);o.Hips=[0,1.5*s,1.4*s];o.Spine=[1.5+1.6*r,-1.5*s,-1.2*s];o.Spine2=[1.5+1.2*r,0,.6*s];o.Neck=[0,.8*s,0];o.Head=[0,-.8*s,0];
    o.LeftArm[0]+=1.2*r;o.RightArm[0]+=1.2*r;o.LeftUpLeg=[-2+1.2*s,0,0];o.RightUpLeg=[2-1.2*s,0,0];o.LeftLeg=[4,0,0];o.RightLeg=[4,0,0];o.hy=-.003-.002*r;}
  else if(n==='walk'||n==='run'){const A=c.zancada,r=n==='run',s=S(p),yaw=(r?9:6)*s;
    o.LeftUpLeg=[-paso(p,A),0,0];o.LeftLeg=[rod(p,c.rodilla,1)+4,0,0];o.LeftFoot=[(r?10:7)*s+3*pos(-C(p)),0,0];
    o.RightUpLeg=[paso(p,A),0,0];o.RightLeg=[rod(p,c.rodilla,-1)+4,0,0];o.RightFoot=[-(r?10:7)*s+3*pos(C(p)),0,0];
    o.Hips=[0,yaw,(r?4:3)*s];o.hy=-(r?.026:.013)*(1+C(p*2))-.004;o.hz=.004*S(p*2);
    o.Spine=[r?15:3,-yaw*.8,-(r?3.5:2.2)*s];o.Spine2=[r?5:2,-yaw*.5,(r?2:1)*s];o.Neck=[r?-8:-1,yaw*.3,0];o.Head=[r?-9:-2+1.5*S(p*2),yaw*.2,0]; // cabeza estable: contrarresta el giro de las caderas
    listo(o,r?1:0);o.LeftArm[0]+=(r?3:1.5)*S(p*2);o.RightArm[0]+=(r?3:1.5)*S(p*2+.2);} // los brazos solo acompañan con el rebote del paso
  else if(n==='shoot_side'||n==='shoot_fwd'||n==='shoot_back'){const b=1.2*S(p);apunta(o,b);o.Hips=[0,0,0];o.Spine[0]+=2;
    if(c.zancada){const A=Math.abs(c.zancada),d=Math.sign(c.zancada)||1,s=S(p)*d,k=C(p)*d;o.LeftUpLeg=[-paso(p,A)*d,0,0];o.LeftLeg=[rod(p,c.rodilla,d)+8,0,0];o.RightUpLeg=[paso(p,A)*d,0,0];o.RightLeg=[rod(p,c.rodilla,-d)+8,0,0];o.hy=-.014-.01*(1+C(p*2))*.6;o.Hips=[0,4*s,2*s];}
    else{o.LeftUpLeg=[-5,0,0];o.RightUpLeg=[4,0,0];o.LeftLeg=[10,0,0];o.RightLeg=[8,0,0];o.hy=-.012;}}
  else if(n==='reload'){ // 1) baja el arma · 2) la mano izquierda va al cargador y lo saca · 3) mete el nuevo · 4) amartilla con un tirón · 5) sube el arma
    const a=sua(p/.14)*(1-sua((p-.86)/.14)),m=sua((p-.18)/.12)*(1-sua((p-.5)/.12)),ins=sua((p-.5)/.1)*(1-sua((p-.62)/.1)),tir=sua((p-.68)/.06)*(1-sua((p-.78)/.06));
    apunta(o,0);o.LeftArm=[14*a,-70+20*a,-26-34*a-16*m];o.LeftForeArm=[0,-34-64*a-22*m,0];o.RightArm=[8*a,80-10*a,26+14*a+tir*-6];o.RightForeArm=[0,26+16*a+tir*22,0];o.RightHand=[0,0,10+30*tir];
    o.Spine=[3+12*a,-14+8*a,0];o.Spine2=[2+5*a,-10+6*a,0];o.Neck=[8*a,10-10*a,0];o.Head=[8*a+4*m,14-10*a,0];o.LeftHand=[0,0,-10-30*m+10*ins];o.LeftUpLeg=[-4,0,0];o.RightUpLeg=[3,0,0];o.LeftLeg=[10,0,0];o.RightLeg=[8,0,0];o.hy=-.012-.004*a;}
  else if(n==='die'){const a=sua(p/.3),b=sua((p-.2)/.8),bb=b*b*(3-2*b);
    o.Hips=[-88*bb,8*b,0];o.hy=-.1*a*(1-b);o.caida=b;o.LeftUpLeg=[-26*a*(1-b)-4*b,0,4*b];o.RightUpLeg=[-18*a*(1-b)+4*b,0,-6*b];o.LeftLeg=[50*a*(1-b)+8*b,0,0];o.RightLeg=[40*a*(1-b)+16*b,0,0];
    o.Spine=[10*(1-b),0,0];o.Head=[-16*a*(1-b)+8*b,10*b,0];o.LeftArm=[0,-14*a*(1-b),-BR+50*b];o.RightArm=[0,14*a*(1-b),BR-36*b];o.LeftForeArm=[0,-18,0];o.RightForeArm=[0,30*b+10,0];}
  return o;}
export const clipsHumano=escena=>generaClips(escena,CLIPS_H,pose);

// ---- Capa por código, encima de los clips (como en el vídeo de referencia): el cuerpo se echa hacia donde acelera, se inclina al girar y recibe el retroceso del arma ----
import * as THREE from 'three';
const q1=new THREE.Quaternion(),e1=new THREE.Euler(),R=Math.PI/180,cl=(v,a,b)=>v<a?a:v>b?b:v,suma=(b,x,y,z)=>{if(b)b.quaternion.multiply(q1.setFromEuler(e1.set(x*R,y*R,z*R,'XYZ')));};
export function creaCapa(inst){if(!inst.mixer)return;const h={};inst.body.traverse(o=>{if(o.isBone)h[o.name.replace('mixamorig','')]=o;});inst.capa={h,va:0,ac:0,ang:null,giro:0,lean:0,roll:0};}
// o: {v: velocidad real (m/s), vtop: velocidad máxima de andar, ang: hacia dónde apunta (rad), disp: 0-1 retroceso reciente, corre}
export function capa(inst,dt,o){const c=inst.capa;if(!c||dt<=0)return;const k=Math.min(1,dt*8);
  if(c.ang!==null){let d=o.ang-c.ang;while(d>Math.PI)d-=6.2831853;while(d<-Math.PI)d+=6.2831853;c.giro+=(d/dt-c.giro)*k;c.ac+=((o.v-c.va)/dt-c.ac)*Math.min(1,dt*5);}
  c.ang=o.ang;c.va=o.v;const sv=cl(o.v/Math.max(o.vtop,.1),0,2.5);
  const lean=cl(c.ac*.9,-9,9)*cl(sv*2,0,1)+(o.corre?5:0)*cl(sv,0,1),roll=cl(-c.giro*3.2,-9,9)*cl(sv*1.5,.3,1); // arrancar → adelante · frenar → atrás · girar → se ladea hacia dentro
  c.lean+=(lean-c.lean)*Math.min(1,dt*10);c.roll+=(roll-c.roll)*Math.min(1,dt*10);const r=cl(o.disp,0,1),h=c.h;
  suma(h.Spine,c.lean*.6-5*r,0,c.roll*.5);suma(h.Spine2,c.lean*.4-3.5*r,0,c.roll*.4);suma(h.Head,-c.lean*.3-3*r,0,-c.roll*.3);suma(h.LeftArm,-6*r,0,0);suma(h.RightArm,-8*r,0,0);}
