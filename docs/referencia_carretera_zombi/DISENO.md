> ⚠️ Documento de otro proyecto. Menciona a Oli y Lali: en ESTE juego NO existen; ignorar esas menciones. Manda `../DISENO.md`.

# Zombis HD-2D · Documento de diseño

**Versión 0.2.12 · 8 nov 2026 · Título: Endless Aftermath ✅ (ver IDENTIDAD.md §0)**

Documento vivo. Cambio de rumbo respecto a la v0.1: el juego pasa de «10 noches y radio de rescate» a un **sandbox de supervivencia de mundo abierto, sin final**: montas tu base y duras el mayor tiempo posible.

Copia en el proyecto del Claude Doc «Zombis HD-2D · Documento de diseño v0.2». Si hay diferencias, manda la versión más reciente del Doc; al enviar un ZIP nuevo se vuelve a copiar aquí. La v0.1 está archivada en `docs/archivo/DISENO_v0_1.md`.

| Estado | Significado |
|---|---|
| ✅ | Decidido por el usuario |
| 💡 | Propuesto por Claude, pendiente de confirmar |
| ⬜ | Pendiente de decidir (aplazado a propósito) |

## 0. Decisiones tomadas

| Tema | Decisión | Estado |
|---|---|---|
| Tipo de juego | Supervivencia de mundo abierto, sin final ni partida completa | ✅ |
| Objetivo | Montar la base y durar el mayor tiempo posible | ✅ |
| Medida de progreso | Contador de tiempo real sobrevivido (horas y minutos) y récord | ✅ |
| Jugadores | 1 o 2 en cooperativo, cada uno en su móvil | ✅ |
| Personajes | Oli y Lali provisionales | ✅ |
| Muerte | Total (se acaba la partida y se borra todo); en coop cae uno y el otro sigue, termina cuando caen los dos | ✅ |
| Mundo | Generado por semilla en trozos (chunks) con lugares diseñados a mano | ✅ |
| Semilla | Aleatoria y oculta | ✅ |
| Cambios del mundo | Cambia todo con el tiempo, de forma realista y coherente; la v1 incluye día/noche, clima y estaciones | ✅ |
| Zonas lejanas | Se guarda todo; lo lejano se calcula al volver | ✅ |
| Necesidades | Hambre y sed | ✅ |
| Inventario | Pequeño «en mano» + mochila aparte con límite de peso | ✅ |
| Zombis v1 | Un tipo base con variantes de ropa y velocidad | ✅ |
| Dificultad | La elige el jugador al empezar y además el mundo se endurece con el tiempo y según la zona | ✅ |
| Armas | Unas 20 de todos los estilos; munición limitada y desgaste | ✅ |
| Apuntado | Mixto: automático en cuerpo a cuerpo, manual con armas de fuego | ✅ |
| Base | Construcción libre casilla a casilla (muros, puertas, suelos, mesas) | ✅ |
| Crafteo | Lo simple a mano en cualquier sitio; lo complejo en lugares específicos | ✅ |
| Comida y agua | Pesca, caza, pozos, lluvia y purificación, huerto según estación | ✅ |
| Pesca | Se queda en el juego | ✅ |
| Estética | HD-2D, tono cambiante con clima y estación | ✅ |
| Pintores | El juego se ve solo en HD-2D: se quita la vista 2D (cámara, sprites y vuelta al 2D) y no habrá respaldo 2D. Se conserva el dibujo 2D de casillas, que hornea las texturas del suelo del HD-2D | ✅ |
| Sonido | Sin sonido por ahora | ✅ |
| Plataforma | Móvil vertical 390×844, un solo archivo HTML, motor determinista y listo para online | ✅ |
| Idioma | Español | ✅ |
| Rendimiento | Zombis a la vez frente a calidad visual: se decide tras probar en móvil | ✅ |
| Orden de trabajo | Diseñar primero; construir un paso por ZIP; el orden lo propone Claude (§13) | ✅ |

## 1. Visión

