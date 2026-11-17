// Clips del protagonista y demás humanos con el esqueleto de tools/esqueleto_auto.mjs, generados por código con el mismo generador que los zombis.
// Nombres lógicos = los que ya usa player.js: idle · walk · run · shoot_side (apuntar quieto) · shoot_fwd / shoot_back (apuntar andando) · reload · die.
// Ejes: X cabecear (+ hacia delante) · Y girar · Z ladear; el brazo izquierdo (+X) se lleva hacia delante con Y negativo, el derecho con Y positivo.
// Sin arma en las manos todavía: el arma será una pieza (3.11) y se colocará en la mano derecha; la postura ya es la de sostener un fusil.
import { generaClips } from './anim_zombi.js';
const S=p=>Math.sin(6.2831853*p),C=p=>Math.cos(6.2831853*p),pos=v=>v>0?v:0,sua=t=>{t=t<0?0:t>1?1:t;return t*t*(3-2*t);};
export const CLIPS_H={idle:{dur:3.4,loop:true},walk:{dur:.95,loop:true,zancada:24,rodilla:34},run:{dur:.62,loop:true,zancada:38,rodilla:72},
  shoot_side:{dur:1.6,loop:true},shoot_fwd:{dur:.95,loop:true,zancada:20,rodilla:30},shoot_back:{dur:.95,loop:true,zancada:-20,rodilla:30},reload:{dur:1.8,loop:true},die:{dur:1.2,loop:false}};
// Velocidad que recorre cada clip, en alturas del modelo por segundo (pierna ≈ 0,38): la usa player.js para que los pies no patinen
export const VEL_H=Object.fromEntries(Object.entries(CLIPS_H).filter(([,c])=>c.zancada).map(([n,c])=>[n,Math.abs(4*.38*Math.sin(c.zancada*Math.PI/180)/c.dur)]));
const BR=70; // brazos caídos desde la pose T
const apunta=(o,b)=>{o.LeftArm=[0,-78,-26+b];o.RightArm=[0,80,26-b];o.LeftForeArm=[0,-34,0];o.RightForeArm=[0,26,0];o.LeftHand=[0,0,-10];o.RightHand=[0,0,10];o.Spine=[(o.Spine||[0])[0]+3,-14,0];o.Spine2=[2,-10,0];o.Neck=[0,12,0];o.Head=[-4,14,0];}; // fusil al hombro, torso algo girado
function pose(n,p){const c=CLIPS_H[n],o={LeftArm:[0,0,-BR],RightArm:[0,0,BR],LeftForeArm:[0,-14,0],RightForeArm:[0,14,0],hy:0,hz:0};
  if(n==='idle'){const s=S(p);o.Hips=[0,0,.8*s];o.Spine=[2+1.2*S(p*2),0,-.8*s];o.Spine2=[2,0,0];o.Head=[1,0,0];o.LeftArm=[0,0,-BR-1+s];o.RightArm=[0,0,BR+1-s];}
  else if(n==='walk'||n==='run'){const A=c.zancada,s=S(p),k=C(p),r=n==='run';
    o.LeftUpLeg=[-A*s,0,0];o.LeftLeg=[c.rodilla*pos(k)+4,0,0];o.LeftFoot=[8*s,0,0];o.RightUpLeg=[A*s,0,0];o.RightLeg=[c.rodilla*pos(-k)+4,0,0];o.RightFoot=[-8*s,0,0];
    o.Hips=[0,6*s,3*s];o.hy=-(r?.022:.011)*(1+C(p*2))-.004;o.Spine=[r?12:4,0,-2*s];o.Spine2=[r?4:2,-8*s,0];o.Head=[r?-6:-1,3*s,0];
    const sw=r?34:18;o.LeftArm=[sw*s,0,-BR+(r?10:0)];o.RightArm=[-sw*s,0,BR-(r?10:0)];o.LeftForeArm=[0,-(r?80:14)-(r?8:0)*s,0];o.RightForeArm=[0,(r?80:14)+(r?8:0)*s,0];}
  else if(n==='shoot_side'||n==='shoot_fwd'||n==='shoot_back'){const b=1.2*S(p);apunta(o,b);o.Hips=[0,0,0];
    if(c.zancada){const A=Math.abs(c.zancada),d=Math.sign(c.zancada)||1,s=S(p)*d,k=C(p)*d;o.LeftUpLeg=[-A*s,0,0];o.LeftLeg=[c.rodilla*pos(k)+4,0,0];o.RightUpLeg=[A*s,0,0];o.RightLeg=[c.rodilla*pos(-k)+4,0,0];o.hy=-.01*(1+C(p*2))-.004;}
    else{o.LeftUpLeg=[-2,0,0];o.RightUpLeg=[2,0,0];}}
  else if(n==='reload'){const a=sua(p/.2)*(1-sua((p-.8)/.2)),m=S(p*2)*a; // baja el arma, cabecea hacia ella, maniobra con la mano izquierda y la sube
    apunta(o,0);o.LeftArm=[0,-60-10*m,-48*a-10];o.LeftForeArm=[0,-70*a-30,0];o.RightArm=[0,70,34*a+20];o.Spine=[9*a,-6*a,0];o.Head=[14*a,10-10*a,0];o.Neck=[8*a,0,0];}
  else if(n==='die'){const a=sua(p/.3),b=sua((p-.2)/.8),bb=b*b*(3-2*b);
    o.Hips=[-88*bb,8*b,0];o.hy=-.1*a*(1-b);o.caida=b;o.LeftUpLeg=[-26*a*(1-b)-4*b,0,4*b];o.RightUpLeg=[-18*a*(1-b)+4*b,0,-6*b];o.LeftLeg=[50*a*(1-b)+8*b,0,0];o.RightLeg=[40*a*(1-b)+16*b,0,0];
    o.Spine=[10*(1-b),0,0];o.Head=[-16*a*(1-b)+8*b,10*b,0];o.LeftArm=[0,-14*a*(1-b),-BR+50*b];o.RightArm=[0,14*a*(1-b),BR-36*b];o.LeftForeArm=[0,-18,0];o.RightForeArm=[0,30*b+10,0];}
  return o;}
export const clipsHumano=escena=>generaClips(escena,CLIPS_H,pose);
