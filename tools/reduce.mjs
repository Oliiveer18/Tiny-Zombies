// Versión de juego de un modelo alto de Meshy: lo pone de pie con los pies en y = 0, centrado y con 1 unidad de alto (la escala real se da en
// src/models.config.js), suelda vértices y reduce triángulos conservando silueta y textura. No toca la textura (eso es rehacer_textura.mjs).
// Uso: node tools/reduce.mjs <entrada.glb> <salida.glb> [--tris 6000]
import { NodeIO } from '@gltf-transform/core'; import { ALL_EXTENSIONS } from '@gltf-transform/extensions'; import { weld, simplify, prune, dedup } from '@gltf-transform/functions'; import { MeshoptSimplifier, MeshoptDecoder } from 'meshoptimizer';
const a = process.argv.slice(2), [ent, sal] = a.filter((v, i) => !v.startsWith('--') && !(a[i - 1] || '').startsWith('--')), TRIS = +(a[a.indexOf('--tris') + 1] || 6000) || 6000;
if (!ent || !sal) { console.error('Uso: node tools/reduce.mjs <entrada.glb> <salida.glb> [--tris 6000]'); process.exit(1); }
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder }); const doc = await io.read(ent), root = doc.getRoot();
const prims = root.listMeshes().flatMap(m => m.listPrimitives()); if (prims.length !== 1) { console.error('Se espera una sola malla (010 §4); hay ' + prims.length); process.exit(1); }
const cuenta = () => prims[0].getIndices().getCount() / 3, antes = cuenta();
await MeshoptSimplifier.ready; await doc.transform(weld(), simplify({ simplifier: MeshoptSimplifier, ratio: Math.min(1, TRIS / antes), error: 0.02 }), prune(), dedup());
const p = root.listMeshes()[0].listPrimitives()[0], P = p.getAttribute('POSITION'), N = p.getAttribute('NORMAL'), nodo = root.listNodes().find(n => n.getMesh()), Mw = nodo.getWorldMatrix();
const v = [], mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9]; for (let i = 0; i < P.getCount(); i++) { const e = P.getElement(i, []), q = [0, 1, 2].map(k => Mw[k] * e[0] + Mw[4 + k] * e[1] + Mw[8 + k] * e[2] + Mw[12 + k]); v.push(q); for (let k = 0; k < 3; k++) { if (q[k] < mn[k]) mn[k] = q[k]; if (q[k] > mx[k]) mx[k] = q[k]; } }
const s = 1 / (mx[1] - mn[1]), cx = (mn[0] + mx[0]) / 2, cz = (mn[2] + mx[2]) / 2, arr = new Float32Array(v.length * 3); v.forEach((q, i) => arr.set([(q[0] - cx) * s, (q[1] - mn[1]) * s, (q[2] - cz) * s], i * 3));
p.setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(arr).setBuffer(P.getBuffer())); nodo.setTranslation([0, 0, 0]).setRotation([0, 0, 0, 1]).setScale([1, 1, 1]); // se supone el nodo sin giro (Meshy lo entrega así)
if (N) { const n = new Float32Array(N.getCount() * 3); for (let i = 0; i < N.getCount(); i++) { const e = N.getElement(i, []), l = Math.hypot(...e) || 1; n.set(e.map(x => x / l), i * 3); } p.setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(n).setBuffer(P.getBuffer())); }
await doc.transform(prune()); await io.write(sal, doc);
console.log(`${ent} → ${sal}: ${antes} → ${cuenta()} triángulos, ${p.getAttribute('POSITION').getCount()} vértices · alto 1 · envergadura ${((mx[0] - mn[0]) * s).toFixed(2)} (≈ 1 = pose T) · fondo ${((mx[2] - mn[2]) * s).toFixed(2)}`);
