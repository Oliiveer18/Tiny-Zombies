# 007 · Mapa de prueba v1: Calle → Reja → Campamento con NPC → Patio de zombis

Origen de cada dato: **[C]** leído en el código o los datos · **[005] [006] [004]** respuestas anteriores · **[R]** razonamiento propio · 💡 cifra de partida, con barra `?debug` · ⚠️ sin verificar.
Velocidades: se dan como **múltiplos de la velocidad de andar del jugador** (`V`), porque esa cifra aún se está ajustando [C: `MOVE`].

## 1. Recorte inteligente (v1)
| Cosa | v1 | Razón y sustituto |
|---|---|---|
| Mapa de 3 zonas como datos | ENTRA | Es el patrón que se reutilizará como lugar (DISENO §3) |
| Reja con candado, rompible y abrible | ENTRA | Es el centro de la escena; usa la física y la rotura que ya existen |
| Ruido con radios y zombis dormidos/despiertos | ENTRA | Es lo que convierte el mapa en una situación y no en un tiro al blanco |
| NPC hostil sencillo (puesto, cobertura, ráfagas) | ENTRA | Sin él no hay «los matas». IA de 4 estados, sin rutas: se mueve entre puntos escritos en el mapa |
| NPC neutral desarmado (se asusta, da las gracias) | ENTRA | Enseña a no disparar a todo; no necesita IA de combate |
| Suelo con materiales y calcos | ENTRA | Se hace por código (norma 5); es lo que más cambia el aspecto sin Meshy |
| Sonido | ENTRA sintetizado | Sin archivos (§9); se cambia por grabaciones sin tocar el resto |
| Botín | ENTRA mínimo | Solo «recoger» botiquín y granada; el inventario es A6a |
| Modelos de Meshy | FUERA de la v1 jugable | Todo con relleno teñido; los NPC usan el cuerpo actual del soldado con un aro de color. El hito no se entrega con relleno (norma 5) |
| Reclutar aliado (C9 de la 005) | FUERA | Es IA de acompañante: paso B4. Aquí no hace falta para el patrón |
| Árbol de diálogo | FUERA | Una sola línea por NPC. El formato de la 005 §6 queda para B3 |
| Animaciones nuevas | DESPUÉS del arma | Sin arma en las manos cualquier pose de rifle se ve rara (§7) |
| Guardado, online, munición limitada | FUERA | A4, F y A5. Todo el estado nuevo ya nace serializable con id |
| Muerte total | FUERA en prueba | En el mapa de prueba se reaparece en la calle (decisión 3) |

## 2. El mapa como datos: `src/data/lugares/calle_reja_01.json`
Mismo formato que `callejon_01.json` [C] + cuatro listas nuevas (`puertas`, `coberturas`, `disparadores`, `calcos`) y `suelos`. Ejes [C]: x derecha, z hacia abajo en pantalla. Caja total 62 × 48 m: cabe en una región de 64.

- **Calle** (x −30…30, z −5…5): calzada de 6 m y dos aceras de 2 m. El jugador nace en (−24, 0). Dos zombis sueltos al este para calentar.
- **Callejón-campamento** (x −3…3, z −25…−7): boca en la fachada norte; **reja a z −7**. Dentro, 3 hostiles con cobertura y 2 neutrales al fondo.
- **Quiebro** a z −25: un muro con paso solo por la derecha. Corta la vista y **reduce el ruido** (§4), para que el tiroteo no despierte el patio.
- **Patio** (x −9…9, z −41…−27): 10 zombis dormidos, casi a oscuras. Salida propia al noreste.

