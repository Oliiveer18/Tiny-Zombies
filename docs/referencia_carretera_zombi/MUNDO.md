> ⚠️ Documento de otro proyecto. Menciona a Oli y Lali: en ESTE juego NO existen; ignorar esas menciones. Manda `../DISENO.md`.

# MUNDO · qué hay y dónde (Z0.4b, 8 nov 2026)

Estados: ✅ decidido por el usuario · 💡 propuesto por dirección técnica (el usuario lo corrige; nada pasa a ✅ sin que lo diga). Visión y pilares: `IDENTIDAD.md`. Estructura técnica (chunks, regiones, guardado): `DISENO.md` §7b.

## 1. Estructura 💡
- **Mundo ilimitado por semilla** ✅ (elegido por el usuario), con el claro de inicio en el origen (0,0) 💡. Coste constante: solo existe lo cercano.
- **Región 32×32** casillas = unidad de generación y guardado. El claro de inicio ocupa 2×2 regiones (64×64).
- **Zonas = niveles de peligro por distancia al claro** (en regiones, medida Chebyshev): Z1 claro (0-1) · Z2 campo (2-4) · Z3 pueblo y puerto (5-10) · Z4 carretera y ruinas (11-20) · Z5 zona muerta (>20). Distancias provisionales: se ajustan midiendo cuánto tarda el personaje en recorrerlas.
- **Paisaje por bioma** (semilla): campo, bosque, costa y lago, río, pueblo, carretera. Cada zona tiene un paisaje típico por pesos, no fijo. El bosque emite vegetación como datos (el aspecto depende del estilo, paso E).
- **Agua y peces** ✅ se conservan: lagos, río y costa en cualquier zona; el pozo del claro es agua mínima.

## 2. Lugares diseñados a mano
Objetivo del usuario ✅: unos **20 lugares con interior y puerta** y unos **20 de espacio abierto**, construidos por **olas** (se decide toda la lista ahora; se hacen por tandas). La lista y las olas son 💡 hasta que el usuario las corrija.
Plantillas de hasta 32×32 (caben en una región), hechas con el editor de mapas, colocadas por semilla y bioma, como mucho una por región. Interior = instancia aparte con puerta (paso 3e). Tamaños, botín y NPC son provisionales.

**CHECKPOINT (8 nov 2026):** todo este documento es PROVISIONAL y se editará. La ola 1 de interiores (filas 1-7) fue revisada con el usuario («no está mal»); queda pendiente decidir si el bunker (zona 5, muy lejos del inicio) se cambia por la farmacia en la ola 1. Las olas 2 y 3 y las listas de espacio abierto aún no se han revisado con el usuario.

### 2.1 Con interior y puerta (20)
| # | Lugar | Ola | Zona | Ext. | Botín | NPC |
|---|---|---|---|---|---|---|
| 1 | Casa abandonada | 1 | 2-4 | 12×12 | Ropa, enlatados, herramientas básicas | Escondido |
| 2 | Tienda de comestibles | 1 | 3-4 | 14×14 | Comida, agua, higiene | Atrincherado |
| 3 | Ferretería | 1 | 3-4 | 14×14 | Clavos, herramientas, materiales | Constructor |
| 4 | Clínica | 1 | 4 | 18×18 | Medicinas, vendas | Médico |
| 5 | Comisaría | 1 | 4 | 18×18 | Armas ligeras, chalecos | Soldado/policía |
| 6 | Iglesia | 1 | 3-4 | 18×18 | Mantas, velas, refugio | Grupo pequeño |
| 7 | Bunker | 1 | 5 | 20×20 | Mejor botín | Último superviviente |
| 8 | Farmacia | 2 | 3-4 | 12×12 | Medicinas, antibióticos | Boticario |
| 9 | Restaurante | 2 | 3 | 16×16 | Comida, utensilios, cocina | Cocinero |
| 10 | Escuela | 2 | 3-4 | 22×22 | Material, mantas, literas | Maestra/o con niños |
| 11 | Bloque de pisos | 2 | 3-4 | 20×20 | Botín repartido por pisos | Varios vecinos |
| 12 | Almacén | 2 | 3-4 | 26×26 | Materiales a granel | Vigilante |
| 13 | Taller mecánico | 2 | 3-4 | 16×16 | Piezas, metal, baterías | Mecánico |
| 14 | Posada | 2 | 2-3 | 18×18 | Camas, comida, mapas | Posadero |
| 15 | Biblioteca | 3 | 3-4 | 18×18 | Libros, planos, mapas | Estudioso |
| 16 | Armería | 3 | 4-5 | 14×14 | Armas, munición | Soldado |
| 17 | Cuartel | 3 | 4-5 | 28×28 | Equipo militar | Soldado herido |
| 18 | Faro | 3 | 3-4 | 10×10 | Vista, señales, radio | Vigía |
| 19 | Sótano o metro | 3 | 4-5 | 24×24 | Botín raro, mucho peligro | Superviviente aislado |
| 20 | Barco varado | 3 | 3 | 20×20 | Pesca, motor, cuerdas | Pescador |

