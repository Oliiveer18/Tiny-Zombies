# ROADMAP · ruta más corta hasta tener el juego completo (reorganizado el 15 nov 2026; revisado con Fable 001 el mismo día)

Estados: 💡 propuesta de Claude (el usuario la corrige). Esfuerzo: LOW o MEDIUM. **Desde el 17 nov el trabajo va por paquetes (ver «Plan vigente»); los «subpasos» de los hitos de abajo se agruparán en paquetes cuando les llegue el turno.** Medida de fps en el móvil de referencia (iPhone 14, `?debug`). Los números de subpasos son una estimación para comparar fases.

## Principios para acabar lo antes posible
1. **Cortes verticales jugables.** Cada hito se puede jugar de principio a fin aunque sea pobre, en vez de terminar capas sueltas. Así se detecta pronto lo que no funciona en el móvil.
2. **Lo difícil de cambiar, primero.** Mundo por regiones, semilla, ids y formato de guardado se fijan al principio (A0c y A1): son los cimientos y rehacerlos después costaría mucho más.
3. **Datos antes que arte.** Lugares, tipos de región, estaciones, climas, recetas y NPC se escriben como tablas; ampliar contenido luego es barato.
4. **Una pieza simple de cada cosa y luego se amplía.** 6 piezas de refugio antes que 30; 3 lugares abiertos antes que 40; NPC con 2 roles antes que 7.
5. **Lo caro se aplaza con una versión pequeña ya dentro:** los interiores con puerta, los vehículos, los animales y los grupos hostiles no bloquean el núcleo. El cooperativo no se prepara (idea lejana, E4).
6. **Meshy corre en paralelo.** Los modelos son lo que más tarda y no dependen del código: se generan mientras se programa (`MODELOS_MESHY.md`). Los pasos A0a-A7 se programan con el relleno de Tiny; ningún hito se da por entregado con relleno.
7. **Medir cada paso.** Nada pasa al siguiente si se rompen ≥ 58 fps y peor cuadro ≤ 25 ms (el tope de 40 000 triángulos se retiró el 17 nov: `CALIDAD_GRAFICA.md`).

## Plan vigente (17 nov 2026) · ESTA es la única lista de trabajo
Estado al día: `docs/CONTINUAR.md` (tablero). Decisiones: `docs/DECISIONES.md`. Cómo se trabaja: `coordinacion/LEEME.md`.
El trabajo se organiza en **paquetes** (`PAQ-nn`, código) y **tareas de arte** (`ART-n`, dependen de modelos o clips que aporta el usuario). Cada paquete tiene su documento en `coordinacion/TRASPASOS/`. Los nombres antiguos de pasos (C1-C10 de la 005, P1-P7 de la 006, V1-V9 de la 007, T1-T7 de la 004, R0-R8 de la 008, S1) **ya no se usan para planificar**: esta tabla dice dónde ha ido a parar cada uno. Nada está duplicado.

### Hecho (en `main`)
A0a-A0o · M1-M6 · C1, C2, C3, C3b, C4 · S1, S1b (suelo y calcos fijos: cubre parte de V2/V3) · P1, P2 · R0, R1 (cámara elegida: Tiny). **Nada medido aún en el iPhone 14.**

### Paquetes de código (en orden; no necesitan modelos nuevos)
| Paquete | Contenido | Viene de | Depende de | Esf. |
|---|---|---|---|---|
| **PAQ-01** Cámara definitiva y lectura del escenario | Tiny por defecto y menú limpio; muros que no tapan al jugador; aro del jugador; personajes lejanos apagados | flecos de R1, R7, parte de R6 | — | MED |
| **PAQ-G1** Prueba de carga gráfica | Modo `?carga` que mide en el iPhone el techo real de geometría, personajes, luces y calidad (`CALIDAD_GRAFICA.md`) | nuevo (sustituye a medir «a ojo» en R8/C10/P7) | PAQ-01 | MED |
| **PAQ-02** Interacción y reja | Barras de física en `?debug`; acción «Usar» (empujar, forzar, abrir); reja con bisagra y candado | C5, C6, V4 | PAQ-01 | MED ×2 |
| **PAQ-03** Ruido y zombis que despiertan | Lista de ruido con muros; zombis dormido/despertando/persigue/deambula; disparadores; medidor de ruido; reaparición en prueba | V5, V6, T1, T2 | PAQ-02 | MED ×2 |
| **PAQ-04** Puntería, cobertura y sigilo | Dispersión por postura y calor; cobertura; rematar y señuelo; luz y sombra | T3, T4, T5, T6 | PAQ-03 | MED ×2 |
| **PAQ-05** NPC del campamento | Neutral, hostil, botín soltado, recoger y hablar | C7, C8, V7 | PAQ-04 | MED ×2 |
| **PAQ-06** Sonido sintetizado | WebAudio sin archivos + interruptor | V8 | PAQ-03 | LOW |
| **PAQ-07** Mapa de prueba v1 | Lugar `calle_reja_01` a su tamaño definitivo, suelos que falten | V1, resto de V2/V3 | **decisión del usuario sobre el tamaño** + ART-2 (escala) | MED |