| Elemento | Propuesta | Estado |
|---|---|---|
| Género | Supervivencia sandbox de mundo abierto en HD-2D, solo o en coop de dos | ✅ |
| Frase | «Construye tu refugio y sobrevive todo el tiempo que puedas en un mundo que no deja de cambiar.» | 💡 |
| Sensación | Un mundo vivo y creíble; la base como refugio; tensión y alivio al volver | 💡 |
| Público | Sesiones libres en móvil, de unos minutos a horas | 💡 |

### Pilares de diseño

1. **Un mundo vivo.** Día, clima y estaciones cambian lo que se ve y lo que se puede hacer.
2. **La base es el corazón.** Se construye libremente y todo vuelve a ella.
3. **Escasez realista.** Comida, agua, munición y armas son limitadas y se desgastan.
4. **Controles de un pulgar.** Todo se juega bien en un móvil vertical.
5. **Bonito y claro.** El HD-2D debe dejar ver siempre dónde están los zombis.

## 2. Bucle de juego

| Escala | Qué hace el jugador | Estado |
|---|---|---|
| 1 minuto | Moverse, pelear, recoger, beber, comer | 💡 |
| 10 minutos | Salir a por recursos, volver a la base, construir o fabricar | 💡 |
| Partida | Sin final: sobrevivir cuanto más mejor mientras el mundo se endurece | ✅ |
| Al morir | Se muestra el tiempo sobrevivido y el récord; se empieza un mundo nuevo | ✅ |

## 3. Jugadores y cámara

| Elemento | Propuesta | Estado |
|---|---|---|
| Jugadores | 1 o 2 en coop, cada uno en su móvil | ✅ |
| Personajes | Oli y Lali provisionales | ✅ |
| Cámara | Cenital inclinada HD-2D con giro y zoom (ya existe en el pintor) | 💡 |
| Controles | Joystick a la izquierda; a la derecha atacar, esquivar/correr y usar | 💡 |
| Apuntado | Automático en cuerpo a cuerpo; manual con armas de fuego | ✅ |
| Apuntado manual | Gesto o segundo control para apuntar solo con armas de fuego | ⬜ |
| Coop | Mismo mundo, recursos compartidos; si cae uno, el otro sigue | ✅ |
| Reanimar al compañero | Con muerte total, no hay reanimación en la v1 | 💡 |

## 4. Jugador

| Atributo | Uso | Estado |
|---|---|---|
| Vida | Se pierde al ser golpeado; a 0 es muerte total | ✅ |
| Resistencia | Correr y esquivar; se recupera sola | 💡 |
| Hambre | Baja con el tiempo; a 0 se pierde vida poco a poco | ✅ |
| Sed | Baja con el tiempo, más rápido que el hambre; a 0 se pierde vida | ✅ |
| Inventario en mano | Pocos huecos (arma, objeto rápido) | ✅ |
| Mochila | Capacidad por peso (kilos); cada objeto tiene peso | ✅ |
| Cifras (huecos, kilos, ritmos de hambre y sed) | Se fijan al construirlo y se ajustan con pruebas | ⬜ |

## 5. Zombis y amenaza

| Elemento | Propuesta | Estado |
|---|---|---|
| Tipo | Un tipo base con variantes de ropa y velocidad | ✅ |
| Percepción | Ven a corta distancia y oyen el ruido (los disparos atraen) | 💡 |
| Objetivo | El jugador más cercano o lo que hace ruido | 💡 |
| Cómo aparecen y se mueven | Comportamiento realista; se diseña cuando estén claras las demás piezas | ⬜ |
| Más tipos de zombi | Después de la v1 | ⬜ |
| Determinismo | Todo sale de la semilla, para poder validarlo en línea | ✅ |

**Dificultad**

- Al empezar, el jugador elige un nivel de dificultad ✅. Los niveles concretos (por ejemplo Fácil, Normal, Difícil) se definen al construirlo ⬜.
- Cuanto más tiempo pasa, más difícil se vuelve el mundo ✅.
- Según la zona y el momento, el peligro sube o baja ✅.
- Qué se endurece exactamente (cantidad, velocidad, escasez de recursos) ⬜.

