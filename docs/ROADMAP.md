# ROADMAP · ruta más corta hasta tener el juego completo (reorganizado el 15 nov 2026)

Estados: 💡 propuesta de Claude (el usuario la corrige). Esfuerzo: LOW o MEDIUM por subpaso. Cada subpaso = un ZIP + `docs/SESION.md` + medida de fps en el móvil (`?debug`). Los números de subpasos son una ESTIMACIÓN para comparar fases, no una promesa.

## Principios para acabar lo antes posible
1. **Cortes verticales jugables.** Cada hito se puede jugar de principio a fin aunque sea pobre, en vez de terminar capas sueltas. Así se detecta pronto lo que no funciona en el móvil.
2. **Lo difícil de cambiar, primero.** Mundo por regiones, semilla, ids y guardado se hacen al principio: son los cimientos y rehacerlos después costaría mucho más.
3. **Datos antes que arte.** Lugares, tipos de región, estaciones, climas, recetas y NPC se escriben como tablas; ampliar contenido luego es barato.
4. **Una pieza simple de cada cosa y luego se amplía.** 6 piezas de refugio antes que 30; 3 lugares abiertos antes que 40; NPC con 2 roles antes que 7.
5. **Lo caro se aplaza con una versión pequeña ya dentro:** los interiores con puerta, los vehículos, los animales, el coop y los grupos hostiles no bloquean el núcleo.
6. **Meshy corre en paralelo.** Los modelos son lo que más tarda y no dependen del código: se generan mientras se programa (ver respuesta al final y `MODELOS_MESHY.md`). Los pasos 0-4 no necesitan modelos finales.
7. **Medir cada paso.** Nada pasa al siguiente si se rompen ≥ 58 fps, peor cuadro ≤ 25 ms, < 40 000 triángulos.

## Hito A · Núcleo jugable (≈ 11 subpasos)
Objetivo: explorar un mundo infinito, disparar, saquear, beber y comer, y no morir de hambre ni de zombis.

| Paso | Esfuerzo | Qué incluye |
|---|---|---|
| A0 Preparación | LOW | Dividir el código comprimido de Tiny en módulos sin cambiar su comportamiento; medidor `?debug`; ids de entidades; `Math.random` del mundo → semilla |
| A1 Regiones | MEDIUM | Mundo infinito por semilla: carga y descarga de regiones, niebla en el borde, rejilla espacial para colisiones, origen flotante; Tiny funcionando igual |
| A2 Terreno y agua | MEDIUM | Tipos de región (campo, bosque, pueblo, carretera, costa), relieve suave, lagos y ríos con orilla, props instanciados por región. Suelo con marcas pintadas y desgaste y objetos apilados (según `REFERENCIA_VISUAL.md`) |
| A3 Zombis colocados | MEDIUM | Se quitan las oleadas; zombis por tipo de región (dormidos, deambulando, grupos); alerta por vista y ruido; ventaja ligera inicial en el arranque |
| A4 Guardado | MEDIUM | Solo cambios por región, con versión (zombis muertos, saqueos). Se hace aquí porque ya hay cambios que guardar |
| A5 Lugares abiertos y botín | MEDIUM ×2 | Plantillas de datos; primeros lugares abiertos (gasolinera, granja, camión volcado, campamento); botín finito; las granadas pasan a ser botín |
| A6 Necesidades | MEDIUM | Hambre, sed, mochila con peso, pozo y agua de lagos; comida de botín. Muerte total y pantalla de fin con tiempo sobrevivido |
| A7 Pantallas mínimas | LOW | Título (Continuar / Nueva partida), pausa, HUD completo |
| A8 Movimientos tácticos ✅ | MEDIUM ×2 | Los de la referencia: correr táctico, saltar obstáculos bajos, deslizarse, agacharse (más sigilo, menos ruido). Lo prepara A2: cada obstáculo lleva `altura` y `saltable`. En el móvil: salto automático al correr contra un obstáculo bajo; botones para deslizarse y agacharse (💡). Necesita las animaciones tácticas del esqueleto |

**Entrega A:** se puede jugar y sobrevivir explorando. Es el primer momento de ver el «feeling» real en el móvil.