```json
{"id":"calle_reja_01","tipo":"abierto","version":1,"caja":[-31,-42,31,6],
 "apariciones":{"jugador":[-24,0],"reaparicion":[-24,0]},
 "muros":[[-30,5,30,5],[-30,-5,-3,-5],[3,-5,30,-5],[-30,-5,-30,5],[30,-5,30,5],
          [-3,-5,-3,-27],[3,-5,3,-27],[-3,-7,-2,-7],[2,-7,3,-7],[-3,-25,0,-25],
          [-9,-27,-3,-27],[3,-27,9,-27],[-9,-27,-9,-41],[9,-27,9,-41],[-9,-41,5,-41]],
 "zonas":[{"id":"calle","rect":[-30,-5,30,5]},{"id":"campamento","rect":[-3,-25,3,-7]},{"id":"patio","rect":[-9,-41,9,-27]}],
 "suelos":[{"mat":"asfalto","rect":[-30,-3,30,3]},{"mat":"acera","rect":[-30,-5,30,-3]},{"mat":"acera","rect":[-30,3,30,5]},
           {"mat":"adoquin","rect":[-3,-27,3,-5]},{"mat":"hormigon","rect":[-9,-41,9,-27]},{"mat":"metal","rect":[-1,-9,1,-7]}],
 "puertas":[{"id":"reja_i","clase":"reja_hoja","pivote":[-1.5,-7],"largo":1.5,"cerrada":0,"abierta":-1.75,"candado":"cand1"},
            {"id":"reja_d","clase":"reja_hoja","pivote":[1.5,-7],"largo":1.5,"cerrada":3.14,"abierta":4.89,"candado":"cand1"}],
 "props":[["candado",0,-7,0],
   ["car",-12,2.2,0.05],["car",14,-2.3,3.2],["contenedor",5.2,-4,0],["papelera",-5,-4.4,0],["papelera",18,4.4,0],
   ["carton",-4.2,-4.3,0.4],["carton",6.8,-4.2,1],["barrier",27,-1.5,1.57],["barrier",27,1.5,1.57],["sack",-20,4.2,0],
   ["barrier",-1.5,-11.5,0],["barrier",1.6,-15,0],["crate",-2.3,-10,0.2],["crate",2.3,-13,0],["barrel",0,-17,0],
   ["sack",-2.3,-19,0],["sack",2.3,-20.5,0.3],["bidon",2.4,-17.5,0],["crate",-2.2,-23,0.3],["carton",1.8,-23.5,0.5],
   ["car",-5.5,-33,0.6],["contenedor",6.5,-29,1.57],["bidon",-7,-39,0],["bidon",-6,-39.6,0],["barrel",4,-36,0],
   ["barrel",5,-37,0],["fence",0,-31,0],["fence",-1.7,-31,0],["crate",7.5,-34,0],["crate",-7.5,-29,0.4],["papelera",2,-39.5,0]],
 "coberturas":[[-1.5,-12.4],[1.6,-15.9],[-2.3,-10.9],[2.3,-13.9],[0,-18]],
 "npc":[["hostil",-1.5,-12.4,null,"g1"],["hostil",1.6,-15.9,null,"g1"],["hostil",0,-21,null,"g1"],
        ["neutral",-2.2,-23.8,"gracias_1","g2"],["neutral",2.2,-22,"gracias_2","g2"]],
 "zombies":[["normal",20,1],["normal",24,-2],
   ["normal",-4,-30],["normal",-2,-34],["normal",1,-33],["normal",3,-37],["normal",-6,-36],["normal",6,-39],
   ["normal",0,-39],["normal",-3,-38],["runner",5,-32],["tank",-1,-36]],
 "luces":[{"id":"l1","tipo":"farola","x":-3.7,"z":-4.3,"color":"#ffb060","radio":9,"dinamica":true},
          {"id":"l2","tipo":"hoguera","x":0,"z":-17,"color":"#ff8a3a","radio":7,"dinamica":true},
          {"id":"l3","tipo":"charco_luz","x":12,"z":4.3,"color":"#ffb060","radio":5,"dinamica":false},
          {"id":"l4","tipo":"charco_luz","x":-18,"z":-4.3,"color":"#9fc0ff","radio":4,"dinamica":false},
          {"id":"l5","tipo":"charco_luz","x":7,"z":-40,"color":"#ff4030","radio":3,"dinamica":false}],
 "calcos":[["paso_cebra",-8,0,1.57,3],["linea",-20,0,0,2],["linea",4,0,0,2],["linea",20,0,0,2],["alcantarilla",-15,-1.5,0,1],
           ["sumidero",0,-4.6,0,1],["grieta_a",9,1,0.7,2.5],["grieta_b",-2,-14,0.2,2],["aceite",13,-1.5,0,2],["aceite",-5,-34,1,2.5],
           ["charco",-1,-9.5,0,2.2],["charco",1.5,-20,0.6,1.6],["charco",-3,-31,0,3],["neumatico",11,2,0.1,3],["parche",-25,1,0,3]],
 "disparadores":[ (ver §4) ],
 "ambiente":{"hora":"atardecer"},"salidas":[[-30,0],[30,0],[7,-41]]}
```
**Avisos para Sonnet** [C: `alley.js`]: cada muro se dibuja 1 m más largo y 1 m de grueso, así que un hueco «de 3 m» en los datos queda en ≈ 2 m reales; los huecos de arriba ya lo tienen en cuenta (quiebro: x 0…3; salida del patio: x 5…9). La tercera luz dinámica queda libre para fogonazo y explosión [005].