## 6. Combate y armas

Objetivo: unas 20 armas para empezar, de todos los estilos ✅. Munición limitada y las armas se desgastan ✅.

| Familia | Armas propuestas | Estado |
|---|---|---|
| Cuerpo a cuerpo (7) | Cuchillo, bate, tubería, hacha, machete, martillo, pala | 💡 |
| Pistolas (3) | Pistola 9 mm, revólver, pistola semiautomática | 💡 |
| Escopetas (3) | De caza (doble cañón), de corredera, recortada | 💡 |
| Metralletas (2) | Subfusil, subfusil compacto | 💡 |
| Rifles (3) | Rifle de caza, rifle de cerrojo, carabina semiautomática | 💡 |
| A distancia silenciosas (2) | Arco, ballesta | 💡 |

- **Ruido:** las armas de fuego atraen zombis; cuerpo a cuerpo y arco/ballesta son silenciosos 💡.
- **Desgaste:** cada arma se degrada con el uso y se puede reparar 💡.
- **Daño fijo:** sin críticos ni azar visible; más fácil de validar y de entender 💡.
- **Fabricar armas:** se decide más adelante ⬜.
- **Cifras por arma (daño, alcance, cadencia, munición, desgaste):** se escriben como datos al construirlas, por tandas ⬜.

## 7. Mundo

| Elemento | Decisión | Estado |
|---|---|---|
| Generación | Por semilla, en chunks que se cargan alrededor del jugador | ✅ |
| Lugares diseñados a mano | Colocados por el generador (casas, gasolinera, granja, etc.) | ✅ |
| Tamaño de chunk y radio de carga | Chunk de dibujo de 16×16 casillas (propuesto, 3d-1; el generador usa 32×32 = 4 chunks de dibujo); el radio de carga se fija al construir el streaming (3d-2) y probar en móvil | 💡 |
| Terrenos y zonas | Bosque, campo, pueblo, lago y río, carretera, granja | 💡 |
| Persistencia | Se guarda todo; lo lejano se calcula al volver | ✅ |

**Un mundo que cambia**

| Capa | Qué cambia | Cuándo | Estado |
|---|---|---|---|
| Tiempo | Día y noche con luz y niebla del pintor HD-2D | v1 | ✅ |
| Clima | Lluvia, niebla y otros fenómenos | v1 | ✅ |
| Estaciones | Cambian el aspecto, los cultivos, la caza y las necesidades | v1 | ✅ |
| Vegetación | Los árboles crecen, se propagan y mueren | Después | ✅ |
| Edificios | Se deterioran y pueden derrumbarse | Después | ✅ |
| Zombis | Migran y se agrupan por el mundo | Después | ✅ |

Todo debe ser coherente y determinista (misma semilla y mismo tiempo, mismo resultado).

**Tiempo**

| Elemento | Propuesta | Estado |
|---|---|---|
| Duración del ciclo día/noche | Unos 20 min reales por día | ⬜ |
| Duración de una estación | Se define al construirlas | ⬜ |

**La base**

- Construcción libre casilla a casilla: muros, puertas, suelos, mesas ✅.
- Las piezas tienen materiales, resistencia y peso de construcción 💡.
- Los zombis pueden atacar y romper construcciones 💡.
- Torretas y trampas: después de la v1 💡.

## 7b. Estructura del mundo (propuesta de dirección técnica, 8 nov 2026 · 💡 hasta que el usuario diga ✅)

