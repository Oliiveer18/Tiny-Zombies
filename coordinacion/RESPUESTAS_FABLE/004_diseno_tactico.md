# 004 · Diseño táctico: qué hace que el juego se sienta táctico

Origen de cada dato: **[C]** leído en el código · **[T]** `TINY_ACTUAL.md` · **[005] [007]** respuestas anteriores · **[R]** razonamiento propio · 💡 cifra de partida, con barra `?debug`.
`V` = velocidad de andar del jugador (la petición dice 2,1 y correr 3,4; el código la calcula en `MOVE` [C] y aún se ajusta: por eso todo va en múltiplos de `V`).

## Idea central
Un juego se siente táctico cuando **la información y el ruido valen más que la puntería**: ves al enemigo antes de que él te vea, eliges cómo entrar, y cada disparo tiene un precio. Tiny hoy no tiene precio: munición infinita, todos los zombis saben dónde estás, y disparar corriendo acierta igual [C]. Las 7 mecánicas de abajo ponen ese precio **sin tocar** la cámara, los controles ni las cifras de los tres zombis (✅).

## 1. Las 7 mecánicas, por impacto / coste
| # | Mecánica | Impacto | Esf. | Paso del ROADMAP |
|---|---|---|---|---|
| T1 | **Ruido que atrae** (cada acción tiene un radio) | ★★★★★ | MED | A3 (es el V5 de la 007) |
| T2 | **Zombis que no saben dónde estás** (dormidos, vista corta, oído) | ★★★★★ | con T1 | A3 |
| T3 | **Puntería que se gana** (la dispersión depende de cómo disparas) | ★★★★ | LOW | antes de A5 |
| T4 | **Cobertura** (agachado tras un objeto, no te dan) | ★★★★ | LOW | A8 (con C8 de la 005) |
| T5 | **Opciones silenciosas** (rematar por la espalda, lanzar un señuelo) | ★★★★ | LOW ×2 | A6a (acción `use`) |
| T6 | **Luz y sombra** (apagar farolas reduce lo que ven) | ★★★ | LOW | C1 (ya empezado en el callejón) |
| T7 | **Munición y estamina con consecuencias** | ★★★ | LOW | A5 |

## 2. Reglas con cifras (todas 💡 y con barra)
**T1 · Ruido.** Lista de eventos `{x, z, radio, tick, quien}` en la simulación [007 §4]. Cada muro en medio divide el radio por 2.
| Acción | Radio (m) | Acción | Radio (m) |
|---|---|---|---|
| Andar agachado | 0 | Abrir contenedor o reja | 6-8 |
| Andar | 3 | Romper caja · candado · reja | 8 · 10 · 14 |
| Correr | 6 | Disparo | 30 |
| Rematar (T5) | 2 | Explosión | 60 |
| Señuelo al caer (T5) | 12 | Zombi que despierta (gruñido) | 5 |
Un medidor de ruido en el HUD: un arco fino alrededor del jugador que crece con el último ruido hecho y se apaga en 1 s. El jugador aprende los radios mirándolo.

**T2 · Percepción de los zombis.** Estados `dormido → despertando → persigue → deambula` [007 §4]. Vista: cono de 120° hacia donde miran, 5 m (3 m si vas agachado, 8 m si corres). Oído: los radios de T1. Contagio: un despierto a < 4 m despierta al vecino en 0,5 s. Pierden el rastro a los 8 s sin verte ni oírte y van al **último ruido**, no a ti. Radio de alerta de grupo de hostiles humanos: 12 m.

**T3 · Dispersión.** Hoy es fija: ± 0,03 rad, × 0,35 apuntando con mando [C]. Nueva: `dispersión = base de la postura + calor`.
| Postura | Base (rad) | A 14 m se abre |
|---|---|---|
| Quieto y apuntando | 0,008 | ± 11 cm |
| Quieto sin apuntar | 0,03 (la de Tiny [T]) | ± 42 cm |
| Andando | 0,05 | ± 70 cm |
| Agachado | × 0,7 sobre lo anterior | — |
| Corriendo | no dispara (deja de correr) | — |
| Exhausto (estamina 0 [T]) | × 2 | — |
- **Calor:** cada bala suma 0,006 (tope + 0,05) y baja 0,15 por segundo. La primera bala es precisa; la ráfaga larga se abre. Toques cortos = precisión.
- **Se ve gratis:** el aro de la retícula que ya existe [C] toma radio = dispersión × distancia. Aro pequeño = tiro seguro.
- Comprobación [R]: el zombi normal mide 0,47 m de radio para la bala [C]; a 14 m quieto y apuntando aciertas siempre, andando 1 de cada 2.

**T4 · Cobertura.** Agachado y a menos de 1 m de un objeto que para balas (barrera, caja, coche, contenedor, muro bajo), las balas que vengan del otro lado (ángulo ≤ 60° respecto al objeto) fallan. Al dejar de estar agachado para disparar, estás expuesto mientras disparas y 0,4 s después. En pantalla: un pequeño escudo junto a la barra de vida. Los hostiles usan la misma regla con los puntos `coberturas` del mapa [007]. Los zombis la ignoran (van cuerpo a cuerpo), pero el objeto les obliga a rodear [C].

**T5 · Opciones silenciosas** (ningún botón nuevo):
- **Rematar:** con `use`, a < 1,2 m y por detrás (fuera de su cono) de un zombi `dormido` o que no te ha visto, o de un hostil en `guardia`. Dura 0,8 s, ruido 2 m. No vale contra el tanque.
- **Señuelo:** con el botón de granada **cuando no quedan granadas** (o manteniendo `use` 0,4 s sin objetivo cerca) se lanza una piedra con el mismo arco [C]: no hace daño y genera ruido de 12 m donde cae. Los zombis van allí y se quedan 6 s. Infinito, con 3 s de espera.

