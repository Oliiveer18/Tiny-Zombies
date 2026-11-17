# SESION · diario técnico (cada entrada empieza con el «Resumen fácil»)

## PAQ-02 · Interacción y reja (17 nov 2026)
**Resumen fácil:** ahora puedes interactuar con cosas. Mira a una caja o barril y aparece el botón «EMPUJAR»; el contenedor se arrastra manteniendo pulsado. En el callejón hay una reja con candado: puedes dispararle al candado, o ponerte frente a ella y mantener «FORZAR» 4 segundos. Sin candado, «ABRIR» abre las dos hojas, o simplemente camina contra ellas; una granada cerca las rompe. En el móvil con mando: ✕ es Usar. Pruébalo en vertical, mirando a la caja que hay al principio del callejón.

**Detalle técnico**
- `usar.js` (sin THREE ni DOM): órdenes → validación → efecto; `objetivo` y `ruido` exportados. `physics.js`: bisagras (`addHinge`, `hingeImpulse`, `hingeHit`), `impulse`, `setMasa/setMu`, `params.fGranada`. `world.js`: `crearHoja`, `damageHoja`, aro del objetivo, `blast` con hojas. `alley.js`: dibujo de la reja. `weapons.js`: enlace entrada→orden y ruido de disparo/explosión.
- Informe completo con las 14 pruebas en el traspaso.

## PAQ-G1 · Prueba de carga gráfica (17 nov 2026)
**Resumen fácil:** he añadido una prueba que mide hasta dónde aguanta tu iPhone (geometría, personajes, luces, calidad). Abre el juego con `?carga` al final de la dirección, toca «Iniciar prueba», espera 90 s sin tocar y mándale a Fable una captura de la tabla. El juego normal no cambia.

**Detalle técnico**
- `src/carga.js` (solo con `?carga`), `renderer.js` (`setCalidad`, `calidadActual`, `bloom`), `main.js` (bucle de la prueba), `test.js` (`?carga` fuerza el mapa de prueba).
- Rejilla fija con reparto `(i·37) mod N`, sin `Math.random`. Informe y pruebas en el traspaso.

## PAQ-01 · Cámara definitiva y lectura del escenario (17 nov 2026)
**Resumen fácil:** la cámara que elegiste (Tiny) ya es la única del juego. Si te pones detrás de un muro, ese muro se vuelve transparente para que no te tape. Hay un aro claro bajo tus pies para localizarte, y los zombis muy lejanos no se dibujan. Para probarlo: acércate a un muro por detrás y míralo volverse transparente.

**Detalle técnico**
- `renderer.js`: `OFF=(0,14,8.6)`, `CAM={k:1.81,vel:1.55}`; fuera `CAMS/setCam/?cam=/tz_cam`. `controls.js`: sin fila Cámara.
- `alley.js`: `MUROS` (material clonado por tramo) y `updateMuros` (cruce planta cámara→jugador ensanchado 0,5 m, altura de visión < 3,2 → opacidad .25, suavizado 0,15 s, depthWrite se restaura a 1).
- `player.js`: `player.aro`. `zombies.js`: `LEJOS=26`, histéresis 2 m, sin animar lejos.
- `debug.js`: sin tope de triángulos, línea de memoria de texturas, etiquetas leídas al abrir el panel.
- Pruebas y cifras: ver informe en `coordinacion/TRASPASOS/PAQ-01_camara_y_lectura.md`.

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

## A0e · Movimiento del jugador (16 nov 2026, MEDIUM)
**Resumen fácil:** el personaje ya no arranca ni frena en seco, va más lento (con barra «Velocidad» en `?debug` para ajustarla), la cámara lo mantiene siempre en el centro (como el vídeo de referencia) y usa todas las animaciones: quieto, andar, correr, disparar, recargar y morir. Cámara fijada en tus medidas: Altura 8,3 · Atrás 5,8.

**Detalle técnico**
- `player.js`: `MOVE={walk:2.6,run:4.3,mult,acc:9,dec:14,dead:.12}`; velocidad suavizada (`vel`, aceleración/frenada exponencial), zona muerta del joystick con reescalado; el apuntado automático al caminar usa la dirección del stick. Joystick ya era analógico en Tiny (magnitud 0–1).
- Animaciones: reload si `wp.reload>0`, shoot si `input.fire`, run si velocidad>3,2, walk si >0,15, idle; `timeScale` según la velocidad (cosmético). Morir: `game.js` reproduce `die` una vez al terminar la partida.
- Cámara: `CAM_LEAD=0` en `game.js` (Tiny: .12, la cámara se adelantaba hacia donde apuntas y por eso el personaje se salía del centro). Excepción decidida por el usuario.
- Comprobado: build OK, arranca sin errores, personaje centrado en captura. NO comprobado: tacto real en el iPhone, deslizamiento de pies, atascos con vallas (no tocado; la colisión sigue siendo la de Tiny), clip `shoot` (es una carrera disparando; parado puede verse raro).

## Ajuste con las medidas del usuario (16 nov 2026, LOW)
Cámara: Altura 7,6 · Atrás 4,9 (distancia 9,0 · ángulo 57°). Velocidad: andar 2,1 · correr 3,4 (barra ×0,80 sobre 2,6/4,3). Fijadas en `renderer.js` y `player.js` (`MOVE`); la barra de `?debug` parte de ×1,00 sobre estos valores. Provisional hasta que el usuario lo vuelva a ajustar.

