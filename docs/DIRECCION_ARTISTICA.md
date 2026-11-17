# DIRECCIÓN ARTÍSTICA DE PERSONAJES · lenguaje visual común (Fable, 18 nov 2026)

**Estado: PROPUESTA pendiente del visto bueno del usuario.** No cambia ninguna decisión aprobada: concreta DECISIONES 3.1-3.5, 3.10-3.14, 3.17 y 3.19 en reglas medibles y en dos textos para Meshy. No se gasta ningún crédito hasta que el usuario la apruebe. Hoja visual: `docs/arte/hoja_proporciones.png`.

## 1. La frase que lo resume
**«Figuras de acción talladas, no muñecos ni fotos.»** Adultos compactos hechos de pocos volúmenes grandes con planos y aristas suaves, pintados a mano en bloques de color mate. Lo que se toma de Tiny Troopers es el *oficio* (se leen de un vistazo desde arriba, equipo con volumen, manos y botas con peso); lo que no se toma es su cabeza enorme, su cara de dos puntos ni sus colores.

## 2. Reglas comunes a TODOS los personajes (jugador, NPC y zombis)
| Tema | Regla |
|---|---|
| **Altura** | 1,50 m en el juego, todos. Vivos **4,5 cabezas**; zombis **5 cabezas** (3.3 y 3.19). La media cabeza de diferencia es intencionada: el vivo se ve compacto y fuerte, el muerto consumido y descolgado |
| **Cabeza** | Forma de bloque con esquinas redondeadas, más alta que ancha (ancho 0,75-0,8 de su alto). Nunca esférica. Mandíbula marcada, cráneo plano por detrás |
| **Rostro** | Adulto. **Ceja-visera** continua y pesada que da sombra; **ojos pequeños y hundidos** (≤ 1/6 del ancho de la cara cada uno), nunca grandes ni brillantes; **nariz en cuña corta** de tres planos, sin fosas detalladas; boca = una línea firme con labio inferior marcado; orejas simples pegadas. Todo con volumen real, no pintado |
| **Cuello** | Corto. Grueso en vivos, fino en zombis |
| **Torso** | Trapecio claro: hombros anchos, cintura más estrecha. Clavículas y pecho como planos, sin músculo dibujado |
| **Brazos y piernas** | Cilindros facetados que se ensanchan hacia la mano y la bota. Codo y rodilla marcados con un pliegue o una pieza (rodillera, desgarro) |
| **Manos** | 1,15× lo real, cuatro dedos y pulgar gruesos y separados, sin uñas ni nudillos finos |
| **Pies** | Bota o zapatilla 1,2× lo real, suela gruesa, puntera redonda |
| **Silueta** | Debe reconocerse en negro y a 105 píxeles. Máximo **5 masas**: cabeza, torso, brazos, piernas, pies. Ningún detalle que sobresalga menos de 3 cm cuenta para la silueta |
| **Detalle** | Tres escalas y nada más: **grande** (masas), **medio** (bolsillos, costuras gruesas, cinturón, rodilleras, heridas grandes: 6-10 por personaje) y **fino solo pintado** (desgaste en aristas, suciedad). Nada de poros, tela tejida, arrugas pequeñas ni pelo en mechones |
| **Ropa** | Ceñida, pintada sobre el cuerpo (3.10). Pliegues solo en codos, rodillas y cintura, y grandes |
| **Pelo** | Casquete compacto con 3-5 planos; nunca mechones sueltos |
| **Geometría** | Modelo alto de Meshy guardado. Juego: vivos 8 000-10 000 triángulos, zombis 5 000-8 000 (orientativo; criterio real: silueta sin facetas a tamaño de juego). Una malla cerrada, pose T |
| **Textura** | Pintada a mano: color base plano por pieza + sombra suave en huecos + **luz en aristas** + desgaste localizado. Sin fotografía ni ruido fino. Color, relieve y rugosidad a 2 048, rehecha con `tools/rehacer_textura.mjs` (3.17) |
| **Materiales** | Mate. Rugosidad: tela 0,85 · cuero y goma 0,6 · piel 0,7 · metal solo en hebillas (0,4). Sin brillos de plástico |
| **Color** | 3 colores principales + 1 acento por personaje. Piezas vecinas separadas por **claridad** (una clara junto a una oscura), no solo por tono. Todo más claro que el suelo |
| **Bandos** | **Vivos:** tonos cálidos y limpios, saturación media, un acento vivo. **Zombis:** tonos fríos y apagados, la piel es su zona más clara, un color de tipo en el torso, sangre rojo oscuro en manchas grandes |

## 3. Lectura con nuestra cámara (16,4 m, 58°, ≈ 105 píxeles de alto, visto desde arriba y detrás)
1. Se ve sobre todo **coronilla, hombros, espalda y antebrazos**: ahí va el contraste (pelo o casco contra hombros; acento del jugador en hombro o brazo; mancha del zombi en el hombro).
2. La cabeza ocupa ≈ 23 píxeles: de la cara se leen ceja, sombra de ojos y nariz como tres manchas. Por eso se modelan en grande y no se pinta detalle fino.
3. Un detalle medio (bolsillo, rodillera) ocupa 6-10 píxeles: se ve. Uno fino, 1-2: se convierte en ruido. Por eso solo tres escalas.
4. Prueba de aprobación de cualquier modelo: captura a tamaño de juego junto al otro bando y sobre el suelo; debe distinguirse quién es quién sin lupa.

