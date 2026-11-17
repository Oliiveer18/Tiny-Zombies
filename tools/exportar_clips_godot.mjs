// Exporta las animaciones que ya existen (src/anim_humano.js y src/anim_zombi.js, generadas por código) como datos para la prueba de Godot:
// godot_prueba/datos/clips_humano.json y clips_zombi.json. No se reescribe ninguna animación: se MUESTREAN las mismas funciones de pose a 30 muestras/s.
// Formato: { clip: { dur, loop, t:[...], huesos: { Hips: { q:[x,y,z,w,...] , p:[x,y,z,...] (solo Hips) }, ... } } }  (rotaciones locales absolutas, como en el GLB)
// Uso: node tools/exportar_clips_godot.mjs
import * as THREE from 'three'; import fs from 'fs'; import { NodeIO } from '@gltf-transform/core'; import { ALL_EXTENSIONS } from '@gltf-transform/extensions'; import { MeshoptDecoder } from 'meshoptimizer';
import { clipsHumano, CLIPS_H } from '../src/anim_humano.js'; import { clipsZombi, CLIPS } from '../src/anim_zombi.js';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
async function caderaReposo(ruta) { const doc = await io.read(ruta), n = doc.getRoot().listNodes().find(x => x.getName() === 'mixamorig:Hips'); if (!n) throw new Error('sin hueso Hips en ' + ruta); return n.getTranslation(); }
function exporta(fn, tabla, hips, destino) {
  const esc = new THREE.Object3D(), h = new THREE.Object3D(); h.name = 'mixamorigHips'; h.position.set(...hips); esc.add(h); const out = {}; let n = 0;
  for (const clip of fn(esc)) { const huesos = {}; let t = null;
    for (const tr of clip.tracks) { const [nombre, prop] = tr.name.split('.'), hueso = nombre.replace('mixamorig', ''); huesos[hueso] = huesos[hueso] || {}; if (prop === 'quaternion') { huesos[hueso].q = Array.from(tr.values, v => +v.toFixed(5)); t = Array.from(tr.times, v => +v.toFixed(4)); } else huesos[hueso].p = Array.from(tr.values, v => +v.toFixed(5)); }
    out[clip.name] = { dur: +clip.duration.toFixed(4), loop: !!tabla[clip.name].loop, t, huesos }; n++; }
  fs.writeFileSync(destino, JSON.stringify(out)); console.log(`${destino}: ${n} clips, ${(fs.statSync(destino).size / 1024).toFixed(0)} KB · ${Object.entries(out).map(([k, v]) => k + ' ' + v.dur + 's').join(' · ')}`); }
exporta(clipsHumano, CLIPS_H, await caderaReposo('public/models/personajes/cuerpos/protagonista.glb'), 'godot_prueba/datos/clips_humano.json');
exporta(clipsZombi, CLIPS, await caderaReposo('public/models/zombie.glb'), 'godot_prueba/datos/clips_zombi.json');
