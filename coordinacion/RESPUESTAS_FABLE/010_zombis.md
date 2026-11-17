# 010 · Modelos de zombis: estilo, especificación, texturas, rigging y validación (Fable, 17 nov 2026)

Prioridad fijada por el usuario el 17 nov: **la siguiente sesión empieza por los zombis.** Aplica DECISIONES 3.1-3.3, 3.10, 3.12-3.17 y 009 §2, §4, §5. 💡 = cifra de partida a confirmar con el primer modelo.

## 1. Estilo
- **Personas reales convertidas, no monstruos de dibujos.** Creíbles, inquietantes, con historia en la ropa. Nada infantil, ni cabezón, ni de juguete. Estilizado de juego moderno (formas claras, texturas pintadas), no fotorrealista.
- **Lectura desde la cámara Tiny (≈ 105 píxeles de alto, vista desde arriba y detrás):** lo que más se ve es cabeza, hombros, espalda y brazos. Ahí va el carácter: postura, silueta de hombros, pelo o calva, manchas y desgarros grandes en la espalda y los hombros. El detalle fino de la cara importa poco; el contraste de bloques, mucho.
- **Color:** piel apagada gris verdosa o cetrina, **más clara que el suelo oscuro**; ropa desaturada; **un color identificativo por tipo** (para distinguirlos de un vistazo); sangre en rojo oscuro, en manchas grandes, no salpicado fino. Los humanos vivos (jugador, NPC) llevan colores más limpios y un acento vivo: un zombi nunca debe confundirse con un vivo.
- Arte propio: no se copia ningún zombi de otro juego.

## 2. Proporciones y anatomía
| | Valor |
|---|---|
| Altura | **5 cabezas** 💡 (extremo alto del margen aprobado 4-5: el usuario no quiere cabezones). 1,50 m en el juego, como los humanos. Si al verlo junto al jugador de 4,5 desentona, se iguala uno al otro: lo decide el usuario |
| Cabeza | Tamaño normal para 5 cabezas; pómulos y cuencas marcados, mandíbula visible; rasgos modelados, no solo pintados |
| Cuerpo | Adulto. Hombros, clavículas y manos algo marcados; brazos un poco largos. Delgadez o corpulencia según el tipo |
| Heridas | Modeladas en grande (un desgarro, una mordedura, costillas marcadas), no multitud de detalles pequeños |
| Postura | **El modelo se genera erguido y neutro en pose T.** La postura encorvada, la cabeza ladeada y el arrastre los pone la animación, no el modelo |

## 3. Los tres tipos (mismas reglas de juego que hoy: `zombies.js` `TYPES`)
| Tipo | Silueta | Ropa e historia | Color identificativo |
|---|---|---|---|
| **Normal** (primer modelo) | Complexión media, hombros caídos | Civil: camisa o sudadera rota, vaqueros, una zapatilla perdida | Azul grisáceo apagado |
| **Corredor** | Delgado y fibroso, extremidades largas | Ropa deportiva o torso desnudo, pantalón corto | Amarillo ocre sucio |
| **Tanque** | Muy corpulento, cuello ancho, 1,5× de escala en el juego | Mono de trabajo o delantal de carnicero, botas | Rojo teja oscuro |
Variantes posteriores (otra ropa, otro pelo) se sacan re-texturizando el mismo cuerpo, sin repetir esqueleto ni animaciones.

## 4. Geometría (sin tope: DECISIONES 3.12; guía `CALIDAD_GRAFICA.md` §6)
- De Meshy se guarda siempre el modelo alto en `arte_fuente/`.
- Versión de juego orientativa 💡: normal y corredor 5 000-8 000 triángulos, tanque 8 000-10 000. Criterio real: silueta sin facetas y captura a tamaño de juego indistinguible de la del modelo alto.
- Presupuesto medido: ≈ 24 personajes pesados (12 000 triángulos) en pantalla a 40 fps; los fuera de pantalla ya no se dibujan. Con zombis más ligeros hay margen de sobra para los 40 activos.
- Una sola malla cerrada por zombi. La ropa va **pegada o pintada sobre el cuerpo** (jirones cortos sí; nada que cuelgue más de un palmo). Sin piezas sueltas en el primer modelo.