| Tema | Propuesta |
|---|---|
| Unidades | Casilla global entera (x,z), sin límite práctico (±1 000 000). Chunk de dibujo 16×16 (ya hecho). Región de generación y de guardado 32×32 = 2×2 chunks de dibujo |
| Origen flotante | Three.js usa float32: pasados ≈2 000 casillas de origen el pintor resta el origen del chunk activo a todas las posiciones |
| Semilla | Entera, aleatoria y oculta (✅). Cada casilla y región sale de `hash(semilla, rx, rz, tipo)` con `Math.imul`, solo `+ - * /` y sin `Math.random`; un chunk sale igual en cualquier orden de carga |
| Biomas | Ruido de valor entero sobre la rejilla de regiones: campo, bosque, pueblo, lago, río, carretera, granja. El bosque emite datos de vegetación (capa `veg`: id + posición), no mallas; así el estilo se elige después |
| Peligro | Nivel por distancia en regiones al claro de inicio (zonas 1-5 de `IDENTIDAD.md` §7); decide densidad de zombis, NPC y calidad del botín. Independiente del bioma (paisaje) |
| Lugares diseñados | Plantillas JSON del editor de mapas, de hasta 32×32, como mucho una por región y siempre dentro de ella (no cruzan regiones: el generador no depende del orden). Se colocan por hash de la región y del bioma; el generador reserva sus casillas |
| Zonas con puerta | El interior es una instancia aparte (mapa del editor con id `int:<región>:<lugar>`), no parte del mundo; se carga al cruzar la puerta con fundido, se precarga al acercarse y hay caché LRU de 2. En coop la entrada es una orden más |
| Datos del chunk | `{v, cx, cz, suelo[256], alt[256], obj[], veg[]}`; todo derivable de la semilla. El pintor solo lee de `G.vista` |
| Guardado v2 | `{v:2, vgen, semilla, t, jugadores:{id:…}, regiones:{"rx,rz":{ult, lugar, cambios:[[x,z,capa,valor],…]}}}`. `lugar` = plantilla colocada al generar la región por primera vez (una región visitada no cambia aunque el catálogo crezca). Solo se guardan los CAMBIOS sobre lo generado (lo lejano se recalcula al volver con `ult`). `vgen` = versión del generador: una partida vive y muere con su `vgen` (la muerte total borra todo). Sitio: IndexedDB por región y metadatos aparte (localStorage solo tiene ≈5 MB); hoy `src/guardado.js` usa localStorage síncrono; el paso «Guardado v2 mínimo» (antes de la construcción) lo pasa a IndexedDB asíncrono |
| Coste | Independiente del tamaño: solo existe en memoria el radio de chunks cargados (3×3 a 5×5 = 9-25 texturas de 256 KB ≈ 2-6 MB de GPU) |

## 7c. Agua realista (✅ decidido por el usuario el 8 nov 2026, salvo lo marcado 💡)

**Principio ✅:** el agua no sale «porque sí». Toda casilla de agua tiene una causa (cuenca, cauce, manantial) y una orilla. El `~` aleatorio de `ventana192` (9 % de agua, sin causa) es solo una prueba de estrés y no es el mundo.

| Tema | Propuesta 💡 |
|---|---|
| Orden de generación | Primero el relieve (altura suave por ruido entero, nudos cada ~96 casillas, más detalle fino); el agua ocupa las cuencas bajas y los cauces que bajan hacia ellas |
| Lago | Como mucho uno por región de 32×32 y siempre dentro de ella (misma regla que los lugares). Forma = elipse deformada por ruido, mínimo ~6×6 casillas, profundidad por distancia a la orilla |
| Río | Cauce continuo de 2-3 casillas. Nace en un manantial o un lago y termina en un lago o sigue sin cortarse; nunca acaba en seco. Cruza regiones por un punto de paso por borde, `hash(semilla, borde)`: las dos regiones vecinas calculan el mismo punto y el chunk sale igual en cualquier orden de carga |
| Estanque y charco | Pequeños (≤3×3), solo junto a un cauce o en una cuenca baja. El charco con lluvia se decide con el paso 18 (tiempo) |
| Orilla obligatoria | Franja de 1-2 casillas (barro, arena, juncos) en todo borde de agua; nunca agua pegada a la hierba sin transición |
| Prohibido | Casillas de agua sueltas o de 1 casilla; agua dentro de bosque denso, de edificios o de una carretera (la carretera cruza el río por un puente); agua en el claro de inicio salvo el pozo |
| Cantidad ✅ | Objetivo 3-4 % del mundo (la prueba tiene 9 %); solo el agua necesaria. Unas 6 de cada 10 regiones sin agua. Por bioma: campo 0-1 %, bosque 1-2 %, pueblo 0-3 % (si lo cruza un río), lago/río 15-30 % |
| Cerca del inicio ✅ | Pozo en el claro (agua limpia) y un lago o río a 2-3 regiones del claro (≈60-100 casillas, un par de minutos andando): un poco fácil, pero hay que salir a buscarlo. En el resto del mundo, agua natural a menos de unas 4 regiones desde casi cualquier punto |
| Coste | Presupuesto 💡 ≤6 000 triángulos de agua visibles. Hoy una casilla son 32 triángulos; con lagos y ríos de forma real conviene unir las casillas interiores en piezas grandes y dejar las olas al shader (3d-1.4). Se decide con una captura, no antes |
| Determinismo | Forma del lago y punto de paso del río salen solo de `hash(semilla, rx, rz, tipo)` con `Math.imul` y `+ - * /`; sin `Math.random` ni `Math.sin` |

