// ART-4 / 010 §5: rehace el despiece de la textura de un GLB de Meshy. Meshy entrega la textura en cientos de trocitos pegados sin margen
// (motas de otro color en las costuras cuando el modelo se ve pequeño). Esta herramienta reparte la superficie en POCAS piezas grandes con
// margen entre ellas (xatlas), vuelve a pintar color, relieve y demás mapas desde la textura original y rellena los márgenes con el color del borde.
// La malla no cambia de forma; esqueleto y pesos se conservan. Uso:
//   node tools/rehacer_textura.mjs <entrada.glb> <salida.glb> [--tam 2048] [--margen 8] [--coste 8] [--png carpeta]
// --coste: cuánto se deja crecer cada pieza (más alto = menos piezas y más grandes, con algo más de estiramiento). --png: guarda las texturas para verlas.
import { NodeIO } from '@gltf-transform/core'; import { ALL_EXTENSIONS } from '@gltf-transform/extensions'; import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import sharp from 'sharp'; import fs from 'fs'; import path from 'path'; import { createRequire } from 'module';
const arg = process.argv.slice(2), pos = arg.filter((a, i) => !a.startsWith('--') && !(arg[i - 1] || '').startsWith('--'));
const op = (n, d) => { const i = arg.indexOf('--' + n); return i < 0 ? d : arg[i + 1]; };
const [ent, sal] = pos; if (!ent || !sal) { console.error('Uso: node tools/rehacer_textura.mjs <entrada.glb> <salida.glb> [--tam 2048] [--margen 8] [--coste 8] [--png carpeta] [--webp]'); process.exit(1); }
const TAM = +op('tam', 2048), MARGEN = +op('margen', 8), COSTE = +op('coste', 8), PNG = op('png', ''), WEBP = arg.includes('--webp'); // --webp: guarda las texturas en WebP aunque el original fuera JPG o PNG (mucho menos peso)

// ---------- utilidades ----------
const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], pto = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
// piezas = grupos de triángulos unidos por vértices compartidos (en un GLB los vértices ya están partidos en las costuras de la textura)
function piezas(idx, nv) { const p = new Int32Array(nv); for (let i = 0; i < nv; i++) p[i] = i; const r = i => { while (p[i] !== i) { p[i] = p[p[i]]; i = p[i]; } return i; };
  for (let i = 0; i < idx.length; i += 3) { const a = r(idx[i]); p[r(idx[i + 1])] = a; p[r(idx[i + 2])] = a; }
  const id = new Map(), de = new Int32Array(idx.length / 3); for (let t = 0; t < de.length; t++) { const k = r(idx[t * 3]); if (!id.has(k)) id.set(k, id.size); de[t] = id.get(k); } return { de, n: id.size }; }
// recorre los píxeles de un triángulo en la textura (uv en píxeles). `holg` píxeles de holgura para que no queden huecos en los bordes.
function pintar(W, H, a, b, c, holg, f) { const x0 = Math.max(0, Math.floor(Math.min(a[0], b[0], c[0]) - holg)), x1 = Math.min(W - 1, Math.ceil(Math.max(a[0], b[0], c[0]) + holg)), y0 = Math.max(0, Math.floor(Math.min(a[1], b[1], c[1]) - holg)), y1 = Math.min(H - 1, Math.ceil(Math.max(a[1], b[1], c[1]) + holg));
  const d = (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]); if (Math.abs(d) < 1e-12) return;
  const lab = Math.hypot(b[0] - a[0], b[1] - a[1]), lbc = Math.hypot(c[0] - b[0], c[1] - b[1]), lca = Math.hypot(a[0] - c[0], a[1] - c[1]), ad = Math.abs(d);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const px = x + .5, py = y + .5;
    const w0 = ((b[0] - px) * (c[1] - py) - (c[0] - px) * (b[1] - py)) / d, w1 = ((c[0] - px) * (a[1] - py) - (a[0] - px) * (c[1] - py)) / d, w2 = 1 - w0 - w1;
    // distancia (en píxeles) por fuera de cada lado: w·|d|/lado
    const fuera = Math.max(-w0 * ad / lbc, -w1 * ad / lca, -w2 * ad / lab); if (fuera > holg) continue; f(x, y, w0, w1, w2, fuera); } }
