# CLAUDE.md · Tiny Zombies → juego de supervivencia de mundo abierto (instrucciones permanentes)

## ⚠️ OLI Y LALI NO EXISTEN EN ESTE JUEGO
Oli y Lali son personajes de OTROS proyectos del usuario. En este juego no aparecen: ni como jugadores, ni como NPC, ni en nombres, ids, archivos, menús, modelos o historia. No se implementa, se prepara ni se menciona nada de ellos. Si los documentos de `docs/referencia_carretera_zombi/` los nombran, se IGNORAN. El protagonista de este juego aún no tiene nombre ni aspecto (se decidirá con los modelos de Meshy); en el código y los datos se le llama simplemente «jugador» (ids `j1`, `j2`).

**Estado: SOLO DISEÑO. No hay nada implementado todavía.** El código de `src/` es el Tiny Zombies original, sin tocar. El usuario quiere tener todo claro antes de empezar.

## Qué es el proyecto
Un juego de supervivencia en móvil que se juega y se siente EXACTAMENTE como Tiny Zombies (cámara, luz, controles, armas, zombis; ver `docs/TINY_ACTUAL.md`), pero dentro de un mundo grande, realista y por regiones, con NPC, refugio, comida, agua, estaciones y clima (ver `docs/DISENO.md`). Sin oleadas.

## Trabajo con dos chats (Sonnet y Fable)
Leer `coordinacion/LEEME.md`: reparto de tareas, ramas y peticiones. Fable NO edita código, salvo la pista de reorientación R0-R8 (`coordinacion/RESPUESTAS_FABLE/008_reorientacion_visual.md`), que el usuario le encargó implementar el 17 nov.

## Dirección visual (decisión del usuario, 17 nov)
Referencia: Tiny Troopers (Joint Ops / Global Ops), con identidad propia. Personajes compactos pero no infantiles, de 4-5 cabezas de alto, cabeza algo grande sin exagerar, equipo militar reconocible y detallado, acabado 3D moderno. El jugador actual (estilo juguete) NO es referencia para modelos nuevos. No se gastan créditos de Meshy hasta validar la cámara y las proporciones. Detalle en `docs/REFERENCIA_VISUAL.md`.

## Forma de entrega (decisión del usuario, 17 nov; sustituye a «un subpaso por sesión» y al «espera el hazlo» en lo ya aprobado)
Entregas agrupadas y completas: se juntan los trabajos con dependencias claras que se prueban juntos. Solo se para ante una decisión artística o técnica que cambie mucho el resultado, riesgo de romper sistemas importantes, una prueba fundamental fallida o algo irreversible. Cada entrega lleva: resumen breve, cambios, pruebas ejecutadas y resultado de aceptación.

## Lee en este orden
1. Este archivo → 2. `docs/CONTINUAR.md` (estado y siguiente paso) → 3. `docs/DISENO.md` (decisiones) → 4. `docs/TINY_ACTUAL.md` solo si tocas código de Tiny → 5. `docs/ROADMAP.md` solo la fila del paso → 6. `docs/referencia_carretera_zombi/` SOLO para consultar ideas del otro proyecto (no es código a copiar).

## Reglas de trabajo del usuario (heredadas de su proyecto Endless Aftermath; vigentes salvo que él diga otra cosa)
- Responder SIEMPRE en español, breve y directo: el usuario juega y trabaja desde el móvil y no es técnico. Claude decide las soluciones técnicas; si hay que elegir, ofrecer pocas opciones fáciles de tocar y una recomendación.
- Un subpaso por sesión. **Entrega (forma única ✅, decidida por el usuario el 15 nov):** todo en GitHub y publicado en `main` (código y documentos actualizados tras cada subpaso, solo si `npm run build` compila). NO se envían ZIP. Los subpasos no se agrandan ni se juntan.
- Antes de tocar código: decir el esfuerzo (LOW o MEDIUM), qué se va a hacer y cuándo podrá verlo en el móvil. Esperar el «hazlo».
- **Explicación fácil (regla permanente del usuario):** cada vez que se implemente algo, explicarle en un resumen corto y muy fácil de entender, sin tecnicismos: (1) qué se ha hecho, (2) qué cambia en lo que él verá o jugará, (3) cómo probarlo en el móvil. Máximo ~6 líneas, como si se lo contaras a alguien que no programa. El detalle técnico va aparte, en `docs/SESION.md`, que empieza cada entrada con ese mismo «Resumen fácil».
- Al terminar: qué se hizo, qué se comprobó y qué queda pendiente. No dar por verificado lo que no se ha comprobado.
- No sobreingenierizar, no ampliar tareas, no cambiar nada no pedido. Nada destructivo sin autorización (lo que se retira va a `docs/archivo/`).
- Escribir código pronto: no gastar la sesión leyendo y planificando.
- Documentar cada subpaso en `docs/SESION.md` (crear al empezar) y actualizar `docs/CONTINUAR.md`.

