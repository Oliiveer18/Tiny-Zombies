# DIRECCIÓN ARTÍSTICA HD · «Tiny Troopers en alta definición» (PROPUESTA, Fable/Sonnet, 19 nov 2026)

**Estado: APROBADA por el usuario (19 nov) con tres decisiones** (DECISIONES 3.25-3.28). Es la dirección vigente y sustituye a `DIRECCION_ARTISTICA.md` en proporciones, rostro, acabado e identidad. Se mantienen: cuerpo limpio y equipo como piezas (3.10, 3.14), todo con Meshy, calidad B, cámara Tiny.
1. **Referencias oficiales: AMBAS y complementarias, ninguna sustituye a la otra:** Tiny Troopers y el juego de la captura y el vídeo del usuario (`docs/arte/captura_referencia_18nov.png`, `referencia_video_personaje.png`; el vídeo completo lo guarda el usuario y puede volver a enviarlo). Se estudian siempre juntas.
2. **Sin proporciones rígidas.** Fable elige las que den el resultado más profesional, atractivo y legible desde nuestra cámara (§4); son un objetivo de diseño, y lo que manda es la lectura.
3. **Objetivo: Tiny Troopers en HD** (identidad compacta y reconocible, acabado 3D de alta calidad).
4. **Identidad de los vivos (§6): operadores de extracción y supervivientes veteranos.** Ni civiles indefensos ni soldados de uniforme.

## 1. Por qué el resultado anterior no convenció
El modelo salió de unas **6,5 cabezas, cuerpo largo y fino, cara de dibujo con ojos en blanco y orejas enormes**: lo contrario de Tiny Troopers, cuya fuerza es una **figura corta, ancha y de cabeza grande que se lee de un vistazo desde arriba**. Los textos pedían «sobrio» y «realista simplificado», y eso empujó a Meshy hacia un cuerpo normal. La identidad de Tiny Troopers no estaba en el texto.

## 2. Qué es la identidad de Tiny Troopers (lenguaje, no copia)
1. **Silueta ancha y baja:** hombros anchos y redondeados, brazos gruesos, piernas cortas y fuertes. Se reconoce en negro.
2. **Cabeza y cabeza-equipo grandes** respecto al cuerpo: el casco o el pelo es la masa más legible desde arriba.
3. **Manos y botas sobredimensionadas:** pesan en la silueta y se ven en movimiento.
4. **Cara sencilla de rasgos fuertes:** ceja marcada, ojos claros con pupila, nariz y boca definidas. Pocas formas, bien puestas.
5. **Bloques de color limpios** por prenda, saturación media, un acento por personaje.
6. **Equipo exagerado y legible:** mochila, chaleco y arma con volumen propio.
**Lo que NO se toma:** cabezas de 2-3 cuerpos, ojos de punto, caras de dibujo infantil, plástico brillante.

### 2b. Qué aporta la segunda referencia (captura y vídeo del juego del usuario), estudiada junto a Tiny Troopers
Visto en los fotogramas, a tamaño de juego, desde arriba:
- **Masas por claridad:** casco con funda **claro** (la masa más grande y legible desde arriba) · chaleco **oscuro** con bolsas · mangas y manos **claras** · botas **oscuras**. La figura se entiende por tres o cuatro bloques de valor distinto.
- **Formas redondeadas, lisas y robustas**; ropa y equipo con volumen propio, sin arrugas pequeñas ni relieve fino.
- **Equipo que se lee:** chaleco con bolsas, rodilleras, cinturón con cargadores, arma larga con silueta propia.
- **Colores apagados y mates**, contraste fuerte contra un suelo azul oscuro; sombra suave y corta bajo el personaje.
- **Objetos del mismo lenguaje:** barreras, cajas, bidones y vallas robustos, redondeados y desgastados (óxido, desconchones).
**Cómo se combinan:** de Tiny Troopers, la **proporción y la silueta** (compacto, cabeza y equipo de cabeza grandes, manos y botas fuertes); de la captura, el **acabado, el contraste de valores y el equipo táctico legible**. Cada vez que se dude, se miran las dos.

## 3. «HD» significa calidad de acabado, no más detalle
- **Geometría limpia:** formas esculpidas lisas con **biseles** en las aristas (cogen luz y definen el volumen), sin facetas ni ruido de escultura.
- **Normales suaves y relieve moderado:** pliegues solo grandes (cuello, codos, rodillas, cintura); nada de tejido ni poros.
- **Materiales PBR pintados:** color por prenda casi plano con oclusión suave en huecos, desgaste solo en aristas y bordes, rugosidad alta (0,7-0,9), metal solo en hebillas.
- **Texturas** 2 048 con piezas grandes y margen (`rehacer_textura`, 3.17). Modelo alto guardado; versión de juego sin facetas en silueta.
- Se ve «HD» por **definición limpia de formas y por cómo cogen la luz**, no por cantidad de detalle.

