// Disparadores (PAQ-03): simulación pura. Cada uno se ejecuta una sola vez (bit `hecho`, serializable). Los datos vienen del lugar (JSON).
// Condiciones: zona (el jugador entra en el rectángulo), roto (un objeto con ese id se ha roto), abierta (una hoja pasa de 45°).
// Acciones (las aplica el juego): mensaje, despertar. `estado`, `soltar` y `grupo_muerto` llegarán con PAQ-05.
let L=[];
export function initDisparadores(lista){L=(lista||[]).map(d=>({...d,hecho:false}));}
export const estadoDisparadores=()=>L.map(d=>[d.id,d.hecho?1:0]);
export function cargaDisparadores(e){for(const [id,h] of e||[]){const d=L.find(q=>q.id===id);if(d)d.hecho=!!h;}}
// m: {j:{x,z}, zonas:[{id,rect:[x0,z0,x1,z1]}], roto(id), abierta(id)} → lista de acciones a aplicar
export function pasoDisparadores(m){const out=[];
  for(const d of L){if(d.hecho)continue;const c=d.cuando;let ok=false;
    if(c.t==='zona'){const z=m.zonas.find(q=>q.id===c.zona);ok=!!z&&m.j.x>=z.rect[0]&&m.j.x<=z.rect[2]&&m.j.z>=z.rect[1]&&m.j.z<=z.rect[3];}
    else if(c.t==='roto')ok=!!m.roto(c.obj);else if(c.t==='abierta')ok=!!m.abierta(c.obj);
    if(ok){d.hecho=true;for(const h of d.hacer)out.push({...h,de:d.id});}}
  return out;}