**Decisiones del usuario ✅ (8 nov 2026):**
- **Costas sí, mar no:** la costa es la orilla de los lagos grandes; nada de mar. Solo el agua necesaria para completar el mundo.
- **Pantano sí, pero más adelante** (agua turbia poco profunda; fuera de la v1).
- **3-4 % de agua en total**, con la regla de distancia de la tabla (la distancia manda más que el porcentaje).
- **La sed obliga a buscar agua, pero el acceso es un poco fácil:** ni trivial ni difícil.
- **El jugador puede crear su propio sistema de agua** (pasos posteriores a la construcción, ver abajo).

### Sistema de agua del jugador (intención ✅; piezas y costes 💡)
- **Pozo propio:** se cava en la base; cuesta materiales y tiempo.
- **Recogida de lluvia:** barril; depende del clima (paso 18).
- **Purificador automático ✅:** hervir con fuego se descarta por difícil. El agua de lago, río o lluvia es turbia; se echa en una pieza que el jugador construye (purificador o filtro) y sale limpia sola, sin pasos manuales. El pozo del claro ya da agua limpia.
- **Más adelante 💡:** bomba y tubería de un lago a la base.
Así la sed obliga a salir al principio y luego la base se vuelve autosuficiente (pilar del refugio, `IDENTIDAD.md`). Piezas, recetas y costes se concretan en el paso de construcción (`CONSTRUCCION.md`).

## 8. Recursos, crafteo y progreso

**Comida y agua** ✅

| Fuente | Notas |
|---|---|
| Pesca | Se mantiene el sistema actual de peces, pique y colección |
| Caza | Animales del mundo; dependen de la estación |
| Pozos | Agua fija en el mundo o construidos en la base |
| Lluvia y purificación | Recoger agua de lluvia y hacerla potable |
| Huerto | Se cultiva en la base según la estación |

**Crafteo** ✅

- **A mano, en cualquier sitio:** cosas simples (vendas, antorchas, herramientas básicas).
- **En lugares específicos:** lo complejo (armas, mejoras, comida elaborada, construcciones grandes).
- Qué estaciones existen (por ejemplo banco de trabajo, cocina, armería) y las recetas concretas ⬜.

**Recursos propuestos** 💡: madera, piedra, chatarra, tela, comida, agua, medicina, munición, combustible.

**Progreso y derrota**

- No hay victoria: el objetivo es durar ✅.
- Contador de tiempo sobrevivido (horas y minutos) y récord ✅.
- Derrota: muerte total; se borra el mundo y se empieza uno nuevo ✅.
- Misiones y objetivos: ninguno en la v1 💡.

## 9. Pantallas e interfaz

