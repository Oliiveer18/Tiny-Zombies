> ⚠️ Documento de otro proyecto. Menciona a Oli y Lali: en ESTE juego NO existen; ignorar esas menciones. Manda `../DISENO.md`.

# CONSTRUCCION · recursos, construcción e inicio (Z0.4c, 8 nov 2026)

Estados: ✅ decidido por el usuario · 💡 propuesto por dirección técnica (el usuario lo corrige). Todo este documento es PROVISIONAL. Enlaza con `IDENTIDAD.md` (pilares) y `MUNDO.md` (recursos por lugar). No se hacen tutoriales por ahora ✅: el juego se entiende por sí mismo.

## 1. Principios
- Construcción libre, casilla a casilla, que crece desde cero hasta un complejo ✅.
- Realista pero jugable en móvil 💡: regla estructural simple, sin simulación física: cada pieza debe apoyarse en el suelo o conectarse a otra pieza ya colocada; un techo necesita muros que lo sostengan.
- Sin tutorial 💡: lo recogible se distingue a simple vista, la vista previa verde/roja dice si cabe, el coste se ve en la propia pieza.

## 2. Recursos y recolección 💡
| Recurso | Cómo se obtiene | Herramienta |
|---|---|---|
| Palos, piedras sueltas, fibra y hierba seca, chatarra suelta | Del suelo, con las manos | Ninguna |
| Agua | Pozo, río o lago con botella | Botella |
| Madera | Árboles muertos, tablones de ruinas, muebles rotos | Hacha |
| Piedra | Rocas y canteras | Pico o martillo |
| Metal y piezas | Coches, desguace, gasolinera | Alicates o llave |
| Tela y cuerda | Ropa vieja, casas, cobertizos | Cuchillo |
| Clavos y herramientas | Ferretería, cobertizos, desmontar tablones | — |
- **Herramientas** 💡: cuchillo (se empieza con él ✅), hacha, martillo, pico, pala, alicates. Se desgastan y se reparan o se sustituyen.
- **Mochila** 💡: capacidad limitada por peso; los almacenes de la base (cajas) guardan el resto.

## 3. Piezas construibles 💡
- **Estructura:** suelo, muro, puerta, ventana, techo, escalera, valla, portón.
- **Estaciones:** hoguera, mesa de trabajo, banco de herramientas, cocina u horno, cama, caja de almacén, depósito de agua, huerto, corral, torre de vigía, trampas, farola o antorcha.
- **Mobiliario:** mesa, silla, estantería, catre.
- **Niveles de material:** 0 improvisado (ramas, lonas, chatarra) → 1 madera → 2 piedra y ladrillo → 3 metal y refuerzos. Cada pieza tiene vida (resistencia); los zombis atacan lo más débil; se repara con materiales; el clima la desgasta.
- **Desmontar** recupera parte del material (propuesta: la mitad).

## 4. Cómo se coloca 💡
Botón de modo construcción · selector por categoría · vista previa verde/roja · arrastrar para hacer líneas y rellenos · girar · deshacer · coste visible. En móvil: botones grandes, uso con el pulgar. En coop cualquier jugador construye; cada colocación es una orden más.

## 5. Estancias 💡
Un espacio cerrado (muros, techo y puerta) se reconoce solo y toma el tipo de lo que hay dentro: dormitorio (cama), cocina (horno), enfermería (camilla), almacén (cajas), taller (mesa de trabajo). Cada tipo da una ventaja sencilla (descanso, comida, curación, capacidad). Los NPC usan las estancias según su rol.

## 6. Crafteo 💡
- **A mano** (sin estación): antorcha, vendaje, trampa simple, cuerda.
- **Con estación:** mesa de trabajo (piezas y herramientas), banco (armas), horno (comida), etc.
- **Recetas:** un cuaderno que crece al encontrar planos y libros o al tener los materiales; sin menús enormes.

## 7. Progresión del refugio 💡
1. Hoguera y primeras piezas · 2. Primer cuarto cerrado con puerta · 3. Cabaña con estancias · 4. Base defendida (vallas, torres, trampas) · 5. Complejo con huerto, corral y compañeros (NPC). Cada nivel se desbloquea por lo que construyes y por quién vive contigo, no por un árbol de habilidades.

## 8. Defensa 💡
Las noches traen más zombis con los días; atacan por ruido, luz y movimiento; rompen piezas flojas. Los NPC con rol de soldado defienden; las trampas y vallas ayudan; el diseño de los zombis va en su propio documento.

## 9. Inicio de la partida 💡 (el cuchillo es ✅)
Del título (Continuar, Solo, Coop; en solitario se elige Oli o Lali ✅) se pasa a un claro al **atardecer**. La mochila lleva un mechero o cerillas, una lata, una botella de agua y una cuerda, y **un cuchillo** ✅ para enfrentarse a los zombis la primera noche. Se recogen palos, piedras y hierba seca, se hace la **primera hoguera** y se pasa una **noche acotada** (1-3 zombis lentos y débiles, los mismos siempre). La hoguera da luz, calor y cocina, **no es un escudo**: los zombis se acercan al ruido y al movimiento. Al amanecer empieza la construcción. El pozo es solo un elemento más del paisaje, no el centro del inicio. La primera noche exige un zombi básico y el combate con cuchillo, que se adelantan en el ROADMAP.

## 10. Técnica (para respetar desde ya)
Cada pieza es un dato por casilla (capa y valor) guardado como cambio `[x,z,capa,valor]` (guardado v2); el suelo y las paredes se repintan solo por chunk sucio; habrá un presupuesto de piezas por chunk, a medir en el móvil; los jugadores van por id (solo y coop).

## 11. Decisiones que quedan para el usuario
Ritmo (más realista o más rápido) · si recolectar necesita siempre herramienta · peso de la mochila sí o no · cuántos niveles de material · si desmontar devuelve la mitad · detalle de las estancias.