**T6 · Luz.** Dentro de un charco de luz (farola, hoguera) la vista de los hostiles es 14 m; fuera, 7 m [007]. Romper la farola (ya se puede [C]) apaga el charco. Para los zombis la luz no cuenta (van por oído). En pantalla: el icono del escudo se vuelve un ojo tachado cuando estás agachado y a oscuras.

**T7 · Munición y estamina.** Desde A5: cargador de 30 y recarga de 1,5 s como en Tiny [T]; se empieza con 2 cargadores de reserva; cada lugar da de media 1 cargador; recargar tira las balas que quedaban en el cargador (💡, quitable con una barra si resulta duro); correr cancela la recarga. Estamina: la de Tiny [T] más dos consecuencias: exhausto = dispersión × 2 (T3) y un golpe de zombi te frena al 60 % durante 0,6 s (estar rodeado mata; escapar hay que decidirlo antes).

**Movimiento (`MOVE` [C]):** ya es deliberado. Mantener apuntando × 0,4 y agachado × 0,5. Recomendación: correr ≤ 1,7 V (hoy `runMult` 2,1 [C]) para que huir de un corredor (1,0 V) sea posible pero no trivial, y que correr siempre cueste ruido (6 m) y estamina.

## 3. Qué cambia en los tres zombis y en las armas
Las cifras de Tiny (vida, daño, radio, velocidad en proporción al jugador) **no cambian** ✅ [T]. Cambia cómo perciben y un rasgo táctico por tipo:
| Zombi | Vida · velocidad [T] | Rasgo táctico nuevo |
|---|---|---|
| Normal | 3 · 0,55 V | El de referencia: vista 5 m, oído normal. Una bala le frena un instante (el empujón que ya existe [C]) |
| Corredor | 2 · 1,0 V | **Oye el doble de lejos** (radios × 1,5) y despierta en la mitad de tiempo. Es el castigo del ruido: no se le deja atrás andando |
| Tanque | 14 · 0,4 V | Las balas no le frenan, no se le puede rematar y **rompe** cajas, vallas y cartones que tenga delante en vez de rodearlos (usa la vida de los objetos [C]). Las barricadas no le paran: hay que moverse |

**Armas:** el fusil no cambia de cifras [T]; gana la dispersión de T3 y el ruido de 30 m. La granada no cambia; es el arma más ruidosa (60 m): resuelve un grupo y llama al siguiente. Se añaden sin botones: rematar y señuelo (T5). Más armas (pistola con silenciador de 10 m de ruido, escopeta) quedan para D5.

## 4. Jugable con dos pulgares
| Acción | Táctil | Botón nuevo |
|---|---|---|
| Mover / correr | Joystick izquierdo, como hoy [C] | no |
| **Apuntar sin disparar** | Joystick derecho inclinado **menos del 60 %** = apunta (más lento, más preciso). **Más del 60 %** = dispara. Hoy dispara desde el 25 % [C: `input.js`] | no (cambia un umbral) |
| Agacharse | El botón que ya existe (interruptor) | no |
| Usar / rematar / abrir / recoger | Botón contextual `use`, solo visible con objetivo [005] | ya previsto |
| Granada / señuelo | Botón de granada, como hoy | no |
| Recargar | Botón que ya existe | no |
**Total de botones nuevos: 0** sobre lo ya planeado (el límite era 2). El cambio de umbral del joystick derecho toca un control de Tiny: es la única decisión para el usuario de este documento. Recomiendo SÍ, con una barra para el umbral: sin «apuntar sin disparar» en el móvil, T3 y T4 solo servirían con mando.

## 5. Tres pruebas de 2 minutos (en el mapa de la 007)
`?debug` muestra al acabar: balas disparadas, aciertos, zombis despertados y tiempo.
1. **«Cruzar el patio sin disparar».** 10 zombis dormidos; ir de la entrada a la salida. *Se siente táctico si:* agachado y rodeando se consigue en < 2 min despertando ≤ 2; corriendo en línea recta despierta ≥ 6. Si las dos formas dan lo mismo, T1-T2 no funcionan: ajustar radios.
2. **«Un cargador».** 6 zombis despiertos viniendo desde 15 m y solo 30 balas (hacen falta 18 aciertos). *Se siente táctico si:* parado, apuntando y a toques los matas con balas de sobra; andando y en ráfaga continua te quedas sin balas con ≥ 2 vivos. Si ambas ganan, subir el calor; si ambas pierden, bajarlo.
3. **«El campamento».** 3 hostiles tras cobertura. *Se siente táctico si:* entrar de frente por la reja acaba en muerte más de 2 de cada 3 veces, y un plan (apagar la farola, señuelo a un lado, cubrirse en el contenedor) gana más de 2 de cada 3. Si de frente se gana, subir el daño o bajar la reacción de 0,8 s.

**Orden para Sonnet:** T1+T2 (= V5 de la 007, MED) → T3 (LOW) → T4 (LOW, junto a C8) → T5 rematar (LOW) → T5 señuelo (LOW) → T6 (LOW) → T7 (LOW, en A5). Coste en el móvil: percepción 5 veces por segundo y por zombi activo (≤ 40 [T]) ≈ 200 pruebas de rayo por segundo: despreciable frente a los 58 fps.