## Normas permanentes
0. **Estilo visual objetivo:** `docs/REFERENCIA_VISUAL.md` (captura y vídeo aportados por el usuario). Arte propio, nunca copiado.
1. **Tiny se queda igual.** Cámara, post-proceso, controles, estamina, armas, granadas, física de objetos y tipos de zombi no se rediseñan. Excepciones decididas por el usuario: las OLEADAS desaparecen; la LUZ cambia con la hora y el clima (la noche de Tiny es un punto fijo del ciclo); la CÁMARA DEFINITIVA es la «Tiny»: 16,4 m del jugador y 58° de inclinación, centrada en él, personaje ≈ 1/16 del alto de pantalla (elegida por el usuario en el móvil el 17 nov entre cinco propuestas; es la referencia para proporciones, visibilidad y escala: ver `docs/REFERENCIA_VISUAL.md`. Historial: Tiny original 16,4 m y 58° → 16 nov «más cerca y centrada», 9,0 m y 57° → 17 nov vuelve a 16,4 m y 58°, ahora sin adelanto hacia donde se apunta); NO hay niebla general (decisión del usuario, 16 nov: molesta; si se quiere un efecto parecido será local, no en todo el juego); la MUNICIÓN es limitada desde el paso A5 (ver DISENO §2). El mundo es plano (sin relieve).
2. **Rendimiento en móvil.** ≥ 58 fps sostenidos, peor cuadro ≤ 25 ms, < 40 000 triángulos visibles (móvil de referencia para medir: **iPhone 14**, ver `coordinacion/mediciones/`), coste independiente del tamaño del mundo. Nada de crear o subir a la GPU el mundo entero: trabajo por regiones, solo las cercanas, con presupuesto por cuadro. No se baja la calidad visual (pixelRatio, bloom, sombras) para ganar fps sin que lo decida el usuario. Todo lo nuevo se mide con un medidor `?debug` en el móvil.
3. **Listo para online.** Todo estado nuevo vive en datos serializables con id (jugadores, NPC, zombis, piezas). La generación del mundo, el reloj/clima y el cálculo «al volver» son deterministas (solo ellos lo necesitan de forma exacta): semilla + tiempo de juego, sin `Math.random`, sin `Math.sin/pow` en decisiones de generación (solo hash de enteros con `Math.imul` y `+ - * /`), sin relojes de pared. Mismo mundo siempre con la misma semilla. El combate no necesita ser determinista (dispersión y temblor de cámara pueden seguir con `Math.random`; la simulación es la que manda, también en servidor). **Ahora mismo NO hay cooperativo:** el juego es de un jugador y no se diseña ni prepara nada de coop (solo queda como idea lejana, paso E4). **El juego será ONLINE (se implementa lo último, pero todo se diseña ya para ello; ver `docs/DISENO.md` §14):** la lógica del juego (simulación) se mantiene separada del dibujo y solo recibe órdenes con id de jugador, de modo que el juego offline es «un servidor de un solo jugador» y más adelante la misma simulación puede correr en un servidor sin reescribirla.
4. **Contenido como datos** (JSON, tablas), no como código: lugares, tipos de región, estaciones, climas, NPC, recetas, armas.
5. **Modelos: todos con Meshy** (GLB en `public/models/`, configurados en `src/models.config.js`), como Tiny. No se crean modelos por código ni se usan cápsulas como aspecto final (`docs/MODELOS_MESHY.md`). Durante el desarrollo se trabaja con el relleno de Tiny; ningún hito se da por entregado con relleno. Lo demás (mundo, texturas del suelo, efectos) sí se genera ligero por código.
6. El código de Tiny está muy comprimido. Al crecer, separar en módulos con nombres claros sin cambiar su comportamiento.