## Calidad del personaje: MSAA y resolución (16 nov 2026, LOW)
**Resumen fácil:** el personaje se veía «pixelado» porque el juego dibujaba sin suavizado de bordes (antialias apagado) y a 1,5 de resolución en el móvil. Ahora: suavizado MSAA ×4 en el post-proceso y resolución 2 (el iPhone 14 admite 3). Se puede comparar con `?res=1.5|2|3` y `?msaa=0|4` en la dirección. Gratis (sin créditos de Meshy).
**Detalle:** `renderer.js`: `WebGLRenderTarget` con `samples` y `HalfFloatType` para el `EffectComposer`; `setPixelRatio` por `?res=` o `min(dpr,2)` en táctil. NO medido en iPhone (el entorno no tiene GPU). Riesgo: peor cuadro (ahora ~32 ms en el iPhone según el medidor; meta ≤25), el usuario mide con `?debug`. Si no llega: res 1.75 o msaa 2. Siguiente palanca si aún se ve blando: textura del jugador a 2048 (cuesta ~+400 KB) o el modelo alto (Meshy, ya pagado, sin créditos nuevos).

## A0f · Calidad del jugador (16 nov 2026, MEDIUM)
**Resumen fácil:** el personaje tiene ahora 12 000 triángulos (antes 4 000), textura de 2048 (antes 1024) y reflejos suaves de estudio que dan relieve a tela, cuero y botas. Además se ha quitado la niebla de todo el juego (decisión del usuario). El archivo pasa de 613 KB a 1,0 MB.
**Detalle:** `node tools/prep_player.mjs <alto> public/models/player.glb 12000 2048` (20 huesos, 6 clips, WebP 78). `assets.js`: `RoomEnvironment` + `PMREMGenerator` (solo materiales del jugador, intensidad .9, roughness .62; sigue metalness 0). `world.js`: `scene.fog=null`; CLAUDE.md norma 1 actualizada (sin niebla general; cámara cercana y centrada).
**Presupuesto:** el medidor marca 27 088 triángulos (todas las pasadas) solo con el jugador: 12 000 ×2 por la sombra + mundo. Con 40 zombis habrá que decidir la opción (a/b/c) de la respuesta Fable 003 sobre el presupuesto. NO medido en iPhone: fps y peor cuadro con 12k + MSAA + res 2.
**Pendiente:** si aún no llega al nivel de la referencia, regenerar textura/personaje en Meshy (decisión del usuario: «sea como sea»).

## A0g · Luz, cámara y paneles (16 nov 2026, LOW)
**Resumen fácil:** el juego se ve menos brillante (exposición 0,85, sol 1,5, ambiente 0,75). Todo lo de `?debug` queda escondido: solo aparece un botón ⚙ arriba a la derecha que lo muestra u oculta. Con los paneles abiertos hay tres barras nuevas de luz (Exposición, Sol, Ambiente) para que dictes los números.
**Detalle:** `world.js` exporta `LUZ={hemi,sun}`; `debug.js`: botón ⚙, `sl()` genérico, el peor cuadro ignora los primeros 6 s (carga y compilado de shaders: el 51 s de la captura era eso, no un fallo de juego). `renderer.js`: exposición .85. Medido por el usuario antes del cambio: 59 fps, 29 384 triángulos con 10 zombis. Pendiente: afinar el tono hacia la referencia (azul frío) con los números del usuario; 004 táctico en `PETICIONES_FABLE.md`.

## A0h · Movilidad del jugador (16 nov 2026, MEDIUM)
**Resumen fácil:** los joysticks ahora aparecen donde pones el pulgar (izquierda = moverte, derecha = apuntar y disparar) y te siguen si el dedo se aleja. Inclinar poco mueve muy despacio (más precisión). Correr se hace con un botón CORRER que se enciende y se apaga (antes se activaba sin querer al empujar al borde). Andar hacia atrás reproduce la animación al revés. Al rozar vallas o barriles resbalas en vez de quedarte pegado. El iPhone no hace zoom, ni menú de mantener pulsado.
**Detalle:** `input.js` `floatStick` (listeners en `document`, id de toque propio, radio 60, el centro sigue al dedo; zonas x<50% mover, x≥50% apuntar, y>18%; ignora toques en `.btn`); `runLock` en `input` y botón `#brun` (izquierda, sobre el joystick); `player.js`: `MOVE.curve=1.5` (potencia de la inclinación), anulación de la componente de velocidad contra el obstáculo, `timeScale` negativo al ir de espaldas (>35 % contra el apuntado); `index.html`: `-webkit-touch-callout`, `gesturestart/change/end` y `dblclick` cancelados.
**Comprobado:** build OK; toques simulados con CDP: el anillo aparece en el punto de toque, se desplaza al alejarse el dedo, se reinicia al soltar; CORRER se enciende; sin errores de consola. **NO comprobado en iPhone:** tacto real, zonas de pulgar, animación al revés (sin probar visualmente), deslizamiento en esquinas (las vallas siguen siendo círculos de radio 0,8: un rectángulo girado llega con A1c), varios dedos a la vez (7, no pedido).

