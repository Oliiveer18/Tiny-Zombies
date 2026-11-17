// Animación de los zombis con esqueleto propio (tools/esqueleto_auto.mjs): clips generados por código a partir de una tabla de parámetros
// + controlador que los mezcla con AnimationMixer y añade ajustes por código (inclinarse al girar y al frenar, encajar golpes, seguir con la cabeza).
// No decide nada del juego: solo lee el estado del zombi (percepcion.js / zombies.js) y lo dibuja. Cuando exista anim.js (PAQ-A1/A3) se integra allí.
// Ejes de los huesos (sin giro en reposo, pose T, mirando a +Z): X = cabecear (positivo hacia delante) · Y = girar · Z = ladear. Ángulos en grados.
import * as THREE from 'three';
const P='mixamorig', R=Math.PI/180, S=p=>Math.sin(6.2831853*p), C=p=>Math.cos(6.2831853*p), pos=v=>v>0?v:0, mez=(a,b,t)=>a+(b-a)*t, sua=t=>{t=t<0?0:t>1?1:t;return t*t*(3-2*t);};
// Parámetros de cada clip (contenido como datos): duración en s, si se repite, y amplitudes en grados o en fracciones de la altura.
export const CLIPS={
  idle:  {dur:3.2,loop:true,  tronco:30,cabeza:34,vaiven:2.5,rodilla:10},                       // dormido de pie: encorvado, cabeza caída, se mece
  stand: {dur:2.4,loop:true,  tronco:9,cabeza:6,vaiven:2},                                       // despierto y quieto
  wake:  {dur:1.0,loop:false, sacudida:16},                                                      // de dormido a despierto, con un espasmo
  walk:  {dur:1.25,loop:true, zancada:20,rodilla:38,tronco:13,cojera:.7,brazo:11,bote:.012},     // deambular: arrastra una pierna, brazos colgando
  run:   {dur:.85,loop:true,  zancada:27,rodilla:55,tronco:22,cojera:.85,bote:.02,alcance:68},   // perseguir: echado hacia delante, brazos por delante
  attack:{dur:.9,loop:true,   tronco:22,alcance:80},                                             // zarpazo con los dos brazos, uno por golpe
  die:   {dur:1.15,loop:false}};                                                                 // se le doblan las rodillas y cae de espaldas
