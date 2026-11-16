# ART-1 · Prueba de compatibilidad con Mixamo (0 créditos)

- **Estado:** ESPERA AL USUARIO · **Esfuerzo:** LOW · **Depende de:** un archivo que aporta el usuario
- **Decisiones que aplica:** `docs/DECISIONES.md` 3.6, 3.8
- **Para qué:** saber, antes de gastar más créditos de Meshy, si las animaciones de Mixamo sirven sobre un esqueleto puesto por Meshy. De esto depende de dónde saldrán todas las animaciones del juego.

## Parte del usuario (10 minutos, gratis)
1. Entra en mixamo.com con una cuenta de Adobe (gratuita).
2. Arriba, pestaña **Animations**. Busca **Rifle Aiming Idle** y selecciónala (se ve sobre el muñeco de Mixamo; no hace falta subir nada).
3. Pulsa **Download**: Format **FBX Binary (.fbx)**, Skin **Without Skin**, 30 fps, sin reducción de fotogramas.
4. Repite con **Walking** (marca la casilla **In Place**).
5. Sube los dos archivos `.fbx` al chat de Sonnet y dile «Sigue con ART-1».

## Parte de Sonnet
1. Guardar los FBX en `arte_fuente/mixamo/` (fuera de `public/`).
2. Convertirlos a GLB (FBX2glTF, ya previsto en `tools/prep_player.mjs` como entrada extra) y añadirlos como clips `mx_aim` y `mx_walk` a una copia de prueba de `anims/humano.glb` (`anims/humano_prueba.glb`); no sustituir el archivo real.
3. Dejar solo las pistas de giro de los 20 huesos que conserva el cuerpo y la posición de `Hips`; quitar el avance de caderas.
4. Con `?prueba=1&mixamo=1`, reproducir cada clip en el jugador actual y sacar 4 capturas por clip (frente, lado, arriba, cámara de juego).

## Criterios (los comprueba Sonnet y los revisa Fable)
| # | Criterio | Pasa si |
|---|---|---|
| 1 | Nombres de hueso | Las pistas del clip encuentran los 20 huesos (0 avisos de pista sin destino tras el filtrado) |
| 2 | Postura | En `mx_aim` el cuerpo queda erguido, brazos hacia delante, sin miembros retorcidos ni cruzados (capturas) |
| 3 | Pies | En `mx_aim`, los dos pies a < 3 cm del suelo; en `mx_walk`, ningún pie se hunde > 3 cm |
| 4 | Proporción | Las manos no atraviesan el torso ni la cabeza en ningún fotograma |

## Qué se decide con el resultado (lo decide Fable y lo anota en `DECISIONES.md`)
- **Pasa los 4:** Mixamo es la fuente de animaciones; los cuerpos nuevos se riggean en Meshy y reciben clips de Mixamo.
- **Falla 2 o 4:** plan B, también gratis: subir el cuerpo de Meshy (sin esqueleto) a Mixamo para que ponga el suyo y repetir la prueba.
- **Falla también el plan B:** las animaciones salen de la biblioteca de Meshy, como las 8 actuales.

## Informe de Sonnet
(pendiente)

## Revisión de Fable
(pendiente)
