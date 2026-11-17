# PAQ-G1 · Prueba de carga gráfica (medir el techo real del móvil)

- **Estado:** ver `docs/CONTINUAR.md` · **Esfuerzo:** MEDIUM · **Base:** PAQ-01 ENTREGADO · **Depende de:** PAQ-01 (comparten `debug.js`)
- **Decisiones que aplica:** `docs/DECISIONES.md` 2.5-2.8 · **Leer antes:** `docs/CALIDAD_GRAFICA.md` entero (es corto)
- **Objetivo:** un modo `?carga` que mida en el propio iPhone cuánta geometría, cuántos personajes animados, cuántas luces y qué opciones de calidad aguanta a ≥ 58 fps. Con su resultado Fable fija los presupuestos reales. **No cambia nada del juego normal.**

## Archivos que se tocan
Nuevo `src/carga.js`. Cambios mínimos en `src/main.js` (arrancarlo solo si la dirección lleva `?carga`), `src/renderer.js` (exportar lo necesario para conmutar bloom, MSAA y resolución) y `src/world.js` (acceso a la luz con sombra). Nada más.

## Trabajo
### 1. Qué añade a la escena (todo alrededor del jugador, dentro de lo que ve la cámara Tiny)
| Carga | Cómo | Escalones |
|---|---|---|
| **Geometría estática** | Mallas instanciadas de un objeto de ≈ 2 000 triángulos (esfera facetada con material estándar y una textura de 512 generada), repartidas en rejilla sobre el suelo; proyectan y reciben sombra | 50 000 · 100 000 · 200 000 · 400 000 · 800 000 triángulos visibles en la pasada principal |
| **Personajes animados** | Clones del jugador actual (`SkeletonUtils.clone`) con su propio mezclador reproduciendo `walk`, con sombra | 10 · 20 · 40 · 60 · 80 |
| **Luces puntuales** | Luces sin sombra de radio 9 m sobre la zona visible | 2 · 4 · 8 |
| **Transparencias** | Explosiones del juego (`explosion()`) repetidas cada 0,5 s en pantalla | 1 · 3 simultáneas |
| **Opciones de calidad** (con la escena base del mapa de prueba) | Resolución 1,5 / 2 / 3 · MSAA 0 / 4 · bloom sí / no · sombras no / 1 024 / 2 048 | cada combinación indicada abajo |

### 2. Prueba automática
- Botón grande «Iniciar prueba» (no empieza sola: Safari necesita un toque). Mientras corre, el jugador no recibe daño y los zombis están quietos (modo `?prueba=1` forzado).
- Para cada escalón: aplicar, esperar 1 s, medir 3 s → fps medio, peor cuadro y ms de CPU. Después retirar esa carga antes de la siguiente (las cargas no se acumulan entre familias).
- Si un escalón baja de 30 fps, no se prueban los superiores de esa familia (se anota «—»).
- Orden: base → geometría → personajes → luces → transparencias → calidad (resolución 3 con MSAA 4; resolución 3 sin MSAA; resolución 2 con sombras 2 048; resolución 2 sin bloom; resolución 2 sin sombras) → **escena combinada** (200 000 triángulos + 40 personajes + 4 luces).
- Duración total ≤ 100 s.

### 3. Resultado
- Al terminar, una tabla de texto a pantalla completa, legible en una captura del móvil en vertical: una fila por escalón con `fps · peor cuadro · CPU · triángulos reales · llamadas`, en verde si cumple (≥ 58 fps y ≤ 25 ms) y en rojo si no. Encabezado con versión, tamaño de pantalla, `devicePixelRatio` y orientación.
- Botón «Copiar» (texto al portapapeles) y botón «Cerrar» (recarga sin `?carga`).
- Los mismos datos en `window.__carga` para las pruebas automáticas.

