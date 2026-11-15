# PETICIONES PARA FABLE (las redacta Sonnet; ver LEEME.md)

### 001 · Revisión del diseño completo · estado: HECHA (ver `RESPUESTAS_FABLE/001_revision_diseno.md`)
- Objetivo: encontrar contradicciones, huecos y riesgos antes de programar nada.
- Leer: `CLAUDE.md`, `docs/DISENO.md` (incluida la §14, online), `docs/ROADMAP.md`, `docs/TINY_ACTUAL.md` y `docs/MODELOS_MESHY.md`. No leer `docs/referencia_carretera_zombi/` salvo que haga falta para aclarar una duda concreta.
- Entregar: `RESPUESTAS_FABLE/001_revision_diseno.md`, máximo 3 páginas: (1) contradicciones; (2) huecos que bloquean algún paso; (3) riesgos de rendimiento y determinismo; (4) cambios propuestos al orden del ROADMAP, con motivo; (5) si la arquitectura de los hitos A-E permite llegar al online (§14) sin rehacer, y qué habría que cambiar ya para evitarlo.
- Criterio de éxito: cada punto cita el archivo y la sección, y propone una solución concreta.
- Fuera de alcance: escribir código, rediseñar decisiones marcadas ✅ por el usuario (solo señalar si chocan entre sí).

### 002 · Diseño técnico de A1 (mundo por regiones) · estado: PENDIENTE (actualizada tras la revisión 001)
- Objetivo: especificación que Sonnet pueda implementar en subpasos pequeños.
- Leer: `CLAUDE.md`, `docs/DISENO.md` §3 y §15 (huecos y riesgos), `docs/TINY_ACTUAL.md` (secciones Mundo actual y Cosas del código a tener en cuenta), `src/world.js`, `src/zombies.js`, `src/player.js`. Contexto: mundo PLANO, sin cooperativo, móvil de referencia iPhone 14.
- Entregar: `RESPUESTAS_FABLE/002_diseno_A1_regiones.md`, máximo 4 páginas, con: tamaño de región y de trozo de dibujo (punto de partida 💡: región de datos de 64, trozos de dibujo de 16-32, dibujado hasta ~60 del jugador, datos en 3×3); hash de semilla en dos niveles (`tipo = f(hash(semilla, rx, rz))`, contenido = `hash(semilla, rx, rz, canal)`); carga y descarga con presupuesto por cuadro (≤ 2 ms) y una malla instanciada global por tipo de prop; rejilla espacial para colisiones con **círculos y rectángulos girados**; posición = región entera + decimal local (sin umbral de origen flotante); **entidades que cruzan regiones** (zombi activo > 60 unidades pasa a dato en la región donde está; prop movido se guarda en la región donde se detiene); formas de gran escala (ríos, lagos, carreteras) por función de celda grande, sin leer regiones vecinas; formato de datos de región y de cambios guardables (listas de ids, tope 💡 de 4 KB por región, `versionGenerador`; el guardado en IndexedDB es de A4); orden de subpasos y qué medir en cada uno.
- Criterio de éxito: ≥ 58 fps, peor cuadro ≤ 25 ms, coste independiente del tamaño del mundo; una región sale igual en cualquier orden de carga; ninguna región lee el estado de otra.
- Fuera de alcance: terreno, agua y lugares (A2); cooperativo; relieve.
