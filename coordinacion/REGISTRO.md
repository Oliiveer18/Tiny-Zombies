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
