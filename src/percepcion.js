// Percepción y estados de los zombis (PAQ-03): simulación pura, sin THREE ni DOM (norma 3); se ejecuta igual en Node.
// Estados: dormido → despertando → (persigue | investiga) → deambula. Un ruido lejano NO delata al jugador: el zombi se para, mira hacia el origen (despertando), camina con cautela hasta allí (investiga) y solo persigue si llega a verlo; lo que ve o lo que le contagia otro zombi sí lo persigue directamente. No sabe nada del aspecto ni de la animación: el dibujo solo lee `estado`.
// Sin Math.random: tiempos de despertar y puntos de deambular salen de hash(semilla, zombi, contador).
import { oye, murosEntre } from './ruido.js'; import { hash01 } from './sim.js';
export const P={cos:.5}; // parámetros (src/data/ruido.json → percepcion). `vista` y `velX` se cambian en vivo desde ?debug
export function configuraPercepcion(d){Object.assign(P,d);P.cos=Math.cos(P.cono*Math.PI/360);}
// Prepara los campos de estado de un zombi. Giro en grados: 0 mira hacia −z (fondo), 90 hacia +x, 180 hacia +z (la entrada).
export function prepara(z,n,grados=180,estado='dormido'){const a=grados*Math.PI/180;z.n=n;z.gx=Math.round(Math.sin(a)*1e6)/1e6;z.gz=-Math.round(Math.cos(a)*1e6)/1e6;
  z.estado=estado;z.te=0;z.obj=[z.x,z.z];z.tDesp=0;z.sin=0;z.atk=0;z.pt=-1;z.pk=-1;z.dc=0;z.pausa=0;z.dest=null;z.dtm=0;}
// Lo que hay que guardar o enviar de un zombi (norma 3)
export const estadoDe=z=>({id:z.id,tipo:z.tipo,estado:z.estado,t:z.te,x:z.x,z:z.z,gx:z.gx,gz:z.gz,vida:z.hp,obj:[z.obj[0],z.obj[1]]});
// ¿Ve el zombi al jugador? Distancia según cómo se mueve, cono alrededor de `giro` y ningún muro en medio (las rejas no tapan).
export function ve(z,j,muros){if(!j.vivo)return false;const dx=j.x-z.x,dz=j.z-z.z,d2=dx*dx+dz*dz,al=P.vista*(j.corre?P.vistaCorriendo:j.agachado?P.vistaAgachado:1);
  if(d2>al*al)return false;const d=Math.sqrt(d2);if(d>1e-6&&(dx*z.gx+dz*z.gz)/d<P.cos)return false;return murosEntre(z.x,z.z,j.x,j.z,muros)===0;}
// causa: 'vista' o 'contagio' → después persigue · 'ruido' → después investiga. alerta: ya estaba despierto (deambulando): solo se sobresalta, sin clip de despertar.
export function despierta(z,M,obj,f=1,causa='vista',alerta=false){z.estado='despertando';z.te=0;z.sin=0;z.causa=causa;z.alerta=alerta;z.obj=[obj[0],obj[1]];z.tDesp=(P.despMin+(P.despMax-P.despMin)*hash01(M.semilla,z.n,7))*f*(alerta?.6:1);M.aviso&&M.aviso(z);}
// Movimiento de Tiny (rodeo de obstáculos por el lado corto, separación entre zombis, sin atravesar obstáculos), hacia un punto.
export function mueve(z,tx,tz,sp,dt,M){let dx=tx-z.x,dz=tz-z.z;const d=Math.hypot(dx,dz)||1;dx/=d;dz/=d;let sx=dx,sz=dz;
  for(const o of M.obst){if(o.fly)continue;const ox=z.x-o.x,oz=z.z-o.z,od=Math.hypot(ox,oz),min=o.r+z.r;
    if(od<min+1.1&&od>1e-4){const w=(min+1.1-od)/1.1,sg=ox*dz-oz*dx>0?1:-1;sx+=(ox/od)*w*1.6+(-dz*sg)*w*.8;sz+=(oz/od)*w*1.6+(dx*sg)*w*.8;}}
  for(const o of M.zs){if(o===z||!o.alive)continue;const ox=z.x-o.x,oz=z.z-o.z,od=Math.hypot(ox,oz);if(od<.7&&od>1e-4){sx+=ox/od*.5;sz+=oz/od*.5;}}
  const sl=Math.hypot(sx,sz)||1,av=Math.min(sp*dt,d);z.x+=sx/sl*av;z.z+=sz/sl*av;
  for(const o of M.obst){if(o.fly)continue;const ox=z.x-o.x,oz=z.z-o.z,od=Math.hypot(ox,oz),min=o.r+z.r;if(od<min&&od>1e-4){z.x=o.x+ox/od*min;z.z=o.z+oz/od*min;}}
  gira(z,dx,dz,dt*10);}
