# 002 · Diseño técnico de A1 (mundo por regiones)

Leído: `CLAUDE.md`, `DISENO.md` §3, §14 y §15, `TINY_ACTUAL.md`, `src/world.js`, `src/zombies.js`, `src/player.js`, `src/game.js`. Todo es 💡: las cifras son puntos de partida a medir en el iPhone 14. Mundo plano, sin cooperativo.

## 0. Avisos antes de empezar
1. **Ids (A0c aún no está hecho).** Este diseño necesita que el id de lo generado sea `(rx, rz, canal, i)`, con `i` = posición en el orden de generación de su capa. Lo creado en partida (más adelante) usa un contador guardado en la partida. Si A0c elige otra cosa, avisar antes de A1.
2. **Cambio respecto a la petición: se dibuja menos de ~60.** Con la cámara de Tiny (fov 38, desfase 0/14/8.6) el suelo visible no pasa de ~20 unidades del jugador; por eso Tiny hace aparecer zombis a 22. La niebla a esa distancia aún deja ver el 70 %, así que lo que tapa el borde es el marco de la pantalla, no la niebla. Propongo dibujar una ventana de 5×5 trozos de 16 (entre 32 y 48 unidades en cada dirección): es 80×80, justo el tamaño de la arena actual, así que el coste de dibujo queda igual que el de Tiny hoy. Los DATOS sí llegan a 60 (hacen falta para balas, zombis y colisiones).
3. **Módulos sin dibujo.** Generador, hash, rejilla y cambios no importan `three` ni tocan el DOM (principio 1 de §14). Así se prueban con `node`.

## 1. Tamaños
| Cosa | Valor | Por qué |
|---|---|---|
| Región (datos) `R` | 64 | Potencia de 2: sumar o restar 64 es exacto en decimales |
| Ventana de datos | 3×3 regiones (192×192) | Con el margen de abajo, siempre hay datos a ≥ 60 del jugador |
| Trozo de dibujo `T` | 16 (4×4 por región) | Cruzar un trozo cambia ~5 trozos ≈ 25 props: sin tirón |
| Ventana de dibujo | 5×5 trozos centrados en el trozo del jugador | Aviso 2 |
| Celda de colisión | 4 | Un prop cae en 1-4 celdas; una consulta mira ≤ 9 celdas |
| Margen (histéresis) | 4 en regiones, 2 en trozos | La ventana no se recentra hasta entrar 4 (o 2) en la vecina: ir y venir por un borde no recarga nada |
| Densidad de props | 77 por región: valla 23, barril 12, barrera 11, caja 14, saco 12, coche 4 | Misma densidad que la arena de Tiny. Va en una tabla de datos por tipo de región (`regiones.json`, solo «campo» en A1) |

## 2. Hash y semilla
```js
const VERSION_GENERADOR = 1;
function h32(a){ a|=0; a=Math.imul(a^(a>>>16),0x85ebca6b); a=Math.imul(a^(a>>>13),0xc2b2ae35); return (a^(a>>>16))>>>0; }
function mezcla(h,v){ return h32((h + Math.imul(v|0, 0x9E3779B1))|0); }
function hash(semilla,rx,rz,canal){ return mezcla(mezcla(mezcla(h32(semilla),rx),rz),canal); }
```
- **Nivel 1:** `tipo = tipoRegion(hash(semilla,rx,rz,CANAL.TIPO))`. En A1 devuelve siempre «campo»; A2 la rellena.
- **Nivel 2:** cada capa crea su propia cadena `mulberry(hash(semilla,rx,rz,canal))` (la función `mulberry` ya existe en `world.js`). Decimal = `u/4294967296`.
- **Canales (no se renumeran nunca):** 1 tipo · 2 props · 3 zombis · 4 botín · 5 NPC · 6 lugares · 100 formas grandes.
- **Reglas del generador:** función pura `generarRegion(semilla,rx,rz) → región`; solo lee sus argumentos y tablas de datos; nunca otra región, ni cambios, ni la posición del jugador, ni relojes. Posición, giro y tipo de cada prop salen de la cadena con `+ - * /`. Seno y coseno solo se calculan después, para dibujar y colisionar.
- **Formas grandes (ríos, lagos, carreteras; el contenido es de A2):** celda grande = 8×8 regiones (512). `formasDeCelda(semilla,mx,mz)` es pura y sale de `hash(semilla,mx,mz,100)`. Una región llama a esa función para su celda grande y las 8 de alrededor y se queda con lo que la pisa. A1 solo deja la función (devuelve lista vacía) y la prueba.
- **Prueba automática (`npm run test:regiones`, con node):** genera 20 regiones en un orden y en el inverso y compara el JSON; guarda una suma de control. Si la suma cambia sin subir `VERSION_GENERADOR`, la prueba falla.

