// Ragdoll ligero (solo visual): un esqueleto de 17 partículas con peso que cae al suelo, choca con los obstáculos (puede quedar echado sobre una valla o una caja)
// y gobierna los huesos del modelo. Sirve para zombis muertos por un disparo o una explosión y para zombis derribados por una explosión (que luego se levantan).
// No toca la simulación del juego (norma 3): solo lee obstáculos y escribe huesos. Sin librerías externas.
import * as THREE from 'three';
export const mundo={obst:[],OBJ:{}}; // los rellena zombies.js (evita importaciones circulares)
const P='mixamorig',NOM=['Hips','Spine','Spine2','Neck','Head','LeftArm','LeftForeArm','LeftHand','RightArm','RightForeArm','RightHand','LeftUpLeg','LeftLeg','LeftFoot','RightUpLeg','RightLeg','RightFoot'];
const PADRE=[-1,0,1,2,3,2,5,6,2,8,9,0,11,12,0,14,15],HIJO={1:2,3:4,5:6,6:7,8:9,9:10,11:12,12:13,14:15,15:16};
const RAD=[.1,.1,.12,.07,.12,.06,.05,.05,.06,.05,.05,.08,.07,.07,.08,.07,.07]; // grosor de cada partícula (m): el cuerpo no se hunde en el suelo
const ENLACES=[[0,1],[1,2],[2,3],[3,4],[2,5],[5,6],[6,7],[2,8],[8,9],[9,10],[0,11],[11,12],[12,13],[0,14],[14,15],[15,16], // huesos
  [5,8],[11,14],[2,11],[2,14],[3,5],[3,8],[0,3],[4,2],[1,5],[1,8],[1,11],[1,14],[0,2],[1,3]]; // refuerzos: el tronco, los hombros y la cadera no se pliegan
const G=-15,DT=1/60,MAX=8,V=THREE.Vector3,Q=THREE.Quaternion;
const ACT=[]; // ragdolls en marcha (como mucho MAX: el más antiguo se queda congelado en su postura)
const a=new V(),b=new V(),c=new V(),qa=new Q(),qb=new Q(),qc=new Q(),qd=new Q(),bq=new Q();
function crea(inst){const h=NOM.map(n=>inst.body.getObjectByName(P+n));if(h.some(x=>!x))return null;
  const dir={};for(const k in HIJO)dir[k]=h[HIJO[k]].position.clone().normalize(); // sin giro en reposo (esqueleto_auto): la posición local del hijo es su dirección de reposo
  return {inst,h,dir,upH:h[1].position.clone(),sdH:h[11].position.clone().sub(h[14].position),upS:h[3].position.clone(),sdS:h[5].position.clone().sub(h[8].position),
    p:NOM.map(()=>new V()),q:NOM.map(()=>new V()),len:ENLACES.map(()=>0),activo:false,dormido:false,t:0,calma:0,acc:0,lev:null,wq:NOM.map(()=>new Q())};}
// Orientación del hueso a partir de dos direcciones (arriba y lado) respecto a su postura de reposo.
function base(out,restUp,restSide,up,side){qa.copy(bq);a.copy(restUp).applyQuaternion(bq).normalize();b.copy(restSide).applyQuaternion(bq);qb.setFromUnitVectors(a,up);b.applyQuaternion(qb);
  const d1=b.sub(c.copy(up).multiplyScalar(b.dot(up))),d2=c.copy(side).sub(a.copy(up).multiplyScalar(side.dot(up))),ang=Math.atan2(up.dot(a.copy(d1).cross(d2)),d1.dot(d2));
  qc.setFromAxisAngle(up,ang);return out.copy(qc).multiply(qb).multiply(bq);}
// ---- control ----
// opciones: vx, vz (velocidad que traía el zombi), dx, dz (dirección del golpe), fuerza (m/s), hueso (índice del hueso golpeado)
export function iniciaRagdoll(inst,{vx=0,vz=0,dx=0,dz=0,fuerza=3,hueso=2,lift=.25}={}){const rd=inst.rd||(inst.rd=crea(inst));if(!rd)return false;
  inst.root.updateMatrixWorld(true);rd.h.forEach((o,i)=>{o.getWorldPosition(rd.p[i]);});
  ENLACES.forEach((e,k)=>{rd.len[k]=rd.p[e[0]].distanceTo(rd.p[e[1]]);});
  const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;
  rd.p.forEach((p,i)=>{const w=i===hueso?1:.5,k=w*fuerza;rd.q[i].set(p.x-(vx+dx*k)*DT,p.y-(lift*fuerza*(i===hueso?1.4:1))*DT,p.z-(vz+dz*k)*DT);}); // velocidad inicial = la que traía + el golpe (más fuerte en el hueso golpeado) + un poco hacia arriba
  rd.nt=0;rd.cerca=[];rd.activo=true;rd.dormido=false;rd.t=0;rd.calma=0;rd.acc=0;rd.lev=null;rd.fuerza=fuerza;
  const i=ACT.indexOf(rd);if(i>=0)ACT.splice(i,1);ACT.push(rd);while(ACT.length>MAX){const o=ACT.shift();o.dormido=true;} // el más viejo se queda tal cual está
  return true;}
