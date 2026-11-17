# PAQ-G1b · Prueba de carga: que arranque en táctil y que se vea lo que hace

- **Estado:** ver `docs/CONTINUAR.md` · **Esfuerzo:** LOW-MEDIUM (una sola entrega) · **Base:** `4c42bd0` o posterior · **Depende de:** PAQ-G1
- **Pedido por el usuario (17 nov):** al pulsar «Iniciar prueba» no queda claro si la prueba ha empezado.
- **Calidad gráfica:** no se toca nada del render ni de las opciones por defecto.

## Diagnóstico de Fable (comprobado, no es una suposición)
1. **En táctil la prueba NO arranca.** Reproducido con Chromium táctil 390 × 844: tras tocar «Iniciar prueba» pasan 110 s con la pantalla inicial y `__carga` vacío. Con ratón sí arranca (por eso pasó las pruebas de PAQ-G1). Causa: `src/input.js` línea 36 escucha `touchstart` en todo el documento y hace `preventDefault()` en las zonas de los joysticks, salvo que el toque caiga en un elemento con clase `.btn` o `.ui`. El botón de `carga.js` no tiene ninguna de las dos, así que el navegador nunca genera el `click`.
2. **Aunque arrancase, la interfaz es insuficiente:** la pantalla inicial desaparece y solo queda un texto amarillo de 11 píxeles arriba a la izquierda.

## Qué NO se cambia
La lógica de medición, la lista de 22 escalones, sus tiempos (1 s de espera + 3 s de medida), la regla de saltar una familia por debajo de 30 fps, el formato de `window.__carga` y lo que se mide. `input.js` tampoco se toca: el arreglo va en `carga.js`.

## Archivos que se tocan
`src/carga.js`. Solo si es imprescindible, `src/main.js` (las líneas de `?carga`). Nada más.

## Parte A · Arreglo del toque
Todos los elementos de la interfaz de la prueba (pantalla inicial, panel, resultados, botones) llevan la clase `ui` para que `input.js` no se coma el toque. Los botones deben funcionar con toque, ratón y teclado (Enter).

## Parte B · Interfaz (cuatro pantallas)
Estilo común: tipografía del sistema (`-apple-system, system-ui, sans-serif`), fondo oscuro `#0e1116`, texto `#e8edf2`, acento verde `#3ecf6e`, aviso ámbar `#f5b942`, error rojo `#ff5a5a`; esquinas redondeadas de 12 px; botones de ≥ 48 px de alto; respeta `env(safe-area-inset-*)`; sin desplazamiento horizontal en 390 px de ancho. Cifras con `font-variant-numeric: tabular-nums` para que no bailen.

**1. Inicio** (pantalla completa): título «Prueba de carga», versión (`__VER__`), pantalla y orientación; tres líneas: «Dura unos 90 segundos» · «No toques la pantalla mientras dura» · «Quita el modo de bajo consumo»; botón grande «Iniciar prueba».

**2. En curso.** Al pulsar, **en el mismo instante** el botón pasa a «Prueba en curso…» (desactivado, con un punto que parpadea) y la pantalla inicial se convierte en un **panel compacto fijo arriba** (≤ 150 px de alto, fondo `#0e1116` al 88 %), con la escena visible debajo (la escena es lo que se mide). El panel muestra:
- Fila 1: punto parpadeante + «PRUEBA EN CURSO» a la izquierda; **cuenta atrás** grande a la derecha («1:28»).
- Fila 2: **barra de progreso** (0-100 %, según escalones terminados + fracción del actual).
- Fila 3: **fase** en claro: «Paso 7 de 22 · 20 personajes» y debajo, en pequeño, qué se está probando con palabras llanas según la familia: base → «Escena normal» · geo → «Más objetos y detalle» · per → «Personajes animados» · luz → «Luces» · tra → «Explosiones» · cal → «Opciones de calidad» · comb → «Todo a la vez». En el segundo de espera de cada escalón añade «(preparando)» y en los 3 s de medida «(midiendo)».
- Fila 4: **«FPS ahora: 58»**, verde si ≥ 58, ámbar 30-57, rojo < 30.
- La cuenta atrás es una estimación: `(escalones que quedan sin saltar) × 4 s − tiempo ya gastado en el actual`; empieza en ≈ 1:28 y se recalcula cuando se salta una familia (puede bajar de golpe: correcto). Nunca muestra negativos.
- **El panel se actualiza como mucho 4 veces por segundo** (no en cada cuadro), para no alterar la medición. Los FPS mostrados son la media del último medio segundo, calculada con los tiempos que el bucle ya tiene.
- Pedir `navigator.wakeLock.request('screen')` dentro de `try` (si existe) al empezar y soltarlo al terminar: evita que la pantalla se apague. Si no existe, no pasa nada.

