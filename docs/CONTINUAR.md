# CONTINUAR · tablero del proyecto (quién tiene que hacer qué)

Actualizado: 17 nov 2026 por Fable (sesión de recuperación). Cómo se usa: `coordinacion/LEEME.md`. El estado anterior a esta fecha está en `docs/archivo/CONTINUAR_hasta_2026-11-17.md`.

## Ahora mismo
- **Le toca a: SONNET** → (1) **ART-1 parte 1** (corta: preparar el archivo para Mixamo) y después (2) **PAQ-03**. Ambos LISTOS.
- **Le toca al usuario (no bloquea a Sonnet):**
  1. **iPhone, prueba de carga:** abrir el juego con `?carga` al final de la dirección, en vertical, pulsar «Iniciar prueba», no tocar nada ≈ 90 s y enviar a Fable la captura de la tabla. Sin modo de bajo consumo.
  2. **iPhone, jugar 5 minutos el mapa de prueba con `?debug`** (panel de barras cerrado): mover, apuntar, disparar, granada, empujar una caja con «Usar», romper el candado a tiros o forzarlo, abrir la reja. Enviar una captura del medidor y decir si algún botón estorba o cuesta pulsarlo. Girar el móvil una vez para ver que en horizontal nada se rompe.
  3. **Ordenador, Mixamo (gratis, ≈ 20 min):** cuando Sonnet entregue ART-1 parte 1, seguir la parte 2 de `coordinacion/TRASPASOS/ART-1_prueba_mixamo.md`.
  4. **Elegir el aspecto del primer personaje** (paleta A, B o C de 009 §3, o cambios). No corre prisa: se necesita al aceptar ART-1.
- **Fable:** al próximo «Sigue», revisar lo entregado, fijar presupuestos con la captura de `?carga` y escribir el traspaso de PAQ-A1 (y el de ART-2 cuando ART-1 esté aceptada).
- **Orientación oficial: VERTICAL** (usuario, 17 nov; reversible). Pruebas en vertical 390 × 844 y comprobación en horizontal.
- **Calidad gráfica:** sin tope de triángulos. Manda `docs/CALIDAD_GRAFICA.md`: calidad máxima, límites solo por medición. Nadie rebaja calidad por su cuenta.

## Paquetes de código (Sonnet los toma en este orden)
| Orden | Paquete | Estado | Traspaso | Notas |
|---|---|---|---|---|
| — | PAQ-01 Cámara definitiva y lectura del escenario | **ACEPTADO** (Fable, 17 nov) · falta validar en iPhone | `coordinacion/TRASPASOS/PAQ-01_camara_y_lectura.md` | |
| — | PAQ-G1 Prueba de carga gráfica | **ACEPTADO** (herramienta) · **falta la captura `?carga` del usuario** | `coordinacion/TRASPASOS/PAQ-G1_prueba_de_carga.md` | Su resultado fija los presupuestos reales |
| — | PAQ-02 Interacción y reja | **ACEPTADO** (Fable, 17 nov) · falta validar el tacto en iPhone | `coordinacion/TRASPASOS/PAQ-02_interaccion_y_reja.md` | |
| 1 | ART-1 parte 1 · archivo para Mixamo | **LISTO** | `coordinacion/TRASPASOS/ART-1_prueba_mixamo.md` | Corta. Al acabar pasa a «ESPERA AL USUARIO (parte 2)» y Sonnet sigue con PAQ-03 |
| 2 | PAQ-03 Ruido y zombis que despiertan | **LISTO** | `coordinacion/TRASPASOS/PAQ-03_ruido_y_zombis.md` | |
| 3 | ART-1 parte 3 · convertir lo de Mixamo | ESPERA AL USUARIO | mismo traspaso | Cuando el usuario suba los archivos |
| 4 | PAQ-A1 Núcleo de animación | PLANIFICADO | — (diseño: 009 §7) | Fable lo pasa a LISTO al aceptar ART-1 |
| 5 | PAQ-A2 Capa por código y acciones | PLANIFICADO | — (diseño: 009 §7.3-7.4) | |
| 6 | PAQ-04 Puntería, cobertura y sigilo | PLANIFICADO | — (diseño: 004 T3-T6) | |
| 7 | PAQ-05 NPC del campamento | PLANIFICADO | — (diseño: 007 §4 y §6) | |
| 8 | PAQ-A3 Zombis y NPC sobre `anim.js` | PLANIFICADO | — (009 §8) | Necesita clips de zombi |
| 9 | PAQ-06 Sonido sintetizado | PLANIFICADO | — (diseño: 007 §9) | |
| — | PAQ-07 Mapa de prueba v1 | BLOQUEADO | — | Falta: tamaño del mapa (usuario) y escala (ART-2) |

