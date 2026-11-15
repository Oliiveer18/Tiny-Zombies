> ⚠️ Documento de otro proyecto. Menciona a Oli y Lali: en ESTE juego NO existen; ignorar esas menciones. Manda `../DISENO.md`.

# ARTE · dirección artística (Z0.4e, 8 nov 2026)

Estados: ✅ decidido por el usuario · 💡 propuesto por dirección técnica (nada pasa a ✅ sin que el usuario lo diga). Todo lo visual de este documento se comprueba SOLO en el móvil del usuario (el sandbox no carga Three.js).

## 1. Decisión ✅
**Diorama realista envejecido**: el mundo parece una maqueta enorme, hecha a mano con mucho detalle y abandonada hace tiempo (óxido, moho, hiedra, asfalto agrietado, agua turbia, niebla). Elegida por el usuario viendo una referencia (diorama de ruinas en miniatura) y pidiendo identidad propia y única, no copia.
- Se conserva ✅: HD-2D (mundo 3D con cámara inclinada y giro), Oli y Lali, agua y peces.
- Se descarta ✅: pixel art, estética tipo Pokémon, paleta alegre y todo el aspecto de la plantilla Criaturas/Albanota. Las opciones A/B/C de `DISENO.md` §10 quedan sustituidas por este documento.
- Los documentos heredados `BIBLIA_VISUAL.md`, `REGLAS_DE_LUZ.md` y `ESTANDAR_SOMBREADO.md` describen el estilo viejo: no mandan. Se archivarán (sin borrar) cuando se implemente `src/estilo.js` (§10).

## 2. Idea propia (lo que nos hace únicos) 💡
**El mundo es una maqueta abandonada; tu refugio es lo único cuidado y con luz cálida.** Todo lo que construyes se ve más limpio, más claro y más vivo que lo que lo rodea. El jugador lee el mapa por contraste: gris-ocre y verde sucio = mundo muerto; ámbar, madera clara, agua limpia y verde fresco = vida y refugio.
Reglas que lo sostienen:
1. **Color = vida.** Lo apagado domina; solo tienen color vivo las luces cálidas (fuego, farolas, ventanas), el agua limpia, las plantas sanas, los supervivientes y las piezas del refugio.
2. **Materiales con historia.** Nada es liso: cada superficie lleva desgaste (óxido, moho, polvo, grietas, manchas).
3. **La naturaleza recupera.** Hiedra, musgo y hierba alta crecen sobre lo abandonado; más cuanto más antiguo el lugar.
4. **Luz local.** Lo importante se ve por luz cálida (farolas, ventanas, fuego) sobre una base fría y neblinosa.
5. **Profundidad por niebla.** Sensación de objeto pequeño y detallado con niebla y viñeta suaves, sin desenfoque de miniatura ni borde de diorama.

6. **Satisfacción visual.** Que dé gusto mirarlo y tocarlo: mucha riqueza de textura, luz con carácter y respuesta visual en cada acción (§15). Apagado no significa aburrido.

> Nota: la hoguera y el fuego son una propuesta provisional (`CONSTRUCCION.md`). Ninguna regla de este documento depende de ellos: «color = vida» y «luz local» valen con cualquier fuente cálida.

## 3. Paleta 💡 (provisional; se ajusta en el paso E)
| Uso | Color | Hex orientativo |
|---|---|---|
| Asfalto y hormigón | gris azulado | `#5d6468` |
| Tierra y ladrillo | ocre apagado | `#8a6e4b` |
| Óxido | marrón rojizo | `#8c4a2f` |
| Musgo y hierba sucia | verde apagado | `#6b7a4a` |
| Hojas sanas (vida) | verde fresco | `#7fa04f` |
| Madera nueva (refugio) | miel claro | `#c9a36a` |
| Fuego y farolas | ámbar | `#f2a33a` |
| Agua estancada | verde turbio | `#5b6e63` |
| Agua limpia (pozo) | azul verdoso | `#5fa0b4` |
| Niebla de día | gris cálido | `#c9c8c0` |
| Noche | azul petróleo | `#1a2328` |
Regla: ≥70 % de la pantalla en los cinco primeros tonos; los acentos (ámbar, verde fresco, azul limpio, madera nueva) no pasan del 15 %.

## 4. Luz y atmósfera 💡
- Día: nublado difuso, sombras suaves y largas, niebla ligera que sube en el fondo.
- Atardecer (inicio de partida, `CONSTRUCCION.md`): cielo ocre, sombras alargadas, las luces cálidas empiezan a destacar.
- Noche: LEGIBLE ✅ (decisión del usuario). Base azul petróleo con luz ambiente mínima (≈35-40 % del día), y luz cálida con halo donde hay fuego o farolas. El peligro viene de ver menos lejos (niebla), no de una pantalla oscura.
- Clima y estaciones (paso 18): cambian paleta, niebla y partículas por uniform, sin rehacer assets.

