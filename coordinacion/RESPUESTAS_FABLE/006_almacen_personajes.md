# 006 · Almacén de personajes: piezas, animaciones compartidas y calidad HD

Origen de cada dato: **[C]** leído en el código o en el repositorio · **[003]** respuesta 003 · **[T]** cómo funciona Three.js r170 · **[R]** razonamiento propio · 💡 hay que medirlo · ⚠️ sin verificar.

## Preguntas (respondidas por el usuario, 16 nov) ✅
1. El personaje va **sin nada en las manos**: el arma es una pieza aparte en `RightHand` (paso P4 tal como está) y un personaje sin arma es válido.
2. Créditos de Meshy: valen los apuntados (2 388 [C]); la prueba de §5 gasta ≈ 125.

## 1. Veredicto: enfoque mixto SÍ, con cinco correcciones
1. **Ropa = pintura; volumen = piezas RÍGIDAS.** Una pieza de Meshy sale con malla propia, sin relación con la del cuerpo: si se le pone esqueleto para que se doble (pantalón, chaqueta, cabeza cambiable) aparecen costuras y el cuerpo la atraviesa al moverse. Por eso: la ropa sigue siendo re-texturizado del cuerpo [003 §4] y TODA pieza es rígida, pegada a UN hueso: casco y pelo → `Head`, chaleco y mochila → `Spine2`, arma → `RightHand`, funda → `LeftUpLeg`. Sin costuras, porque nada se cose.
2. **No se cambia la cabeza.** El corte del cuello siempre se ve. Las caras distintas son textura; el pelo es pieza. Consecuencia: **los cuerpos base nuevos van calvos** (el actual lleva pelo esculpido [C] y solo admitirá cascos y gorros que lo tapen).
3. **Pose A, no T.** Para compartir animaciones todos los cuerpos deben tener la misma pose de reposo que el primero, y el jugador actual se hizo en pose A [C]. Cambiar a T ahora obligaría a rehacerlo.
4. **No hay «protagonista aparte».** Cada jugador crea el suyo (DISENO §14 ✅): el jugador usa el MISMO almacén, con el presupuesto alto. Modelo entero solo para jefes y personajes únicos, pero pasado también por el rig humanoide de Meshy para que valgan las mismas animaciones.
5. **Zombis: mismo esqueleto que los humanos** (lo decidió el usuario en `MODELOS_MESHY.md` ✅) con sus clips propios. El rig humanoide de Meshy pone los nombres `mixamorig:*` a todo lo que tenga dos brazos y dos piernas [C: `prep_player.mjs`]. Esqueleto propio solo para lo no humanoide (perros, etc.).

**Riesgos que quedan y cómo se tapan**
| Riesgo | Remedio |
|---|---|
| Brazos que atraviesan el chaleco al apuntar o recargar | Chalecos sin hombreras ni bolsillos laterales; 3-5 % más grandes que el torso (`ajuste` por cuerpo en el JSON). Se juzga a tamaño de juego, no de cerca |
| El chaleco no se dobla con la cintura | Va en `Spine2` (pecho); el doblez queda por debajo. A ~150 px 💡 no se nota |
| Clips que deforman otro cuerpo (huesos de otra longitud o reposo distinto ⚠️) | De los clips compartidos se usan solo los GIROS; la única posición que se conserva es la de `Hips`, escalada por la altura de cadera de cada cuerpo. Se comprueba en §5 |
| Muchas piezas = muchas llamadas de dibujo | Tope de piezas por tipo (§3). Si no basta: «hornear» los NPC fijos en una sola malla con una herramienta (paso posterior, no ahora) |

## 2. Carpetas y formato
```
arte_fuente/                      originales de Meshy (fuera de public/)
public/models/personajes/
  cuerpos/   jugador_a.glb  npc_medio.glb  zombi_normal.glb   (malla + esqueleto, SIN animaciones)
  anims/     humano.glb  zombi.glb                             (solo esqueleto + clips)
  skins/     npc_medio_01.webp ...                             (ropa = imagen)
  piezas/    casco_obra.glb  chaleco_bolsillos.glb  mochila_lona.glb
  armas/     rifle_01.glb                                      (con un nodo vacío «boca»)
src/data/personajes/  cuerpos.json  piezas.json  personajes.json
```
`models.config.js` no cambia de forma: cada cuerpo es una entrada normal con una clave nueva `anims`, así `instance()` sigue valiendo:
```js
npc_medio:{ file:'personajes/cuerpos/npc_medio.glb', anims:'personajes/anims/humano.glb', scale:0.53, offset:[0,0,0], cadera:0.48, placeholder:{...}, clips:{idle:'idle',walk:'walk',run:'run',...} },
```
```json
// piezas.json
{"id":"chaleco_bolsillos","archivo":"piezas/chaleco_bolsillos.glb","ranura":"torso","hueso":"Spine2",
 "pos":[0,0,0],"rot":[0,0,0],"escala":1,"tinte":true,"sombra":false,
 "ajuste":{"npc_medio":{"escala":1.04},"jugador_a":{"pos":[0,0.01,0]}}}
// armas: igual, con "ranura":"mano_d","hueso":"RightHand","boca_sim":[0.55,0.75]
// personajes.json
{"id":"npc_vigia_01","cuerpo":"npc_medio","skin":"npc_medio_03",
 "piezas":{"cabeza":"casco_obra","torso":"chaleco_bolsillos","espalda":"mochila_lona","mano_d":"rifle_01"},
 "tintes":{"torso":"#7a4a2b","cabeza":"#c9b458"}}
```
- Ranuras fijas: `cabeza`, `pelo`, `torso`, `espalda`, `mano_d`, `cadera`. Una pieza por ranura; `cabeza` oculta `pelo`.
- **Tinte** = multiplicar el color del material (clonado) de la pieza. Por eso las piezas teñibles se generan en gris claro 💡; las no teñibles llevan su color.
- El perfil de un jugador online es solo un objeto de `personajes.json` (unos bytes, norma 3).
- El soldado actual pasa a NPC sin tocar el archivo: una entrada `npc_soldado` que apunta al mismo GLB.