## 5. Texturas (para no repetir el fallo del personaje provisional; DECISIONES 3.17)
El problema visto: Meshy entrega la textura en cientos de trocitos de colores pegados sin margen → motas en las costuras al verse pequeño.
1. **Herramienta nueva `tools/rehacer_textura.mjs` (hay que programarla; es parte de la primera tarea):** reorganiza la superficie en **pocas piezas grandes** (objetivo ≤ 40 💡, cortes por zonas naturales), con **margen ≥ 8 píxeles a 2 048** entre piezas, y vuelve a pintar color y relieve desde la textura original rellenando los márgenes con el color del borde. Librería prevista: `xatlas` (WebAssembly, desde npm) para el despiece; el repintado se hace recorriendo triángulos. Si `xatlas` no sirviera en Node, alternativa: Blender por línea de comandos.
2. Textura final: color + relieve + rugosidad (sin metal salvo hebillas). 2 048 en el modelo guardado; la de juego 1 024-2 048 según se vea.
3. La lectura «más nítida» que ya hace el juego (`assets.js`) se mantiene como segunda defensa.
4. **Se aprueba con lupa:** ⚙ → «Lupa y costuras» → «Lupa ×8», a distancia de juego, quieto y andando: 0 motas de otro color en las costuras.

## 6. Esqueleto y Mixamo (DECISIONES 3.13; **Mixamo aún NO está probado: ART-1 parte 2 pendiente del usuario**)
- Pose en T, simétrico, brazos y piernas separados, dedos algo abiertos, nada colgando: requisitos de 009 §3.
- Esqueleto de Mixamo **«No Fingers (25)»** 💡 para zombis (manos en garra modeladas, no hacen falta dedos animados).
- Tubería: Meshy (imagen → 3D → textura) → `rehacer_textura` → `tools/para_mixamo.mjs` (ya existe) → Mixamo en un ordenador → `tools/de_mixamo.mjs` (por programar, ART-1 parte 3) → GLB de juego en `public/models/` + clips compartidos `personajes/anims/zombi_mx.glb`.
- Clips de Mixamo a descargar (FBX, sin piel, 30 fps, «In Place» cuando exista): «Zombie Idle», «Zombie Walk», «Zombie Running», «Zombie Attack», «Zombie Reaction Hit», «Zombie Dying» / «Zombie Death», «Zombie Stand Up», y un reposo tumbado o agachado para «dormido» si lo hay. Nombres por confirmar al descargar.
- **Riesgo:** si el usuario no puede usar Mixamo (necesita ordenador), alternativa: esqueleto y animaciones de Meshy, como los 8 clips actuales del jugador. Se decide al llegar a ese paso; el modelo y la textura valen igual.

## 7. Coordinación con PAQ-03 (para sustituir el relleno sin rehacer nada)
- El código ya separa zombi y aspecto: `zombies.js` pide `instance(t.model)` y `models.config.js` asigna archivo y clips a `zombie`, `runner` y `tank`. **Sustituir el relleno = cambiar archivo y nombres de clip en `models.config.js`.**
- PAQ-03 usa nombres lógicos de clip por estado: `idle` (dormido), `wake` (despertando), `walk` (deambula), `run` (persigue), `attack`, `hit`, `die`. Si un clip no existe se usa el anterior de la lista o el movimiento por código actual. Con el relleno de cápsulas funciona igual.
- Radio de choque, vida, velocidad y daño siguen en `TYPES`; el modelo no los cambia. La escala visual se ajusta en `models.config.js`.
- Cuando exista `anim.js` (PAQ-A1/A3), los zombis pasan a él sin tocar PAQ-03: la simulación no sabe de animación.

## 8. Primer modelo: instrucciones y validación (zombi normal; nada de variantes hasta aprobarlo)
1. **Fable** escribe el texto para la imagen de referencia (pose T, de frente, fondo liso, 5 cabezas, descripción de §1-§3 «Normal»; máximo 800 caracteres, que es el límite del cuadro de Meshy) y lo deja en `docs/MESHY_PEDIDOS.md`. Revisar antes en ese archivo y en `docs/PROMPTS_MESHY.md` lo ya aprendido (un zombi fotorrealista fue rechazado el 16 nov; pedir «3D rendered game character», no ilustración).
2. **El usuario confirma el gasto** (créditos en pausa por DECISIONES 3.6; él ha puesto los zombis como prioridad, así que basta su visto bueno al texto) y genera 4 imágenes. Elige una.
3. Usuario: imagen → 3D con pose T, reducción «adaptativo alto», textura; descarga el GLB **sin esqueleto** y lo sube al chat.
4. Fable: guarda el original en `arte_fuente/`, pasa `rehacer_textura` y prepara una versión de juego **estática** (sin esqueleto) para verla ya en el mapa de prueba junto al jugador.
5. **Validación 1 (aspecto), con capturas a tamaño de juego y con lupa:** se distingue del suelo y del jugador · silueta reconocible desde arriba · no parece infantil ni cabezón · 0 motas en costuras · sin facetas en la silueta. **Aprueba el usuario.**
6. Mixamo (usuario) → `de_mixamo` → clips → **Validación 2 (movimiento):** pies a < 3 cm del suelo, malla sin estirones al andar y al caer, 40 a la vez con `?carga` ≥ 40 fps.
7. Solo entonces: corredor y tanque, y variantes por re-texturizado.
