// Pruebas de PAQ-03 (ruido, percepción y estados de los zombis) sin navegador: node tools/test_percepcion.mjs
import fs from 'fs'; import { configuraRuido, R, ruido, sonido, oye } from '../src/ruido.js'; import { configuraPercepcion, P, prepara, ve, paso, despierta, estadoDe } from '../src/percepcion.js';
import { initDisparadores, pasoDisparadores, estadoDisparadores } from '../src/disparadores.js';
const D = JSON.parse(fs.readFileSync(new URL('../src/data/ruido.json', import.meta.url))); let tick = 0; configuraRuido(D.radios, () => tick); configuraPercepcion(D.percepcion);
let fallos = 0; const ok = (c, t) => { console.log((c ? 'OK   ' : 'FALLA ') + t); if (!c) fallos++; };
const muro = x => [x, -50, x, 50]; // muro vertical en x
// 2 · ruido y muros
ok(!oye(17, 0, { x: 0, z: 0, radio: 30 }, [muro(5)]), 'ruido 30 a 17 m con un muro: no se oye');
ok(oye(14, 0, { x: 0, z: 0, radio: 30 }, [muro(5)]), 'ruido 30 a 14 m con un muro: se oye');
ok(!oye(5, 0, { x: 0, z: 0, radio: 30 }, [muro(1), muro(2), muro(3)]), 'ruido 30 a 5 m con tres muros: no se oye');
ok(oye(7, 0, { x: 0, z: 0, radio: 30 }, [muro(1), muro(2)]) && !oye(8, 0, { x: 0, z: 0, radio: 30 }, [muro(1), muro(2)]), 'con dos muros el radio queda en 7,5 m');
// 3 · vista: zombi en el origen mirando hacia −z (giro 0)
const zb = (id, x, z, g = 0, tipo = 'normal') => { const o = { id, tipo, type: tipo, x, z, r: .35, hp: 3, alive: true }; prepara(o, +id.slice(1), g); return o; };
const z0 = zb('z0', 0, 0), J = (x, z, o = {}) => ({ x, z, vivo: true, agachado: false, corre: false, ...o });
ok(ve(z0, J(0, -4), []), 'jugador 4 m delante: lo ve'); ok(!ve(z0, J(0, 4), []), '4 m detrás: no');
ok(!ve(z0, J(0, -4, { agachado: true }), []), '4 m delante agachado: no'); ok(ve(z0, J(0, -7, { corre: true }), []), '7 m delante corriendo: sí');
ok(!ve(z0, J(0, -4), [[-5, -2, 5, -2]]), '4 m delante con muro en medio: no'); ok(!ve(z0, J(3.8, -1), []), 'fuera del cono de 120°: no');
// simulación de apoyo
function mundo(zs, j) { tick = 0; ruido.length = 0; return { zs, j, muros: [], obst: [], ruido, tick: 0, semilla: 7, velJ: 2.5, golpes: 0, golpe() { this.golpes++; } }; }
const dt = 1 / 60, corre = (M, s, f) => { const n = Math.round(s * 60); for (let i = 0; i < n; i++) { tick++; M.tick = tick; f && f(i); paso(M, dt); } };
// 4 · determinismo
function partida() { const zs = [zb('z0', -2.6, -11, 270), zb('z1', 2.4, -14, 90), zb('z2', 0, -20, 180, 'runner'), zb('z3', 1, -24, 180, 'tank')], j = J(0, 0), M = mundo(zs, j); M.obst = [{ x: -1, z: -6, r: .5 }, { x: 1.5, z: -9, r: .4 }];
  corre(M, 10, i => { if (i < 300) j.z -= .03; else j.x += .01; if (i === 120) sonido(j.x, j.z, R.disparo, 'j1'); if (i % 24 === 0 && i < 300) sonido(j.x, j.z, R.andar, 'j1'); }); return JSON.stringify(zs.map(estadoDe)); }
const p1 = partida(), p2 = partida(); ok(p1 === p2 && p1.includes('persigue'), 'dos partidas iguales dan el mismo estado en el paso 600');
// 5 · contagio
{ const zs = [zb('z0', 0, 0), zb('z1', 3, 0), zb('z2', 6, 0)], M = mundo(zs, { x: 99, z: 99, vivo: false }); despierta(zs[0], M, [0, 0]); corre(M, 2.99); ok(zs.every(z => z.estado === 'persigue'), 'contagio: tres zombis a 3 m, los tres persiguen antes de 3 s (' + zs.map(z => z.estado) + ')'); }
{ const zs = [zb('z0', 0, 0), zb('z1', 5, 0), zb('z2', 10, 0)], M = mundo(zs, { x: 99, z: 99, vivo: false }); despierta(zs[0], M, [0, 0]); corre(M, 3); ok(zs[0].estado === 'persigue' && zs[1].estado === 'dormido' && zs[2].estado === 'dormido', 'contagio: a 5 m solo despierta el primero'); }
// 6 · pierde el rastro y deambula
{ const z = zb('z0', 0, 0), M = mundo([z], { x: 99, z: 99, vivo: false }); z.estado = 'persigue'; z.obj = [3, 0]; corre(M, 7.9); const antes = z.estado; corre(M, .2); let mx = 0; const e8 = z.estado; corre(M, 60, () => { const d = Math.hypot(z.x - z.obj[0], z.z - z.obj[1]); if (d > mx) mx = d; });
  ok(antes === 'persigue' && e8 === 'deambula', 'persigue sin estímulos: a los 8 s deambula'); ok(mx <= 4.5 && mx > .5, 'deambulando no se aleja más de 4,5 m del último punto (máximo ' + mx.toFixed(2) + ' m)'); }
