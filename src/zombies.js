import { blood } from './decals.js';
import * as THREE from 'three';
import { instance, play } from './assets.js';
import { obstacles, FIELD } from './world.js';
import { player } from './player.js';
import { TEST, VIVO, LAYOUT, LUGAR } from './test.js'; import { MODELS } from './models.config.js'; import { creaAnim, revive, golpe, muere, anima, levantaAnim } from './anim_zombi.js'; import { iniciaRagdoll, impactoRagdoll, pasoRagdoll, mundo as mundoRd } from './ragdoll.js'; import { OBJ } from './world.js'; import { ruido, tickRuido } from './ruido.js'; import { P, configuraPercepcion, prepara, paso, despierta } from './percepcion.js'; import DATOS from './data/ruido.json'; import { topSpeed } from './player.js'; import { impact } from './effects.js'; import { mulberry, hash, WORLD_SEED } from './sim.js';
export const TYPES={normal:{model:'zombie',hp:3,sp:2.3,dmg:8,r:.35,pts:10,pool:36},runner:{model:'runner',hp:2,sp:4.3,dmg:5,r:.3,pts:15,pool:24},tank:{model:'tank',hp:14,sp:1.6,dmg:20,r:.55,pts:50,pool:6}};
export const zombies=[]; const free={};let scene;const rnd=mulberry(hash(WORLD_SEED,1)); // canal 1 = zombis
const LEJOS=26; // m: a más distancia el zombi no se dibuja ni anima (lo más lejano que se ve está a ≈ 19 m; DECISIONES 2.2). Su lógica sigue igual.
configuraPercepcion(DATOS.percepcion);
export const state={wave:0,queue:0,spawnT:0,inter:2,score:0,alive:0,onHurt:null};
export function initZombies(s){scene=s;mundoRd.obst=obstacles;mundoRd.OBJ=OBJ;for(const [k,t] of Object.entries(TYPES)){free[k]=[];for(let i=0;i<t.pool;i++){
  const inst=instance(t.model);creaAnim(inst,MODELS[t.model].scale||1);inst.root.visible=false;scene.add(inst.root);const z={id:'z'+zombies.length,type:k,t,inst,alive:false,x:0,z:0,hp:0,atk:0,dead:0,ph:rnd()*6,vx:0,vz:0};zombies.push(z);free[k].push(z);}}}
function place(z,x,zz,giro,estado){z.home={x,z:zz};z.tipo=z.type;z.r=z.t.r;z.x=x;z.z=zz;z.hp=z.t.hp;z.alive=true;z.dead=0;z.atk=0;z.dying=false;z.lejos=false;z.inst.root.visible=true;z.inst.root.rotation.set(0,0,0);z.inst.body.rotation.set(0,0,0);z.inst.body.position.y=0;revive(z.inst);state.alive++;prepara(z,+z.id.slice(1),giro,estado);}
export function resetZombies(){for(const z of zombies)kill(z,true);Object.assign(state,{wave:0,queue:0,spawnT:0,inter:2,score:0});
  if(TEST)for(const [k,x,zz,giro,estado] of LAYOUT.zombies){const z=free[k].pop();if(z){place(z,x,zz,giro,estado);z.inst.root.position.set(x,0,zz);}}} // mapa de prueba: zombis fijos
function spawn(){
  const w=state.wave;let k='normal',r=rnd();if(w>=3&&r<Math.min(.03*w,.15))k='tank';else if(w>=2&&r<Math.min(.12+.04*w,.4))k='runner';
  const z=free[k].pop();if(!z)return false;
  const a=rnd()*6.28,d=22;z.x=player.x+Math.cos(a)*d;z.z=player.z+Math.sin(a)*d;
  const L=FIELD-1;z.x=THREE.MathUtils.clamp(z.x,-L,L);z.z=THREE.MathUtils.clamp(z.z,-L,L);
  z.hp=z.t.hp+Math.floor(w/4);z.alive=true;z.dead=0;z.atk=0;z.lejos=false;z.inst.root.visible=true;z.inst.root.rotation.set(0,0,0);z.inst.body.rotation.set(0,0,0);z.inst.body.position.y=0;
  revive(z.inst);state.alive++;return true;}