## 3. Posición: región entera + decimal local
- **La verdad** de cualquier cosa es `(rx, rz, lx, lz)`, con `lx, lz` en [0, 64). Así se guarda.
- **Región centro `C`:** la del jugador, con margen 4.
- **Espacio de trabajo:** el código de Tiny sigue usando `x, z` como hoy, pero relativos a `C`: una región `(rx,rz)` empieza en `((rx−C.rx)·64, (rz−C.rz)·64)`. El jugador vive en [−4, 68) y nada pasa de ±130, así que la precisión es la misma a cualquier distancia del inicio.
- **Al cambiar `C`** (único momento especial): se suma ±64 a todo lo vivo y se recalcula el `x, z` de los datos cargados desde su verdad. Lista cerrada de lo vivo, que debe estar en UN solo sitio del código: jugador (`x, z, ax, az`), cámara, zombis activos, props en vuelo, granadas en vuelo, efectos (trazadoras, explosiones) y retícula. Sol y suelo ya siguen al jugador.
- **Suelo:** un plano de 128×128 que sigue al jugador (color liso, no se nota). Se quitan `FIELD` y los dos `clamp`.
- **Inicio:** región (0,0), local (32,32). Sin props a menos de 5 del punto de inicio, como en Tiny.
- **Prueba:** `?debug=lejos` arranca en la región (1 000 000, 1 000 000). Debe verse y medir igual.

## 4. Datos de una región (se generan, nunca se guardan)
```js
{ rx, rz, tipo,
  props: [ { i, k, lx, lz, rot, forma, r | hx,hz,  // forma 0 = círculo (r), 1 = rectángulo girado (medios lados)
             x, z, c, s,                            // derivados: espacio de trabajo, cos y sin de rot
             hueco, fly, y, vx, vy, vz, vr, tx } ], // estado de dibujo y de vuelo (lo de Tiny)
  trozos: [16 listas de índices de props],
  zombis: [] }                                      // A3
```
Radio y forma de cada tipo de prop salen de `models.config.js`, como hoy.

## 5. Carga y descarga con presupuesto
- **Cola de tareas** ordenada por cercanía al jugador: generar región → aplicar sus cambios (§8) → meterla en la rejilla → dibujar trozo / soltar trozo.
- **Presupuesto:** se procesan tareas hasta gastar 2 ms por cuadro (`performance.now()` solo para cortar, nunca para decidir contenido) y como máximo 1 región por cuadro. El orden real puede variar entre móviles; el resultado no, porque el generador es puro.
- **Holgura:** las 3 regiones nuevas quedan a ≥ 60 del jugador cuando se piden; corriendo a 7 son más de 8 s. Generar una región (77 props) debería costar < 0,2 ms.
- **Descarga:** una región que sale del 3×3 se saca de la rejilla, se aterrizan sus props en vuelo (§7) y se sueltan sus datos. Sus cambios se quedan.
- **Coste fijo:** siempre 9 regiones, 25 trozos y ~120 props dibujados, estés donde estés.

## 6. Dibujo: una malla instanciada global por tipo de prop
- Se conserva lo de Tiny (`InstancedMesh` por tipo, `frustumCulled=false`, sombras), pero con **capacidad fija** = máximo de ese tipo en la ventana 5×5 con margen del doble (💡 valla 80, barril 48, barrera 48, caja 48, saco 48, coche 16) y `im.count` = huecos usados.
- **Entrar un trozo:** cada prop toma el siguiente hueco libre (`p.hueco`) y escribe su matriz.
- **Salir un trozo:** el último hueco usado se mueve al hueco que queda libre (y se actualiza el `hueco` de ese prop) y `count` baja 1. Sin crear ni destruir nada en la GPU.
- `instanceMatrix.needsUpdate` una sola vez por cuadro y por malla, no por prop.
- Si un tipo se queda sin huecos, el prop no se dibuja y `?debug` lo marca en rojo. Nunca se agranda la malla en caliente.

## 7. Colisiones y entidades que cruzan
**Rejilla.** 48×48 celdas de 4 que cubren justo el 3×3. Índice en anillo: celda global `gx = rx·16 + ⌊lx/4⌋`, posición `((gx mod 48)+48) mod 48` (igual en z). Como la ventana mide exactamente 48 celdas, no hay choques de índice y al recentrar no se reconstruye nada: solo entran y salen las regiones que cambian. Cada celda es una lista de referencias a props; un prop se apunta en todas las celdas que toca su caja.

**Una consulta para todo:** `cercanos(x, z, radio, fn)`. Sustituye los cuatro recorridos de listas enteras: colisión del jugador, rodeo y colisión de zombis, bala (consultar las celdas a lo largo del rayo de 28) y explosión (radio 7). La separación entre zombis (40×40) se queda como está.

**Rectángulo girado** `(x, z, hx, hz, c, s)`, con una sola función base: `puntoMasCercano(o, px, pz)` pasa el punto al marco del rectángulo, lo recorta a ±hx, ±hz y lo devuelve.
- Empujar un círculo fuera (jugador, zombi): vector desde ese punto al centro del círculo; si mide menos que el radio, se empuja. Si el centro está dentro, se saca por el lado más cercano.
- Rodeo del zombi: la misma fórmula actual, usando ese punto como centro y radio 0.
- Bala: corte de rayo con caja en el marco del rectángulo.
- Los rectángulos son fijos (no vuelan). A1 no genera ninguno: solo `?debug=rect` pone un muro de prueba junto al inicio. A2 y A5 los usan.

