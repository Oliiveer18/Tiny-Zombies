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

## 2. Cámara y presentación
| # | Decisión | Quién · fecha |
|---|---|---|
| 2.1 | **Cámara definitiva «Tiny»: 16,4 m, 58°, campo de visión 38°, centrada en el jugador, sin adelanto.** Personaje ≈ 1/16 del alto (≈ 105 píxeles en vertical). Solo se revisa si una prueba importante demuestra un problema | U · 17 nov (sustituye a «cerca», 16 nov) |
| 2.2 | Lo que se ve con ella: 14 m de fondo (5,4 m por detrás del jugador y 8,7 m por delante). De ancho, en **vertical** ≈ 4,6 m abajo y 7,1 m arriba; en horizontal ≈ 21 m y 33 m. Es la medida para diseñar lugares y combates | F · 17 nov (cálculo; corregido tras ver la captura en vertical) |
| 2.3 | Los muros no pueden tapar al jugador: el muro que queda entre la cámara y él se vuelve translúcido | F · 17 nov |
| 2.4 | Sin niebla general. Luz que cambia con hora y clima. Mundo plano | U · 15-16 nov |
| 2.5 | **Calidad máxima con rendimiento fluido.** Requisitos: ≥ 58 fps y peor cuadro ≤ 25 ms en iPhone 14. No se recortan polígonos, texturas, sombras ni detalle para cumplir un número arbitrario | U · 17 nov |
| 2.6 | **El tope de 40 000 triángulos queda retirado.** Era de escena completa, solo existía como texto y como aviso de color en el medidor, venía heredado de otro proyecto y nunca se probó. Triángulos, llamadas y memoria pasan a ser indicadores | U + F · 17 nov (cierra la duda de las sombras) |
| 2.7 | Los presupuestos de escena saldrán de una prueba de carga en el móvil (PAQ-G1), fijados al 60 % del techo medido. Hasta entonces no hay presupuesto numérico | F · 17 nov |
| 2.8 | Nadie rebaja calidad por su cuenta: si falta rendimiento, Sonnet abre un bloqueo; las rebajas las decide el usuario con dos capturas. Antes se elimina el desperdicio que no se ve. Orden completo en `docs/CALIDAD_GRAFICA.md` §4 | F · 17 nov |
| 2.9 | **Orientación oficial: VERTICAL** (referencia para diseñar cámara, HUD, mapas y combates y para todas las pruebas). **Reversible:** se reevalúa si las pruebas de jugabilidad y visibilidad lo justifican; por eso nada se construye de forma que impida el horizontal (el juego debe seguir funcionando al girar el móvil) | U · 17 nov |
| 2.10 | Criterios de diseño en vertical: se ven ≈ 4,6-7,1 m de ancho × 14 m de fondo, así que el juego se lee **de abajo arriba**. Lugares y combates se organizan en profundidad (lo importante llega por delante o por detrás del jugador, no por los lados); pasos de ≥ 3 m de ancho; nada importante a menos de 1 m del borde lateral de lo visible; los mandos ocupan el tercio inferior, así que la zona útil de juego es del centro hacia arriba; avisos de peligro lateral fuera de pantalla (marcador en el borde) cuando haya enemigos que disparen | F · 17 nov

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
- Cifras de triángulos de la 003 §1, la 006 §3, el informe 008 §4.2 y las «jugador 2 500 / zombi 600» del 17 nov → 3.12.
- «Personaje ≈ 49 píxeles» y «se ven 21-33 m de ancho» como criterio único (calculados para horizontal) → 2.1, 2.2, 2.9, 2.10.
- Cámaras A, B, C y «cerca» de R1 → descartadas (2.1).
- «Fable no edita código, salvo R0-R8» → Fable no programa (1.2).
- Nombres de pasos C*, P*, V*, T*, R*, S* → paquetes del «Plan vigente» (`ROADMAP.md`).