### Tareas de arte (en paralelo; cada una empieza cuando el usuario aporta lo que falta)
| Tarea | Contenido | Viene de | Necesita |
|---|---|---|---|
| **ART-1** Tubería Mixamo | Cuerpo actual sin esqueleto → Mixamo le pone el suyo → packs de fusil convertidos; deja un relleno animado (009 §2, §4) | R2 | parte 1: nada (Sonnet) · parte 2: el usuario, en un ordenador, gratis |
| **ART-2** Personaje de referencia | Proporciones definitivas, texto de Meshy, primer personaje nuevo pasado por las herramientas, tabla de escala | R3 | ART-1 hecha; visto bueno del usuario al personaje; créditos de Meshy |
| **PAQ-A1** Núcleo de animación (antes ART-3) | `anim.js`: mezcla en 8 direcciones con paso sincronizado, capas de piernas y torso, transiciones, banco `?anim`; sin giro de 90° (009 §7) | R4, V9 | ART-1 ACEPTADA (no espera al personaje nuevo) |
| **PAQ-A2** Capa por código y acciones | Giro de torso, retroceso, inclinación, mirada, aditivos, recarga / granada / usar, agachado real, muerte; arma en la mano | R5, P3, P4 | PAQ-A1 |
| **PAQ-A3** Zombis y NPC sobre `anim.js` | Clips de zombi, media frecuencia a distancia, medición con 40 | R6 | PAQ-A2 + clips |
| **ART-4** Resto de personajes | Modelos de zombis y NPC, cuerpo de NPC, metal y rugosidad | P5, P6 | PAQ-A3 + modelos |
| **ART-5** Objetos y escala | Objetos de Meshy, recorte por zonas, escala aplicada | 007 §2 y §8 | ART-2 + modelos |
| **MED** Medición en iPhone 14 | Captura de `?debug` tras cada paquete aceptado (primera hecha el 17 nov: 58 fps, 30 404 triángulos) y captura de la tabla de `?carga` cuando exista PAQ-G1 | R8, C10, P7 | el usuario |

**Orden de Sonnet desde el 17 nov:** ART-1 parte 1 → PAQ-03 → (cuando lleguen los archivos de Mixamo) ART-1 parte 3 → PAQ-A1 → PAQ-A2 → PAQ-04 → PAQ-05… La animación pasa por delante de PAQ-04 por prioridad del usuario.

Movidos a los hitos de abajo: C9 (aliado reclutable) → B4 · T7 (munición limitada) → A5. Después de PAQ-07 y ART-5 se retoma el **Hito A** tal como está (A1 regiones, …).

## Hito A · Núcleo jugable (≈ 20 subpasos)
Objetivo: explorar un mundo infinito, disparar, saquear, beber y comer, y no morir de hambre ni de zombis.