**Presupuesto con modelos finales** [R, cifras de 003/006]: el mapa entero suma ≈ 49 000 triángulos (32 objetos 6 400 + 3 coches 3 600 + jugador 7 300 + 5 NPC 18 000 + 12 zombis 9 600 + reja, muros y suelo 1 500 + marcas y trozos 900), pero nunca se ve entero. Dos reglas obligatorias para cumplir los 40 000:
1. **Objetos por zona:** una malla instanciada por tipo Y por zona, con su esfera de recorte calculada (hoy `frustumCulled=false` dibuja siempre todas [C]).
2. **Personajes lejanos apagados:** NPC y zombis a más de 26 m 💡 del jugador: `visible=false` y sin avanzar animación.
Con ellas, la peor vista es el campamento: jugador 7 300 + 5 NPC 18 000 + 12 objetos 2 400 + reja y entorno 1 500 ≈ **29 000**; el patio ≈ 20 000. NPC y zombis no coinciden en pantalla gracias al quiebro.

## 3. La reja
Dos hojas de 1,5 m con bisagra en los pilares y un **candado** en el centro. Las rejas son barrotes: **dejan pasar balas y vista** (decisión 1), así el jugador ve el campamento antes de entrar y los hostiles le ven a él.
```json
"reja_hoja":{"mat":"metal","forma":"caja","hx":0.75,"hz":0.05,"masa":60,"vida":40,"pasa":true,"bisagra":true,
             "rompe":{"n":6,"tipo":"barrote"},"ruido_rotura":14,"sonido":"rej_rotura"},
"candado":  {"mat":"metal","forma":"circulo","r":0.15,"masa":1,"vida":3,"fijo":true,"rompe":{"n":2,"tipo":"esquirla"},"ruido_rotura":10}
```
| Forma de pasar | Qué pasa | Ruido 💡 |
|---|---|---|
| Disparar al candado (3 balas) | Salta en 2 trozos; las hojas quedan sueltas y se abren con el siguiente impulso (bala, empujón al caminar, explosión) | disparo 30 m + candado 10 m |
| Acción `use` con candado puesto: «Forzar» | Aro de 4 s; se cancela al moverse | chirrido 8 m |
| Acción `use` con candado roto: «Abrir» | Las hojas giran solas en 0,8 s | chirrido 6 m |
| Granada o bidón a < 3 m | Hojas rotas en barrotes (trozos de `debris.js`) | explosión 60 m |
| Ráfaga a las hojas | Cada bala que atraviesa quita 1 de 40: se puede, pero es caro | — |

**Bisagra simple (un solo grado de libertad)** [R]: la hoja no es un cuerpo libre; guarda ángulo `a` y velocidad `w`. Cada impulso `J` aplicado a distancia `d` del pivote suma `w += J·d / I`, con `I = masa·largo²/3`. Cada paso: `a += w·dt`, rozamiento `w *= 0,96`, tope entre `cerrada` y `abierta` con rebote 0,2. Con candado puesto, `w = 0`. Su caja de colisión se recalcula desde pivote y ángulo y los demás cuerpos la tratan como muro. Estado serializable: `{id, a, w, vida, candado}`.

## 4. Disparadores y estados
**Ruido (la base de todo).** Lista de eventos en la simulación: `{x, z, r, tick, quien}`. Radios 💡 [005 + nuevos]: disparo 30 · explosión 60 · reja rota 14 · candado 10 · caja rota 8 · forzar 8 · abrir 6 · correr 6 · andar 3 · agachado 0. **Cada muro entre el origen y el que oye divide el radio por 2** (máximo 2 muros; prueba de segmento contra `muros`, no contra objetos). Comprobación: del centro del campamento (z −13) al zombi más cercano del patio (z −30) hay 17 m y un muro → un disparo llega a 15 m: **no** lo despierta; una explosión (30 m) **sí**.

