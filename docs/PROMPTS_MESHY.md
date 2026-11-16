# PROMPTS_MESHY · prueba de tubería con 2 modelos (💡 propuesta; el usuario cambia lo que quiera)

Objetivo: generar SOLO dos modelos (cuerpo base de jugador y zombi normal), comprobar que funcionan en Tiny (subpaso A0d) y recién entonces hacer el resto. Máximo 2-3 intentos por modelo. Apuntar los créditos que quedan en `coordinacion/REGISTRO.md`.

## Reglas comunes para las dos imágenes de referencia
- Una sola figura, de cuerpo entero, **de frente, en pose A** (brazos algo separados del cuerpo, piernas separadas, manos abiertas, mirando al frente). Sin arma, sin mochila, sin sombrero en el jugador: eso son accesorios aparte.
- Fondo liso gris claro, luz suave y pareja, sin sombras duras, sin texto ni logos.
- Proporciones compactas (cabeza grande, cuerpo corto, unas 3,5 cabezas de alto), estilo de videojuego estilizado, no realista.
- Colores propios: NO se copian los de la referencia (casco claro, chaleco oscuro y camuflaje claro).
- Se generan 3-4 imágenes y se elige la mejor ANTES de gastar créditos en Meshy.

## Imagen 1 · cuerpo base del jugador
```
Full body character concept, front view, A-pose, single character on a plain light grey background, soft even lighting. Stylized survival-game hero, compact proportions (big head, short body, about 3.5 heads tall), adult, neutral expression, short messy hair. Clothing: teal-green waterproof jacket with a small orange zipper, dark grey cargo trousers, tan work boots, fingerless dark gloves. Worn, slightly dirty fabric. No weapon, no backpack, no hat, no text. Clean silhouette readable from above, hands open, legs slightly apart.
```
Es el cuerpo neutro: el aspecto final de cada jugador sale de skins y accesorios.

## Imagen 2 · zombi normal
```
Full body character concept, front view, A-pose, single character on a plain light grey background, soft even lighting. Stylized zombie for a top-down survival game, compact proportions (big head, short body, about 3.5 heads tall), pale grey-green skin, sunken eyes, slightly open mouth, torn faded brown shirt and dark grey trousers, bare feet, arms held slightly away from the body, hunched but symmetrical pose. No weapon, no text, no blood splatter on the background. Clean silhouette readable from above.
```
Tanque y corredor se hacen después con la misma base (más ancho / más delgado).

## Pasos en Meshy (comprobar la cotización en pantalla antes de cada uno)
1. **Image to 3D** con la imagen elegida (modelo Meshy 6 o 6 Lite para probar; textura incluida). Objetivo de malla baja: jugador ≈ 2 500 triángulos, zombi ≤ 500-1 200 (ver `MODELOS_MESHY.md`).
2. **Rigging humanoide** (esqueleto automático). Comprobar que brazos y piernas quedan bien separados.
3. **Animaciones** de la biblioteca de Meshy:
   - jugador: `idle`, `walk`, `run` (y `shoot`, `reload`, `hit`, `die` si hay equivalentes);
   - zombi: `idle`, `walk`, `run`, `attack`, `die`.
4. Descargar en **GLB**. Nombres: `player.glb` y `zombie.glb`.

## Qué me mandas
Los dos GLB (súbelos al chat) y los créditos que te quedan. Yo los pongo en `public/models/`, ajusto `src/models.config.js` a los nombres de clips reales, los pruebo (A0d) y te cuento escala, triángulos y si comparten esqueleto.
