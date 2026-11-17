# DIRECCIÓN ARTÍSTICA HD · «Tiny Troopers en alta definición» (PROPUESTA, Fable/Sonnet, 19 nov 2026)

**Estado: PROPUESTA para revisar y aprobar. No se ha cambiado el juego ni las decisiones vigentes.** Si se aprueba, sustituye a `DIRECCION_ARTISTICA.md` en proporciones, rostro y acabado (y revierte DECISIONES 3.20: la referencia vuelve a ser Tiny Troopers, ahora en HD). Se mantienen: personajes vivos = supervivientes veteranos, no soldados (3.23), cuerpo limpio y equipo como piezas (3.10, 3.14), todo con Meshy, calidad B, cámara Tiny.

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

## 3. «HD» significa calidad de acabado, no más detalle
- **Geometría limpia:** formas esculpidas lisas con **biseles** en las aristas (cogen luz y definen el volumen), sin facetas ni ruido de escultura.
- **Normales suaves y relieve moderado:** pliegues solo grandes (cuello, codos, rodillas, cintura); nada de tejido ni poros.
- **Materiales PBR pintados:** color por prenda casi plano con oclusión suave en huecos, desgaste solo en aristas y bordes, rugosidad alta (0,7-0,9), metal solo en hebillas.
- **Texturas** 2 048 con piezas grandes y margen (`rehacer_textura`, 3.17). Modelo alto guardado; versión de juego sin facetas en silueta.
- Se ve «HD» por **definición limpia de formas y por cómo cogen la luz**, no por cantidad de detalle.

## 4. Proporciones (dentro del margen 4-5 cabezas ya aprobado en 3.2)
| | Cabezas | Cabeza | Hombros | Piernas | Manos / botas |
|---|---|---|---|---|---|
| **Vivos** | **4** | 1/4 de la altura, algo más ancha que el cuello ×2 | 1,9 cabezas | 40 % de la altura | manos 1,3× · botas 1,4× |
| **Zombis** | **4,5** | 2/9 de la altura | 1,6 cabezas, caídos | 42 % | manos 1,3× (huesudas) · pie 1,2× |
Esto **cambia lo aprobado el 18 nov (vivos 4,5 y zombi 5)**: es la decisión principal de este documento. Desde nuestra cámara (≈ 105 px de alto) la cabeza mide ≈ 26 px (vivo) y ≈ 23 px (zombi): la cara se lee como tres zonas (ceja, ojos, boca). La diferencia de media cabeza hace al zombi más flaco y desgarbado sin cambiar de familia. La altura en metros sigue sin fijarse (3.21).

## 5. Rostros (misma construcción para vivos y zombis)
- Cráneo ancho y firme, mandíbula marcada, **ceja pesada** que da sombra a los ojos.
- **Ojos con iris y pupila visibles**, tamaño medio, nunca en blanco ni de dibujo.
- **Nariz en cuña** clara, sin fosas. **Boca definida** con labios simples; si es de zombi, abierta con pocos dientes, no una hilera.
- **Orejas pequeñas y pegadas** (mitad de la altura de la cara como máximo).
- Zombi = misma cara «vaciada»: mejillas hundidas, aro oscuro bajo los ojos, piel gris verdosa, pelo a parches.
- Vivo: cicatriz, barba corta o pelo como rasgo propio.

## 6. Ropa y equipo
- **Vivos (3.23):** ropa funcional y gastada, por capas legibles: chaqueta reforzada, pantalón cargo, rodilleras, guantes, botas gruesas. Cuerpo limpio; casco, chaleco, mochila, fundas y arma son **piezas aparte** con volumen y color propios (casco y mochila: lo más visible desde arriba).
- **Zombis:** una prenda reconocible por tipo, rota con **un desgarro grande y una mancha grande** (no mil detalles). Normal: sudadera de cuello redondo azul grisáceo, sin capucha. Corredor: ropa deportiva, amarillo ocre. Tanque: mono de trabajo, rojo teja.
- Todo ceñido o corto: nada que cuelgue más de un palmo.