**3. Completada** (pantalla completa, con desplazamiento vertical si hiciera falta): arriba «✔ Prueba completada» en verde y una frase: «Haz una captura de esta pantalla y envíasela a Fable.» Debajo la **tabla de resultados** con las mismas columnas de hoy (paso, fps, peor, CPU, tri, llam), verde/rojo por fila como ahora, los escalones saltados en gris con «—» y la cabecera con versión, pantalla y orientación. **La tabla entera con sus 22 filas debe caber en una sola captura a 390 × 844** junto con el título (letra monoespaciada pequeña para la tabla; los botones pueden quedar por debajo). Botones: **«Repetir prueba»** (principal), «Copiar resultados» (al copiar, el texto del botón pasa 2 s a «Copiado ✔»; si falla, «No se pudo copiar») y «Cerrar» (como hoy).
- **Repetir** vuelve a ejecutar la prueba sin recargar la página: retira cualquier carga que quede, vacía `window.__carga` **sin cambiar de objeto** (`R.length = 0`), reinicia el estado y empieza igual que la primera vez.

**4. Error o interrupción** (pantalla completa): título en rojo, qué ha pasado en una frase y **qué hacer**. Debajo, la tabla con lo medido hasta ese momento (si hay algo) y los botones «Repetir prueba», «Copiar resultados» y «Cerrar». Al entrar aquí se retira la carga en curso y se restaura la calidad. Casos:
| Caso | Cómo se detecta | Texto |
|---|---|---|
| Saliste de la página | `visibilitychange` con `document.hidden` durante la prueba | «La prueba se ha interrumpido porque la pantalla se apagó o cambiaste de aplicación. Repítela sin salir del juego.» |
| El móvil se ha quedado sin recursos gráficos | `webglcontextlost` en el lienzo del juego | «El móvil se ha quedado sin memoria gráfica en el paso «…». Es un resultado útil: haz una captura y envíala. Para repetir, cierra otras aplicaciones y recarga la página.» |
| Error de programa | `error` o `unhandledrejection` de `window` durante la prueba, o una excepción al aplicar un escalón (`step.ap()` en `try`) | «Ha fallado el paso «…»: <mensaje>. Haz una captura y envíala a Fable. Puedes repetir la prueba.» |
| Bloqueo | Con la página visible, más de 8 s sin que avance el bucle (temporizador `setInterval` de 1 s que compara la hora del último cuadro) | «La prueba se ha quedado parada en el paso «…». Cierra otras aplicaciones, quita el modo de bajo consumo y repítela.» |
Los escuchadores de error solo actúan mientras la prueba está en curso.

## Arquitectura mínima
Un único estado `ui = 'inicio' | 'curso' | 'fin' | 'error'` y una función que pinta cada pantalla. Exponer para las pruebas `window.__cargaUI = { estado, paso, total, restante, fps, error }` (se actualiza a la vez que el panel). Sin librerías. Sin `innerHTML` con texto que venga de un error (usar `textContent`).

