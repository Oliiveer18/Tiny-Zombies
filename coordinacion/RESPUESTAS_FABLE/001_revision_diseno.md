# 001 · Revisión del diseño completo

Leído: `CLAUDE.md`, `docs/DISENO.md`, `docs/ROADMAP.md`, `docs/TINY_ACTUAL.md`, `docs/MODELOS_MESHY.md`. No se ha tocado código ni se ha rediseñado nada ✅. Las cifras propuestas aquí son 💡 (punto de partida a medir), no decisiones.

## Preguntas al usuario (lo único que no puede decidir Claude)
| # | Pregunta | Recomendación |
|---|---|---|
| P1 | ¿La luz y la niebla pueden cambiar con la hora y el clima? Hoy chocan dos ✅ (ver C1) | Sí, como excepción escrita (igual que las oleadas), con la noche de Tiny como punto fijo del ciclo |
| P2 | ¿Suelo plano como Tiny o con relieve? (ver C2) | Plano. El relieve obliga a rehacer apuntado, balas y granadas |
| P3 | ¿La munición pasa a ser limitada? ¿Desde cuándo? (ver C3) | Sí, desde A5, cuando ya hay botín |
| P4 | ¿Cuál es el móvil de referencia para medir? | Apuntar modelo en `coordinacion/mediciones/` antes de A0 |

## 1. Contradicciones
| # | Dónde | Choque | Solución concreta |
|---|---|---|---|
| C1 | DISENO §2 «No cambia: luz, bloom, niebla» ✅ y CLAUDE norma 1 · contra DISENO §6 y ROADMAP C1-C3 (luz, cielo y niebla cambian; niebla climática; nieve) | Dos ✅ incompatibles | Añadir a la norma 1 la excepción «día/noche y clima» (P1). Regla técnica: la densidad de niebla nunca baja de 0.03 (solo cambia el color), porque la niebla es lo que tapa el borde de carga (§3) |
| C2 | ROADMAP A2 «relieve suave» · contra TINY_ACTUAL (apuntado sobre el plano del suelo, rayo de bala y colisiones en 2D, física de props con suelo fijo) y norma 1 | El relieve rompe «Tiny igual» y no está en DISENO §3 | Quitar «relieve suave» de A2: mundo plano; la variedad sale de suelo pintado, agua y props (P2) |
| C3 | DISENO §5-3 «munición limitada; armas con desgaste» · contra §2 «No cambia: disparo, recarga» y norma 1 «armas no se rediseñan» | Falta la excepción | Declararla en §2 «Cambia» (P3). El desgaste se queda en D5, como ya dice el ROADMAP |
| C4 | DISENO §3 «claro inicial: zombis lentos» · contra §2 «los 3 tipos y sus cifras no cambian» | «Lentos» sería un cuarto tipo o cambiar cifras | Claro inicial = solo tipo normal, pocos y dormidos. Quitar «lentos» |
| C5 | DISENO §4 «despejar lo deja despejado» y §3 «región visitada no cambia» · contra §5-7 «un sitio limpio puede volver a llenarse» | No se sabe cuánto ni cuándo | Regla única en §4: una región despejada solo se repuebla si tiene causa registrada (ruido acumulado o refugio cerca), con tope 💡 del 50 % de su población original, y los zombis que llegan se restan de regiones vecinas |
| C6 | DISENO §0 «el peligro no crece por un reloj» ✅ · contra §5-7, §5-8 y §6 (dependen del tiempo) | No es contradicción real, pero falta la frontera | Añadir a §5: «ninguna cifra de peligro es función solo del tiempo total jugado; el tiempo solo actúa en ciclos (estaciones) o con causa (ruido, abandono)» |
| C7 | DISENO §3 `hash(semilla, rx, rz, tipo)` | El tipo también sale de la semilla: definición circular | Dos niveles: `tipo = f(hash(semilla, rx, rz))`; contenido = `hash(semilla, rx, rz, canal)` con un canal entero por capa (props, zombis, botín, NPC) para que añadir una capa no cambie las otras |
| C8 | TINY_ACTUAL «máximo 40 vivos, piscinas 36/24/6» · contra DISENO §4 «pueblo lleno» | ¿El tope es parte de «Tiny igual»? | Mantener el tope de 40 ACTIVOS (con IA y dibujo). El resto de zombis de la región son datos y se activan por cercanía. Escribirlo en §4 |
| C9 | MODELOS_MESHY: «¿tiene plan de pago?» y «¿mismo esqueleto?» en «sin decidir» · contra el mismo archivo («plan de pago con 2 000 créditos», «esqueleto único ✅») | Texto viejo | Borrar esas dos líneas de «Qué sigue sin estar decidido» |
| C10 | MODELOS_MESHY y DISENO §0 «se espera a tenerlos, no se empieza con cápsulas» · contra ROADMAP principio 6 «los pasos 0-4 no necesitan modelos» | Ambiguo si se puede programar con relleno | Una frase en norma 5: «durante el desarrollo se trabaja con el relleno de Tiny; ningún hito se da por entregado con relleno». Además «pasos 0-4» y «paso 4 del ROADMAP» (MODELOS fila 9) son números del roadmap antiguo: cambiar por «A0-A7» y «A5» |
| C11 | MODELOS_MESHY: zombis con clips `run, attack, die` · contra DISENO §4 «dormido, deambulando» | Faltan animaciones | Añadir `idle` (o `sleep`) y `walk` a los tres zombis. Gratis si el esqueleto es compartido |
| C12 | ROADMAP A2 incluye tipo «pueblo» · pero los edificios llegan en A5 y D1 | Pueblo sin casas | A2 solo campo, bosque, carretera y agua. «Pueblo», «granja» y «ruinas» entran con A5 |
| C13 | ROADMAP «Total»: B 9, C 7, E 6 · las tablas suman B 8, C 6, E 7 | Cuentas | Corregir al aplicar la sección 4 |
| C14 | CLAUDE «un ZIP tras cada subpaso» · contra `coordinacion/LEEME.md` (ramas `sonnet/…` fusionadas a `main`) | Dos formas de entrega | Que Sonnet confirme cuál vale y borre la otra |

