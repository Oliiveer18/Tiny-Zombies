# 005 · Callejón de pruebas: física, impactos, interacción y NPC

Origen de cada dato: **[C]** leído en el código · **[R]** razonamiento propio · 💡 cifra de partida, se ajusta con barras `?debug` · ⚠️ sin verificar.

## Preguntas antes de empezar (no bloquean C1-C4)
1. **Triángulos.** El callejón lleno con modelos finales suma ≈ 38 000 en UNA pasada y ≈ 76 000 con la de sombras (cuenta en §4). Con relleno cabe de sobra. La respuesta 003 §1 ya pidió decidir si el límite de 40 000 cuenta las dos pasadas; sigue sin decidir y aquí vuelve a salir. Recomendación: decidirlo con la medición de C10, no antes.
2. **Vallas.** Hoy toda valla para las balas [C]. Propongo que la valla de tablas NO las pare (deja de ser cobertura real). Es un cambio de comportamiento de Tiny: lo decide el usuario. Por defecto en la tabla: sigue parando.
3. **Trozos rotos.** Los trato como efecto (norma 5: los efectos sí se generan por código): tablas y esquirlas de ≤ 12 triángulos. Si el usuario los quiere de Meshy, es un modelo «caja rota» más.

## 1. Física de objetos
**Veredicto: física propia en el plano, sin librería. Propuesta validada con cuatro correcciones.**

Por qué no Rapier [R]: su compilado WebAssembly pesa del orden de 1-2 MB (⚠️ de memoria, no medido) frente a ~6 KB de un módulo propio; su estado es un bloque binario opaco, no «datos con id» (norma 3); y para ≤ 60 objetos en plano su ventaja (pilas, articulaciones) no se usa. El vuelco habría que fingirlo igual.

Correcciones a la propuesta:
1. **No hace falta determinismo exacto.** La norma 3 solo lo exige a generación, reloj y «al volver»; el combate no. En online manda el servidor. Aun así sale casi gratis y sirve para repetir pruebas: paso fijo, orden por id, sin `Math.random` en la simulación (usar `hash(semilla, tick, id)` de `sim.js`).
2. **Giro sin `sin/cos`:** guardar la orientación como vector (`cx`, `sz`) y girarlo con `cx-=sz*w*dt; sz+=cx*w*dt` + renormalizar con `Math.sqrt` (exacta en todos los móviles). El dibujo sí usa `atan2`.
3. **Trozos, partículas y marcas NO son simulación.** Son dibujo local: no chocan entre sí, no se guardan, no viajan por red.
4. **El impulso real de una bala es pequeño** (4 g × 900 m/s = 3,6 kg·m/s: una caja de 15 kg se movería 0,24 m/s). Se multiplica por un factor de juego `K_BALA` = 4 💡 y por la `transferencia` del material (lo que la bala atraviesa casi no se mueve).

**Cuerpos** (módulo nuevo `src/physics.js`, sin THREE ni DOM): `{id, clase, x, z, cx, sz, vx, vz, w, y, vy, vida, estado, dormido}`. Formas: círculo (barril, bidón, papelera, farola) o caja orientada (resto). Muros = cajas estáticas de masa infinita. Inercia: caja `m(a²+b²)/12`, círculo `m·r²/2`.

**Fórmulas** (g = 10):
- Bala: `J = 3,6 · K_BALA · transferencia`; `Δv = J/m` en la dirección del tiro (tope 6 m/s); `Δw = (r × J)/I` con `r` del centro al punto de impacto (tope 8 rad/s).
- Rozamiento con el suelo: frena `μ·g` m/s² lineal y `μ·g/radio` angular. Distancia de deslizamiento = `v²/(2·μ·g)`.
- Choque entre dos: separar por la mínima penetración (ejes separadores, 4 ejes en plano) e impulso con rebote `min(e1,e2)`; 2 pasadas.
- Granada (sustituye a `blast`): `J = 400·(1-d/R)` 💡, `Δv = J/m` (tope 12), `vy = min(8, 0,5·J/m)`. Coche de 1 200 kg → 0,3 m/s: casi no se mueve. Caja de 15 kg → sale volando. En el aire (`y>0`) no choca, como hoy [C].
- Vuelco (solo clases con `vuelca`): si un impulso supera `J_vuelco`, pasa a `estado:'tumbado'` (el dibujo lo acuesta en 0,25 s), rozamiento ×0,4 en el eje de rodar. No se levanta solo.
- Jugador y zombis empujan al caminar lo que pese ≤ 40 kg / ≤ 15 kg; el resto bloquea como hoy.