function kill(z){z.dying=false;if(z.alive)state.alive--;z.alive=false;z.dead=0;z.inst.root.visible=false;if(!free[z.type].includes(z))free[z.type].push(z);}
// Zona del cuerpo golpeada: el lado sale de por dónde pasó la bala; la altura no se conoce desde arriba, así que se sortea (cabeza 22 %, pecho 48 %, piernas 30 %).
function zona(lat){const u=Math.random(),lado=lat<0?'I':'D';if(u<.22)return {z:'cabeza',h:4};if(u<.7)return Math.abs(lat)>.16?{z:'brazo'+lado,h:lado==='I'?5:8}:{z:'pecho',h:2};return lado==='I'?{z:'piernaI',h:11}:{z:'piernaD',h:14};}
// kx,kz: dirección de la bala (módulo 1) o de la explosión (módulo 14) · lat: distancia lateral del disparo al centro del zombi (con signo)
export function hurt(z,dmg,kx=0,kz=0,lat=0){
  if(!z.alive||z.dead)return;z.hp-=dmg;const fz=Math.hypot(kx,kz),expl=fz>5,dx=kx/(fz||1),dz=kz/(fz||1),zn=zona(expl?0:lat);z.x+=kx*.1;z.z+=kz*.1;
  const c=z.inst.ctl,y=z.inst.root.rotation.y,vel=c?(c.v||0):0;
  if(z.hp<=0){blood(z.x,z.z,1+Math.random()*.4);z.dead=.0001;state.score+=z.t.pts;state.alive--;z.alive=false;z.dying=true;
    if(c&&iniciaRagdoll(z.inst,{vx:Math.sin(y)*vel,vz:Math.cos(y)*vel,dx,dz,fuerza:expl?Math.min(fz*.65,9):2.4+Math.random()*.8,hueso:zn.h,lift:expl?.45:.15}))muere(z.inst,true); // cae como un cuerpo con peso: la dirección y la fuerza dependen del disparo
    else if(c)muere(z.inst);else if(z.inst.actions.die)play(z.inst,'die',true);return;}
  if(expl&&c){z.derribo=2.6;iniciaRagdoll(z.inst,{vx:Math.sin(y)*vel,vz:Math.cos(y)*vel,dx,dz,fuerza:Math.min(fz*.7,10),hueso:2,lift:.5});return;} // vivo pero derribado por una explosión: sale despedido y luego se levanta
  golpe(z.inst,kx*Math.cos(y)-kz*Math.sin(y));if(c)impactoRagdoll(z.inst,{dx,dz,fuerza:1.1+Math.random()*.5,hueso:zn.h});z.stun=.3; // cada disparo ya mueve el cuerpo con física, no solo la muerte
}
export function updateZombies(dt){
  // oleadas
  if(!TEST&&state.queue<=0&&state.alive===0){state.inter-=dt;if(state.inter<=0){state.wave++;state.queue=6+state.wave*4;state.inter=3;state.spawnT=0;state.onWave?.(state.wave);}}
  if(!TEST&&state.queue>0){state.spawnT-=dt;if(state.spawnT<=0&&state.alive<40){if(spawn())state.queue--;state.spawnT=Math.max(.25,.8-state.wave*.05);}}
  if(VIVO)pasoVivo(dt);
  for(const z of zombies){
    if(z.dying){z.dead+=dt;const f=Math.min(z.dead/.4,1);if(z.inst.rd&&z.inst.rd.activo&&!z.inst.rd.pinned){pasoRagdoll(z.inst,dt);z.x=z.inst.root.position.x;z.z=z.inst.root.position.z;}else{if(!z.inst.mixer)z.inst.body.rotation.x=-f*1.5;if(z.inst.ctl)anima(z.inst,dt,{estado:'muerto',x:z.x,z:z.z,ang:z.inst.root.rotation.y});else z.inst.mixer?.update(dt);}
      if(z.dead>(VIVO?1e9:TEST?1.6:8)){z.dying=false;z.inst.root.visible=false;if(TEST&&!VIVO&&z.home)place(z,z.home.x,z.home.z);else free[z.type].push(z);}continue;} // en ?carga reaparecen en su sitio; en el mapa vivo, cuando el jugador cae (resetZombies)
    if(!z.alive)continue;
    if(z.inst.rd&&z.inst.rd.activo&&!z.inst.rd.pinned){pasoRagdoll(z.inst,dt);z.x=z.inst.root.position.x;z.z=z.inst.root.position.z;z.derribo-=dt; // derribado por una explosión
      if(z.derribo<=0||(z.inst.rd.dormido&&z.inst.rd.t>1.2)){z.derribo=0;const y=z.inst.root.rotation.y;z.gx=Math.sin(y);z.gz=Math.cos(y);levantaAnim(z.inst);z.estado='persigue';z.te=0;z.sin=0;z.obj=[player.x,player.z];z.bq=0;z.bloq=false;}continue;}
    let dx=player.x-z.x,dz=player.z-z.z;const d=Math.hypot(dx,dz)||1;dx/=d;dz/=d;
    if(z.lejos){if(d<LEJOS-2){z.lejos=false;z.inst.root.visible=true;}}else if(d>LEJOS){z.lejos=true;z.inst.root.visible=false;} // histéresis de 2 m: sin parpadeo
    if(VIVO){dibujaVivo(z,dt);continue;}
    if(TEST){const r=z.inst.root;r.position.set(z.x,0,z.z);r.rotation.y=Math.atan2(dx,dz);if(z.inst.ctl){if(!z.lejos)anima(z.inst,dt,{estado:'dormido',x:z.x,z:z.z,ang:r.rotation.y});}else if(!z.inst.mixer)z.inst.body.rotation.x=.12;else if(!z.lejos)z.inst.mixer.update(dt);continue;} // quietos: ni se mueven ni atacan
    let sx=dx,sz=dz;
    for(const o of obstacles){if(o.fly)continue;const ox=z.x-o.x,oz=z.z-o.z,od=Math.hypot(ox,oz),min=o.r+z.t.r;
      if(od<min+1.1){const w=(min+1.1-od)/1.1;const cross=ox*dz-oz*dx;const sg=cross>0?1:-1; // rodear por el lado más corto
        sx+=(ox/od)*w*1.6+(-dz*sg)*w*.8;sz+=(oz/od)*w*1.6+(dx*sg)*w*.8;}}
    for(const o of zombies){if(o===z||!o.alive)continue;const ox=z.x-o.x,oz=z.z-o.z,od=Math.hypot(ox,oz);if(od<.7&&od>1e-4){sx+=ox/od*.5;sz+=oz/od*.5;}}
    const sl=Math.hypot(sx,sz)||1;sx/=sl;sz/=sl;
    const near=d<.7*(z.t.r/.35>1.3?1.3:1)+.2;const sp=near?0:z.t.sp*(1+state.wave*.02);
    z.x+=sx*sp*dt;z.z+=sz*sp*dt;
    for(const o of obstacles){if(o.fly)continue;const ox=z.x-o.x,oz=z.z-o.z,od=Math.hypot(ox,oz),min=o.r+z.t.r;if(od<min&&od>1e-4){z.x=o.x+ox/od*min;z.z=o.z+oz/od*min;}}
    z.atk-=dt;if(near&&z.atk<=0){z.atk=.9;state.onHurt?.(z.t.dmg);}
    const r=z.inst.root;r.position.set(z.x,0,z.z);r.rotation.y=Math.atan2(dx,dz);
    if(z.inst.ctl){if(!z.lejos)anima(z.inst,dt,{estado:'persigue',cerca:near,x:z.x,z:z.z,ang:r.rotation.y,jx:player.x,jz:player.z});}
    else if(z.inst.mixer){play(z.inst,near?'attack':'run');if(!z.lejos)z.inst.mixer.update(dt);}
    else{z.ph+=dt*sp*3.5+dt;z.inst.body.position.y=Math.abs(Math.sin(z.ph))*.08;z.inst.body.rotation.z=Math.sin(z.ph)*.12;z.inst.body.rotation.x=near?Math.sin(z.ph*6)*.25+.2:.25;}
  }
}