async function leer(tex) { const { data, info } = await sharp(Buffer.from(tex.getImage())).ensureAlpha().raw().toBuffer({ resolveWithObject: true }); return { d: data, w: info.width, h: info.height }; }

// ---------- lectura ----------
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(ent), root = doc.getRoot();
const prims = []; for (const m of root.listMeshes()) for (const p of m.listPrimitives()) if (p.getAttribute('TEXCOORD_0') && p.getMaterial()) prims.push(p);
if (!prims.length) { console.error('El archivo no tiene mallas con textura'); process.exit(1); }
const mat = prims[0].getMaterial(); if (prims.some(p => p.getMaterial() !== mat)) { console.error('Hay más de un material: esta herramienta trabaja con modelos de un solo material (una malla por personaje, 010 §4)'); process.exit(1); }
const ranuras = [['color', mat.getBaseColorTexture(), m => m.getBaseColorTextureInfo()], ['relieve', mat.getNormalTexture(), m => m.getNormalTextureInfo()], ['rugosidad', mat.getMetallicRoughnessTexture(), m => m.getMetallicRoughnessTextureInfo()], ['oclusion', mat.getOcclusionTexture(), m => m.getOcclusionTextureInfo()], ['emision', mat.getEmissiveTexture(), m => m.getEmissiveTextureInfo()]].filter(r => r[1]);
if (!ranuras.length) { console.error('El material no tiene texturas'); process.exit(1); }

// ---------- despiece nuevo con xatlas ----------
const require = createRequire(import.meta.url); const { Api } = await import('xatlasjs/dist/node/api.mjs'); const crear = (await import('xatlasjs/dist/node/xatlas.js')).default;
const XA = Api(crear); const wasm = require.resolve('xatlasjs/dist/node/xatlas.wasm');
const xa = await new Promise(ok => { const a = new XA(() => ok(a), () => wasm); });
xa.createAtlas(); const M = [];
for (const p of prims) { const P = p.getAttribute('POSITION'), nv = P.getCount(); if (nv > 65535) { console.error(`Una malla tiene ${nv} vértices (máximo 65 535): pasa primero la versión de juego, no el modelo alto`); process.exit(1); }
  const vp = new Float32Array(nv * 3), vn = new Float32Array(nv * 3), vt = new Float32Array(nv * 2), N = p.getAttribute('NORMAL'), T = p.getAttribute('TEXCOORD_0'), e = [];
  for (let i = 0; i < nv; i++) { P.getElement(i, e); vp.set(e, i * 3); if (N) { N.getElement(i, e); vn.set(norm(e), i * 3); } T.getElement(i, e); vt[i * 2] = e[0]; vt[i * 2 + 1] = e[1]; }
  const I = p.getIndices(), ni = I ? I.getCount() : nv, idx = new Uint16Array(ni); for (let i = 0; i < ni; i++) idx[i] = I ? I.getScalar(i) : i;
  if (!N) { for (let i = 0; i < ni; i += 3) { const a = idx[i] * 3, b = idx[i + 1] * 3, c = idx[i + 2] * 3, n = cruz([vp[b] - vp[a], vp[b + 1] - vp[a + 1], vp[b + 2] - vp[a + 2]], [vp[c] - vp[a], vp[c + 1] - vp[a + 1], vp[c + 2] - vp[a + 2]]); for (const v of [a, b, c]) { vn[v] += n[0]; vn[v + 1] += n[1]; vn[v + 2] += n[2]; } }
    for (let i = 0; i < nv; i++) vn.set(norm([vn[i * 3], vn[i * 3 + 1], vn[i * 3 + 2]]), i * 3); }
  // escala a ≈ 1 unidad de alto: las posiciones cuantizadas son enteros grandes y xatlas mide el coste en unidades de la malla
  let mn = [1e30, 1e30, 1e30], mx = [-1e30, -1e30, -1e30]; for (let i = 0; i < nv * 3; i++) { const k = i % 3; if (vp[i] < mn[k]) mn[k] = vp[i]; if (vp[i] > mx[k]) mx[k] = vp[i]; }
  const esc = 1 / Math.max(mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]);
  // Meshy parte los vértices en cada costura vieja: se sueldan por posición para que xatlas vea la superficie entera y pueda hacer piezas grandes
  const sold = new Map(), aS = new Uint32Array(nv), rep = []; for (let i = 0; i < nv; i++) { const k = vp[i * 3] + ',' + vp[i * 3 + 1] + ',' + vp[i * 3 + 2]; let j = sold.get(k); if (j === undefined) { j = rep.length; sold.set(k, j); rep.push(i); } aS[i] = j; }
  const ns = rep.length, sp = new Float32Array(ns * 3), sn = new Float32Array(ns * 3), sidx = new Uint16Array(ni);
  for (let i = 0; i < nv; i++) { const j = aS[i] * 3; for (let k = 0; k < 3; k++) { sp[j + k] = vp[i * 3 + k]; sn[j + k] += vn[i * 3 + k]; } } for (let j = 0; j < ns; j++) sn.set(norm([sn[j * 3], sn[j * 3 + 1], sn[j * 3 + 2]]), j * 3);
  for (let i = 0; i < ni; i++) sidx[i] = aS[idx[i]];
  const m = xa.addMesh(sidx, sp, sn, null, undefined, true, false, esc); if (!m) { console.error('xatlas no ha aceptado la malla'); process.exit(1); }
  M.push({ p, vp, vn, vt, idx, nv, ns, id: m.meshId }); }
