# 008 · Reorientación visual y técnica (informe; nada implementado)

Encargo directo del usuario (17 nov). Origen de cada dato: **[C]** leído en el código o en los archivos · **[D]** documentos del proyecto · **[R]** razonamiento propio · 💡 cifra de partida · ⚠️ sin verificar. ✅ = decisión ya aprobada por el usuario · 🆕 = propuesta nueva de este informe.

## 1. Estado actual (lo que hay de verdad en `main`)
- **Motor:** Three.js 0.170 + Vite, 22 módulos pequeños en `src/` (82 KB) [C]. Simulación ya bastante separada del dibujo (`sim.js`, `physics.js`), datos en JSON (`objetos`, `materiales`, `lugares/callejon_01`).
- **Cámara:** una sola constante, `OFF = (0, 7,6, 4,9)`, campo de visión 38° → a 9,0 m del jugador y 57° de inclinación, sin adelanto [C: `renderer.js`, `game.js`]. La de Tiny original era `(0, 14, 8,6)`: 16,4 m y 58° [D]. Hay barras `?debug` para moverla.
- **Personajes:** un único modelo real, `jugador_a.glb` (Meshy, 4 000 triángulos, 20 huesos con nombres `mixamorig`, estilo «juguete» de ~3 cabezas) y `anims/humano.glb` con 8 clips de Meshy [C]. Zombis, corredor, tanque y todos los objetos son **relleno** (cápsulas y cajas) [C: `public/models`]. El almacén de piezas (006) tiene herramientas y carpetas, pero está vacío.
- **Animación:** el jugador mezcla a mano 8 clips por pesos, con la cadencia atada a la velocidad real (pies sin patinar) y un apaño: gira el cuerpo 90° porque el clip de disparo es de lado [C: `player.js`]. Los zombis usan un fundido simple entre clips [C: `assets.js`]. No hay sistema común.
- **Escenario:** callejón como datos, muros de 3,2 m, física propia, rotura, bidones, farolas, trozos, marcas de bala y sangre, suelo por código con aceras y calcos (C1-C4, S1) [C].
- **Arte en curso:** `MESHY_PEDIDOS.md` ya pide «estilizado de juego móvil, ~5 cabezas, cabeza algo grande» tras rechazar el juguete y el fotorrealista [D]. Zombi A pedido, aún no recibido.
- **Sin medir:** ningún paso se ha medido todavía en el iPhone 14 [D: `REGISTRO.md`].

## 2. Diferencias con la nueva dirección
| Tema | Hoy | Nueva dirección | Choque |
|---|---|---|---|
| Referencia | Vídeo de un cenital táctico industrial [D] | Tiny Troopers (Joint Ops / Global Ops), identidad propia | Cambia `REFERENCIA_VISUAL.md`; el arte propio se mantiene ✅ |
| Cámara | Cerca: 9 m, jugador ≈ 1/5 del alto 💡. Decidida ✅ el 16 nov, y norma 1 de `CLAUDE.md` | Elevada, personajes pequeños, se ve más escenario | **Revierte una decisión ✅ de ayer**: hay que cambiar la norma 1. Técnicamente es volver hacia la cámara de Tiny original |
| Proporciones | Jugador actual ~3 cabezas (juguete) | Intermedio: compacto, cabeza algo grande, no infantil | El jugador actual no encaja. `MESHY_PEDIDOS.md` (~5 cabezas) ya va en esa línea: se retoca, no se rehace |
| Detalle del equipo | Presupuesto pensado para personaje grande (006) | Detalle en casco, mochila, chaleco, arma | Con el personaje a ~80 px 💡 el detalle fino de textura no se ve: tiene que estar en la **forma y el contraste de color** |
| Animación | Mezcla a mano solo en el jugador | Sistema reutilizable con capas, transiciones y toques procedurales | Falta el sistema común (ya previsto en parte: 007 §7) |
| Mapa | Compacto 14 × 20 m ✅ (16 nov) | Más escenario visible | Con cámara elevada se ven ≈ 24 × 13 m 💡: el mapa compacto cabría casi entero en pantalla. Hay que redecidir su tamaño (§5, decisión 3) |
| Juego | Supervivencia de mundo abierto, sin oleadas ✅ | No lo cambia | Ninguno: Tiny Troopers es referencia de imagen y cámara, no de diseño |

## 3. Qué se aprovecha (casi todo)
- **Se conserva sin tocar:** física, rotura, trozos, marcas, suelo por código, ruido y estados diseñados (004, 007), datos JSON, mando y menú Controles, medidor `?debug`, herramientas `prep_player`, `prep_pieza`, `split_anims`, almacén de piezas (006) y su formato.
- **La mezcla de animación del jugador** (pesos + cadencia atada a la velocidad) es la base correcta: se generaliza, no se tira.
- **Esqueleto:** el rig de Meshy ya usa los nombres de Mixamo [C: `prep_player.mjs`] y los clips ya están en un archivo compartido (P1). Es justo lo que hace falta para reutilizar animaciones.
- **Cámara:** cambiarla es tocar una constante; ya hay barras para probarla en el móvil.
- **Lo que no vale:** el aspecto del jugador actual (pasa a NPC o se sustituye, ya anotado [D]), el clip «Side_Shot» y el giro de 90°.

