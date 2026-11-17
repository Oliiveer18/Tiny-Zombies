// Reserva para la prueba de Godot: si Godot no importa las texturas WebP de un GLB (extensión EXT_texture_webp), esta herramienta escribe una COPIA con las texturas en PNG
// en godot_prueba/modelos_alt/ (carpeta ignorada por git). Los originales no se tocan. Después hay que cambiar la ruta en scripts/jugador.gd y scripts/zombi.gd.
// Uso: node tools/glb_para_godot.mjs
import { NodeIO } from '@gltf-transform/core'; import { ALL_EXTENSIONS } from '@gltf-transform/extensions'; import { MeshoptDecoder } from 'meshoptimizer'; import sharp from 'sharp'; import fs from 'fs';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
fs.mkdirSync('godot_prueba/modelos_alt', { recursive: true });
for (const [entrada, salida] of [['public/models/personajes/cuerpos/protagonista.glb', 'protagonista.glb'], ['public/models/zombie.glb', 'zombi.glb']]) {
  const doc = await io.read(entrada);
  for (const t of doc.getRoot().listTextures()) { if (t.getMimeType() === 'image/png') continue; t.setImage(new Uint8Array(await sharp(Buffer.from(t.getImage())).png().toBuffer())).setMimeType('image/png'); }
  for (const e of doc.getRoot().listExtensionsUsed()) if (e.extensionName === 'EXT_texture_webp') e.dispose();
  await io.write('godot_prueba/modelos_alt/' + salida, doc);
  console.log(`${entrada} → godot_prueba/modelos_alt/${salida} (${(fs.statSync('godot_prueba/modelos_alt/' + salida).size / 1048576).toFixed(1)} MB)`);
}
