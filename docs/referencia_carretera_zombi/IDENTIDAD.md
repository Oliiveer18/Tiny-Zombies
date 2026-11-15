> ⚠️ Documento de otro proyecto. Menciona a Oli y Lali: en ESTE juego NO existen; ignorar esas menciones. Manda `../DISENO.md`.

# IDENTIDAD · qué es este juego (Z0.4a, 8 nov 2026)

Estados: ✅ decidido por el usuario · 💡 propuesto por dirección técnica (nada pasa a ✅ sin que el usuario lo diga).

## 0. Nombre ✅
**Endless Aftermath** (decidido por el usuario, 8 nov 2026): «el después sin fin». Comprobación rápida de búsqueda: no hay un juego con ese nombre exacto, pero «Aftermath» está muy usado (p. ej. *Surviving the Aftermath*, de Paradox); antes de publicar hay que revisar tiendas y registro de marcas. Es el título en inglés; la interfaz sigue en español.

## 1. Visión
Supervivencia de mundo abierto en un **apocalipsis zombi** con escenarios mezclados (costa, campo, pueblo, ruinas) ✅. Lo central es **tu refugio**: lo montas desde cero, al aire libre y con total libertad, y lo haces cada vez más grande ✅. Juego muy libre, realista y profesional ✅. Una partida se juega solo o en cooperativo, y la misma partida admite las dos formas sin perder nada ✅.

## 2. Qué se conserva y qué se descarta
- **Se conserva** ✅: estilo HD-2D, Oli y Lali, y las mejores ideas del juego anterior: agua y peces (mejorables).
- **Se descarta** ✅: la plantilla de Criaturas/Albanota (nombres, paleta alegre, catálogo de objetos `albanota_objetos.js` e `interiores_objetos.js`, mapas fijos de pueblo). Se sustituye por contenido propio; el código viejo no se borra, se archiva al reemplazarlo.
- **Dirección artística** ✅ (intención del usuario): nueva, de temática apocalipsis y zombi, menos pixelada y no tipo Pokémon, con mucha calidad visual. Si ninguna dirección encaja, se mantiene la técnica actual pero se rehace todo el contenido y la temática (suelo, objetos, colores). Se trabaja en los pasos Z0.4e, E y Z0.4f del ROADMAP.
- **Estilo visual** ✅ (Z0.4e): diorama realista envejecido; detalle y paleta en `docs/ARTE.md` (paleta y efectos 💡, se ajustan en el paso E).
- **Estilo visual y paleta (antes)**: pendientes del paso E (`DISENO.md` §10). Tono provisional 💡: colores apagados y cálidos, naturaleza que recupera lo abandonado, agua y vida como contraste.

## 3. Pilares
1. **El refugio** ✅. Construcción libre casilla a casilla; intuitiva y profesional (ver §6).
2. **Los compañeros (NPC)** ✅. Supervivientes que encuentras en el mundo, rescatas y llevas a tu base; cada uno con un rol y un trabajo (ver §5).
3. **Un mundo realista** ✅. Cada lugar tiene sentido: quién estuvo allí, qué quedó, qué peligro hay.

## 4. El inicio
- Empiezas con casi nada, en un **claro llano y siempre libre con un pozo** al lado (agua desde el minuto uno) ✅.
- Espacio suficiente para el refugio hasta su tamaño final ✅. Propuesta 💡: claro garantizado de **64×64 casillas** (4×4 chunks de dibujo, 2×2 regiones), con el pozo en un lateral y la entrada del camino por otro; **sin límite duro** fuera del claro (se puede construir en cualquier terreno que no sea agua profunda ni lugar diseñado). El freno es de jugabilidad (superficie a defender, NPC necesarios) y de rendimiento (presupuesto de piezas por chunk, a medir en el móvil).
- El primer minuto (guion exacto) se diseña en Z0.4c.

## 5. Compañeros (NPC)
Bucle base ✅ (ejemplo del usuario): encuentras un NPC moribundo en un edificio abandonado → lo llevas al refugio → lo curas, le das ropa y un arma → se queda defendiendo la base cuando vienen zombis.
- Estados al encontrarlos 💡: moribundo, escondido, perdido, atrapado, hostil que se puede convencer.
- Roles ✅ (ejemplos del usuario): médico, soldado, quien busca comida. 💡 Más: constructor, cultivador, pescador, vigía.
- Necesidades 💡: comida, agua, descanso, seguridad; lealtad que sube o baja con cómo los tratas.
- Técnica (norma online): NPC = datos en `est.npcs` con id; comportamiento desde el motor determinista y la semilla; sirve igual en solo y en coop.

## 6. Construcción (principios) 💡
Se entiende sin tutorial: modo construcción con vista previa verde/roja; colocar arrastrando (líneas y rellenos); deshacer y recuperar material; materiales con resistencia (los zombis rompen lo débil); estancias que se reconocen solas por lo que pones dentro (dormitorio, cocina, enfermería). El diseño detallado va en Z0.4e.

## 7. Zonas del mapa 💡 (de seguro a peligroso, alrededor del inicio)
| Zona | Función para el refugio | NPC y peligro |
|---|---|---|
| 1. Claro de inicio | Base, pozo, primeros recursos | Ninguno; aquí se aprende |
| 2. Campo abandonado | Madera, piedra, huertos, caza menor | Algún superviviente perdido; pocos zombis |
| 3. Pueblo y puerto | Botín, herramientas, comida, agua y pesca (aquí vuelven el agua y los peces) | Supervivientes escondidos; grupos pequeños |
| 4. Carretera y ruinas | Materiales de construcción, armas, vehículos abandonados | NPC con rol útil (médico, soldado); peligro alto |
| 5. Zona muerta | El mejor botín | Hordas y niebla; solo con base y compañeros fuertes |
El catálogo completo de lugares, recursos y NPC por zona está en `MUNDO.md`. Los lugares diseñados a mano (casa, gasolinera, granja, hospital, comisaría…) se colocan por regiones (`DISENO.md` §7b) y se diseñan por **quién y qué puedes encontrar** en ellos.

**Cómo conviven zonas y biomas** 💡: las 5 zonas son **niveles de peligro y de NPC según la distancia al claro** (medida en regiones); el **paisaje** (costa, campo, pueblo, ruinas) sale de los biomas por semilla. Cada casilla tiene las dos cosas. El «paisaje típico» de cada zona es una tendencia (pesos del generador), no una regla fija.

## 8. Decisiones que quedan para el usuario
Estilo (paso E: juegos de referencia), tamaño final del claro (64×64 propuesto), nombres de zonas y lugares, lista cerrada de roles de NPC.