| Paso | Esfuerzo | Qué incluye |
|---|---|---|
| A0a Módulos | LOW | Dividir el código comprimido de Tiny en módulos sin cambiar su comportamiento |
| A0b Medidor | LOW | Medidor `?debug` (fps, peor cuadro, triángulos de las dos pasadas con y sin sombra, tamaño de guardado); se apunta el iPhone 14 como móvil de referencia |
| A0c Ids, semilla y reloj | LOW | Ids de entidades; `Math.random` del mundo → semilla (el del combate puede quedarse); reloj de juego en ticks enteros guardable |
| A0d Prueba de tubería Meshy | LOW | Integrar el protagonista y el zombi normal de Meshy en Tiny: nombres de clips, escala, triángulos y esqueleto compartido (`MODELOS_MESHY.md`). Se hace cuando los GLB estén generados |
| A1 Regiones | 6 subpasos (A1a LOW · A1b MEDIUM · A1c LOW · A1d MEDIUM · A1e MEDIUM · A1f LOW; ver `RESPUESTAS_FABLE/002_diseno_A1_regiones.md` §9) | Mundo infinito por semilla: carga y descarga de regiones, niebla en el borde, rejilla espacial para colisiones con círculos y **rectángulos girados**, posición = región entera + decimal local, entidades que cruzan regiones, formato de cambios e ids fijados (ver petición 002); Tiny funcionando igual |
| A2 Terreno y agua | MEDIUM | Mundo PLANO. Tipos de región (campo, bosque, carretera, costa), lagos y ríos con orilla, props instanciados por región. Suelo con marcas pintadas y desgaste y objetos apilados (según `REFERENCIA_VISUAL.md`). «Pueblo», «granja» y «ruinas» entran con A5 |
| A3 Zombis colocados | MEDIUM | Se quitan las oleadas; zombis por tipo de región (dormidos, deambulando, grupos); alerta por vista y ruido (`ruido.json`); tope de 40 activos; claro inicial solo con zombis normales dormidos |
| A4 Guardado | MEDIUM | IndexedDB; solo cambios por región, con `versionGenerador` (zombis muertos, saqueos); un guardado independiente por partida (varias; al morir se acaba esa partida). Se hace aquí porque ya hay cambios que guardar |
| A6a Inventario mínimo y USAR | MEDIUM | Inventario mínimo y botón contextual «USAR» (recoger, abrir, beber) |
| A5 Lugares abiertos y botín | MEDIUM ×2 | Plantillas de datos; primeros lugares abiertos (gasolinera, granja, camión volcado, campamento) y los tipos de región pueblo/granja/ruinas; botín finito; **munición limitada**; las granadas pasan a ser botín |
| A6b Necesidades y muerte | MEDIUM | Hambre, sed, mochila con peso, pozo y agua de lagos; comida de botín. Muerte total y pantalla de fin con tiempo sobrevivido |
| A7 Pantallas mínimas | LOW | Título con «Mis partidas» (varias partidas guardadas, cada una con su mundo), pausa, HUD completo |
| A8 Movimientos tácticos ✅ | MEDIUM ×2 | Los de la referencia: correr táctico, saltar obstáculos bajos, deslizarse, agacharse (más sigilo, menos ruido). Lo prepara A2: cada obstáculo lleva `altura` y `saltable`. En el móvil: salto automático al correr contra un obstáculo bajo; botones para deslizarse y agacharse (💡). Necesita las animaciones tácticas del esqueleto: se hace cuando `player.glb` con esos clips pase la prueba A0d, y NO bloquea la Entrega A |

**Orden:** A0a · A0b · A0c · A0d · A1 · A2 · A3 · A4 · A6a · A5 (×2) · A6b · A7 · (A8 cuando haya animaciones).
**Entrega A:** se puede jugar y sobrevivir explorando. Es el primer momento de ver el «feeling» real en el móvil.

## Hito B · El corazón del juego: refugio y NPC (≈ 9 subpasos)
| Paso | Esfuerzo | Qué incluye |
|---|---|---|
| B1 Refugio v0 | MEDIUM ×2 | Modo construcción en móvil (vista previa verde/roja); 6 piezas: hoguera, muro, puerta, suelo, caja, cama; recolección de materiales; los zombis atacan lo más débil (si una pieza les corta el paso, la atacan) |
| C6a Lejanía mínima | LOW | Cálculo «al volver» en su versión mínima (cultivos, comida podrida), justo antes de B2: sin ella el huerto no crece al salir a explorar |
| B2 Agua y comida propias | MEDIUM | Pozo propio, purificador automático, huerto, barril de lluvia (lluvia llega en C) |
| B3 NPC v0 | MEDIUM ×2 | Habitantes con id colocados por lugar; estados (moribundo, escondido, atrapado); rescatar y llevar al refugio; curar, vestir y armar |
| B4 NPC en el equipo | MEDIUM ×2 | Acompañan y combaten con las mecánicas de Tiny; defienden la base; 2 roles (soldado y médico); consumen comida y agua; búsqueda de caminos solo dentro de la rejilla de la región activa |
| B5 Estancias | LOW | Dormitorio, cocina, enfermería y almacén se reconocen solos |

**Entrega B:** el bucle completo: explorar → encontrar NPC → traerlos → crecer → mantenerlos.

