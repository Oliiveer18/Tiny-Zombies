# PAQ-03 · Ruido y zombis que despiertan

- **Estado:** ver `docs/CONTINUAR.md` · **Esfuerzo:** MEDIUM × 2 (un solo paquete, una sola entrega) · **Base:** `f070412` o posterior · **Depende de:** PAQ-02 ACEPTADO (lo está)
- **Decisiones que aplica:** `docs/DECISIONES.md` 4.5, 4.8 · **Diseño de fondo:** 007 §4 (solo «Ruido», «Disparadores» y la fila «Zombi» de la tabla) y 004 T1-T2 (leer solo eso)
- **Calidad gráfica:** este paquete no toca resolución, antialias, bloom, sombras, modelos ni texturas. Si no llega a los fps no se rebaja nada: bloqueo (`docs/CALIDAD_GRAFICA.md` §4). Pruebas en vertical 390 × 844 y comprobación en horizontal.
- **Objetivo:** que en el mapa de prueba los zombis dejen de ser estatuas: están dormidos, despiertan por lo que oyen o ven, persiguen, pierden el rastro y deambulan. El jugador puede cruzar en silencio o armar jaleo, y se nota la diferencia. Las oleadas del modo normal NO se tocan.

## Archivos que se tocan
`src/zombies.js`, `src/usar.js` (solo para mover la lista de ruido), `src/player.js` (solo emitir ruido de pasos), `src/weapons.js` (solo si hace falta para el ruido de disparo, que ya existe), `src/game.js`, `src/input.js`, `src/gamepad.js`, `src/controls.js`, `src/ui.js`, `src/debug.js`, `src/test.js`, `src/data/lugares/callejon_01.json`, `index.html`. Módulos nuevos permitidos: `src/ruido.js`, `src/percepcion.js`, `src/disparadores.js`, `src/data/ruido.json`, `tools/test_percepcion.mjs`.

## Parte A · Ruido (`src/ruido.js`, simulación pura: sin THREE ni DOM)
- La lista `ruido` y `sonido()` pasan de `usar.js` a `ruido.js`; `usar.js` las reexporta para no romper nada. Registro: `{x, z, radio, tick, quien}` [ya existe].
- Radios en `src/data/ruido.json` (💡 ajustables): disparo 30 · explosión 60 · reja rota 14 · candado roto 10 · objeto roto 8 · forzar 8 · abrir 6 · arrastrar 5 · empujar 4 · **correr 6 · andar 3 · agachado 0**. Los que ya emite `usar.js` leen de ahí.
- **Pasos:** mientras el jugador se mueve (velocidad > 0,15), un registro cada 0,4 s con el radio de su forma de moverse (correr / andar / agachado = ninguno).
- **Muros:** `oye(x, z, registro, muros)` → cada muro de `LUGAR.muros` que corte el segmento origen-oyente divide el radio por 2 (como mucho 2 muros; con 3 o más no se oye). Corte de segmentos con `+ - * /`, sin `sin/cos/pow`. Las rejas y los objetos no cuentan.
- La lista conserva 2 s [ya es así].

## Parte B · Estados del zombi (solo con `TEST`; el modo de oleadas queda exactamente igual)
Campos nuevos por zombi (serializables): `estado` (`dormido | despertando | persigue | deambula`), `t` (segundos en el estado), `giro` (hacia dónde mira, como vector `gx, gz`), `obj: [x, z]` (último punto conocido), `tDesp` (duración de su despertar).

| Estado | Qué hace | Sale cuando |
|---|---|---|
| `dormido` | Quieto, mirando hacia `giro`. **Sin percepción de vista cada cuadro** (coste casi 0). Postura: clip de reposo o, sin clips, inclinado como hoy | Le llega un ruido (parte A) · ve al jugador · contagio |
| `despertando` | Gira hacia el origen, sin avanzar, durante `tDesp` = 0,6-1,2 s según `hash(WORLD_SEED, id)` (determinista) | Pasa `tDesp` → `persigue` |
| `persigue` | El movimiento y el ataque de Tiny tal cual [código actual de oleadas: rodeo de obstáculos, separación, golpe], **hacia `obj`**. `obj` se actualiza a la posición del jugador mientras lo ve o lo oye | 8 s sin verlo ni oír nada → `deambula` |
| `deambula` | Va a puntos al azar (hash de `id` y contador, sin `Math.random`) en 4 m alrededor de `obj`, a media velocidad, parando 1-2 s entre puntos | Ruido o vista → `persigue` (sin pasar por `despertando`) |

