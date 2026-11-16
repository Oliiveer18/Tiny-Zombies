# PAQ-01 · Cámara definitiva y lectura del escenario

- **Estado:** ver `docs/CONTINUAR.md` · **Esfuerzo:** MEDIUM · **Base:** `48aec15` o posterior · **Depende de:** nada
- **Decisiones que aplica:** `docs/DECISIONES.md` 2.1, 2.2, 2.3, 3.4
- **Objetivo:** que el juego arranque siempre con la cámara Tiny y que, con ella, el jugador se vea siempre y los personajes lejanos no cuesten nada. Sin cambiar física, armas, zombis, suelo ni mando.

## Archivos que se tocan
`src/renderer.js`, `src/controls.js`, `src/debug.js`, `src/game.js`, `src/alley.js`, `src/player.js`, `src/zombies.js`. Nada más. No se tocan datos (`src/data/`) ni modelos.

## Trabajo
### 1. Cámara Tiny por defecto y menú limpio
- En `renderer.js`: la cámara por defecto pasa a ser la «Tiny» (`y 14`, `z 8,6`, velocidad × 1,55). Se elimina la tabla `CAMS` con «cerca», A, B, C; quedan constantes simples. `CAM.k` (≈ 1,81) y `CAM.vel` (1,55) se conservan porque los usan retícula, chispas y velocidad.
- Se deja de leer y escribir `localStorage['tz_cam']` (quien tuviera guardada otra cámara debe ver Tiny). El parámetro `?cam=` desaparece.
- En `controls.js`: se quita la fila «Cámara» y su temporizador.
- En `debug.js`: se conservan las barras Altura / Atrás / Velocidad (sirven para pruebas) y la línea «personaje 1/N del alto»; al cargar deben mostrar 14,0 y 8,6.
- **No cambiar** el campo de visión (38°), el seguimiento ni el adelanto (0).

### 2. Muros que no tapan al jugador
Hoy cada tramo de muro es una caja de 3,2 m de alto con un material compartido (`alley.js`). Con la cámara al sur, un muro al sur del jugador lo oculta.
- Cada tramo pasa a tener **su propio material** (clon), con `transparent:true`.
- En cada cuadro, para cada tramo: calcular en planta si el segmento **cámara → jugador** cruza el tramo (segmento contra segmento, ensanchando el muro 0,5 m). Si cruza en el punto `t` (0 = cámara, 1 = jugador), la altura de la línea de visión ahí es `camY·(1−t) + 0,9·t`. Si es **menor que la altura del muro (3,2)**, ese tramo tapa.
- Tramo que tapa → opacidad objetivo **0,25**; si no → 1. Transición suave (≈ 0,15 s). Con opacidad 1 el material debe volver a escribir profundidad y no ordenarse como transparente (evita parpadeos): `depthWrite` y `transparent` según la opacidad.
- La sombra del muro no cambia. La colisión y las balas tampoco.
- Coste: una docena de tramos, una prueba de segmentos por tramo y cuadro. Sin crear objetos en el bucle.

### 3. Aro del jugador
- Un aro fino en el suelo bajo el jugador (radio exterior 0,45 m, grosor 0,05, color `#bfe6ff`, opacidad 0,55, sin sombra, sin prueba de profundidad contra el suelo pero por debajo de los personajes). Una malla, creada una vez en `initPlayer`.
- Sirve para localizar al jugador a 49 píxeles y, más adelante, para distinguir bandos (NPC y hostiles llevarán el suyo: no hacerlos ahora).
- La retícula de apuntado que ya existe no cambia (ya se escala con `CAM.k`).

### 4. Personajes lejanos apagados
- En `zombies.js`: un zombi vivo a **más de 26 m** del jugador (distancia en planta) → `inst.root.visible=false` y no se avanza su animación. Al volver a menos de 24 m (margen para que no parpadee) se enciende. Su lógica (posición, vida, estado) sigue igual: solo se apaga el dibujo.
- 26 m sale de `DECISIONES.md` 2.2: lo más lejano que se ve está a ≈ 19 m del jugador.
- Dejar la distancia como constante con nombre (`LEJOS=26`).

### Fuera de este paquete (no hacer)
Recorte de objetos por zonas, tabla de escala, cambios en el mapa, aros para NPC, nada de animación, nada de `?debug` de física (va en PAQ-02).

## Pruebas (todas obligatorias; automáticas en Chromium con el viewport de iPhone 14 apaisado 844 × 390, como las de R1, usando `window.__tz` del mapa de prueba)
| # | Prueba | Aceptación |
|---|---|---|
| 1 | `npm run build` | Compila sin avisos nuevos |
| 2 | Cargar `?prueba=1&debug` con `localStorage['tz_cam']='cerca'` puesto de antes | La línea del medidor dice «personaje 1/16» (± 0,5); la cámara está a 16,4 m y 58° |
| 3 | Abrir el menú Controles | No existe la fila «Cámara»; el resto de filas igual que antes |
| 4 | Colocar al jugador en (0, −39,2) (pegado al muro norte del fondo) y en (−3,2, −10) (pegado al muro oeste) | En los dos casos el jugador se ve en la captura; ningún muro lo cubre |
| 5 | Colocar al jugador en (8, −33), en el tramo lateral, justo al norte del muro `[4,−32,11,−32]` (ese muro queda entre la cámara y él) | El tramo que queda entre cámara y jugador baja a opacidad 0,25 en < 0,3 s y vuelve a 1 al alejarse 3 m; los demás tramos siguen a 1 |
| 6 | Captura con el jugador en el centro del callejón | Se ve el aro bajo el jugador; no parpadea con el suelo ni con las marcas |
| 7 | Mover al jugador a 30 m del grupo de zombis del fondo y luego a 10 m | A 30 m esos zombis tienen `visible=false`; a 10 m, `true`. Su `x`, `z` y vida no cambian |
| 8 | Disparar, lanzar una granada, romper una caja y un bidón | Funcionan como antes; 0 errores en consola |
| 9 | Triángulos y llamadas del medidor antes y después, misma posición | Apuntar las dos cifras en el informe (el aro añade 1 llamada) |

**No se puede comprobar aquí y hay que decirlo así:** fps y aspecto en el iPhone real. Pedir al usuario una captura de `?debug`.

## Criterios de aceptación del paquete
1. Pruebas 1-8 superadas y documentadas, con las cifras de la 9.
2. Ningún archivo fuera de la lista modificado (salvo `docs/SESION.md`, `REGISTRO.md`, este traspaso y el estado en `CONTINUAR.md`).
3. El resumen fácil para el usuario dice cómo comprobarlo en el móvil: «acércate a un muro por detrás y verás que se vuelve transparente».

---
## Informe de Sonnet (rellenar al entregar)
- Commit(s):
- Qué se hizo:
- Decisiones secundarias tomadas:
- Resultado de cada prueba (1-9):
- No comprobado:

## Revisión de Fable
(pendiente)