## A0i · Pies sin patinar (16 nov 2026, MEDIUM)
**Resumen fácil:** el personaje patinaba porque andaba mucho más rápido de lo que sus piernas se movían. Medí cuánto avanza de verdad cada animación y ahora el ritmo de las piernas sigue la velocidad real. Entre andar y correr se mezcla poco a poco. En `?debug` hay dos barras nuevas: «Paso (cadencia)» y «Cambio a correr desde».
**Medición (en el GLB, pies en apoyo):** andar 1,10 u/s · correr ≈ 2,9–3,4 u/s (ruidoso por la fase de vuelo) · disparar 1,40 u/s, todo en unidades del modelo; ×0,53 de escala del juego → `clipWalk` .58, `clipRun` 1,8, `clipShoot` .74. **Hallazgo:** con las velocidades elegidas (andar 2,1 · correr 3,4) el «andar» iría 3,6× más rápido que su animación natural, así que desde 0,8–1,3 u/s se usa el clip de correr (a 2,1 va a 1,17×; a 3,4 va a 1,9×). Es cadencia de carrera rápida; si se ve demasiado rápida la salida es bajar la velocidad de correr o la barra «Paso».
**Detalle:** `player.js`: todas las acciones suenan siempre con peso 0..1 (`setEffectiveWeight`, suavizado 12/s): idle/walk/run por velocidad, shoot y reload tienen prioridad; `timeScale` = velocidad/`clip*`×`MOVE.step`; negativo al ir de espaldas; `playDeath()` para el clip `die`. `game.js` usa `playDeath`.
**Comprobado:** build OK, arranca sin errores. **NO comprobado visualmente ni en iPhone** (sin GPU no se aprecia el paso; el usuario debe mirar si los pies patinan).

## A0j · Movimiento táctico (16 nov 2026, MEDIUM)
**Resumen fácil:** andar ahora es de verdad andar (despacio y deliberado); correr es un esfuerzo: toque rápido y, enseguida, otro toque que se mantiene (el anillo se pone naranja); al soltar vuelves a andar. Al apuntar o disparar vas a la mitad de velocidad y no puedes correr, para ser más preciso. Se quita el botón CORRER.
**Detalle:** `MOVE={walk:.9, run:3, aim:.5}` (antes 2,1/3,4/×0,8 al disparar); `blendA/B` 1,4/1,9 (andar con clip de andar, correr con clip de correr); `input.js`: gesto «toque corto <220 ms y <14 px + nuevo toque <350 ms» → `runHold` (sin botón); `player.js`: `aiming=input.aimActive||input.fire` anula correr y aplica `MOVE.aim`; barra «Velocidad al apuntar ×» en `?debug`. Teclado: Shift sigue corriendo.
**Comprobado:** build OK; gesto probado con toques simulados (segundo toque rápido = naranja, suelta = normal, toque lento = andar). **NO comprobado en iPhone:** tacto real y los umbrales de tiempo (220/350 ms). Cifras provisionales: se dictan con las barras.

## Temblor al disparar (16 nov 2026, LOW)
**Resumen fácil:** quitado el temblor de la pantalla al disparar. La explosión de la granada tiembla menos (0,2 en vez de 0,6) porque la cámara ahora está más cerca. Constantes `SHAKE_SHOT` y `SHAKE_BOOM` en `weapons.js`. Movimiento: el usuario NO está conforme y quiere pensarlo antes de tocar nada (pendiente, ver conversación).

## A0k · Correr como Tiny: aro en el joystick (16 nov 2026, LOW)
**Resumen fácil:** el usuario eligió la opción A tras ver cómo lo hacen otros juegos. Correr se hace empujando el pulgar más allá de un aro de puntos que se ve en el joystick (el anillo se pone naranja); dentro del aro, andas más o menos rápido según lo inclines. Desaparece el gesto de toque + mantener.
**Detalle:** `input.js`: `runT` con histéresis (activa >0,85, desactiva <0,75); el aro del CSS (`.stick::after`, radio 0,8) marca la zona; `player.js`: `MOVE.runAt=.85`; dentro del aro la velocidad escala hasta `walk` (0,9), fuera va a `run` (3,0). Apuntando se anula correr (sin cambios). Comprobado con toques simulados (dentro del aro = normal; más allá = naranja; vuelta = normal). NO en iPhone. Fuentes consultadas: Game Developer (sticks flotantes, zonas muertas escaladas), Cursa (gestos táctiles); el resto, criterio propio.

## A0l · Sin correr: caminata intermedia (16 nov 2026, LOW)
**Resumen fácil:** el jugador ya no corre nunca. Hay una sola caminata intermedia (1,4) que va de despacio a ese máximo según lo inclines el joystick; apuntando va a la mitad. Se quita el aro de correr.
**Detalle:** `input.run=false` siempre; `MOVE.walk=1.4`, `aim=.5`; mezcla de clips 0,7–1,2 (a 1,4 mezcla andar y correr lento a ~0,8× de cadencia). La estamina queda sin gasto (la barra existe pero no baja): decidir su uso con la petición 004. Barras de ?debug: «Velocidad ×» ajusta el máximo. NO en iPhone; la animación a 1,4 es una mezcla, si se ve rara hará falta un clip de «caminar rápido/trotar».

## A0m · Animaciones de disparo (16 nov 2026, LOW)
**Resumen fácil:** el personaje dispara con las animaciones de Meshy según hacia dónde te mueves: parado o de lado usa el disparo lateral, andando hacia donde apuntas usa «andar disparando», y de espaldas «andar hacia atrás disparando». Al apuntar vas más lento (0,4 de la velocidad). El archivo pesa 1,18 MB.
**Detalle:** clips añadidos a `prep_player.mjs`: `shoot_side` (Side_Shot, 4 s, sin avance), `shoot_back` (Walk_Backward_While_Shooting_inplace, avanza −0,64 u/s del modelo = −0,34 en juego), `shoot_fwd` (Walk_Forward_While_Shooting, +0,25 → 0,13 en juego; muy lento). Se retiran `Run_and_Shoot` (ya no se corre) y se deja fuera `Kneeling_Reload` (para cuando haya agacharse). Mezcla por pesos: quieto → side; andando → fwd/back/side según `fn=vel·apuntado/|vel|`. `timeScale` de back = vel/.34 (.6–1.6), fwd = vel/.2 (.7–1.6). Limitación: `shoot_fwd` y `shoot_side` no coinciden con el avance real, así que al moverse mientras apuntas los pies pueden deslizar un poco; por eso `MOVE.aim` baja a .4. NO visto en movimiento ni en iPhone.