**Percepción** (`src/percepcion.js`, pura): cada zombi se evalúa **5 veces por segundo**, repartido por id (zombi `i` en el paso de simulación `tick % 12 === i % 12`).
- **Vista:** el jugador está a ≤ 5 m (3 m si va agachado, 8 m si corre), dentro de un cono de 120° alrededor de `giro`, y ningún muro corta la línea entre ambos. Las rejas no tapan [D 4.3].
- **Oído:** algún registro de `ruido` de los últimos 0,2 s le llega (`oye`). `obj` = origen del ruido, **no** la posición del jugador.
- **Contagio:** un zombi en `persigue` desde hace ≥ 0,5 s despierta a los dormidos a < 4 m (pasan a `despertando`, con `obj` = el del vecino).
- Los zombis siguen sin poder atravesar muros: mientras no haya búsqueda de caminos, un zombi que choca con un muro se queda empujando hacia `obj`. Se acepta en este paquete; anotarlo en el informe si se ve mal en algún punto concreto.

**Velocidades en el mapa de prueba** (proporción de Tiny, 007 §4): normal 0,55 · corredor 1,0 · tanque 0,4, multiplicado por la velocidad del jugador al andar (`topSpeed()`). 💡 con barra en `?debug` («velocidad zombis ×»).

**Daño y reaparición** [D 4.5]: en el mapa de prueba el jugador ya recibe daño de los zombis. Al morir: mensaje «Has caído», 2 s, y vuelve al inicio (0, 0) con la vida llena; los zombis vivos vuelven a su sitio y a `dormido`; los muertos reaparecen; reja, candado y objetos quedan como estén. `?carga` debe seguir como hoy (sin daño y zombis quietos).

**Colocación** (`callejon_01.json`): cada entrada de `zombies` admite dos valores más opcionales: `[tipo, x, z, giroGrados, estado]`; por defecto 180 (mirando hacia +z, es decir hacia la entrada) y `dormido`. Recolocar así (💡): los 4 de la zona de tiro (z −6 a −18) se reducen a 2, en (−2,6, −11) y (2,4, −14), cada uno **de espaldas al centro** (mirando a su muro más cercano), para que se pueda pasar por el centro agachado (a 2,5 m: andando se les despierta por el oído, radio 3; agachado no); el resto queda donde está, con los 6 del fondo (z −32 a −37) mirando en direcciones variadas. Total 10.

## Parte C · Disparadores (`src/disparadores.js`, pura)
- Lista `disparadores` en `callejon_01.json`. Cada uno se ejecuta una vez (bit `hecho`, serializable). Condiciones de este paquete: `zona` (el jugador entra en el rectángulo de una zona de `zonas`), `roto` (un objeto con ese id se rompe), `abierta` (una hoja pasa de 45°). Acciones: `mensaje` y `despertar` (pone en `despertando` a los zombis de una zona, con `obj` = jugador). `estado`, `soltar` y `grupo_muerto` son de PAQ-05: no hacerlos.
- Datos de este paquete:
  ```json
  [{"id":"d1","cuando":{"t":"roto","obj":"cand1"},"hacer":[{"t":"mensaje","txt":"El candado ha caído"}]},
   {"id":"d2","cuando":{"t":"zona","zona":"explosivos"},"hacer":[{"t":"mensaje","txt":"Silencio..."}]}]
  ```
- `mensaje`: texto centrado arriba (bajo el HUD), 2,5 s, con el estilo del texto existente. Sirve también para «Has caído».

## Parte D · Agacharse en táctil y lectura en pantalla
- **Botón táctil nuevo `#bc`** («AGACH.»), con el estilo de `.btn`, a la izquierda de `GRAN.`; alterna agachado / de pie [la acción ya existe: tecla C y `input.crouchToggle`]; resaltado cuando está activo. Es necesario: hoy en táctil no hay forma de agacharse. En mando, la acción «Agacharse» debe estar en Controles y ser reasignable (añadirla si no está; botón por defecto: ○).
- **Medidor de ruido:** un aro fino en el suelo alrededor del jugador con el radio de su último ruido (se abre en 0,15 s y se desvanece en 0,6 s), blanco al 25 %. Sin sombras ni luz. No se dibuja con radio 0.
- **Aviso sobre el zombi:** al pasar a `despertando`, un «!» amarillo sobre su cabeza 0,8 s (un sprite compartido; sin texto DOM por zombi).
- **`?debug`:** línea «zombis: D n · ! n · P n · W n» (dormidos, despertando, persiguen, deambulan) y barras: radio de disparo, radio de andar, radio de correr, vista (m), velocidad zombis ×. Con `?debug`, además, el cono de vista de cada zombi dibujado en el suelo (líneas).

## Coordinación con los modelos de zombi (010 §7)
- El estado decide un **nombre lógico de clip**: `idle` (dormido) · `wake` (despertando) · `walk` (deambula) · `run` (persigue) · `attack` · `hit` · `die`. Se piden con `play(inst, nombre)`; si el modelo no tiene ese clip, se usa el anterior de la lista y, si no hay ninguno, el movimiento por código de hoy. Así funciona con las cápsulas de relleno y con los modelos definitivos sin tocar este paquete.
- No se escribe en este paquete nada que dependa del aspecto: ni alturas, ni huesos, ni archivos. El «!» se coloca a 1,7 m × escala del tipo.
- Nota de base: desde PAQ-G3 las mallas animadas se descartan por cámara (`assets.js`) y la calidad por defecto en móvil es B (resolución nativa, suavizado ×2, sombra 2 048). Las pruebas de pantalla se hacen a densidad 2 (el navegador de pruebas no mueve la nativa). **Quien implementa ahora es Fable** (DECISIONES 1.8); donde el traspaso dice Sonnet, léase quien implemente.

