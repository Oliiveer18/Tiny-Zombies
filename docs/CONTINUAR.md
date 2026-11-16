# CONTINUAR · tablero del proyecto (quién tiene que hacer qué)

Actualizado: 17 nov 2026 por Fable. Cómo se usa: `coordinacion/LEEME.md`. El estado anterior a esta fecha está en `docs/archivo/CONTINUAR_hasta_2026-11-17.md`.

## Ahora mismo
- **Le toca a: SONNET** → implementar **PAQ-01** (está `LISTO`). Después PAQ-02 (también `LISTO`).
- **Le toca al usuario (cuando pueda, no bloquea a Sonnet):** (1) una captura del medidor `?debug` en el iPhone con la cámara Tiny → primera medición real; (2) descargar un clip de Mixamo para ART-1 (instrucciones en `coordinacion/TRASPASOS/ART-1_prueba_mixamo.md`).
- **Fable:** al próximo «Sigue», revisar lo entregado y preparar PAQ-03 y PAQ-04.

## Paquetes de código
| Paquete | Estado | Traspaso | Notas |
|---|---|---|---|
| PAQ-01 Cámara definitiva y lectura del escenario | **LISTO** | `coordinacion/TRASPASOS/PAQ-01_camara_y_lectura.md` | Base: `48aec15` o posterior |
| PAQ-02 Interacción y reja | **LISTO** | `coordinacion/TRASPASOS/PAQ-02_interaccion_y_reja.md` | Requiere PAQ-01 ENTREGADO |
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
| MED Medición en iPhone 14 | ESPERA AL USUARIO | Nunca se ha medido nada en el móvil real |

## Hecho y en `main`
- Base de Tiny en módulos, medidor `?debug`, ids, semilla y reloj (A0a-A0c).
- Jugador de Meshy con 8 animaciones y movimiento con pies sin patinar (A0d-A0o). Mando de PlayStation y menú Controles (M1-M6).
- Callejón de prueba como datos, física propia, rotura de objetos, bidones, farolas, trozos, marcas de bala y sangre (C1-C4). Suelo por código con aceras y calcos (S1).
- Almacén de personajes: animaciones en archivo compartido y herramienta de piezas (P1-P2). Vacío de piezas.
- Reorientación: documentos (R0) y cámaras a prueba (R1). **Cámara elegida: Tiny.**
- Diseños de Fable disponibles: 001-008 en `coordinacion/RESPUESTAS_FABLE/`.

## Lo que NO es verdad todavía (para no darlo por hecho)
- Nada está medido en el iPhone 14: todos los «≥ 58 fps» son objetivos.
- Zombis y objetos son relleno (cápsulas y cajas). Solo el jugador es un modelo real, y su estilo está descartado.
- La cámara Tiny aún no es la que sale por defecto (lo hace PAQ-01).
- No hay NPC, ni ruido, ni reja, ni botón de usar, ni sonido.

## Decisiones que son del usuario y siguen abiertas
1. Tamaño del mapa de prueba (cuando haya personaje de referencia).
2. Si el tope de 40 000 triángulos cuenta las sombras (con la primera medición con modelos).
3. Visto bueno a las proporciones (4,5 cabezas) al ver el primer personaje.
4. Umbral del joystick derecho para apuntar sin disparar (se prueba en PAQ-04).
