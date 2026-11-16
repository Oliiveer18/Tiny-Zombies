# COORDINACIÓN · Fable dirige, Sonnet implementa (sistema vigente desde el 17 nov 2026)

El usuario trabaja con dos chats que no se ven entre sí. **Todo lo que uno necesita saber del otro está escrito en el repositorio.** El usuario no transmite información: solo abre el chat y dice **«Sigue»** (o «Lee CLAUDE.md y sigue»). Cada chat sabe qué hacer leyendo `docs/CONTINUAR.md`.

## 1. Papeles
| | **Fable (dirección)** | **Sonnet (implementación)** |
|---|---|---|
| Hace | Audita, decide lo técnico y lo visual según los objetivos del usuario, define arquitectura y criterios, agrupa el trabajo en paquetes, escribe el traspaso de cada paquete, revisa lo entregado, mantiene los documentos centrales | Programa el paquete tal como está escrito, ejecuta sus pruebas, documenta el resultado |
| No hace | Programar (la excepción R0-R1 del 17 nov terminó) | Rediseñar, reinterpretar ni cambiar decisiones; elegir entre opciones que cambien el resultado |
| Si duda | Decide y lo anota en `docs/DECISIONES.md`; solo pregunta al usuario lo que es suyo (§6) | Lo secundario lo resuelve y lo anota en su informe; lo que cambie el resultado → **se para y escribe un BLOQUEO** (§5) |

## 2. Documentos y quién escribe en cada uno (regla contra pisarse)
| Documento | Para qué | Escribe |
|---|---|---|
| `CLAUDE.md` | Normas permanentes | Fable |
| `docs/CONTINUAR.md` | **Tablero**: hecho, listo, en curso, pendiente, esperando al usuario | Fable; Sonnet cambia SOLO el estado de su paquete |
| `docs/DECISIONES.md` | Decisiones definitivas vigentes (y las sustituidas) | Fable |
| `docs/ROADMAP.md` | Hoja de ruta única («Plan vigente» + hitos) | Fable |
| `docs/DISENO.md`, `REFERENCIA_VISUAL.md`, `MESHY_PEDIDOS.md`, `MODELOS_MESHY.md` | Diseño del juego y del arte | Fable |
| `coordinacion/TRASPASOS/PAQ-nn_*.md` | Instrucciones de un paquete | Fable; Sonnet rellena SOLO la sección «Informe de Sonnet»; Fable la sección «Revisión de Fable» |
| `coordinacion/RESPUESTAS_FABLE/` | Diseños de fondo (001-008) citados por los traspasos | Fable |
| `src/`, `tools/`, `public/`, `index.html`, `package.json`, `vite.config.js` | El juego | **Sonnet** |
| `docs/SESION.md` | Diario técnico; cada entrada empieza con «Resumen fácil» | Sonnet (añade al final) |
| `coordinacion/REGISTRO.md` | Una línea por entrega o decisión | Ambos (solo añadir al final) |
| `coordinacion/PETICIONES_FABLE.md` | Bloqueos y preguntas de Sonnet a Fable | Sonnet añade; Fable responde y marca |
| `docs/archivo/` | Lo retirado (no se borra nada) | Quien retira |

Ninguno edita los archivos del otro. Si Sonnet ve un error en un documento de Fable, lo anota en su informe o como bloqueo; no lo corrige.

## 3. Ciclo de un paquete
`PLANIFICADO` → **`LISTO`** (Fable cerró el traspaso) → **`EN CURSO`** (Sonnet) → **`ENTREGADO`** (Sonnet, en `main`) → **`ACEPTADO`** o **`DEVUELTO`** (Fable).
- Solo hay **un paquete EN CURSO** a la vez. Sonnet toma siempre el primer `LISTO` del tablero, en orden.
- Sonnet no empieza nada que no esté `LISTO`. Si no hay ninguno, se lo dice al usuario: «falta que Fable prepare el siguiente».
- Mientras un paquete está `EN CURSO` o `ENTREGADO`, Fable no toca `src/`. Fable puede preparar a la vez traspasos y documentos (archivos distintos: no se pisan).
- `DEVUELTO` = Fable escribe en «Revisión de Fable» qué criterio falla y qué hacer; el paquete vuelve a `LISTO` con prioridad.
- Un paquete `ENTREGADO` no bloquea el siguiente `LISTO`, salvo que el traspaso diga «requiere PAQ-xx ACEPTADO».

