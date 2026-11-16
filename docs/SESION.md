# SESION · diario técnico (cada entrada empieza con el «Resumen fácil»)

## A0a · Dividir el código en módulos (15 nov 2026, LOW)
**Resumen fácil:** he ordenado el código del juego en más archivos, con nombres claros, sin cambiar nada de cómo se ve ni cómo se juega. Verás exactamente lo mismo. Prueba en el móvil: abre el juego igual que antes (todavía no hay enlace al iPhone; se decide aparte). Si algo se viera distinto, avísame.

**Detalle técnico**
- `src/main.js` (arranque, bucle, estado y cámara mezclados) se divide en:
  - `src/renderer.js`: renderer, escena, cámara (`cam`, `OFF`), composer y bloom, evento de redimensionado. Sin lógica de juego.
  - `src/game.js`: estado `G`, `start`, `die`, `begin` (clic/Enter) y `frame` (bucle por cuadro y cámara). Recibe el sol con `setSun`.
  - `src/main.js`: carga de recursos, creación del mundo y enlace de eventos; arranca el bucle.
- El resto de módulos (`assets`, `effects`, `input`, `player`, `ui`, `weapons`, `world`, `zombies`) ya estaban separados y no se tocan; el contenido de cada línea se movió tal cual, sin cambiar cifras ni orden de ejecución.
- Comprobado: `npm run build` compila (637.7 kB, antes 637.7 kB); prueba automática con Chromium (carga, empezar, moverse, disparar, granada, 8 s de partida): sin errores en consola, el mismo HUD («Oleada 1 · 28/30 · 💣 3») y la misma escena que antes del cambio (las capturas no son idénticas al píxel porque Tiny usa `Math.random`).
- NO comprobado: fps y tacto en el iPhone 14 (todavía no hay medidor ni enlace; llegan con A0b).
- Se queda para A0c/A3: `Math.random` en generación y la lógica de oleadas dentro de `zombies.js`.

## A0b · Medidor `?debug` (16 nov 2026, LOW)
**Resumen fácil:** he añadido un cuadro con números en una esquina que se activa solo si abres el juego con `?debug` al final de la dirección. Sin eso, el juego es idéntico. Sirve para medir si va fluido en tu iPhone 14: sale en verde si todo va bien y en rojo si algo se pasa. Prueba: abre la dirección del juego añadiendo `?debug`, juega un minuto y hazme una captura del cuadro.

**Detalle técnico**
- Nuevo `src/debug.js`; `game.js` llama a `debugStart()` al empezar el cuadro y `debugEnd()` tras `comp.render()`. Sin `?debug` ambas salen en la primera línea y no cambian nada (tampoco `renderer.info.autoReset`).
- Muestra: fps (media de 0,5 s), peor cuadro de los últimos 5 s (intervalo real entre cuadros), tiempo de CPU del cuadro, triángulos sumados de todas las pasadas del cuadro (`renderer.info` con `autoReset=false` y reinicio manual: incluye sombras y bloom), llamadas de dibujo, geometrías, texturas y zombis vivos. Rojo si fps < 58, peor cuadro > 25 ms o triángulos > 40 000.
- Comprobado: compila; con Chromium sin GPU (SwiftShader) el cuadro aparece y da datos coherentes (3 968 triángulos, 35 llamadas); sin `?debug` el juego sale como antes. Los fps de esa prueba (5) no valen: no hay GPU real.
- NO comprobado: valores reales en el iPhone 14.
- Pendiente (no se pudo todavía): separar triángulos de la pasada de sombras y de la normal (el total ya las suma, que es lo que manda el límite); tamaño de guardado (no hay guardado hasta A4).

## A0c · Ids, semilla y reloj de juego (16 nov 2026, LOW)
**Resumen fácil:** he puesto «cimientos» que no se ven: cada zombi, objeto y el jugador tiene un nombre único (id), el mundo se genera con una semilla fija en vez de al azar, y el juego cuenta su propio tiempo (el tiempo que juegas), que servirá para día, noche, estaciones y hambre. Lo que verás y jugarás es igual que antes. Prueba: abre el juego como siempre; si algo se ve o se mueve distinto, avísame.

**Detalle técnico**
- Nuevo `src/sim.js`: `WORLD_SEED` (7, la que ya usaba Tiny), `hash(seed, ...enteros)` (solo `Math.imul`, xor/desplazamientos), `hash01`, `mulberry` (movido desde `world.js`) y el reloj `clock` en ticks enteros (20/s de juego) con `advanceClock`, `saveClock`, `loadClock`, `resetClock`, `gameSeconds`.
- Ids: props `p0…`, zombis `z0…` (por orden de creación, estables), jugador `j1` (provisional; con online irá por perfil, DISENO §14).
- El reloj avanza solo mientras se juega (`G.run`) y se reinicia al empezar partida.
- Los zombis usan un generador con semilla propia (canal 1 de `hash(WORLD_SEED,1)`) para tipo, ángulo de aparición y fase de animación, en vez de `Math.random`. Efecto: mismo comportamiento de Tiny, pero repetible. Las oleadas desaparecen en A3.
- Se queda con `Math.random` (permitido por la norma 3, D1): efectos de partículas, dispersión del disparo, temblor de cámara y giro de objetos al explotar.
- Comprobado: la semilla da el mismo mundo que antes (mismo generador y semilla); pruebas de `sim.js` en Node (hash repetible, cambia al variar cualquier número u orden, valores en [0,1), reloj 600 cuadros de 1/60 = 200 ticks = 10 s, guardar/cargar el reloj); build OK; prueba con Chromium sin errores y el mismo HUD.
- NO comprobado: tacto en el iPhone 14. Aún no se guarda nada en disco (A4).

