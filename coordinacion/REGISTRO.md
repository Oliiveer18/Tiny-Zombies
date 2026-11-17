# REGISTRO · una línea por subpaso (quién, qué, medida)

| Fecha | Quién | Qué | Medida en el móvil (fps / peor cuadro) |
|---|---|---|---|
| 2026-11-15 | Sonnet | Diseño inicial, documentos, roadmap y estructura de coordinación. Sin código nuevo | — |
| 2026-11-15 | Sonnet | Regla de explicación fácil añadida a CLAUDE.md; plan de créditos de Meshy (el usuario tiene 2 000) | — |
| 2026-11-15 | Sonnet | Online como objetivo final: DISENO §14, hito F en ROADMAP, norma en CLAUDE.md; sin protagonista fijo (cada jugador crea el suyo) | — |
| 2026-11-15 | Sonnet | Decidido por el usuario: personaje creado por cada jugador (distinto de los NPC), varias partidas a la vez y muerte total por partida. Propuesta A pequeña para el online | — |
| 2026-11-15 | Sonnet | Decidido: online opción A pequeña; refugio del jugador muerto = ruina saqueable. Propuesta de refugio con dueño desconectado en DISENO §14 | — |
| 2026-11-15 | Sonnet | Aplicada la revisión Fable 001: decisiones (luz/niebla, suelo plano, munición A5, iPhone 14, sin coop), C1-C13, ROADMAP R1-R9 (≈ 43 subpasos), huecos y riesgos en DISENO §15, petición 002 actualizada, entrega única por ramas (💡) | — |
| 2026-11-15 | Sonnet | A0a: `main.js` dividido en `renderer.js`, `game.js` y `main.js` sin cambiar comportamiento; build OK. Entrega única: GitHub/main, sin ZIP | pendiente de medir en iPhone |
| 2026-11-16 | Sonnet | A0b: medidor `?debug` (`src/debug.js`): fps, peor cuadro, CPU, triángulos de todas las pasadas, llamadas, recursos; build OK | pendiente de medir en iPhone 14 |
| 2026-11-16 | Sonnet | A0c: `src/sim.js` (semilla, hash de enteros, reloj en ticks), ids en zombis/props/jugador, zombis con semilla propia; build OK | pendiente de medir en iPhone 14 |
| 2026-11-16 | Sonnet | Fusionada y revisada la respuesta Fable 002 (A1 en 6 subpasos); ROADMAP y DISENO §3 actualizados; creado `docs/PROMPTS_MESHY.md` (prueba de tubería con 2 modelos). Créditos Meshy: 2 000 (sin gastar) | — |
| 2026-11-16 | Sonnet | Plan de producción del creador de personaje (cuerpos + re-texturizados + accesorios) en MODELOS_MESHY; prompt del cuerpo base cambiado a ropa ajustada | — |
| 2026-11-16 | Sonnet | Primera prueba de Meshy con el cuerpo base del jugador (445 460 → 36 722 adaptativo alto → 9 808 adaptativo medio, cara perdida con 10K). Créditos: 2 388. Redactada la petición 003 (receta de assets para iPhone 14) | — |
| 2026-11-16 | Sonnet | A0d jugador: GLB de Meshy → `public/models/player.glb` (4 000 tris, 20 huesos, 613 KB, 6 clips), `tools/prep_player.mjs`, original en `arte_fuente/`; assets.js con metalness 0, anisotropía 4, frustumCulled false; build OK. Pendiente: boca (creador), zombi, medir en iPhone | — |
| 2026-11-16 | Sonnet | M1-M5: mando PlayStation + menú Controles, versión visible, apuntado/movimiento más finos, mapa de prueba (zombis quietos). Redactada la petición 005 (callejón, física de objetos, impactos, interacción y NPC) | pendiente de probar en iPhone |
| 2026-11-16 | Fable | Respuesta 005 (callejón, física, impactos, interacción y NPC; subpasos C1-C10), fusionada en main | — |
| 2026-11-16 | Sonnet | M6 (apuntado parado) y C1 (callejón como datos, muros, luz de atardecer, farolas); build OK | pendiente de medir en iPhone 14 |

