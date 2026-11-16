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
