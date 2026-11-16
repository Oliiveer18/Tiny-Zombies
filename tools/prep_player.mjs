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
const [,, SRC, DST, TRIS='4000', TEX='1024', ...EXTRA] = process.argv; // EXTRA: archivo.glb:nombre_logico (clips sueltos de Meshy, p. ej. el FBX convertido con FBX2glTF)
const CLIPS = { // nombre de Meshy -> nombre lógico (models.config.js)
  Axe_Breathe_and_Look_Around:'idle', Walking:'walk', Running:'run', Standing_Reload:'reload', Dead:'die', Side_Shot:'shoot_side', Walk_Backward_While_Shooting_inplace:'shoot_back', Walk_Forward_While_Shooting:'shoot_fwd' };
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
// 3b) clips extra de otros GLB (mismo esqueleto Mixamo): se reasignan a los huesos por nombre; si la caderas vienen en centímetros (padre ×100) se pasan a metros
for (const spec of EXTRA) { const [file, logical] = spec.split(':'); const d2 = await io.read(file); const r2 = d2.getRoot();
  const buf = root.listBuffers()[0];
  for (const a2 of r2.listAnimations()) { const na = doc.createAnimation(a2.getName()); CLIPS[a2.getName()] = logical;
    for (const c2 of a2.listChannels()) { const tn = c2.getTargetNode(); const tgt = root.listNodes().find(x => nm(x) === nm(tn)); if (!tgt) continue;
      const s2 = c2.getSampler(); const inp = doc.createAccessor().setType('SCALAR').setArray(s2.getInput().getArray().slice()).setBuffer(buf);
      const o2 = s2.getOutput(); const arr = o2.getArray().slice(); const k = (c2.getTargetPath() === 'translation' && (tn.getParentNode()?.getScale?.()[0] || 1) > 10) ? tn.getParentNode().getScale()[0] : 1;
      if (k !== 1) for (let i = 0; i < arr.length; i++) arr[i] *= k;
      const out = doc.createAccessor().setType(o2.getType()).setArray(arr).setBuffer(buf);
      const smp = doc.createAnimationSampler().setInput(inp).setOutput(out).setInterpolation(s2.getInterpolation()); na.addSampler(smp);
      na.addChannel(doc.createAnimationChannel().setTargetNode(tgt).setTargetPath(c2.getTargetPath()).setSampler(smp)); } } }
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