### 2.2 De espacio abierto (20)
| # | Lugar | Ola | Zona | Tamaño | Botín | NPC |
|---|---|---|---|---|---|---|
| 1 | Granja con huerto | 1 | 2-3 | 24×24 | Semillas, comida, madera | Granjero |
| 2 | Cobertizo y granero | 1 | 2-3 | 10×10 | Herramientas, cuerda | — |
| 3 | Gasolinera | 1 | 3-4 | 16×16 | Combustible, chatarra | Mecánico |
| 4 | Puerto con almacén | 1 | 3 | 28×28 | Pesca, redes, motores | Pescador |
| 5 | Desguace y taller | 1 | 4 | 24×24 | Metal, piezas | Mecánico |
| 6 | Campamento militar abandonado | 1 | 4-5 | 30×30 | Armas, equipo | Soldado malherido |
| 7 | Refugio de otros supervivientes | 1 | 3-5 | 20×20 | Intercambio | Amistosos u hostiles |
| 8 | Cantera | 2 | 2-4 | 28×28 | Piedra, explosivos viejos | — |
| 9 | Cementerio | 2 | 3 | 20×20 | Poco botín, mucho peligro | — |
| 10 | Puente y control de carretera | 2 | 3-4 | 24×16 | Vehículos, armas ligeras | Soldado |
| 11 | Mercado al aire libre | 2 | 3 | 24×24 | Comida, trueque | Comerciante |
| 12 | Camión volcado | 2 | 2-4 | 12×12 | Mercancía aleatoria | Conductor |
| 13 | Plaza y parque | 2 | 3 | 24×24 | Poco; punto de reunión | Grupo |
| 14 | Establo y corrales | 2 | 2-3 | 20×20 | Animales, forraje | Granjero |
| 15 | Central eléctrica pequeña | 3 | 4-5 | 28×28 | Cables, metal, generadores | Técnico |
| 16 | Aeródromo abandonado | 3 | 4-5 | 32×32 | Combustible, piezas, radio | Piloto |
| 17 | Torre de vigilancia | 3 | 3-5 | 8×8 | Vista, radio | Vigía |
| 18 | Campo de refugiados | 3 | 3-4 | 30×30 | Mucha gente, poco botín | Muchos NPC |
| 19 | Depósito de agua | 3 | 3-4 | 14×14 | Agua potable | — |
| 20 | Invernadero | 3 | 2-3 | 16×16 | Semillas, comida | Cultivador |

### 2.3 Cómo se construye por olas (regla técnica)
- El generador usa un **catálogo con huecos**: cada región tira (por semilla) el tipo de lugar que le toca. Si su plantilla aún no existe, esa región queda como terreno o ruina vacía. Cuando llega la plantilla, se rellena sin tocar el generador.
- **Una región ya visitada no cambia nunca:** al generarla por primera vez se guarda qué lugar tiene (campo `lugar` en el guardado v2, `DISENO.md` §7b). Los lugares nuevos solo aparecen en regiones sin visitar, así que añadir contenido no estropea tu partida.
- Orden de trabajo: ola 1 (7 interiores + 7 abiertos) → ola 2 → ola 3, cada lugar en una sesión corta con el editor de mapas.