## Arquitectura (norma 3, obligatoria)
- `ruido.js`, `percepcion.js` y `disparadores.js` no importan THREE ni tocan el DOM; trabajan con datos simples y se pueden ejecutar en Node. El dibujo (aro, «!», conos) solo lee.
- Nada de `Math.random` en estados, tiempos de despertar ni puntos de deambular: `hash` de `sim.js`. El giro se guarda como vector; `atan2` solo en el dibujo.
- El estado de cada zombi cabe en `{id, tipo, estado, t, x, z, gx, gz, vida, obj}`.

### Fuera de este paquete (no hacer)
NPC, hostiles que disparan, cobertura, señuelos, rematar por la espalda, luz y sombra en la vista (todo eso es PAQ-04 y PAQ-05), sonido, búsqueda de caminos, modelos o animaciones nuevas, tocar el modo de oleadas, cambiar el tamaño del mapa.

## Pruebas (obligatorias)
| # | Prueba | Aceptación |
|---|---|---|
| 1 | `npm run build`, `node tools/test_physics.mjs` y `node tools/test_percepcion.mjs` (nuevo) | Compilan y pasan |
| 2 | Node: ruido de radio 30 a 17 m con un muro en medio; a 14 m con uno; a 5 m con tres | No se oye · se oye · no se oye |
| 3 | Node: jugador a 4 m delante de un zombi dormido; a 4 m detrás; a 4 m delante agachado; a 7 m delante corriendo; a 4 m delante con muro en medio | Lo ve · no · no · sí · no |
| 4 | Node: dos ejecuciones con la misma semilla y las mismas órdenes | Mismos estados y posiciones en el paso 600 |
| 5 | Node: contagio: 3 zombis en fila separados 3 m, se despierta el primero | Los tres en `persigue` antes de 3 s; con 5 m de separación, solo el primero |
| 6 | Node: zombi en `persigue` sin estímulos | A los 8 s pasa a `deambula` y no se aleja > 4,5 m de `obj` |
| 7 | Navegador: entrar al mapa y no hacer nada 10 s | 10 zombis `dormido`; ninguno se mueve |
| 8 | Navegador: un disparo desde el inicio | Despiertan los de la zona de tiro (sin muro en medio); el «!» aparece; llegan y hacen daño |
| 9 | Navegador: cruzar la zona de tiro agachado por el centro hasta la reja | 0 zombis despiertos |
| 10 | Navegador: lo mismo corriendo | Despiertan los 2 de la zona de tiro |
| 11 | Navegador: dejarse matar | «Has caído», reaparece en (0, 0) con vida 100; zombis en su sitio y dormidos; la reja conserva su estado |
| 12 | Navegador: romper el candado; entrar en la zona `explosivos` dos veces | Cada mensaje sale una sola vez |
| 13 | Táctil 390 × 844: botón «AGACH.» | Alterna; no se solapa con `RECAR.`, `GRAN.` ni «Usar»; en horizontal 844 × 390 tampoco |
| 14 | `?debug` | La línea de estados cuadra con lo que se ve; las barras cambian el comportamiento en vivo |
| 15 | Modo normal (sin prueba): jugar dos oleadas · `?carga` | Oleadas idénticas a antes; `?carga` sin daño y con zombis quietos; 0 errores |
| 16 | Todo lo de PAQ-01 y PAQ-02 (muros translúcidos, zombis lejanos ocultos, Usar, reja) | Sigue igual |
| 17 | `?debug` con los 10 zombis persiguiendo | Triángulos y llamadas apuntados en el informe; CPU por cuadro no sube más de 0,5 ms respecto a antes (medido en el navegador de pruebas, como referencia) |

**No se puede comprobar aquí:** tacto del botón y fps en el iPhone real. Decirlo en el informe y pedir al usuario la prueba 004 §5.1: «cruza hasta la reja agachado sin despertar a nadie; luego hazlo corriendo».

## Criterios de aceptación del paquete
1. Pruebas 1-17 superadas y documentadas.
2. Ruido, percepción y disparadores son simulación pura, deterministas y con estado serializable.
3. Radios, vista y disparadores están en datos, no escritos en el código.
4. El modo de oleadas y `?carga` no cambian.
5. Ningún archivo fuera de la lista modificado (salvo documentos de Sonnet).

---
## Informe de Sonnet (rellenar al entregar)
- Commit(s):
- Qué se hizo:
- Decisiones secundarias tomadas:
- Resultado de cada prueba (1-17):
- No comprobado:

## Revisión de Fable
(pendiente)