**Paso de simulación:** 60 Hz fijo con acumulador, máximo 2 pasos por cuadro (si el móvil va lento la física se atrasa, no se dispara). Orden, siempre por índice de id: (1) aplicar órdenes e impulsos del tick, (2) integrar activos, (3) rejilla de celdas de 4 m (la de la 002) y pares `idA<idB`, (4) resolver choques ×2, (5) dormir.
**Dormir:** `|v|<0,05` y `|w|<0,1` durante 30 pasos (0,5 s). Despierta con cualquier impulso o al tocarlo un activo a > 0,3 m/s. Los dormidos cuestan 0.
**Límites:** 24 cuerpos activos a la vez (si entra el 25.º se duerme el más lento) · 48 trozos visuales · ≤ 0,3 ms por cuadro 💡 en iPhone 14 (24 activos × ~4 vecinos ≈ 100 pruebas de par).
**Guardado/online:** solo los cuerpos que difieren de lo generado (posición, vida, estado). El servidor solo envía los activos.

## 2. Tabla de materiales (datos: `src/data/materiales.json` y `objetos.json`)
| Material | μ suelo | Rebote | Transferencia | Para balas | Partículas al impacto | Marca | Sonido |
|---|---|---|---|---|---|---|---|
| metal | 0,5 | 0,3 | 1 | sí | 6 chispas amarillas | agujero_metal | `imp_metal` |
| madera | 0,6 | 0,2 | 0,6 | sí | 5 astillas marrones | agujero_madera | `imp_madera` |
| hormigón | 0,8 | 0,1 | 1 | sí | 6 polvo gris + 2 chispas | desconchón | `imp_hormigon` |
| cartón/plástico | 0,5 | 0,1 | 0,15 | no | 3 trocitos claros | agujero_pequeño | `imp_carton` |
| cristal | 0,4 | 0,1 | 0,1 | no | 8 esquirlas blancas | grieta | `imp_cristal` |
| carne/zombi | — | — | — | sí | 5 verdes (como hoy [C]) | sangre en el suelo | `imp_carne` |
| cuerpo de NPC | — | — | — | sí | 5 rojas | sangre en el suelo | `imp_carne` |
| suelo | — | — | — | — | 3 polvo | agujero_suelo | `imp_suelo` |

| Objeto (id) | Material | Forma (m) | Masa kg | Vida (balas) | Al romperse | Vuelca (J) | Para balas | Empujar |
|---|---|---|---|---|---|---|---|---|
| contenedor | metal | caja 1,8×1,0 | 250 (ruedas: μ 0,15) | ∞ | — | no | sí | mantener |
| coche `car` | metal + cristal | caja 2,6×1,3 | 1 200 | ∞ (lunas: 1) | lunas → 8 esquirlas | no | sí | no |
| caja `crate` | madera | caja 0,8×0,8 | 15 | 6 | 5 tablas | no | sí | toque |
| barril `barrel` | metal | círculo r 0,35 | 18 | ∞ | — | sí (20) | sí | toque |
| bidón | metal (rojo) | círculo r 0,3 | 25 | 4 | explota: granada al 70 % | sí (25) | sí | toque |
| papelera | metal | círculo r 0,25 | 8 | ∞ | — | sí (8) | sí | toque |
| cartón | cartón | caja 0,5×0,5 | 1 | 3 | 4 trozos | no | no | caminar |
| valla `fence` | madera | caja 1,6×0,1 | 25 | 10 | 4 tablas | sí (40) | sí (ver pregunta 2) | no |
| barrera `barrier` | hormigón | caja 1,4×0,35 | 600 | ∞ (a los 15 impactos: aspecto astillado) | — | no | sí | no |
| farola | metal + cristal | círculo r 0,15, fija | ∞ | lámpara: 1 | se apaga su luz + 6 esquirlas | no | sí | no |
| saco `sack` | tela | como hoy | 30 | ∞ | — | no | no (como hoy [C]) | no |

Todas las cifras son 💡. Barras `?debug`: `K_BALA`, fuerza de granada, y μ/masa de la clase del último objeto tocado.