## 3. Presupuesto
**Corrección importante a las cifras de partida.** 10 000-20 000 triángulos y textura 2048 para el jugador no se ven y sí se pagan [R]: el personaje mide en pantalla del orden de 150 píxeles de alto 💡 (medir con una captura: la cámara está más cerca que en la 003), unos 8 000 píxeles de superficie. Con 5 000 triángulos ya hay un triángulo por cada 1-2 píxeles; más solo añade parpadeo. Una textura de 1024 ya tiene varias veces más puntos que píxeles ocupa; la de 2048 gasta 22 MB de memoria en vez de 5,6 [003 §3].

**De dónde sale el aspecto «HD» de la referencia** [R], por orden de efecto: (1) pintura con contraste fuerte entre capas (casco, chaleco, ropa); (2) mapa de normales; (3) **metal y rugosidad de verdad:** la 003 mandó quitar el metal porque no había mapa de entorno, pero desde A0f el jugador ya lo tiene [C: `assets.js`]; conservarlos en personajes y piezas es lo que da el brillo de hebillas, casco y arma (paso P6); (4) luz cálida local y sombra; (5) el modelo alto de 36 722 [C] para el creador y los primeros planos.

| Tipo | Cuerpo | Piezas (máx.) | Total | Textura cuerpo · pieza | Huesos | Peso GLB 💡 |
|---|---|---|---|---|---|---|
| Jugador (mundo) | 5 000 | 5: ≈ 2 300 (casco 400, chaleco 600, mochila 500, arma 500, pelo 300) | **≈ 7 300** | 1024 color + normales + metal/rugosidad · 512 | 20 [C] | 350 KB + 60 por pieza |
| Jugador (creador) | 36 722 [C] | las mismas | — | 2048 (solo aquí) | 66 | se carga al abrir el creador |
| NPC / rival | 2 500 | 3: ≈ 1 100 | **≈ 3 600** | 512 color + normales · 256 | 20 | 150 KB + 30 por pieza |
| Zombi | 800 [003] | 0 | 800 | 512 solo color | 20 | 120 KB |
| Jefe (entero) | 6 000 | 0-1 | 6 000 | 1024 | 20 | 400 KB |
| Clips `humano.glb` | — | — | — | — | — | ≈ 500 KB una vez (hoy van dentro de `player.glb`, 1,2 MB [C]) |

**Suma en pantalla** (peor caso del callejón, una pasada): jugador 7 300 + 5 NPC 18 000 + 10 zombis 8 000 + mundo 10 000 ≈ **43 000**: se pasa del tope aun con estas cifras, y con las de partida (20 000 + 5 × 6 000) serían 68 000. Reglas para caber: máximo **4 humanos completos a la vista**, el 5.º en adelante sin piezas de `espalda`; las piezas de NPC no proyectan sombra (`"sombra":false`); la decisión de si la pasada de sombras cuenta sigue en C10. Llamadas de dibujo: jugador 6, NPC 4 cada uno → ≤ 26 💡.
**Formato:** WebP dentro del GLB, como hasta ahora; KTX2 solo si el medidor pasa de ~45 MB [003]. Meshopt: no hace falta todavía (los GLB ya van cuantizados [C]); añadirlo cuando la descarga total de modelos pase de 5 MB 💡.

## 4. Textos para Meshy
Receta de la 003 §2 sin cambios: imagen → Image to 3D (**pose A**, textura apagada) → Remesh **Adaptativo Alto** → Texture con **PBR activado** y la misma imagen como guía → rigging humanoide (solo cuerpos) → descargar a `arte_fuente/`. La reducción final la hace Sonnet en el repositorio, no Meshy. Colores propios, distintos de la referencia.