## 2. Huecos que bloquean algún paso
| # | Bloquea | Hueco | Solución concreta |
|---|---|---|---|
| H1 | A2, A5, B1 | Tiny solo tiene obstáculos circulares (TINY_ACTUAL «Jugador»). Muros, edificios y orillas no son círculos | Añadir UNA forma nueva, el rectángulo girado, en la rejilla espacial de A1 (incluirlo en la petición 002). El agua es zona no pisable hecha de celdas |
| H2 | A5, A6, B | No hay botón de interactuar ni se dice cómo se saquea en el móvil (TINY_ACTUAL «Táctil»: solo GRAN. y RECAR.) | Lo pequeño se recoge al pisarlo; un único botón contextual «USAR» aparece junto a contenedores, pozo, puertas y NPC. Escribirlo en DISENO §11 |
| H3 | A5 | A5 da botín pero el inventario llega en A6 | Ver cambio R4 |
| H4 | A3 | DISENO §4 no da cifras de vista ni de ruido | Tabla de datos `ruido.json` 💡: vista 9; andar 3; correr 6; agachado 0; disparo 30; granada 45 (unidades de Tiny; el disparo ya alcanza 28). Los zombis de regiones no cargadas no oyen: solo se apunta «ruido acumulado» en la región (lo usa C5) |
| H5 | A4 | No se dice dónde ni cuándo se guarda | IndexedDB (no localStorage: límite ~5 MB), una entrada por región + una de partida. Guardar al descargar una región, cada 30 s y al ocultarse la app (el móvil mata pestañas). El récord se guarda fuera de la partida, porque la muerte borra el mundo (§9) |
| H6 | A4 | «Región visitada no cambia aunque se añada contenido» (§3) exige conservar los generadores antiguos para siempre | Guardar `versionGenerador` en la partida. Durante el desarrollo, cambiar el generador invalida las partidas (el juego ya es de muerte total); la compatibilidad se promete solo a partir del hito E. Escribirlo en §3 |
| H7 | A6, A4, B2 | Hambre, sed, guardado y cultivos necesitan el reloj de juego, que el ROADMAP pone en C1 | Ver cambio R2 |
| H8 | B2, B4 | El refugio se descarga al alejarse (§3 «solo existe lo cercano»): huerto, NPC y comida se congelan hasta C6 | Ver cambio R5. Decidir además en §7: mientras el jugador está fuera, el refugio se resuelve «con cuenta al volver» y los asaltos solo ocurren con el jugador presente (💡) |
| H9 | B1, B4 | Los zombis van en línea recta y rodean círculos; no saben qué hacer ante un recinto cerrado. Los NPC necesitan pasar por puertas | Zombi: si una pieza le corta el paso, la ataca (sin búsqueda de caminos). NPC: búsqueda de caminos solo dentro de la rejilla de la región activa, con presupuesto por cuadro. Diseñarlo antes de B1 (candidata a petición Fable) |
| H10 | A1, A3 | Entidades que cruzan regiones (zombi que te persigue, prop lanzado por una granada) no tienen dueño definido | El zombi activo pertenece a la piscina; al quedar a más de 💡60 unidades se escribe como dato en la región donde está. El prop movido se guarda como cambio en la región donde se detiene. Incluir en 002 |
| H11 | A2 | Cámara desde arriba: copas de árbol y edificios altos tapan al jugador | Regla en §3: en bosque solo troncos y árboles muertos bajos; nada por encima de 💡2.5 de altura cerca de zona pisable hasta D1 |
| H12 | E4 (pero se decide ya) | No se dice qué modelo de coop se usará, y eso fija cuánto determinismo hace falta | Elegir ya «un móvil manda y el otro recibe el estado» (ver D1) |
| H13 | A6 | Cifras de hambre y sed ⬜ | Provisionales 💡 para poder probar: sed vacía en 1 día de juego (20 min), hambre en 2. El simulador previsto antes de C las ajusta |