| Pantalla | Contenido | Estado |
|---|---|---|
| Inicio | Nueva partida (dificultad, 1 o 2 jugadores), continuar | ✅ |
| Semilla | Aleatoria y oculta | ✅ |
| HUD | Vida, resistencia, hambre, sed, hora y clima, arma y munición | 💡 |
| Inventario | Huecos en mano y mochila con peso | 💡 |
| Construcción | Modo para colocar y quitar piezas casilla a casilla | 💡 |
| Mapa | Minimapa existente, con lo explorado | 💡 |
| Fin de partida | Tiempo sobrevivido, récord y nueva partida | ✅ |

## 10. Arte y sonido

| Elemento | Decisión | Estado |
|---|---|---|
| Estilo | HD-2D: mundo 3D con volúmenes y texturas, luz y sombras suaves | ✅ |
| Tono | Cambia con el clima y la estación, sin tono fijo | ✅ |
| Zombis | Silueta muy legible, variantes de ropa y velocidad, mismo método de volúmenes y texturas | 💡 |
| Sonido y música | Sin sonido por ahora; se diseñará más adelante | ✅ |

> **Z0.4e (8 nov 2026): estilo decidido ✅ = diorama realista envejecido; ver `docs/ARTE.md`. Las opciones A/B/C de abajo quedan sustituidas (se conservan como historial).**

### Opciones de estilo (propuesta de dirección técnica, 8 nov 2026 · 💡; nada es ✅ hasta que lo decida el usuario)
| Opción | Qué es | A favor | En contra |
|---|---|---|---|
| A · HD-2D de verdad | Suelo y edificios con volumen y texturas pixel de paleta corta; personajes, zombis y vegetación como sprites pixel (billboards de 2 triángulos) generados por código; luz y sombras suaves, niebla | Es el estilo ya decidido (✅); la vegetación cuesta 2 triángulos (los árboles 3D eran 96); estaciones por paleta | Los sprites de personaje por código necesitan buen diseño de formas y paletas |
| B · Low-poly plano | Todo con volúmenes facetados y colores planos por bioma, sin texturas; siluetas fuertes | Muy barato y legible; todo es geometría por código | Se aleja del pixel art y de lo ya hecho (texturas del suelo) |
| C · Voxel | Todo con cubos pixel (estilo bloques) | Encaja con construir casilla a casilla | Más triángulos (hay que unir caras) y aspecto genérico |
**Recomendación: A.** Es coherente con lo ya decidido, resuelve el problema de los árboles (vegetación casi gratis) y todo se puede generar sin descargas. Para decidir, el usuario aporta **uno o dos juegos de referencia visual**; con eso se hace el paso E (una mini-escena por opción, vista en el móvil).

### Assets nuevos (prioridad y generación por código, sin descargas)
| # | Asset | Cómo se genera |
|---|---|---|
| 1 | Terreno (hierba, tierra, arena, roca, camino, asfalto) y bordes | Texturas 16×16 con hash de enteros, 3-4 variantes por tipo y transiciones por borde, en un atlas de lienzo |
| 2 | Agua, río y orilla | Geometría estática; olas y brillo en el shader (uniform de tiempo); espuma por color de vértice según distancia a la orilla |
| 3 | Peces y pesca | Sprites o mallas pequeñas bajo el agua, forma y paleta por especie desde una semilla |
| 4 | Personajes y zombi base con variantes | Muñeco por piezas (cuerpo, ropa, pelo) pintado en lienzo con 3 tonos y contorno; 4 direcciones × pocos cuadros; las variantes cambian paleta y velocidad |
| 5 | Vegetación (árboles, arbustos, hierba alta) | Sprites billboard por lote (instancias) en la capa `veg`, uno por chunk; paleta por estación |
| 6 | Edificios modulares (muros, tejados, ventanas, puertas) | Volúmenes y texturas por casilla, con la regla de 16 px |
| 7 | Objetos de base y botín (mesas, cajas, vallas) | Mismo método que 6 |
| 8 | Clima (lluvia, nieve, niebla) | Partículas puntuales y niebla en el shader |
| 9 | Armas y efectos | Sprites pequeños y destellos |
Presupuesto: sin archivos de imagen ni audio; todo dentro del HTML único.