## 5. Materiales y texturas 💡
Texturas procedurales por código (sin descargas), de 128×128 o 256×256, SUAVIZADAS (nada de `NearestFilter` ni pixel). Cada material se compone de capas: base de color + variación de tono + manchas + desgaste de bordes.
| Material | Receta | Dónde |
|---|---|---|
| Asfalto | gris base, grietas ramificadas, parches de tierra y hierba en las grietas, marcas de carretera borradas | calles, carreteras |
| Hormigón | gris, manchas de humedad, bordes desportillados | edificios, muros |
| Ladrillo | hiladas con juntas sucias, ladrillos sueltos | fachadas, torres |
| Madera vieja | vetas, grietas, grisácea | edificios, vallas |
| Metal oxidado | marrón rojizo sobre gris, goteos | vehículos, techos |
| Tierra y hierba | ruido de dos escalas, briznas dispersas | suelo |
| Hiedra y musgo | manchas verdes que trepan desde la base y las grietas | paredes, ruinas |
| Agua | color por profundidad, brillo suave, objetos hundidos | pozo, ríos, charcos |
| Madera nueva (refugio) | miel claro, vetas limpias, sin musgo | piezas del refugio |
Desgaste = parámetro 0-1 por lugar y por pieza (los lugares viejos tienen más; el refugio parte de 0 y se ensucia con el uso).

## 6. Formas y volúmenes 💡
- Volúmenes con bisel pequeño y asimetría ligera: nada es una caja perfecta. Tejados hundidos, paredes con huecos, vallas torcidas.
- Siluetas muy legibles desde la cámara inclinada (el jugador distingue refugio, zombi, árbol y escombro de un vistazo).
- Detalle fino por textura y pequeños objetos sueltos (cajas, cubos, papeles), no por muchos triángulos.

## 7. Personajes, zombis y vegetación 💡
- **Oli y Lali**: mismo método de figura por piezas, pero con proporciones de «figurita de maqueta» y materiales de tela y piel con sombreado suave; ropa de superviviente con un toque de color vivo para leerlos siempre.
- **Zombis**: silueta inconfundible, tonos fríos (piel gris verdosa, ropa rota y sucia), sin color vivo. Quedan siempre más apagados que los supervivientes. Diseño completo en Z0.4f.
- **Vegetación**: árboles en masas de copa (pocas formas grandes) más hiedra y hierba alta como instancias baratas por chunk; árboles muertos y secos entre los vivos. Presupuesto en §9.
- **Agua y peces**: se conservan; el agua pasa a verde turbio o azul limpio según el lugar.

## 8. Efectos de imagen 💡
| Efecto | Coste móvil | Propuesta |
|---|---|---|
| Niebla | muy bajo | siempre |
| Viñeta suave | bajo | siempre |
| Luz local con halo | bajo | siempre |
| Grano de película | bajo | no (no es nuestro estilo) |
| Desenfoque de bordes tipo miniatura (tilt-shift) | medio-alto | NO ✅ (decisión del usuario) |
No se baja `pixelRatio`, antialiasing ni texturas por defecto (norma del proyecto).

## 9. Presupuesto técnico 💡
- Meta heredada del ROADMAP: ≥58 fps, peor cuadro ≤25 ms, <40 000 triángulos.
- Texturas: un atlas por familia de material (suelo, edificio, vegetación, refugio, personajes), generado al arrancar; sin descargas.
- Vegetación e hiedra por instancias por chunk, no por mallas sueltas.
- Cualquier efecto nuevo se mide con `?debug` antes de dejarlo activo.

## 10. Contrato de estilo (propuesta técnica 💡, no se implementa todavía)
Un único módulo `src/estilo.js` con los datos del aspecto: paleta, luces por hora y clima, niebla, desgaste por material y parámetros de efectos. El pintor HD-2D lee de ahí y no lleva colores a fuego. Así, si se ajusta el estilo tras la prueba E o más adelante, se cambian datos y no código. Se crea en el paso E. **Creado en Z0.4d-12 (subpaso 2 del paso E):** `src/estilo.js` con paleta (§3), luz por momento y por hora de juego (§4), niebla, efectos (§8) y desgaste por material (§5), más `luz(hora)` y `validar()`; todo 💡 provisional. **Cableado en Z0.4d-14 (subpaso 3, primera mitad):** el pintor lee luz, niebla, fondo, viñeta y luces locales de `G.estilo` según la hora; la paleta de materiales aún no se aplica a las texturas. Claro de prueba: `maps/claro_prueba.json` y `dist/zombis_claro.html`.