// Pose de cada clip en la fase p (0-1). Devuelve {hueso:[x,y,z]} y `hy` (bajada de la cadera) / `hz`.
const BR=72; // brazos caídos desde la pose T
function pose(n,p){const c=CLIPS[n],o={LeftArm:[0,0,-BR],RightArm:[0,0,BR],LeftForeArm:[0,-14,0],RightForeArm:[0,14,0],hy:0,hz:0};
  if(n==='idle'||n==='stand'){const v=c.vaiven,s=S(p),s2=S(p*2+.15);
    o.Hips=[0,0,v*.6*s];o.Spine=[c.tronco*.55+v*.4*s2,0,-v*s];o.Spine2=[c.tronco*.45,0,0];o.Neck=[c.cabeza*.4,0,0];o.Head=[c.cabeza*.6+v*.5*s2,n==='idle'?0:6*s,n==='idle'?9:4];
    o.LeftArm=[n==='idle'?-34:6,0,-BR-8+s];o.RightArm=[n==='idle'?-34:6,0,BR+8+s];
    if(c.rodilla){o.LeftUpLeg=[-c.rodilla*.5,0,0];o.RightUpLeg=[-c.rodilla*.5,0,0];o.LeftLeg=[c.rodilla,0,0];o.RightLeg=[c.rodilla,0,0];o.hy=-.012;}}
  else if(n==='wake'){const a=CLIPS.idle,b=CLIPS.stand,t=sua(p*1.4),e=c.sacudida*S(p*2.5)*(1-p); // espasmo que se apaga
    o.Spine=[mez(a.tronco*.55,b.tronco*.55,t)-e*.6,e*.5,0];o.Spine2=[mez(a.tronco*.45,b.tronco*.45,t),-e*.4,0];o.Neck=[mez(a.cabeza*.4,b.cabeza*.4,t),0,0];o.Head=[mez(a.cabeza*.6,b.cabeza*.6,t)-e,e*.8,mez(9,4,t)];
    o.LeftArm=[mez(-34,6,t),0,-BR-8-e];o.RightArm=[mez(-34,6,t),0,BR+8+e*.6];const k=a.rodilla*(1-t);o.LeftUpLeg=[-k*.5,0,0];o.RightUpLeg=[-k*.5,0,0];o.LeftLeg=[k,0,0];o.RightLeg=[k,0,0];o.hy=-.012*(1-t);}
  else if(n==='walk'||n==='run'){const A=c.zancada,cj=c.cojera,s=S(p),k=C(p);
    o.LeftUpLeg=[-A*s,0,0];o.LeftLeg=[c.rodilla*pos(k)+6,0,0];o.LeftFoot=[8*s,0,0];
    o.RightUpLeg=[A*cj*s,0,0];o.RightLeg=[c.rodilla*cj*pos(-k)+6,0,0];o.RightFoot=[-8*cj*s,0,0];
    o.Hips=[0,7*s,3.5*s+(cj<1?2:0)];o.hy=-c.bote*(1+C(p*2))-.006;
    o.Spine=[c.tronco*.6,0,-3*s];o.Spine2=[c.tronco*.4,-9*s,0];o.Neck=[n==='run'?-12:6,0,0];o.Head=[n==='run'?-14+3*S(p*2):9,5*s,n==='run'?5:9+3*s];
    if(c.alcance){const b=4*S(p*2);o.LeftArm=[0,-c.alcance+6*s,-16+b];o.RightArm=[0,c.alcance-14+6*s,22+b];o.LeftForeArm=[0,-18-8*s,0];o.RightForeArm=[0,30+8*s,0];o.LeftHand=[0,0,-18];o.RightHand=[0,0,18];}
    else{o.LeftArm=[c.brazo*s+8,0,-BR-4];o.RightArm=[-c.brazo*cj*s+8,0,BR+8];o.LeftForeArm=[0,-10-6*pos(-s),0];o.RightForeArm=[0,10,0];}}
  else if(n==='attack'){const w=sua(p/.3),g=sua((p-.3)/.18),v=sua((p-.6)/.4),f=w*(1-g),h=g*(1-v); // f: armar el golpe · h: descargarlo · v: volver
    o.Spine=[CLIPS.stand.tronco*.55-10*f+c.tronco*.6*h,8*f-8*h,0];o.Spine2=[5-6*f+c.tronco*.4*h,0,0];o.Neck=[-8*f+10*h,0,0];o.Head=[-10*f+14*h,0,4];
    o.LeftArm=[0,-c.alcance+25*f,-10+45*f-40*h];o.RightArm=[0,c.alcance-25*f,10-45*f+40*h];o.LeftForeArm=[0,-55*f-10,0];o.RightForeArm=[0,55*f+10,0];o.LeftHand=[0,0,-25];o.RightHand=[0,0,25];
    o.LeftUpLeg=[-14*h-4,0,0];o.LeftLeg=[14*h+8,0,0];o.RightUpLeg=[8*h+4,0,0];o.RightLeg=[8,0,0];o.hz=.03*h;o.hy=-.01-.012*h;}
  else if(n==='die'){const a=sua(p/.35),b=sua((p-.2)/.8),bb=b*b*(3-2*b)*(1+.06*S(pos(p-.85)*3)); // a: se doblan las rodillas · b: cae de espaldas
    o.Hips=[-88*bb,10*b,0];o.hy=-.1*a*(1-b)-(1-.075)*0; o.caida=b;
    o.LeftUpLeg=[-30*a*(1-b)-6*b,0,5*b];o.RightUpLeg=[-22*a*(1-b)+4*b,0,-8*b];o.LeftLeg=[55*a*(1-b)+10*b,0,0];o.RightLeg=[45*a*(1-b)+22*b,0,0];
    o.Spine=[12*(1-b)-6*b,0,0];o.Spine2=[6*(1-b),0,0];o.Head=[-20*a*(1-b)+12*b,14*b,0];o.LeftArm=[0,-20*a*(1-b),-BR+52*b];o.RightArm=[0,20*a*(1-b),BR-38*b];o.LeftForeArm=[0,-20,0];o.RightForeArm=[0,35*b+10,0];}
  return o;}