## A0d (solo jugador) · Prueba de tubería Meshy (16 nov 2026, LOW)
**Resumen fácil:** el muñeco azul de relleno se ha cambiado por tu personaje de Meshy, en una versión ligera (4 000 triángulos, 613 KB) que conserva la cara. Camina, corre, dispara, recarga y muere con las animaciones de Meshy. De momento solo el jugador; el zombi falta. Para probarlo en el móvil hace falta publicar una dirección (aún no la hay).

**Qué trae el GLB de Meshy (informe)**
- Archivo original: 25,7 MB (guardado en `arte_fuente/jugador_meshy_alto_36k.glb`, fuera de `public/`). 36 722 triángulos, 66 huesos, 3 texturas de 4K (color, normales, metal-rugosidad).
- Las 10 animaciones vienen TODAS en el mismo GLB: Axe_Breathe_and_Look_Around, Walking, Running, Run_and_Shoot, Standing_Reload, Dead y 4 más (quedan en el original). No hay animación de «golpe recibido» (hit).
- Receta 003 vs este archivo: 66 huesos > 40 (se bajaron a 20 uniendo dedos y puntas de pies/cabeza); 25,7 MB >> 600 KB; texturas 4K → 1024; el metal-rugosidad se descarta (metalness=0).

**Versión de juego** (`tools/prep_player.mjs`, se puede repetir: `node tools/prep_player.mjs <origen.glb> <destino.glb> [triángulos] [textura]`)
- 4 000 triángulos (simplificación meshopt), 20 huesos, textura color + normales a 1024 en WebP calidad 78, posiciones cuantizadas, solo 6 clips: idle (=Axe_Breathe…, postura de guardia con las manos cerradas), walk, run, shoot, reload, die. Solo rotaciones + traslación de la cadera (X/Z aplanadas salvo en `die`).
- Resultado: 613 KB (meta 600; el idle de 11 s pesa más; con KTX2 bajará). Se ve la cara y las 6 animaciones sin deformarse en el visor.
- Juego: escala 0,53 (altura 0,9 como el relleno), clips idle/walk/run/shoot/reload/die en `models.config.js`. Tiny solo usa idle y run (no se ha cambiado el comportamiento).
- `assets.js` (receta §3): metalness=0 y sin metalnessMap, anisotropía 4, `frustumCulled=false` en mallas con esqueleto. KTX2 queda para más adelante.
- Comprobado: build OK; el juego arranca sin errores de consola con el nuevo jugador; se ve con sombra y a escala correcta (captura en Chromium con GPU por software). Triángulos totales 11 344.
- NO comprobado: fps en iPhone 14 (en el entorno de pruebas va a ~6 fps por software, no sirve); brillo real (la captura es de noche y casi negra, el personaje se ve oscuro; si en el móvil sale demasiado oscuro hay que subir su luz); ojos y boca en tamaño de juego.

**Pendientes**
- Boca = línea muy fina: NO tocada; pendiente para el creador de personaje (se hará con el modelo alto de 36k y/o pintando la textura).
- Orientación (+Z hacia delante) y giro al apuntar: no se ven fallos en la captura, confirmar en el móvil.
- Zombi: falta su GLB (receta: 800/700/1500 triángulos, textura 512).

## Luz de día provisional (16 nov 2026, LOW)
**Resumen fácil:** el usuario pidió que el juego sea de día ya. Cambiados cielo, niebla (misma densidad 0.03), luces y color del suelo en `world.js`. La noche de Tiny queda anotada en un comentario para recuperarla en C1 (ciclo día/noche). Comprobado en captura; fps en iPhone sin medir con esta luz.

## Cámara más cerca (16 nov 2026, LOW)
**Resumen fácil:** el usuario pidió la cámara más cerca, como en su vídeo de referencia (Instagram). La distancia pasó de (0, 14, 8.6) a (0, 7.4, 4.6): misma inclinación, la mitad de lejos. Cambio en `renderer.js` (`OFF`). Excepción a «Tiny igual» decidida por el usuario. Pendiente: medir fps (se ven menos objetos, debería ir igual o mejor) y ajustar el tono del suelo a la referencia (gris azulado con cuadrícula suave).

## Deslizadores de cámara en ?debug (16 nov 2026, LOW)
**Resumen fácil:** con `?debug` aparecen dos barras (Altura y Atrás) con su número, más la distancia y el ángulo resultantes. El usuario las mueve en vivo y dicta los números que le gustan. Código en `debug.js` (mueve `OFF`). Queda por fijar el valor elegido en `renderer.js`.
**Observación:** al acercar la cámara a la mitad, la velocidad aparente en pantalla se duplicó: eso explica parte de «se mueve muy rápido». Pendiente subpaso A0e (movimiento táctil, velocidad, animaciones conectadas) a pedir al usuario.