function gira(z,dx,dz,k){if(k>1)k=1;if(z.gx*dx+z.gz*dz<-.98){dx+=-z.gz*.6;dz+=z.gx*.6;} // justo al revés: sin esto la mezcla solo encoge el vector y nunca llega a girar
  let gx=z.gx+(dx-z.gx)*k,gz=z.gz+(dz-z.gz)*k;const l=Math.hypot(gx,gz);if(l<1e-4){gx=dx;gz=dz;}else{gx/=l;gz/=l;}z.gx=gx;z.gz=gz;}
// Un paso. M: {zs, j:{x,z,agachado,corre,vivo}, muros, obst, ruido, tick, semilla, velJ, golpe(z), aviso(z)}
export function paso(M,dt){const {zs,j,muros}=M;
  for(const z of zs){if(!z.alive)continue;z.te+=dt;
    // percepción: 5 veces por segundo (cada 12 pasos de simulación), repartida por zombi
    const k=Math.floor((M.tick+z.n%12)/12);let est=null;
    if(k!==z.pk){z.pk=k;let causa='vista';if(ve(z,j,muros))est=[j.x,j.z];
      else for(let i=M.ruido.length-1;i>=0;i--){const r=M.ruido[i];if(r.tick<=z.pt)break;if(oye(z.x,z.z,r,muros)){est=[r.x,r.z];causa='ruido';break;}}
      z.pt=M.tick;z.estCausa=causa;}
    if(est){const causa=z.estCausa;
      if(z.estado==='dormido')despierta(z,M,est,1,causa);
      else if(z.estado==='despertando'){z.obj=est;if(causa==='vista')z.causa='vista';}
      else if(z.estado==='persigue'){z.sin=0;z.obj=est;}
      else if(causa==='vista'){z.sin=0;z.obj=est;z.estado='persigue';z.te=0;}
      else if(z.estado==='investiga')z.obj=est; // sigue oyendo: corrige el rumbo sin pararse otra vez
      else despierta(z,M,est,1,'ruido',true);} // deambulando y oye algo: se sobresalta y mira
    const sp=(P.vel[z.tipo]||.5)*M.velJ*P.velX;
    if(z.estado==='despertando'){const dx=z.obj[0]-z.x,dz=z.obj[1]-z.z,d=Math.hypot(dx,dz);if(d>1e-4)gira(z,dx/d,dz/d,dt*8);if(z.te>=z.tDesp){z.te=0;z.sin=0;z.estado=z.causa==='ruido'?'investiga':'persigue';}}
    else if(z.estado==='investiga'){const dx=z.obj[0]-z.x,dz=z.obj[1]-z.z;if(Math.hypot(dx,dz)<.7||z.te>14){z.estado='deambula';z.te=0;z.dest=null;z.pausa=1;}else mueve(z,z.obj[0],z.obj[1],sp*.6,dt,M);}
    else if(z.estado==='persigue'){z.sin+=dt;const jx=j.x-z.x,jz=j.z-z.z,dj=Math.hypot(jx,jz),cerca=j.vivo&&dj<.7*(z.r/.35>1.3?1.3:1)+.2;
      if(cerca){if(dj>1e-4)gira(z,jx/dj,jz/dj,dt*10);}else if(Math.hypot(z.obj[0]-z.x,z.obj[1]-z.z)>.3)mueve(z,z.obj[0],z.obj[1],sp,dt,M);
      z.atk-=dt;if(cerca&&z.atk<=0){z.atk=.9;M.golpe&&M.golpe(z);}z.cerca=cerca;
      if(z.te>=P.contagioT)for(const o of zs){if(!o.alive||o.estado!=='dormido')continue;const ox=o.x-z.x,oz=o.z-z.z;if(ox*ox+oz*oz<P.contagio*P.contagio)despierta(o,M,z.obj,.5,'contagio');} // contagio: despierta a los dormidos cercanos, más deprisa
      if(z.sin>=P.olvido){z.estado='deambula';z.te=0;z.dest=null;z.pausa=0;z.cerca=false;}}
    else if(z.estado==='deambula'){if(z.pausa>0)z.pausa-=dt;else{
      if(!z.dest){z.dest=[z.obj[0]+(hash01(M.semilla,z.n,z.dc,1)*2-1)*P.deambula,z.obj[1]+(hash01(M.semilla,z.n,z.dc,2)*2-1)*P.deambula];z.dtm=0;}
      mueve(z,z.dest[0],z.dest[1],sp*.5,dt,M);z.dtm+=dt;
      if(Math.hypot(z.dest[0]-z.x,z.dest[1]-z.z)<.3||z.dtm>6){z.dest=null;z.dc++;z.pausa=1+hash01(M.semilla,z.n,z.dc,3);}}}
  }}
