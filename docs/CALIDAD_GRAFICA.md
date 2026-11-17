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

## 2b. Segunda medición real [M]: prueba de carga v0.1.91 (17 nov; datos en `coordinacion/mediciones/2026-11-17_carga_v0.1.91.md`)
**Qué está respaldado**
| Conclusión | Dato | Solidez |
|---|---|---|
| Los triángulos estáticos son baratos | De 27 000 a 1 627 000 triángulos (× 60): de 51 a 43 fps | **Alta.** Confirma que el tope de 40 000 era arbitrario |
| La animación NO es un problema de CPU | 80 personajes: 6,6 ms de CPU de 25 disponibles a 40 fps (≈ 0,055 ms por personaje) | **Alta** |
| Las explosiones no cuestan | 52 fps, igual que la base | Alta |
| Las luces puntuales cuestan poco | 8 luces: de ≈ 50 a 45 fps | Media (la diferencia es parecida al ruido) |
| Resolución 3 con MSAA 4 es demasiado cara | 33 fps con la escena vacía, frente a 60 sin MSAA | **Alta en el sentido** (es la opción más cara de todas); la cifra exacta, no |
| El juego base cumple el objetivo de 40 | 43-52 fps en todos los escalones sin personajes añadidos | Alta |

**Qué NO está respaldado y hay que repetir**
1. **Hay una contradicción en los datos.** La base (res 2 + MSAA 4 + sombra 1 024) da 51 fps; «res 2 + MSAA 4 + sombra **2 048**» (lo mismo pero más caro) da 60. No puede ser. Explicaciones posibles: (a) el móvil sube la potencia de la gráfica cuando le llega una carga fuerte y luego la mantiene, así que los escalones del final salen favorecidos; (b) algún ajuste no se restaura bien entre escalones (la tabla no apunta qué ajustes había de verdad en cada fila); (c) variación normal de ± 15 % entre tramos de 3 s. Mientras no se aclare, **los cinco escalones de calidad y el combinado no sirven para decidir**.
2. **El combinado (39 fps) va mejor que «40 personajes» solo (38)** teniendo más carga: misma sospecha.
3. **Todo lo que marca 60 está recortado por la pantalla.** «60» significa «60 o más»: no dice cuánto margen queda. Por eso no se puede saber cuánto cuestan el bloom, las sombras ni el MSAA con la resolución actual.
4. **La curva de personajes es rara:** 10 → 48, 20 → 40, y luego casi plana (38, 37, 34). Un coste real por personaje daría una bajada regular. Además la prueba no dice **qué parte** del personaje cuesta (dibujarlo, su sombra, o que estén amontonados unos sobre otros).
5. **Esos «personajes» pesan 12 000 triángulos cada uno y se dibujan dos veces** (imagen y sombra): 80 son casi 2 millones de triángulos animados, todos juntos en pantalla. Es mucho más duro que el juego real (como mucho 40 zombis, y en vertical solo se ven los que caben en ≈ 6 × 14 m).
6. La base anterior (v0.1.81) dio 58 fps y esta 51 con menos píxeles: entre sesiones hay variación (temperatura, batería, Safari con barras).
7. **Nada mide el rendimiento sostenido.** Son tramos de 3 s; el objetivo es 40 fps *sostenidos* y un móvil caliente baja de potencia a los pocos minutos.

**Hallazgo de código [C]:** los personajes animados tienen desactivado el descarte por cámara (`assets.js`: `frustumCulled=false`), así que **se dibujan y proyectan sombra aunque estén fuera de pantalla**. Es desperdicio puro (regla 5) y probablemente lo más rentable de arreglar.

**Lectura provisional (no es un presupuesto):** con los ajustes actuales el móvil aguanta ≈ 20 personajes de 12 000 triángulos amontonados en pantalla a 40 fps, y más de 1,6 millones de triángulos estáticos. No se fija ninguna cifra hasta PAQ-G2.

**Ajustes gráficos en móvil (propuesta; nada se cambia hasta PAQ-G2 y elección del usuario)**
- Se mantiene lo actual (resolución 2, MSAA 4, bloom, sombra 1 024): cumple los 40 fps.
- Descartado como opción por defecto: resolución 3 + MSAA 4.
- **Candidato a mejora de calidad:** resolución nativa (3) con un suavizado de bordes más barato (MSAA 2). Daría imagen más nítida que la actual; hay que medirlo bajo carga y que el usuario compare capturas.
- Candidato: sombra de 2 048 (más definida), si se confirma que no cuesta.
- **Resolución adaptable solo hacia arriba:** usar resolución 3 cuando sobre rendimiento y volver a la actual (2) cuando la escena se cargue. Nunca baja de la calidad de hoy. Requiere aprobación del usuario.