## 4. Proporciones (elegidas por Fable; objetivo de diseño, no regla rígida)
**Decisión:** **vivos ≈ 4 cabezas** y **zombis ≈ 4,5**, con tolerancia de media cabeza. Razón: con nuestra cámara (≈ 105 px de alto) la cabeza-equipo (casco o pelo) es la masa más legible, y a 4 cabezas mide ≈ 26 px y deja sitio a casco, respirador y mochila sin que el personaje se vea como un muñeco; el zombi, a 4,5, queda más flaco y desgarbado sin dejar de ser de la misma familia.
| | Cabeza | Hombros | Piernas | Manos / botas |
|---|---|---|---|---|
| Vivos | ≈ 1/4 de la altura | anchos, redondeados | ≈ 40 % | manos 1,3× · botas 1,4× |
| Zombis | ≈ 2/9 de la altura | algo más estrechos y caídos | ≈ 42 % | manos 1,3× huesudas · pies 1,2× |
**Lo que manda no son las cifras sino la lectura (§9).** Si un modelo con otras proporciones se ve mejor desde nuestra cámara y encaja con las dos referencias, se acepta. La altura en metros sigue sin fijarse.

## 5. Rostros (misma construcción para vivos y zombis)
- Cráneo ancho y firme, mandíbula marcada, **ceja pesada** que da sombra a los ojos.
- **Ojos con iris y pupila visibles**, tamaño medio, nunca en blanco ni de dibujo.
- **Nariz en cuña** clara, sin fosas. **Boca definida** con labios simples; si es de zombi, abierta con pocos dientes, no una hilera.
- **Orejas pequeñas y pegadas** (mitad de la altura de la cara como máximo).
- Zombi = misma cara «vaciada»: mejillas hundidas, aro oscuro bajo los ojos, piel gris verdosa, pelo a parches.
- Vivo: cicatriz, barba corta o pelo como rasgo propio.

## 6. Identidad y equipo de los personajes VIVOS (usuario, 19 nov; DECISIONES 3.27)
**Operadores de extracción y supervivientes veteranos:** acostumbrados a explorar, combatir y saquear zonas peligrosas. Transmiten **experiencia, carácter y preparación**. No son civiles indefensos ni soldados de uniforme: **nada de uniformes militares genéricos**.
- **Ropa:** mezcla de **equipamiento táctico y prendas de supervivencia**: chaqueta reforzada, camisa de trabajo, pantalón cargo, rodilleras y coderas, guantes, botas gruesas, bufandas o pañuelos, brazaletes. Gastada, reparada, con parches y desgaste de uso.
- **Piezas intercambiables (todas independientes del cuerpo, 3.10 y 3.14):**
| Hueco | Piezas |
|---|---|
| Cabeza | casco (táctico, de obra, de moto), gorra, capucha, **respirador o máscara**, gafas o antiparras |
| Pecho | chaleco portaplacas, chaleco de carga, arnés con cargadores, protección improvisada |
| Espalda | mochila de asalto, mochila grande de extracción, bolsa cruzada, rollo de dormir |
| Cintura | cinturón con bolsas y **munición**, funda, **herramientas** (palanca, hacha, cizalla, linterna) |
| Muslo y piernas | fundas, bolsas, rodilleras |
| Hombros y brazos | hombreras, protecciones de antebrazo, brazalete de color |
| Manos | **arma** (fusil, escopeta, pistola, cuerpo a cuerpo) |
- **Diferenciación:** cada personaje combina distinto casco, chaleco, mochila, color de acento y un rasgo de cara o pelo, sobre 2-3 complexiones de cuerpo. Nunca dos con el mismo conjunto.
- **Cada pieza** sigue el mismo lenguaje (§2-§3): volumen redondeado y limpio, color propio por claridad, desgaste en aristas, legible desde arriba.
- **El cuerpo base se genera limpio** (cabeza descubierta, pecho, espalda y cintura lisos) para poder equiparlo; la identidad de operador la dan la ropa del cuerpo y, sobre todo, las piezas.

## 7. Color y materiales por bando
- **Vivos:** paleta A (oliva, arena, carbón, acento naranja óxido). Tonos cálidos, saturación media.
- **Zombis:** fríos y apagados; **la piel es lo más claro**; color de tipo en el torso; sangre rojo oscuro en manchas grandes.
- **Valor mínimo:** ninguna prenda por debajo de un gris medio-oscuro (la ropa muy oscura se funde con el suelo; pasó con los vaqueros del zombi v1).

## 8. Iluminación y sombras (qué se pide al modelo y qué se afina en el juego)
Estado real del juego: sol cálido 1,5 con sombra suave de 2 048, luz hemisférica azulada 0,75, tonos ACES a 0,85, bloom discreto.
- **Modelo:** materiales mates con color y oclusión pintados, sin sombras ni luces horneadas en la textura (la luz la pone el juego).
- **Juego (cuando llegue el primer modelo, no ahora):** luz de relleno mate para personajes (ya existe el mecanismo `relleno`), **sombra de contacto** bajo los pies, borde de luz suave desde atrás para separar del suelo oscuro, sin reflejos de estudio. Los charcos de luz cálida de farola son del escenario y siguen en la hoja de ruta.
- **Prueba:** la que ya se aprobó: captura dentro del juego con nuestra cámara y nuestra luz, comparada con la referencia.

