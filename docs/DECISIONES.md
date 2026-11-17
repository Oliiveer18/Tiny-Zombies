# DECISIONES · lo que está decidido y vale HOY

Lista única de decisiones vigentes. **U** = decidida por el usuario (no se cambia sin él). **F** = decidida por Fable por delegación del usuario (17 nov: «resuelve las decisiones técnicas secundarias»); el usuario puede revocarla. Si otro documento contradice a este, manda este. El diseño del juego en detalle sigue en `docs/DISENO.md`.

## 1. Proyecto y forma de trabajar
| # | Decisión | Quién · fecha |
|---|---|---|
| 1.1 | Juego de supervivencia de mundo abierto por regiones, sin oleadas, sobre la base de Tiny Zombies (Three.js). No se empieza otro proyecto | U · 15 nov |
| 1.2 | Fable dirige y planifica; Sonnet implementa. Sistema en `coordinacion/LEEME.md` | U · 17 nov |
| 1.3 | Entregas agrupadas y completas (paquetes). Sin micropasos ni aprobaciones constantes. Se para solo ante decisión importante, riesgo, prueba fundamental fallida o algo irreversible | U · 17 nov (sustituye a «un subpaso por sesión» y «esperar el hazlo») |
| 1.4 | Entrega: todo en GitHub, publicado en `main`, solo si compila. Sin ZIP | U · 15 nov |
| 1.5 | Respuestas al usuario en español, breves, sin tecnicismos; resumen fácil de cada entrega | U |
| 1.6 | Oli y Lali no existen en este juego | U |
| 1.7 | Sin cooperativo por ahora. Online al final (grupo pequeño, mundo compartido), pero todo se diseña ya para ello | U · 15 nov |
| 1.8 | **Por ahora Fable trabaja sin Sonnet y también implementa.** Se mantiene el método: paquetes completos, traspaso con criterios y pruebas antes de programar, documentación al día | U · 17 nov (tarde); matiza 1.2 hasta nuevo aviso |