## 4. Procedimiento de Sonnet (siempre, en este orden)
1. **Estar en el último `main`:**
   ```
   git fetch origin main
   git checkout main && git pull --ff-only origin main     # o una rama sonnet/PAQ-nn creada desde origin/main
   git status                                              # debe estar limpio
   git merge-base --is-ancestor <BASE del traspaso> HEAD && echo BASE_OK
   npm ci && npm run build                                 # debe compilar ANTES de tocar nada
   ```
   Si no sale `BASE_OK`, no compila o hay cambios sin confirmar: parar y avisar.
2. Leer `CLAUDE.md` → `docs/CONTINUAR.md` → el traspaso del paquete → solo las secciones que el traspaso cita.
3. En `docs/CONTINUAR.md`, poner el paquete `EN CURSO` (fecha y commit de partida) y publicar ese cambio ya, para que se vea que está cogido.
4. Implementar el paquete completo. Sin micropasos ni pedir permiso para lo secundario.
5. Ejecutar TODAS las pruebas del traspaso y `npm run build`.
6. Rellenar «Informe de Sonnet» en el traspaso, añadir la entrada en `docs/SESION.md` y una línea en `REGISTRO.md`; poner el paquete `ENTREGADO`.
7. **Publicar:** `git fetch origin main`; si `main` avanzó, `git merge origin/main` (nunca forzar), volver a compilar; `git push origin HEAD:main`.
8. Decir al usuario, en fácil: qué se ha hecho, qué cambia en lo que verá, cómo probarlo en el móvil y qué versión debe aparecer abajo a la izquierda.

## 5. Bloqueos (Sonnet → Fable)
Se añade al final de `coordinacion/PETICIONES_FABLE.md`:
```
### BLOQUEO PAQ-nn · título corto · estado: ABIERTO
- Qué pide el traspaso (sección):
- Qué pasa en realidad (archivo, línea, prueba):
- Opciones que veo y cuál haría:
- ¿Puedo seguir con el resto del paquete mientras tanto? sí/no
```
Es bloqueo: una contradicción entre documentos, un criterio de aceptación imposible, algo que rompería un sistema que funciona, o una elección que cambia lo que el usuario verá. No lo es: nombres, estructura interna, cifras marcadas 💡 (se ajustan y se anotan).

## 6. Procedimiento de Fable al oír «Sigue»
1. `git fetch origin main` y ponerse al día. Leer el tablero.
2. Si hay bloqueos `ABIERTO`: responderlos primero (en el mismo archivo y, si cambia algo, en el traspaso y en `DECISIONES.md`).
3. Si hay paquetes `ENTREGADO`: revisarlos contra sus criterios (compilar, repetir las pruebas automáticas, leer el cambio), escribir «Revisión de Fable» y marcar `ACEPTADO` o `DEVUELTO`.
4. Mantener siempre **dos paquetes `LISTO` por delante** de Sonnet, para que nunca espere.
5. Actualizar tablero, hoja de ruta y decisiones. Decir al usuario solo lo que necesita: qué está aceptado, qué debe probar y las decisiones que son suyas.

**Solo se pregunta al usuario:** decisiones artísticas (aspecto de personajes, estilo), cambios de una decisión suya ✅, gasto de créditos de Meshy, lo irreversible, y cuando una prueba fundamental falla. Todo lo demás lo decide Fable.

## 7. Lo que hace el usuario
Decir «Sigue» en el chat que toque (el tablero indica cuál), probar en el iPhone lo que se le pida, enviar las capturas de `?debug` (van a `coordinacion/mediciones/`) y los archivos de Meshy o Mixamo cuando una tarea de arte los necesite.