## 3. Marcas de bala y suciedad
- **Dibujo:** UNA malla instanciada de cuadrados (64 instancias = 128 triángulos), un atlas de 256×256 con 16 casillas (4 agujeros, desconchón, grieta, 4 sangres, 3 quemaduras, charco, 2 libres), generado por código. Transparente, sin escribir profundidad, sin sombra, con `polygonOffset`. Atributos por instancia: casilla y opacidad. **1 llamada de dibujo, < 0,1 ms** 💡.
- **Topes** (colas circulares; la más vieja se funde en 0,5 s cuando se recicla): 40 marcas de bala (máximo 6 por objeto y 8 en suelo/muros por cada 4 m), 16 sangres, 8 quemaduras.
- **Pegado a un objeto:** la marca guarda `{idObjeto, posición local, cara}`; su matriz = matriz del objeto × local, y solo se recalcula mientras el objeto está activo (dormido = 0 coste). En caja va sobre la cara golpeada; en círculo, tangente. Si el objeto se rompe, sus marcas se liberan.
- **Sangre:** al morir un zombi o NPC, 1 mancha de 0,8-1,4 m bajo el cuerpo; con cada impacto, 1 de cada 3 veces una salpicadura pequeña 0,6 m detrás, en la dirección de la bala. Se funde a los 60 s.
- **Quemadura de granada/bidón:** 1 mancha de 3 m en el suelo, se funde a los 120 s.
- **Trozos:** otra malla instanciada (48), caen con gravedad, rebotan una vez en el suelo y se funden a los 8 s. 1 llamada.
- Marcas, trozos y partículas no se guardan ni se sincronizan: cada móvil pinta las suyas.

## 4. Callejón: diseño del lugar (dato reutilizable)
Forma de L, cabe en una región de 64×64. Ejes de `test.js` [C]: x derecha, z hacia abajo; el jugador nace en (0,0) mirando a −z.
- **Tramo principal:** 8 m de ancho × 44 m (x de −4 a 4, z de 4 a −40). **Tramo lateral:** gira al este en el fondo, 8 × 20 m (x de 4 a 24, z de −40 a −32).
- **Zona de tiro** (z −6 a −16): una fila con un objeto de cada material a 8-12 m y 4 zombis quietos en línea a 6, 10, 14, 18 m (como M5).
- **Zona de cobertura** (z −18 a −28): 3 barreras en zigzag, contenedor, coche cruzado, 2 vallas, corredor y tanque.
- **Zona de explosivos** (z −30 a −38): 3 bidones, 5 barriles, cajas apiladas en planta y un grupo de 6 zombis.
- **Esquina** en (4, −36): al girarla se ve el grupo de NPC en (14, −36), en un entrante de 3 m hacia el norte para que no tapen el paso. Rivales al fondo, en (22, −36), tras un coche.
- **Salidas (3):** sur (inicio), este (fondo del tramo lateral) y un hueco de 2 m en el muro oeste a z −24 que vuelve al sur por fuera.

```json
{"id":"callejon_01","tipo":"abierto","version":1,"caja":[-6,-42,26,6],
 "muros":[[-4,4,-4,-22],[-4,-26,-4,-40],[-4,-40,24,-40],[4,4,4,-32],[4,-32,11,-32],[11,-32,11,-29],[11,-29,17,-29],[17,-29,17,-32],[17,-32,24,-32]],
 "zonas":[{"id":"tiro","rect":[-4,-16,4,-6]},{"id":"cobertura","rect":[-4,-28,4,-18]},{"id":"explosivos","rect":[-4,-38,4,-30]},{"id":"encuentro","rect":[8,-40,24,-29]}],
 "props":[["crate",-2.5,-9,0],["barrel",-1,-10,0],["barrier",1,-11,0],["carton",2.5,-9,0.3],["contenedor",3,-22,1.57],["bidon",-2,-33,0]],
 "zombies":[["normal",0,-6],["runner",-2,-24],["tank",2,-26]],
 "npc":[["neutral",14,-35,"dlg_callejon"],["neutral",13,-36.5,null],["reclutable",15.5,-36.5,"dlg_herido"],["rival",22,-35,null],["rival",23,-37,null]],
 "luces":[{"id":"l1","tipo":"farola","x":-3.6,"z":-12,"color":"#ffb060","radio":9,"dinamica":true},
          {"id":"l2","tipo":"farola","x":4.4,"z":-36,"color":"#ffb060","radio":9,"dinamica":true},
          {"id":"l3","tipo":"charco_luz","x":3.6,"z":-24,"color":"#9fc0ff","radio":4,"dinamica":false}],
 "ambiente":{"hora":"atardecer"},
 "salidas":[[0,4],[24,-36],[-4,-24]]}
```
`props` y `zombies` usan las mismas tuplas que `LAYOUT` [C], así que `test.js` pasa a cargar este archivo (`src/data/lugares/callejon_01.json`) y el generador de regiones lo colocará igual que cualquier lugar de DISENO §3 (trasladando por el origen del lugar). La lista de arriba es una muestra; la completa (≈ 45 objetos, 13 zombis) la escribe Sonnet en C1 siguiendo las zonas.

