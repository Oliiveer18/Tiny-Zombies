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

## 2c. Tercera medición real [M]: prueba de carga v2, orden inverso y resistencia (v0.1.92, 17 nov; capturas `coordinacion/mediciones/2026-11-17_*_v0.1.92.png`)
**Cómo leer estos datos (dos efectos del móvil que explican las rarezas de §2b)**
1. **El móvil tiene «dos marchas».** Con la misma escena base da 53-56 fps al principio y 60 más tarde, y en la prueba de resistencia pasó solo de 42-44 a 52 fps en el minuto 7 sin que cambiara nada (bajó a la vez el tiempo de CPU, de 3,2 a 2,6 ms). El sistema sube la potencia cuando lleva un rato con carga. **La contradicción de §2b era esto, no un fallo del juego:** los ajustes se restauran bien (comprobado fila a fila). Las cifras de la marcha baja son el caso desfavorable y son las que se usan para presupuestar.
2. **Los fps van a saltos.** La pantalla es de 60 Hz: si un cuadro no llega a tiempo espera al siguiente refresco. Por eso casi todo cae en «≈ 60» o en una meseta de «≈ 38-43», y de ahí baja poco a poco hasta 30. Una fila en 41 y otra en 58 pueden diferir en muy pocos milisegundos: **la prueba dice bien a qué lado del umbral cae cada cosa, pero no cuánto cuesta exactamente.**

**Conclusiones respaldadas (coinciden en las dos pasadas, directa e inversa)**
| Conclusión | Datos |
|---|---|
| **El objetivo de 40 fps sostenidos se cumple** con los ajustes actuales | 10 minutos con 12 personajes + 4 luces + explosiones: 42-44 fps, luego 52. **Sin caída por calor.** Dos tropiezos aislados (180 y 134 ms) en 10 minutos |
| Hasta **40 personajes pesados** (12 000 triángulos, con sombra) amontonados en pantalla ≈ 40 fps; 80 ≈ 35-38; nunca se bajó de 30 | 40 → 38-41 · 60 → 38-39 · 80 → 35-38 |
| Los 60 fps aguantan hasta ≈ 10 de esos personajes | 10 → 45-53 · 20 → 41-43 |
| La geometría estática es barata | 1,63 millones de triángulos: 43-45 fps |
| Luces y explosiones: coste pequeño | 8 luces: 47-52 · explosiones: como la base |
| **Sombra de 2 048: no cuesta** frente a la de 1 024 | 41-43 frente a 41-42 |
| **Resolución 3 + MSAA 2 rinde igual que lo actual** (res 2 + MSAA 4) y es más nítida | 41 y 41 frente a 41-42 |
| **Resolución 2 + MSAA 2 pasa al lado de los 60** | 58 y 58 frente a 41-42 |
| Resolución 3 + MSAA 4: descartada | 30 y 30 |
| Quitar bloom o sombras también cruzaría a 60, pero es perder calidad: **no se propone** | 57 · 50-54 |

**Juego real (4,1 minutos jugando el mapa de prueba, v0.1.92, calidad A):** media **55 fps**, el 1 % de cuadros más lentos a 40 fps, **1 % del tiempo por debajo de 40 y 0 % por debajo de 30**. Objetivo cumplido también jugando, con 12 zombis de relleno quietos; falta repetirlo cuando los zombis se muevan (PAQ-03) y con modelos definitivos.

**Lo que sigue sin respuesta**
- **Qué parte del personaje cuesta.** Las seis variantes con 40 personajes dan todas ≈ 40 fps (meseta): ni la sombra, ni la animación, ni el amontonamiento por separado bastan para cruzar a 60. El descarte por cámara dio 47 en una pasada y 41 en la otra: no concluyente (aunque reduce los triángulos dibujados casi a la mitad, así que se aplicará igual: es gratis).
- El coste exacto en milisegundos de cada opción (efecto 2). Si hiciera falta afinar, la prueba tendría que buscar umbrales (cuánta carga hasta perder los 60) en vez de medir fps.

**Presupuestos provisionales (regla 3: 60 % de la carga que deja el móvil en 40 fps; indicadores, no límites)**
- **Personajes animados en pantalla a la vez: ≈ 24** con el peso actual (12 000 triángulos y sombra). El juego prevé como mucho 40 zombis activos y en vertical se ve solo una parte: cabe.
- Geometría estática: sin presupuesto (no se encontró el techo con 1,6 millones de triángulos).
- Luces puntuales: hasta 8 sin problema.
- Se revisan cuando haya modelos y zombis definitivos.

**Ajustes gráficos: opciones para que elija el usuario** (selector «Calidad gráfica» en el menú ⚙; por defecto sigue «A»)
| Opción | Qué es | Con 20 personajes |
|---|---|---|
| **A · Actual** | Resolución 2, MSAA 4, sombra 1 024 | 41 fps |
| **B · Nítida** | Resolución nativa (3), MSAA 2, sombra 2 048 | 41 fps: igual de fluida, imagen más definida |
| **C · Fluida** | Resolución 2, MSAA 2, sombra 2 048 | 58 fps: bordes algo menos suaves |
Recomendación de Fable: mirar B y C en el móvil; si en C no se nota diferencia en los bordes, C; si se nota, B. La elección es del usuario (regla 4).

## 2d. Comparación de calidades y defecto de costuras (17 nov, tras probarlo el usuario)
- **¿Las opciones A/B/C aplican cambios reales? Sí** [comprobado]: B dibuja 1 170 × 2 097 píxeles con suavizado ×2 y sombra 2 048; A y C dibujan 780 × 1 398 (A suavizado ×4 y sombra 1 024; C suavizado ×2 y sombra 2 048). El usuario no las distingue a tamaño normal porque la pantalla del iPhone tiene los píxeles muy pequeños. **Eso es un dato útil** (C daría 58 fps sin pérdida apreciable), pero no se aprueba nada hasta que él lo vea.
- **Para verlo:** menú ⚙ → «Comparar gráficos» → barra con A/B/C, **lupa ×4 y ×8** (amplía el centro de la imagen enseñando los píxeles reales) y la línea con los valores reales en uso. La elección no se guarda: el juego arranca siempre en A.
- **Defecto del personaje (motas claras en camiseta, pelo, botas y pantalón al ampliar):** reproducido. **Causa:** la textura que entregó Meshy son cientos de trocitos de colores distintos pegados sin margen; cuando el personaje se ve pequeño, la textura reducida mezcla cada trozo con sus vecinos (piel junto a camiseta, etc.) y aparecen motas en las costuras. No depende del suavizado de bordes (sale igual con y sin él). De cerca de verdad (cámara pegada) no aparece, porque entonces la textura se lee entera.
- **Corrección aplicada (no cambia el estilo ni rebaja nada):** la textura de los modelos se lee un nivel y medio más nítida y con más filtrado, y las coordenadas se toman dentro de cada triángulo. En las capturas las motas se reducen mucho, sin desaparecer del todo. **No comprobado:** que no añada parpadeo en movimiento en el iPhone (por eso la barra permite alternar «corregidas / sin corregir»).
- **Solución definitiva:** es un defecto del modelo de relleno, que se va a sustituir. Para los modelos definitivos pasa a ser requisito (DECISIONES 3.17): textura reorganizada en piezas grandes con margen y repintada por la herramienta, y aprobación con captura con lupa.
- El «pixelado» en escalones de la captura del usuario es la ampliación de una imagen dibujada a resolución 2 en una pantalla de 3: con B (resolución nativa) se reduce; se ve con la lupa.

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
