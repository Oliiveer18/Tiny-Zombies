// Pone un esqueleto humanoide sencillo (17 huesos) a un modelo en pose T SIN pasar por Mixamo ni por el rigging de Meshy.
// Entrada: GLB ya normalizado por tools/reduce.mjs (de pie, pies en y = 0, 1 de alto, centrado, brazos a lo largo de X, mirando a +Z).
// Los huesos no tienen giro en reposo (ejes = ejes del modelo), así que animar por código es directo: X = cabecear, Y = girar, Z = ladear.
// Los nombres siguen a Mixamo (mixamorig:Hips…) para poder adaptar clips suyos más adelante.
// Uso: node tools/esqueleto_auto.mjs <entrada.glb> <salida.glb>
import { NodeIO } from '@gltf-transform/core'; import { ALL_EXTENSIONS } from '@gltf-transform/extensions'; import { MeshoptDecoder } from 'meshoptimizer';
const [,, ent, sal] = process.argv; if (!ent || !sal) { console.error('Uso: node tools/esqueleto_auto.mjs <entrada.glb> <salida.glb>'); process.exit(1); }
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder }); const doc = await io.read(ent), root = doc.getRoot();
const nodoMalla = root.listNodes().find(n => n.getMesh()), prim = nodoMalla.getMesh().listPrimitives()[0], P = prim.getAttribute('POSITION').getArray(), nv = P.length / 3;
const X = i => P[i * 3], Y = i => P[i * 3 + 1], Z = i => P[i * 3 + 2], ss = (x, a, b) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const media = (f, g) => { let s = 0, n = 0; for (let i = 0; i < nv; i++) if (f(i)) { s += g(i); n++; } return n ? s / n : 0; };
// ---- medidas del cuerpo (todo en fracciones de la altura) ----
const I = prim.getIndices().getArray(); let crY = 1; // entrepierna: el punto más bajo donde la superficie cruza el plano central x = 0
for (let t = 0; t < I.length; t += 3) for (let k = 0; k < 3; k++) { const p = I[t + k], q = I[t + (k + 1) % 3]; if (X(p) * X(q) < 0) { const u = X(p) / (X(p) - X(q)), y = Y(p) + (Y(q) - Y(p)) * u; if (y < crY) crY = y; } }
const legX = media(i => Y(i) < crY * .6, i => Math.abs(X(i)));
const armY = media(i => Math.abs(X(i)) > .3, Y), armZ = media(i => Math.abs(X(i)) > .3, Z);
let shX = .2; for (let a = .08; a < .3; a += .005) { let lo = 9, hi = -9; for (let i = 0; i < nv; i++) { const ax = Math.abs(X(i)); if (ax >= a && ax < a + .01 && Y(i) > crY + .1) { if (Y(i) < lo) lo = Y(i); if (Y(i) > hi) hi = Y(i); } } if (hi - lo < .11) { shX = a - .005; break; } } // donde el corte vertical ya es solo brazo
let tip = 0; for (let i = 0; i < nv; i++) if (Math.abs(X(i)) > tip) tip = Math.abs(X(i)); const L = tip - shX, EL = .43, WR = .77;
let headJ = armY + .08, wmin = 9; for (let y = armY + .035; y < .9; y += .005) { let w = 0; for (let i = 0; i < nv; i++) if (Y(i) >= y && Y(i) < y + .012 && Z(i) > armZ - .01) { const ax = Math.abs(X(i)); if (ax > w) w = ax; } if (w > 0 && w < wmin) { wmin = w; headJ = y; } } // cuello: el corte más estrecho (solo la mitad delantera, para no medir la capucha)
const neckJ = armY + .03, hY = crY + .05, sY = hY + (neckJ - hY) * .33, cY = hY + (neckJ - hY) * .64, kneeY = crY * .53, ankY = crY * .1;
const zEn = (y0, y1, lado) => media(i => Y(i) >= y0 && Y(i) < y1 && (lado === 0 ? Math.abs(X(i)) < shX : X(i) * lado > 0 && Math.abs(X(i)) < shX), Z);
const J = [ // nombre, padre, posición en el mundo
  ['Hips', -1, [0, hY, zEn(crY, crY + .1, 0)]], ['Spine', 0, [0, sY, zEn(sY - .03, sY + .03, 0)]], ['Spine2', 1, [0, cY, zEn(cY - .03, cY + .03, 0)]], ['Neck', 2, [0, neckJ, armZ]], ['Head', 3, [0, headJ, armZ + .01]],
  ['LeftArm', 2, [shX, armY, armZ]], ['LeftForeArm', 5, [shX + L * EL, armY, armZ]], ['LeftHand', 6, [shX + L * WR, armY, armZ]],
  ['RightArm', 2, [-shX, armY, armZ]], ['RightForeArm', 8, [-shX - L * EL, armY, armZ]], ['RightHand', 9, [-shX - L * WR, armY, armZ]],
  ['LeftUpLeg', 0, [legX, crY + .03, zEn(crY - .05, crY + .03, 1)]], ['LeftLeg', 11, [legX, kneeY, zEn(kneeY - .03, kneeY + .03, 1)]], ['LeftFoot', 12, [legX, ankY, zEn(ankY, ankY + .04, 1) - .01]],
  ['RightUpLeg', 0, [-legX, crY + .03, zEn(crY - .05, crY + .03, -1)]], ['RightLeg', 14, [-legX, kneeY, zEn(kneeY - .03, kneeY + .03, -1)]], ['RightFoot', 15, [-legX, ankY, zEn(ankY, ankY + .04, -1) - .01]]];
