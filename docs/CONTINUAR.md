# CONTINUAR · estado y siguiente paso

## Estado (15 nov 2026)
- Revisión de Fable (petición 001) aplicada a los documentos: contradicciones C1-C13 corregidas, ROADMAP rehecho (A ≈ 15 subpasos, total ≈ 43), huecos y riesgos en `DISENO.md` §15, petición 002 actualizada. Sin cooperativo por ahora.
- Solo diseño. `src/` = Tiny Zombies original sin tocar (v0.1.0). No se ha ejecutado `npm install` ni `npm run build` en esta preparación.
- Documentos: `DISENO.md` (todas las decisiones), `TINY_ACTUAL.md` (cómo es Tiny hoy, con cifras), `ROADMAP.md` (pasos y esfuerzo), `referencia_carretera_zombi/` (documentos del otro proyecto como consulta).

## Qué se decidió en la conversación (resumen; el detalle está en DISENO.md)
- Base = Tiny. El otro proyecto (Carretera zombi / Endless Aftermath, motor HD-2D por casillas) NO se usa como motor; se traen sus ideas: mundo por regiones, NPC y equipo, refugio, agua, lugares, zonas.
- Tiny exactamente igual en cámara, luz, controles, armas y zombis. Apuntado manual de Tiny (no autoapuntado).
- Nada de oleadas. Juego de supervivencia: tu sitio, exploras, encuentras NPC, los traes, haces crecer el refugio, comida, agua.
- Mundo realista: el peligro depende del LUGAR y de lo que hay en él. Se quita el endurecimiento por distancia y por reloj.
- Con el tiempo el jugador será más fuerte, así que hay 8 fuentes de presión realista (DISENO §5), todas decididas para implementar; los grupos hostiles van los últimos.
- Mundo grande pero dividido por regiones que se cargan alrededor del jugador (DISENO §3).
- Estaciones y clima con duración «intermedia» (DISENO §6).

## Referencia visual
El usuario aportó una captura y un vídeo de un juego cenital con el estilo objetivo («el juego debería ser de este estilo»): `docs/REFERENCIA_VISUAL.md` y `docs/referencia_visual/`. «Nuestras skins» = arte propio, sin copiar los colores ni la ropa de la referencia. Se hará un cuerpo base con esqueleto y animaciones compartidos y varias skins para jugador y NPC (`MODELOS_MESHY.md`). El usuario quiere también los movimientos tácticos del vídeo (paso A8).

## Decidido el 15 nov 2026 (respuestas del usuario)
- Mundo ilimitado por semilla. Sin historia ni final. Muerte total (se acaba la partida).
- Inicio con ventaja ligera (algo más tranquilo, con pozo) hasta que el usuario hace sus primeras mecánicas; pero nunca es un sitio seguro.
- Oli y Lali NO existen en este juego (son de otros proyectos): nada de ellos. El protagonista aún no tiene nombre ni aspecto.
- Todos los modelos (jugador, zombis, NPC, objetos) se hacen con Meshy, como Tiny; no se crean por código ni se empieza con cápsulas. Se espera a tenerlos (`MODELOS_MESHY.md`).

## Decidido el 15 nov (revisión 001)
- Luz y niebla cambian con hora y clima (excepción a «Tiny igual»). Suelo plano. Munición limitada desde A5. Móvil de referencia: iPhone 14. NO hay cooperativo (idea lejana, E4).

## Preguntas abiertas (nada empieza hasta que el usuario responda o diga «decide tú»)
0. Entrega ✅ (decidida): todo en GitHub y en `main`, sin ZIP. Pendiente: ¿cómo ves el juego en el iPhone? (propuesta: publicar `main` en GitHub Pages). (Refugios con el dueño desconectado: decidido ✅ «abiertos» con capas 1-5.)
1. Mientras llegan los modelos de Meshy: ¿se avanza ya con los pasos que no dependen de ellos (mundo por regiones, semilla, guardado, necesidades, tiempo y clima), o se espera a tenerlos? Esos pasos se ven sin personajes finales solo con el relleno técnico de Tiny, que no cuenta como aspecto del juego.
2. Cifras concretas de hambre, sed, mochila, duración exacta de día y estaciones y qué entra en la ventaja inicial: se fijan al construirlo y se ajustan midiendo.

## Hecho el 16 nov: C1 (callejón, respuesta Fable 005; C2 física hecha; siguiente C3: vida, rotura, bidón explosivo y partículas). M1 mando de PlayStation + menú Controles (falta probar en el iPhone; ver SESION.md)

## Primer subpaso propuesto (cuando el usuario diga «hazlo»)
Orden completo en `ROADMAP.md`. A0a, A0b y A0c HECHOS (falta medir en el iPhone 14). A0d HECHO solo para el jugador (player.glb de Meshy en el juego, 613 KB; el zombi falta; ver SESION). Fable entregó la 002 (diseño de A1 en 6 subpasos A1a-A1f, revisado el 16 nov). Siguiente: A1a (hash, generador de regiones y prueba con node) y, cuando haya modelos, A0d (prueba de tubería Meshy; textos en `docs/PROMPTS_MESHY.md`); antes de A1 hay que pedir a Fable la petición 002. A1 (MEDIUM) se describe abajo.