const HUESOS=['Hips','Spine','Spine2','Neck','Head','LeftArm','LeftForeArm','LeftHand','RightArm','RightForeArm','RightHand','LeftUpLeg','LeftLeg','LeftFoot','RightUpLeg','RightLeg','RightFoot'];
const eu=new THREE.Euler(),qq=new THREE.Quaternion();
// Crea los AnimationClip para un modelo cargado (necesita la posición de reposo de la cadera). 30 muestras por segundo.
export function clipsZombi(escena){const cad=escena.getObjectByName(P+'Hips');if(!cad)return [];const h0=cad.position.clone(),out=[];
  for(const n in CLIPS){const c=CLIPS[n],N=Math.max(2,Math.round(c.dur*30)),t=new Float32Array(N+1),q={},hp=new Float32Array((N+1)*3);for(const b of HUESOS)q[b]=new Float32Array((N+1)*4);
    for(let i=0;i<=N;i++){const p=i/N,o=pose(n,c.loop&&i===N?0:p);t[i]=p*c.dur;
      for(const b of HUESOS){const e=o[b]||[0,0,0];qq.setFromEuler(eu.set(e[0]*R,e[1]*R,e[2]*R,'XYZ'));q[b].set([qq.x,qq.y,qq.z,qq.w],i*4);}
      const y=o.caida?mez(h0.y+o.hy,.1,o.caida):h0.y+o.hy;hp.set([h0.x,y,h0.z+o.hz],i*3);} // al caer, la cadera baja hasta quedar tumbado en el suelo
    const tr=HUESOS.map(b=>new THREE.QuaternionKeyframeTrack(P+b+'.quaternion',t,q[b]));tr.push(new THREE.VectorKeyframeTrack(P+'Hips.position',t,hp));out.push(new THREE.AnimationClip(n,c.dur,tr));}
  return out;}
// Velocidad (en alturas del modelo por segundo) a la que avanza cada clip de andar sin patinar: dos pasos por ciclo, pierna ≈ 0,38 de la altura (cuerpo compacto de Meshy, cadera a 0,38).
const nominal=n=>{const c=CLIPS[n];return 4*.38*Math.sin(c.zancada*R)*(1+c.cojera)/2/c.dur;};
const BUCLES=['idle','stand','walk','run','attack'],TAU={attack:.09,idle:.3,stand:.2,walk:.22,run:.22};
// ---- Controlador por zombi ----
export function creaAnim(inst,escala){if(!inst.mixer||!inst.actions.walk)return null;const h={};inst.body.traverse(o=>{if(o.isBone)h[o.name.replace(P,'')]=o;});
  const c={inst,h,escala,w:{idle:1,stand:0,walk:0,run:0,attack:0},v:0,va:0,ac:0,giro:0,ang:null,px:null,pz:0,fl:0,fls:1,mira:0,est:null,muerto:false};
  for(const n of BUCLES){const a=inst.actions[n];a.setLoop(THREE.LoopRepeat).play();a.setEffectiveWeight(c.w[n]);}
  for(const n of ['wake','die']){const a=inst.actions[n];a.setLoop(THREE.LoopOnce);a.clampWhenFinished=true;a.setEffectiveWeight(0);}
  inst.actions.walk.time=inst.actions.run.time=0;inst.ctl=c;return c;}