**Disparadores** (datos; cada uno se dispara una vez; su estado es un bit `hecho`):
```json
[{"id":"d1","cuando":{"t":"zona","zona":"campamento"},"hacer":[{"t":"estado","grupo":"g1","a":"alerta"}]},
 {"id":"d2","cuando":{"t":"roto","obj":"cand1"},"hacer":[{"t":"estado","grupo":"g1","a":"alerta"},{"t":"mensaje","txt":"Te han oído"}]},
 {"id":"d3","cuando":{"t":"grupo_muerto","grupo":"g1"},"hacer":[{"t":"estado","grupo":"g2","a":"agradecido"},{"t":"mensaje","txt":"Zona despejada"}]},
 {"id":"d4","cuando":{"t":"zona","zona":"patio"},"hacer":[{"t":"mensaje","txt":"Silencio..."}]}]
```
Solo 4 condiciones (`zona`, `roto`, `abierta`, `grupo_muerto`) y 4 acciones (`estado`, `mensaje`, `despertar`, `soltar`). Lo demás lo hace la percepción.

**Percepción** (5 veces por segundo, repartida por id): vista = cono + distancia + sin muro ni objeto que pare balas en medio (el mismo rayo del disparo [C]).

| Quién | Estados | Cifras 💡 |
|---|---|---|
| **Hostil** | `guardia` → (oye ruido o disparador) `alerta`: se gira al ruido y avisa a su grupo → (ve al jugador) `combate` → (lo pierde 4 s) `busca`: va al último punto visto, 6 s → `guardia` · `muerto` | Vida 4 · cono 110° · vista 14 m (7 m si el jugador está agachado y fuera de un charco de luz) · reacción 0,8 s antes del primer tiro · ráfagas de 3 cada 1,6 s · dispersión ±0,08 rad · daño 6 por bala · alcance 18 m · se mueve a 0,9 V hasta la `cobertura` libre más cercana (≤ 6 m) y dispara desde ahí |
| **Neutral** | `quieto` → (disparo a < 15 m) `asustado`: se agacha en el sitio → (disparador d3) `agradecido`: con `use` dice su línea y suelta un botiquín → `quieto`. Si el jugador le hiere: `huye` a la salida más cercana a 1,2 V | Vida 3 · desarmado · nunca hostil |
| **Zombi** | `dormido` (sin IA: coste 0) → `despertando` (0,6-1,2 s según `hash(semilla, id)`) → `persigue` (lo de Tiny [C]) → (sin verte ni oír nada 8 s) `deambula` en 4 m alrededor del último punto | Despierta si: le llega un ruido · te ve a < 5 m (3 agachado, 8 corriendo) · un vecino a < 4 m lleva 0,5 s despierto (cadena). Velocidad de prueba, en la proporción de Tiny [C: 2,3/4,3/1,6 contra 4,2]: normal 0,55 V · corredor 1,0 V · tanque 0,4 V |

Estado de cada uno: `{id, tipo, grupo, estado, t, x, z, giro, vida, obj:[x,z]}`. Diálogos: `{"gracias_1":"Gracias. Toma, lo necesitarás ahí dentro.","gracias_2":"No entres al patio haciendo ruido."}`.
**Balas enemigas:** mismo rayo que el jugador; las paran muros y objetos sin `pasa`. El jugador agachado pegado (< 1 m) a una barrera, caja o coche queda cubierto de lo que venga del otro lado (regla de cobertura de la 004).

## 5. Suelo y ambiente (por código)
**Montaje** [R]: nada de un sombreador de mezcla general. Cada rectángulo de `suelos` es un plano con su material: en una calle los bordes entre materiales son duros de verdad (bordillo). La suavidad la ponen los calcos. Coste: 6 planos = 6 llamadas, 12 triángulos.