// ---------- Mapa de prueba «vivo» (PAQ-03) ----------
// La lógica está en percepcion.js (pura). Aquí solo se le pasa el mundo y se dibuja lo que decide: el aspecto no interviene.
const CLIPS=['idle','wake','walk','run','attack','hit','die'],DE={dormido:'idle',despertando:'wake',investiga:'walk',deambula:'walk',persigue:'run'};
// clip lógico → el que tenga el modelo (si falta, el anterior de la lista; si no hay ninguno, null = movimiento por código)
function clip(inst,n){for(let i=CLIPS.indexOf(n);i>=0;i--)if(inst.actions[CLIPS[i]])return CLIPS[i];return null;}
const M={zs:zombies,j:{x:0,z:0,agachado:false,corre:false,vivo:true},muros:LUGAR.muros,obst:obstacles,ruido,tick:0,semilla:WORLD_SEED,velJ:1,golpe:z=>state.onHurt?.(z.t.dmg)};
function pasoVivo(dt){M.j.x=player.x;M.j.z=player.z;M.j.agachado=!!player.crouch;M.j.corre=!!player.corre;M.j.vivo=player.hp>0&&!player.caido;M.tick=tickRuido();M.velJ=topSpeed();paso(M,dt);}
export function cuenta(){const c={dormido:0,despertando:0,investiga:0,persigue:0,deambula:0};for(const z of zombies)if(z.alive&&c[z.estado]!==undefined)c[z.estado]++;return c;}
// disparador «despertar»: pone en despertando a los dormidos de una zona, con el jugador como objetivo
export function despertarZona(rect){for(const z of zombies)if(z.alive&&z.estado==='dormido'&&z.x>=rect[0]&&z.x<=rect[2]&&z.z>=rect[1]&&z.z<=rect[3])despierta(z,M,[player.x,player.z]);}
let geoCono=null,matCono=null;const DBG=typeof location!=='undefined'&&new URLSearchParams(location.search).has('debug');
function cono(z){if(!geoCono){const p=[0,0,0];for(let i=0;i<=12;i++){const a=(i/12-.5)*P.cono*Math.PI/180;p.push(Math.sin(a),0,Math.cos(a));}p.push(0,0,0);geoCono=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(p,3));matCono=new THREE.LineBasicMaterial({color:0xffe060,transparent:true,opacity:.5});}
  z.cono=new THREE.Line(geoCono,matCono);z.cono.position.y=.06;z.inst.root.add(z.cono);}