xa.xatlas.generateAtlas({ ...xa.defaultChartOptions(), maxCost: COSTE, maxIterations: 4, normalDeviationWeight: 1, normalSeamWeight: 1, straightnessWeight: 3, roundnessWeight: .01, textureSeamWeight: 0 },
  { ...xa.defaultPackOptions(), resolution: TAM, padding: MARGEN + 2, bilinear: true, blockAlign: false, bruteForce: true, rotateCharts: true, rotateChartsToAxis: false });
if (process.env.VERB) console.log('despiece hecho', process.uptime().toFixed(1), 's');
const at = xa.xatlas.getAtlas(), AW = at.width, AH = at.height; if (process.env.VERB) console.log('xatlas', AW, AH, at.atlasCount, at.texelsPerUnit); if (at.atlasCount > 1) { console.error('xatlas ha repartido la textura en varias hojas: sube --tam o baja --margen'); process.exit(1); }
for (const m of M) { const r = xa.xatlas.getMeshData(m.id), H32 = xa.xatlas.HEAPU32, HF = xa.xatlas.HEAPF32;
  m.nIdx = Uint32Array.from(H32.subarray(r.indexOffset / 4, r.indexOffset / 4 + r.newIndexCount)); 
  m.nUv = Float32Array.from(HF.subarray(r.uvOffset / 4, r.uvOffset / 4 + r.newVertexCount * 2)); m.nNv = r.newVertexCount;
  if (m.nIdx.length !== m.idx.length) { console.error('xatlas ha cambiado el número de triángulos'); process.exit(1); }
  m.viejo = new Uint32Array(m.nNv).fill(0xffffffff); for (let i = 0; i < m.nIdx.length; i++) if (m.viejo[m.nIdx[i]] === 0xffffffff) m.viejo[m.nIdx[i]] = m.idx[i]; } // xatlas conserva el orden de triángulos y esquinas