`src/data/suelos.json` (texturas pintadas en un lienzo al cargar, con `mulberry(semilla)`, nunca `Math.random`):
| Material | Textura (color + normales) | Un mosaico cubre | Rugosidad | Qué se pinta |
|---|---|---|---|---|
| asfalto | 512 | 4 m | 0,9 | grano fino, piedrecitas claras, parches más oscuros |
| acera | 256 | 2 m | 0,85 | losas de 0,5 m con junta oscura, 1 de cada 8 más clara |
| adoquín | 512 | 4 m | 0,75 | adoquines de 0,2 × 0,12 m a tresbolillo, juntas hundidas |
| hormigón | 256 | 4 m | 0,8 | liso con juntas cada 2 m y manchas |
| metal (chapa) | 256 | 2 m | 0,45 | rombos antideslizantes, óxido en los bordes |

- **Densidad** [R]: la pantalla enseña ≈ 100 píxeles por metro 💡; todas quedan en 64-128 puntos por metro: nítidas sin pasarse.
- **Variación a gran escala** (para que no se note la repetición): una textura de ruido de 64 × 64 multiplicada sobre el color dos veces, estirada a 32 m y a 7 m (± 12 % de brillo). Se inserta en el material estándar con `onBeforeCompile`, usando la posición en el mundo. 2 lecturas de textura más por píxel.
- **Mapa de mezcla** (solo donde haga falta, aquí el callejón): un plano puede llevar `"mezcla":{"con":"asfalto","mapa":[...]}`: imagen de un canal, 1 punto = 0,5 m (callejón de 6 × 22 m = 12 × 44 puntos), que mezcla dos materiales como máximo. 3 lecturas más. Para la v1 es opcional.
- **Charcos:** calco con material propio (color oscuro, opacidad 0,55, rugosidad 0,08): la farola y la hoguera se reflejan en él con el brillo normal de la luz, sin trucos. 1 llamada.
- **Calcos fijos de suelo:** una malla instanciada (tope 60 por lugar, 1 llamada), atlas de 1024 con 16 casillas de 256, pintado por código: `grieta_a`, `grieta_b`, `grieta_c`, `aceite`, `humedad`, `parche`, `linea` (discontinua), `paso_cebra`, `flecha`, `bordillo_amarillo`, `alcantarilla`, `sumidero`, `neumatico`, `papeles`, `hojas`, 1 libre. Diseño propio: sin rótulos de la referencia.
- **Orden de dibujo:** suelo → calcos fijos → charcos → marcas de bala y sangre → charcos de luz.
- **Memoria** 💡: 2 × 512 (color + normales) 5,6 MB + 3 × 256 2,1 MB + atlas de calcos 5,6 MB + ruido y mezcla 0,1 MB ≈ **13 MB** de los 64.
- **Ambiente:** el atardecer que ya hay [C]. El patio no tiene farola: solo un charco rojo de emergencia y el azul del cielo.

## 6. Marcas de bala (C4) y lo que queda en el suelo
Vale el sistema de la 005 §3 (64 instancias: 40 balas, 16 sangres, 8 quemaduras; misma técnica que los calcos fijos: se programa una vez en V3 y C4 la reutiliza). Ajustes para este mapa:
- **Muros:** la marca va en la cara del muro, a 0,9-1,4 m de alto (altura por `hash` del contador de disparos), orientada con la normal del tramo.
- **Reja y cartón (`pasa`):** sin marca; la bala sigue y marca lo que haya detrás.
- **Hostil o neutral muerto:** el cuerpo se queda tumbado 20 s y se funde en 1 s; máximo 6 cuerpos (el 7.º funde al más viejo). Mancha roja de 1,2 m. Zombi: como hoy (1,6 s [C]) y mancha verde oscura de 1 m.
- **Objetos soltados** (son simulación: `{id, tipo, x, z}`, máximo 12 en el suelo): cada hostil suelta según `hash(semilla, id) % 4`: 0-1 → granada (cargador cuando la munición sea limitada), 2 → botiquín (+25 de vida), 3 → nada. El neutral agradecido da un botiquín. Los zombis no sueltan nada en la v1. Se recogen al pasar por encima (radio 0,6 m) o con `use`; aro blanco en el suelo.

