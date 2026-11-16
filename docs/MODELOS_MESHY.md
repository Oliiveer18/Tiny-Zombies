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
- **Jugadores y NPC con cuerpos distintos ✅:** los personajes que crean los jugadores no deben parecerse a los NPC. Cuerpos base y estilo propios para cada grupo (por ejemplo 2-3 cuerpos de jugador y 2-3 de NPC), todos sobre el MISMO esqueleto. Los NPC también se distinguen en pantalla con un marcador.
- **1 a 3 cuerpos base** (por ejemplo delgado, normal y corpulento) para que los NPC no parezcan clones.
- **Skins** = ropa y colores distintos sobre el mismo cuerpo: por re-texturizado en Meshy (cuesta créditos; comprobar en tu plan) o por teñido de zonas.
- **Accesorios** como objetos aparte pegados a un hueso: gorros, cascos, mochilas, chalecos, gafas, herramientas. Son baratos y diferencian mucho a cada NPC y a cada rol.
- **Colores propios**: distintos de los del juego de la referencia (`REFERENCIA_VISUAL.md`).
- **Rendimiento:** los personajes con esqueleto cuestan más que los objetos. Texturas en pocos atlas compartidos, mismas geometrías y límite de personajes animados a la vez; se mide en el móvil.
- **Prueba de tubería:** al generar el protagonista y el zombi normal, comprobar que comparten esqueleto y que una animación de uno funciona en el otro.

## Animaciones necesarias (por esqueleto)
`idle`, `walk`, `run`, `shoot`, `reload`, `hit`, `die`, `attack` (zombis; los zombis también necesitan `idle` o `sleep` y `walk` porque hay dormidos y deambulando) y las tácticas del A8 del `ROADMAP.md`: `tactical_run`, `vault`, `slide`, `crouch_idle`, `crouch_walk`.

## Lista de modelos (por prioridad)
| # | Modelo | Archivo (`models.config.js`) | Animaciones (nombre del clip) | Notas |
|---|---|---|---|---|
| 1 | Protagonista (jugador 1) | `player.glb` | `idle`, `walk`, `run`, `shoot`, `reload`, `hit`, `die` + tácticas | Imprescindible. Aspecto por decidir; todavía no hay prompt ni imagen de referencia |
| 2 | Otros jugadores (online, más adelante) | cuerpos y skins del creador de personaje | las mismas | Mismo esqueleto, cuerpos distintos de los NPC |
| 3 | Zombi normal | `zombie.glb` | `idle` (o `sleep`), `walk`, `run`, `attack`, `die` | |
| 4 | Zombi corredor | `runner.glb` | `idle` (o `sleep`), `walk`, `run`, `attack`, `die` | |
| 5 | Zombi tanque | `tank.glb` | `idle` (o `sleep`), `walk`, `run`, `attack`, `die` | |
| 6 | Objetos de Tiny | `fence`, `barrel`, `barrier`, `crate`, `sack`, `car` | — | Sin animación; radios de colisión en la config |
| 7 | NPC | por roles (médico, soldado, mecánico, cultivador, pescador, vigía…) | `idle`, `run` (y `shoot` si combaten) | Conviene un cuerpo base compartido con ropa distinta |
| 8 | Piezas del refugio | muro, puerta, suelo, hoguera, cama, caja, huerto, torre… | — | Se decide la lista al llegar al paso del refugio |
| 9 | Lugares y decorado | edificios, vehículos, árboles muertos, escombros | — | Los lugares se componen de piezas; se decide con el paso A5 del ROADMAP |

## Hechos de Meshy a tener en cuenta (de la documentación de Meshy a nov 2026; comprobar de nuevo antes de pagar)
- Plan gratis: 10 descargas/mes y solo modelos sin textura. Modelos con textura, rigging y animación exigen plan de pago. Licencia CC BY 4.0 en el plan gratis (hay que acreditar a Meshy).
- El rigging no sirve en mallas sin textura. La vía gratis es Image to 3D con Meshy 6 Lite.
- Para personajes animados (jugadores, zombis, NPC) hace falta plan de pago y rigging humanoide.

## ⚠️ Presupuestos: ANULADOS el 17 nov (ver `CALIDAD_GRAFICA.md`; no hay tope de 40 000 ni cifras por modelo). Texto antiguo:
## Presupuestos propuestos 💡 (a aprobar por el usuario; Tiny aguanta menos que un juego de casillas por usar bloom y sombras)
Jugador ≈ 2 500 triángulos con textura 1024; NPC ≈ 1 200 y 512; zombi ≤ 500 y 256-512; objeto de decorado ≤ 300. Con muchos zombis en pantalla a la vez, el límite manda el total visible (< 40 000 triángulos).

## Qué sigue sin estar decidido
- Cómo es el protagonista (aspecto, ropa) y quién genera su imagen de referencia, y la de cada NPC.

## Qué se puede hacer mientras llegan los modelos
Los pasos que no son de arte (A0a-A7: mundo por regiones, semilla, guardado, necesidades, tiempo; y luego estaciones y clima) no dependen de los modelos y se programan con el relleno de Tiny; ningún hito se da por entregado con relleno. El usuario decide si se avanza ya con esos pasos o si se espera a tener los modelos (ver pregunta en `CONTINUAR.md`).