## 11. Técnica

| Tema | Regla | Estado |
|---|---|---|
| Pantalla | Móvil vertical 390×844 como referencia | ✅ |
| Pintor | Solo HD-2D (Three.js r128 desde cdnjs). Sin WebGL, sin red o con un móvil lento el juego lo avisa en pantalla, sin caer al 2D | ✅ |
| Archivo | Un solo HTML generado con `node build.js` | ✅ |
| Determinismo | Motor puro con semilla; sin `Math.random` ni DOM en las reglas | ✅ |
| Línea | Listo para dos móviles y, más adelante, servidor que valide | ✅ |
| Rendimiento | Objetivo 30 fps estables en móvil medio; el reparto zombis/calidad se decide tras probar | ✅ |
| Guardado | Serializable y con número de versión; autoguardado continuo (la muerte borra la partida) | 💡 |
| Plegado | Solo se simula lo cercano; lo lejano se calcula al volver | ✅ |
| **Cambio grande del motor** | El motor actual trabaja con mapas fijos en JSON; pasa a mundo por chunks. Es lo primero que se construye | 💡 |

## 12. Alcance

| Versión | Contenido |
|---|---|
| **v1 (jugable)** | Mundo por chunks con lugares diseñados; día/noche, clima y estaciones; Oli y Lali; 1–2 jugadores en coop; hambre y sed; un tipo de zombi con variantes; unas 20 armas con munición y desgaste; construcción libre de base; crafteo simple y complejo; pesca, caza, pozos, lluvia y huerto; dificultad elegible con escalada; contador de tiempo y récord |
| **Después** | Vegetación viva, edificios que se derrumban, zombis que migran, sonido y música, más tipos de zombi, fabricar armas (si se decide), torretas y trampas |
| **Fuera de alcance por ahora** | Más de 2 jugadores, vehículos, diálogos largos, meta-progresión |

## 13. Plan de construcción (orden propuesto)

El orden va de lo que más riesgo técnico tiene a lo que más depende de lo anterior. El arte 3D de cada paso se hace dentro del propio paso. Cada ZIP es un punto de control (cp) con `build.js` y `test.js` en orden.

| Paso | Qué se construye | Estado |
|---|---|---|
| 3 | Mundo: chunks por semilla, carga y descarga, lugares diseñados, cámara y guardado versionado (dividido en seis ZIPs, 3a a 3f: ver `ROADMAP.md`) | 💡 |
| 4 | Ciclo día/noche, clima y estaciones (luz, niebla y aspecto) | 💡 |
| 5 | Personaje y controles de móvil, inventario en mano y mochila | 💡 |
| 6 | Zombis (tipo base, variantes, percepción) y combate cuerpo a cuerpo con vida | 💡 |
| 7 | Armas de fuego y a distancia, munición y desgaste, por tandas hasta las 20 | 💡 |
| 8 | Supervivencia: hambre, sed, comida y agua (pesca, caza, pozos, lluvia, huerto) | 💡 |
| 9 | Base: construcción libre, crafteo simple y complejo | 💡 |
| 10 | Dificultad y escalada, menús, contador y récord, coop de 2 móviles | 💡 |
| 11 | Pulido y pruebas en móvil | 💡 |

## 14. Riesgos

| Riesgo | Mitigación |
|---|---|
| Pasar de mapas fijos a mundo por chunks | Hacerlo primero (paso 3) y probarlo en móvil antes de añadir nada más |
| «Cambia todo» es un alcance enorme | Capas: solo tiempo, clima y estaciones en la v1; el resto después |
| Demasiados zombis en un móvil | Límite duro, simulación por cercanía, instancias en el pintor; decidir tras probar |
| Apuntar a mano es incómodo en móvil | Auto-apuntado en cuerpo a cuerpo y control específico para armas de fuego |
| 20 armas es mucho arte y equilibrio | Cifras en datos, no en código; construirlas por tandas |
| Guardar un mundo que cambia | Guardar solo las diferencias respecto a la semilla |

