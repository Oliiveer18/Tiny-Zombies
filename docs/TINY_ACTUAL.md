# TINY_ACTUAL · cómo es Tiny Zombies hoy (lo que debe quedar EXACTAMENTE igual)

Proyecto Vite + Three.js 0.170. `npm install && npm run dev` · `npm run build` (sale en `dist/`). Unas 320 líneas. Modelos opcionales: GLB de Meshy en `public/models/` con los nombres de `src/models.config.js`; si faltan se usan cápsulas y cajas de relleno.

## Archivos
| Archivo | Qué hace |
|---|---|
| `main.js` | Renderer, escena, cámara, composer (bloom), bucle, inicio/muerte, seguimiento de cámara |
| `player.js` | Movimiento, estamina, apuntado, colisiones con obstáculos, animación (clips o por código) |
| `zombies.js` | Tipos de zombi, aparición, IA de persecución, rodeo de obstáculos, ataque, muerte (con piscina de objetos) |
| `weapons.js` | Disparo con dispersión y rayo, recarga, granadas, explosión |
| `world.js` | Luz, suelo, niebla, props instanciados (vallas, barriles…), física de props lanzados por explosiones |
| `effects.js` | Fogonazo, trazadora, impacto, explosión |
| `input.js` | Teclado, ratón, doble joystick táctil, botones GRAN./RECAR. |
| `assets.js`, `models.config.js` | Carga de GLB, instancias, clips, rellenos |
| `ui.js`, `index.html` | HUD (vida, estamina), mensajes, joysticks |

## Cámara
Perspectiva fov 38, near 0.5, far 120. Desfase fijo (0, 14, 8.6) respecto al punto seguido (inclinación ≈ 58°). Sigue al jugador con suavizado `1 - 0.0005^dt` y se adelanta un 12 % hacia donde apunta. Temblor aleatorio proporcional a `wp.shake` (disparo 0.04, granada 0.6).

## Aspecto
- Renderer: sin antialias, `powerPreference high-performance`, pixelRatio ≤ 1.5 en táctil (≤ 2 en PC), sombras PCFSoft, tone mapping ACES, exposición 1.1.
- Post-proceso: EffectComposer + RenderPass + UnrealBloomPass (fuerza 0.25 táctil / 0.4 PC, radio 0.6, umbral 0.85) + OutputPass.
- Escena: fondo y niebla `0x070b16`, niebla exponencial 0.03. Luz hemisférica (`0x3a4f80`/`0x0a0c14`, 0.6) y luz direccional «luna» `0x7f9cff` 0.9 con sombras (mapa 1024 táctil / 2048 PC, área ±20) que sigue al jugador. Suelo `0x101a33`. Viñeta en CSS.

## Jugador
Vida 100, estamina 100. Velocidad 4.2 (andar) / 7 (correr) y ×0.8 disparando. Correr gasta 28/s, descansar recupera 16/s; si se agota (0) queda «exhausto» hasta superar 20. Radio de colisión 0.25 contra obstáculos circulares. Teclado: WASD, Shift, clic disparar, R recargar, E granada. Táctil: joystick izquierdo mover (correr al empujar >0.92), derecho apuntar y disparar.
**Apuntado manual:** ratón sobre el plano del suelo, o joystick derecho; sin joystick, mira hacia donde camina. Retícula en el suelo.

## Armas
- Arma de fuego única: cargador 30, cadencia 0.11 s, recarga 1.5 s, dispersión ±0.03 rad, alcance 28, daño 1. El rayo se corta en el primer obstáculo (radio ×0.8) o zombi (radio +0.12); los sacos no frenan balas. Trazadora, fogonazo e impacto.
- Granadas: 3 al inicio, máximo 5. Vuelo 0.9 s en arco, distancia 3–12. Explosión: daño a zombis hasta 14 (cae con la distancia, radio 6) con empuje; empuja los props (radio 7, fuerza 16; el coche pesa menos); daño propio hasta 30 en radio 4; temblor de cámara 0.6.

## Zombis (piscinas fijas, nunca se crean en el bucle)
| Tipo | Vida | Velocidad | Daño | Radio | Puntos | Piscina |
|---|---|---|---|---|---|---|
| normal | 3 | 2.3 | 8 | 0.35 | 10 | 36 |
| corredor | 2 | 4.3 | 5 | 0.30 | 15 | 24 |
| tanque | 14 | 1.6 | 20 | 0.55 | 50 | 6 |
Persiguen al jugador en línea recta, rodean obstáculos por el lado más corto, se separan entre sí (<0.7) y atacan cada 0.9 s al llegar. Muerte: animación `die` o caída por código y vuelta a la piscina a los 1.6 s. Máximo 40 vivos a la vez.

## Mundo actual (lo que se sustituye)
Arena cuadrada 80×80 (`FIELD = 40`). Props instanciados con semilla fija 7: vallas 26, barriles 14, barreras 12, cajas 16, sacos 14, coches 5, con radios de colisión y física al explotar (gravedad 22, rebotes).

## Oleadas actuales (se sustituyen, decisión del usuario)
Cola de 6 + 4×oleada; corredores desde la oleada 2, tanques desde la 3; aparición a 22 de distancia; +1 granada por oleada; puntos y contador de oleada. En el juego nuevo los zombis están colocados en el mundo y se alertan por ruido (DISENO §4); las granadas salen del botín.

## Cosas del código a tener en cuenta al ampliarlo
- Usa `Math.random` en la aparición, el temblor de cámara, la dispersión y la física de props: lo que afecte al mundo o a la jugabilidad debe pasar a semilla (norma 3 de CLAUDE.md).
- Obstáculos, props y zombis están en listas globales y se recorren enteros: con un mundo grande hay que repartirlos por región y usar una rejilla espacial.
- No hay guardado ni ids de entidades.
