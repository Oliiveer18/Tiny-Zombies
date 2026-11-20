# CALIDAD DE PERSONAJES EN LA PRUEBA DE GODOT · qué limita hoy y qué proponemos (20 nov 2026)

Objetivo aclarado por el usuario: la prueba de Godot **no** debe copiar el resultado actual de Three.js, sino **demostrar un juego notablemente mejor**. Los modelos y animaciones actuales son aprovechables solo si su calidad basta.

## 1 · Qué limita hoy (medido sobre los GLB actuales)
| Limitación | Dato | Efecto en la calidad |
|---|---|---|
| **Esqueleto mínimo** | 17 huesos, sin clavículas, sin dedos, sin dedos de los pies, sin huesos de torsión; columna de solo 3 huesos | Hombros y torso rígidos al apuntar y girar; los pies no ruedan al pisar; la mano no puede agarrar un arma |
| **Pesos heurísticos** | 80 % (protagonista) y 75 % (zombi) de los vértices atados a **un solo hueso**; solo 1 % mezclado entre 3 o más | Codos, rodillas y hombros se doblan «de bloque», con aristas; se nota al moverse |
| **Dedos modelados pero sin huesos** | 462 vértices (protagonista) y 286 (zombi) en la punta del brazo, todos pegados al hueso de la mano | No se pueden cerrar, sujetar un arma ni arañar |
| **Animaciones inventadas por código** | Poses a base de senos y ángulos; sin mocap | Naturalidad limitada: es lo que el usuario nota como rigidez |
| **Proporciones compactas** (≈ 3-3,3 cabezas) | Brazos cortos y torso ancho respecto a un humano real | Animaciones de captura de movimiento de un cuerpo normal pueden atravesar el torso o no llegar al arma; necesitará correcciones y puntos de agarre |
| **Malla fusionada** | Ropa, piel y pelo en una sola malla con una textura | Aceptable; el equipo (casco, mochila, arma) irá como piezas enganchadas a huesos |
Lo que **sí** vale: la forma, el acabado y las texturas de los modelos (calidad artística aprobada). El problema está en el **rig** y en las **animaciones**, no en el arte.

## 2 · Solución propuesta
1. **Rig profesional y animaciones de captura de movimiento: Mixamo** (gratis con cuenta de Adobe; se usa desde el navegador del Mac). Un esqueleto estándar de 65 huesos con clavículas, dedos, pies y columna de varios huesos, con pesos automáticos de mejor calidad, más una biblioteca enorme de animaciones reales: caminar y correr con fusil, apuntar, disparar, recargar, agachado, deslizarse, recibir impactos, morir; y para zombis, andar, correr, atacar, gritar, caer y levantarse. Sustituye a la vez al esqueleto, a los pesos y a todas las animaciones provisionales.
2. **En Godot: retargeting y AnimationTree.** Godot reasigna animaciones de un esqueleto humanoide a otro con `BoneMap` y `SkeletonProfileHumanoid` y las mezcla con un `AnimationTree` (espacios de mezcla por velocidad, capas para torso y piernas, transiciones). Encima, correcciones por código: inclinaciones por aceleración y giro, mirada, retroceso, y reacciones físicas a los impactos. Para agarrar el arma y apoyar los pies en las pendientes, cinemática inversa (por verificar en Godot 4.7).
3. **Equipo y arma** como piezas enganchadas a huesos (`BoneAttachment3D`).
4. **Ragdoll** con huesos físicos sobre el nuevo esqueleto, y reacciones de impacto parciales.
5. **Lo que se queda de la versión actual de la prueba:** escenario, cámara, física del jugador (gravedad, pendientes, colisiones, empuje), disparos, ruido, y la lógica de IA con navegación. **Lo que se sustituye:** la capa de animación (los clips por código pasan a ser provisionales hasta tener los de Mixamo).

## 3 · Qué hace falta (y quién)
| Paso | Quién | Dónde |
|---|---|---|
| Subir los dos modelos a Mixamo, colocar los marcadores y descargar con piel (FBX, pose T) | **Usuario** (Mac) | Archivos listos: `public/descargas/protagonista_para_mixamo.obj` y `zombi_para_mixamo.obj` (en T, 1,70 m, sin esqueleto) |
| Elegir y descargar las animaciones (FBX, sin piel, 30 fps, «In Place» en andar y correr) | **Usuario** | Lista abajo |
| Reaplicar las texturas originales, configurar el retargeting y el árbol de animación, enganches, ragdoll, pruebas | Fable/Sonnet | `godot_prueba/` |
| Ejecutar y probar en el Mac (y después en el iPhone) | **Usuario** | `godot_prueba/LEEME.md` |