function dibujaVivo(z,dt){const r=z.inst.root,b=z.inst.body,e=z.estado;r.position.set(z.x,0,z.z);r.rotation.y=Math.atan2(z.gx,z.gz);
  if(DBG){if(!z.cono)cono(z);z.cono.scale.setScalar(P.vista);}
  if(z.lejos)return;
  if(z.inst.ctl){anima(z.inst,dt,{estado:e,alerta:z.alerta,cerca:e==='persigue'&&(z.cerca||z.bloq),x:z.x,z:z.z,ang:r.rotation.y,tDesp:z.tDesp,jx:e==='persigue'&&M.j.vivo?player.x:z.obj[0],jz:e==='persigue'&&M.j.vivo?player.z:z.obj[1],mira:e==='deambula'||e==='investiga'});return;}
  if(z.inst.mixer){const c=clip(z.inst,e==='persigue'&&z.cerca?'attack':DE[e]);if(c)play(z.inst,c);z.inst.mixer.update(dt);if(c)return;}
  // sin clips (relleno): dormido inclinado y quieto; despertando se endereza; andando se balancea como en Tiny
  const mov=e==='persigue'&&!z.cerca&&!z.bloq?1:e==='investiga'?.5:e==='deambula'&&z.pausa<=0?.5:0;z.ph+=dt*(mov*8+1);
  b.position.y=mov?Math.abs(Math.sin(z.ph))*.08*mov:0;b.rotation.z=mov?Math.sin(z.ph)*.12:0;
  b.rotation.x=e==='dormido'?.45:e==='despertando'?.45*(1-Math.min(1,z.te/Math.max(z.tDesp,.01))):z.cerca?Math.sin(z.ph*6)*.25+.2:mov?.25:.12;}