// xatlas puede dar las coordenadas en píxeles o ya entre 0 y 1: se normaliza según el máximo
let uvMax = 0; for (const m of M) for (const v of m.nUv) if (v > uvMax) uvMax = v;
if (uvMax > 1.0001) for (const m of M) for (let i = 0; i < m.nUv.length; i += 2) { m.nUv[i] /= AW; m.nUv[i + 1] /= AH; }
const W = TAM, H = TAM;
if (process.env.VERB) { let n = 0; const ar = new Map(); for (const m of M) { const pn = piezas(m.nIdx, m.nNv); n += pn.n; for (let t = 0; t < pn.de.length; t++) { const q = [0, 1, 2].map(k => [m.nUv[m.nIdx[t * 3 + k] * 2] * W, m.nUv[m.nIdx[t * 3 + k] * 2 + 1] * H]); ar.set(pn.de[t], (ar.get(pn.de[t]) || 0) + Math.abs((q[1][0] - q[0][0]) * (q[2][1] - q[0][1]) - (q[2][0] - q[0][0]) * (q[1][1] - q[0][1])) / 2); } }
  const v = [...ar.values()].sort((a, b) => b - a), tot = v.reduce((a, b) => a + b, 0); console.log('piezas', n, 'las 40 mayores cubren', (v.slice(0, 40).reduce((a, b) => a + b, 0) / tot * 100).toFixed(1) + ' %', '· de menos de 100 px²:', v.filter(a => a < 100).length, '· tris/pieza mediana', ''); if (process.env.VERB === '2') process.exit(0); }