// oído y ataque
{ const z = zb('z0', 0, 0, 180), j = J(0, -2.5, { agachado: true }), M = mundo([z], j); corre(M, 2, i => { if (i % 24 === 0) sonido(j.x, j.z, R.agachado, 'j1'); }); ok(z.estado === 'dormido', 'pasar agachado a 2,5 m por detrás no lo despierta');
  corre(M, 1, i => { if (i % 24 === 0) sonido(j.x, j.z, R.andar, 'j1'); }); ok(z.estado !== 'dormido', 'andando a 2,5 m lo despierta por el oído'); corre(M, 6); ok(M.golpes > 0, 'llega hasta el jugador y golpea (' + M.golpes + ' golpes)'); }
{ const z = zb('z0', 0, -20), M = mundo([z], J(0, 0)); sonido(0, 0, R.disparo, 'j1'); corre(M, .3); ok(z.estado === 'despertando' && z.obj[0] === 0 && z.obj[1] === 0, 'un disparo a 20 m lo despierta y va al origen del ruido'); }
// reacción al ruido (20 nov): se para y mira (despertando) → camina con cautela hasta el origen (investiga) → si no ve a nadie, deambula; si lo ve, persigue
{ const z = zb('z0', 0, 0, 180), j = J(30, 30), M = mundo([z], j); sonido(0, -12, R.disparo, 'j1'); const est = []; corre(M, 24, i => { if (i % 30 === 0) est.push(z.estado); }); // 12 m a paso cauteloso ≈ 15 s
  ok(est[1] === 'despertando' && est.includes('investiga') && !est.includes('persigue') && est[est.length - 1] === 'deambula', 'ruido sin jugador a la vista: se para, investiga y acaba deambulando, sin perseguir (' + [...new Set(est)] + ')');
  ok(Math.abs(z.z + 12) < 4.5, 'llega a las inmediaciones del origen del ruido (z = ' + z.z.toFixed(1) + ')'); }
{ const z = zb('z0', 0, 0, 180), j = J(0, -12), M = mundo([z], j); sonido(0, -12, R.disparo, 'j1'); const est = []; corre(M, 14, i => { if (i % 30 === 0) est.push(z.estado); });
  ok(est.includes('investiga') && est.includes('persigue'), 'investiga y, al llegar a ver al jugador, persigue (' + [...new Set(est)] + ')'); }
{ const z = zb('z0', 0, 0, 180), M = mundo([z], J(40, 40)); z.estado = 'deambula'; z.obj = [0, 0]; sonido(0, -6, R.disparo, 'j1'); corre(M, .5); ok(z.estado === 'despertando' && z.alerta === true, 'deambulando, un ruido lo sobresalta sin clip de despertar'); }
// bloqueado por una reja cerrada: no corre en el sitio, se queda arañando y, sin ver al jugador, acaba deambulando
{ const z = zb('z0', 0, 0, 180), j = J(0, 6, { agachado: false }), M = mundo([z], j); M.obst = []; for (let x = -3; x <= 3; x += .5) M.obst.push({ x, z: 2, r: .5 }); z.estado = 'persigue'; z.obj = [0, 6]; let bq = false;
  corre(M, 3, () => { if (z.bloq) bq = true; }); ok(bq && z.z < 2, 'tras una reja cerrada se detecta bloqueado y no la atraviesa (z = ' + z.z.toFixed(2) + ')'); ok(M.golpes === 0, 'bloqueado no hace daño a través de la reja'); }
// disparadores
{ initDisparadores([{ id: 'd1', cuando: { t: 'roto', obj: 'c' }, hacer: [{ t: 'mensaje', txt: 'a' }] }, { id: 'd2', cuando: { t: 'zona', zona: 'e' }, hacer: [{ t: 'mensaje', txt: 'b' }] }]); let roto = false; const m = { j: { x: 0, z: 0 }, zonas: [{ id: 'e', rect: [-4, -38, 4, -30] }], roto: () => roto, abierta: () => false };
  const a = pasoDisparadores(m).length; roto = true; const b = pasoDisparadores(m).length, c = pasoDisparadores(m).length; m.j.z = -32; const d = pasoDisparadores(m).length; m.j.z = 0; pasoDisparadores(m); m.j.z = -33; const e = pasoDisparadores(m).length;
  ok(a === 0 && b === 1 && c === 0 && d === 1 && e === 0 && JSON.stringify(estadoDisparadores()) === '[["d1",1],["d2",1]]', 'disparadores: cada uno se ejecuta una sola vez'); }
console.log(fallos ? `\n${fallos} PRUEBAS FALLIDAS` : '\nTodas las pruebas pasan'); process.exit(fallos ? 1 : 0);