## 2. Cámara y presentación
| # | Decisión | Quién · fecha |
|---|---|---|
| 2.1 | **Cámara definitiva «Tiny»: 16,4 m, 58°, campo de visión 38°, centrada en el jugador, sin adelanto.** Personaje ≈ 1/16 del alto (≈ 105 píxeles en vertical). Solo se revisa si una prueba importante demuestra un problema | U · 17 nov (sustituye a «cerca», 16 nov) |
| 2.2 | Lo que se ve con ella: 14 m de fondo (5,4 m por detrás del jugador y 8,7 m por delante). De ancho, en **vertical** ≈ 4,6 m abajo y 7,1 m arriba; en horizontal ≈ 21 m y 33 m. Es la medida para diseñar lugares y combates | F · 17 nov (cálculo; corregido tras ver la captura en vertical) |
| 2.3 | Los muros no pueden tapar al jugador: el muro que queda entre la cámara y él se vuelve translúcido | F · 17 nov |
| 2.4 | Sin niebla general. Luz que cambia con hora y clima. Mundo plano | U · 15-16 nov |
| 2.5 | **Calidad máxima con rendimiento fluido.** Objetivos en iPhone 14: **mínimo 30 fps · objetivo sostenido 40 fps · meta ideal 60 fps** (usuario, 17 nov; los 60 no son obligatorios si exigen sacrificar calidad visual). Peor cuadro ≤ 33 ms (equivale al mínimo de 30; cifra de Fable). No se recortan polígonos, texturas, sombras ni detalle para cumplir un número arbitrario | U · 17 nov (sustituye a «≥ 58 fps y ≤ 25 ms») |
| 2.6 | **El tope de 40 000 triángulos queda retirado.** Era de escena completa, solo existía como texto y como aviso de color en el medidor, venía heredado de otro proyecto y nunca se probó. Triángulos, llamadas y memoria pasan a ser indicadores | U + F · 17 nov (cierra la duda de las sombras) |
| 2.7 | Los presupuestos de escena saldrán de una prueba de carga en el móvil (PAQ-G1), fijados al 60 % del techo medido. Hasta entonces no hay presupuesto numérico | F · 17 nov |
| 2.8 | Nadie rebaja calidad por su cuenta: si falta rendimiento, Sonnet abre un bloqueo; las rebajas las decide el usuario con dos capturas. Antes se elimina el desperdicio que no se ve. Orden completo en `docs/CALIDAD_GRAFICA.md` §4 | F · 17 nov |
| 2.9 | **Orientación oficial: VERTICAL** (referencia para diseñar cámara, HUD, mapas y combates y para todas las pruebas). **Reversible:** se reevalúa si las pruebas de jugabilidad y visibilidad lo justifican; por eso nada se construye de forma que impida el horizontal (el juego debe seguir funcionando al girar el móvil) | U · 17 nov |
| 2.10 | Criterios de diseño en vertical: se ven ≈ 4,6-7,1 m de ancho × 14 m de fondo, así que el juego se lee **de abajo arriba**. Lugares y combates se organizan en profundidad (lo importante llega por delante o por detrás del jugador, no por los lados); pasos de ≥ 3 m de ancho; nada importante a menos de 1 m del borde lateral de lo visible; los mandos ocupan el tercio inferior, así que la zona útil de juego es del centro hacia arriba; avisos de peligro lateral fuera de pantalla (marcador en el borde) cuando haya enemigos que disparen | F · 17 nov
| 2.11 | Los presupuestos de escena (2.7) se calculan sobre el **objetivo de 40 fps**: 60 % de la carga con la que el móvil baja a 40. **Aún no se fijan cifras:** la primera prueba de carga (v0.1.91) tiene resultados contradictorios entre sí (`CALIDAD_GRAFICA.md` §2b) y se repite con PAQ-G2 | F · 17 nov |
| 2.12 | (Sustituida por 2.15 en cuanto al ajuste por defecto.) Los ajustes gráficos por defecto del móvil no se cambiaban hasta tener PAQ-G2. «Resolución 3 + MSAA 4» queda descartada como opción por defecto (33 fps con la escena vacía). Cualquier cambio de ajuste lo elige el usuario comparando capturas en su móvil | F · 17 nov |
| 2.13 | Optimización de personajes solo por vías que no cambian lo que se ve: no dibujar ni sombrear los que están fuera de pantalla, detalle acorde a su tamaño en píxeles (comprobado con capturas iguales), animación a media frecuencia en los lejanos | F · 17 nov |
| 2.14 | **Presupuesto provisional: ≈ 24 personajes animados en pantalla a la vez** con el peso actual (indicador, no límite; `CALIDAD_GRAFICA.md` §2c). Geometría estática y luces (hasta 8): sin presupuesto. El objetivo de 40 fps sostenidos está **cumplido** con los ajustes actuales (10 min sin caída por calor) | F · 17 nov (medido) |
| 2.15 | **Calidad gráfica definitiva y única en móvil: «B · Nítida»** (resolución nativa hasta 3, suavizado ×2, sombra 2 048). **A y C quedan descartadas** y retiradas del menú; no se dedican más pruebas a comparar calidades. El usuario da B por aceptada **por decisión propia: la prueba de resistencia de 10 minutos con B NO se hizo** (lo medido de B: 41 fps con 20 personajes pesados en dos pasadas de `?carga`; ≈ 60 fps jugando, según el usuario). En ordenador no cambia nada | **U · 17 nov** |

