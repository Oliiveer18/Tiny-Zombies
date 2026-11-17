# CALIDAD GRÁFICA · máxima calidad con rendimiento fluido, por medición

Decisión del usuario (17 nov 2026): **no se recortan polígonos, texturas, sombras ni detalle para cumplir un número arbitrario.** El objetivo es la mejor imagen posible que el móvil mueva con fluidez, y eso se averigua midiendo. Origen de cada dato: **[C]** código · **[M]** medición real · **[R]** razonamiento · 💡 por medir.

## 1. Qué era el «límite de 40 000 triángulos»
- **Qué medía:** todos los triángulos que el juego dibuja en un cuadro, sumando las pasadas (escena + sombras + pasadas de pantalla). Es de **escena completa**, no por modelo ni por personaje [C: `debug.js`, `renderer.info.render.triangles`].
- **Dónde estaba aplicado:** en ningún sitio del juego. Solo era (a) una frase en la norma 2 de `CLAUDE.md`, `DISENO.md` §12 y `ROADMAP.md`, y (b) un color rojo en el medidor `?debug` al pasar de 40 000 [C]. Nada se recorta ni se desactiva por él.
- **De dónde salió:** heredado de otro proyecto del usuario (un motor distinto, por casillas) y copiado el 15 nov como propuesta 💡. **Nunca se justificó con una prueba en este juego.** La respuesta 003 ya avisó de que no era compatible con buena calidad.
- **Veredicto: arbitrario. Queda retirado como límite** (ver §4). Estaba empujando a rebajar modelos sin motivo.

## 2. Primera medición real [M] (iPhone del usuario, 17 nov, cámara Tiny, mapa de prueba; captura en `coordinacion/mediciones/2026-11-17_iphone_camara_tiny.jpg`)
| Dato | Valor | Lectura |
|---|---|---|
| fps | 58 | En el tope de la pantalla (60) |
| Trabajo de CPU por cuadro | 2,0 ms (máx. 3,0) | De 16,7 ms disponibles: **se usa el 12 %** |
| Peor cuadro en 5 s | 27 ms | Un tropiezo aislado, con el panel de barras abierto encima; hay que repetirlo con el panel cerrado |
| Triángulos | 30 404 | Casi todo es el jugador (dos pasadas) y el suelo |
| Zombis | 12 (relleno) | |
Conclusión: con 30 000 triángulos el móvil va sobrado de CPU. No hay ningún dato que diga que 40 000 sea el techo; el techo real está por medir (§5).
**Dato importante:** la captura está en **vertical**. En vertical el personaje mide ≈ 105 píxeles (no 49) y se ven ≈ 4,6-7,1 m de ancho × 14 m de fondo. Vertical es la orientación oficial desde el 17 nov (reversible): las mediciones y la prueba de carga se hacen en vertical.

## 3. Qué cuesta de verdad en un móvil (de más a menos, para este juego) [R]
| Cosa | Dónde pesa | Cuánto importa aquí |
|---|---|---|
| **Píxeles**: resolución × antialias (MSAA 4) × pasadas de pantalla (bloom, tono) | GPU | **Lo que más.** Hoy 780 × 1 688 con MSAA 4 y bloom [C]. Subir a resolución nativa (×3) multiplica los píxeles por 2,25 |
| **Sombras**: se dibuja todo lo que proyecta sombra otra vez + suavizado por píxel | GPU | Alto. Una sola luz con sombra, mapa 1 024 en móvil [C] |
| **Llamadas de dibujo** (objetos distintos por cuadro) | CPU | Medio. Hoy ≈ 70. Hasta unos cientos no se nota; por eso los objetos van instanciados |
| **Transparencias superpuestas** (humo, chispas, marcas, charcos de luz) | GPU | Medio en explosiones |
| **Personajes animados**: huesos y mezcla de animaciones | CPU | Medio con 40 zombis; 20 huesos cada uno [C] |
| **Luces por píxel** (puntuales) | GPU | Medio: cada luz encarece todos los píxeles iluminados. Hoy 2 + sol + cielo |
| **Materiales** (normales, metal, reflejos) | GPU | Bajo-medio: los personajes ocupan pocos píxeles |
| **Triángulos** | GPU | **Bajo.** Un móvil como el iPhone 14 mueve cientos de miles sin problema si las llamadas son pocas |
| **Texturas** | Memoria, no fps | Se controla en MB (💡 tope 150 MB hasta medir), no afecta a la fluidez salvo que se agote la memoria |