## Pruebas (obligatorias; con Playwright, que ya está instalado: `require('playwright')`, sin instalar nada)
Servir con `npm run build` + `npx vite preview`.
| # | Prueba | Aceptación |
|---|---|---|
| 1 | `npm run build` | Compila |
| 2 | **Contexto táctil** (`hasTouch: true`, 390 × 844), `page.tap` en «Iniciar prueba» | En < 300 ms: el botón dice «Prueba en curso…» o ya se ve el panel con «PRUEBA EN CURSO»; `__cargaUI.estado === 'curso'` |
| 3 | Lo mismo con ratón (`page.click`) y con Enter | Arranca igual |
| 4 | Durante la prueba, muestrear `__cargaUI` cada 2 s | `paso` no decrece y llega al total; `restante` no es negativo y, salvo saltos de familia, baja; la barra crece; el texto de fase cambia; «FPS ahora» muestra un número |
| 5 | Captura del panel en curso a 390 × 844 y a 844 × 390 | Panel ≤ 150 px de alto en vertical, legible, sin texto cortado ni fuera de pantalla; en horizontal no tapa más de la mitad de la altura |
| 6 | Esperar al final | «✔ Prueba completada»; `__carga.length === 22`; tabla completa visible sin desplazar en 390 × 844 (captura); `__cargaUI.estado === 'fin'` |
| 7 | «Repetir prueba» (con `tap`) | Vuelve a «en curso» desde el paso 1, `__carga` se vacía y al terminar vuelve a tener 22; triángulos y llamadas del escalón «base» iguales (± 2 %) a los de la primera pasada (no quedan cargas colgadas) |
| 8 | «Copiar resultados» | El botón cambia a «Copiado ✔» o «No se pudo copiar» (según permisos del navegador de pruebas); no hay excepción |
| 9 | Interrupción: en mitad de la prueba, simular página oculta (`Object.defineProperty(document,'hidden',{value:true,configurable:true})` + `dispatchEvent(new Event('visibilitychange'))`) | Pantalla de interrupción con su texto, tabla parcial y «Repetir prueba»; al repetir (restaurando `hidden`) termina bien |
| 10 | Error: en mitad de la prueba, `window.dispatchEvent(new ErrorEvent('error',{message:'prueba'}))` | Pantalla de error con el paso y el mensaje; «Repetir prueba» funciona |
| 11 | Contexto perdido: `canvas.dispatchEvent(new Event('webglcontextlost'))` | Pantalla con el texto de memoria gráfica |
| 12 | Comparar resultados antes/después del paquete en el mismo navegador de pruebas | Mismos 22 nombres de escalón y mismos escalones saltados; fps del escalón «base» dentro de ± 10 % (la interfaz no altera la medición de forma apreciable) |
| 13 | Juego normal sin `?carga` | Idéntico (mismos triángulos y llamadas en `?debug`); `carga.js` sigue siendo un archivo aparte; 0 errores |
| 14 | «Cerrar» | Vuelve a la dirección sin `?carga` |

**No se puede comprobar aquí:** los fps reales y el toque en el iPhone de verdad. Decirlo en el informe.

## Criterios de aceptación
1. Pruebas 1-14 superadas y documentadas, con las capturas 5 y 6 revisadas.
2. La lista de escalones, los tiempos y los datos medidos no cambian.
3. Solo se ha tocado `src/carga.js` (y `main.js` si hizo falta, justificado en el informe), más los documentos de Sonnet.