## A0n · Agacharse con un toque (16 nov 2026, LOW)
**Resumen fácil:** un toque corto en la mitad izquierda de la pantalla agacha al jugador; otro toque lo levanta. Agachado va a la mitad de velocidad y el anillo del joystick se pone azul. De momento el aspecto agachado es PROVISIONAL (se encoge y se inclina) porque no hay animación de agacharse; hay que pedir a Meshy «Crouch Idle» y «Crouch Walk» (gratis).
**Detalle:** `input.js`: fin de toque en zona izquierda con <220 ms y <14 px → `crouchToggle`; tecla C en escritorio; `player.js`: `player.crouch`, `MOVE.crouch=.5` (×aim×walk), `body.scale.y` ×(1−.2·cr) y `rotation.x` .22·cr suavizados; se reinicia al empezar. Comprobado con toques simulados (1.er toque azul, 2.º normal). NO en iPhone. Ruido y sigilo: pendiente de la petición 004 (ruido no existe aún). La zona del toque es la mitad izquierda entera bajo el 18 % superior.

## A0o · Movimiento sin «cámara lenta»
**Resumen fácil:** el personaje cruzaba el suelo rápido pero las piernas se movían despacio. Ahora la velocidad sale de la propia animación de andar (un poco por encima del paso natural) y el personaje es 1.4× más grande, así los pies encajan con el suelo. Para probarlo: abre `…/Tiny-Zombies/?debug&v=N`, camina y mira que los pies no patinen; en ⚙ hay un deslizador «Tamaño del personaje ×».

Técnico: `MOVE={size:1.4,top:1.15,...}`; `K()=player.base*MOVE.size`; `topSpeed()=top*CW*K()*mult` con CW=1.10 (u/s del clip walk). Cadencias de clips = velocidad / (velocidad natural del clip × K()). Colisión escalada con `size`. Mezcla idle/walk basada en velocidad natural. Eliminado el correr (`run=false`) y el deslizador de «cambio a correr». Verificado: compila y arranca sin errores en headless. NO verificado en iPhone.

## M1 · Mando de PlayStation + pantalla Controles (16 nov 2026, MEDIUM)
**Resumen fácil:** ya puedes jugar con el mando de PlayStation por Bluetooth. Con el mando conectado desaparecen los joysticks táctiles. Hay un engranaje arriba a la derecha (o el botón Options del mando) que abre «Controles»: ahí cambias qué botón dispara, recarga, lanza granada o se agacha, intercambias los sticks y ajustas zona muerta y sensibilidad. Prueba en el iPhone: conecta el mando en Ajustes > Bluetooth, abre el juego y pulsa un botón; con ✕ empiezas la partida.

**Detalle técnico**
- Nuevo `src/gamepad.js`: lee la Gamepad API cada cuadro (`pollPad`, llamado desde `game.js` tras `pollKeys`). Stick izq. = mover, der. = apuntar (intercambiables). Inclinar el stick de apuntar dispara (`aimActive`), además del botón asignado a «Disparar» (por defecto R2). Por defecto: ✕ recargar, ○ granada, L3 agacharse. Options (botón 9) queda reservado para abrir/cerrar el menú. Ajustes en `localStorage` (`tz_pad`).
- Nuevo `src/controls.js`: engranaje `#gear` y menú `#cfgm` (DOM por código, CSS en `index.html`). Pausa el juego mientras está abierto (`game.js` pinta sin simular). Asignar: tocar la acción y pulsar un botón del mando; si estaba en otra acción, se intercambian.
- Con mando conectado: `body.pad` oculta los joysticks y botones táctiles y `floatStick` ignora los toques; tocar el engranaje no empieza partida (`.ui`).
- Comprobado: `npm run build` compila; prueba automática en Chromium con mando simulado (detecta mando, ✕ empieza, stick mueve, Options abre, reasignar Recargar a △ se guarda, engranaje y Cerrar funcionan, menú cabe en horizontal), sin errores propios en consola.
- NO comprobado: mando real en iPhone (Safari, DualShock/DualSense), tacto de zona muerta y sensibilidad, y el apuntado con mando a mano.

## M2 · Esquema de mando nuevo (16 nov 2026, LOW)
**Resumen fácil:** el mando ahora va así: stick izquierdo camina (pulsarlo mientras caminas = correr), stick derecho apunta, R2 dispara, L2 apunta con precisión (vas más lento y el disparo es más certero), R1 granada (mantén para elegir la dirección con el stick izquierdo y suelta para lanzarla), □ recarga, ○ agacharse, △ cambiar arma. Todo se puede cambiar en el engranaje. Prueba en el iPhone: corre y mira que la barra azul de estamina baja; mantén R1 y mueve el stick izquierdo para ver dónde caerá la granada.

**Detalle técnico**
- `gamepad.js`: nuevo mapa (`fire`, `aim`, `grenade`, `run`, `reload`, `crouch`, `weapon`), clave de guardado `tz_pad2` (los ajustes de M1 se descartan). Se quita el intercambio de sticks y el disparo por inclinar el stick derecho. Granada: `input.nadeHold/nadeAim`, se lanza al soltar (`input.grenade` en el cuadro de la suelta). Correr: `input.run` mientras se mantiene el botón (L3) y el stick está inclinado.
- `player.js`: `MOVE.runMult=2.1` (entra el clip `run`), correr gasta estamina (-28/s, se recupera +16/s, agotado hasta 20; sin correr agachado, apuntando ni con granada). En mando, «apuntando» (más lento) = L2 o disparo; la dirección sale del stick derecho. Con la granada mantenida, la dirección y la distancia (3-12) salen del stick izquierdo.
- `weapons.js`: L2 reduce la dispersión del disparo al 35 %. `input.weapon` se consume sin efecto: solo hay un arma.
- Excepción a la norma «sin correr» (decisión del usuario del 16 nov: ahora correr con L3).
- Comprobado: build compila; prueba en Chromium con mando simulado: correr baja la estamina, granada no sale mientras se mantiene y sale al soltar, R2 dispara, menú cabe en horizontal.
- NO comprobado: mando real en iPhone, la sensación de correr (2.1×) y la distancia de la granada.