### A1 · MEDIUM
Quitar la arena fija y generar un mundo por regiones con semilla: claro inicial con ventaja ligera, carga y descarga de regiones alrededor del jugador, niebla de Tiny ocultando el borde, y los zombis/cámara/armas de Tiny funcionando igual. Medir fps en el móvil con `?debug`. Entrega: ZIP + `docs/SESION.md`.

- C3 hecho (vida/rotura/bidón/farola). Siguiente: arma visible y salida de bala desde el cañón (pedido del usuario 16 nov), luego C4 marcas.
- C3b: salida de bala fija (MUZZLE). Siguiente: C4 marcas de bala; arma visible cuando haya modelos (petición 006).

- P1 hecho (006). Siguiente: P2 (tools/prep_pieza.mjs + carpetas + piezas.json). El arma visible y la boca del cañón llegan en P4. 006 recibida de Fable.
- P2 hecho (tools/prep_pieza.mjs + carpetas). Siguiente: P3 (instanciaPersonaje con piezas) cuando haya cuerpo y piezas de Meshy; P4 arma y boca del cañón.
- C4 hecho (decals). Siguiente: suelo con materiales y variación (mío), luego lo que responda Fable en 007.
- S1 hecho (suelo procedural + aceras + marcas fijas). Siguiente: esperar 007/004 de Fable; si tardan, C5/C6.

- Respuestas 004 y 007 de Fable recibidas (plan de 18 pasos en 007 §10; decisiones del usuario en 007 §11 y 004 §4). Hecho ya de ese plan: C4 y parte de V2/V3 (suelo S1, calcos fijos). Siguiente: V1 (mapa calle_reja_01) cuando el usuario responda las decisiones.

- Decisión del usuario (16 nov, 22:10): mapa de prueba COMPACTO (~14x20 m) y modelos de Meshy PRIMERO (ver docs/MESHY_PEDIDOS.md). V1 se rehace en versión compacta cuando haya modelos; no construir más mapa largo. Las 6 decisiones de 007/004 siguen sin contestar.

- Estilo decidido (16 nov 22:20): semi-realista, proporciones normales. docs/MESHY_PEDIDOS.md reescrito; sustituye el estilo «toy-like» de 003/005/006/007. El soldado actual (juguete) pasará a NPC o se sustituye. Pendiente: acercar luz y suelo al vídeo (oscuro azulado + charcos cálidos) sin perder legibilidad.

- 16 nov 22:25: el zombi «semi-realista» salió FOTORREALISTA y el usuario lo rechazó (genérico, sin estilo). Decidido: ESTILIZADO DE JUEGO MÓVIL. MESHY_PEDIDOS.md reescrito (zombi ≈ 640 car.). Sin rasgo de identidad elegido aún (el usuario aclaró que el problema era el estilo, no la ropa).

- **17 nov · REORIENTACIÓN aprobada (informe 008):** estilo Tiny Troopers con identidad propia, cámara elevada, personajes de 4-5 cabezas. Hechos R0 (documentos) y R1 (cámaras A/B/C + Cerca + Tiny en Controles > Cámara; velocidad, retícula y chispas se adaptan solas). **Esperando al usuario:** que pruebe en el iPhone y elija cámara. Después: R2 (prueba Mixamo, gratis) y fijar proporciones; Meshy en pausa hasta entonces. Mapa de prueba sin tamaño fijado. Siguen sin contestar las decisiones de 007 §11 y 004 §4.

- **17 nov · CÁMARA DEFINITIVA elegida por el usuario: «Tiny» (16,4 m · 58°, personaje ≈ 1/16 del alto).** Fijada en `CLAUDE.md` (norma 1) y `REFERENCIA_VISUAL.md`, con los criterios de proporciones (4-4,5 cabezas 💡), visibilidad, presupuesto y escala que salen de ella.
  - **Estado:** R0 HECHO · R1 HECHO y validado. Flecos de R1 (pequeños, sin hacer): poner «Tiny» como cámara por defecto en el código (hoy solo está guardada en el móvil del usuario; por defecto sigue «Cerca») y retirar del menú las cámaras descartadas.
  - **En pausa por orden del usuario:** R2 y cualquier otra implementación, hasta que organice el sistema de trabajo Fable–Sonnet.
  - **Pendiente, en orden:** (1) sistema de trabajo Fable–Sonnet (lo indica el usuario) → (2) flecos de R1 → (3) R2 prueba Mixamo gratis (necesita un clip descargado por el usuario) → (4) fijar proporciones y textos de Meshy con los criterios nuevos; créditos en pausa hasta entonces → (5) R3 primer personaje, que será la referencia del resto → (6) R4-R6 animación → (7) R7 muros y escala → (8) R8 medición en iPhone 14.
  - **Sin decidir:** tamaño del mapa de prueba; decisiones de 007 §11 y 004 §4; si los 40 000 triángulos cuentan la pasada de sombras.
