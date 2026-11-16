// P2 (006): prepara una PIEZA (casco, chaleco, mochila, arma) de Meshy para el juego.
// Uso: node tools/prep_pieza.mjs origen.glb public/models/personajes/piezas/casco.glb [triangulos=500] [textura=512] [--boca=x,y,z] [--base]
// Hace: suelda, reduce triángulos, reduce textura (WebP), cuantiza, centra la pieza en el origen (--base: apoya la base en y=0)
// y, si se indica --boca (en metros, ya con la escala final), añade un nodo vacío «boca» (extremo del cañón en las armas).
// Mantiene metal y rugosidad (006 P6). Imprime triángulos y KB para comprobar el presupuesto.
import { NodeIO } from '@gltf-transform/core';
import { prune, dedup, weld, simplify, textureCompress, quantize, getBounds } from '@gltf-transform/functions';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp'; import fs from 'node:fs';
const args = process.argv.slice(2), flags = args.filter(a => a.startsWith('--')), [SRC, DST, TRIS = '500', TEX = '512'] = args.filter(a => !a.startsWith('--'));
if (!SRC || !DST) { console.error('Uso: node tools/prep_pieza.mjs origen.glb destino.glb [triangulos] [textura] [--boca=x,y,z] [--base]'); process.exit(1); }
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS), doc = await io.read(SRC), root = doc.getRoot();
const tris = () => root.listMeshes().reduce((a, m) => a + m.listPrimitives().reduce((b, p) => b + (p.getIndices() ? p.getIndices().getCount() : p.getAttribute('POSITION').getCount()) / 3, 0), 0);
const antes = Math.round(tris()); await MeshoptSimplifier.ready;
await doc.transform(weld(), simplify({ simplifier: MeshoptSimplifier, ratio: Math.min(1, Number(TRIS) / antes), error: 0.02 }), dedup(), prune());
await doc.transform(textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [Number(TEX), Number(TEX)], quality: 80 }));
// centrar: una raíz nueva con el desplazamiento, para no tocar las mallas
const scene = root.listScenes()[0], b = getBounds(scene), cx = (b.min[0] + b.max[0]) / 2, cz = (b.min[2] + b.max[2]) / 2, cy = flags.includes('--base') ? b.min[1] : (b.min[1] + b.max[1]) / 2;
const pivote = doc.createNode('pieza').setTranslation([-cx, -cy, -cz]);
for (const n of scene.listChildren()) { scene.removeChild(n); pivote.addChild(n); } scene.addChild(pivote);
const boca = flags.find(f => f.startsWith('--boca='));
if (boca) { const [x, y, z] = boca.slice(7).split(',').map(Number); pivote.addChild(doc.createNode('boca').setTranslation([x, y, z])); }
await doc.transform(prune({ keepLeaves: true }), quantize({ quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 12 }));
fs.mkdirSync(DST.replace(/[^/]*$/, ''), { recursive: true }); await io.write(DST, doc);
console.log(`${DST}: ${antes} -> ${Math.round(tris())} triángulos · ${(fs.statSync(DST).size / 1024).toFixed(0)} KB · textura ${TEX} px${boca ? ' · con boca' : ''}`);
