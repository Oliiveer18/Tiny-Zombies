# ART-1 · Tubería Mixamo: esqueleto y clips de Mixamo sobre el cuerpo actual (0 créditos)

- **Estado:** ver `docs/CONTINUAR.md` · **Esfuerzo:** LOW (parte 1) + LOW (parte 3) · **Base:** `f070412` o posterior
- **Decisiones que aplica:** `docs/DECISIONES.md` 3.6, 3.8, 3.13, 3.14 · **Diseño de fondo:** 009 §2, §4, §5 (leer solo esas secciones)
- **Reescrito por Fable el 17 nov:** la versión anterior probaba clips de Mixamo sobre el esqueleto de Meshy. Ahora el esqueleto lo pone Mixamo (009 §2). Nadie había empezado la versión anterior.
- **Para qué:** comprobar, sin gastar créditos, toda la tubería que seguirá el personaje definitivo, y dejar en el juego un personaje de relleno con esqueleto y clips de Mixamo sobre el que construir el sistema de animación (PAQ-A1).
- **Calidad gráfica:** no se toca nada del render.

## Parte 1 · Sonnet (se puede hacer YA; no depende del usuario)
1. `tools/para_mixamo.mjs <entrada.glb> <salida.obj>`: lee un GLB (con o sin esqueleto), aplica la pose de reposo, **quita el esqueleto**, pone el modelo de pie con los pies en y = 0 y mirando a +Z, altura 1,7 m (Mixamo trabaja mejor a escala humana; la escala de juego se aplica al volver), y escribe un `.obj` con coordenadas de textura. Sin dependencias nuevas si es posible (`@gltf-transform` ya está).
2. Ejecutarlo con `public/models/personajes/cuerpos/jugador_a.glb` y dejar el resultado en `public/descargas/jugador_a_para_mixamo.obj` (así el usuario lo descarga desde la propia página del juego: `…/descargas/jugador_a_para_mixamo.obj`).
3. Comprobar: el OBJ se abre (volver a leerlo y contar vértices y caras = los del GLB), una sola malla, altura 1,70 ± 0,01 m, pies en 0. Si el cuerpo actual no está en pose T ni A (brazos pegados al cuerpo), **decirlo en el informe**: Mixamo puede fallar con él y entonces la prueba se hará con el muñeco de Mixamo (ver parte 2, alternativa).
4. Poner ART-1 en «ESPERA AL USUARIO (parte 2)» y decirle al usuario la dirección de descarga y que siga la parte 2.

## Parte 2 · Usuario (unos 20 minutos, gratis, **en un ordenador**)
1. Descarga `jugador_a_para_mixamo.obj` de la dirección que te dé Sonnet.
2. Entra en **mixamo.com** con una cuenta gratuita de Adobe. Pulsa **Upload Character** y sube el archivo.
3. Coloca los puntos que pide (barbilla, muñecas, codos, rodillas, ingle). En **Skeleton LOD** elige **2 Chain Fingers (41)**. Siguiente hasta que el muñeco se mueva.
4. Con tu personaje cargado, pestaña **Animations**, escribe **rifle** y arriba filtra por **Packs**. Abre **Pro Rifle Pack** → **Download** (FBX Binary, 30 fps, **With Skin**). Repite con **Rifle 8-Way Locomotion Pack**. (Si no aparecen con ese nombre exacto, baja los packs de fusil que haya y dile a Sonnet cuáles son.)
5. Sueltas (Download: FBX Binary, **Without Skin**, 30 fps, sin reducción de fotogramas, y marca **In Place** si sale la casilla): **Reloading**, **Toss Grenade**, **Hit Reaction**, **Dying**.
6. Sube los archivos (los `.zip` tal cual) al chat de Sonnet y dile «Sigue con ART-1».
- **Alternativa si Mixamo no consigue poner el esqueleto** (muñeco deformado o error): no pasa nada. Haz los pasos 4 y 5 con el muñeco que trae Mixamo por defecto y súbelos igual; avisa a Sonnet.
- **Si no tienes ordenador a mano:** díselo a Fable. Hay alternativa (animaciones de Meshy), pero con menos control.