## 3. Arte y personajes
| # | Decisión | Quién · fecha |
|---|---|---|
| 3.1 | Referencia: Tiny Troopers (Joint Ops / Global Ops), con identidad propia; nada copiado | U · 17 nov |
| 3.2 | Personajes compactos, no infantiles ni de juguete, 4-5 cabezas, cabeza algo grande, equipo militar reconocible, acabado 3D moderno | U · 17 nov |
| 3.3 | Dentro de ese margen se apunta a **4,5 cabezas**. Se confirma con el primer personaje | F · 17 nov · a validar por U |
| 3.4 | El jugador actual (juguete, ~3 cabezas) no es referencia. Sigue en el juego como relleno hasta que haya personaje nuevo | U · 17 nov |
| 3.5 | El primer personaje nuevo es la referencia visual del resto | U · 17 nov |
| 3.6 | **Créditos de Meshy en pausa** hasta cerrar ART-1 (Mixamo) y aprobar las proporciones | U · 17 nov |
| 3.7 | Todos los modelos con Meshy; suelo, texturas de suelo y efectos por código | U |
| 3.8 | Mixamo (gratis) aprobado para una prueba de compatibilidad; si pasa, será la fuente de animaciones | U · 17 nov |
| 3.9 | IK pospuesto | U · 17 nov |
| 3.10 | Ropa = pintura sobre el cuerpo; casco, chaleco, mochila, pelo y arma = piezas rígidas pegadas a un hueso; animaciones compartidas en un archivo por familia | F (006) · aceptada al implementar P1-P2 |
| 3.11 | El personaje va sin nada en las manos; el arma es una pieza | U · 16 nov |
| 3.12 | Sin tope de triángulos ni de textura por modelo. Los modelos se hacen con lo que necesiten para verse bien a tamaño de juego (≈ 105 píxeles de alto); guía orientativa en `docs/CALIDAD_GRAFICA.md` §6. De Meshy se guarda siempre el modelo alto | U + F · 17 nov (sustituye a las cifras rebajadas del mismo día y a 006 §3) |
| 3.13 | **El esqueleto de los humanos lo pone Mixamo** (no Meshy): se sube a Mixamo el cuerpo sin esqueleto y todos los humanos comparten ese esqueleto y sus clips. Meshy hace forma y textura; su esqueleto y sus animaciones quedan de reserva. Jugador y NPC 41 huesos, zombis 25 💡. Se confirma con ART-1 (0 créditos) | F · 17 nov (009 §2; desarrolla 3.8) |
| 3.14 | El cuerpo de referencia se genera **en pose T, sin casco, chaleco, mochila ni arma** (son piezas) y sin nada suelto. Especificación completa en 009 §3 | F · 17 nov |
| 3.15 | **Sistema de animación único** (`anim.js`) para todos los personajes: mezcla continua en 8 direcciones con paso sincronizado, capas independientes de piernas y torso, capa aditiva y capa por código (giro de torso, retroceso, inclinación, mirada). Todo en datos. El disparo no usa clip. Diseño: 009 §7 | U (objetivo) + F (arquitectura) · 17 nov |
| 3.16 | El sistema de animación se construye sobre un relleno con esqueleto de Mixamo **antes** de tener el personaje definitivo; los créditos de Meshy se desbloquean al aceptar ART-1 y elegir el usuario el aspecto | F · 17 nov (concreta 3.6) |
| 3.17 | **Requisito de textura para todo modelo definitivo:** la textura debe tener pocas piezas grandes con margen entre ellas (≥ 8 píxeles a 2 048). Las texturas que entrega Meshy (cientos de trocitos pegados sin margen) producen motas claras en las costuras al verse el modelo pequeño. La herramienta de personajes reorganizará y volverá a pintar la textura antes de dar un modelo por bueno, y cada modelo se aprueba con una captura con lupa | F · 17 nov (defecto visto por el usuario en el relleno) |
| 3.18 | **Siguiente prioridad: modelos de zombis**, antes que el personaje del jugador. Primer modelo: zombi normal; no se hacen variantes hasta aprobarlo. Especificación completa: `coordinacion/RESPUESTAS_FABLE/010_zombis.md` | U · 17 nov |
| 3.19 | Zombis: personas convertidas, creíbles, nada infantil ni cabezón ni de juguete; **5 cabezas** 💡; pose T neutra (la postura la pone la animación); un color identificativo por tipo; esqueleto de Mixamo de 25 huesos 💡 | U (estilo) + F (cifras) · 17 nov · a validar con el primer modelo |
| 3.20 | **Referencia visual principal: la captura del usuario del 18 nov** (`docs/arte/captura_referencia_18nov.png`). Se reproduce ese estilo 3D (estilizado, compacto, sobrio, mate) con arte propio. Ya no se interpreta a partir de Tiny Troopers (sustituye a 3.1). **Personajes: civiles, supervivientes y zombis, NO soldados** ni terror realista (matiza 3.2) | U · 18 nov |
| 3.21 | Dirección artística común aprobada como base: `docs/DIRECCION_ARTISTICA.md`. Jugador 4,5 cabezas, zombi 5 cabezas, paleta A del jugador. Las «cinco masas» son orientación, no límite. La altura en metros (1,50) **no** está fijada como escala del mundo | U · 18 nov |
| 3.22 | Un modelo se aprueba **dentro del juego, con nuestra cámara, comparado con la captura de referencia**; la imagen frontal solo sirve para elegir candidata | U · 18 nov |
| 3.23 | **Identidad de los vivos:** juego de supervivencia con extracción; personajes = supervivientes veteranos, exploradores y saqueadores de zonas peligrosas, con ropa funcional y equipo táctico reunido, carácter propio y diferencias claras entre ellos. Ni civiles indefensos ni soldados de uniforme. Es diseño de ropa y equipo; el estilo gráfico sigue siendo el de la captura (3.20). El cuerpo se genera limpio y armas y equipo son piezas independientes para personalizar en el juego | U · 18 nov |
| 3.24 | **Esqueleto y animaciones propios, hechos en el proyecto, para zombis Y protagonista** (`tools/esqueleto_auto.mjs`, `src/anim_zombi.js`, `src/anim_humano.js`), sin Mixamo ni Meshy. Matiza 3.13; los huesos llevan nombres de Mixamo por si más adelante se quieren sus clips | F · 19 nov; ampliada 20 nov · funciona con los modelos definitivos; **confirmar por U** al verlo en el móvil |
| 3.25 | **Referencias visuales oficiales: AMBAS y complementarias, ninguna sustituye a la otra:** Tiny Troopers y el juego de la captura y el vídeo del usuario (`docs/arte/`). Se estudian conjuntamente. **Complementa 3.1 y 3.20** (3.20 ya no retira Tiny Troopers) | U · 19 nov |
| 3.26 | **Sin proporciones rígidas de cabezas.** Fable elige las que den el resultado más profesional y legible desde la cámara: objetivo vivos ≈ 4 y zombis ≈ 4,5, con tolerancia; manda la lectura. **Sustituye a las cifras de 3.3, 3.19 y 3.21 (4,5 / 5)**; sigue valiendo que la altura en metros no está fijada | U (criterio) + F (cifras) · 19 nov |
| 3.27 | **Identidad de los vivos: operadores de extracción y supervivientes veteranos** (explorar, combatir, saquear zonas peligrosas); experiencia, carácter, preparación. Mezcla de equipamiento táctico y prendas de supervivencia; ni civiles indefensos ni uniformes militares genéricos. Piezas intercambiables (armas, chalecos, mochilas, protecciones, cascos, respiradores, munición, herramientas) y combinaciones distintas por personaje. Se aplica a todos los vivos. **Amplía 3.23** | U · 19 nov |
| 3.28 | **Objetivo: Tiny Troopers en HD** (identidad compacta y reconocible, acabado 3D de alta calidad: formas limpias con biseles, PBR pintado mate). Criterios de aceptación y textos v3: `docs/DIRECCION_ARTISTICA_HD.md` (sustituye a `DIRECCION_ARTISTICA.md`) | U · 19 nov |
| 3.29 | **Referencias aprobadas de los dos primeros modelos:** `docs/arte/ref_protagonista_aprobada.png` y `ref_zombi_aprobada.png` (estilo Tiny Troopers HD: cabeza grande, ≈ 3,5-4 cabezas, cuerpo ancho y bajo, acabado 3D de arcilla mate). **Fijan las proporciones definitivas** (concretan 3.26). No se rediseñan; se pasan a 3D tal cual. El protagonista se genera **sin chaleco, mochila ni bolsas** (cuerpo limpio, 3.10/3.14); su equipo se hace después como piezas sacadas de esta misma imagen | U · 20 nov |
| 3.30 | **Referencia oficial del cuerpo base del protagonista:** `docs/arte/ref_protagonista_cuerpo_base.png` (camiseta azul rota, pantalón de trabajo con rotos en las rodillas, botas, brazos y manos descubiertos, sin chaleco, mochila, bolsas ni guantes). Sustituye a la imagen con equipo para generar el 3D. Chaleco, mochila, bolsas, fundas, arnés, **rodilleras** y guantes serán piezas independientes | U · 20 nov |
| 3.31 | **Pantalla limpia (usuario, 20 nov):** sin aro naranja ni blanco alrededor del jugador, sin círculos de ruido ni «!» sobre los zombis, sin avisos de sonido o detección. La información se da con el comportamiento y la animación: el zombi que oye algo **se para, gira la cabeza hacia el origen y camina con cautela hasta allí; si ve al jugador, persigue; si no, deambula**. Solo queda una retícula mínima mientras se apunta. Retira el aro del jugador de PAQ-01 y el medidor de ruido/«!» de PAQ-03 | U · 20 nov |
| 3.32 | **Referencia de movimiento: el vídeo original del usuario** (`ScreenRecording_11-16-2026`; los fotogramas clave no se versionan). Rasgos: torso y arma estables hacia donde se apunta, piernas y caderas marcan el paso, fusil siempre en las manos, inclinación al correr, arrancar y frenar, retroceso al disparar. No se inventa otro estilo | U · 20 nov |
| 3.33 | **Física de los zombis, referida al vídeo del usuario (20 nov):** reacción al impacto según la zona, muerte por ragdoll (cuerpo con peso que cae según la dirección y fuerza del golpe y choca con el escenario) y derribo por explosión con levantarse. Ragdoll propio y ligero, solo visual, tope de 8 activos; sin librerías externas | U · 20 nov |