## 4. Qué hay que adaptar o desarrollar
**4.1 Cámara, tamaño y escala (se deciden juntos).** 🆕 Tres propuestas para elegir en el móvil con las barras: A «Tiny original» 16,4 m / 58°; B intermedia 13 m / 60°; C alta 18 m / 62°. Objetivo 💡: personaje = 1/10 a 1/12 del alto de pantalla. Consecuencias reales en el código:
- Velocidades, retícula (hoy a 8 m), distancia de granada y zona de sombras están afinadas para la cámara cercana [C: `MOVE`]: se reajustan con una barra, no se reescriben.
- Se ve más → más objetos y personajes a la vez. Hace obligatorias las dos reglas de la 007 §2 (objetos por zona con recorte; personajes lejanos apagados).
- **Muros que tapan:** con cámara inclinada, un muro de 3,2 m al sur del jugador lo oculta, y hoy no hay nada que lo evite [C: `alley.js`]. 🆕 Regla: los muros entre la cámara y el jugador se dibujan bajos (≤ 1,2 m) o se funden.
- **Tabla de escala** 🆕: los objetos están a escala «juguete» (el coche mide 2,6 m [C]). Con personajes más proporcionados hay que fijar una tabla (personaje, puerta, muro, coche, caja) antes de pedir más modelos a Meshy.
- **«Ocho direcciones»** [R]: el movimiento con joystick ya es libre (mejor que 8 direcciones). Lo interpreto como: el cuerpo mira a donde apunta y las piernas andan de frente, de espaldas o de lado según hacia dónde se mueve. Eso son 4 clips que se mezclan en las diagonales.

**4.2 Personajes y Meshy ↔ Mixamo.** Mixamo es gratis (cuenta de Adobe) ✅ sin dependencia de pago.
| Modelo | ¿Sirve con Mixamo? |
|---|---|
| Humanoides de Meshy en pose A/T, brazos y piernas separados (jugador, NPC, zombis) | **Probable, no garantizado** ⚠️. Los nombres de hueso coinciden, pero la postura de reposo del rig de Meshy puede no ser la de Mixamo. Se comprueba con una prueba de 0 créditos (R2). Si falla, el plan B es dejar que Mixamo ponga su propio esqueleto al modelo (también gratis) |
| Humanoides con mochila, capa o arma fundidas en la malla, o brazos pegados al cuerpo | **No** de forma fiable: el auto-esqueleto se confunde. Por eso el equipo va como piezas rígidas aparte (006 ✅) |
| Casco, chaleco, mochila, arma, objetos | No necesitan esqueleto: se pegan a un hueso (006) |
| Criaturas no humanoides (futuro) | No: esqueleto y animaciones propias |
- **Presupuesto con cámara elevada** 🆕 [R]: a ~80 px de alto, 4 000 triángulos en el jugador sobran. Propuesta: jugador 3 000 + piezas 1 500; NPC 2 000 + piezas 800; zombi 800. Menos por personaje = más personajes en pantalla, que es lo que pide esta cámara. El detalle se consigue con formas claras, piezas con volumen y metal/rugosidad reales (006 P6).

**4.3 Sistema de animación** 🆕 (un módulo nuevo y pequeño, `anim.js`, usado por jugador, NPC y zombis):
- **Clips, una sola vez por familia** (`humano.glb`, `zombi.glb`): reposo, andar de frente / espaldas / izquierda / derecha, correr, apuntar, recargar, golpe recibido, tambaleo, 2 muertes (hacia delante y hacia atrás).
- **Dos mitades** (007 §7): piernas = movimiento; torso y brazos = apuntar / recargar. Permite «moverse mientras apunta y dispara» sin un clip por combinación.
- **Mezcla por pesos y cadencia atada a la velocidad**: lo que ya hace el jugador [C], sacado a un sitio común y descrito como datos.
- **Capa procedural** (barata, por código, sin clips): torso que gira hacia donde apuntas, retroceso al disparar, inclinación al acelerar, frenar y cambiar de dirección, cabeza que mira al objetivo, balanceo del arma, sacudida al recibir un impacto, bajar y subir el arma al cambiarla.
- **IK: no ahora** [R]. El mundo es plano ✅ (los pies no necesitan corrección) y a ~80 px no se ve si la mano izquierda toca el arma. Se reserva solo para los primeros planos del creador de personaje. Así se evita su coste por personaje.
- **Lo que no hace falta como clip:** frenar, girar y cambiar de arma salen de la capa procedural; a este tamaño de personaje no se distinguen de un clip.

