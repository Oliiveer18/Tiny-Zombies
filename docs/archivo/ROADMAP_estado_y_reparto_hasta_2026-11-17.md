# Archivo · secciones retiradas de ROADMAP.md el 17 nov 2026 (sustituidas por «Plan vigente»)

## Estado a 16 nov 2026 (03:45)
- **Hecho (en `main`, jugable en el móvil):** A0a módulos · A0b medidor · A0c ids/semilla/reloj · A0d jugador de Meshy (falta el zombi) · y, fuera del plan original y pedidos por el usuario: A0e movimiento · A0f calidad del jugador · A0g luz, cámara y paneles ocultos · A0h joysticks flotantes · A0i pies sin patinar · A0j movimiento táctico.
- **Siguiente, sin decidir (esperando al usuario):** 004 táctico con Fable y qué propuestas tácticas entran; zombi de Meshy (A0d zombi); luz/tono final; A1a.
- **Pendiente de Hito A:** A0d zombi · A1 (6 subpasos) · A2 · A3 · A4 · A6a · A5 ×2 · A6b · A7 · A8. Quedan ≈ 17 de ≈ 26 (los 6 extra de movimiento y calidad se añaden al total).
- **Hitos B-F sin empezar.** Online (F) es lo último.

## Reparto Sonnet / Fable (16 nov) · a Fable solo lo que exige pensar a fondo
- **Sonnet (código, ajustes, medir, documentar):** todo subpaso de programación, los ajustes que dicta el usuario con las barras de `?debug` y los documentos de sesión. No pide permiso a Fable para ajustar cifras.
- **Fable (documentos de diseño, nunca código), una petición cada vez y solo cuando el siguiente paso la necesita:**
  1. **004 · Diseño táctico** (ahora, antes de A3): qué hace que se sienta táctico y de estrategia (cobertura, ruido y sigilo, visión, munición, ritmo del combate, órdenes a NPC), con reglas medibles y qué cambia en armas/zombis. Es lo que decide A3, A5 y B4.
  2. **005 · Mundo y lugares** (antes de A2/A5): tipos de región, plantillas de lugar y tabla de botín como datos.
  3. **006 · Refugio, NPC y economía** (antes de B1): piezas, estancias, consumo, rescate.
  4. **007 · Online** (antes de F1): arquitectura servidor, validación, creador de personaje en perfil.
  5. **Revisión de hito** al cerrar A, B, C: contradicciones y huecos (como la 001).
- No se le piden: texturas, cifras que se afinan jugando, nada que el usuario pueda decidir con una barra en el móvil.
- **Hecho en la rama de ajuste (16 nov, ver SESION):** A0d jugador de Meshy · A0e movimiento · A0f calidad · A0g cámara/luz/paneles ocultos. Falta A0d del zombi.

## Pista R · Reorientación visual tipo Tiny Troopers (aprobada por el usuario el 17 nov; detalle y criterios en `coordinacion/RESPUESTAS_FABLE/008_reorientacion_visual.md`)
Se intercala en el trabajo del mapa de prueba; el Hito A no cambia. Entregas agrupadas, validando con el usuario entre grupos.
| Entrega | Estado |
|---|---|
| R0 documentos (referencia, norma de cámara, pausa de Meshy) | HECHO 17 nov |
| R1 cámara elevada: 3 propuestas + Cerca + Tiny elegibles en el móvil | HECHO y VALIDADO 17 nov · **el usuario eligió «Tiny» (16,4 m · 58°) como definitiva** · resto de R1: dejarla como cámara por defecto y retirar las otras del menú (pendiente, pequeño); fps en iPhone sin medir (R8) |
| R2 prueba de compatibilidad con Mixamo (0 créditos) | pendiente (necesita un clip descargado por el usuario) |
| R3 primer personaje del estilo nuevo | pendiente (créditos en pausa hasta cerrar R1 y proporciones) |
| R4 `anim.js` (dos mitades, sin giro de 90°) · R5 capa procedural · R6 zombis y NPC | pendiente |
| R7 muros que no tapan + escala · R8 medición en iPhone 14 | pendiente |
IK pospuesto ✅. Tamaño del mapa de prueba: sin fijar hasta ver cámara, escala y visibilidad.

