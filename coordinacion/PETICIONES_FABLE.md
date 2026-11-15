# PETICIONES PARA FABLE (las redacta Sonnet; ver LEEME.md)

### 001 · Revisión del diseño completo · estado: PENDIENTE
- Objetivo: encontrar contradicciones, huecos y riesgos antes de programar nada.
- Leer: `CLAUDE.md`, `docs/DISENO.md`, `docs/ROADMAP.md`, `docs/TINY_ACTUAL.md` y `docs/MODELOS_MESHY.md`. No leer `docs/referencia_carretera_zombi/` salvo que haga falta para aclarar una duda concreta.
- Entregar: `RESPUESTAS_FABLE/001_revision_diseno.md`, máximo 3 páginas: (1) contradicciones; (2) huecos que bloquean algún paso; (3) riesgos de rendimiento y determinismo; (4) cambios propuestos al orden del ROADMAP, con motivo.
- Criterio de éxito: cada punto cita el archivo y la sección, y propone una solución concreta.
- Fuera de alcance: escribir código, rediseñar decisiones marcadas ✅ por el usuario (solo señalar si chocan entre sí).

### 002 · Diseño técnico de A1 (mundo por regiones) · estado: PENDIENTE
- Objetivo: especificación que Sonnet pueda implementar en subpasos pequeños.
- Leer: `CLAUDE.md`, `docs/DISENO.md` §3, `docs/TINY_ACTUAL.md` (secciones Mundo actual y Cosas del código a tener en cuenta), `src/world.js`, `src/zombies.js`, `src/player.js`.
- Entregar: `RESPUESTAS_FABLE/002_diseno_A1_regiones.md`, máximo 4 páginas: tamaño de región y de trozo de dibujo, hash de semilla determinista, carga y descarga con presupuesto por cuadro, rejilla espacial para colisiones, origen flotante, formato de datos de región y de cambios guardables, orden de subpasos y qué medir en cada uno.
- Criterio de éxito: ≥ 58 fps, peor cuadro ≤ 25 ms, coste independiente del tamaño del mundo; una región sale igual en cualquier orden de carga.
- Fuera de alcance: terreno, agua y lugares (A2).