## 9. Criterios de aceptación (actualizados)
Un modelo se acepta solo si cumple **todo** lo siguiente, medido y comparado, no a ojo:
1. **Dentro del juego**, con nuestra cámara y nuestra luz, junto a una captura de las dos referencias (Tiny Troopers y la del usuario): parece del mismo género y calidad.
2. **Silueta en negro** a 105 px: cabeza, hombros, brazos, piernas y botas se distinguen.
3. **Masas por valor** (como la captura): cabeza-equipo, torso, brazos y piernas se separan por claridad, no solo por tono.
4. **Prueba de miniatura:** la imagen o el modelo a 105 px deja leer ceja, ojos y boca, y la prenda frente a la piel.
5. **Rostro:** ojos con iris y pupila, boca con labios, nariz clara, orejas pequeñas y pegadas. Sin ojos en blanco ni dientes en bloque.
6. **Proporciones:** cerca del objetivo del §4 **o mejor leídas**; se miden con script (cabezas, hombros, piernas, orejas) y se informa, pero no son motivo de rechazo por sí solas.
7. **Acabado HD:** formas lisas con biseles, sin facetas en la silueta, textura sin motas con Lupa ×8 (3.17), materiales mates sin brillos de plástico.
8. **Vivo y zombi** se distinguen sin lupa. **Los vivos** se leen como operadores de extracción (equipo táctico + supervivencia), no como civiles ni soldados.
9. **Ni realista, ni muñeco, ni caricatura infantil.**
10. Pose T, una malla cerrada, sin nada colgando (compatible con el esqueleto).
**Filtro antes de gastar créditos en 3D:** la imagen elegida debe pasar 2, 3, 4, 5, 9 y 10. Máximo dos tandas de imágenes por personaje antes de reconsiderar el texto.

## 10. PROMPT DEFINITIVO v3.1 · ZOMBI NORMAL (791 caracteres, para revisar antes de generar)
```
Stylized HD 3D game character, full body, front view, T-pose, arms horizontal, fingers apart, legs slightly apart, grey background. Compact lean adult man, head slightly over one fifth of body height, sloped rounded shoulders, sturdy arms, bony hands, big feet, short strong legs. Clean smooth sculpted forms, soft bevels, simple bold shapes, painted PBR, matte, pale skin against darker clothes. Readable face: heavy brow, dull pale eyes with small pupils, small flat ears, clear nose, defined mouth. Zombie, former civilian: grey-green skin, hollow cheeks, dark eye rings, open mouth, few teeth, patchy hair. Torn slate-blue crew-neck sweatshirt, no hood, dark red stain on one shoulder, bitten forearm, faded grey jeans, one sneaker, one bare foot. Not realistic, not a toy, not childish.
```
Ajuste v3.1 (19 nov): proporción alineada con el zombi (≈ 4,5), hombros caídos y brazos firmes en vez de anchos y gruesos, «pies» en vez de «botas» y ojos pálidos con pupila. Frente a la v2: silueta Tiny Troopers (cabeza = 1/4 de la altura, hombros redondeados, brazos gruesos, manos y botas grandes, piernas cortas) · acabado HD (formas esculpidas con biseles, PBR pintado, mate) · **fuerte contraste claro-oscuro entre piel y ropa**, como la segunda referencia · rostro legible (ceja, ojos con pupila, orejas pequeñas, nariz y boca definidas) · sin capucha · se retira «5 heads tall», que Meshy no respeta. El zombi normal sigue siendo un civil convertido (los zombis son gente convertida; variantes con equipo de operador pueden venir después por re-texturizado).
**Ajustes Meshy:** imagen de más calidad, T-Pose, 4 imágenes (≈ 36 créditos). 3D solo con una imagen que pase el filtro del §9. Remesh adaptativo alto, textura PBR 2K con la imagen como guía.

## 11. Borrador del texto de los VIVOS (cuerpo base de referencia; NO se genera todavía; 794 caracteres)
```
Stylized HD 3D game character, full body, front view, T-pose, arms horizontal, fingers apart, feet apart, grey background. Compact sturdy adult man, head one quarter of body height, broad rounded shoulders, thick arms, oversized gloved hands, heavy boots, short strong legs. Clean smooth sculpted forms, soft bevels, simple bold shapes, painted PBR, matte, strong light-dark contrast. Readable face: heavy brow, eyes with pupils, small flat ears, clear nose, firm mouth, scarred eyebrow, cropped dark hair. Extraction operator and veteran scavenger, not a soldier: worn reinforced olive jacket, sand cargo trousers, charcoal knee pads, dark brown boots and gloves, rust-orange armband. Plain chest, back and belt. Bare head. No vest, no backpack, no helmet, no weapon. Not realistic, not a toy.
```
Cuerpo limpio de **operador de extracción**; el equipo (casco, respirador, chaleco, mochila, fundas, herramientas, arma) se hace después como piezas con este mismo lenguaje (§6). Se usará cuando toque ART-2, tras aprobar el zombi.