## 3. Riesgos de rendimiento y determinismo
**Determinismo**
- **D1 · Se pide más de lo necesario.** CLAUDE norma 3 y DISENO §7 («NPC deterministas») sugieren simular igual en dos móviles. Con `dt` variable y trigonometría en IA y física (TINY_ACTUAL) eso no es alcanzable. Solución: coop con un móvil que manda. Así el determinismo exacto solo se exige a tres cosas: generación de regiones, reloj/clima y cálculo «al volver». El combate no lo necesita; dispersión y temblor de cámara pueden seguir con `Math.random` y A0 se abarata.
- **D2 · Cosas que cruzan regiones** (ríos, lagos, carreteras; §3). Si una región mira a su vecina ya generada, depende del orden de carga. Solución: esas formas salen de una función de mayor escala (`hash(semilla, celda grande)`) que cada región consulta por su cuenta; nunca se lee el estado de otra región. Es el criterio de éxito de 002.
- **D3 · Clima** (§6 «probabilidad por estación, transiciones graduales»). Si se sortea avanzando una cadena cuadro a cuadro, cambia al guardar y cargar. Solución: clima = `hash(semilla, índiceDeTramo)` con tramos de duración fija; la transición es interpolar entre tramo actual y siguiente.
- **D4 · Reloj.** Sumar `dt` decimales da resultados distintos en cada móvil. Solución: reloj en ticks enteros (por ejemplo 1/20 s) acumulados; todo lo demás se deriva de ese entero.
- **D5 · Cálculo al volver** (§3). Debe depender solo de (cambios guardados, tick de la última visita, tick actual, semilla), y dar lo mismo visitando una vez que dos. Solución: fórmulas cerradas por tramos, sin bucles con azar.
- **D6 · Origen flotante** (§3 «pasadas 2 000 unidades»). Un umbral crea un salto raro y difícil de probar. Solución: posición = región entera (`rx`, `rz`) + decimal local, y dibujar siempre relativo a la región del jugador; se prueba desde el primer día.