## M3 · Engranajes separados y versión visible (16 nov 2026, LOW)
**Resumen fácil:** arriba a la derecha había dos engranajes uno encima del otro (el de Controles y el del panel de medidas `?debug`). Ahora el de Controles (⚙) está en la esquina y el del panel de medidas es un icono distinto (📊) a su izquierda; solo sale con `?debug`. Abajo a la izquierda hay un número pequeño (por ejemplo v0.1.12): es la versión y sube sola con cada cambio que se publica, así sabes si el móvil ya tiene lo último.

**Detalle técnico**
- `vite.config.js` define `__VER__` = `v<mayor.menor de package.json>.<nº de commits>` (`git rev-list --count HEAD`). Los dos workflows hacen checkout con `fetch-depth: 0` para que el recuento sea completo en GitHub (en un clon superficial local el número sale más bajo; solo vale el de la web publicada).
- `#ver` en `index.html` (9 px, `pointer-events:none`), rellenado desde `controls.js`. Con `?debug` el panel sigue mostrando también `__BUILD__`.
- `debug.js`: botón del panel pasa a 📊, 38 px, a la izquierda del ⚙ de Controles.
- Comprobado: build compila, captura en Chromium con `?debug` (iconos separados, versión visible).

## M4 · Apuntado y movimiento más finos con mando (16 nov 2026, LOW)
**Resumen fácil:** el personaje ya dispara hacia donde apuntas con el stick derecho aunque lo inclines poco, y si disparas sin tocar ese stick sigue mirando hacia donde apuntabas (antes giraba hacia donde caminabas). El movimiento con el stick izquierdo es más suave: sin tirones ni parpadeos de animación al cambiar de dirección. Prueba en el iPhone: camina en círculos mientras disparas.

**Detalle técnico**
- Causa de «dispara hacia otro lado» (visto en el vídeo del usuario): el stick derecho solo contaba como apuntando por encima de 0.25 y, si no, la dirección pasaba a ser la de caminar. Ahora cuenta cualquier inclinación fuera de la zona muerta y, con R2 o L2 pulsados y sin inclinar, se mantiene la última dirección (`player.js`, `gamepad.js`).
- Movimiento: la zona muerta se aplicaba dos veces (mando 15 % + jugador 12 %); con mando solo una. Filtro exponencial (45 ms) sobre el stick izquierdo. Animación: la caminata/correr ya no cambia de sentido de golpe (histéresis + giro suave del `timeScale`).
- NO comprobado en iPhone: la sensación final (solo prueba automática con mando simulado).

## M5 · Mapa de prueba (16 nov 2026, MEDIUM)
**Resumen fácil:** hay un mapa de prueba para probar sin perder tiempo. Se activa en el engranaje (Controles) > «Mapa de prueba» > Activar (se recarga el juego). En él los zombis están quietos y no te atacan, reaparecen en su sitio al matarlos, las granadas son infinitas y no mueres. Hay cajas, barriles, vallas, barreras, coches y sacos en sitios fijos. Pone «PRUEBA» en vez de «Oleada» y «· prueba» junto a la versión. Para volver al juego normal: Controles > Desactivar. También sirve `?prueba=1` y `?prueba=0` en la dirección.

**Detalle técnico**
- Nuevo `src/test.js`: bandera `TEST` (localStorage `tz_prueba`) y `LAYOUT` con los props y zombis como datos (línea de tiro a 6, 10, 14 y 18 m, un corredor, un tanque, un grupo de 6 para granadas, barriles juntos para explosiones).
- `world.js`: en prueba los props salen de `LAYOUT.props` en vez de al azar. `zombies.js`: sin oleadas, zombis fijos (miran al jugador, sin moverse ni atacar), reaparecen en su `home` tras morir. `game.js`: granadas ≥ 5 y vida a 100. `controls.js`: botones Activar/Desactivar y Reiniciar.
- Comprobado: build compila; en Chromium con `?prueba=1` aparece «PRUEBA», la versión con «· prueba», los zombis siguen en su sitio tras varios segundos y no hay errores en consola.
- Los zombis siguen siendo cápsulas verdes (falta el modelo de Meshy); la velocidad de los zombis del juego normal NO se ha cambiado.

## M6 · Disparo parado: el cuerpo apunta hacia donde dispara (16 nov 2026, LOW)
**Resumen fácil:** corregido lo que se veía en tu vídeo: al disparar parado el personaje apuntaba con el arma hacia un lado distinto del de la bala y se encorvaba, y cada 4 segundos bajaba los brazos. Ahora el cuerpo se gira para que el arma vaya hacia donde apuntas y mantiene la postura de apuntar mientras disparas. Prueba en el iPhone: quédate quieto y dispara en varias direcciones; el arma debe ir hacia donde sale la bala.