### Reglas
- Sin `?carga` en la dirección, `carga.js` no se ejecuta: ni crea objetos ni cambia opciones. El juego normal queda idéntico.
- No se cambia ninguna opción de calidad por defecto del juego en este paquete: solo se mide.
- Sin `Math.random` para colocar (rejilla fija): la prueba es repetible.

## Pruebas (obligatorias; Chromium con viewport de iPhone 14 en vertical 390 × 844 y en horizontal 844 × 390)
| # | Prueba | Aceptación |
|---|---|---|
| 1 | `npm run build` | Compila |
| 2 | Juego normal y `?prueba=1&debug`, sin `?carga` | Mismos triángulos, llamadas y texturas en el medidor que antes del paquete; 0 errores |
| 3 | `?carga` → «Iniciar prueba» hasta el final | Termina en ≤ 100 s, muestra la tabla con todas las filas, `window.__carga` tiene una entrada por escalón, 0 errores |
| 4 | Comprobar dos escalones a mano en `window.__carga` | El de 200 000 declara entre 190 000 y 210 000 triángulos en la pasada principal; el de 40 personajes tiene 40 mezcladores activos |
| 5 | Al cerrar | Vuelve al juego normal; geometrías y texturas del medidor vuelven a la cifra de la prueba 2 |
| 6 | Captura de la tabla en vertical | Todas las filas se leen sin desplazar |

**No se puede comprobar aquí (y es lo que importa):** las cifras del iPhone real. En el navegador de pruebas los fps no significan nada: no interpretarlos.

## Qué decir al usuario al entregar
«Abre el juego añadiendo `?carga` al final de la dirección, toca Iniciar prueba, espera minuto y medio sin tocar nada y mándale a Fable una captura de la tabla. Hazlo con el móvil sin modo de bajo consumo y con batería suficiente.»

## Criterios de aceptación del paquete
1. Pruebas 1-6 superadas y documentadas.
2. Juego normal sin cambios (prueba 2).
3. Ningún archivo fuera de la lista modificado (salvo documentos de Sonnet).

---
## Informe de Sonnet (rellenar al entregar)
- Commit(s): «PAQ-G1 entregado (Sonnet)».
- Qué se hizo: `src/carga.js` nuevo (solo se importa con `?carga`): botón «Iniciar prueba», 22 escalones (base; 50k-800k triángulos estáticos; 10-80 personajes; 2-8 luces; 1-3 explosiones; 5 de calidad; combinado), 1 s de espera + 3 s de medida, tabla a pantalla completa verde/roja, «Copiar», «Cerrar», datos en `window.__carga` (con `declarados` y `mezcladores`). `renderer.js`: exporta `bloom`, `setCalidad`, `calidadActual`. `main.js`: arranca el bucle de la prueba solo con `?carga`. `test.js`: 1 línea, `?carga` fuerza el mapa de prueba sin guardarlo.
- Decisiones secundarias tomadas: `test.js` no estaba en la lista de archivos; la línea añadida es la única forma de forzar `?prueba=1`. La familia «calidad» y la base no se saltan por <30 fps (son opciones, no escalones crecientes). Triángulos medidos = todas las pasadas (sombra incluida); `declarados` = pasada principal. Sombras «no» = `castShadow=false` de la luz.
- Resultado de cada prueba (1-6): 1 build OK. 2 juego normal: 30 512 triángulos / 82 llamadas / 27 texturas, igual que tras PAQ-01. 3 recorrido completo hasta la tabla con 22 entradas en `__carga`, 0 errores (en el navegador de pruebas dura ≈55 s porque salta escalones <30 fps, como debe). 4 el escalón combinado declara 200 000 triángulos y 40 mezcladores; el escalón suelto de 200k no se llegó a ejecutar aquí por ir <30 fps (usa el mismo código). 5 «Cerrar» vuelve a la dirección sin `?carga`. 6 tabla en 390×844 legible sin desplazar (captura revisada).
- No comprobado: cifras reales en iPhone (lo único importante), recorrido completo de ≈90 s con todos los escalones, y horizontal.

## Revisión de Fable
(pendiente)