### 2.4 Variantes de cada lugar (intención del usuario ✅; reparto 💡)
El usuario quiere diversidad: no todos los lugares de un tipo son iguales. Un lugar pasa a ser un **tipo con varias variantes** (cada variante = un plano distinto con su id, por ejemplo `casa_pequena`, `casa_2pisos`, `casa_sotano`).
- **Casas:** pequeña de una planta, con doble piso, con subterráneo, grande. **Supermercados:** tienda de barrio, mediano, grande. **Ferretería, clínica, comisaría, bunker:** 2-3 variantes cada una (tamaño y distribución). **Iglesia:** casi iguales; cambia el estilo.
- **Plantas y subterráneos:** cada planta es un interior enlazado por escaleras (instancia aparte); el sótano es otra más. Hay que diseñarlo en la fase de zonas con puerta (3e).
- **NPC:** cada variante define cuántos puede haber (0 a varios) y de qué tipos (tabla por pesos); varios NPC juntos pueden ser un grupo. Más NPC = más peligro y mejor botín.
- **Cómo no multiplicar el trabajo (💡):** tres capas. (1) Planos hechos a mano solo para las variantes que cambian de verdad el juego (unas 2-3 por tipo principal). (2) Variación automática por semilla: giro y espejo, mobiliario y botín distintos, estado (intacto, saqueado, ruina). (3) Cambio de estilo (paleta y texturas) sin tocar el plano, que se decide en el paso E.
- **MÉTODO DECIDIDO ✅ (propuesta del usuario, afinada por dirección técnica):** primero un **prototipo a mano de cada tipo**; cuando funciona y el usuario lo da por bueno, se hacen las variantes partiendo de él (copia del plano con cambios + variación automática). Para validar la tubería (entrar, salir, guardado, botín, NPC), el primer prototipo es **la casa abandonada**, completa de punta a punta, antes de empezar los otros seis.
- **Por olas:** la ola 1 hace UNA variante por tipo (los 7 de la tabla); las variantes extra entran en olas siguientes. Cuenta orientativa de planos a mano: casas 4, supermercados 3, ferretería 2, clínica 2, comisaría 2, iglesia 1, bunker 3 = unos 17 planos para los 7 tipos de la ola 1, repartidos en varias olas.

## 3. Elementos sueltos que genera el mundo 💡
Vallas y muros caídos, coches abandonados, escombros, cultivos silvestres, árboles muertos, carteles, hogueras apagadas, barricadas, puentes. Caminos y carreteras unen los lugares (paso 3f). Son datos en capas (`obj`, `veg`), no mallas fijas.

## 3b. Vehículos
Decidido ✅: habrá **vehículos conducibles** (coches y otros). Propuesta 💡:
- **Tipos:** bicicleta, moto, coche, camioneta y barca (para lagos y río, que enlaza con el agua y la pesca). Más adelante, otros.
- **Cómo se consiguen:** abandonados en el mundo (carreteras, gasolinera, desguace, camión volcado, puerto), normalmente averiados; hay que repararlos con piezas y llenarlos de combustible. Nunca están listos al principio.
- **Qué los hace interesantes:** velocidad para explorar un mundo ilimitado, maletero como inventario, llevar pasajeros (NPC o el segundo jugador en coop), pero el ruido atrae zombis y el combustible es finito.
- **Dónde importan:** carreteras y caminos (paso 3f); los coches necesitan pistas despejadas y los zombis o escombros los frenan.
- **Impacto técnico (hay que respetarlo desde ya):** al ir más rápido, el streaming de chunks necesita radio de carga mayor y cola con prioridad por dirección (paso 3d-2); cada vehículo es una entidad con id, guardada en la región donde está; en coop se sincroniza como un jugador más; el presupuesto de fps se mide también conduciendo.

