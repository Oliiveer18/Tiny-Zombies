# TRASPASO DE SESIÓN · para la próxima sesión de Fable (escrito el 17 nov 2026 al cerrar)

Léelo después de `CLAUDE.md`. Con esto y `docs/CONTINUAR.md` puedes empezar sin volver a analizar lo anterior.

## 1. Estado real de `main`
- Compila (`npm run build`). `node tools/test_physics.mjs` pasa. Todo lo de abajo está publicado.
- **Quién trabaja:** solo Fable, que dirige **e implementa** (decisión del usuario; Sonnet en pausa). Se mantiene el método: traspaso con criterios y pruebas, entregas completas, documentos al día, publicar en `main` solo si compila.
- El número de versión que ve el usuario lo pone la publicación (va unos 20 por delante del que sale al compilar aquí). Pídele que lo confirme; no lo inventes.

## 2. Terminado (no repetir)
| Trabajo | Dónde mirar si hace falta |
|---|---|
| PAQ-01 cámara Tiny fija, muros translúcidos, aro del jugador | traspaso PAQ-01 |
| PAQ-02 «Usar», reja con bisagra y candado, lista de ruido en `usar.js` | traspaso PAQ-02 |
| PAQ-G1, G1b, G2 prueba de carga (`?carga`, `?carga=inv`, `?carga=resistencia`), resumen de sesión en `?debug` | traspasos PAQ-G* |
| PAQ-G3 calidad B por defecto, descarte por cámara de personajes, corrección de costuras, barra «Lupa y costuras» | `docs/CALIDAD_GRAFICA.md` §2c-2f |
| ART-1 parte 1: `tools/para_mixamo.mjs` y `public/descargas/jugador_a_para_mixamo.obj` | traspaso ART-1 |
| Diseños: 009 (personaje, Mixamo, sistema de animación) y 010 (zombis) | `coordinacion/RESPUESTAS_FABLE/` |

## 3. Decisiones cerradas que no se reabren
- Cámara Tiny 16,4 m y 58°, vertical. Referencia Tiny Troopers con identidad propia.
- Rendimiento: mínimo 30 fps · sostenido 40 · ideal 60. Sin topes arbitrarios de geometría. Nadie rebaja calidad sin el usuario.
- **Calidad gráfica: B · Nítida, definitiva y única. A y C descartadas.** La resistencia de 10 min con B no se midió; el usuario la acepta así. **No proponer más comparaciones.**
- Medido en el iPhone (con la calidad anterior A): 10 min a 42-52 fps sin caída por calor; jugando, media 55 fps; ≈ 24 personajes pesados en pantalla como referencia; geometría estática sin techo encontrado.
- El esqueleto de los humanos y zombis lo pondrá Mixamo (**aún sin probar**: falta que el usuario lo haga en un ordenador).
- Texturas de modelos definitivos: pocas piezas grandes con margen (DECISIONES 3.17).

## 4. PRIMERA TAREA: zombi normal (010 §8)
1. Leer `coordinacion/RESPUESTAS_FABLE/010_zombis.md` entero y, de `docs/MESHY_PEDIDOS.md` y `docs/PROMPTS_MESHY.md`, solo lo relativo a zombis (hubo un zombi fotorrealista rechazado el 16 nov).
2. Escribir el texto para la imagen de referencia del zombi normal (≤ 800 caracteres) en `docs/MESHY_PEDIDOS.md` y presentárselo al usuario con el coste en créditos. **El gasto necesita su visto bueno.**
3. Mientras el usuario genera: programar `tools/rehacer_textura.mjs` (010 §5) y probarla con `public/models/personajes/cuerpos/jugador_a.glb`, que tiene justo el defecto a corregir; se valida con «Lupa ×8» (0 motas en costuras).
4. Con el GLB del usuario: versión estática en el mapa de prueba, capturas a tamaño de juego y con lupa, y validación 1 por el usuario.
Dependencias: `@gltf-transform/*`, `meshoptimizer` y `sharp` ya están; `xatlas` habría que añadirlo. Hay una skill de Meshy disponible en el entorno por si el usuario quiere que se genere desde la sesión (preguntárselo; gasta sus créditos).

## 5. SEGUNDA TAREA: PAQ-03 (LISTO)
`coordinacion/TRASPASOS/PAQ-03_ruido_y_zombis.md`: zombis dormidos, despertar por ruido, vista, persecución, deambular, botón táctil de agacharse, 17 pruebas. Incluye la sección de coordinación con los modelos (nombres lógicos de clip) para sustituir el relleno sin rehacer nada. No depende de los modelos: puede hacerse mientras el usuario genera en Meshy.

## 6. Avisos prácticos
- **Probar siempre los botones con toque** (`hasTouch` + `tap`): `input.js` reserva los toques para los joysticks salvo elementos con clase `.btn` o `.ui`.
- El navegador de pruebas no mueve la resolución nativa: capturas y pruebas a `deviceScaleFactor: 2`. Sus fps no significan nada.
- En `src/` las líneas son largas: un comentario `//` a mitad de línea puede tragarse código que venía detrás (ya pasó con un `import`).
- Publicar: rama de la sesión y `main` (avance directo, sin forzar), como pide `CLAUDE.md`.
- Pendiente menor conocido: en `?carga` se ve detrás el cartel «Toca para empezar»; el descarte por cámara no se ha verificado en el borde de la pantalla en el iPhone.
