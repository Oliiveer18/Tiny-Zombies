# PAQ-02 · Interacción y reja

- **Estado:** ver `docs/CONTINUAR.md` · **Esfuerzo:** MEDIUM × 2 (un solo paquete, una sola entrega) · **Base:** PAQ-01 ENTREGADO · **Depende de:** PAQ-01
- **Decisiones que aplica:** `docs/DECISIONES.md` 4.3, 4.8 · **Diseño de fondo:** 005 §1 y §5, 007 §3 (leer solo esas secciones)
- **Calidad gráfica:** este paquete no toca resolución, antialias, bloom, sombras, modelos ni texturas. Si no llega a los fps no se rebaja nada: bloqueo (`docs/CALIDAD_GRAFICA.md` §4). Pruebas en vertical 390 × 844 (así juega el usuario) y en horizontal.
- **Objetivo:** que el jugador pueda actuar sobre el escenario con un botón (empujar, forzar, abrir) y que exista la reja con candado, todo dentro del callejón actual `callejon_01`. Es la pieza central del mapa de prueba (calle → **reja** → campamento → patio).

## Archivos que se tocan
`src/physics.js`, `src/world.js`, `src/weapons.js`, `src/input.js`, `src/gamepad.js`, `src/controls.js`, `src/ui.js`, `src/debug.js`, `src/alley.js`, `src/data/objetos.json`, `src/data/lugares/callejon_01.json`, `index.html`, `tools/test_physics.mjs`. Módulo nuevo permitido: `src/usar.js`.

## Parte A · Barras de física en `?debug`
En el panel que ya existe, cuatro barras: `kBala` (0-10), fuerza de granada (0-800), y masa (× 0,2-5) y rozamiento (0-1,5) de **la clase del último objeto golpeado** (mostrar su nombre). Cambian los parámetros en vivo (`P.kBala` etc. en `physics.js`); no se guardan.

## Parte B · Acción «Usar»
**Entrada**
- Acción nueva `use`, nombre visible «Usar». Mando: botón 0 (✕) por defecto; se añade a `ACTIONS` y a `DEF.map` en `gamepad.js`, con lo que sale sola en el menú Controles y es reasignable. Teclado: `F`.
- Táctil: botón redondo nuevo `#bu` con el estilo de `.btn`, colocado encima de `RECAR.`. **Solo visible cuando hay objetivo**; su texto es el verbo («EMPUJAR», «FORZAR», «ABRIR»).
- Toque corto = verbo principal. Mantener ≥ 0,4 s = lo que indica la tabla.

**Objetivo**
- Candidatos: objetos con `usar` en `objetos.json` y puertas. Se elige el más cercano a **≤ 1,6 m** del jugador y dentro de **± 60°** de la dirección de apuntado (`player.aimX`, `aimZ`); empate → menor id.
- En pantalla: un aro blanco en el suelo bajo el objetivo (radio = su radio + 0,15) y el verbo en el botón (táctil) o una etiqueta «✕ Verbo» junto al HUD (mando / teclado).

**Verbos de este paquete**
| Objeto (`objetos.json`) | Campo nuevo | Toque | Mantener |
|---|---|---|---|
| `crate`, `barrel`, `bidon`, `papelera` | `"usar":"empujar"` | Empujón: impulso de **60 kg·m/s** en la dirección de apuntado, aplicado en el centro (sin giro) | — |
| `contenedor` | `"usar":"arrastrar"` | — | Mientras se mantiene y el jugador camina hacia él, el contenedor avanza a 0,8 m/s (velocidad impuesta, no impulso) |
| `reja_hoja` con candado | — | — | «Forzar»: aro de progreso de **4 s**; se cancela al moverse > 0,3 m o disparar. Al completarse el candado se rompe (como a tiros) |
| `reja_hoja` sin candado | — | «Abrir»: las dos hojas reciben velocidad angular para abrirse del todo en ≈ 0,8 s | — |
Recoger y hablar NO entran aquí (PAQ-05).

**Arquitectura (norma 3, obligatoria)**
- La entrada solo crea una orden: `{t:'usar', j:'j1', obj:'<id>', verbo:'empujar'}`.
- Una función de simulación (`usar.js`, sin THREE ni DOM) la valida (existe, distancia ≤ 1,6 m, verbo permitido para ese objeto) y la aplica. El dibujo solo lee el resultado.
- Cada uso deja un registro `{x, z, radio, tick, quien}` en una lista exportada `ruido` (por ahora nadie la lee; PAQ-03 la usará): empujar 4 m · arrastrar 5 m · forzar 8 m · abrir 6 m. Añadir también: disparo 30 m, explosión 60 m, objeto roto 8 m, candado roto 10 m, reja rota 14 m. La lista se vacía de lo que tenga más de 2 s.

## Parte C · Reja con bisagra y candado
**Datos**
- `objetos.json`:
  ```json
  "reja_hoja":{"mat":"metal","forma":"caja","hx":0.75,"hz":0.05,"masa":60,"vida":40,"pasa":true,"bisagra":true,"rompe":{"n":6,"tipo":"barrote"}},
  "candado":{"mat":"metal","forma":"circulo","r":0.15,"masa":1,"vida":3,"fijo":true,"rompe":{"n":2,"tipo":"esquirla"}}
  ```
