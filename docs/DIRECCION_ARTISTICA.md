# DIRECCIÓN ARTÍSTICA DE PERSONAJES · lenguaje visual común (Fable, 18 nov 2026)

> **19 nov: SUPERADO por `docs/DIRECCION_ARTISTICA_HD.md`** (referencias Tiny Troopers + captura del usuario, proporciones elegidas por lectura, identidad de operadores de extracción, criterios de aceptación y textos v3). Este documento queda como historial; lo que contradiga al HD no vale.

**Estado: APROBADA COMO BASE por el usuario (18 nov)**, con sus correcciones ya aplicadas. Se mantienen: jugador 4,5 cabezas, zombi 5 cabezas, paleta A del jugador. **Referencia visual principal: la captura del usuario del 18 nov** (`docs/arte/captura_referencia_18nov.png`). Ya no se interpreta a partir de Tiny Troopers. **Los vivos son supervivientes veteranos y saqueadores de zonas peligrosas (juego de extracción): ni civiles indefensos ni soldados de uniforme** (§5). Los zombis, gente convertida. Nada de terror realista.

## 1. El objetivo
**Que el jugador y los zombis parezcan personajes del mismo videojuego que la captura, vistos con nuestra cámara real**, adaptados a nuestra temática de supervivencia. Estilo 3D estilizado, compacto y sobrio. Una imagen frontal bonita no basta: cada modelo se aprueba dentro del juego.

## 1b. Qué tiene la captura y cómo se reproduce
| En la captura | Cómo lo conseguimos |
|---|---|
| Personaje pequeño que se lee por **masas**: cabeza (casco claro), torso oscuro, piernas claras | Bloques de claridad distinta entre cabeza, torso y piernas; nada de detalle fino para distinguirlos |
| Formas **simples y limpias**, superficies lisas, casi sin arrugas ni relieve pequeño | Volúmenes sencillos, pocos detalles medios, relieve suave |
| Colores **apagados y casi planos**, con sombreado suave, sin brillos | Textura pintada: color base por pieza + sombreado suave. Todo mate |
| Materiales **totalmente mates**: ni plástico ni metal reluciente | Rugosidad alta en el modelo y, en el juego, **sin reflejos de estudio** sobre los personajes nuevos (el provisional los lleva y por eso brilla como un juguete): ajuste técnico pendiente para cuando llegue el primer modelo |
| Luz **muy oscura y azulada con charcos cálidos** de farola; sombras suaves | Es del escenario, no del modelo (pasos de luz ya previstos en la hoja de ruta). El modelo debe aguantar esa luz: por eso va más claro que el suelo |
| Objetos del mismo lenguaje: cajas y bidones de formas simples, pintura gastada | Los objetos seguirán estas mismas reglas (ART-5) |
| Sangre: manchas pequeñas rojo oscuro, sobrias | Sin vísceras ni terror realista |
Arte propio: se reproduce el estilo, no se copian sus personajes, colores, rótulos ni objetos.

