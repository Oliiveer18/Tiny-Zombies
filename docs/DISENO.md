# DISENO · juego de supervivencia sobre la base de Tiny Zombies

Estados: ✅ decidido por el usuario · 💡 propuesto por Claude (el usuario lo corrige; nada pasa a ✅ sin que lo diga) · ⬜ pendiente de decidir.
Procedencia: conversación del 15 nov 2026 + documentos del otro proyecto (`referencia_carretera_zombi/`).

## 0. Decisiones
| Tema | Decisión | Estado |
|---|---|---|
| Base técnica | Tiny Zombies (Three.js + Vite); se sigue desde su proyecto | ✅ |
| Aspecto, cámara, controles, armas, zombis | Exactamente como Tiny (`TINY_ACTUAL.md`) | ✅ |
| Apuntado | Manual como Tiny; no se trae el autoapuntado del otro proyecto | ✅ |
| Oleadas | No. Zombis colocados en el mundo | ✅ |
| Tipo de juego | Supervivencia: tu sitio, exploras, NPC, refugio, comida, agua | ✅ |
| Mundo | Realista, grande, dividido en regiones; no se dibuja todo a la vez | ✅ |
| Peligro | Depende del lugar y de lo que hay allí. NO crece con la distancia ni por un reloj | ✅ |
| Contrapeso al progreso del jugador | 8 fuentes de presión realista (§5) | ✅ |
| Estaciones y clima | Sí, con duración intermedia (§6) | ✅ (cifras 💡) |
| NPC | Encontrarlos, traerlos, tenerlos en el equipo | ✅ |
| Tamaño del mundo | Ilimitado, generado por semilla | ✅ |
| Historia | Sin historia ni final: mundo sin final donde el objetivo es sobrevivir y crecer | ✅ |
| Muerte | Total: se acaba la partida (en coop, termina cuando caen todos) | ✅ |
| Movimientos tácticos | Sí, los del vídeo de referencia: correr táctico, saltar obstáculos, deslizarse, agacharse (paso A8) | ✅ |
| Cuerpos y skins | Un cuerpo base con esqueleto y animaciones compartidos, varias skins para jugador y NPC; accesorios aparte; colores propios distintos de la referencia | ✅ (detalle 💡) |
| Oli y Lali | NO existen en este juego (son de otros proyectos): ni jugadores, ni NPC, ni nombres, ids ni modelos | ✅ |
| Personajes y modelos | Todos con Meshy (estilo Tiny); no se crean por código ni se empieza con cápsulas (`MODELOS_MESHY.md`). NO hay un protagonista fijo: cada jugador crea el suyo (cuerpo base + skin + accesorios) 💡; ids de jugador por perfil, no `j1`/`j2` fijos | ✅ (creador 💡) |
| Online | Objetivo ✅: cada jugador monta su refugio y hay combates contra otros jugadores durante la exploración. Se implementa LO ÚLTIMO, pero todo se diseña ya para ello (§14) | ✅ |

## 1. Visión 💡
Supervivencia de mundo abierto en un apocalipsis zombi, de movimiento y disparo directos como Tiny. Lo central es tu refugio: lo montas desde casi nada, lo haces crecer con compañeros rescatados y lo mantienes con comida y agua. El mundo no se adapta a ti: cada lugar es lo que es, y la tensión sale de explorar, del ruido que haces y de cuánto te expones al crecer. Solo o en cooperativo (2 móviles) más adelante.

## 2. Lo que cambia de Tiny y lo que no
- **Se amplía (decisión del usuario):** movimientos tácticos (correr táctico, saltar, deslizarse, agacharse) además de lo de Tiny.
- **No cambia:** cámara, luz, bloom, niebla, controles táctiles y de teclado, estamina, disparo, recarga, granadas y física de objetos, los 3 tipos de zombi y sus cifras.
- **Cambia (decisión del usuario):** las oleadas desaparecen. Los zombis ya están en el mundo, quietos, caminando o en grupo, y se alertan por ruido y visión. Las granadas pasan a ser botín, no un regalo por oleada. La arena fija se sustituye por el mundo por regiones.
- **Se añade:** mundo, NPC, refugio, necesidades, tiempo.