**Detalle técnico**
- Causa: el clip `shoot_side` (Side_Shot de Meshy) apunta hacia el costado del modelo (+X; medido sobre el GLB: manos a +0,44 en X con el cuerpo en pie), pero la raíz solo giraba para que +Z mirase al objetivo, así que el arma salía 90° desviada de la bala. `player.js`: `rotation.y = atan2(aimX,aimZ) − 90°·peso(shoot_side)`; con `shoot_fwd/back` no cambia (apuntan a +Z).
- El clip dura 4 s: 0-0,75 s sube el arma, 1,0-2,75 s apunta, 3,0-4 s la baja. Con el peso del clip a 0 se coloca en 0,6 s (sube rápido al empezar) y al pasar de 2,6 s vuelve a 1,25 s: se queda en la parte de apuntar.
- Comprobado: build OK; prueba en Chromium con mando simulado en cuatro direcciones (la mano de apuntar y la cabeza van hacia donde sale la bala; la mano de apoyo queda a su izquierda, como en el clip).
- Residuo: el arma del clip queda ~8° girada hacia -Z; no se corrige. NO comprobado en iPhone con táctil.
- Sin resolver: en táctil, un toque corto en la mitad izquierda alterna agacharse y el agachado provisional deforma el cuerpo (encoge e inclina); puede confundirse con un fallo.

## C1 · Callejón como datos, muros, luz de atardecer y farolas (16 nov 2026, LOW) · diseño: RESPUESTAS_FABLE/005
**Resumen fácil:** el mapa de prueba ya es el callejón: una calle estrecha en forma de L con muros a los lados, de atardecer (azul oscuro con luz naranja), con dos farolas que iluminan la zona y un charco de luz azul. Hay zona de tiro, de cobertura y de explosivos, con cajas, barriles, barreras, vallas, sacos y coches, y zombis quietos. Los muros no se pueden atravesar y paran las balas. Prueba en el iPhone: Controles > Mapa de prueba > Activar, y camina hacia el fondo (arriba); a la derecha del fondo gira el pasillo.

**Detalle técnico**
- Nuevo `src/data/lugares/callejon_01.json` (formato de la 005 §4: muros, zonas, props, zombis, npc, luces, salidas); `test.js` lo carga (`LUGAR`, `LAYOUT`). Clases sin modelo aún (contenedor, bidón, papelera, cartón) usan el relleno de Tiny (`RELLENO` en `test.js`); los NPC del JSON aún no se usan (C7).
- Nuevo `src/alley.js` (`buildAlley`, llamado desde `world.js` solo en el mapa de prueba): luz de atardecer sin niebla (hemisférica 1.0 fría, sol 1.0 naranja), suelo gris azulado, muros (una caja por tramo + círculos de colisión de r 0,5 cada 0,6 m que también paran balas, como el resto de obstáculos), 2 farolas (PointLight real sin sombra, alcance 9) y un charco de luz falso aditivo. `LUZ.farola` ajustable.
- Los círculos de los muros son provisionales: C2 los sustituye por cajas estáticas del motor de física.
- `main.js` expone `window.__tz` (jugador, obstáculos, zombis) solo en el mapa de prueba, para las pruebas automáticas.
- Comprobado: build OK; ningún zombi solapado con objetos o muros (script con `__tz`); capturas en Chromium en cuatro puntos del callejón con las farolas y el charco; sin errores propios en consola.
- NO comprobado: fps y luces en el iPhone 14 (a medir en C10); que el pasillo lateral y la salida oeste se vean bien a mano; la luz puede necesitar ajuste (hay barra `LUZ`, aún sin conectar al panel `?debug`).

## C2 · Física de objetos + luz más clara (16 nov 2026, MEDIUM) · diseño: RESPUESTAS_FABLE/005 §1
**Resumen fácil:** los objetos del callejón ahora tienen peso. Si disparas a una caja o un barril se desplazan y giran un poco; las cosas pesadas (barreras de hormigón, coches) casi no se mueven. Las granadas los lanzan por los aires y chocan entre sí y contra los muros. Además he aclarado la luz del callejón porque en tu móvil se veía casi negro: ahora se ve un atardecer oscuro pero legible. Prueba en el iPhone: Controles > Mapa de prueba, y dispara a las cajas y barriles del principio; lanza una granada a los barriles del fondo.

**Detalle técnico**
- Nuevo `src/physics.js` (sin THREE ni DOM): círculos y cajas orientadas, paso fijo 60 Hz con máx. 2 pasos por cuadro, rozamiento, choques con rebote y fricción (SAT), dormir tras 0,5 s quieto, tope de 24 activos, impulso de bala (`J = 3,6·kBala·transferencia`, tope 6 m/s) y de granada (`J = 400·(1−d/R)`, tope 12 m/s, salto vertical). Orientación como vector (sin sin/cos en la simulación) y sin `Math.random`: determinista. Datos en `src/data/materiales.json` y `objetos.json`.
- `kBala` = 10 (la 005 proponía 4): con 4 una caja de 15 kg se movía ~2 cm por disparo y no se notaba; con 10 se mueve ~0,4 m con una ráfaga corta. Es ajustable en `phys.params` (barras en C5).
- `world.js`: cada prop tiene un cuerpo (`p.body`) y se sincroniza solo cuando se mueve; `blast` pasa a la física; `bump` se llama desde `weapons.js` al acertar a un objeto. `alley.js` añade los muros como cajas estáticas.
- Luz del callejón: hemisférica 2.0, sol 1.6, suelo más claro y exposición 1.15 (antes casi negro en el iPhone: el cálculo anterior no contaba el degradado de bordes ni el panel de inicio).
- Comprobado: `node tools/test_physics.mjs`: mismo estado tras 600 pasos en dos ejecuciones; coste 0,115 ms por paso en un caso extremo (52 cuerpos, ~25 activos) en el ordenador (en el iPhone será varias veces más: hay que medirlo en C10). En el juego (Chromium con mando simulado): la caja se mueve 0,4 m y el barril 0,8 m con unos disparos; barrera y coche no; la granada mueve y hace girar los barriles.
- NO comprobado en iPhone: tacto del peso, que las cajas giren con naturalidad, ni el coste real. Pendiente: barriles que se acuestan (vuelco) y trozos al romper (C3); el jugador y los zombis aún no empujan al caminar (C5).