## 7. Animaciones de disparo
**Diagnóstico** [C: `player.js`]: «Side_Shot» es una pose de lado y agachada, y el código gira el cuerpo 90° para compensar. Se sustituye por clips de pie y de frente, y se separa el cuerpo en dos mitades. **Hacer primero el arma (P4):** sin ella, cualquier pose de rifle seguirá pareciendo rara.

| Clip lógico | Qué debe ser | Buscar en Meshy ⚠️ (los nombres exactos no los puedo ver desde aquí) | En Mixamo (nombres conocidos) |
|---|---|---|---|
| `idle` | De pie, rifle bajo, respirando | `rifle idle`, `gun idle` | Rifle Idle |
| `aim` | De pie, **mirando al frente**, rifle al hombro, quieto (bucle) | `rifle aim`, `aiming`, `shoot rifle` | Rifle Aiming Idle |
| `walk` | Andar de frente con rifle | `rifle walk`, `walk with gun` | Walking (Pro Rifle Pack) |
| `walk_back` | Andar hacia atrás con rifle | `walk backward` | Walk Backward (Pro Rifle Pack) |
| `strafe_l`, `strafe_r` | Paso lateral (opcional, mejora mucho) | `strafe` | Strafe Left / Right |
| `run` | Correr con rifle | `rifle run` | Rifle Run |
| `reload` | Recargar de pie (ya hay [C]) | `reload` | Reloading |
| `hit` | Golpe recibido, corto (< 0,6 s) | `hit reaction` | Hit Reaction |
| `die` | Caer hacia atrás (ya hay [C]) | `death`, `dying` | Dying |
| `crouch_idle`, `crouch_walk` | Para A8, no ahora | `crouch` | Crouch Idle / Crouched Walking |

**Cómo elegir** (para el usuario): en la vista previa, mirar el clip DESDE ARRIBA. Vale si el cuerpo está erguido, el pecho mira hacia donde apunta el arma, las dos manos van delante y los pies no giran el cuerpo de lado. Si no existe en Meshy, Mixamo es gratis y acepta el esqueleto de Meshy (mismos nombres de hueso [C]) (decisión 4).

**Regla de mezcla** [R]:
- **Mitad de abajo** (`Hips` y piernas): `idle`/`walk`/`run` por velocidad, como hoy [C]; hacia atrás `walk_back`; de lado `strafe_*` si existen. La cadencia sigue atada a la velocidad real (pies sin patinar [C]).
- **Mitad de arriba** (`Spine` hacia arriba): peso `A` de `aim` y `1−A` del clip de locomoción. `A` va a 1 al disparar o apuntar y a 0 a los 0,6 s de dejar de hacerlo (transición de 0,12 s). `reload` manda sobre las dos mitades de arriba.
- Cómo: al cargar, cada clip se parte en dos (`_inf`, `_sup`) filtrando sus pistas por hueso. Ningún archivo nuevo.
- **El cuerpo mira siempre a donde apuntas**: se quita el giro de 90° y el arreglo del segundo 0,6-2,6 de «Side_Shot» [C].
- **Retroceso por código:** en cada disparo, `Spine2` cabecea 2° y vuelve en 0,08 s. No hace falta clip de «disparar».

## 8. Textos de Meshy
Contenedor, bidón, papelera, caja de cartón y farola: ya están en la 005 §7. Cuerpo de NPC, chaleco y rifle: en la 006 §4. Arranque común de objetos [005]: `3D rendered game prop, single object, three-quarter view, plain light grey background, soft studio lighting, chunky stylized mobile top-down shooter style, matte painted, simple clean shapes, NOT realistic, no text, no logos.` Nuevos:
- **Reja (una hoja):** `One single flat gate leaf made of vertical iron bars, 1.5 m wide and 2 m tall, thick square frame, two horizontal crossbars, spear-shaped tips, two hinge pins on the left edge, flaking dark green paint, rust. Standing upright, seen from the front, nothing behind it.`
- **Candado:** se hace por código (15 cm: es un efecto).
- **Coche:** `Abandoned compact city car, four doors, boxy chunky shape, faded mustard yellow paint, rusty wheel arches, one flat tyre, cracked windscreen, dusty windows, no license plate.`
- **NPC neutral** (Retexture del cuerpo de NPC de la 006, 10 créditos): `Civilian survivor: worn mustard yellow raincoat-style shirt, grey trousers, dirty white sneakers, tired face, stubble, bandage on the left forearm.`
- **NPC hostil** (Retexture del mismo cuerpo + piezas casco/chaleco teñidos de oscuro): `Raider: dark maroon shirt with rolled sleeves, black trousers, heavy black boots, scarf covering the lower face, painted white stripe across the chest.`
- **Zombi variante A** (personaje; arranque de `PROMPTS_MESHY.md` [C]): `Zombie office worker: pale grey-green skin, sunken eyes, open mouth, torn white shirt with one sleeve missing, loose dark tie, grey trousers, one shoe missing, hunched but symmetrical. No weapon, no text.`
- **Zombi variante B:** `Zombie delivery worker: pale grey-green skin, sunken eyes, torn faded blue overalls, one strap hanging, bare feet, dark stains, hunched but symmetrical. No weapon, no text.`