**Personajes y animación: cómo optimizar sin perder calidad** (en orden; cada paso se valida con PAQ-G2)
1. No dibujar ni sombrear personajes fuera de pantalla (hallazgo de código). Invisible.
2. Ajustar la zona de sombras a lo que se ve. Invisible, y además las sombras salen más definidas.
3. **Detalle acorde al tamaño en pantalla:** un personaje ocupa ≈ 105 × 40 píxeles; con 12 000 triángulos hay varios triángulos por píxel, que no se pueden ver y además producen parpadeo. La herramienta de personajes generará dos versiones del modelo alto: la de juego (los triángulos que se distinguen a ese tamaño; se acepta solo si una captura a tamaño real es indistinguible de la del modelo alto) y la de primer plano para el creador de personaje. No es un tope: es no gastar donde no se ve.
4. Animación a media frecuencia en personajes lejanos y esqueleto de 25 huesos en zombis (ya previsto en 009 §7.6). La CPU no es el problema hoy, así que esto es reserva.
5. Dibujar muchos zombis iguales en una sola llamada: solo si las llamadas llegan a pesar (hoy no: 218 llamadas, 6,6 ms).

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
1. **Los únicos requisitos son de fluidez:** **mínimo 30 fps · objetivo sostenido 40 fps · meta ideal 60 fps** (usuario, 17 nov; los 60 no son obligatorios si exigen sacrificar calidad visual); peor cuadro ≤ 33 ms; en el móvil de referencia y en la escena más cargada. Triángulos, llamadas y memoria son **indicadores**, no límites.
2. **Calidad primero:** los modelos se hacen con los triángulos y la textura que necesiten para verse bien a tamaño de juego. Guía (no tope): que la silueta no muestre facetas y que el detalle se lea en una captura real. No se piden modelos «bajos» a Meshy por sistema.
3. **Presupuestos = medición.** Los presupuestos de escena saldrán de la prueba de carga (§5): se fija el 60 % de la carga con la que el móvil baja a 40 fps, para dejar margen a móviles más modestos y a escenas con explosiones.
4. **Nadie rebaja calidad por su cuenta.** Si un paquete no llega a los fps, Sonnet NO reduce resolución, bloom, sombras, triángulos ni texturas: abre un bloqueo con la medición. Las rebajas las propone Fable y las decide el usuario viendo dos capturas (antes / después).
5. **Primero se elimina el desperdicio** (no se ve en pantalla y es gratis): no dibujar ni animar lo que está fuera de la vista, instanciar objetos repetidos, no proyectar sombra desde lo diminuto (chispas, trozos), reutilizar esqueletos, animaciones y materiales, cargar solo lo que usa el lugar.
6. **Orden de actuación si falta rendimiento** (cada escalón solo si el anterior no basta): desperdicio (regla 5) → animación a media frecuencia en personajes lejanos → menos luces puntuales simultáneas → ajustar la zona de sombras a lo visible → y solo con decisión del usuario: sombras, bloom, resolución, modelos.
7. **Subir calidad también se prueba:** con el margen medido, la prueba de carga comprobará resolución nativa, sombras de 2 048 y más luces, para usar lo que el móvil permita.
8. **Móviles modestos:** el juego elegirá un nivel de calidad al arrancar (alto / medio) según lo que mida en los primeros segundos; el nivel alto es el de referencia y nunca se rebaja para igualar al bajo. Se implementa cuando haya modelos reales (no ahora).

## 5. Prueba de carga gráfica (paquete PAQ-G1)
Un modo `?carga` que, en el propio móvil, va añadiendo triángulos, personajes animados, luces y opciones de calidad, y escribe una tabla con los fps de cada escalón. Dura ≈ 90 s; el usuario manda una captura. Con ella Fable fija los presupuestos reales (regla 3) y las opciones de calidad por defecto (regla 7). Hasta entonces **no hay presupuesto numérico por escena**.
**Estado (17 nov):** hecha una vez (§2b); sus resultados son contradictorios en la parte de calidad. Se repite con la versión 2 de la prueba (PAQ-G2), que añade controles, calidad medida bajo carga, desglose del coste de los personajes y una prueba de 10 minutos.

## 6. Orientación para el arte mientras no hay medición (guía, no tope)
Personaje jugable 5 000-10 000 triángulos con textura 1 024 (color, normales, metal y rugosidad) · NPC y zombi 2 500-5 000 con 512-1 024 · piezas (casco, chaleco, mochila, arma) 500-1 500 · objeto de escenario 300-1 500 · coche o edificio 2 000-6 000. De Meshy se guarda siempre el modelo alto en `arte_fuente/`; la versión de juego se saca con las herramientas del repositorio y se puede rehacer más rica o más ligera sin gastar créditos.