## 3c. Animales
Decidido ✅: habrá **animales salvajes y de granja** (además de zombis y peces). Propuesta 💡:
- **De granja** (granjas, establos, corrales): gallinas (huevos), vacas (leche), cerdos y ovejas (carne, lana). Se pueden llevar al refugio y criar en un corral (otra pieza de construcción). Algunos huyen o se pierden si no se cuidan.
- **Salvajes:** conejos, ciervos, aves y jabalíes para cazar; **perros asilvestrados y lobos** como peligro (atacan en manada y se acercan al ruido). Un perro se puede domesticar y ser compañero de defensa.
- **Dónde:** campo y bosque (caza), granjas y establos (granja), cerca de lagos y costa (aves). Más densidad lejos del claro.
- **Impacto técnico:** cada animal es una entidad con id guardada por región; solo se simulan en los chunks cargados, y lo lejano se resuelve con una cuenta sencilla al volver (por la marca `ult`); presupuesto de entidades por chunk, a medir en el móvil. El aspecto se decide en el paso de estilo E.

## 4. Recursos y construcción 💡
Todo lo que el mundo ofrece alimenta el refugio:
| Recurso | De dónde | Para qué |
|---|---|---|
| Madera | Campo, bosque, granjas | Paredes y suelos básicos (débiles) |
| Piedra | Rocas, canteras | Muros y cimientos (resistentes) |
| Metal y chatarra | Desguace, gasolinera, coches | Puertas, refuerzos, trampas, reparar vehículos |
| Combustible | Gasolinera, coches, depósitos | Vehículos y generadores |
| Herramientas y clavos | Ferretería, cobertizos | Construir y reparar más rápido |
| Agua | Pozo, río, lago | Beber y cultivar |
| Comida | Huerto, tiendas, pesca, caza, corral | Mantener a jugadores y NPC |
| Medicinas | Clínica | Curar a NPC y jugadores |
| Armas y munición | Comisaría, campamento, bunker | Defensa (tú y tus compañeros) |
**Reposición del botín** (💡 propuesta mía; el usuario delegó la decisión): el botín de edificios y lugares **no se repone**: cada lugar se saquea una vez (realismo; empuja a explorar y a ampliar la base). Como el mundo es ilimitado siempre hay lugares nuevos. Lo **renovable** sí vuelve: cultivos y huerto, pesca, caza y animales de corral, agua del pozo y del río, y las zonas se «repueblan» de zombis con el tiempo. Ventaja técnica: no hace falta llevar temporizadores por lugar; basta el cambio ya guardado en la región.

## 5. NPC por zona 💡
Z2: perdidos y escondidos, pocos y débiles. Z3: supervivientes atrincherados y grupos pequeños. Z4: NPC con rol útil (médico, soldado, mecánico) pero muy rodeados de zombis. Z5: pocos y poderosos. Los roles y el bucle de rescate están en `IDENTIDAD.md` §5.

## 6. Qué pasa con la plantilla anterior
Revisado SOLO por nombre de archivo (falta revisión de contenido):
- **Se descarta** (se archiva al reemplazarlo, no se borra): `maps/pueblo_inicial.json`, `src/albanota_objetos.js`, `src/interiores_objetos.js`, `src/arboles.js`, `src/arboles3d.js`.
- **Se conserva** (ideas ✅ del juego anterior): `agua3d.js`, `rio3d.js`, `peces.js`, `pesca3d.js`, `peces_ui.js`; Oli y Lali (`personaje3d.js`, `chars.js`); la base técnica (`chunks.js`, `hd2d_pintor.js`, `motor.js`, `red*.js`, `guardado.js`, `minimapa.js`, `volumenes*.js`).
- **A revisar** al llegar a la zona de inicio: `mapas*.js`, `capas.js`, `sombreado.js`, `luz_farolas.js`, `particulas*.js`, `rampas.js`, `vista.js`, `game.js`.
- `maps/ventana64.json` y `ventana96.json` son mapas de prueba de rendimiento: se mantienen hasta que exista el generador.

## 7. Decisiones que quedan para el usuario
Corregir las listas de §2 y sus olas · tamaños y botín · lista concreta de animales (vehículos y animales ya ✅) · cuánto se repone el botín · distancias de las zonas (se ajustan al medir).