**Orden** [R]: (1) zombi A, lo más visto y hoy es una cápsula; (2) cuerpo de NPC + rifle + chaleco, la prueba de la 006; (3) reja, coche, contenedor, bidón. **Pueden esperar:** papelera, cartón, farola, zombi B, los dos re-texturizados.

## 9. Sonido mínimo (WebAudio, sin archivos)
Un `AudioContext` que se activa con el primer toque (obligatorio en iPhone), un compresor a la salida y **un único búfer de ruido** de 1 s compartido. Tope de 8 voces; un mismo sonido no se repite en menos de 60 ms; volumen `1/(1+d/6)` con la distancia al jugador y panorama según la x en pantalla. Es DIBUJO, no simulación: el ruido que oye la IA es la lista de §4.
| Sonido | Receta 💡 |
|---|---|
| `disparo` | ruido → pasa-banda 1 800 Hz, caída 90 ms + seno 150→50 Hz, 60 ms; tono ± 6 % al azar |
| `imp_metal` | 2 senos 2 200 y 3 100 Hz, caída 40 ms |
| `imp_madera` · `imp_hormigon` · `imp_carton` | ruido pasa-banda 500 Hz 50 ms · pasa-bajos 900 Hz 30 ms · pasa-bajos 400 Hz 40 ms, flojo |
| `rot_madera` | 3 golpes de ruido a 700-1 200 Hz separados 30 ms |
| `rot_cristal` | 5 senos entre 3 000 y 7 000 Hz, caídas de 150 ms + ruido agudo |
| `explosion` | ruido con pasa-bajos que baja de 1 200 a 80 Hz en 0,9 s + seno 60→30 Hz 0,5 s |
| `paso` | ruido pasa-bajos 300 Hz, 35 ms, volumen 0,08; uno cada 0,7 m recorridos (más flojo agachado; sobre `metal` añade seno 900 Hz) |
| `rej_chirrido` · `rej_rotura` | diente de sierra 400→650 Hz con vibrato, 0,5 s · `imp_metal` × 4 |
| `zombi_despierta` | diente de sierra 90 Hz por pasa-banda 600 Hz con vibrato lento, 0,6 s |
Los ids coinciden con los de `materiales.json`. Interruptor «Sonido» en el menú Controles. **No hacer todavía:** música, voces, reverberación, archivos grabados, sonido 3D real. ⚠️ En iPhone el sonido web puede callarse con el interruptor lateral de silencio: comprobar en el móvil.