**Luz (sin niebla):** fondo azul muy oscuro; luz de cielo 0,25 azulada; la direccional que ya existe [C], baja y naranja a 0,5, es la única con sombras. **Dinámicas: 2 farolas** (puntuales, sin sombra, alcance 9 m) **+ 1 reservada** para fogonazo/explosión/bidón ardiendo = 3. El resto son **focos falsos**: un cuadrado aditivo en el suelo bajo ventanas y carteles (misma técnica que las marcas, 1 llamada más) que el bloom existente hace brillar. Romper la lámpara de una farola apaga su luz: primera decisión táctica del lugar.

**Triángulos** con modelos finales (cifras de la 003): 45 objetos ≈ 9 500 + 2 coches 2 400 + jugador 4 650 + 5 NPC 12 500 + 10 zombis a la vista 8 000 + muros, marcas y trozos ≈ 900 = **≈ 38 000 por pasada** (ver pregunta 1). Llamadas nuevas: marcas 1, focos 1, trozos 1, muros 1.

## 5. Interacción
- **Una sola acción nueva, `use` («Acción»).** Mando: ✕ (botón 0, libre hoy [C]); se añade `['use','Acción']` a `ACTIONS` y aparece sola en el menú Controles, reasignable. Táctil: un botón redondo encima del de disparo que **solo aparece cuando hay algo que usar**, con icono y verbo.
- **Objetivo:** el interactuable más cercano a ≤ 1,6 m 💡 y dentro de ±60° de hacia donde mira el jugador; empate por id. En pantalla: un aro blanco en el suelo bajo el objetivo y la etiqueta «✕ Abrir».
- **Verbo por prioridad:** hablar > recoger > abrir > empujar. Toque = verbo principal; mantener 0,4 s = empujar (si el objeto lo permite).
- **Empujar:** impulso de 60 kg·m/s 💡 hacia delante (caja de 15 kg: sale a 4 m/s y desliza ≈ 1,3 m). Con «mantener» (contenedor): se mueve a 0,8 m/s mientras se mantiene y se camina contra él: cobertura móvil.
- **Abrir** (contenedor, maletero): aro de progreso de 1,2 s, se cancela al moverse o disparar, hace ruido de radio 8 m. Contenido por `hash(semilla, idObjeto)` desde una tabla; en la prueba, granadas y botiquín. **Recoger:** instantáneo.
- **Hablar:** abre un panel con 2-3 respuestas; el juego NO se pausa (online) y el jugador puede moverse; alejarse > 3 m lo cierra.
- Todo es una orden `{t:'usar', j:'j1', obj:'p12', verbo:'abrir'}`; la simulación comprueba distancia y estado (norma 3).

## 6. NPC y rivales mínimos
Datos en `src/data/npc_tipos.json`: `{id, faccion, vida, vista, oido, arma, dialogo}`. Relaciones entre facciones en una tabla (`supervivientes` neutral con el jugador; `rivales` hostil a todos; zombis hostiles a todos).

| Tipo | Estados y transiciones |
|---|---|
| **neutral** | `quieto` → (ve al jugador a < 8 m) `atento` (se gira hacia él) → (acción) `hablando` → `quieto`. Si él o alguien de su facción recibe daño del jugador → toda la facción `hostil` (dispara desde cobertura). Si ve zombi o rival → `defiende`. |
| **reclutable** | `herido` (sentado, no pelea) → `hablando` → (aceptas y entregas botiquín) `sigue` (a 2-3 m detrás) ↔ `combate` (dispara a lo que ataque al jugador) ; «espera aquí» → `quieto`. |
| **rival** | `patrulla` (2 puntos) → (oye ruido) `sospecha` (va al punto del ruido, 6 s) → (ve) `combate` (cobertura más cercana, ráfagas de 3) → (pierde de vista 5 s) `busca` (último punto visto, 8 s) → `patrulla`. |