## Parte 3 · Sonnet (cuando lleguen los archivos)
1. Guardar los originales en `arte_fuente/mixamo/` (no se publica: los archivos de Mixamo no se pueden redistribuir sueltos).
2. `tools/de_mixamo.mjs`: convierte FBX → GLB (FBX2glTF, ya previsto en `prep_player.mjs`); del personaje con piel saca `public/models/personajes/cuerpos/jugador_mx.glb` (malla + esqueleto de 41 huesos, materiales y texturas de `jugador_a` recolocados por coordenadas de textura, escala de juego); de los clips saca `public/models/personajes/anims/humano_mx.glb` con **todos** los clips, nombres en minúsculas sin espacios y con prefijo de familia (`rifle_walk_fwd`, `rifle_run_left`, `crouch_idle`, `reload`, `toss`, `hit`, `death_front`…). Quitar el desplazamiento horizontal de la cadera en todos (queda el vertical). No se sustituye ningún archivo actual.
3. Escribir `src/data/anim/clips_mx.json`: por clip, duración, si es en bucle, velocidad que recorre (m/s a escala de juego, medida del desplazamiento original de la cadera antes de quitarlo) y momento de apoyo del pie izquierdo (fracción 0-1, medido: instante en que el pie izquierdo está más bajo y adelantado).
4. Visor mínimo `?mixamo=1` (junto a `?prueba=1`): el jugador usa `jugador_mx` y dos teclas / un botón pasan al clip siguiente y al anterior, con el nombre en pantalla. Solo para esta prueba; el juego normal no cambia.
5. Capturas (vertical 390 × 844, cámara de juego y una vista de lado) de: `rifle_aim_idle`, andar adelante, andar a la izquierda, correr adelante, agachado quieto, recargar.

## Criterios (los comprueba Sonnet y los revisa Fable)
| # | Criterio | Pasa si |
|---|---|---|
| 1 | Pistas | 0 avisos de pista sin hueso de destino al cargar todos los clips |
| 2 | Postura | En `rifle_aim_idle` el cuerpo queda erguido, brazos sujetando un fusil imaginario al frente, sin miembros retorcidos (capturas) |
| 3 | Pies | Quieto apuntando: los dos pies a < 3 cm del suelo. Andando: ningún pie se hunde > 3 cm |
| 4 | Malla | Ninguna parte de la malla se estira ni se queda atrás al andar y al agacharse (capturas) |
| 5 | Catálogo | Lista en el informe de todos los clips recibidos y de los que faltan respecto a 009 §5 |
| 6 | Juego normal | Sin `?mixamo`, el juego es idéntico (mismos triángulos y llamadas en `?debug`) y compila |

## Qué se decide con el resultado (Fable)
- **Pasa:** ART-1 ACEPTADA → PAQ-A1 pasa a LISTO y se desbloquea ART-2 (créditos, con el aspecto elegido por el usuario).
- **Falla 2-4 con el cuerpo actual pero va bien con el muñeco de Mixamo:** la tubería vale; el fallo es de la pose del cuerpo viejo. PAQ-A1 se hace con el muñeco de Mixamo como relleno y ART-2 exige pose en T.
- **Falla también así:** se vuelve a las animaciones de Meshy y Fable replantea el 009.

## Informe (parte 1, hecha por Fable el 17 nov)
`tools/para_mixamo.mjs` creado y ejecutado sobre `jugador_a.glb` → `public/descargas/jugador_a_para_mixamo.obj`: 9 836 vértices y 12 000 triángulos (los mismos que el GLB), una malla, altura 1,700 m, pies en y = 0, esqueleto de 20 huesos quitado. **Pose en A** (ancho/alto 0,67): Mixamo suele aceptarla; si no, vale la alternativa de la parte 2. No comprobado: que Mixamo lo acepte (solo se sabe al subirlo) y hacia dónde mira el modelo (Mixamo deja girarlo al subirlo). Partes 2 y 3 pendientes.

## Revisión de Fable
(pendiente)