**Rendimiento**
- **R-a · Se carga demasiado.** Niebla 0.03 y `far` 120 (TINY_ACTUAL) dejan ver unas 50 unidades. 9–25 regiones de 100×100 (§3) son 300–500 de lado: memoria y generación sin beneficio. Solución para 002: región de datos de 64, trozos de dibujo de 16–32, dibujado solo hasta ~60 del jugador, datos en 3×3.
- **R-b · Tirones al cruzar regiones.** Crear y destruir mallas instanciadas sube datos a la GPU y genera basura. Solución: una malla instanciada global por tipo de prop con capacidad fija, reescrita con los trozos cercanos; listas reutilizadas; presupuesto 💡 ≤ 2 ms por cuadro.
- **R-c · Personajes.** 40 zombis × 500 + NPC × 1 200 + jugador 2 500 (MODELOS «Presupuestos») ya se comen más de la mitad de los 40 000, y cada esqueleto animado cuesta CPU. Además 500 triángulos para un humanoide con huesos es muy optimista: comprobarlo en la prueba de tubería. Solución: repartir el presupuesto (💡 personajes 18 000 · mundo 18 000 · efectos 4 000), tope de ~25 esqueletos animando a la vez (los lejanos a media frecuencia), y si el zombi no baja de ~1 200, bajar activos antes que calidad.
- **R-d · Sombras.** Cada prop con sombra se dibuja dos veces; los 40 000 no dicen si cuentan esa pasada. Solución: que el medidor `?debug` muestre triángulos de las dos pasadas y el límite se aplique a la suma; decorado pequeño sin sombra.
- **R-e · Texturas.** 40 lugares con modelos Meshy de textura propia llenan la memoria del móvil. Solución: añadir a la norma 2 un límite 💡 de 64 MB de texturas; decorado a 512 en atlas compartidos.
- **R-f · Guardado que crece sin fin** (mundo ilimitado, §3). Solución: cambios compactos por región (listas de ids) y tope 💡 de 4 KB por región; el medidor muestra el tamaño total.

## 4. Cambios propuestos al ROADMAP
| # | Cambio | Motivo |
|---|---|---|
| R1 | Partir A0 en tres subpasos LOW: A0a módulos (sin cambiar nada) · A0b medidor `?debug` · A0c ids + semilla solo en el mundo | A0 junta 4 trabajos; CLAUDE prohíbe juntar subpasos. Con D1, A0c se reduce |
| R2 | El reloj de juego (ticks enteros, guardado) pasa a A0c; C1 queda solo como luz de día/noche | H7 |
| R3 | A2 sin relieve y sin «pueblo»; la forma rectángulo entra en A1 | C2, C12, H1 |
| R4 | Orden nuevo: A6a (inventario mínimo + botón USAR) → A5 (lugares y botín) → A6b (hambre, sed, muerte total) | H2, H3: no se puede saquear sin dónde guardarlo |
| R5 | La versión mínima de C6 (cálculo al volver) pasa a ir justo antes de B2 | H8: sin ella el huerto no crece al salir a explorar |
| R6 | Añadir «A0d Prueba de tubería Meshy» (LOW), que hoy solo existe en MODELOS_MESHY. A8 deja de bloquear la Entrega A: se hace cuando `player.glb` con clips tácticos pase esa prueba. El enganche de A2 (`altura`, `saltable`) se mantiene | A8 es el único paso de A que depende de animaciones; un retraso de arte no debe parar el hito |
| R7 | Limpiar C4/C5: «consumo por NPC» ya está en B4 y «recursos finitos» en A5; «el mejor botín en los peores sitios» es contenido de D1/D2 (bunker y cuartel tienen interior). C4 = refugio visible; C5 = migración + deterioro | Trabajo duplicado |
| R8 | A4 se queda donde está, pero el formato de cambios y los ids se fijan en A1 (ya pedido en 002) | Principio 2 del ROADMAP |
| R9 | Rehacer la suma de subpasos tras R1-R7 (≈ 44) | C13 |

**Orden resultante del hito A:** A0a · A0b · A0c · A0d · A1 · A2 · A3 · A4 · A6a · A5 (×2) · A6b · A7 · (A8 cuando haya animaciones).
