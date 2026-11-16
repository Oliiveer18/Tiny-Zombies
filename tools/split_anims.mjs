// P1 (006): separa un GLB de personaje en cuerpo (malla+esqueleto, sin clips) y animaciones (esqueleto+clips, sin malla ni texturas).
// Uso: node tools/split_anims.mjs public/models/player.glb public/models/personajes/cuerpos/jugador_a.glb public/models/personajes/anims/humano.glb
import { NodeIO } from '@gltf-transform/core';
import { prune } from '@gltf-transform/functions';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
const [,, SRC, BODY, ANIMS] = process.argv; const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const a = await io.read(SRC); for (const n of a.getRoot().listNodes()) { n.setMesh(null); n.setSkin(null); }
for (const s of a.getRoot().listSkins()) s.dispose(); for (const m of a.getRoot().listMeshes()) m.dispose();
await a.transform(prune({ keepLeaves: true })); await io.write(ANIMS, a);
const b = await io.read(SRC); for (const an of b.getRoot().listAnimations()) an.dispose(); await b.transform(prune()); await io.write(BODY, b);
