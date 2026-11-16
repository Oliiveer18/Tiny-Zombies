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
| 2.1 | **Cámara definitiva «Tiny»: 16,4 m, 58°, campo de visión 38°, centrada en el jugador, sin adelanto.** Personaje ≈ 1/16 del alto. Solo se revisa si una prueba importante demuestra un problema | U · 17 nov (sustituye a «cerca», 16 nov) |
| 2.2 | Lo que se ve con ella: ≈ 21 m de ancho abajo y 33 m arriba × 14 m de fondo (5,4 m por detrás del jugador y 8,7 m por delante). Es la medida para diseñar lugares y combates | F · 17 nov (cálculo) |
| 2.3 | Los muros no pueden tapar al jugador: el muro que queda entre la cámara y él se vuelve translúcido | F · 17 nov |
| 2.4 | Sin niebla general. Luz que cambia con hora y clima. Mundo plano | U · 15-16 nov |
| 2.5 | Rendimiento: ≥ 58 fps, peor cuadro ≤ 25 ms, < 40 000 triángulos, iPhone 14. No se baja calidad sin decisión del usuario | U |
| 2.6 | ¿Los 40 000 cuentan la pasada de sombras? **Sin decidir**: se decide con la primera medición real con modelos | pendiente (U) |

## 3. Arte y personajes
| # | Decisión | Quién · fecha |
|---|---|---|
| 3.1 | Referencia: Tiny Troopers (Joint Ops / Global Ops), con identidad propia; nada copiado | U · 17 nov |
| 3.2 | Personajes compactos, no infantiles ni de juguete, 4-5 cabezas, cabeza algo grande, equipo militar reconocible, acabado 3D moderno | U · 17 nov |
| 3.3 | Dentro de ese margen se apunta a **4,5 cabezas**, con manos, botas y arma algo gruesas (se leen mejor a 49 píxeles). Se confirma con el primer personaje | F · 17 nov · a validar por U |
| 3.4 | El jugador actual (juguete, ~3 cabezas) no es referencia. Sigue en el juego como relleno hasta que haya personaje nuevo | U · 17 nov |
| 3.5 | El primer personaje nuevo es la referencia visual del resto | U · 17 nov |
| 3.6 | **Créditos de Meshy en pausa** hasta cerrar ART-1 (Mixamo) y aprobar las proporciones | U · 17 nov |
| 3.7 | Todos los modelos con Meshy; suelo, texturas de suelo y efectos por código | U |
| 3.8 | Mixamo (gratis) aprobado para una prueba de compatibilidad; si pasa, será la fuente de animaciones | U · 17 nov |
| 3.9 | IK pospuesto | U · 17 nov |
| 3.10 | Ropa = pintura sobre el cuerpo; casco, chaleco, mochila, pelo y arma = piezas rígidas pegadas a un hueso; animaciones compartidas en un archivo por familia | F (006) · aceptada al implementar P1-P2 |
| 3.11 | El personaje va sin nada en las manos; el arma es una pieza | U · 16 nov |
| 3.12 | Presupuesto por modelo con la cámara Tiny: jugador 2 500 + piezas 1 000 triángulos · NPC 1 500 + 500 · zombi 600 · texturas 512 / 256. Los personajes se juzgan a tamaño de juego | F · 17 nov (sustituye a 006 §3) |

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
- Cifras de triángulos de la 006 §3 y del informe 008 §4.2 → 3.12.
- Cámaras A, B, C y «cerca» de R1 → descartadas (2.1).
- «Fable no edita código, salvo R0-R8» → Fable no programa (1.2).
- Nombres de pasos C*, P*, V*, T*, R*, S* → paquetes del «Plan vigente» (`ROADMAP.md`).