export function revive(inst){const c=inst.ctl;if(!c)return;c.muerto=false;c.est=null;c.fl=0;c.px=null;c.ang=null;c.v=c.ac=c.giro=c.mira=0;inst.actions.die.stop();inst.actions.wake.stop();c.ww=0;c.wd=0;for(const n of BUCLES)c.w[n]=n==='idle'?1:0;}
export function golpe(inst,lado){const c=inst.ctl;if(c){c.fl=1;c.fls=lado<0?-1:1;}} // encaja un impacto (lado: de dónde vino, para girar el torso)
export function muere(inst){const c=inst.ctl;if(!c||c.muerto)return;c.muerto=true;c.wd=0;const a=inst.actions.die;a.reset().play();a.setEffectiveWeight(0);}
const q1=new THREE.Quaternion(),e1=new THREE.Euler();
function suma(b,x,y,z){if(b)b.quaternion.multiply(q1.setFromEuler(e1.set(x*R,y*R,z*R,'XYZ')));}
// o: {estado:'dormido'|'despertando'|'persigue'|'deambula', cerca, x, z, ang (hacia dónde mira, rad), tDesp, jx, jz (jugador), quieto}
export function anima(inst,dt,o){const c=inst.ctl,A=inst.actions;if(!c||dt<=0)return;
  // velocidad real, aceleración y velocidad de giro, suavizadas (de ahí salen el ritmo del paso y las inclinaciones)
  if(c.px!==null){const v=Math.hypot(o.x-c.px,o.z-c.pz)/dt,k=Math.min(1,dt*8);c.v+=(v-c.v)*k;const a=(c.v-c.va)/dt;c.ac+=(a-c.ac)*Math.min(1,dt*5);c.va=c.v;
    let d=o.ang-c.ang;while(d>Math.PI)d-=6.2831853;while(d<-Math.PI)d+=6.2831853;c.giro+=(d/dt-c.giro)*k;}
  c.px=o.x;c.pz=o.z;c.ang=o.ang;
  const anda=c.v>.12*c.escala,t={idle:0,stand:0,walk:0,run:0,attack:0};let wake=0;
  if(c.muerto){}else if(o.estado==='dormido')t.idle=1;else if(o.estado==='despertando'){wake=1;if(c.est!=='despertando'){A.wake.reset().play();A.wake.timeScale=CLIPS.wake.dur/Math.max(.3,o.tDesp||1);}}
  else if(o.cerca)t.attack=1;else if(!anda)t.stand=1;else if(o.estado==='deambula')t.walk=1;else t.run=1;
  if(o.cerca&&c.w.attack<.05)A.attack.time=0; // el zarpazo empieza desde el principio
  c.est=o.estado;
  for(const n of BUCLES){c.w[n]+=(t[n]-c.w[n])*Math.min(1,dt/TAU[n]);A[n].setEffectiveWeight(c.w[n]);}
  c.ww=(c.ww||0)+(wake-(c.ww||0))*Math.min(1,dt/.12);A.wake.setEffectiveWeight(c.ww);
  if(c.muerto){c.wd=Math.min(1,(c.wd||0)+dt/.1);A.die.setEffectiveWeight(c.wd);}
  // el paso sigue a la velocidad real para que los pies no patinen
  const esc=n=>THREE.MathUtils.clamp(c.v/(nominal(n)*c.escala),.45,1.9);A.walk.timeScale=esc('walk');A.run.timeScale=esc('run');
  inst.mixer.update(dt);
  // ---- ajustes por código, encima de los clips ----
  if(c.muerto)return;
  const mov=Math.min(1,c.w.walk+c.w.run),ladeo=THREE.MathUtils.clamp(-c.giro*5,-14,14)*mov,freno=THREE.MathUtils.clamp(-c.ac*3/c.escala,-12,10)*Math.min(1,mov+c.w.stand); // gira → se ladea hacia dentro; frena → se echa atrás; arranca → hacia delante
  c.fl=Math.max(0,c.fl-dt*5);const f=c.fl*c.fl;
  suma(c.h.Spine,-freno-20*f,0,ladeo*.5);suma(c.h.Spine2,-8*f,14*f*c.fls,ladeo*.5);
  // la cabeza busca al jugador (o el ruido) antes que el cuerpo
  let m=0;if(o.estado!=='dormido'&&o.jx!==undefined){let d=Math.atan2(o.jx-o.x,o.jz-o.z)-o.ang;while(d>Math.PI)d-=6.2831853;while(d<-Math.PI)d+=6.2831853;m=THREE.MathUtils.clamp(d/R,-55,55);}
  c.mira+=(m-c.mira)*Math.min(1,dt*6);suma(c.h.Neck,0,c.mira*.4,0);suma(c.h.Head,-14*f,c.mira*.6,0);}