## 4. Por qué el personaje provisional no alcanza el estilo
| Regla | Provisional | Resultado |
|---|---|---|
| 4,5 cabezas | ≈ 3 cabezas, cabeza de 1/3 del cuerpo | Niño o muñeco |
| Cabeza en bloque, rostro adulto | Redonda, ojos grandes, sin ceja ni mandíbula | Cara de juguete |
| Miembros que se ensanchan | Brazos y piernas cortos; botas, rodilleras y guantes como globos | Proporción de figura de plástico |
| 3 colores + acento por claridad | Verde azulado saturado, amarillo oliva y gris de claridad parecida | Se lee como un bloque, sin jerarquía ni bando |
| Planos y aristas | Formas blandas, derretidas al reducir | Sin carácter a 105 píxeles |
| Equipo como piezas | Ninguno | No parece un combatiente |
| Textura en pocas piezas con margen | 304 trocitos sin margen | Motas (corregido solo con la herramienta) |
Sigue en el juego únicamente como relleno (3.4).

## 5. Propuesta: JUGADOR (cuerpo de referencia de los vivos)
Superviviente con equipo militar reunido a trozos, serio, curtido. Paleta A de 009 §3 (la B o la C se cambian en dos palabras del texto).
- **Medidas:** 4,5 cabezas · hombros 1,7 cabezas · cintura 1,2 · piernas 2 cabezas · manos a medio muslo · cuello corto y ancho.
- **Cabeza:** mandíbula cuadrada, ceja pesada, nariz en cuña, pelo oscuro rapado, barba de dos días pintada.
- **Ropa (pintada):** chaqueta de campaña verde oliva ceñida · pantalón cargo arena · botas y guantes marrón oscuro · rodilleras gris carbón · **brazalete naranja óxido** (acento del jugador, visible desde arriba).
- **Sin** casco, chaleco, mochila ni arma: son piezas aparte (3.14) y se harán con este mismo lenguaje.

**Texto para Meshy (771 caracteres):**
```
Stylized 3D action game character, full body, front view, strict T-pose, arms horizontal, palms down, fingers apart, feet apart, plain light grey background, flat studio light. Compact robust adult, 4.5 heads tall, broad shoulders, short thick neck, thick forearms, large hands, large boots. Chiseled head: square jaw, heavy brow, small deep-set eyes, short wedge nose, firm mouth, cropped dark hair, stubble. Bold simple volumes, beveled planes, hand-painted matte texture, big flat color blocks, light edge wear. Male survivor, bare head: fitted olive green field jacket, sand cargo trousers, dark brown boots and gloves, charcoal knee pads, rust-orange armband. No helmet, vest, backpack or weapon. Not photorealistic, not cartoon, not chibi, not toy, not 2D. No text.
```

## 6. Propuesta: ZOMBI NORMAL
Hombre corriente convertido hace poco. Mismas reglas de cabeza, manos, facetas y pintura; cambia la masa.
- **Medidas:** 5 cabezas · hombros 1,4 cabezas y caídos · cuello fino · brazos largos (manos casi a la rodilla) · manos huesudas del mismo tamaño que las del jugador.
- **Cabeza:** mismas piezas que el jugador pero vaciadas: mejillas hundidas, cuencas oscuras, sin labios y con dientes, pelo a parches.
- **Color:** piel gris verdosa clara · sudadera **azul grisáceo** (tipo normal) · vaqueros grises · sangre rojo oscuro en un hombro · mordedura en un antebrazo · una zapatilla y un pie descalzo.

**Texto para Meshy (788 caracteres; sustituye al del 17 nov):**
```
Stylized 3D action game character, full body, front view, strict T-pose, arms horizontal, palms down, fingers apart, feet apart, plain light grey background, flat studio light. Gaunt adult, 5 heads tall, narrow sloped shoulders, thin neck, long arms, large bony hands. Chiseled head: hollow cheeks, heavy brow, sunken dark eye sockets, short wedge nose, lipless mouth with teeth, patchy dark hair. Bold simple volumes, beveled planes, hand-painted matte texture, big flat color blocks. Zombie, former civilian man: pale grey-green skin, tight torn slate-blue sweatshirt, large dark red stain on one shoulder, deep bite wound on one forearm, faded grey jeans, one worn sneaker, one bare foot. No loose cloth, no weapon. Not photorealistic, not cartoon, not chibi, not toy, not 2D. No text.
```

## 7. Ajustes de Meshy (iguales para los dos) y coste
Imagen: modelo de más calidad · Pose T · 4 imágenes · ≈ 36 créditos. Image to 3D: Estándar, sin textura, T-Pose, ≈ 20-25. Remesh Adaptativo Alto, 0. Textura PBR 2K con la imagen como guía, ≈ 10. Descargar GLB sin esqueleto. **≈ 66-71 créditos por personaje.** Mirar siempre el precio en pantalla.

**Filtro para elegir imagen (las siete deben cumplirse):** cabeza en bloque, no redonda · ojos pequeños bajo ceja · nariz en cuña · manos y pies grandes con dedos separados · brazos horizontales y cuerpo entero · bloques de color limpios · parece un modelo 3D, no dibujo ni foto. Si una tanda no da ninguna válida se corrige el texto una sola vez; no se improvisa.

## 8. Orden (no cambia la hoja de ruta)
1. El usuario aprueba o corrige este documento. 2. Zombi normal (prioridad 3.18). 3. Jugador, cuando toque ART-2 (necesita ART-1 y el aspecto elegido). 4. Los dos juntos en una captura a tamaño de juego: ahí se confirman 4,5 y 5 cabezas (3.3 y 3.19). Corredor, tanque, NPC y piezas heredan estas reglas.