## Orden de generación recomendado 💡 (en paralelo al código)
1. **Prueba de tubería con 2 modelos:** el protagonista y el zombi normal. Sirve para comprobar el plan de Meshy, el rigging, los nombres de clips (`idle`, `walk`, `run`, `shoot`; `idle`, `walk`, `run`, `attack`, `die`), la escala y los triángulos en el móvil, ANTES de generar el resto. Se colocan en `public/models/` y se prueban en Tiny (subpaso A0d del `ROADMAP.md`, LOW). Comprobar también los triángulos reales del zombi: 500 con esqueleto es optimista y, si no baja de ~1 200, se bajan zombis activos antes que calidad (💡 de la revisión 001).
2. Corredor y tanque (mismo esqueleto que el zombi normal).
3. Objetos de Tiny (valla, barril, barrera, caja, saco, coche): sin animación, los más baratos.
4. NPC (cuerpo base compartido con ropa distinta) y jugador 2.
5. Piezas del refugio y decorado de los primeros lugares abiertos (gasolinera, granja, camión volcado, campamento), según el hito A5/B1 del `ROADMAP.md`.
No generar todo de golpe: cada modelo se decide cuando su paso del ROADMAP está cerca.

## Cuándo empezar y presupuesto de créditos 💡 (15 nov 2026)
- **Empezar ya**, en paralelo al código. El usuario tiene plan de pago con 2 000 créditos.
- **Costes de referencia de Meshy** (página de ayuda de Meshy, «solo orientativos»; mirar siempre la cotización en pantalla antes de generar): Image to 3D 25 (Meshy 7), 20 (Meshy 6) o 10 (Meshy 6 Lite); Texture 10 (2K/4K) o 15 (8K); Retexture 10; Smart Topology 5. El coste del rigging y de las animaciones NO aparece en esa página: comprobarlo en la app antes de la prueba.
- **Orden:** 1) prueba de tubería con el protagonista y el zombi normal (con 2-3 intentos cada uno); 2) si encajan en Tiny y en el móvil, el resto por prioridad de la lista de modelos.
- **Reglas para no malgastar créditos:** máximo 2-3 generaciones por modelo; elegir la mejor imagen de referencia antes de generar; no texturizar en 8K; no generar un modelo hasta que su paso del ROADMAP esté cerca; apuntar en `coordinacion/REGISTRO.md` los créditos que quedan tras cada tanda.

## Creador de personaje: plan de producción 💡 (16 nov 2026)
Idea clave: **no se genera un modelo por cada aspecto posible.** Se generan pocas piezas y el creador las combina, así hay muchas combinaciones con poco arte y poco peso en el móvil.
Aspecto de un jugador = `cuerpo` + `ropa` + `peinado` + `accesorios` (+ color de acento). En el perfil solo se guardan esos ids (unos bytes; vale para el online).
| Capa | Cómo se hace | Cantidad inicial | Coste aprox. |
|---|---|---|---|
| **Cuerpo** (silueta, esqueleto y animaciones) | Image to 3D en Meshy, rigging humanoide una vez, ropa ajustada. Los cuerpos de jugador son distintos de los de NPC | 2-3 de jugador (p. ej. complexión delgada, media, fuerte) | ≈ 30 créditos cada uno + rig y animaciones (comprobar en la app) |
| **Ropa y tono de piel** | **Re-texturizado** (Retexture de Meshy) del MISMO cuerpo: no cambia la malla, así que el esqueleto y las animaciones valen sin repetirlos. Los tonos de piel se hacen como variantes | 8-10 por cuerpo | ≈ 10 créditos cada una |
| **Peinados** | Piezas pequeñas pegadas al hueso de la cabeza (se pueden teñir por código) | 6-8 | ≈ 10-20 cada una |
| **Accesorios** con volumen (gorros, cascos, chalecos, mochilas, gafas, capuchas) | Modelos pequeños (≤ 300 triángulos) pegados a un hueso | 15-20 | ≈ 10-20 cada uno |
| **Color de acento** | Tinte por código sobre accesorios y peinados | — | 0 |
Con eso: 3 cuerpos × 8 ropas × 6 peinados × 15 accesorios ≈ 2 000+ combinaciones con unos 40 modelos.
- **Los NPC** tienen su propio grupo (2-3 cuerpos y ropas por rol: médico, soldado…), de modo que ningún jugador se parece a un NPC.
- **Zombis:** cuerpos propios (normal, corredor, tanque) con variantes de textura; mismo esqueleto.
- **Regla de silueta:** los cuerpos llevan ropa ajustada. Lo voluminoso (capucha, chaleco, mochila, casco) es siempre accesorio, porque un re-texturizado no puede cambiar la forma.
- **Rendimiento:** solo se cargan las ropas y accesorios de los jugadores visibles; texturas de 512-1024 en atlas; tope de personajes animados a la vez (norma 2). Se mide en el iPhone 14.
- **Orden:** 1) prueba de tubería: cuerpo de jugador 1 + zombi normal + UN re-texturizado (comprobar que el esqueleto sigue valiendo); 2) si funciona, resto de cuerpos de jugador y las primeras ropas; 3) accesorios y peinados con el creador (paso F2, online) y antes algunas combinaciones fijas para el juego en solitario.
- **Presupuesto estimado** (sin rig ni animación, que hay que comprobar en la app): 3 cuerpos de jugador ≈ 90 + 24 ropas ≈ 240 + peinados y accesorios ≈ 350 + NPC (3 cuerpos + 10 ropas) ≈ 190 + zombis ≈ 120 → ≈ 1 000 de 2 000 créditos. Se ajusta con el coste real de rig y animación.


## Pendientes del jugador (16 nov)
- Boca: línea muy fina en la textura; arreglar al hacer el creador de personaje (modelo alto `arte_fuente/jugador_meshy_alto_36k.glb`).
- Versión de juego hecha con `tools/prep_player.mjs` (4 000 tris, 20 huesos, 613 KB).