- C3: vida y rotura de objetos; quitado toque-agacharse en táctil.
- C3b: origen de bala fijo.

- P1: clips compartidos en anims/humano.glb; 006 de Fable recibida.
- P2: herramienta de piezas y carpetas del almacén.
- C4: marcas de bala, sangre, quemaduras.
- S1: suelo con relieve, aceras y marcas fijas.

- Respuestas 004 y 007 de Fable copiadas a main.
- 2026-11-17 · Fable · Informe 008 (reorientación visual tipo Tiny Troopers): estado, diferencias, qué se aprovecha, pista R0-R8 y 5 decisiones. Nada implementado; espera aprobación del usuario.
- 2026-11-17 · Fable · R0 (documentos de la reorientación) y R1 (cámaras A/B/C + Cerca + Tiny elegibles en Controles; build OK; probado en iPhone 14 simulado). Pendiente: elección del usuario en el móvil.
- 2026-11-17 · Fable · El usuario elige la cámara «Tiny» (16,4 m · 58°) como definitiva; fijada en CLAUDE.md y REFERENCIA_VISUAL con criterios de proporciones, visibilidad y escala. R0 y R1 hechos; R2 en pausa hasta organizar el trabajo Fable–Sonnet. Solo documentos.
- 2026-11-17 · Fable · Sistema de trabajo «Fable dirige, Sonnet implementa»: LEEME reescrito, DECISIONES.md nuevo, CONTINUAR convertido en tablero (el anterior, en docs/archivo), plan único por paquetes en ROADMAP, traspasos PAQ-01 y PAQ-02 LISTOS y ART-1 preparado. Sin cambios de código.
- 2026-11-17 · Fable · Calidad gráfica: tope de 40 000 triángulos RETIRADO (era de escena, solo texto y color del medidor, sin prueba que lo justificara). Nuevo `docs/CALIDAD_GRAFICA.md`; primera medición real apuntada (58 fps, CPU 2 ms, 30 404 triángulos, vertical); criterios corregidos a vertical; nuevo paquete PAQ-G1 (prueba de carga) LISTO; PAQ-01 y PAQ-02 ajustados. Sin cambios de código.
- 2026-11-17 · Fable · Orientación oficial VERTICAL (usuario; reversible). Criterios de diseño en vertical añadidos a DECISIONES 2.9-2.10, REFERENCIA_VISUAL, CLAUDE.md, LEEME y tablero. Los paquetes LISTOS no cambian. Sin código.
- 2026-11-17 · Sonnet · PAQ-01 ENTREGADO: cámara Tiny por defecto, muros translúcidos, aro del jugador, zombis lejanos ocultos, medidor corregido. Pruebas 1-10 en vertical y horizontal OK; fps real pendiente de iPhone.
- 2026-11-17 · Sonnet · PAQ-G1 ENTREGADO: modo `?carga` (22 escalones, tabla, Copiar/Cerrar). Juego normal sin cambios. Cifras reales pendientes del iPhone del usuario.
- 2026-11-17 · Sonnet · PAQ-02 ENTREGADO: barras de física en ?debug, acción «Usar» (✕ / F / botón táctil), `usar.js` con ruido, reja de dos hojas con bisagra y candado en el callejón. Pruebas OK (Node y navegador); falta tacto/fps en iPhone.
- 2026-11-17 · Fable · Sesión nueva (recuperación de contexto). PAQ-01, PAQ-G1 y PAQ-02 revisados y ACEPTADOS (compilan, pruebas automáticas repetidas, sin rebajas de calidad); pendiente su validación en iPhone. Nuevo diseño 009 (personaje de referencia, Mixamo pone el esqueleto, sistema de animación por capas). ART-1 reescrita; PAQ-03 LISTO; DECISIONES 3.13-3.16. Sin cambios de código.