## 2. Reglas comunes a TODOS los personajes (jugador, NPC y zombis)
| Tema | Regla |
|---|---|
| **Altura** | Todos los adultos, la misma altura entre sí (la medida en metros **no está fijada**: se decide con la escala del mundo). Vivos **4,5 cabezas**; zombis **5 cabezas** (aprobado, 18 nov). La media cabeza de diferencia es intencionada: el vivo se ve compacto y fuerte, el muerto consumido y descolgado |
| **Cabeza** | Sencilla y firme, más alta que ancha (ancho 0,75-0,8 de su alto). Nunca esférica ni de muñeco. Mandíbula marcada, cráneo plano por detrás |
| **Rostro** | Adulto. **Ceja-visera** continua y pesada que da sombra; **ojos pequeños y hundidos** (≤ 1/6 del ancho de la cara cada uno), nunca grandes ni brillantes; **nariz corta y sencilla**, sin fosas detalladas; boca = una línea firme con labio inferior marcado; orejas simples pegadas. Todo con volumen real, no pintado |
| **Cuello** | Corto. Grueso en vivos, fino en zombis |
| **Torso** | Trapecio claro: hombros anchos, cintura más estrecha. Formas lisas, sin músculo dibujado |
| **Brazos y piernas** | Formas lisas que se ensanchan un poco hacia la mano y la bota. Codo y rodilla marcados con un pliegue o una pieza (rodillera, desgarro) |
| **Manos** | 1,15× lo real, cuatro dedos y pulgar gruesos y separados, sin uñas ni nudillos finos |
| **Pies** | Bota o zapatilla 1,2× lo real, suela gruesa, puntera redonda |
| **Silueta** | Debe reconocerse en negro y a 105 píxeles. Orientación de simplicidad (no un límite): pocas masas grandes —cabeza, torso, brazos, piernas, pies— y que cada pieza añadida tenga volumen propio |
| **Detalle** | Tres escalas y nada más: **grande** (masas), **medio** (bolsillos, costuras gruesas, cinturón, rodilleras, heridas grandes: 6-10 por personaje) y **fino solo pintado** (desgaste en aristas, suciedad). Nada de poros, tela tejida, arrugas pequeñas ni pelo en mechones |
| **Ropa** | Ceñida, pintada sobre el cuerpo (3.10). Pliegues solo en codos, rodillas y cintura, y grandes |
| **Pelo** | Casquete compacto y sencillo; nunca mechones sueltos |
| **Geometría** | Modelo alto de Meshy guardado. Juego: vivos 8 000-10 000 triángulos, zombis 5 000-8 000 (orientativo; criterio real: silueta sin facetas a tamaño de juego). Una malla cerrada, pose T |
| **Textura** | Pintada a mano: color base casi plano por pieza + sombreado suave + desgaste localizado y discreto. Sin fotografía ni ruido fino. Color, relieve y rugosidad a 2 048, rehecha con `tools/rehacer_textura.mjs` (3.17) |
| **Materiales** | Totalmente mate, como la captura. Rugosidad: tela 0,9 · cuero y goma 0,75 · piel 0,8 · metal solo en hebillas. Sin brillos de plástico ni reflejos |
| **Color** | 3 colores principales + 1 acento por personaje. Piezas vecinas separadas por **claridad** (una clara junto a una oscura), no solo por tono. Todo más claro que el suelo |
| **Bandos** | **Vivos:** tonos cálidos y sobrios, saturación media-baja, un acento. **Zombis:** tonos fríos y apagados, la piel es su zona más clara, un color de tipo en el torso, sangre rojo oscuro en manchas grandes |

## 3. Lectura con nuestra cámara (16,4 m, 58°, ≈ 105 píxeles de alto, visto desde arriba y detrás)
1. Se ve sobre todo **coronilla, hombros, espalda y antebrazos**: ahí va el contraste (pelo o casco contra hombros; acento del jugador en hombro o brazo; mancha del zombi en el hombro).
2. La cabeza ocupa ≈ 23 píxeles: de la cara se leen ceja, sombra de ojos y nariz como tres manchas. Por eso se modelan en grande y no se pinta detalle fino.
3. Un detalle medio (bolsillo, rodillera) ocupa 6-10 píxeles: se ve. Uno fino, 1-2: se convierte en ruido. Por eso solo tres escalas.
4. **Prueba de aprobación de cualquier modelo (la que manda):** captura dentro del juego, con nuestra cámara y nuestra luz, puesta al lado de la captura de referencia. Debe parecer del mismo juego y distinguirse quién es quién sin lupa. La imagen frontal de Meshy solo sirve para elegir candidata.

## 4. Por qué el personaje provisional no alcanza el estilo
| Regla | Provisional | Resultado |
|---|---|---|
| 4,5 cabezas | ≈ 3 cabezas, cabeza de 1/3 del cuerpo | Niño o muñeco |
| Cabeza en bloque, rostro adulto | Redonda, ojos grandes, sin ceja ni mandíbula | Cara de juguete |
| Miembros que se ensanchan | Brazos y piernas cortos; botas, rodilleras y guantes como globos | Proporción de figura de plástico |
| 3 colores + acento por claridad | Verde azulado saturado, amarillo oliva y gris de claridad parecida | Se lee como un bloque, sin jerarquía ni bando |
| Formas limpias y mates | Formas blandas, derretidas al reducir, y con reflejos de estudio | Brilla y se ve de plástico |
| Textura en pocas piezas con margen | 304 trocitos sin margen | Motas (corregido solo con la herramienta) |
Sigue en el juego únicamente como relleno (3.4).

