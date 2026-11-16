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

## Hecho el 16 nov: C1 (callejón, respuesta Fable 005; siguiente C2: física). M1 mando de PlayStation + menú Controles (falta probar en el iPhone; ver SESION.md)

## Primer subpaso propuesto (cuando el usuario diga «hazlo»)
Orden completo en `ROADMAP.md`. A0a, A0b y A0c HECHOS (falta medir en el iPhone 14). A0d HECHO solo para el jugador (player.glb de Meshy en el juego, 613 KB; el zombi falta; ver SESION). Fable entregó la 002 (diseño de A1 en 6 subpasos A1a-A1f, revisado el 16 nov). Siguiente: A1a (hash, generador de regiones y prueba con node) y, cuando haya modelos, A0d (prueba de tubería Meshy; textos en `docs/PROMPTS_MESHY.md`); antes de A1 hay que pedir a Fable la petición 002. A1 (MEDIUM) se describe abajo.

### A1 · MEDIUM
Quitar la arena fija y generar un mundo por regiones con semilla: claro inicial con ventaja ligera, carga y descarga de regiones alrededor del jugador, niebla de Tiny ocultando el borde, y los zombis/cámara/armas de Tiny funcionando igual. Medir fps en el móvil con `?debug`. Entrega: ZIP + `docs/SESION.md`.