## 4. Juego (mapa de prueba y táctica)
| # | Decisión | Quién · fecha |
|---|---|---|
| 4.1 | El patrón del mapa de prueba: calle → reja → campamento con NPC → patio de zombis (007) | U · 16 nov |
| 4.2 | Tamaño del mapa de prueba: **sin fijar**. Se propone cuando exista el personaje de referencia y la escala (ART-2) | pendiente (U) |
| 4.3 | Las rejas dejan pasar balas y vista | F · 17 nov (007 §11.1) |
| 4.4 | Se puede matar a los neutrales, sin premio | F · 17 nov (007 §11.2) |
| 4.5 | En el mapa de prueba, al morir se reaparece en el inicio; la muerte total es del juego real | F · 17 nov (007 §11.3) |
| 4.6 | Sonido sintetizado por código como provisional | F · 17 nov (007 §11.5) |
| 4.7 | En táctil, el joystick derecho apunta sin disparar por debajo del 60 % y dispara por encima, con barra para el umbral. **Cambia un control de Tiny: se valida jugando en PAQ-04 y el usuario puede anularlo** | F · 17 nov (004 §4) · a validar por U |
| 4.8 | Física propia sin librería; marcas, trozos y sonido son dibujo local, no simulación | F (005) · implementado |
| 4.9 | Munición limitada desde A5; el aliado reclutable va en B4 | U / F |

