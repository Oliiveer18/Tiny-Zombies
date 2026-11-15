// carretera.js — 6b-1 b2 (reescrito en Z0.4d-34): GENERADOR PURO de la calcomanía de carretera por chunk. Docs: docs/FICHA_SUELO.md §6.
// Cambio Z0.4d-34 (el usuario vio mal las manchas y los bordes en el móvil): una carretera REAL y limpia. Fuera manchas grandes, parches rectangulares y charcos.
// Ahora: rodadas suaves donde pasan las ruedas, líneas de borde CONTINUAS y nítidas (solo se desvanecen un poco con el desgaste, sin agujeros), línea central discontinua,
// cebras limpias en los cruces y sin grietas (Z0.4d-35: parecían líneas sueltas). Resolución doble (32 px por casilla) con bordes suavizados, para que no se vea pixelada.
// Calcomanía: RGBA de 512×512 por chunk de 16×16 casillas (32 px por casilla), alfa NO premultiplicado. Solo hay alfa en las casillas de carretera (CHAR 'a'); el RGB sin pintar es el del asfalto (así el filtrado lineal no deja halos).
// Cada píxel depende SOLO de sus coordenadas globales y de las casillas vecinas (leer): un chunk sale igual en cualquier orden de carga y coincide en los bordes.
// Líneas: se deducen de la forma de la carretera (ancho = tramo continuo de casillas en el eje corto). En cruces y plazas (ambos tramos > 6) no hay líneas.
// Desgaste 0-1 (por defecto G.estilo.desgaste.asfalto): rodadas más marcadas, líneas más pálidas, más grietas.
(function (root) {
  'use strict';
  const G = root.G = root.G || {};
  const CH = 16, PX = 32, TEX = CH * PX, CHAR = 'a', TOPE = 9, ANCHO_MAX = 6, SEM = 3100;
  const H = (a, b, c) => G.suelo.hash(a, b, c), r01 = (a, b, c) => H(a, b, c) / 4294967296;
  const lim = (v, a, b) => (v < a ? a : v > b ? b : v);
  const paso3 = (a, b, x) => { const t = lim((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const cob = (d) => lim(d * PX + 0.5, 0, 1); // cobertura suavizada de un borde a distancia d (en casillas, positiva = dentro): bordes sin escalones
  const esCarretera = (ch) => ch === CHAR;
  const canal = (c) => [(c >> 16) & 255, (c >> 8) & 255, c & 255];
  const mez = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const esc = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
  function colores() { // todo sale de la paleta del estilo (sin colores sueltos)
    const P = G.estilo.paleta, asf = canal(P.asfalto), tie = canal(P.tierra), fue = canal(P.fuego), nie = canal(P.nieblaDia);
    return { asf, grieta: esc(asf, 0.4), rodada: esc(asf, 0.62), tierra: tie, ocre: mez(tie, fue, 0.35), borde: nie };
  }
  // ruido de valor global (no periódico) en píxeles; e = tamaño de celda en px
  function vn(X, Z, e, sem) {
    const gx = X / e, gz = Z / e, ix = Math.floor(gx), iz = Math.floor(gz), u = paso3(0, 1, gx - ix), v = paso3(0, 1, gz - iz);
    const a = r01(ix, iz, sem), b = r01(ix + 1, iz, sem), c = r01(ix, iz + 1, sem), d = r01(ix + 1, iz + 1, sem);
    return (a + (b - a) * u) + ((c + (d - c) * u) - (a + (b - a) * u)) * v;
  }
  // tramo de carretera por el eje: cuántas casillas seguidas hacia cada lado (con tope), devuelve [atrás, adelante]
  function tramo(leer, gx, gz, dx, dz) {
    let a = 0, b = 0;
    while (a < TOPE && esCarretera(leer(gx - dx * (a + 1), gz - dz * (a + 1)))) a++;
    while (b < TOPE && esCarretera(leer(gx + dx * (b + 1), gz + dz * (b + 1)))) b++;
    return [a, b];
  }
  // núcleo: { eje: 'x' | 'z' | null, ancho, atras } (eje = dirección de la calzada; atras = casillas de carretera antes de ésta en el eje corto)
  function ejeDe(leer, gx, gz) {
    const [lx0, lx1] = tramo(leer, gx, gz, 1, 0), [lz0, lz1] = tramo(leer, gx, gz, 0, 1), rx = lx0 + lx1 + 1, rz = lz0 + lz1 + 1;
    if (rz <= ANCHO_MAX && rx > ANCHO_MAX) return { eje: 'x', ancho: rz, atras: lz0 };
    if (rx <= ANCHO_MAX && rz > ANCHO_MAX) return { eje: 'z', ancho: rx, atras: lx0 };
    return { eje: null, ancho: 0, atras: 0 };
  }
  // brazos: en cuántas de las 4 direcciones sigue la carretera más allá de ANCHO_MAX casillas (4 = cruce de 4 vías, 3 = T, 2 = curva, <2 = plaza o final)
  function brazos(leer, gx, gz) {
    const [a, b] = tramo(leer, gx, gz, 1, 0), [c, d] = tramo(leer, gx, gz, 0, 1);
    return (a > ANCHO_MAX ? 1 : 0) + (b > ANCHO_MAX ? 1 : 0) + (c > ANCHO_MAX ? 1 : 0) + (d > ANCHO_MAX ? 1 : 0);
  }
  const esCruce = (leer, gx, gz) => esCarretera(leer(gx, gz)) && ejeDe(leer, gx, gz).eje === null && brazos(leer, gx, gz) >= 3; // cruce de 4 vías o en T
  // geometría de una casilla: lo de ejeDe + cruce ('4', 'T', 'curva', 'plaza' o null) + cebra (true si es la casilla que toca un cruce: paso de peatones)
  function geometria(leer, gx, gz) {
    const g = ejeDe(leer, gx, gz);
    if (g.eje === null) { const v = brazos(leer, gx, gz); g.cruce = v === 4 ? '4' : v === 3 ? 'T' : v === 2 ? 'curva' : 'plaza'; g.cebra = false; return g; }
    g.cruce = null; g.cebra = g.ancho >= 2 && (g.eje === 'x' ? esCruce(leer, gx + 1, gz) || esCruce(leer, gx - 1, gz) : esCruce(leer, gx, gz + 1) || esCruce(leer, gx, gz - 1));
    return g;
  }
  // composición «over» con alfa recto sobre un acumulado { c: [r,g,b], a }
  function encima(acc, col, a) {
    if (a <= 0) return;
    const sa = acc.a, oa = a + sa * (1 - a);
    for (let i = 0; i < 3; i++) acc.c[i] = oa > 0 ? (col[i] * a + acc.c[i] * sa * (1 - a)) / oa : 0;
    acc.a = oa;
  }
  // un píxel global (X, Z): devuelve [r, g, b, a] (0-255). geo = geometría de su casilla; d = desgaste; C = colores
  function pixel(X, Z, geo, d, C) {
    const acc = { c: [0, 0, 0], a: 0 }, fx = (X + 0.5) / PX, fz = (Z + 0.5) / PX, gx = Math.floor(fx), gz = Math.floor(fz), u = fx - gx, w = fz - gz;
    if (geo.eje && geo.ancho >= 2 && !geo.cebra) {
      const anc = geo.ancho, t = geo.eje === 'x' ? fz - (gz - geo.atras) : fx - (gx - geo.atras), largo = geo.eje === 'x' ? fx : fz, mitad = anc / 2;
      // 1) rodadas: franjas apenas más oscuras donde pasan las ruedas (una o dos por carril), con variación suave a lo largo
      const li = t < mitad ? 0 : 1, a0 = li ? mitad + 0.03 : 0.5, a1 = li ? anc - 0.5 : mitad - 0.03, iw = a1 - a0, ic = (a0 + a1) / 2, dos = iw >= 1.1, sep = iw * 0.22, ancho = dos ? iw * 0.15 : iw * 0.55;
      let r = Math.abs(t - ic); if (dos) r = Math.abs(r - sep);
      const band = 1 - paso3(ancho * 0.5, ancho * 0.5 + 0.22, r);
      if (band > 0) encima(acc, C.rodada, band * (0.16 + 0.2 * d) * (0.65 + 0.35 * vn(X, Z, 1.6 * PX, SEM + 1)));
      // 2) líneas: continuas y nítidas; el desgaste solo las pone más pálidas (desvanecido suave, sin huecos)
      const gast = lim(1 - (0.05 + 0.3 * d) * paso3(0.4, 0.8, vn(X, Z, 0.3 * PX, SEM + 8)) - 0.25 * d * paso3(0.5, 0.8, vn(X, Z, 5 * PX, SEM + 9)), 0.3, 1);
      const db = Math.min(t, anc - t), lb = Math.min(db - 0.375, 0.5 - db); // bordes: banda de 0,375 a 0,5 casillas desde cada orilla
      if (lb > -0.02) encima(acc, C.borde, 0.92 * cob(lb) * gast);
      const l3 = (((largo % 3) + 3) % 3), lc = Math.min(l3, 1.625 - l3), dc = 0.09 - Math.abs(t - mitad); // centro: discontinua (trazo de 1,6 casillas cada 3)
      if (lc > -0.02 && dc > -0.02) encima(acc, C.ocre, 0.9 * cob(lc) * cob(dc) * gast);
    } else if (geo.cebra) { // paso de peatones: rayas limpias paralelas a la calzada; solo el desgaste las aclara
      const anc = geo.ancho, t = geo.eje === 'x' ? fz - (gz - geo.atras) : fx - (gx - geo.atras), a = geo.eje === 'x' ? u : w;
      const ra = (((t - 0.1875) % 0.5) + 0.5) % 0.5, lr = Math.min(ra, 0.25 - ra), ext = Math.min(a - 0.1875, 0.8125 - a), den = Math.min(t - 0.1875, anc - 0.1875 - t);
      if (lr > -0.02 && ext > -0.02 && den > -0.02) encima(acc, C.borde, 0.88 * cob(lr) * cob(ext) * cob(den) * lim(1 - (0.05 + 0.35 * d) * paso3(0.35, 0.8, vn(X, Z, 0.3 * PX, SEM + 10)), 0.3, 1));
    }
    const al = Math.round(acc.a * 255);
    if (al <= 0) return [Math.round(C.asf[0]), Math.round(C.asf[1]), Math.round(C.asf[2]), 0];
    return [Math.round(acc.c[0]), Math.round(acc.c[1]), Math.round(acc.c[2]), al];
  }
  // trabajo repartible en filas de píxeles, como G.sueloMezcla.crear: crear(leer, cx, cz, opc).paso(n) → true al terminar. null si el chunk no tiene carretera.
  function crear(leer, cx, cz, opc) {
    const d = opc && opc.desgaste != null ? opc.desgaste : G.estilo.desgaste.asfalto, C = colores(), gx0 = cx * CH, gz0 = cz * CH, geos = new Array(CH * CH);
    let hay = false;
    for (let j = 0; j < CH; j++) for (let i = 0; i < CH; i++) { const road = esCarretera(leer(gx0 + i, gz0 + j)); geos[j * CH + i] = road ? 0 : null; if (road) hay = true; }
    if (!hay) return null;
    const datos = new Uint8ClampedArray(TEX * TEX * 4); for (let o = 0; o < datos.length; o += 4) { datos[o] = C.asf[0]; datos[o + 1] = C.asf[1]; datos[o + 2] = C.asf[2]; } // RGB de fondo = asfalto, alfa 0
    const job = { cx, cz, ancho: TEX, alto: TEX, datos, fila: 0, hecho: false, desgaste: d };
    job.paso = (n) => {
      const fin = Math.min(TEX, job.fila + n);
      for (; job.fila < fin; job.fila++) {
        const j = job.fila, cj = j >> 5;
        for (let i = 0; i < TEX; i++) {
          const ci = i >> 5, k = cj * CH + ci;
          if (geos[k] === null) continue;
          if (geos[k] === 0) geos[k] = geometria(leer, gx0 + ci, gz0 + cj);
          const p = pixel(cx * TEX + i, cz * TEX + j, geos[k], d, C), o = (j * TEX + i) * 4;
          datos[o] = p[0]; datos[o + 1] = p[1]; datos[o + 2] = p[2]; datos[o + 3] = p[3];
        }
      }
      job.hecho = job.fila >= TEX; return job.hecho;
    };
    return job;
  }
  function generar(leer, cx, cz, opc) { const j = crear(leer, cx, cz, opc); if (!j) return null; j.paso(TEX); return j.datos; }
  // función global de referencia (sin chunks), para que los tests comparen: píxel global (X, Z) con su geometría
  function muestra(leer, X, Z, opc) {
    const gx = Math.floor(X / PX), gz = Math.floor(Z / PX); if (!esCarretera(leer(gx, gz))) { const A = colores().asf; return [A[0], A[1], A[2], 0]; }
    return pixel(X, Z, geometria(leer, gx, gz), opc && opc.desgaste != null ? opc.desgaste : G.estilo.desgaste.asfalto, colores());
  }
  G.carretera = { version: 2, CH, PX, TEX, CHAR, ANCHO_MAX, esCarretera, geometria, pixel, ejeDe, esCruce, crear, generar, muestra, colores };
})(typeof window !== 'undefined' ? window : globalThis);