// ---------- repintado ----------
const fuentes = []; for (const [nombre, tex, info] of ranuras) fuentes.push({ nombre, tex, info, img: await leer(tex), out: new Uint8Array(W * H * 4) });
const cub = new Uint8Array(W * H), dist = new Float32Array(W * H).fill(1e9), pzN = new Int32Array(W * H).fill(-1); let piezasViejas = 0, piezasNuevas = 0, triTotal = 0;
for (const m of M) { const { vp, vn, vt, idx, nIdx, nUv, viejo } = m, nt = nIdx.length / 3; triTotal += nt;
  // a qué pieza vieja pertenece cada píxel de la textura original (para no leer el color de la pieza vecina)
  const pv = piezas(idx, m.nv), pn = piezas(nIdx, m.nNv); piezasViejas += pv.n;
  const mapas = new Map(); const dueño = img => { const k = img.w + 'x' + img.h; if (mapas.has(k)) return mapas.get(k); const d = new Int32Array(img.w * img.h).fill(-1), dd = new Float32Array(img.w * img.h).fill(1e9);
    for (let t = 0; t < idx.length / 3; t++) { const q = [0, 1, 2].map(k => [vt[idx[t * 3 + k] * 2] * img.w, vt[idx[t * 3 + k] * 2 + 1] * img.h]); pintar(img.w, img.h, q[0], q[1], q[2], .75, (x, y, a, b, c, f) => { const i = y * img.w + x; if (f < dd[i]) { dd[i] = f; d[i] = pv.de[t]; } }); } mapas.set(k, d); return d; };
  // triángulo viejo de cada triángulo nuevo: xatlas conserva el orden de los triángulos
  for (let t = 0; t < nt; t++) { const n3 = [nIdx[t * 3], nIdx[t * 3 + 1], nIdx[t * 3 + 2]], o3 = [idx[t * 3], idx[t * 3 + 1], idx[t * 3 + 2]];
    const tv = pv.de[t] !== undefined ? pv.de[t] : -1; // misma posición en la lista
    const P3 = o3.map(i => [vp[i * 3], vp[i * 3 + 1], vp[i * 3 + 2]]), N3 = o3.map(i => [vn[i * 3], vn[i * 3 + 1], vn[i * 3 + 2]]), UO = o3.map(i => [vt[i * 2], vt[i * 2 + 1]]), UN = n3.map(i => [nUv[i * 2], nUv[i * 2 + 1]]);
    const e1 = [0, 1, 2].map(k => P3[1][k] - P3[0][k]), e2 = [0, 1, 2].map(k => P3[2][k] - P3[0][k]);
    // base tangente como la calcula el juego (three.js sin tangentes guardadas): T y B en el plano perpendicular a la normal, a partir de cómo cambian u y v
    const base = (N, U) => { const a = cruz(e2, N), b = cruz(N, e1), du1 = U[1][0] - U[0][0], du2 = U[2][0] - U[0][0], dv1 = U[1][1] - U[0][1], dv2 = U[2][1] - U[0][1];
      const T = [0, 1, 2].map(k => a[k] * du1 + b[k] * du2), B = [0, 1, 2].map(k => a[k] * dv1 + b[k] * dv2), s = Math.max(pto(T, T), pto(B, B)), q = s > 0 ? 1 / Math.sqrt(s) : 0; return [T.map(v => v * q), B.map(v => v * q)]; };
    const q = UN.map(u => [u[0] * W, u[1] * H]);
    pintar(W, H, q[0], q[1], q[2], .75, (x, y, a, b, c, f) => { const i = y * W + x; if (f >= dist[i]) return; dist[i] = f; cub[i] = 1; pzN[i] = piezasNuevas + pn.de[t];
      // dentro del triángulo aunque el píxel caiga un poco fuera (holgura): se recorta para no salirse de la pieza original
      let wa = Math.max(0, a), wb = Math.max(0, b), wc = Math.max(0, c); const s = wa + wb + wc; wa /= s; wb /= s; wc /= s;
      const u = UO[0][0] * wa + UO[1][0] * wb + UO[2][0] * wc, v = UO[0][1] * wa + UO[1][1] * wb + UO[2][1] * wc;
      for (const F of fuentes) { const im = F.img, D = dueño(im), fx = (u - Math.floor(u)) * im.w - .5, fy = (v - Math.floor(v)) * im.h - .5, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0; let r = 0, g = 0, bl = 0, al = 0, ps = 0;
        for (let k = 0; k < 4; k++) { const xx = Math.min(im.w - 1, Math.max(0, x0 + (k & 1))), yy = Math.min(im.h - 1, Math.max(0, y0 + (k >> 1))), j = yy * im.w + xx, p = ((k & 1) ? tx : 1 - tx) * ((k >> 1) ? ty : 1 - ty); if (D[j] !== tv || p <= 0) continue; r += im.d[j * 4] * p; g += im.d[j * 4 + 1] * p; bl += im.d[j * 4 + 2] * p; al += im.d[j * 4 + 3] * p; ps += p; }
        if (!ps) { // ningún vecino es de la misma pieza: el más cercano que lo sea y, si no hay, el píxel tal cual
          let mejor = -1, md = 1e9; for (let yy = Math.max(0, y0 - 2); yy <= Math.min(im.h - 1, y0 + 3); yy++) for (let xx = Math.max(0, x0 - 2); xx <= Math.min(im.w - 1, x0 + 3); xx++) { const j = yy * im.w + xx; if (D[j] !== tv) continue; const dd = (xx - fx) * (xx - fx) + (yy - fy) * (yy - fy); if (dd < md) { md = dd; mejor = j; } }
          if (mejor < 0) mejor = Math.min(im.h - 1, Math.max(0, Math.round(fy))) * im.w + Math.min(im.w - 1, Math.max(0, Math.round(fx))); r = im.d[mejor * 4]; g = im.d[mejor * 4 + 1]; bl = im.d[mejor * 4 + 2]; al = im.d[mejor * 4 + 3]; ps = 1; }
        r /= ps; g /= ps; bl /= ps; al /= ps;
        if (F.nombre === 'relieve') { // el relieve está escrito respecto al despiece viejo: se pasa a dirección real y de ahí al despiece nuevo
          const N = norm([0, 1, 2].map(k => N3[0][k] * wa + N3[1][k] * wb + N3[2][k] * wc)), [To, Bo] = base(N, UO), [Tn, Bn] = base(N, UN), mx = r / 127.5 - 1, my = -(g / 127.5 - 1), mz = bl / 127.5 - 1;
          const n = norm([0, 1, 2].map(k => To[k] * mx + Bo[k] * my + N[k] * mz)), z = pto(n, N), pl = [0, 1, 2].map(k => n[k] - N[k] * z);
          const tt = pto(Tn, Tn), bb = pto(Bn, Bn), tb = pto(Tn, Bn), pt = pto(pl, Tn), pb = pto(pl, Bn), det = tt * bb - tb * tb; let nx = 0, ny = 0; if (Math.abs(det) > 1e-12) { nx = (pt * bb - pb * tb) / det; ny = (pb * tt - pt * tb) / det; }
          const o = norm([nx, -ny, Math.max(z, .05)]); r = (o[0] + 1) * 127.5; g = (o[1] + 1) * 127.5; bl = (o[2] + 1) * 127.5; al = 255; }
        F.out[i * 4] = r + .5; F.out[i * 4 + 1] = g + .5; F.out[i * 4 + 2] = bl + .5; F.out[i * 4 + 3] = al + .5; } }); }
  piezasNuevas += pn.n; }