## 5. Sustituidas (historial; no aplicar)
- Cámara «más cerca y centrada» (16 nov) → 2.1.
- Estilo «chunky toy-like» de las recetas 003, 005 §7, 006 §4 y 007 §8, y la prueba «semi-realista» → 3.1-3.3.
- Mapa compacto de 14 × 20 m (16 nov) y mapa largo de la 007 §2 → 4.2.
- Tope de 40 000 triángulos (norma 2 antigua) → 2.5-2.8.
- «≥ 58 fps y peor cuadro ≤ 25 ms» como requisito → 2.5 (30 / 40 / 60).
- Cifras de triángulos de la 003 §1, la 006 §3, el informe 008 §4.2 y las «jugador 2 500 / zombi 600» del 17 nov → 3.12.
- «Personaje ≈ 49 píxeles» y «se ven 21-33 m de ancho» como criterio único (calculados para horizontal) → 2.1, 2.2, 2.9, 2.10.
- Cámaras A, B, C y «cerca» de R1 → descartadas (2.1).
- «Fable no edita código, salvo R0-R8» → Fable no programa (1.2).
- Selector de calidad A / B / C y opciones A y C → 2.15.
- ART-1 como «clips de Mixamo sobre el esqueleto de Meshy» y la fila única ART-3 → 3.13-3.16 y 009 §8.
- Nombres de pasos C*, P*, V*, T*, R*, S* → paquetes del «Plan vigente» (`ROADMAP.md`).