## Hito B · El corazón del juego: refugio y NPC (≈ 9 subpasos)
| Paso | Esfuerzo | Qué incluye |
|---|---|---|
| B1 Refugio v0 | MEDIUM ×2 | Modo construcción en móvil (vista previa verde/roja); 6 piezas: hoguera, muro, puerta, suelo, caja, cama; recolección de materiales; los zombis atacan lo más débil |
| B2 Agua y comida propias | MEDIUM | Pozo propio, purificador automático, huerto, barril de lluvia (lluvia llega en C) |
| B3 NPC v0 | MEDIUM ×2 | Habitantes con id colocados por lugar; estados (moribundo, escondido, atrapado); rescatar y llevar al refugio; curar, vestir y armar |
| B4 NPC en el equipo | MEDIUM ×2 | Acompañan y combaten con las mecánicas de Tiny; defienden la base; 2 roles (soldado y médico); consumen comida y agua |
| B5 Estancias | LOW | Dormitorio, cocina, enfermería y almacén se reconocen solos |

**Entrega B:** el bucle completo: explorar → encontrar NPC → traerlos → crecer → mantenerlos.

## Hito C · El mundo vivo (≈ 7 subpasos)
| Paso | Esfuerzo | Qué incluye |
|---|---|---|
| C1 Reloj y día/noche | MEDIUM | Reloj de juego determinista; luz, cielo y niebla cambian por hora (la noche azul de Tiny es un punto del ciclo); luces cálidas puntuales (farolas, hogueras) sobre fondo azul |
| C2 Clima | MEDIUM | Lluvia, niebla, tormenta, frío/calor con sus efectos en ruido, visión, fuego y piezas |
| C3 Estaciones | MEDIUM | 4 estaciones «intermedias» (~6 días de juego cada una); aspecto, cultivos, caza, frío, agua |
| C4 Presión realista (parte 1) | MEDIUM | Refugio visible (luz, ruido, tamaño atraen zombis), consumo por NPC, recursos finitos |
| C5 Presión realista (parte 2) | MEDIUM | Zombis que migran, deterioro de edificios, comida, piezas y armas, el mejor botín en los peores sitios |
| C6 Lejanía | LOW | Lo lejano se calcula al volver (cultivos, comida podrida, migración) |

**Entrega C:** el juego «piensa» por sí solo y empuja al jugador sin que nada se endurezca por distancia ni por reloj.

## Hito D · Contenido y variedad (≈ 7 subpasos, ampliable)
| Paso | Esfuerzo | Qué incluye |
|---|---|---|
| D1 Interiores con puerta | MEDIUM ×2 | Instancias aparte con fundido; primer prototipo: la casa abandonada. Después tienda, clínica, comisaría |
| D2 Más lugares | LOW ×varios | Resto de lugares por olas; variantes con giro, espejo, mobiliario y estado (intacto, saqueado, ruina) |
| D3 Más NPC y roles | LOW ×2 | Constructor, cultivador, pescador, vigía |
| D4 Piezas y recetas | LOW ×2 | Más piezas de refugio, materiales por niveles, crafteo con estaciones y planos |
| D5 Más armas y zombis | MEDIUM | Armas variadas con desgaste y ruido; variantes de zombi |

## Hito E · Extras y cierre (≈ 6 subpasos)
| Paso | Esfuerzo | Qué incluye |
|---|---|---|
| E1 Vehículos | MEDIUM ×2 | Averiados, combustible finito, maletero, ruido |
| E2 Animales | MEDIUM | Granja y salvajes, caza, corral |
| E3 Grupos hostiles | MEDIUM | Asaltan refugios con buen equipo |
| E4 Coop de 2 móviles | MEDIUM ×2 | Misma partida (los ids y el estado ya serializable lo permiten) |
| E5 Pulido y rendimiento | MEDIUM | Ajuste final de cifras, equilibrio y fps en varios móviles |

## Total aproximado
Unos 41 subpasos (A 11 · B 9 · C 7 · D 7 · E 6). Lo jugable de verdad llega con A y B (≈ 20). C, D y E añaden profundidad y se pueden recortar o reordenar sin romper lo anterior.

## Qué hace este orden más corto que el anterior
- El guardado pasa de ser un paso grande a un subpaso pequeño dentro de A, porque llega justo cuando hay cambios que guardar.
- Pantallas y menús se reducen a lo mínimo en A y se pulen al final.
- Los interiores (lo más caro del mundo) se aplazan a D, con lugares abiertos ya jugables antes.
- Se parte antes: ya no hay 20 pasos secuenciales con dependencias largas, sino 5 hitos jugables.
- El clima y las estaciones (C) se hacen sobre datos ya existentes (comida, agua, ruido, piezas), así que cuestan menos.