// márgenes: cada píxel vacío toma la media de sus vecinos ya pintados, capa a capa; lo que quede lejos, el color medio (para las reducciones de la textura)
const lleno = Uint8Array.from(cub); let frente = []; for (let i = 0; i < W * H; i++) if (!lleno[i]) frente.push(i);
for (let paso = 0; paso < MARGEN * 3 && frente.length; paso++) { const nuevos = [], resto = [];
  for (const i of frente) { const x = i % W, y = (i - x) / W; let n = 0; const s = fuentes.map(() => [0, 0, 0, 0]);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; const j = yy * W + xx; if (!lleno[j]) continue; n++; fuentes.forEach((F, k) => { for (let c = 0; c < 4; c++) s[k][c] += F.out[j * 4 + c]; }); }
    if (n) { fuentes.forEach((F, k) => { for (let c = 0; c < 4; c++) F.out[i * 4 + c] = s[k][c] / n + .5; }); nuevos.push(i); } else resto.push(i); }
  for (const i of nuevos) lleno[i] = 1; frente = resto; }
for (const F of fuentes) { const m = [0, 0, 0, 0]; let n = 0; for (let i = 0; i < W * H; i++) if (cub[i]) { n++; for (let c = 0; c < 4; c++) m[c] += F.out[i * 4 + c]; }
  const fondo = F.nombre === 'relieve' ? [128, 128, 255, 255] : m.map(v => v / n + .5); for (const i of frente) for (let c = 0; c < 4; c++) F.out[i * 4 + c] = fondo[c]; }

// ---------- comprobaciones ----------
let usados = 0; for (let i = 0; i < W * H; i++) usados += cub[i];
// separación mínima entre dos piezas distintas, en píxeles (solo se miran los píxeles de borde)
let sep = 1e9; const R = MARGEN + 4; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x, a = pzN[i]; if (a < 0) continue; if (x > 0 && x < W - 1 && y > 0 && y < H - 1 && pzN[i - 1] === a && pzN[i + 1] === a && pzN[i - W] === a && pzN[i + W] === a) continue;
  for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; const b = pzN[yy * W + xx]; if (b < 0 || b === a) continue; const d = Math.max(Math.abs(dx), Math.abs(dy)) - 1; if (d < sep) sep = d; } }

// ---------- escritura ----------
for (const m of M) { const p = m.p, nv = m.nNv;
  for (const sem of p.listSemantics()) { const A = p.getAttribute(sem); if (sem === 'TEXCOORD_0') continue; const n = A.getElementSize(), Tipo = A.getArray().constructor, arr = new Tipo(nv * n), src = A.getArray(); for (let i = 0; i < nv; i++) for (let k = 0; k < n; k++) arr[i * n + k] = src[m.viejo[i] * n + k];
    p.setAttribute(sem, doc.createAccessor(A.getName()).setType(A.getType()).setNormalized(A.getNormalized()).setArray(arr).setBuffer(A.getBuffer())); }
  for (const t of p.listTargets()) for (const sem of t.listSemantics()) { const A = t.getAttribute(sem), n = A.getElementSize(), Tipo = A.getArray().constructor, arr = new Tipo(nv * n), src = A.getArray(); for (let i = 0; i < nv; i++) for (let k = 0; k < n; k++) arr[i * n + k] = src[m.viejo[i] * n + k]; t.setAttribute(sem, doc.createAccessor().setType(A.getType()).setNormalized(A.getNormalized()).setArray(arr).setBuffer(A.getBuffer())); }
  const buf = p.getAttribute('POSITION').getBuffer(), uv = new Uint16Array(nv * 2); for (let i = 0; i < nv * 2; i++) uv[i] = Math.round(Math.min(1, Math.max(0, m.nUv[i])) * 65535);
  p.setAttribute('TEXCOORD_0', doc.createAccessor().setType('VEC2').setNormalized(true).setArray(uv).setBuffer(buf));
  p.setIndices(doc.createAccessor().setType('SCALAR').setArray(nv > 65535 ? m.nIdx : Uint16Array.from(m.nIdx)).setBuffer(buf)); }
