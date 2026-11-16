# PROMPTS_MESHY · prueba de tubería con 2 modelos (💡 propuesta; el usuario cambia lo que quiera)

Objetivo: generar SOLO dos modelos (cuerpo base de jugador y zombi normal), comprobar que funcionan en Tiny (subpaso A0d) y recién entonces hacer el resto. Máximo 2-3 intentos por modelo. Apuntar los créditos que quedan en `coordinacion/REGISTRO.md`.

## Reglas comunes para las dos imágenes de referencia
- Una sola figura, de cuerpo entero, **de frente, en pose A** (brazos algo separados del cuerpo, piernas separadas, manos abiertas, mirando al frente). Sin arma, sin mochila, sin sombrero en el jugador: eso son accesorios aparte.
- Fondo liso gris claro, luz suave y pareja, sin sombras duras, sin texto ni logos.
- Proporciones compactas (cabeza grande, cuerpo corto, unas 3,5 cabezas de alto), estilo de videojuego estilizado, no realista.
- Colores propios: NO se copian los de la referencia (casco claro, chaleco oscuro y camuflaje claro).
- Se generan 3-4 imágenes y se elige la mejor ANTES de gastar créditos en Meshy.

## Cómo generar las imágenes (💡 recomendado: dentro de Meshy, sin otra herramienta)
Meshy tiene **Text to Image** en su «Image Workspace» (según su ayuda, nov 2026): eliges un modelo de imagen, pegas el texto, pones **Pose = A-Pose** y generas varias; eliges la mejor y la mandas directo a **Image to 3D**. Coste por imagen según su ayuda: 3 (Nano Banana), 6 (Nano Banana 2) o 9 créditos (Nano Banana Pro / GPT Image 2); 4 imágenes de la más cara = 36. Para la prueba basta el modelo barato o el medio. En Image to 3D hay además un interruptor A-Pose / T-Pose que, según su ayuda, cuesta 0 créditos (plan Pro o superior). Fuentes: [Text to Image](https://help.meshy.ai/en/articles/13696156-how-to-use-the-text-to-image-feature) · [Poses](https://help.meshy.ai/en/articles/10255659-how-to-generate-3d-models-with-a-pose-t-pose-or-custom-poses). Si prefieres otro generador de imágenes, vale cualquiera con los mismos textos.

## Imagen 1 · cuerpo base del jugador
```
Full body character concept, front view, A-pose, single character on a plain light grey background, soft even lighting. Stylized survival-game hero, compact proportions (big head, short body, about 3.5 heads tall), adult, neutral expression, short messy hair. Clothing: close-fitting plain base layer, a long-sleeve top and slim trousers in muted teal and dark grey, simple boots, fingerless gloves, nothing loose or bulky (no hood, no jacket volume, no belts or straps). No weapon, no backpack, no hat, no text. Clean silhouette readable from above, hands open, legs slightly apart.
```
Es el cuerpo base: ropa AJUSTADA a propósito, porque cada «ropa» se hace después re-texturizando este mismo modelo (no cambia la silueta) y el volumen (capucha, chaleco, mochila, casco) va como accesorio. Ver el plan en `MODELOS_MESHY.md` («Creador de personaje: plan de producción»). Añadir al final de la prueba: un re-texturizado de este cuerpo (≈ 10 créditos) para comprobar que el mismo esqueleto y las mismas animaciones siguen valiendo.

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