Nota: hoy solo hay un paquete LISTO por delante además de ART-1 (la regla pide dos). El siguiente (PAQ-A1) depende del resultado de ART-1; si Sonnet termina PAQ-03 antes, Fable prepara PAQ-04.

## Tareas de arte
| Tarea | Estado | Qué falta |
|---|---|---|
| ART-1 Tubería Mixamo | parte 1 LISTA para Sonnet · parte 2 del usuario (ordenador) · parte 3 Sonnet | Ver traspaso. 0 créditos |
| ART-2 Personaje de referencia | BLOQUEADO | ART-1 ACEPTADA + aspecto elegido por el usuario → Fable escribe el texto para Meshy → el usuario genera (créditos en pausa hasta entonces). Especificación: 009 §3-§4 |
| ART-4 Resto de personajes | PLANIFICADO | PAQ-A3 + modelos |
| ART-5 Objetos y escala | PLANIFICADO | ART-2 + modelos |
| MED Medición en iPhone 14 | PRIMERA HECHA (17 nov, v0.1.81) | 58 fps · CPU 2,0 ms · 30 404 triángulos · peor cuadro 27 ms con el panel abierto. **Pendiente:** repetir con el panel cerrado en la versión actual y la prueba de carga. Tabla en `coordinacion/mediciones/MOVIL_REFERENCIA.md` |

## Hecho y en `main`
- Base de Tiny en módulos, medidor `?debug`, ids, semilla y reloj (A0a-A0c).
- Jugador de Meshy con 8 animaciones y movimiento con pies sin patinar (A0d-A0o). Mando de PlayStation y menú Controles (M1-M6).
- Callejón de prueba como datos, física propia, rotura de objetos, bidones, farolas, trozos, marcas de bala y sangre (C1-C4). Suelo por código con aceras y calcos (S1).
- Almacén de personajes: animaciones en archivo compartido y herramienta de piezas (P1-P2). Vacío de piezas.
- Reorientación: documentos (R0) y cámaras a prueba (R1). **Cámara elegida: Tiny.**
- PAQ-01 (cámara fija, muros translúcidos, aro del jugador, zombis lejanos ocultos), PAQ-G1 (modo `?carga`) y PAQ-02 («Usar», reja con bisagra y candado, lista de ruido, barras de física). Aceptados por Fable; sin validar aún en el iPhone.
- Diseños de Fable disponibles: 001-009 en `coordinacion/RESPUESTAS_FABLE/`.

## Lo que NO es verdad todavía (para no darlo por hecho)
- Solo hay UNA medición en el iPhone (escena de relleno). El techo real del móvil no se conoce hasta pasar la prueba de carga (PAQ-G1).
- Zombis y objetos son relleno (cápsulas y cajas). Solo el jugador es un modelo real, y su estilo está descartado.
- No hay NPC, ni zombis que reaccionen al ruido (en el mapa de prueba siguen quietos), ni sonido. La reja y el botón «Usar» existen pero no se han probado en el iPhone.
- La animación sigue siendo la antigua (mezcla de cuerpo entero con 8 clips de Meshy). El sistema nuevo (009) está diseñado, no programado. No se ha comprobado todavía nada con Mixamo.

## Decisiones que son del usuario y siguen abiertas
1. Tamaño del mapa de prueba (cuando haya personaje de referencia).
2. (Resuelta el 17 nov: orientación vertical, reversible.) Queda como punto a reevaluar tras PAQ-05, cuando haya enemigos que disparen: ¿se ve lo suficiente a los lados?
3. Visto bueno a las proporciones (4,5 cabezas) al ver el primer personaje.
4. Umbral del joystick derecho para apuntar sin disparar (se prueba en PAQ-04).
5. Aspecto del primer personaje: paleta A (recomendada), B o C de 009 §3; se aprueba sobre la imagen de referencia antes de generar el 3D.
6. ¿Tiene el usuario un ordenador para Mixamo? Si no, avisar a Fable (hay alternativa con Meshy, con menos control).