## 3. Mundo grande y por regiones 💡
- **Rejilla de regiones** de unos 100×100 de lado (valor a medir). Cada región se divide en trozos de dibujo más pequeños.
- **Solo existe lo cercano:** se mantienen cargadas unas 9–25 regiones alrededor del jugador; lo lejano se descarta. El coste es el mismo con un mundo pequeño que con uno enorme. Las regiones nuevas se preparan poco a poco (presupuesto por cuadro) y la niebla de Tiny oculta el borde.
- **Semilla:** cada región sale de `hash(semilla, rx, rz, tipo)` con `Math.imul` y `+ - * /`. Una región sale igual en cualquier orden de carga y en cualquier móvil.
- **Origen flotante:** pasadas unas 2 000 unidades del origen, el dibujo resta el origen de la región activa para evitar errores de coma flotante.
- **Guardado:** solo los CAMBIOS sobre lo generado (lo que construyes, saqueas, matas, NPC movidos), por región y con número de versión. Una región ya visitada no cambia aunque se añada contenido nuevo.
- **Lo lejano se calcula al volver:** cada región guarda la última vez que se visitó; al volver se resuelve con una cuenta sencilla (cultivos, comida podrida, zombis que migraron), sin simularla mientras no se ve.
- **Tipos de región:** campo, bosque, pueblo, carretera, granja, costa/lago/río, ruinas. Cada tipo decide su densidad de zombis, su botín y qué lugares puede tener.
- **Lugares hechos a mano:** plantillas de datos que caben en una región y se colocan por semilla y tipo. Lista base (de `MUNDO.md`): unos 20 con interior y puerta (casa, tienda, ferretería, clínica, comisaría, iglesia, bunker, farmacia, restaurante, escuela, pisos, almacén, taller, posada, biblioteca, armería, cuartel, faro, sótano/metro, barco varado) y unos 20 abiertos (granja, cobertizo, gasolinera, puerto, desguace, campamento militar, refugio de supervivientes, cantera, cementerio, puente con control, mercado, camión volcado, plaza, establo, central eléctrica, aeródromo, torre de vigilancia, campo de refugiados, depósito de agua, invernadero). Se hacen por olas, un prototipo a mano por tipo y variantes después. Primer prototipo: la casa abandonada.
- **Interiores:** instancia aparte con puerta y fundido; se precarga al acercarse (en `MUNDO.md` y `DISENO.md` originales: caché de 2).
- **Elementos sueltos:** vallas, coches abandonados, escombros, árboles muertos, barricadas, puentes, carteles. Son datos por región, dibujados en bloque (instanciados) como ya hace Tiny.
- **Inicio con ventaja ligera** ✅: al principio hay un claro algo más tranquilo con un pozo (pocos zombis, lentos o dormidos, sin lugares diseñados dentro) para dar margen hasta que el jugador haga sus primeras mecánicas. Pero nunca es un sitio seguro: hay peligro desde el minuto uno. La ventaja es solo de arranque y no crea gradiente por distancia: fuera del claro todo depende del lugar.
- **Agua** (de `DISENO.md` original, ✅ allí): toda agua tiene causa (cuenca, cauce, manantial) y orilla; lagos y ríos sí, mar no; 3–4 % del mundo; pantano más adelante; el pozo del claro da agua limpia y el agua natural es turbia.
- **Caminos y carreteras** unen lugares; la carretera cruza el río por un puente. Datos de ejemplo en `referencia_carretera_zombi/mapas/carretera_prueba.json`.
- **Tamaño** ✅: ilimitado por semilla.

## 4. Zombis y ruido 💡
- Los tres tipos de Tiny (normal, corredor, tanque) y sus cifras. Más variantes después.
- Colocados al generar la región según su tipo y sus lugares (un pueblo denso está lleno, un campo casi vacío, un bunker tiene el mejor botín y muchos zombis). Estados: dormido, deambulando, en grupo.
- **Ruido:** disparos, granadas, coches y obras atraen a los zombis cercanos. Las hordas son consecuencia del ruido, no de un contador. Percepción por vista corta y por oído.
- Despejar un sitio lo deja despejado; los zombis solo vuelven despacio y por causas realistas (§5-7).
- Piscinas de objetos como en Tiny: solo se dibujan los cercanos; los lejanos son datos.

## 5. Presión realista (sustituye a «más difícil con el tiempo»)
Cada una es una capa independiente de datos. Orden de trabajo sugerido: 1-3 primero, 4, 6-8, 5 al final.
1. **Tu refugio se nota:** más gente, luz, ruido y tamaño atraen más zombis. Crecer da fuerza pero expone.
2. **Más bocas que alimentar:** cada NPC consume comida y agua.
3. **Nada es infinito:** el botín de edificios no se repone; munición limitada; armas con desgaste. Renovable: cultivos, pesca, caza, corral, pozo, río.
4. **El mejor botín está en los peores sitios:** bunker, cuartel y zona muerta; seguir siendo un reto aunque estés fuerte.
5. **Otros supervivientes** hostiles se fijan en refugios con buen equipo y pueden asaltarlos o robar (la más costosa; la última).
6. **Estaciones y clima** (§6).
7. **Los zombis se mueven:** se agrupan y migran hacia el ruido y la gente; un sitio limpio puede volver a llenarse.
8. **Todo se deteriora:** edificios, comida, piezas del refugio y armas.