## 5. Propuesta: JUGADOR (cuerpo de referencia de los vivos)
**Identidad (usuario, 18 nov; DECISIONES 3.23):** juego de supervivencia con extracción. Los vivos son **supervivientes veteranos, exploradores y saqueadores de zonas peligrosas**, preparados para combatir y sacar recursos. Ni civiles indefensos ni soldados de uniforme: protagonistas de un juego de extracción. Esto define **la ropa y el equipo**; el estilo gráfico sigue siendo exactamente el de la captura (§1b).
- **Qué debe transmitir:** carácter propio, experiencia, ropa funcional y resistente, equipo táctico reunido y adaptado (no reglamentario), y diferencias claras entre personajes.
- **Medidas:** 4,5 cabezas · hombros 1,7 cabezas · cintura 1,2 · piernas 2 cabezas · manos a medio muslo · cuello corto y ancho.
- **Cabeza:** cara curtida, mandíbula firme, ceja pesada, cicatriz en una ceja, pelo oscuro rapado, barba de dos días.
- **Ropa del cuerpo (pintada, paleta A):** chaqueta reforzada verde oliva ceñida · pantalón cargo arena · botas y guantes marrón oscuro · rodilleras y coderas gris carbón · brazalete naranja óxido (acento del jugador).

**El cuerpo se genera «limpio» para poder equiparlo en el juego (3.10, 3.11, 3.14):** cabeza descubierta y pecho, espalda y caderas lisos, sin bolsas ni correas modeladas. Todo el equipo son **piezas independientes** que se pegan a un hueso y se cambian en el juego:
| Hueco | Hueso | Piezas posibles |
|---|---|---|
| Cabeza | cabeza | casco de obra o de moto, gorra, capucha, máscara o respirador, gafas |
| Pecho | pecho | chaleco portaequipo, chaleco antigolpes improvisado, arnés con cargadores |
| Espalda | pecho | mochila pequeña, mochila grande de extracción, bolsa cruzada |
| Cintura | cadera | cinturón con bolsas, funda de pistola, herramientas (palanca, hacha) |
| Muslo | muslo | funda, bolsa de pierna |
| Hombros y brazos | hombro, antebrazo | hombrera, protección de antebrazo |
| Mano | mano derecha | arma (fusil, escopeta, pistola, cuerpo a cuerpo) |
Las piezas siguen las mismas reglas de estilo (§2) y cada una tiene volumen y color propios, porque desde nuestra cámara lo que más se ve es casco, hombros y mochila.

**Cómo se diferencian los personajes sin uniformarlos:** complexión del cuerpo (2-3 cuerpos) · ropa por re-pintado del mismo cuerpo · combinación de piezas · un color de acento distinto por personaje · un rasgo de cara o pelo. Nunca dos personajes con el mismo conjunto completo.

**Texto para Meshy (796 caracteres; se usará cuando toque ART-2):**
```
Stylized 3D game character model, full body, front view, strict T-pose, arms horizontal, palms down, fingers apart, feet apart, light grey background, flat light. Compact sturdy adult man, 4.5 heads tall, broad shoulders, short thick neck, large hands, large boots. Simple clean volumes, smooth simplified surfaces, flat muted colors, soft shading, matte, sober style of a dark top-down survival shooter. Veteran scavenger, not a soldier: weathered face, strong jaw, heavy brow, scarred eyebrow, cropped dark hair. Fitted reinforced olive green jacket, sand cargo trousers, dark brown boots and gloves, charcoal knee and elbow pads, rust-orange armband. Plain chest, back and hips. Bare head, no vest, no backpack, no pouches, no weapon. Not photorealistic, not cartoon, not toy, not 2D. No text.
```