### Animaciones a descargar (nombres aproximados de Mixamo; busca por estas palabras)
- **Protagonista (fusil):** rifle idle · rifle walk / run (y hacia atrás y de lado) · rifle aiming idle · firing rifle · reloading · crouch idle / crouched walking · running slide · hit reaction · death · turn.
- **Zombi:** zombie idle · zombie walk · zombie run · zombie attack · zombie scream · zombie reaction hit · zombie death · zombie stand up (y un reposo agachado para «dormido»).

## 4 · Riesgos que conviene tener claros
- **Retargeting a un cuerpo compacto:** brazos cortos con movimientos de un cuerpo normal. Se mitiga con correcciones y con cinemática inversa; si aun así no basta, hay que ajustar las proporciones del modelo (y eso es decisión artística del usuario).
- **Texturas tras Mixamo:** Mixamo devuelve el modelo sin nuestras texturas; se vuelven a asignar en Godot (se prepara una herramienta para extraerlas).
- **No se ha ejecutado Godot todavía** (denegado en el entorno de preparación): para iterar con calidad hace falta verlo funcionar y medirlo; hasta entonces cada línea de código de Godot es una apuesta.

## 5 · RESULTADO DE LA PRUEBA PILOTO CON MIXAMO (20 nov) — ejecutado en Godot 4.7
Material recibido: rig estándar de Mixamo para los dos personajes (33 huesos: columna de 3 huesos, clavículas, un dedo por mano, dedos de los pies), 5 animaciones del protagonista (andar con fusil, correr con fusil, apuntar, disparar, recargar) y 4 del zombi (andar, correr herido, golpear, morir).
**Comprobado de verdad (capturas en Godot, renderizado por software):**
| Aspecto | Resultado |
|---|---|
| **Importación** | Los FBX importan sin errores. Mixamo trató mis metros como centímetros: se corrige con `nodes/root_scale=58.8235` en los `.import` (que ahora se versionan). |
| **Texturas** | Se reaplican sin problema: el material del GLB original funciona tal cual sobre la malla del rig (las UV se conservan). |
| **Deformaciones** | En andar, correr, apuntar, disparar, recargar (protagonista) y andar, correr, golpear, morir (zombi) **no se ven deformaciones feas** en hombros, codos, rodillas ni caderas. Mucho mejor que el rig automático anterior. |
| **Hombros** | Limpios al apuntar con el fusil y al recargar. |
| **Pies** | Se apoyan y se alternan bien en las capturas. Contra el patinado: cada clip se cargó con su velocidad natural medida (andar 0,54 m/s, correr 1,76; zombi 0,24 y 1,06) y el juego ajusta la velocidad de reproducción a la real. **No se ha visto en movimiento continuo.** |
| **Agarre del arma** | Se midió la posición de la mano izquierda respecto a la derecha en todos los clips: el vector es **constante** (≈ 0,2 hacia delante y 17° hacia arriba), es decir, el fusil va sujeto de forma rígida y su eje queda definido. Con un fusil provisional (formas simples) las dos manos lo sujetan de forma creíble al apuntar, disparar y correr. |
| **Proporciones compactas** | Mixamo adapta bien las animaciones a nuestro cuerpo: no hay atravesamientos visibles. Una consecuencia: las dos manos quedan a solo 0,2 una de otra (en un humano normal, 0,35), así que **el fusil tiene que ser más corto** (ya se adaptó). |
| **Zombi** | Andar encorvado con los brazos por delante, correr herido y golpear se leen muy bien y son creíbles. |
**Problemas encontrados (a resolver si se amplía):**
1. **Los clips de andar y correr de Mixamo no vinieron «in place»** (la cadera avanza): se anula ese desplazamiento por código al cargarlos.
2. **Andar con fusil** lleva el cañón hacia abajo (postura de arma baja): es como lo anima Mixamo. Si no gusta, hay variantes.
3. **Faltan:** reposo del protagonista (se usa «apuntar»), reposo/despertar del zombi (se usa el primer fotograma de «morir» encorvado por código), giros, agacharse, deslizarse, paso lateral y hacia atrás, recibir impactos y morir del protagonista (usa ragdoll).
4. **Las mezclas entre clips** son fundidos simples; un `AnimationTree` con espacios de mezcla y capas (torso/piernas) daría más calidad.
5. El disparo de Mixamo dura 0,27 s: se repite en bucle al disparar de forma continua.
**Conclusión del piloto:** el rig y las animaciones de Mixamo suponen un salto claro de calidad en deformación y naturalidad, y Godot los integra bien. **Recomiendo ampliar el repertorio.** Falta el juicio del usuario sobre el movimiento en tiempo real (en Mac/iPhone).