## 6. Tiempo, estaciones y clima 💡
- **Un solo reloj de juego** (número guardado) del que salen hora, día del año, estación y clima. Determinista: misma semilla y mismo tiempo, mismo clima. Funciona igual en coop.
- **Día/noche:** unos 20 min reales por día; luz, cielo y niebla cambian suavemente. La noche azul de Tiny es un punto del ciclo.
- **Estaciones «intermedias»:** ~6 días de juego cada una (≈ 2 h reales), año de 24 días (≈ 8 h reales). Cifras ajustables.
- **Cada estación cambia:** aspecto (colores, nieve), comida (qué se cultiva y cuándo, caza), necesidades (frío: más gasto, fuego y abrigo) y agua (lagos y ríos pueden helarse o bajar).
- **Clima:** lluvia, niebla, tormenta, calor, nieve; probabilidad por estación, transiciones graduales. Efectos: la lluvia llena barriles, apaga fuegos y tapa el ruido; la niebla reduce la vista (tuya y suya); la tormenta rompe piezas débiles y amortigua los disparos; el frío o calor extremo quita vida sin preparación.
- **Técnica:** tabla de datos por estación y clima (luz, color, niebla, efectos); mezcla por interpolación; efectos baratos (lluvia = un solo bloque de partículas, nieve = tinte del suelo, niebla ya existe); se mide el coste de cada uno en el móvil. Más adelante, clima por región (montaña más fría que costa).

## 7. NPC 💡 (base ✅ de `IDENTIDAD.md`)
- Habitantes con id, rol, estado, necesidades y lealtad. Se colocan por lugar y tipo de región (médico en la clínica, mecánico en el taller…).
- Estados al encontrarlos: moribundo, escondido, perdido, atrapado, hostil que se puede convencer.
- Bucle: encontrar → rescatar → llevar al refugio → curar, vestir, armar → asignar rol.
- Roles: médico, soldado, quien busca comida, constructor, cultivador, pescador, vigía.
- En el refugio trabajan según su rol y usan las estancias; en el equipo te acompañan y combaten con las mecánicas de Tiny (disparan, rodean, lanzan granadas).
- Necesidades: comida, agua, descanso, seguridad. Lealtad: sube o baja según el trato.
- Comportamiento determinista desde datos y semilla.

## 8. Refugio y construcción 💡 (resumen de `CONSTRUCCION.md`)
- Construcción libre por piezas, apoyadas en el suelo o en otra pieza; sin simulación física compleja.
- Piezas: estructura (suelo, muro, puerta, ventana, techo, escalera, valla), estaciones (hoguera, mesa de trabajo, cocina, cama, caja, depósito de agua, huerto, corral, torre de vigía, trampas, luz) y mobiliario.
- Materiales en niveles (improvisado → madera → piedra → metal), cada pieza con vida; los zombis atacan lo más débil.
- Estancias que se reconocen solas por lo que hay dentro (dormitorio, cocina, enfermería, almacén, taller).
- Recursos: palos, piedras, hierba, chatarra del suelo; madera, piedra, metal, tela, clavos con herramientas.
- Crafteo simple a mano y complejo en estaciones; recetas que crecen al encontrar planos.
- En móvil: modo construcción, vista previa verde/roja, arrastrar para líneas y rellenos, deshacer.

## 9. Supervivencia 💡
- Hambre y sed (la sed baja más rápido; a 0 quitan vida). Vida y estamina de Tiny se mantienen.
- Agua: pozo, río, lago, lluvia; la turbia se limpia en un purificador automático que construye el jugador. Más adelante bomba y tubería.
- Comida: huerto, pesca, caza, corral, botín.
- Inventario: pocos huecos en mano + mochila con peso. Cifras ⬜ (se ajustan con pruebas).
- Muerte ✅ (para el juego en solitario): total. Se acaba la partida (y se borra el mundo, como en el otro proyecto). Se muestra el tiempo sobrevivido y el récord. ⚠️ Con online hay que redecidirlo: ver §14.

## 10. Vehículos y animales (después) 💡
Vehículos (bici, moto, coche, camioneta, barca) abandonados y averiados, con combustible finito y ruido. Animales de granja y salvajes con id por región; perro domesticable. Detalle en `MUNDO.md` §3b-3c.

