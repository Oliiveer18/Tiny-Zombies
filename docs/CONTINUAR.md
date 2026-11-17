# CONTINUAR · tablero del proyecto (quién tiene que hacer qué)

Actualizado: 17 nov 2026 por Fable. Cómo se usa: `coordinacion/LEEME.md`. El estado anterior a esta fecha está en `docs/archivo/CONTINUAR_hasta_2026-11-17.md`.

## Ahora mismo
- **Le toca a: FABLE** → revisar PAQ-01, PAQ-G1 y PAQ-02 (los tres ENTREGADOS por Sonnet el 17 nov) y preparar PAQ-03 y PAQ-04.
- **Le toca al usuario (cuando pueda, no bloquea a Sonnet):** (1) cuando Sonnet entregue PAQ-G1, pasar la prueba `?carga` en vertical y enviar la captura de la tabla a Fable; (2) descargar dos clips de Mixamo para ART-1 (`coordinacion/TRASPASOS/ART-1_prueba_mixamo.md`).
- **Orientación oficial: VERTICAL** (usuario, 17 nov; reversible). Todas las pruebas se hacen en vertical 390 × 844 y se comprueba además que en horizontal nada se rompe.
- **Calidad gráfica:** el tope de 40 000 triángulos está RETIRADO. Manda `docs/CALIDAD_GRAFICA.md`: calidad máxima, límites solo por medición.
- **Fable:** al próximo «Sigue», revisar lo entregado y preparar PAQ-03 y PAQ-04.

## Paquetes de código
| Paquete | Estado | Traspaso | Notas |
|---|---|---|---|
| PAQ-01 Cámara definitiva y lectura del escenario | **ENTREGADO** (Sonnet, 17 nov) | `coordinacion/TRASPASOS/PAQ-01_camara_y_lectura.md` | Base: `48aec15` o posterior |
| PAQ-G1 Prueba de carga gráfica | **ENTREGADO** (Sonnet, 17 nov; falta la captura `?carga` del usuario) | `coordinacion/TRASPASOS/PAQ-G1_prueba_de_carga.md` | Requiere PAQ-01 ENTREGADO. Su resultado (captura del usuario) fija los presupuestos reales |
| PAQ-02 Interacción y reja | **ENTREGADO** (Sonnet, 17 nov) | `coordinacion/TRASPASOS/PAQ-02_interaccion_y_reja.md` | Requiere PAQ-01 ENTREGADO |
| PAQ-03 Ruido y zombis que despiertan | PLANIFICADO | — (diseño: 007 §4, 004 T1-T2) | Lo prepara Fable en su siguiente turno |
| PAQ-04 Puntería, cobertura y sigilo | PLANIFICADO | — (diseño: 004 T3-T6) | |
| PAQ-05 NPC del campamento | PLANIFICADO | — (diseño: 007 §4 y §6) | |
| PAQ-06 Sonido sintetizado | PLANIFICADO | — (diseño: 007 §9) | |
| PAQ-07 Mapa de prueba v1 | BLOQUEADO | — | Falta: tamaño del mapa (usuario) y escala (ART-2) |

## Tareas de arte
| Tarea | Estado | Qué falta |
|---|---|---|
| ART-1 Prueba de Mixamo | ESPERA AL USUARIO | Que descargue un clip (gratis). Luego Sonnet lo pasa por las herramientas |
| ART-2 Personaje de referencia | BLOQUEADO | ART-1 hecha → Fable cierra proporciones y texto de Meshy → el usuario aprueba y genera (créditos en pausa hasta entonces) |
| ART-3 Sistema de animación | PLANIFICADO | ART-2 + clips |
| ART-4 Resto de personajes | PLANIFICADO | ART-3 + modelos |
| ART-5 Objetos y escala | PLANIFICADO | ART-2 + modelos |
| MED Medición en iPhone 14 | PRIMERA HECHA (17 nov) | 58 fps · CPU 2,0 ms · 30 404 triángulos · peor cuadro 27 ms con el panel abierto (repetir con el panel cerrado). Tabla en `coordinacion/mediciones/MOVIL_REFERENCIA.md`. Falta la prueba de carga |

## Hecho y en `main`
- Base de Tiny en módulos, medidor `?debug`, ids, semilla y reloj (A0a-A0c).
- Jugador de Meshy con 8 animaciones y movimiento con pies sin patinar (A0d-A0o). Mando de PlayStation y menú Controles (M1-M6).
- Callejón de prueba como datos, física propia, rotura de objetos, bidones, farolas, trozos, marcas de bala y sangre (C1-C4). Suelo por código con aceras y calcos (S1).
- Almacén de personajes: animaciones en archivo compartido y herramienta de piezas (P1-P2). Vacío de piezas.
- Reorientación: documentos (R0) y cámaras a prueba (R1). **Cámara elegida: Tiny.**
- Diseños de Fable disponibles: 001-008 en `coordinacion/RESPUESTAS_FABLE/`.

## Lo que NO es verdad todavía (para no darlo por hecho)
- Solo hay UNA medición en el iPhone (escena de relleno). El techo real del móvil no se conoce hasta pasar la prueba de carga (PAQ-G1).
- Zombis y objetos son relleno (cápsulas y cajas). Solo el jugador es un modelo real, y su estilo está descartado.
- No hay NPC, ni ruido, ni reja, ni botón de usar, ni sonido.

## Decisiones que son del usuario y siguen abiertas
1. Tamaño del mapa de prueba (cuando haya personaje de referencia).
2. (Resuelta el 17 nov: orientación vertical, reversible.) Queda como punto a reevaluar tras PAQ-05, cuando haya enemigos que disparen: ¿se ve lo suficiente a los lados?
3. Visto bueno a las proporciones (4,5 cabezas) al ver el primer personaje.
4. Umbral del joystick derecho para apuntar sin disparar (se prueba en PAQ-04).