## 7. Color y materiales por bando
- **Vivos:** paleta A (oliva, arena, carbón, acento naranja óxido). Tonos cálidos, saturación media.
- **Zombis:** fríos y apagados; **la piel es lo más claro**; color de tipo en el torso; sangre rojo oscuro en manchas grandes.
- **Valor mínimo:** ninguna prenda por debajo de un gris medio-oscuro (la ropa muy oscura se funde con el suelo; pasó con los vaqueros del zombi v1).

## 8. Iluminación y sombras (qué se pide al modelo y qué se afina en el juego)
Estado real del juego: sol cálido 1,5 con sombra suave de 2 048, luz hemisférica azulada 0,75, tonos ACES a 0,85, bloom discreto.
- **Modelo:** materiales mates con color y oclusión pintados, sin sombras ni luces horneadas en la textura (la luz la pone el juego).
- **Juego (cuando llegue el primer modelo, no ahora):** luz de relleno mate para personajes (ya existe el mecanismo `relleno`), **sombra de contacto** bajo los pies, borde de luz suave desde atrás para separar del suelo oscuro, sin reflejos de estudio. Los charcos de luz cálida de farola son del escenario y siguen en la hoja de ruta.
- **Prueba:** la que ya se aprobó: captura dentro del juego con nuestra cámara y nuestra luz, comparada con la referencia.

## 9. Cómo se lee desde nuestra cámara (criterio de aceptación, medido)
1. **Silueta en negro** a 105 px: se distinguen cabeza, hombros, brazos, piernas y botas.
2. **Prueba de miniatura:** la imagen de Meshy reducida a 105 px de alto debe dejar leer ceja, ojos y boca como manchas, y la prenda y la piel como bloques distintos.
3. **Vivo y zombi** se distinguen sin lupa por color, piel y postura.
4. Medidas del modelo (se calculan con un script, no a ojo): cabezas de alto, ancho de hombros, longitud de piernas, orejas.

## 10. Texto de Meshy para el ZOMBI NORMAL v3 (786 caracteres)
```
Stylized HD 3D game character, full body, front view, T-pose, arms horizontal, fingers apart, feet apart, grey background. Compact sturdy adult man, 4.5 heads tall, head one quarter of body height, broad rounded shoulders, thick arms, oversized hands and boots, short strong legs. Clean smooth sculpted forms, bevelled edges, simple bold shapes, painted PBR look, matte. Readable face: strong brow, eyes with pupils, small flat ears, clear nose, defined mouth. Zombie, former civilian: pale grey-green skin, hollow cheeks, dark eye rings, open mouth with simple lips, few teeth, patchy dark hair. Torn slate-blue crew-neck sweatshirt, no hood, dark red stain on one shoulder, bitten forearm, faded grey jeans, one sneaker, one bare foot. Not realistic, not a toy, not childish. No text.
```
Qué cambia frente a la v2: 4,5 cabezas con «cabeza = un cuarto de la altura», hombros anchos, brazos gruesos, manos y botas grandes y piernas cortas (silueta Tiny Troopers) · formas esculpidas con biseles y aspecto PBR pintado (calidad HD) · cara con ceja, ojos con pupila, orejas pequeñas, nariz y boca definidas · sin capucha. Se retira «sober dark top-down shooter», que empujaba a un cuerpo realista.
**Ajustes Meshy:** igual que antes (imagen de más calidad, T-Pose, 4 imágenes ≈ 36 créditos; 3D solo con una imagen que pase el filtro del §9 y de las medidas; remesh adaptativo alto; textura PBR 2K). Máximo dos tandas de imágenes antes de reconsiderar el texto.

## 11. Qué hace falta que apruebes
1. **Proporciones:** vivos 4 cabezas y zombis 4,5 (recomendado) · o mantener 4,5 y 5.
2. **Referencia principal:** Tiny Troopers en HD (esto revierte 3.20) · o seguir con la captura.
3. Texto v3 del zombi.
Con tu visto bueno actualizo `DECISIONES.md`, `CLAUDE.md` y `DIRECCION_ARTISTICA.md`, sin tocar el juego. Nada se genera hasta entonces.
