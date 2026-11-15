# MODELOS_MESHY · todos los modelos del juego se hacen con Meshy

Decisión del usuario (15 nov 2026): el juego es estilo Tiny, y Tiny usa modelos GLB de Meshy. Por eso **todos los modelos (personajes, zombis, NPC, objetos) vienen de Meshy**; no se crean modelos por código y no se empieza con las cápsulas de relleno. Se espera a tener los modelos antes de hacer la parte de personajes.

## Cómo los carga Tiny (ya existe)
`src/assets.js` carga cada GLB desde `public/models/<archivo>.glb` con GLTFLoader, lo clona con SkeletonUtils y reproduce animaciones con AnimationMixer. `src/models.config.js` dice, para cada modelo: archivo, escala, desfase y nombres de los clips. Si un GLB falta, Tiny pone una cápsula o una caja de relleno (esto NO se usará como aspecto del juego; solo evita que falle la carga).
Ventaja frente al otro proyecto: aquí SÍ hay cargador de GLB y mezclador de animaciones, así que el GLB entra tal cual (no hay que convertirlo a datos).

## Estilo de los modelos
Ver `REFERENCIA_VISUAL.md`: figura compacta (cabeza grande), silueta legible desde arriba, equipo con capas de color que contrasten con el suelo oscuro, texturas con desgaste. Un cuerpo base con esqueleto compartido y varias skins (ropa/colores) 💡.

## Sistema de cuerpos y skins ✅ (decisión del usuario; detalle 💡)
Un cuerpo base con el mismo esqueleto y las mismas animaciones, y varias skins, para el jugador y los NPC. Los zombis comparten el esqueleto con cuerpos propios.
- **Esqueleto único** (mismos huesos y nombres) para jugador, NPC y zombis: las animaciones se hacen una vez y valen para todos. Es lo que más ahorra.
- **1 a 3 cuerpos base** (por ejemplo delgado, normal y corpulento) para que los NPC no parezcan clones.
- **Skins** = ropa y colores distintos sobre el mismo cuerpo: por re-texturizado en Meshy (cuesta créditos; comprobar en tu plan) o por teñido de zonas.
- **Accesorios** como objetos aparte pegados a un hueso: gorros, cascos, mochilas, chalecos, gafas, herramientas. Son baratos y diferencian mucho a cada NPC y a cada rol.
- **Colores propios**: distintos de los del juego de la referencia (`REFERENCIA_VISUAL.md`).
- **Rendimiento:** los personajes con esqueleto cuestan más que los objetos. Texturas en pocos atlas compartidos, mismas geometrías y límite de personajes animados a la vez; se mide en el móvil.
- **Prueba de tubería:** al generar el protagonista y el zombi normal, comprobar que comparten esqueleto y que una animación de uno funciona en el otro.

## Animaciones necesarias (por esqueleto)
`idle`, `walk`, `run`, `shoot`, `reload`, `hit`, `die`, `attack` (zombis) y las tácticas del A8 del `ROADMAP.md`: `tactical_run`, `vault`, `slide`, `crouch_idle`, `crouch_walk`.

## Lista de modelos (por prioridad)
| # | Modelo | Archivo (`models.config.js`) | Animaciones (nombre del clip) | Notas |
|---|---|---|---|---|
| 1 | Protagonista (jugador 1) | `player.glb` | `idle`, `walk`, `run`, `shoot`, `reload`, `hit`, `die` + tácticas | Imprescindible. Aspecto por decidir; todavía no hay prompt ni imagen de referencia |
| 2 | Jugador 2 (coop, más adelante) | skin del mismo cuerpo | las mismas | Misma malla base con otra skin |
| 3 | Zombi normal | `zombie.glb` | `run`, `attack`, `die` | |
| 4 | Zombi corredor | `runner.glb` | `run`, `attack`, `die` | |
| 5 | Zombi tanque | `tank.glb` | `run`, `attack`, `die` | |
| 6 | Objetos de Tiny | `fence`, `barrel`, `barrier`, `crate`, `sack`, `car` | — | Sin animación; radios de colisión en la config |
| 7 | NPC | por roles (médico, soldado, mecánico, cultivador, pescador, vigía…) | `idle`, `run` (y `shoot` si combaten) | Conviene un cuerpo base compartido con ropa distinta |
| 8 | Piezas del refugio | muro, puerta, suelo, hoguera, cama, caja, huerto, torre… | — | Se decide la lista al llegar al paso del refugio |
| 9 | Lugares y decorado | edificios, vehículos, árboles muertos, escombros | — | Los lugares se componen de piezas; se decide con el paso 4 del ROADMAP |

## Hechos de Meshy a tener en cuenta (de la documentación de Meshy a nov 2026; comprobar de nuevo antes de pagar)
- Plan gratis: 10 descargas/mes y solo modelos sin textura. Modelos con textura, rigging y animación exigen plan de pago. Licencia CC BY 4.0 en el plan gratis (hay que acreditar a Meshy).
- El rigging no sirve en mallas sin textura. La vía gratis es Image to 3D con Meshy 6 Lite.
- Para personajes animados (jugadores, zombis, NPC) hace falta plan de pago y rigging humanoide.

## Presupuestos propuestos 💡 (a aprobar por el usuario; Tiny aguanta menos que un juego de casillas por usar bloom y sombras)
Jugador ≈ 2 500 triángulos con textura 1024; NPC ≈ 1 200 y 512; zombi ≤ 500 y 256-512; objeto de decorado ≤ 300. Con muchos zombis en pantalla a la vez, el límite manda el total visible (< 40 000 triángulos).

## Qué sigue sin estar decidido
- Cómo es el protagonista (aspecto, ropa) y quién genera su imagen de referencia, y la de cada NPC.
- Si el usuario tiene plan de pago de Meshy activo.
- Si los zombis y NPC usan el mismo esqueleto humanoide que el protagonista (recomendado, para compartir animaciones).

## Qué se puede hacer mientras llegan los modelos
Los pasos que no son de arte (mundo por regiones, semilla, guardado, necesidades, tiempo, estaciones, clima) no dependen de los modelos. El usuario decide si se avanza ya con esos pasos o si se espera a tener los modelos (ver pregunta en `CONTINUAR.md`).

## Orden de generación recomendado 💡 (en paralelo al código)
1. **Prueba de tubería con 2 modelos:** el protagonista y el zombi normal. Sirve para comprobar el plan de Meshy, el rigging, los nombres de clips (`idle`, `run`, `shoot`; `run`, `attack`, `die`), la escala y los triángulos en el móvil, ANTES de generar el resto. Se colocan en `public/models/` y se prueban en Tiny (subpaso LOW de integración).
2. Corredor y tanque (mismo esqueleto que el zombi normal).
3. Objetos de Tiny (valla, barril, barrera, caja, saco, coche): sin animación, los más baratos.
4. NPC (cuerpo base compartido con ropa distinta) y jugador 2.
5. Piezas del refugio y decorado de los primeros lugares abiertos (gasolinera, granja, camión volcado, campamento), según el hito A5/B1 del `ROADMAP.md`.
No generar todo de golpe: cada modelo se decide cuando su paso del ROADMAP está cerca.