**Props que vuelan.** Al salir volando se quita de la rejilla (hoy se salta con `o.fly`). Al pararse se calcula su región por su posición, se apunta en la rejilla y se guarda el cambio (§8). Si su región se descarga o queda a más de 60 del jugador mientras vuela, aterriza en el acto donde esté.

**Zombis.** El zombi activo pertenece a la piscina, no a una región. En A1 siguen las oleadas (se quitan en A3): aparecen a 22 sin `clamp`, y el que quede a más de 60 vuelve a la piscina y a la cola de la oleada. Contrato para A3: a más de 60 se escribe como dato (`zx`) en la región donde está, y escribir un cambio nunca exige que esa región esté cargada.

## 8. Cambios guardables
Un mapa `cambios["rx,rz"]`, separado de las regiones cargadas. En A1 vive solo en memoria; A4 lo pasa a IndexedDB sin cambiar el formato.
```js
partida = { versionGenerador, semilla, tick, siguienteId, jugador: { rx, rz, lx, lz, hp, … } }
cambios["rx,rz"] = { v: 1, t,              // t = tick de la última visita
  idos:     [i, …],                         // props generados aquí que ya no están
  movidos:  [i, x, z, rot, …],              // props generados aquí, en otro sitio de esta región
  llegados: [k, x, z, rot, …],              // props venidos de otra región
  zm: [i, …], zx: [tipo, x, z, hp, …],      // A3: zombis muertos / zombis dejados aquí
  bot: […], piezas: […] }                   // A5, B1
```
- Todo son listas planas de enteros: posición en 1/16 de unidad (0-1023), giro en 1/256 de vuelta.
- **Aplicar** (al cargar la región, después de generar): quitar `idos`, recolocar `movidos`, añadir `llegados` con `i` a partir de 10 000.
- Un prop que cruza: `idos` en la región de origen + `llegados` en la de destino. Si vuelve a moverse, se actualiza su entrada, no se añade otra.
- **Tope de 4 KB por región** (tamaño del JSON): al llegar, ya no se apuntan más props movidos (volverán a su sitio al recargar). Muertes, botín y piezas siempre tienen prioridad.
- `?debug` muestra bytes de la región actual y el total.

## 9. Subpasos y qué medir
Cada uno es una sesión, deja el juego jugable y se mide en el iPhone 14 con `?debug` (fps, peor cuadro, triángulos de las dos pasadas).
| # | Esfuerzo | Qué se hace | Qué se ve | Qué medir |
|---|---|---|---|---|
| A1a | LOW | `hash`, `generarRegion`, `formasDeCelda` vacía, tabla de densidad y la prueba con node (§2) | Nada | Prueba en verde; ms por región |
| A1b | MEDIUM | Rejilla con círculos y `cercanos()` todavía en la arena de Tiny; jugador, zombis, balas y explosión la usan | Nada (debe sentirse igual) | Mismo fps que antes; props mirados por consulta (≤ 10) |
| A1c | LOW | Rectángulo girado + muro de `?debug=rect` | Solo el muro de prueba | No se atraviesa, la bala se para, el zombi lo rodea |
| A1d | MEDIUM | Mundo sin bordes: región centro, espacio de trabajo y salto de ±64 (§3), 3×3 con carga y descarga (§5), suelo que sigue. Se dibujan todos los props del 3×3 (aún sin trozos) | El mundo ya no se acaba | Regiones = 9 siempre; sin salto visible al cruzar; `?debug=lejos` igual; ms de carga ≤ 2 |
| A1e | MEDIUM | Ventana 5×5 de trozos con huecos reutilizables (§6) | Nada | Triángulos como en Tiny original; peor cuadro ≤ 25 ms corriendo 2 min en línea recta; huecos usados / capacidad |
| A1f | LOW | Cambios en memoria: props movidos, cruces de región, aterrizaje forzado, tope y bytes en `?debug` (§8) | Un barril lanzado sigue donde cayó al irte 200 y volver | Bytes por región; el barril vuelve igual desde cualquier lado |

**A1 está cerrado cuando:** la prueba de A1a sigue en verde; en el iPhone 14 hay ≥ 58 fps y peor cuadro ≤ 25 ms corriendo en línea recta; las cifras son las mismas en la región (0,0) y en `?debug=lejos`; y el generador no lee nada fuera de sus argumentos.

## 10. Fuera de A1 (ya tiene sitio)
Tipos de región, agua, suelo pintado y formas grandes reales → A2 (`tipoRegion`, `formasDeCelda`, celdas no pisables en la misma rejilla). Zombis como datos, ruido y fin de las oleadas → A3 (`zombis`, `zm`, `zx`). IndexedDB → A4 (`partida` y `cambios` tal cual).