## C3 · Vida y rotura de objetos
**Resumen fácil:** ahora los objetos aguantan unos disparos y se rompen: las cajas de madera sueltan tablas, el cartón se rompe y las balas lo atraviesan, los bidones rojos explotan (y encadenan con los de al lado), las papeleras y vallas caen rodando y la farola se apaga al romperla. Cada material suelta chispas de su color. Además he quitado el «toque para agacharse» del móvil: se activaba solo al moverte y deformaba al personaje.
**Probar:** dispara a una caja unas 6 veces; a los bidones del fondo; a una farola.
**Técnico:** `objetos.json` (vida, rompe, explota, vuelca, modelo/escala), `materiales.json` (hex, col, n), `world.js` (damageProp/hitProp/breakProp, vuelco visual), `physics.js` (vuelca, remove), nuevo `debris.js` (48 piezas instanciadas), `weapons.js` (cartón traspasable, hooks.boom). Verificado en headless: caja se rompe, 3 bidones en cadena, rotura de farola por código. NO verificado: disparo directo a farola (el test no logró alinear), ni en iPhone.

## C3b · Salida de bala fija
**Resumen fácil:** la bala y el fogonazo salen siempre del mismo punto, un poco delante del personaje, mirando hacia donde apuntas. Antes el punto se movía con la dispersión y a veces parecía salir de otro sitio. Cuando haya arma, ese punto pasará a ser el cañón.
**Probar:** dispara en distintas direcciones y andando; la línea de la bala debe arrancar siempre delante del personaje.
**Técnico:** `weapons.js` `MUZZLE=.55`; el rayo de impacto parte del centro (no se salta nada delante del cuerpo), el trazador y el fogonazo del punto fijo. Comprobado en headless que sigue rompiendo cajas y bidones; el aspecto en el iPhone NO está comprobado.

## P1 · Animaciones compartidas (006)
**Resumen fácil:** he separado el personaje en dos archivos: el cuerpo y las animaciones. Así, cuando haya más personajes (NPC, rivales), todos podrán usar las mismas animaciones sin repetirlas. En el juego no cambia nada: se ve y se mueve igual.
**Probar:** abre el juego; el jugador debe verse y moverse como antes.
**Técnico:** `tools/split_anims.mjs` crea `public/models/personajes/cuerpos/jugador_a.glb` (1,12 MB, sin clips) y `anims/humano.glb` (0,54 MB, solo esqueleto+8 clips). `assets.js` lee la clave `anims` de `models.config.js`. El `player.glb` original está en `docs/archivo/`. Comprobado en headless: 8 clips cargan y la captura es idéntica a la versión anterior. Nota honesta: el total de archivos sube (1,66 MB frente a 1,21 MB, los clips sueltos pesan más sin comprimir); el ahorro llega cuando varios cuerpos comparten `humano.glb`. NO comprobado en iPhone. La pose encorvada en reposo ya existía antes (clip `idle`).

## P2 · Herramienta para preparar piezas (006)
**Resumen fácil:** he preparado la «máquina» que convierte una pieza de Meshy (casco, chaleco, mochila, arma) en algo ligero para el juego: baja los triángulos, encoge la textura, la centra y, en las armas, marca dónde está la boca del cañón. Y he creado las carpetas del almacén de personajes. Todavía no se ve nada nuevo en el juego.
**Probar:** nada que ver en el móvil. Cuando tengas una pieza de Meshy, la paso por la herramienta y te digo los triángulos y KB que sale.
**Técnico:** `tools/prep_pieza.mjs origen.glb destino.glb [tris=500] [textura=512] [--boca=x,y,z] [--base]`; carpetas `public/models/personajes/{cuerpos,anims,skins,piezas,armas}`, `arte_fuente/`, `src/data/personajes/{cuerpos,piezas,personajes}.json` vacíos. Probada con una esfera de 8192 triángulos y textura 2048: salió 400 triángulos, 11 KB, textura WebP 512, base en y=0 y nodo `boca`. No se probó con una pieza real de Meshy. Nota: `prune` sustituye una textura de un solo color por un color plano (comportamiento deseado).

## C4 · Marcas de bala, sangre y quemaduras
**Resumen fácil:** ahora los disparos dejan agujeros en vallas, cajas y muros, los zombis dejan manchas de sangre (al herirlos y al morir) y las granadas y bidones dejan una mancha negra quemada en el suelo. Si el objeto se mueve, el agujero se mueve con él. Las marcas más viejas se borran solas.
**Probar:** dispara a una valla o barrera, a un zombi, y tira una granada.
**Técnico:** nuevo `src/decals.js`: una malla instanciada de 64 cuadrados (atlas 256² dibujado por código, 1 llamada de dibujo), colas circulares (40 balas, 16 sangres, 8 quemaduras), máx. 6 agujeros por objeto; sangre se funde a los 60 s y quemadura a los 120 s; las marcas de un objeto roto desaparecen. Ganchos: `world.js hitProp`, `weapons.js` (sangre, quemadura), `zombies.js` (sangre al morir). Comprobado en headless con capturas (agujero y sangre visibles). NO comprobado: quemadura de granada en captura, rendimiento en iPhone (C10). Pendiente de pulir: la sangre sale algo anaranjada con esta luz.