## Hito C · El mundo vivo (≈ 6 subpasos)
| Paso | Esfuerzo | Qué incluye |
|---|---|---|
| C1 Día y noche | MEDIUM | El reloj ya existe (A0c); luz, cielo y niebla cambian por hora (la noche azul de Tiny es un punto del ciclo; niebla ≥ 0.03); luces cálidas puntuales (farolas, hogueras) sobre fondo azul |
| C2 Clima | MEDIUM | Lluvia, niebla, tormenta, frío/calor con sus efectos en ruido, visión, fuego y piezas; clima = `hash(semilla, tramo)` |
| C3 Estaciones | MEDIUM | 4 estaciones «intermedias» (~6 días de juego cada una); aspecto, cultivos, caza, frío, agua |
| C4 Presión: refugio visible | MEDIUM | Luz, ruido y tamaño del refugio atraen zombis |
| C5 Presión: migración y deterioro | MEDIUM | Zombis que migran; deterioro de edificios, comida, piezas y armas |
| C6b Lejanía completa | LOW | Lo lejano se calcula al volver (migración, el resto de cosas) |

El consumo por NPC está en B4, los recursos finitos en A5, y «el mejor botín en los peores sitios» es contenido de D1/D2 (el bunker y el cuartel tienen interior).
**Entrega C:** el juego «piensa» por sí solo y empuja al jugador sin que nada se endurezca por distancia ni por reloj.

## Hito D · Contenido y variedad (≈ 8 subpasos, ampliable)
| Paso | Esfuerzo | Qué incluye |
|---|---|---|
| D1 Interiores con puerta | MEDIUM ×2 | Instancias aparte con fundido; primer prototipo: la casa abandonada. Después tienda, clínica, comisaría |
| D2 Más lugares | LOW ×varios (contado como 1) | Resto de lugares por olas; variantes con giro, espejo, mobiliario y estado (intacto, saqueado, ruina) |
| D3 Más NPC y roles | LOW ×2 | Constructor, cultivador, pescador, vigía |
| D4 Piezas y recetas | LOW ×2 | Más piezas de refugio, materiales por niveles, crafteo con estaciones y planos |
| D5 Más armas y zombis | MEDIUM | Armas variadas con desgaste y ruido; variantes de zombi |

## Hito E · Extras y cierre (≈ 5 subpasos; E4 no se cuenta)
| Paso | Esfuerzo | Qué incluye |
|---|---|---|
| E1 Vehículos | MEDIUM ×2 | Averiados, combustible finito, maletero, ruido |
| E2 Animales | MEDIUM | Granja y salvajes, caza, corral |
| E3 Grupos hostiles | MEDIUM | Asaltan refugios con buen equipo |
| E4 Cooperativo (idea lejana) | — | SIN decidir y sin preparar: ahora el juego es de un jugador (decisión del usuario, 15 nov) |
| E5 Pulido y rendimiento | MEDIUM | Ajuste final de cifras, equilibrio y fps en varios móviles |

## Hito F · Online (el último; ≈ 5 subpasos, por definir con Fable al llegar)
Todo lo anterior se construye ya con los principios de `DISENO.md` §14 (simulación separada del dibujo, órdenes con id, estado serializable), así que F no obliga a reescribir.
| Paso | Esfuerzo | Qué incluye |
|---|---|---|
| F1 Servidor y red | MEDIUM ×2 | Ejecutar la simulación en un servidor; los móviles mandan órdenes y reciben estado (mundo compartido por un grupo pequeño, `DISENO.md` §14) |
| F2 Cuentas, perfil y creador de personaje | MEDIUM | Identidad del jugador, aspecto (cuerpo base + skin + accesorios) guardado en el perfil |
| F3 Refugios por jugador | MEDIUM | Cada jugador con su refugio y su ubicación; persistencia en servidor |
| F4 PvP | MEDIUM | Combate entre jugadores con validación en servidor; reglas de botín, zonas y protección |
| F5 Seguridad y pulido | MEDIUM | Anti-trampas básico, límites, reconexión, equilibrio |

## Total aproximado
Unos 48 subpasos antes de F (A 20 · B 9 · C 6 · D 8 · E 5; el antiguo cálculo de 41 estaba mal sumado). Lo jugable de verdad llega con A y B (≈ 29). C, D y E añaden profundidad y se pueden recortar o reordenar sin romper lo anterior.

## Qué hace este orden más corto que el anterior
- El guardado pasa de ser un paso grande a un subpaso pequeño dentro de A, porque llega justo cuando hay cambios que guardar.
- Pantallas y menús se reducen a lo mínimo en A y se pulen al final.
- Los interiores (lo más caro del mundo) se aplazan a D, con lugares abiertos ya jugables antes.
- Se parte antes: ya no hay 20 pasos secuenciales con dependencias largas, sino 5 hitos jugables.
- El clima y las estaciones (C) se hacen sobre datos ya existentes (comida, agua, ruido, piezas), así que cuestan menos.
- El reloj de juego va en A0c, así que hambre, sed, guardado y cultivos no esperan a C.
