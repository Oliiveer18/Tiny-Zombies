// Prepara el jugador para el juego a partir del GLB de Meshy (receta 003 de Fable, A0d).
// Uso: node tools/prep_player.mjs arte_fuente/jugador_meshy_alto_36k.glb public/models/player.glb [triangulos=4000] [textura=1024]
// Hace: quita dedos y huesos sin uso (66 -> ~20 huesos), deja solo los clips usados con nombres lógicos, quita el avance de caderas,
// reduce triángulos, reduce textura (color + normales, WebP) y quita metal/rugosidad. No toca la cara: la cara es textura.
import { NodeIO } from '@gltf-transform/core';
import { prune, dedup, weld, simplify, resample, textureCompress, quantize } from '@gltf-transform/functions';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';
const [,, SRC, DST, TRIS='4000', TEX='1024'] = process.argv;
const CLIPS = { // nombre de Meshy -> nombre lógico (models.config.js)
  Axe_Breathe_and_Look_Around:'idle', Walking:'walk', Running:'run', Run_and_Shoot:'shoot', Standing_Reload:'reload', Dead:'die' };
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS); const doc = await io.read(SRC); const root = doc.getRoot();
const skin = root.listSkins()[0]; const joints = skin.listJoints(); const nm = j => j.getName().replace('mixamorig:','');
// 1) qué huesos se quedan: dedos y puntas se fusionan con la mano/pie; el resto se queda
const target = j => { const n = nm(j);
  const f = n.match(/^(Left|Right)Hand(Pinky|Ring|Middle|Index|Thumb)\d$/); if (f) return joints.find(x => nm(x) === f[1]+'Hand');
  const t = n.match(/^(Left|Right)Toe(Base|_End)$/); if (t) return joints.find(x => nm(x) === t[1]+'Foot');
  if (n === 'HeadTop_End' || n === 'headfront') return joints.find(x => nm(x) === 'Head');
  return j; };
const keep = joints.filter(j => target(j) === j); const newIdx = new Map(keep.map((j,i)=>[j,i]));
const remap = joints.map(j => newIdx.get(target(j)));
// 2) pesos: reasignar, juntar repetidos y reescribir (4 influencias)
const prim = root.listMeshes()[0].listPrimitives()[0]; const J = prim.getAttribute('JOINTS_0'), W = prim.getAttribute('WEIGHTS_0');
const ja = J.getArray(), wa = W.getArray();
for (let v = 0; v < J.getCount(); v++) { const acc = new Map();
  for (let k = 0; k < 4; k++) { const w = wa[v*4+k]; if (w <= 0) continue; const nj = remap[ja[v*4+k]]; acc.set(nj, (acc.get(nj)||0)+w); }
  const top = [...acc.entries()].sort((a,b)=>b[1]-a[1]).slice(0,4); const s = top.reduce((a,b)=>a+b[1],0) || 1;
  for (let k = 0; k < 4; k++) { ja[v*4+k] = top[k]?.[0] ?? 0; wa[v*4+k] = top[k] ? top[k][1]/s : 0; } }
J.setArray(ja); W.setArray(wa);
// 3) matrices inversas: solo las de los huesos que se quedan
const ibm = skin.getInverseBindMatrices(); const old = ibm.getArray(); const nib = new Float32Array(keep.length*16);
keep.forEach((j,i)=>{ nib.set(old.subarray(joints.indexOf(j)*16, joints.indexOf(j)*16+16), i*16); });
ibm.setArray(nib);
const dropped = joints.filter(j => !newIdx.has(j)); dropped.forEach(j => skin.removeJoint(j));
// 4) animaciones: solo las usadas, con nombre lógico; sin escala ni traslación salvo caderas; caderas sin avance en X/Z (menos 'die')
for (const a of root.listAnimations()) {
  if (!CLIPS[a.getName()]) { a.listChannels().forEach(c=>c.dispose()); a.listSamplers().forEach(s=>s.dispose()); a.dispose(); continue; }
  const name = CLIPS[a.getName()]; a.setName(name);
  for (const c of a.listChannels()) { const n = c.getTargetNode(), p = c.getTargetPath();
    if (dropped.includes(n) || (p !== 'rotation' && !(p === 'translation' && nm(n) === 'Hips'))) { c.dispose(); continue; }
    if (p === 'translation' && name !== 'die') { const arr = c.getSampler().getOutput().getArray(); for (let i = 3; i < arr.length; i += 3) { arr[i] = arr[0]; arr[i+2] = arr[2]; } c.getSampler().getOutput().setArray(arr); } }
}
dropped.forEach(j => j.dispose());
// 5) triángulos
await MeshoptSimplifier.ready;
const before = prim.getIndices().getCount()/3;
await doc.transform(weld(), simplify({ simplifier: MeshoptSimplifier, ratio: Number(TRIS)/before, error: 0.02 }), resample({tolerance:0.001}), dedup(), prune(), quantize({quantizePosition:14,quantizeNormal:10,quantizeTexcoord:12,quantizeWeight:8,quantizeColor:8}));
// 6) material: sin metal ni rugosidad en textura (la escena no tiene entorno: metal sale negro), una cara, 1024 WebP
const mat = root.listMaterials()[0]; mat.setMetallicFactor(0).setRoughnessFactor(0.85).setMetallicRoughnessTexture(null).setDoubleSided(false);
await doc.transform(prune(), textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [Number(TEX), Number(TEX)], quality: 78 }));
await io.write(DST, doc);
const p2 = root.listMeshes()[0].listPrimitives()[0];
console.log(JSON.stringify({ tris_antes: before, tris_despues: p2.getIndices().getCount()/3, huesos: root.listSkins()[0].listJoints().length,
  clips: root.listAnimations().map(a=>a.getName()), kb: Math.round(fs.statSync(DST).size/1024) }));