// ---- pesos: en pose T cada zona se separa con cortes rectos; en las articulaciones se mezclan los dos huesos vecinos ----
const jo = new Uint8Array(nv * 4), we = new Float32Array(nv * 4), cuenta = new Array(J.length).fill(0);
for (let i = 0; i < nv; i++) { const x = X(i), y = Y(i), z = Z(i), ax = Math.abs(x), izq = x > 0, w = new Float32Array(J.length);
  const brazo = ss(ax, shX - .04, shX + .02) * ss(y, armY - .14, armY - .095) * (1 - ss(y, armY + .05, armY + .08) * (1 - ss(ax, shX + .01, shX + .06))); // por encima de los brazos ya es cabeza (orejas), pero no sobre la manga: ahí el brazo es más grueso (mangas remangadas, cuerpos compactos)
  if (brazo > 0) { const t = (ax - shX) / L, ante = ss(t, EL - .07, EL + .07), mano = ss(t, WR - .035, WR + .035), b = izq ? 5 : 8; w[b] += brazo * (1 - ante); w[b + 1] += brazo * (ante - mano); w[b + 2] += brazo * mano; }
  const resto = 1 - brazo;
  if (resto > 0) { const pierna = 1 - ss(y, crY - .015, crY + .06);
    if (pierna > 0) { const esp = 1 - ss(y, kneeY - .04, kneeY + .04), pie = 1 - ss(y, ankY - .01, ankY + .025), b = izq ? 11 : 14; w[b] += resto * pierna * (1 - esp); w[b + 1] += resto * pierna * (esp - pie); w[b + 2] += resto * pierna * pie; }
    const tr = resto * (1 - pierna); if (tr > 0) { const a1 = ss(y, sY - .035, sY + .035), a2 = ss(y, cY - .035, cY + .035); let a3 = ss(y, neckJ - .005, neckJ + .03), a4 = ss(y, headJ - .02, headJ + .02);
      const capucha = ss(armZ - .035 - z, 0, .03) * (1 - ss(y, headJ + .02, headJ + .07)); a3 *= 1 - capucha; a4 *= 1 - capucha; // lo que cuelga detrás del cuello (capucha) va con el pecho, no con la cabeza
      w[0] += tr * (1 - a1); w[1] += tr * (a1 - a2); w[2] += tr * (a2 - a3); w[3] += tr * (a3 - a4); w[4] += tr * a4; } }
  const orden = [...w.keys()].filter(k => w[k] > 1e-4).sort((a, b) => w[b] - w[a]).slice(0, 4); let s = 0; for (const k of orden) s += w[k];
  orden.forEach((k, n) => { jo[i * 4 + n] = k; we[i * 4 + n] = w[k] / s; }); cuenta[orden[0]]++; }
// ---- nodos, piel y escritura ----
const buf = prim.getAttribute('POSITION').getBuffer(), nodos = J.map(([n]) => doc.createNode('mixamorig:' + n)), ibm = new Float32Array(J.length * 16);
J.forEach(([n, p, q], k) => { const o = p < 0 ? [0, 0, 0] : J[p][2]; nodos[k].setTranslation([q[0] - o[0], q[1] - o[1], q[2] - o[2]]); if (p >= 0) nodos[p].addChild(nodos[k]); ibm.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -q[0], -q[1], -q[2], 1], k * 16); });
const skin = doc.createSkin('esqueleto').setSkeleton(nodos[0]).setInverseBindMatrices(doc.createAccessor().setType('MAT4').setArray(ibm).setBuffer(buf)); for (const n of nodos) skin.addJoint(n);
prim.setAttribute('JOINTS_0', doc.createAccessor().setType('VEC4').setArray(jo).setBuffer(buf)).setAttribute('WEIGHTS_0', doc.createAccessor().setType('VEC4').setArray(we).setBuffer(buf));
nodoMalla.setSkin(skin); const escena = root.listScenes()[0]; escena.addChild(nodos[0]); await io.write(sal, doc);
const f = v => v.toFixed(3); console.log(`${sal}: ${J.length} huesos, ${nv} vértices con pesos`);
console.log(`Medidas (altura = 1): entrepierna ${f(crY)} · rodilla ${f(kneeY)} · tobillo ${f(ankY)} · cadera ${f(hY)} · brazos a ${f(armY)} · hombro x ${f(shX)} · punta de la mano x ${f(tip)} · base del cráneo ${f(headJ)} → cabeza ≈ ${f(1 - headJ + .02)} = ${(1 / (1 - headJ + .02)).toFixed(1)} cabezas de alto`);
console.log('Vértices por hueso principal: ' + J.map(([n], k) => n + ' ' + cuenta[k]).join(' · '));
if (cuenta.some(c => c === 0) || shX < .09 || shX > .28 || crY < .3 || crY > .6) { console.error('AVISO: medidas fuera de lo normal o algún hueso sin vértices: revisar el modelo (¿pose T?, ¿piernas separadas?)'); process.exitCode = 2; }