export function reiniciaRagdoll(inst){const rd=inst.rd;if(!rd)return;rd.activo=false;rd.lev=null;rd.dormido=false;const i=ACT.indexOf(rd);if(i>=0)ACT.splice(i,1);}
const alto=o=>o.wall?3:(mundo.OBJ[o.key]&&mundo.OBJ[o.key].alto)||(o.key==='car'?1:.85);
function choca(p,q,r,cerca){const x0=p.x,z0=p.z;
  if(p.y<r){p.y=r;q.x+=(p.x-q.x)*.18;q.z+=(p.z-q.z)*.18;} // suelo con rozamiento
  for(const o of cerca){const dx=p.x-o.x,dz=p.z-o.z,dd=Math.hypot(dx,dz),m=o.r+r,h=alto(o);if(dd>=m||p.y>=h+r)continue;
    const emp=m-dd,sub=h+r-p.y;if(sub<emp*.9||dd<1e-4){p.y=h+r;q.x+=(p.x-q.x)*.15;q.z+=(p.z-q.z)*.15;} // cerca de arriba: se apoya encima (queda echado sobre la valla)
    else{p.x=o.x+dx/dd*m;p.z=o.z+dz/dd*m;}}
  return Math.hypot(p.x-x0,p.z-z0);}
export function pasoRagdoll(inst,dt){const rd=inst.rd;if(!rd||!rd.activo)return;rd.acc+=dt;let n=0;
  while(rd.acc>=DT&&n<3){rd.acc-=DT;n++;rd.t+=DT;
    if(!rd.dormido){let ek=0;
      rd.p.forEach((p,i)=>{const q=rd.q[i],vx=(p.x-q.x)*.992,vy=(p.y-q.y)*.998,vz=(p.z-q.z)*.992;q.copy(p);p.x+=vx;p.y+=vy+G*DT*DT;p.z+=vz;ek+=vx*vx+vy*vy+vz*vz;});
      if(--rd.nt<=0){const c0=rd.p[0];rd.cerca=mundo.obst.filter(o=>!o.fly&&Math.abs(o.x-c0.x)<3.3&&Math.abs(o.z-c0.z)<3.3);rd.nt=10;} // solo los obstáculos cercanos al cuerpo (hay cientos en el mapa)
      for(let it=0;it<4;it++){ENLACES.forEach((e,k)=>{const A=rd.p[e[0]],B=rd.p[e[1]],d=a.copy(B).sub(A),l=d.length()||1e-6,f=(l-rd.len[k])/l*.5;A.addScaledVector(d,f);B.addScaledVector(d,-f);});
        rd.p.forEach((p,i)=>choca(p,rd.q[i],RAD[i],rd.cerca));}
      rd.calma=ek<.0004?rd.calma+DT:0;if(rd.calma>.5&&rd.t>.8||rd.t>(rd.fuerza>8?6:4.5))rd.dormido=true;}}
  pon(rd);}
// escribe los huesos a partir de las partículas
function pon(rd){const {inst,h,dir,wq}=rd,root=inst.root,P0=rd.p[0];root.position.set(P0.x,0,P0.z);root.updateMatrixWorld(true);inst.body.getWorldQuaternion(bq);
  h[0].position.copy(inst.body.worldToLocal(a.copy(P0)));
  const up=new V(),sd=new V();
  for(let i=0;i<NOM.length;i++){const par=PADRE[i],pq=par<0?bq:wq[par];
    if(i===0){up.copy(rd.p[1]).sub(rd.p[0]).normalize();sd.copy(rd.p[11]).sub(rd.p[14]);base(wq[0],rd.upH,rd.sdH,up,sd);}
    else if(i===2){up.copy(rd.p[3]).sub(rd.p[2]).normalize();sd.copy(rd.p[5]).sub(rd.p[8]);base(wq[2],rd.upS,rd.sdS,up,sd);}
    else if(HIJO[i]!==undefined){up.copy(rd.p[HIJO[i]]).sub(rd.p[i]).normalize();a.copy(dir[i]).applyQuaternion(bq).normalize();wq[i].copy(qa.setFromUnitVectors(a,up)).multiply(bq);}
    else{wq[i].copy(pq);h[i].quaternion.identity();continue;} // extremos (cabeza, manos, pies): siguen a su hueso
    h[i].quaternion.copy(qd.copy(pq).invert()).multiply(wq[i]);}
  inst.body.updateMatrixWorld(true);}
// ---- levantarse tras un derribo: se mezcla desde la postura caída hacia la animación normal ----
export function levantaRagdoll(inst){const rd=inst.rd;if(!rd||!rd.activo)return;rd.activo=false;rd.lev={t:0,q:rd.h.map(o=>o.quaternion.clone()),p:rd.h[0].position.clone()};
  const i=ACT.indexOf(rd);if(i>=0)ACT.splice(i,1);}
export function mezclaLevanta(inst,dt){const rd=inst.rd;if(!rd||!rd.lev)return false;const l=rd.lev;l.t+=dt;const u=Math.min(1,l.t/.9),s=u*u*(3-2*u),w=1-s;
  rd.h.forEach((o,i)=>o.quaternion.slerp(l.q[i],w));rd.h[0].position.lerp(l.p,w);if(u>=1){rd.lev=null;return false;}return true;}
