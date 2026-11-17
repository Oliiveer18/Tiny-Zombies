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
- Commit(s): «PAQ-02 entregado (Sonnet)».
- Qué se hizo: A) `?debug` con barras kBala, fuerza de granada, masa × y rozamiento de la clase del último objeto golpeado (nombre visible; en vivo, sin guardar). B) acción `use` («Usar»): ✕ en mando (reasignable en Controles, «Restaurar» devuelve ✕), tecla F, botón redondo `#bu` solo con objetivo (texto = verbo), etiqueta «✕ Verbo» con mando/teclado, aro blanco bajo el objetivo y disco que crece al forzar; `src/usar.js` (sin THREE ni DOM) valida y aplica órdenes `{t:'usar',j,obj,verbo}`, expone `objetivo` y la lista `ruido` (empujar 4 · arrastrar 5 · forzar 8 · abrir 6 · disparo 30 · explosión 60 · objeto roto 8 · candado roto 10 · reja rota 14; caduca a los 2 s). C) reja con dos hojas de bisagra en z=−17 y candado `cand1`: estado en `physics.js` (`addHinge`, ángulo + vector, `w += J·d/I`, amortiguación .96, tope 100° con rebote .2, sin `sin/cos` en la simulación), colisión con 5 círculos por hoja, balas la atraviesan (−1 de vida, sin marca), explosión <3 m la rompe, `barrote` en `debris.js`, dibujo provisional (marco de 6 barrotes #2e4a3a, candado #c9a030) en `alley.js`.
- Decisiones secundarias tomadas: (1) la distancia de «Usar» a un objeto se mide hasta su borde (centro − radio del cuerpo), porque el círculo de choque del contenedor (r 1,4) impide acercarse a menos de 1,65 m de su centro. (2) Arrastrar y forzar empiezan al pulsar, sin esperar 0,4 s (el toque no hace nada en esos verbos). (3) Caminar contra una reja sin candado empuja 15 kg·m/s como mucho cada 15 pasos (si fuera cada cuadro la reja saldría disparada). (4) La reja son 5 círculos y una bala cuenta una sola vez por hoja. (5) `candado` y `reja_hoja` no usan malla instanciada (`PROPIO` en `world.js`); id fijo del candado = 5.º valor de la entrada en `props`. (6) `test.js` y `player.js` no se tocan; el empuje al caminar se hace desde `usar.js`. (7) `window.__usar` (objetivo, ruido) para pruebas. (8) El contenedor en (−2,3;−19,4) queda solapado con una barrera de hormigón y se separa solo ≈0,5 m hacia la reja al empezar.
- Resultado de cada prueba (1-14): `tools/test_physics.mjs` ampliado: determinismo con bisagras OK; hoja con candado a=0 tras 120 impulsos; una bala sin candado ≈13°; muchas balas ≤100° (80°); abrir 90° en 0,58 s; empujón a caja de 15 kg 1,37 m; kBala 0 → 0 m / 10 → 0,18 m; masa×2 y mu 1 → 0,22 m; objetivo (empate → menor id, ±60°); arrastrar 2 s → 1,60 m; forzar: a 3,5 s sigue y a 4,2 s se rompe; moverse >0,3 m cancela; radios de ruido 4/5/6/8 y caducidad a los 2 s: todo OK. Navegador (Chromium, mando simulado): botón EMPUJAR solo al mirar la caja (táctil); empuje 1,37 m; tras 5 balas en la hoja izquierda vida 35 y ángulo 0; candado roto con balas; reja sin candado se abre al caminar contra ella (≈55°/45°); forzar 4 s rompe el candado y moverse lo cancela; Abrir llega a 97° en <1,2 s; granada a ≈3 m rompe las dos hojas; menú Controles con «Usar ✕»; PAQ-01 sigue bien (muros translúcidos, zombis lejanos); 0 errores. Compila.
- No comprobado: tacto y rendimiento en un iPhone real; el arrastre del contenedor a 2 s en el navegador (va a 3-5 fps y el tiempo de juego se atrasa; verificado en la simulación de Node); la horizontal solo se comprobó en PAQ-01; el aspecto de la reja es provisional.

## Revisión de Fable
**ACEPTADO · 17 nov 2026.** Comprobado por Fable: compila; `tools/test_physics.mjs` repetido y todo OK (determinismo con bisagras, forzar 3,5 s / 4,2 s, arrastrar 1,60 m, abrir 90° en 0,58 s, ruido que caduca a los 2 s); `usar.js` no importa THREE ni toca el DOM y trabaja con órdenes con id de jugador; reja, candado y verbos están en datos. Las 8 decisiones secundarias de Sonnet se aceptan (la 1, medir hasta el borde del objeto, es correcta y pasa a ser la regla).
**Notas para más adelante (no devuelven el paquete):** (a) el contenedor que se recoloca solo 0,5 m al empezar: se corrige su posición en los datos dentro de PAQ-03 si molesta, si no en PAQ-07; (b) la lista `ruido` pasa a `ruido.js` en PAQ-03; (c) el aspecto de la reja es relleno hasta ART-5.
**Falta validar en el iPhone (usuario, no bloquea):** que el botón «Usar» se pulsa bien con el pulgar y no estorba; empujar una caja, romper el candado a tiros, forzarlo 4 s y abrir la reja; fps con `?debug`.