**Cuerpo base de NPC (calvo, ropa ajustada):**
```
3D rendered game character, full body, front view, A-pose, plain light grey background, soft studio lighting. Chunky toy-like proportions: oversized head, short stocky body, big hands, big heavy boots, about 3 heads tall. Looks like a 3D model from a mobile top-down shooter, matte painted materials, simple clean shapes, NOT a 2D illustration, NOT realistic. Adult survivor, completely bald smooth head, large simple eyes with dark outlines, thick eyebrows, clearly visible closed mouth. Fitted rust-orange long-sleeve shirt, slim dark navy trousers, sculpted knee pads, brown boots, thick mitten-like gloves. No weapon, vest, backpack, helmet, hat, hair or text. Arms slightly away from body, legs slightly apart.
```
**Pieza de prueba: chaleco** (la más difícil; si esta encaja, casco y mochila también):
```
3D rendered game prop, single object only, front three-quarter view, plain light grey background, soft studio lighting, chunky stylized mobile top-down shooter style, simple clean shapes, NOT realistic. Empty sleeveless tactical vest standing upright on its own, wide round neck opening, large armholes, no shoulder pads, flat sides. Two big chest pouches, one radio pouch, metal buckles, stitched straps, worn light grey canvas with darker edges. No mannequin, no body, no person, no text, no logos.
```
**Arma:**
```
3D rendered game prop, single object only, exact side view, barrel pointing right, plain light grey background, soft studio lighting, chunky stylized mobile top-down shooter style, simple clean shapes, NOT realistic. Short thick assault rifle, oversized toy-like proportions, straight barrel, chunky stock, curved magazine, dark worn gunmetal with scratched edges, olive green handguard, strip of cloth tape on the grip. No hands, no person, no scope, no text, no logos.
```

## 5. La prueba pequeña (≈ 125 créditos: cuerpo ≈ 65, chaleco ≈ 30, arma ≈ 30 [003])
Se hace con el cuerpo de NPC nuevo, porque prueba a la vez las dos dudas: piezas que encajan y animaciones compartidas. **Criterios, todos medibles:**
1. **Esqueleto:** un script compara los nombres de hueso del cuerpo nuevo con los 20 del jugador: coinciden 20 de 20.
2. **Animaciones compartidas:** los 8 clips del jugador se reproducen en el cuerpo nuevo sin errores; en reposo los pies quedan a menos de 3 cm del suelo y, andando, patinan menos de 5 cm por paso.
3. **Chaleco:** en `walk`, `run`, `shoot_side` y `reload`, en 4 capturas a tamaño de juego en el iPhone, no se ve cuerpo atravesando el chaleco. De cerca sí puede verse: no cuenta.
4. **Arma:** en el tramo de apuntar de `shoot_side` (1,25-2,6 s [C]) el cañón se desvía menos de 5° de la dirección de apuntado.
5. **Coste:** el personaje completo ≤ 3 600 triángulos y +3 llamadas; fps sin cambio en `?debug`.

Si falla el 2 → cada cuerpo lleva sus propios clips (más peso, mismo sistema). Si falla el 3 → el chaleco pasa a ser parte de la ropa pintada y solo quedan casco, mochila y arma como piezas.

## 6. Pasos para Sonnet
| Paso | Esf. | Qué | Criterio |
|---|---|---|---|
| P1 | LOW | Sacar los clips de `player.glb` a `anims/humano.glb`; `assets.js` lee la clave `anims` | El jugador se ve y se mueve igual; `player.glb` baja de 1,2 MB |
| P2 | LOW | `tools/prep_pieza.mjs` (reducir, textura, WebP, centrar en el origen) + carpetas + `piezas.json` vacío | Una pieza de prueba sale con sus triángulos y KB objetivo |
| P3 | MED | `instanciaPersonaje(id)`: cuerpo + skin + piezas pegadas al hueso + tinte + `ajuste`. Barras `?debug` para mover, girar y escalar la pieza elegida y un botón que copia el JSON | Un personaje de `personajes.json` aparece completo |
| P4 | LOW | **Arma y boca del cañón.** El arma lleva un nodo vacío `boca` (lo añade P2 en el extremo del cañón). El DIBUJO (fogonazo y estela) sale de la posición real de ese nodo. La SIMULACIÓN no lo usa: el rayo sigue saliendo del centro del jugador hacia donde apunta, como hoy [C], con `boca_sim` (distancia y altura) como dato del arma. Así no se dispara a través de un muro con el cañón metido en él, y el servidor no necesita animaciones | El fogonazo sale del cañón en las 3 posturas de disparo; los impactos no cambian |
| P5 | LOW | Cuerpo de NPC con los clips compartidos (posición de cadera escalada por `cadera`); entrada `npc_soldado` con el modelo actual | Criterios 1 y 2 de §5 |
| P6 | LOW | Conservar metal y rugosidad en personajes y piezas, usando el entorno que ya existe; captura de antes y después | El usuario elige con las dos capturas |
| P7 | LOW | Medir en el iPhone 14: jugador + 5 NPC con piezas en el callejón; captura en `mediciones/` | ≥ 58 fps, peor cuadro ≤ 25 ms, triángulos y llamadas apuntados |

Después, cuando haga falta: hornear NPC fijos en una malla, y el creador de personaje (F2).