Consecuencia: **limitar triángulos era ahorrar en lo más barato.** La calidad que se ve sale de resolución, antialias, luz, sombras, materiales y animación; la silueta de los modelos necesita los triángulos que necesite.

## 4. Reglas vigentes (sustituyen al tope de 40 000)
1. **Los únicos requisitos son de fluidez:** ≥ 58 fps sostenidos y peor cuadro ≤ 25 ms en el móvil de referencia, en la escena más cargada. Triángulos, llamadas y memoria son **indicadores**, no límites.
2. **Calidad primero:** los modelos se hacen con los triángulos y la textura que necesiten para verse bien a tamaño de juego. Guía (no tope): que la silueta no muestre facetas y que el detalle se lea en una captura real. No se piden modelos «bajos» a Meshy por sistema.
3. **Presupuestos = medición.** Los presupuestos de escena saldrán de la prueba de carga (§5): se fija el 60 % del techo medido, para dejar margen a móviles más modestos y a escenas con explosiones.
4. **Nadie rebaja calidad por su cuenta.** Si un paquete no llega a los fps, Sonnet NO reduce resolución, bloom, sombras, triángulos ni texturas: abre un bloqueo con la medición. Las rebajas las propone Fable y las decide el usuario viendo dos capturas (antes / después).
5. **Primero se elimina el desperdicio** (no se ve en pantalla y es gratis): no dibujar ni animar lo que está fuera de la vista, instanciar objetos repetidos, no proyectar sombra desde lo diminuto (chispas, trozos), reutilizar esqueletos, animaciones y materiales, cargar solo lo que usa el lugar.
6. **Orden de actuación si falta rendimiento** (cada escalón solo si el anterior no basta): desperdicio (regla 5) → animación a media frecuencia en personajes lejanos → menos luces puntuales simultáneas → ajustar la zona de sombras a lo visible → y solo con decisión del usuario: sombras, bloom, resolución, modelos.
7. **Subir calidad también se prueba:** con el margen medido, la prueba de carga comprobará resolución nativa, sombras de 2 048 y más luces, para usar lo que el móvil permita.
8. **Móviles modestos:** el juego elegirá un nivel de calidad al arrancar (alto / medio) según lo que mida en los primeros segundos; el nivel alto es el de referencia y nunca se rebaja para igualar al bajo. Se implementa cuando haya modelos reales (no ahora).

## 5. Prueba de carga gráfica (paquete PAQ-G1)
Un modo `?carga` que, en el propio móvil, va añadiendo triángulos, personajes animados, luces y opciones de calidad, y escribe una tabla con los fps de cada escalón. Dura ≈ 90 s; el usuario manda una captura. Con ella Fable fija los presupuestos reales (regla 3) y las opciones de calidad por defecto (regla 7). Hasta entonces **no hay presupuesto numérico por escena**.

## 6. Orientación para el arte mientras no hay medición (guía, no tope)
Personaje jugable 5 000-10 000 triángulos con textura 1 024 (color, normales, metal y rugosidad) · NPC y zombi 2 500-5 000 con 512-1 024 · piezas (casco, chaleco, mochila, arma) 500-1 500 · objeto de escenario 300-1 500 · coche o edificio 2 000-6 000. De Meshy se guarda siempre el modelo alto en `arte_fuente/`; la versión de juego se saca con las herramientas del repositorio y se puede rehacer más rica o más ligera sin gastar créditos.