- `callejon_01.json`: la reja va en **z = −17**, entre la zona de tiro y la de cobertura.
  - Dos pilares nuevos en `muros`: `[-4,-17,-2,-17]` y `[2,-17,4,-17]` (con el metro de más que dibuja `alley.js`, el hueco real queda de x −1,5 a 1,5).
  - Lista nueva `puertas`: `[{"id":"reja_i","clase":"reja_hoja","pivote":[-1.5,-17],"largo":1.5,"candado":"cand1"},{"id":"reja_d","clase":"reja_hoja","pivote":[1.5,-17],"largo":1.5,"candado":"cand1"}]`. Cerradas, cada hoja va desde su pivote hacia x = 0. Se abren **hacia −z** (alejándose del inicio), hasta 100°.
  - Candado: `["candado",0,-17,0]` en `props`, con id fijo `cand1`.
  - Mover el contenedor que hoy está en `(-2.3,-17.6)` a `(-2.3,-19.4)`: choca con el pilar.
- Relleno visual (hasta que haya modelo de Meshy): cada hoja = un marco con 6 barrotes verticales hechos con cajas finas en una sola malla (color `#2e4a3a`), 2 m de alto; candado = caja de 0,15 m color `#c9a030`. Trozo nuevo `barrote` en `debris.js` (caja alargada 0,6 × 0,04).

**Comportamiento**
- **Balas:** la reja tiene `pasa:true`: la bala la atraviesa (como el cartón) y le quita 1 de vida; a los 40 se rompe en 6 barrotes. No lleva marcas de bala. El candado para la bala y pierde 1 de 3.
- **Vista:** no bloquea (para cuando exista percepción en PAQ-03/05).
- **Movimiento:** cerrada o abierta, la hoja bloquea al jugador y a los zombis como un muro fino.
- **Bisagra** (un grado de libertad; 007 §3): cada hoja guarda ángulo `a` y velocidad `w`. Un impulso `J` aplicado a distancia `d` del pivote, perpendicular a la hoja: `w += J·d / I`, con `I = masa·largo²/3`. Cada paso de física: `a += w·dt`; `w *= 0,96`; tope entre 0 (cerrada) y 100° (abierta) con rebote 0,2. **Con candado, `w = 0` siempre.** La caja de colisión se recalcula desde pivote y ángulo; el resto de cuerpos la trata como estática.
- **Fuentes de impulso con el candado roto:** bala (3,6 · `kBala` · 1), empujón de «Usar», explosión (la de `blast`), y el jugador al caminar contra ella (impulso de 15 kg·m/s por contacto).
- **Explosión a < 3 m:** la hoja se rompe directamente (vida a 0), tenga o no candado.
- **Estado serializable:** `{id, a, w, vida, candado:true|false}`; el candado es un prop normal con id.
- Determinismo: sin `Math.random` en esta lógica; para girar no hace falta `sin/cos` en la simulación si se guarda la orientación como vector (como el resto de `physics.js`); en el dibujo sí se puede.

### Fuera de este paquete (no hacer)
Ruido que despierte zombis, NPC, recoger objetos, sonido, modelos nuevos, cambiar el tamaño del mapa.

## Pruebas (obligatorias)
| # | Prueba | Aceptación |
|---|---|---|
| 1 | `npm run build` y `node tools/test_physics.mjs` (ampliado con la bisagra) | Compilan y pasan. Misma secuencia de impulsos dos veces → mismo ángulo final |
| 2 | Barras `?debug`: subir `kBala` a 10 y disparar a una caja | La caja sale claramente más lejos que con el valor por defecto; el nombre de la clase aparece |
| 3 | Acercarse a 1 m de una caja mirándola; luego mirando al lado contrario | Con la caja delante aparece el botón «EMPUJAR» y el aro; de espaldas, no |
| 4 | Empujar una caja de 15 kg | Se desplaza entre 1,0 y 1,6 m y se para (rozamiento) |
| 5 | Mantener «Usar» en el contenedor caminando hacia él 2 s | Avanza 1,4-1,8 m; al soltar se para |
| 6 | Disparar 3 balas al candado | Se rompe en 2 trozos; `candado:false` en las dos hojas |
| 7 | Con candado: caminar contra la reja y dispararle 5 balas | No se mueve (`a = 0`); la bala la atraviesa e impacta detrás; vida de la hoja 35 |
| 8 | Sin candado: caminar contra una hoja | Se abre; el jugador pasa por el hueco; la hoja se queda abierta |
| 9 | Reja nueva (recargar), «Forzar» 4 s sin moverse; repetir moviéndose a los 2 s | Primero: candado roto. Segundo: se cancela y el candado sigue |
| 10 | «Abrir» con candado roto | Las dos hojas llegan a ≥ 90° en ≤ 1,2 s |
| 11 | Granada a 2 m de la reja | Las dos hojas desaparecen y salen barrotes; 0 errores |
| 12 | Mando: reasignar «Usar» en Controles | Funciona con el botón nuevo; «Restaurar» lo devuelve a ✕ |
| 13 | Lista `ruido` tras disparar, empujar y romper el candado | Contiene registros con los radios de la parte B y se vacía a los 2 s |
| 14 | Todo lo de PAQ-01 (muros translúcidos, aro, cámara) y disparar/romper/bidones | Sigue igual; 0 errores en consola |

**No se puede comprobar aquí:** tacto del botón en el iPhone real y fps. Decirlo en el informe y pedir al usuario que pruebe: «empuja una caja, rompe el candado a tiros, abre la reja».

## Criterios de aceptación del paquete
1. Pruebas 1-14 superadas y documentadas.
2. La acción pasa por una orden con id de jugador y una función de simulación sin THREE ni DOM.
3. Reja, candado y verbos están en datos (`objetos.json`, `callejon_01.json`), no escritos en el código.
4. Ningún archivo fuera de la lista modificado (salvo documentos de Sonnet).

---
## Informe de Sonnet (rellenar al entregar)
- Commit(s):
- Qué se hizo:
- Decisiones secundarias tomadas:
- Resultado de cada prueba (1-14):
- No comprobado:

## Revisión de Fable
(pendiente)