## S1 · Suelo con relieve, aceras y marcas fijas
**Resumen fácil:** el suelo del callejón ya no es un color liso: es asfalto con grano, grietas y relieve, con zonas más claras y oscuras para que no se repita, aceras bajas de losas junto a los muros, y marcas fijas (pintura vial desgastada, charcos, manchas de aceite, grietas, desconchones). Todo se genera por código, sin archivos ni créditos.
**Probar:** abre el mapa de prueba y camina por el callejón; busca las aceras, la línea del centro y los charcos. Si ves algo demasiado oscuro, brillante o repetido, dímelo.
**Técnico:** nuevo `src/ground.js` (asfalto y losas 512² con mapa de normales calculado del relieve, textura de variación 128² en coordenadas del mundo vía `onBeforeCompile`, ruido por hash entero, repetible); aceras de 7 cm de alto a lo largo de los muros largos (solo decoración, sin colisión); marcas fijas como datos en el bloque `suelo` de `callejon_01.json` (celdas del atlas: 4 desconchón, 5 grieta, 13 charco, 14 aceite, 15 pintura) con cola `f` nueva en `decals.js` (N=96). `initDecals` ahora va antes de `buildWorld`. Medido: generar el suelo tarda 251 ms en el navegador de pruebas (💡 en iPhone puede ser el doble, una sola vez al cargar). NO comprobado en iPhone: aspecto con la luz real, memoria (≈ 3 MB estimados) ni fps. Pendiente: el charco aún no refleja nada (es solo una mancha oscura); la regla de Fable (007 §5) puede cambiar la biblioteca de materiales.

## S1b · Corrección del suelo en iPhone
**Resumen fácil:** en tu iPhone el suelo se veía beige, demasiado claro y con manchas de colores raros. Lo he oscurecido y enfriado, y he cambiado cómo se cargan las texturas por si el iPhone las estropeaba. No lo he podido ver en un iPhone, así que necesito tu captura para confirmar.
**Técnico:** las texturas del suelo pasan de lienzo (canvas) a `DataTexture` directa (sin conversión de color/alfa del navegador); brillo base del asfalto 122→92 y de las losas 122→92, con tinte frío; atlas de marcas con alfa premultiplicado y mezcla `ONE, ONE_MINUS_SRC_ALPHA`. Causa probable de las manchas: bordes transparentes/color del lienzo en Safari (⚠️ sin confirmar). Headless: se ve más oscuro y sin manchas.

## R0 + R1 · Reorientación: documentos y cámara elevada (17 nov 2026, LOW ×2, hecho por Fable por encargo del usuario)
**Resumen fácil:** en el engranaje (Controles) hay una fila nueva, «Cámara», con cinco botones: Cerca (la de ayer), A, B, C y Tiny. Al tocar uno la cámara cambia al momento y la fila te dice a qué distancia está y qué tamaño tiene el personaje en pantalla. Al andar, la velocidad se adapta sola para que no parezca que vas más lento con la cámara lejos; la retícula y las chispas también crecen un poco. Tu elección se queda guardada.
**Probar:** abre el juego en horizontal > engranaje > Cámara > toca A, B, C. Cierra el menú, anda, dispara y lanza una granada con cada una. Dime cuál prefieres (o «entre A y B», «más lejos que C»...).
**Técnico:** `renderer.js` (`CAMS`, `CAM`, `setCam`, se guarda en `tz_cam`; también `?cam=A`), `game.js` (`camFollow` también en pausa, `charFrac`), `player.js` (velocidad × `CAM.vel`, altura real), `effects.js` (tamaño de chispas × raíz de la distancia), `controls.js` (fila Cámara), `debug.js` (línea «cámara · personaje 1/N» y barras sincronizadas). Sombras: no hizo falta tocarlas (la zona de ±20 m cubre las cinco cámaras).
**Corrección sobre el informe 008:** las cámaras propuestas allí (13-18 m) dejaban al personaje a 1/13-1/20 del alto, fuera del criterio (1/10-1/12). Se recalcularon midiendo: A 10,7 m/58° = 1/9,9 · B 10,7 m/61° = 1/10,9 · C 10,5 m/64° = 1/11,7. «Tiny» (16,4 m/58°, 1/16) queda como referencia de «muy lejos».
**Pruebas:** `npm run build` compila. En Chromium simulando iPhone 14 apaisado: las 5 cámaras cargan sin errores, la fila del menú cambia la cámara y la guarda, moverse y disparar funcionan con cada una. **NO comprobado:** fps y aspecto en el iPhone real; si la velocidad resulta cómoda (barra «Velocidad» en `?debug`).
**Aceptación de R1:** personaje a 1/10-1/12 ✔ (medido) · fps igual que antes: sin medir en el móvil · elección del usuario: pendiente.

## Cámara definitiva (17 nov 2026, solo documentos)
**Resumen fácil:** has elegido la cámara «Tiny» (16,4 m · 58°) y queda como la definitiva. Lo he dejado escrito en las normas y en la referencia visual, junto con lo que implica: el personaje ocupa 1/16 del alto de la pantalla, así que los modelos nuevos se juzgarán por su silueta y sus bloques de color vistos a ese tamaño. No he cambiado nada del juego.
**Técnico:** `CLAUDE.md` norma 1, `REFERENCIA_VISUAL.md` (criterios de tamaño, visibilidad, presupuesto y escala), `ROADMAP.md` (R1 validado), `CONTINUAR.md` (estado y pendientes). Sin cambios de código: «Tiny» aún no es la cámara por defecto (fleco de R1 anotado).