## 11. Pantallas e interfaz 💡
Título (Continuar / Nueva partida), juego, pausa, fin de partida; HUD con vida, estamina, hambre, sed, hora y clima, arma y munición; inventario; modo construcción; minimapa. Sin tutorial. Para el móvil vertical y el pulgar. Detalle en `PANTALLAS.md`.

## 12. Rendimiento y técnica (obligatorio)
Ver las normas 2 y 3 de `CLAUDE.md`. Presupuestos: ≥ 58 fps, peor cuadro ≤ 25 ms, < 40 000 triángulos visibles. Medidor `?debug` desde el primer subpaso. Todo trabajo por región, solo lo visible y con presupuesto por cuadro. Cada subpaso se mide en el móvil antes de darlo por bueno.

## 13. Qué NO se trae del otro proyecto
Su motor HD-2D por casillas, el suelo con shader y el horneado por chunk, los assets pixelados, Three r128 en un solo archivo, los 20 pasos de su hoja de ruta tal cual, el autoapuntado, «el mundo se endurece con el tiempo» y las zonas por distancia al claro. Se conservan como consulta en `referencia_carretera_zombi/`.

## 14. Online (se implementa lo último; se diseña ya) ✅ objetivo · 💡 el resto
Objetivo del usuario ✅: juego online en el que cada jugador monta su propio refugio y hay combates contra otros jugadores durante la exploración. Se hará al final, pero todo lo anterior se construye sabiéndolo.

### Principios que valen desde el primer subpaso 💡
1. **Simulación separada del dibujo.** Toda la lógica (movimiento, disparos, daño, zombis, NPC, comida, construcción, reloj) vive en módulos sin dibujo ni DOM. El dibujo solo lee su estado.
2. **Órdenes, no cambios directos.** El jugador y la IA solo emiten órdenes (`mover`, `disparar`, `construir`…) con el id del jugador; la simulación las aplica. El juego offline es «un servidor de un solo jugador»: más adelante la misma simulación corre en un servidor y los móviles solo mandan órdenes y reciben estado.
3. **Determinismo y semilla** (norma 3): mismo mundo para todos con la misma semilla; las órdenes se pueden repetir y validar.
4. **Estado serializable con id** (jugadores, NPC, zombis, piezas, vehículos). Guardado por cambios sobre lo generado (A4), que servirá también como persistencia del servidor.
5. **Tiempo de juego propio**, no el reloj del móvil.
6. **Nada de confiar en el cliente** para lo que importe en PvP (daño, inventario, posición): se valida en la simulación. Se evita dejar lógica de juego en el código de dibujo o de entrada.

### Protagonista y personajes 💡
No hay un protagonista único. Cada jugador crea el suyo con un creador sencillo: elegir entre 1-3 cuerpos base y combinar skins (ropa/colores) y accesorios. Es el mismo sistema de cuerpo base + skins + accesorios sobre un esqueleto compartido de `MODELOS_MESHY.md`; los demás jugadores lo ven tal cual. Los datos del aspecto van en el perfil del jugador (serializables, ligeros de enviar por red). En un primer momento (solo) se empieza con 3-4 combinaciones prefijadas.

### Refugios 💡
Cada jugador tiene su refugio (datos de piezas por región, A4/B1). En un mundo compartido, cada refugio tiene su ubicación en el mapa. Si otros jugadores pueden asaltarlo, robar o destruirlo es una decisión de diseño pendiente (⬜).

### PvP 💡 (⬜ casi todo por decidir)
Combates entre jugadores durante la exploración con las mecánicas de Tiny. Por decidir: zonas seguras o no, botín al morir, qué se pierde, protección del refugio mientras estás desconectado, límites contra abusos. Los «grupos hostiles» del punto 5 de §5 pueden ser jugadores reales o IA; se decide al llegar.

### Forma del mundo online ⬜ (decisión que puede esperar)
- **Opción A, mundo compartido persistente:** un servidor mantiene un mundo por semilla donde todos coinciden (decenas de jugadores). Más cercano al sueño del usuario; exige servidor siempre encendido (coste y mantenimiento).
- **Opción B, mundo propio + encuentros:** cada jugador tiene su mundo y refugio, y se cruza con otros en zonas/expediciones compartidas. Más barato y más fácil de proteger.
- La preparación técnica (principios de arriba) es LA MISMA para ambas, por eso la decisión puede esperar. El P2P de PeerJS del otro proyecto sirve para 2 jugadores cooperativos, no para PvP con muchos jugadores.

### Muerte en online ⬜
La «muerte total que borra el mundo» (§9) no encaja con refugios persistentes en un mundo compartido. Propuesta 💡 para decidir: al morir se pierde el personaje y lo que llevas encima, y el refugio se conserva (con sus NPC o parte de ellos). Pendiente de respuesta del usuario.
