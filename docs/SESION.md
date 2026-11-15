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