## 15. Pendientes abiertos

Ninguno bloquea el paso 3.

1. ⬜ Cómo aparecen y se comportan los zombis de forma realista (§5).
2. ⬜ Niveles de dificultad y qué se endurece con el tiempo (§5).
3. ⬜ Si el jugador podrá fabricar armas (§6).
4. ⬜ Cifras: huecos, kilos, hambre y sed, armas, duración de día y estación (§4, §6, §7).
5. ⬜ Estaciones de crafteo y recetas concretas (§8).
6. ⬜ Control concreto para apuntar a mano (§3).

## Registro de cambios

| Fecha | Versión | Cambio |
|---|---|---|
| 8 nov 2026 | 0.1 | Primer borrador con propuestas |
| 8 nov 2026 | 0.2 | Cambio a sandbox de mundo abierto sin final; decisiones del usuario pasadas a ✅; añadidos mundo por chunks, mundo que cambia, hambre y sed, 20 armas, construcción libre y nuevo plan de construcción |
| 8 nov 2026 | 0.2.1 | §13: el paso 3 se divide en seis ZIPs (3a-3f), empezando por una prueba de rendimiento en móvil. Solo en la copia del proyecto |
| 8 nov 2026 | 0.2.2 | Decisión del usuario: solo HD-2D; se quita la vista 2D (§0 y §11). Sin respaldo 2D, si falla WebGL, no carga Three.js o va lento el juego avisa en pantalla. Solo en la copia del proyecto |
| 8 nov 2026 | 0.2.3 | Medido en el móvil: tirones por repintar el mapa entero 4 veces por segundo y dibujar siempre todo. Plan de rendimiento por chunks de dibujo de 16×16, recorte, repintado escalonado y streaming (3d-1 y 3d-2); las zonas con puerta pasan a 3e. Solo en la copia |
- 0.2.4 (8 nov 2026): §7b estructura del mundo, §10 opciones de estilo y assets (todo 💡), tras el plan de rendimiento oficial de `docs/ROADMAP.md`.
- 0.2.5 (8 nov 2026): `docs/IDENTIDAD.md` pasa a mandar sobre visión, tono, pilares (refugio y compañeros) e inicio; ROADMAP reordenado.
- 0.2.6 (8 nov 2026): revisión Z0.4a-bis: zonas = peligro por distancia, biomas = paisaje (§7b); guardado a IndexedDB antes de la construcción.
- 0.2.7 (8 nov 2026): `docs/MUNDO.md` (Z0.4b) manda sobre el contenido del mundo; todo 💡 hasta que el usuario lo confirme.
- 0.2.8 (8 nov 2026): `MUNDO.md` §2 amplía a 20 interiores + 20 abiertos por olas; guardado v2 guarda `lugar` por región.
- 0.2.9 (8 nov 2026): `docs/CONSTRUCCION.md` (Z0.4c) manda sobre recursos, piezas, construcción e inicio; todo 💡. Dirección artística nueva ✅ como intención.
- 0.2.10 (8 nov 2026): estilo decidido ✅ (diorama realista envejecido, `docs/ARTE.md`); pantallas y primera sesión en `docs/PANTALLAS.md`; portada y logo A en `docs/PORTADA.md`; nombre Endless Aftermath ✅ (`IDENTIDAD.md` §0). Las opciones de estilo A/B/C de §10 quedan sustituidas.
- 0.2.11 (8 nov 2026): §7c agua realista (intención ✅ del usuario; reglas y cantidades 💡): lagos y ríos con causa y orilla, nada de agua suelta; solo documentos, Z0.4d-10.
- 0.2.12 (8 nov 2026): §7c agua cerrada por el usuario ✅: costas sí y mar no, pantano más adelante, 3-4 % de agua con regla de distancia, sistema de agua propio con purificador automático (sin hervir); solo documentos, Z0.4d-11.