**4.4 Escenario y presentación.** Se mantiene lo hecho. Añadir: regla de muros (4.1), tabla de escala, una sola luz con sombra bien ajustada a la zona visible, y sombra redonda pintada para los zombis si la medición lo pide (003 §1 opción c). Efectos de disparo, impacto y explosión ya existen [C]; con la cámara lejos hay que agrandar chispas y fogonazo ≈ × 1,5 💡 para que se lean.

**4.5 Rendimiento.** Topes propuestos 💡 para medir en el iPhone 14: 40 zombis activos ✅ + 6 humanos; huesos por personaje 20 [C]; animación a mitad de frecuencia para los que estén a más de 12 m y parada fuera de pantalla; una luz con sombra; texturas 1024 jugador, 512 el resto (006); carga inicial solo de lo que usa el lugar. **Pendiente previo:** medir de una vez en el iPhone lo ya hecho; sin esa cifra todo lo anterior es estimación.

## 5. Nueva planificación
No se abre otra hoja de ruta: es una **pista «R»** que se intercala en el trabajo del mapa de prueba. El hito A del `ROADMAP.md` (regiones, guardado, etc.) no cambia. Pasos ya planificados que **se reutilizan, no se duplican**: P3-P7 (006), V1-V9 y C5-C10 (007), T1-T7 (004).

| # | Entrega | Esf. | Depende de | Criterio de aceptación |
|---|---|---|---|---|
| R0 | Documentos: nueva referencia, cambio de la norma 1 (cámara), retoque del texto de Meshy, tabla de escala | LOW | tu aprobación | Ningún documento contradice a otro |
| R1 | **Cámara:** 3 propuestas elegibles en el móvil + reajuste de velocidad, retícula y sombras | LOW | R0 | Personaje a 1/10-1/12 del alto; fps igual que antes; tú eliges una |
| R2 | **Prueba Mixamo** (0 créditos): un clip de Mixamo sobre `jugador_a` | LOW | — | Pies a < 3 cm del suelo, sin miembros torcidos; si falla, plan B documentado |
| R3 | Primer personaje del estilo nuevo (el zombi A ya pedido) pasado por las herramientas y visto con la cámara nueva | LOW | R1 + modelo | ≤ 800 triángulos; se distingue del suelo a tamaño de juego; tú lo apruebas |
| R4 | `anim.js`: dos mitades + tabla de estados, aplicado al jugador; se quita el giro de 90° (= V9 de la 007, adelantado) | MED | R2, clips nuevos, P4 (arma) | Parado y disparando en 4 direcciones queda erguido y de frente; pies sin patinar |
| R5 | Capa procedural: giro de torso, retroceso, inclinación, sacudida, cambio de arma | LOW | R4 | Cada efecto con su barra; se puede apagar; 0 clips nuevos |
| R6 | Zombis y NPC sobre `anim.js` + animación reducida para los lejanos | LOW | R4 | 40 zombis: coste de animación medido y apuntado |
| R7 | Escenario: muros que no tapan + escala aplicada al callejón | LOW | R1 | El jugador se ve siempre, pegado a cualquier muro |
| R8 | Medición en iPhone 14 con la cámara nueva | LOW | R1-R7 | ≥ 58 fps, peor cuadro ≤ 25 ms, triángulos apuntados |
Después sigue lo ya planificado: V1 (mapa), V4 (reja), V5 (ruido), C6-C8, T1-T7.

**Decisiones que necesito de ti** (la 1 y la 2 son cambios de decisiones ✅ anteriores):
1. **Cámara elevada** en lugar de la cercana del 16 nov. Recomiendo SÍ y elegirla en el móvil entre A, B y C.
2. **Norma 1 de `CLAUDE.md`:** que diga «cámara elevada tipo Tiny Troopers» en vez de «más cerca». Recomiendo SÍ.
3. **Tamaño del mapa de prueba:** el compacto de 14 × 20 m cabría casi entero en pantalla. Recomiendo ≈ 30 × 40 m (entre el compacto y el largo de la 007).
4. **Mixamo como fuente de animaciones** (gratis). Recomiendo SÍ, tras la prueba R2.
5. **Sin IK por ahora.** Recomiendo SÍ.

## 6. Primera entrega recomendada: R1 (cámara)
Es barata, reversible y **decide todo lo demás**: el tamaño del personaje en pantalla fija cuántos triángulos merece cada modelo, qué detalle se ve, la escala del escenario y el tamaño del mapa. Conviene elegirla antes de gastar más créditos de Meshy. En paralelo, tú puedes hacer la parte manual de R2 (descargar un clip de Mixamo), que no cuesta créditos.