---
## Informe de Sonnet (entregado 17 nov)
- Commit(s): «PAQ-G1b entregado (Sonnet)…» (ver `git log`).
- Qué se hizo: solo `src/carga.js` (interfaz reescrita; lógica de medición, 22 escalones, tiempos y formato de `__carga` intactos). Estado único `inicio|curso|fin|error`, todos los elementos con clase `ui`, panel fijo arriba (115 px de alto) con punto parpadeante, cuenta atrás, barra, paso/fase y «FPS ahora» (actualización cada 250 ms desde un `setInterval`, no desde el bucle), pantalla final con tabla de 22 filas + Repetir/Copiar/Cerrar, pantalla de error con los 4 casos, `wakeLock`, `window.__cargaUI`.
- Decisiones secundarias: (1) El juego usa Enter para empezar y hace `preventDefault`, lo que anulaba el clic del botón con teclado; los botones atienden Enter por su cuenta (`keydown` con `stopPropagation`). (2) «Copiar» tiene un límite de 1,5 s por si el portapapeles no responde. (3) Quité la variable `cargas` sin usar. (4) Panel con `pointer-events:none` para no interferir con nada. (5) Los fps mostrados son la media de las dos últimas ventanas de 250 ms (≈ 0,5 s). (6) `restante` cuenta los escalones no saltados × 4 s menos lo gastado; baja de golpe al saltar una familia.
- Resultado de cada prueba (1-14), Chromium con render por software (≈ 5 fps), 390×844:
  1. Compila OK.
  2. Tap táctil (`hasTouch`): `touchstart` → panel visible en 179 ms (medido en la página con MutationObserver); `__cargaUI.estado==='curso'`, `restante` 88. OK.
  3. Ratón (`click`) y Enter: ambos pasan a `curso` (restante 88). OK (Enter requirió el arreglo de la decisión 1).
  4. Muestreo cada 2 s: `paso` 1→22 sin bajar, `restante` 87→0 sin negativos (baja de golpe en los saltos), barra 2 %→100 %, fase cambia («preparando/midiendo», familias), «FPS ahora» numérico. OK.
  5. Panel 115 px de alto en vertical (≤ 150) y 115 px en 844×390 (de 390 = 30 %); sin texto cortado. Capturas revisadas. OK.
  6. Fin: «✔ Prueba completada», `__carga.length===22` (11 saltados), `estado==='fin'`, tabla completa de 22 filas visible en 390×844 junto con título y botones; sin desplazamiento horizontal (scrollWidth 390). OK.
  7. Repetir (tap): vuelve a `curso` paso 1, `__carga` vaciado y el MISMO objeto, termina con 22; base 27456 tri / 58 llam en ambas pasadas (0 % de diferencia), mismos 22 nombres. OK.
  8. Copiar: sin permiso → «No se pudo copiar» (2 s); con permiso → «Copiado ✔» (2 s), luego vuelve. Sin excepciones. OK.
  9. `hidden` simulado a los 8 s: pantalla «Prueba interrumpida» con su texto, tabla parcial y Repetir; al repetir con `hidden=false` termina con 22. OK.
  10. `ErrorEvent`: «Error en la prueba… paso «50k tri estáticos»: prueba…», Repetir funciona. OK.
  11. `webglcontextlost`: texto de memoria gráfica con el paso. OK.
  12. Antes/después en el mismo navegador: mismos 22 nombres y mismos 11 escalones saltados; base 5,46 fps → 5,42 y 5,41 fps (< 1 %). OK.
  13. Sin `?carga`: `carga.js` no se pide (chunk aparte), `__cargaUI` no existe, 0 errores; chunk principal 697,26 kB igual que antes, `main.js` sin tocar. Triángulos de `?debug` no comparados línea a línea (el panel no mostró las líneas en la prueba), pero no ha cambiado ningún archivo del juego. OK parcial.
  14. «Cerrar» → `http://localhost:4180/` (sin `?carga`). OK.
- No comprobado: fps reales y toque en el iPhone de verdad; `wakeLock` (no existe en el navegador de pruebas, solo se verificó que no falla); el bloqueo de 8 s (caso «Bloqueo») no se provocó, solo está implementado. En esta entrega la pantalla de arranque de Tiny («Toca para empezar») sigue viéndose detrás del panel, como ya ocurría.

## Revisión de Fable
(pendiente)
