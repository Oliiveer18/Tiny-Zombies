// ART-1 parte 1: convierte un GLB (con o sin esqueleto) en un .obj sin esqueleto para subirlo a mixamo.com, que le pondrá el suyo.
// Uso: node tools/para_mixamo.mjs <entrada.glb> <salida.obj>
// Deja el modelo de pie (eje Y), con los pies en y = 0, centrado, a 1,70 m de alto (Mixamo trabaja mejor a escala humana).
import { NodeIO } from '@gltf-transform/core'; import { ALL_EXTENSIONS } from '@gltf-transform/extensions'; import { MeshoptDecoder } from 'meshoptimizer';
import fs from 'fs'; import path from 'path';
const [,, ent, sal] = process.argv; if (!ent || !sal) { console.error('Uso: node tools/para_mixamo.mjs <entrada.glb> <salida.obj>'); process.exit(1); }
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(ent); const root = doc.getRoot();
const mul = (m, v) => [m[0]*v[0]+m[4]*v[1]+m[8]*v[2]+m[12], m[1]*v[0]+m[5]*v[1]+m[9]*v[2]+m[13], m[2]*v[0]+m[6]*v[1]+m[10]*v[2]+m[14]];
const rot = (m, v) => [m[0]*v[0]+m[4]*v[1]+m[8]*v[2], m[1]*v[0]+m[5]*v[1]+m[9]*v[2], m[2]*v[0]+m[6]*v[1]+m[10]*v[2]];
const P = [], N = [], T = [], F = []; let huesos = 0;
for (const node of root.listNodes()) { const mesh = node.getMesh(); if (!mesh) continue;
  const skin = node.getSkin(); if (skin) huesos = Math.max(huesos, skin.listJoints().length);
  const M = skin ? null : node.getWorldMatrix(); // con esqueleto, los vértices ya están en la postura de reposo en el espacio del modelo
  for (const prim of mesh.listPrimitives()) { const pos = prim.getAttribute('POSITION'), nor = prim.getAttribute('NORMAL'), uv = prim.getAttribute('TEXCOORD_0'), idx = prim.getIndices(), base = P.length;
    for (let i = 0; i < pos.getCount(); i++) { let p = pos.getElement(i, []), n = nor ? nor.getElement(i, []) : [0, 1, 0]; if (M) { p = mul(M, p); n = rot(M, n); }
      P.push(p); N.push(n); const t = uv ? uv.getElement(i, []) : [0, 0]; T.push([t[0], 1 - t[1]]); }
    const n = idx ? idx.getCount() : pos.getCount(); for (let i = 0; i < n; i += 3) F.push([0, 1, 2].map(k => base + (idx ? idx.getScalar(i + k) : i + k))); } }
if (!P.length) { console.error('El archivo no tiene mallas'); process.exit(1); }
const caja = () => { const mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9]; for (const p of P) for (let k = 0; k < 3; k++) { if (p[k] < mn[k]) mn[k] = p[k]; if (p[k] > mx[k]) mx[k] = p[k]; } return { mn, mx, d: mx.map((v, k) => v - mn[k]) }; };
let c = caja();
if (c.d[2] > c.d[1] * 1.3) { for (const a of [P, N]) for (const p of a) { const y = p[2], z = -p[1]; p[1] = y; p[2] = z; } c = caja(); console.log('Modelo con el eje Z hacia arriba: girado para ponerlo de pie.'); } // Z arriba → Y arriba
const ALTO = 1.7, s = ALTO / c.d[1], cx = (c.mn[0] + c.mx[0]) / 2, cz = (c.mn[2] + c.mx[2]) / 2;
for (const p of P) { p[0] = (p[0] - cx) * s; p[1] = (p[1] - c.mn[1]) * s; p[2] = (p[2] - cz) * s; } c = caja();
const f = v => v.toFixed(5); const L = ['# ' + path.basename(ent) + ' sin esqueleto, para Mixamo', 'o personaje'];
for (const p of P) L.push('v ' + p.map(f).join(' ')); for (const t of T) L.push('vt ' + t.map(f).join(' ')); for (const n of N) L.push('vn ' + n.map(f).join(' '));
for (const t of F) L.push('f ' + t.map(i => `${i + 1}/${i + 1}/${i + 1}`).join(' '));
fs.mkdirSync(path.dirname(sal), { recursive: true }); fs.writeFileSync(sal, L.join('\n') + '\n');
// comprobaciones
const txt = fs.readFileSync(sal, 'utf8').split('\n'), nv = txt.filter(l => l.startsWith('v ')).length, nf = txt.filter(l => l.startsWith('f ')).length;
const ancho = c.d[0] / c.d[1]; // envergadura / altura: ≈ 1,0 en pose T · ≈ 0,7-0,85 en pose A · < 0,5 con los brazos pegados al cuerpo
console.log(`Escrito ${sal}: ${nv} vértices, ${nf} triángulos (${(fs.statSync(sal).size / 1048576).toFixed(1)} MB). Esqueleto original: ${huesos} huesos (quitado).`);
console.log(`Altura ${c.d[1].toFixed(3)} m · pies en y = ${c.mn[1].toFixed(3)} · ancho ${c.d[0].toFixed(2)} m · fondo ${c.d[2].toFixed(2)} m`);
console.log(`Pose: ancho/alto = ${ancho.toFixed(2)} → ${ancho > .92 ? 'pose en T (ideal para Mixamo)' : ancho > .6 ? 'pose en A (Mixamo suele aceptarla)' : 'BRAZOS PEGADOS AL CUERPO: Mixamo puede fallar'}`);
if (nv !== P.length || nf !== F.length || Math.abs(c.d[1] - ALTO) > .01 || Math.abs(c.mn[1]) > .001) { console.error('COMPROBACIÓN FALLIDA'); process.exit(1); }
console.log('Comprobaciones OK');