if (PNG) fs.mkdirSync(PNG, { recursive: true });
for (const F of fuentes) { const img = sharp(Buffer.from(F.out.buffer), { raw: { width: W, height: H, channels: 4 } }), sinAlfa = F.nombre !== 'color' || !F.img.d.some((v, i) => i % 4 === 3 && v < 255), webp = WEBP || F.tex.getMimeType() === 'image/webp';
  const base = sinAlfa ? img.removeAlpha() : img; const datos = webp ? await base.webp(F.nombre === 'color' ? { quality: 88, effort: 5 } : { quality: 90, effort: 5 }).toBuffer() : await base.png({ compressionLevel: 9 }).toBuffer();
  F.tex.setImage(new Uint8Array(datos)).setMimeType(webp ? 'image/webp' : 'image/png'); const inf = F.info(mat); if (inf) inf.setTexCoord(0);
  if (PNG) await base.png().toFile(path.join(PNG, F.nombre + '.png')); }
if (PNG) { const v = new Uint8Array(W * H * 3); for (let i = 0; i < W * H; i++) { const a = pzN[i]; if (a < 0) continue; const h = Math.imul(a + 1, 2654435761) >>> 0; v[i * 3] = 80 + (h & 127); v[i * 3 + 1] = 80 + ((h >> 8) & 127); v[i * 3 + 2] = 80 + ((h >> 16) & 127); } await sharp(Buffer.from(v.buffer), { raw: { width: W, height: H, channels: 3 } }).png().toFile(path.join(PNG, 'piezas.png')); }
// se quitan los datos viejos que ya no usa nadie
for (const a of root.listAccessors()) if (!a.listParents().some(x => x !== root)) a.dispose();
if (WEBP) doc.createExtension(ALL_EXTENSIONS.find(e => e.EXTENSION_NAME === 'EXT_texture_webp')).setRequired(true);
fs.mkdirSync(path.dirname(sal), { recursive: true }); await io.write(sal, doc); xa.destroyAtlas();
const ok = sep >= MARGEN; // el número de piezas es solo informativo: validado en el juego con Lupa ×8 que lo que quita las motas es el margen (SESION, 18 nov)
console.log(`${path.basename(ent)} → ${sal} (${(fs.statSync(sal).size / 1024).toFixed(0)} KB; antes ${(fs.statSync(ent).size / 1024).toFixed(0)} KB)`);
console.log(`Triángulos: ${triTotal} (sin cambios) · vértices: ${M.reduce((s, m) => s + m.nv, 0)} → ${M.reduce((s, m) => s + m.nNv, 0)}`);
console.log(`Piezas de textura: ${piezasViejas} → ${piezasNuevas} · separación mínima entre piezas: ${sep >= 1e9 ? '> ' + R : sep} px (objetivo ≥ ${MARGEN}) · textura ${W} × ${H}, ocupada al ${(usados / (W * H) * 100).toFixed(0)} % · mapas: ${fuentes.map(f => f.nombre).join(', ')}`);
console.log(ok ? 'Comprobaciones OK' : 'AVISO: no cumple el objetivo (prueba con --tam mayor o --margen menor)'); if (!ok) process.exitCode = 2;