## 6. Propuesta: ZOMBI NORMAL
Hombre corriente convertido hace poco. Mismas reglas de cabeza, manos, facetas y pintura; cambia la masa.
- **Medidas:** 5 cabezas · hombros 1,4 cabezas y caídos · cuello fino · brazos largos (manos casi a la rodilla) · manos huesudas del mismo tamaño que las del jugador.
- **Cabeza:** mismas piezas que el jugador pero vaciadas: mejillas hundidas, cuencas oscuras, sin labios y con dientes, pelo a parches.
- **Color:** piel gris verdosa clara · sudadera **azul grisáceo** (tipo normal) · vaqueros grises · sangre rojo oscuro en un hombro · mordedura en un antebrazo · una zapatilla y un pie descalzo.

**Texto v2 para las 4 imágenes (780 caracteres) — sustituye a la v1 tras la revisión del 19 nov (`SESION.md`):**
```
Stylized 3D game character, full body, front view, strict T-pose, arms horizontal, fingers apart, feet apart, grey background. Stocky compact adult man, large head one fifth of body height, broad shoulders, short legs, large hands. Simple smooth volumes, flat muted colors, soft shading, matte, sober style of a dark top-down survival shooter. Zombie, former civilian: pale grey-green skin, hollow cheeks, small ears flat against the head, pale grey eyes with small dark pupils, heavy eyelids, slightly open mouth with simple lips, few teeth, short nose, patchy dark hair. Torn slate-blue crew-neck sweatshirt, no hood, dark red stain on one shoulder, bite wound on one forearm, faded grey jeans, one worn sneaker, one bare foot. Not photorealistic, not cartoon, not toy. No text.
```
Cambios respecto a la v1 y por qué: «5 heads tall» no se cumplió (el modelo salió con ≈ 6,5 cabezas), así que ahora se pide la cabeza como fracción del cuerpo y piernas cortas · orejas pequeñas y pegadas (salieron enormes) · ojos con iris y pupila (salieron en blanco) · boca ligeramente abierta con labios simples y pocos dientes (salió una hilera de dientes cuadrada) · jersey de cuello redondo sin capucha (se ignoró «no loose cloth»).

**Filtro adicional para elegir imagen (se mide en la imagen, antes de gastar créditos en 3D):** cabeza ≥ 1/5,5 del alto total · oreja menos de la mitad de alta que la cara · ojos con pupila visible · boca con labios, no una caja de dientes · sin capucha. Si ninguna de las 4 pasa, se ajusta el texto una sola vez (otra tanda); no se pasa a 3D con una que no pase.

## 7. Ajustes de Meshy (iguales para los dos) y coste
Imagen: modelo de más calidad · Pose T · 4 imágenes · ≈ 36 créditos. Image to 3D: Estándar, sin textura, T-Pose, ≈ 20-25. Remesh Adaptativo Alto, 0. Textura PBR 2K con la imagen como guía, ≈ 10. Descargar GLB sin esqueleto. **≈ 66-71 créditos por personaje.** Mirar siempre el precio en pantalla.

**Filtro para elegir imagen:** parece un modelo 3D de videojuego, no dibujo, foto ni juguete · formas simples y lisas, colores apagados y mates · cabeza de tamaño contenido, no redonda · brazos horizontales y cuerpo entero · manos con dedos separados · torso, piel y piernas de claridad distinta · inquieta sin ser terror realista. Si una tanda no da ninguna válida se corrige el texto una sola vez; no se improvisa.

## 8. Orden (no cambia la hoja de ruta)
1. (Hecho) Aprobada como base. 2. Zombi normal: el usuario genera las 4 imágenes y se elige una con Fable (prioridad 3.18). 3. Jugador, cuando toque ART-2 (necesita ART-1 y el aspecto elegido). 4. Los dos juntos en una captura a tamaño de juego: ahí se confirman 4,5 y 5 cabezas (3.3 y 3.19). Corredor, tanque, NPC y piezas heredan estas reglas.