## 11. Qué se rehace de la plantilla (por prioridad) 💡
**Agendado en Z0.4d-16 como paso 6b del ROADMAP** (decisión ✅ del usuario: empezar ya los assets propios, todo en 3D y creado por código; Oli cambia de forma, no de identidad, ropa ni rostro). El orden de ejecución de 6b es: materiales y suelo, edificios y ruinas, vegetación, props y refugio, personajes, zombi (la lista de abajo es la de prioridad de aspecto, no el orden).
1. Paleta, luz y niebla (`hd2d_pintor.js`) → lo que más cambia el aspecto, con menos esfuerzo.
2. Texturas de suelo (hierba, tierra, asfalto, agua).
3. Edificios y paredes (materiales y roturas).
4. Personajes Oli y Lali (proporciones y materiales).
5. Vegetación (sustituye a los árboles 3D de 96 triángulos).
6. Objetos de mundo y refugio (catálogo propio; el de Albanota se archiva).
7. Zombi base (paso Z0.4f).

## 12. Paso E (prueba de estilo) ✅ cerrado (Z0.4d-15)
**Cierre (usuario, 8 nov 2026):** vio el claro en el móvil (atardecer y noche) y dijo que estaba bastante bien; ✅ como BASE provisional la paleta de §3 y los efectos de §8 (niebla, viñeta, luz local) con los valores de `src/estilo.js`; se reabren y ajustan cuando haya más cosas ingame (hoguera, zombi, edificios). Medida en el móvil (claro, atardecer): 60,4 fps, peor cuadro 19 ms, 0 cuadros >25 ms, 1 392 triángulos, 8 llamadas. La paleta aún no se aplica a las texturas (se hará al rehacer materiales, §11).
Un claro de prueba con la cámara real: suelo, un edificio en ruinas, vegetación, un charco, la hoguera, Oli y un zombi, a hora de atardecer y de noche. El usuario lo ve en su móvil y ajusta paleta y luz. Se mide el coste (`?debug`). Cierre: el usuario marca ✅ la paleta y los efectos.

## 13. Decisiones sobre las preguntas abiertas
- **Borde de diorama**: ninguno, ni en título ni en menús ✅ (usuario).
- **Desenfoque tipo miniatura (tilt-shift)**: no ✅ (usuario). Se queda niebla + viñeta suave, que cuestan casi nada y dan profundidad.
- **Realismo de Oli y Lali** ✅ (el usuario lo aceptó; no quiere hiperrealismo): semirrealista estilizado. Formas simplificadas, proporciones de figurita (cabeza algo mayor, manos y pies legibles), texturas pintadas con desgaste, sin poros ni detalle fotográfico. Motivo: se lee mejor desde la cámara, aguanta el móvil y mantiene el mismo nivel en todo el juego (lo profesional es la coherencia, no el realismo máximo).
- **Noche** ✅ (usuario): siempre legible. Propuesta 💡 para lograrlo: luz ambiente azulada mínima (la pantalla nunca baja de ≈35-40 % del brillo del día), contraste del suelo y siluetas conservado, la luz cálida local (hoguera, farolas) añade ambiente y alcance. El peligro de la noche viene de los zombis y de ver menos lejos (niebla más densa), no de una pantalla negra. Ajuste de brillo nocturno en opciones.

## 15. Satisfacción visual («dopamínico») ✅ intención del usuario · detalle 💡
El usuario quiere que el juego sea visualmente adictivo: que al verlo se note que todo está muy bien texturizado. Se logra con riqueza y respuesta, no con colores chillones:
1. **Texturas densas y variadas**: cada superficie con varias capas (§5) y variación entre piezas iguales, para que nada parezca repetido.
2. **Luz con carácter**: contraluces cálidos, halos de fuego, haces de luz entre la niebla, brillos en el agua y en el metal mojado.
3. **Contraste rico**: sombras profundas y luces cálidas fuertes; el mundo apagado hace que los acentos brillen más.
4. **Respuesta en cada acción** («juice»): polvo y astillas al construir y recolectar, chispas del fuego, pequeño rebote al colocar una pieza, brillo al conseguir recursos, ondas en el agua.
5. **Recompensa visible**: el refugio mejora de aspecto con cada nivel de material (madera → metal) y se ve más cuidado y luminoso que el entorno.
6. **Detalle pequeño por todas partes**: objetos sueltos, papeles, charcos, hojas que se mueven con el viento suave.
Límite: todo con el presupuesto de §9; las partículas y el brillo se miden con `?debug` en el paso E. La paleta de §3 sube un poco de contraste y de saturación en los acentos (ámbar, verde fresco, azul limpio).

## 14. Riesgos
- Esta calidad de referencia es render fotorrealista de PC; en el móvil se busca el mismo espíritu con menos detalle fino. El paso E dice hasta dónde llegamos.
- Muchas texturas procedurales pueden alargar la carga inicial: se mide y se reparte por chunk.