- **Vista:** cono de 110°, 14 m (7 m fuera de los charcos de luz 💡: apagar farolas sirve), cortada por muros y por objetos que paran balas (mismo rayo que el disparo). Se comprueba 5 veces por segundo, no cada cuadro.
- **Oído:** eventos de ruido `{x, z, radio, tick, origen}` en una lista de la simulación, la misma que usarán los zombis (DISENO §4). Radios 💡: disparo 30 m, explosión 60, abrir contenedor 8, correr 6, objeto volcado 5, caminar agachado 0.
- **Diálogo como datos** (`dlg_callejon`):
```json
{"id":"dlg_callejon","lineas":[
 {"id":0,"npc":"Quieto ahí. ¿Vivo o mordido?","resp":[["Vivo. Solo paso.",1],["Baja el arma.",2]]},
 {"id":1,"npc":"Pasa. Al fondo hay gente armada: no son de los nuestros.","resp":[["¿Y ese herido?",3],["Gracias.",-1]]},
 {"id":2,"npc":"Cuando tú guardes la tuya. Pasa y no toques nada.","resp":[["Vale.",-1]]},
 {"id":3,"npc":"Si le consigues un botiquín, se irá contigo.","resp":[["Lo buscaré.",-1]]}]}
```
- **Que no sea un callejón sin salida:** 3 salidas y los rivales siempre al este, así la retirada al sur queda libre · el grupo está en un entrante, fuera del paso · los NPC son obstáculo blando (el jugador los aparta al caminar) · hablar nunca bloquea el movimiento · toda conversación tiene una respuesta de salida (`-1`) · neutral nunca se vuelve hostil por acercarse o apuntar, solo por daño.

## 7. Orden de subpasos para Sonnet
Hoy solo existe `player.glb` [C]: **todo se puede hacer con relleno**; ninguno queda bloqueado por Meshy, pero el hito no se entrega con relleno (norma 5).

| Paso | Esf. | Qué | Criterio medible | Se prueba en el móvil |
|---|---|---|---|---|
| C1 | LOW | Callejón como JSON, muros (chocan y paran balas), luz de atardecer, 2 farolas | ≤ 3 luces dinámicas; nadie cruza muros; ≥ 58 fps | Pasear y disparar en el callejón |
| C2 | MED | `physics.js` + `materiales.json`: cuerpos, paso fijo, choques, rozamiento, dormir, impulso de bala y de granada | Prueba con node: mismas órdenes → mismo estado tras 600 pasos; ≤ 0,3 ms con 24 activos | Lo ligero se mueve al dispararle, lo pesado no |
| C3 | LOW | Vida, rotura en trozos, bidón explosivo, vuelcos, partículas por material, farola que se apaga | Caja rota a las 6 balas; ≤ 48 trozos; cadena de bidones sin tirón (peor cuadro ≤ 25 ms) | Romper cajas, volar bidones |
| C4 | LOW | Marcas: balas, sangre, quemaduras, focos falsos | 40 marcas = +1 llamada, < 0,1 ms; se mueven con el objeto | Las marcas quedan |
| C5 | LOW | Barras `?debug` de física + empuje al caminar | Cambiar una barra se nota sin recargar | Ajustar «peso» a gusto |
| C6 | LOW | Acción `use`: empujar, abrir, recoger; fila en Controles y botón táctil | Reasignable; el botón táctil solo sale con objetivo | Empujar el contenedor, abrir |
| C7 | MED | NPC neutral + reclutable quietos, diálogo desde datos, lista de ruido | Diálogo completo con mando y táctil sin pausar | Girar la esquina y hablar |
| C8 | MED | Rival: vista, oído, cobertura, disparo; neutral se defiende | Reacciona a un disparo a 30 m y no a 35; pierde el rastro en 5 s | Combate con rivales |
| C9 | MED | Reclutable sigue y combate; «espera aquí» | No se atasca en 20 vueltas al callejón | Llevar un aliado |
| C10 | LOW | Medición en iPhone 14 con todo lleno y 40 marcas; captura en `mediciones/` | ≥ 58 fps, peor cuadro ≤ 25 ms, triángulos apuntados | Decidir la pregunta 1 |

**Modelos nuevos que faltan** (objeto pequeño: 150-250 triángulos, textura 256, receta de la 003). Los ya previstos (caja, barril, valla, barrera, saco, coche, zombi, NPC sobre el cuerpo base) siguen sus prompts. Arranque común: `3D rendered game prop, single object, three-quarter view, plain light grey background, soft studio lighting, chunky stylized mobile top-down shooter style, matte painted, simple clean shapes, NOT realistic, no text, no logos.` y después:
- **Contenedor:** `Large rectangular metal dumpster on four small wheels, closed two-part lid, dark green chipped paint, rust at the edges, dented side.`
- **Bidón:** `Red metal fuel drum, upright, two raised rings, small cap on top, scratched paint, plain yellow flame hazard diamond without text.`
- **Papelera:** `Small round street trash bin, grey perforated metal, open top, slightly dented.`
- **Caja de cartón:** `Closed brown cardboard box, taped top, one crushed corner, slightly damp stain.`
- **Farola:** `Old street lamp post, thin dark iron pole with square base, single hanging glass lantern at the top, slightly bent.`
- Los muros y el suelo se generan por código con textura (norma 5).