## 10. Orden de subpasos para Sonnet
Ninguno pasa de MEDIUM. «Meshy» = necesita archivos nuevos del usuario.
| # | Paso | Esf. | Qué | Criterio medible | Se ve en el móvil | Meshy |
|---|---|---|---|---|---|---|
| 1 | V1 | LOW | Mapa `calle_reja_01` (muros, objetos por zona con recorte, luces, aparición); la reja aún fija | Triángulos en `?debug` bajan al alejarse de una zona; ≥ 58 fps | Pasear por la calle y ver el callejón tras la reja | no |
| 2 | C5 | LOW | Barras `?debug` de física [005] | Cambiar una barra se nota sin recargar | Ajustar pesos | no |
| 3 | V2 | MED | Suelos por código (5 materiales, planos por rectángulo, variación grande) | +6 llamadas; memoria de texturas apuntada (≈ 7,7 MB) | Asfalto, acera y adoquín | no |
| 4 | V3 | LOW | Calcos fijos + charcos (malla instanciada + atlas) | 60 calcos = 2 llamadas | Grietas, pintura vial, charcos con reflejo | no |
| 5 | C4 | LOW | Marcas de bala, sangre, quemaduras (reutiliza V3) | 40 marcas < 0,1 ms; se mueven con el objeto | Las marcas quedan | no |
| 6 | V4 | MED | Reja: bisagra, candado, rotura | Candado cae a la 3.ª bala; la hoja se abre de un empujón; estado en datos | Abrir la reja a tiros o con granada | no |
| 7 | C6 | LOW | Acción `use`: forzar/abrir reja, recoger, empujar [005 §5] | Reasignable en Controles | Abrir sin disparar | no |
| 8 | V5 | MED | Lista de ruido con muros + zombis `dormido/despertando/persigue/deambula` | Disparo en z −13 no despierta el patio; granada sí | Colarse o despertar al patio | no |
| 9 | V6 | LOW | Disparadores (4 condiciones, 4 acciones) + mensajes | Cada uno salta una sola vez | «Te han oído» | no |
| 10 | C7 | MED | NPC neutral (estados, línea con `use`, botiquín) con el cuerpo actual teñido | Se asusta a < 15 m; nunca ataca | Hablar con ellos al final | no |
| 11 | C8 | MED | NPC hostil (percepción, cobertura, ráfagas, daño al jugador, reaparición en prueba) | Reacciona en 0,8 s; pierde el rastro en 4 s; usa las coberturas del mapa | El tiroteo del campamento | no |
| 12 | V7 | LOW | Cuerpos que quedan, objetos soltados y recogida | ≤ 6 cuerpos, ≤ 12 objetos | Saquear tras el combate | no |
| 13 | V8 | LOW | Sonido sintetizado + interruptor | ≤ 8 voces; sin tirones al disparar | Se oye todo | no |
| 14 | P3 | MED | Personaje por piezas [006] | Un personaje de `personajes.json` completo | Casco y chaleco puestos | sí |
| 15 | P4 | LOW | Arma en la mano y boca del cañón [006] | Fogonazo en el cañón | El jugador lleva rifle | sí |
| 16 | V9 | MED | Animaciones nuevas: clips partidos en dos mitades, sin giro de 90° | Parado y disparando, el cuerpo queda erguido y de frente en 4 direcciones | Dispara como un soldado | sí (clips) |
| 17 | P5-P6 | LOW ×2 | Cuerpo de NPC con clips compartidos; metal y rugosidad [006] | Criterios de la 006 §5 | NPC distintos del jugador | sí |
| 18 | C10 + P7 | LOW | Medición final en iPhone 14 con todo; captura en `mediciones/` | ≥ 58 fps, peor cuadro ≤ 25 ms, triángulos apuntados | Decidir lo de las sombras | no |
C9 (aliado reclutable) sale de esta lista: va con B4. Las mecánicas tácticas de la 004 (T1-T7) se intercalan a partir del paso 8: comparten la lista de ruido.

## 11. Decisiones para el usuario (5) y lo que queda fuera
1. **¿Las rejas dejan pasar balas y vista?** Recomiendo SÍ: ves el campamento antes de entrar y puedes empezar el combate desde la calle.
2. **¿Se puede matar a los neutrales?** Recomiendo SÍ, sin premio (no sueltan nada y no dan botiquín). Las consecuencias (reputación) llegan con B3.
3. **Morir en el mapa de prueba:** recomiendo reaparecer en la calle con el mapa como estaba. La muerte total es para el juego real.
4. **Animaciones de Mixamo si Meshy no las tiene:** recomiendo SÍ. Son animaciones, no modelos (la norma 5 habla de modelos), son gratis y usan el mismo esqueleto.
5. **Sonido sintetizado como provisional:** recomiendo SÍ; se sustituye por grabaciones cuando se decida, sin rehacer nada.

**Queda fuera:** aliado reclutable, árbol de diálogo, inventario, munición limitada, guardado, interiores, rutas inteligentes de NPC (solo van entre puntos del mapa), música, clima, online, arte final y el mundo por regiones. Sigue pendiente de antes: si los 40 000 triángulos cuentan la pasada de sombras (C10).
