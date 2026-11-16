# 003 · Receta de assets con Meshy para el iPhone 14

Origen de cada dato: **[M]** documentación de Meshy (enlaces al final) · **[T]** cómo funciona Three.js r170 · **[R]** razonamiento propio · 💡 hay que medirlo en el iPhone.
Aviso: desde esta sesión no pude abrir las páginas de Meshy, solo resúmenes de búsqueda, y sus páginas se contradicen en tres puntos (marcados ⚠️). Esos tres se resuelven con pruebas de 0 créditos, no fiándose del texto.

## 0. Tres ideas que cambian el plan
1. **Un solo modelo de Meshy por personaje; la versión ligera se hace en el repositorio.** De Meshy sale el modelo «alto» (36 722 triángulos, texturizado, con esqueleto y animaciones). La versión «mundo» la saca Sonnet con la herramienta gratuita `gltf-transform simplify`, que reduce triángulos conservando UV, textura, esqueleto y animaciones [R]. Así los dos niveles comparten textura y animaciones, y no se depende de los ajustes Fijo 3K/10K de Meshy, que destrozan la cara.
2. **En el juego la cara es pintura, no geometría.** A 1,5 de pixelRatio el iPhone 14 dibuja ~1 266 píxeles de alto; el personaje ocupa 1/15 ≈ 85 píxeles y la cara unos 20 [R]. A ese tamaño labios y párpados modelados no se ven; lo que se ve es la textura. La cara modelada solo importa en el creador de personaje, y ahí va el modelo alto.
3. **El límite de 40 000 no cabe con 40 zombis con sombra.** Ver §1: lo decide el usuario después de medir.

## 1. Presupuesto de triángulos
| Clase | Mundo | Alto (creador, inventario) | Textura |
|---|---|---|---|
| Jugador | 4 000 | 36 722 (Adaptativo Alto) | 1024 |
| NPC | 2 500 | — (el mismo de mundo) | 512 |
| Zombi normal / corredor / tanque | 800 / 700 / 1 500 💡 | — | 512 |
| Peinado · accesorio | 400 · 250 | — | 256 |
| Objeto pequeño (barril, caja, saco, valla, barrera) | 150-250 | — | 256 |
| Coche | 1 200 | — | 512 |
| Pieza de refugio | ≤ 150 | — | 256-512 |
| Edificio (exterior) | ≤ 2 500, máx. 3 a la vista | — | 1024 |

- **Niveles:** 2 para jugador (alto y mundo), 1 para todo lo demás. No hace falta nivel por distancia: la cámara es fija y todo está igual de lejos [R].
- **La cuenta del peor caso** [R]: jugador con accesorios 4 650 + 3 NPC 7 500 + 40 zombis (30/8/2) 32 600 + 120 props 26 000 ≈ **71 000 en una pasada, ≈ 140 000 con la de sombras.**
- **Choque con la norma 2** [R]: con el límite actual (40 000 sumando las dos pasadas), 40 zombis con sombra real tocan a menos de 300 triángulos cada uno, sin dejar nada para el resto. Eso no es compatible con «la mejor calidad». Opciones para el usuario, tras la prueba de carga de §6:
  - **(a) Recomendada:** subir el límite a lo que el iPhone 14 aguante de verdad (💡 candidato: 150 000 sumando las dos pasadas).
  - (b) Mantener 40 000: zombis de ~300 triángulos y sombra redonda pintada en el suelo en lugar de sombra real.
  - (c) Intermedia: sombra real solo en jugador, NPC, coches y edificios; zombis con sombra redonda (≈ 85 000).

## 2. Pasos en Meshy (personaje)
| # | Paso | Ajustes | Créditos |
|---|---|---|---|
| 1 | Text to Image | Pose A, 4 imágenes, texto de §5 | 12-36 [M] |
| 2 | Image to 3D | Estándar, textura apagada, Pose A, mejora de imagen, licencia Privada. Simetría activada si aparece la opción 💡 | 25 |
| 3 | Remesh | **Adaptativo Alto**, triángulos | 0 |
| 4 | Texture | Con la MISMA imagen de referencia como guía (lleva la boca y los ojos a la pintura). Generar a 4K: cuesta lo mismo que 2K [M]; 8K no. PBR: sí en jugador y NPC, no en zombis y objetos | 10 |
| 5 | Rigging humanoide | Después de texturizar: la API dice que no vale para mallas sin textura ⚠️; el máximo es 300 000 caras [M], sobra | 0 en la app ⚠️ (la API dice 5) |
| 6 | Animaciones | Las de `MODELOS_MESHY.md` | 0 en la app ⚠️ (la API dice 3 cada una) |
| 7 | Descargar GLB | Guardar el original en `arte_fuente/` (fuera de `public/`) | 0 |

- **Por qué texturizar DESPUÉS del remesh:** Meshy se contradice sobre si Remesh conserva la textura ⚠️ (su guía dice que la recalcula sola; su tutorial dice que se pierde). Con este orden no depende de ello.
- **En el repositorio (Sonnet, 0 créditos):** `gltf-transform simplify` → nivel «mundo»; `resize` → tamaño de textura de §1; `webp` → peso. Comandos exactos en A0d.
- **Objetos y piezas:** imagen (3-6) + Image to 3D con Meshy 6 Lite (10) o Meshy 6 (20) + Remesh Adaptativo Alto + Texture (10) ≈ **25-35**. Sin rig. Se reducen igual en el repositorio.
- **Coste:** personaje ≈ **60-70** (con un reintento de textura); ropa ≈ **10**; objeto ≈ **30**.

| Tanda | Qué | Créditos |
|---|---|---|
| **Ahora (hito A)** | Terminar jugador 1 (20) + 3 zombis (210) + 6 objetos de Tiny (200) + 2 ropas de prueba (20) | **≈ 450** |
| Hito B | 3 cuerpos de NPC + 10 ropas (310) + 8 piezas de refugio (250) | ≈ 560 |
| Más adelante | 2 cuerpos más de jugador + 24 ropas (380) + 25 peinados y accesorios con Meshy 6 Lite (575) | ≈ 955 |

Total ≈ 1 965 de 2 388: quedan ≈ 420 para reintentos y **no alcanza para edificios**. Regla: no generar la tanda siguiente hasta cerrar la anterior en el móvil.

## 3. Texturas en el móvil
- **Lo que pesa en memoria es el tamaño, no el archivo** [T]. Una textura WebP, PNG o JPG ocupa en la GPU ancho × alto × 4 bytes, +33 % por los mipmaps: 2048 = 22 MB · 1024 = 5,6 MB · 512 = 1,4 MB · 256 = 0,35 MB. Con KTX2 ocupa unas 4 veces menos (1024 ≈ 1,4 MB).
- **Qué mapas** [R]: jugador y NPC = color + normales. Zombis y objetos = solo color (a 85 píxeles el mapa de normales no se nota). El mapa de metal se descarta siempre: la escena de Tiny no tiene mapa de entorno y en Three.js un material metálico sin entorno sale negro [T].
- **Cuenta de memoria con WebP** [R]: jugador 11 MB + 3 zombis 4 + 4 NPC 6 + 10 tipos de objeto 4 + coche y 3 edificios 18 + accesorios 2 ≈ **45 MB**, dentro del límite de 64.
- **Formato:** empezar con **WebP dentro del GLB**; `GLTFLoader` lo lee sin cambios [T]. Pasar a **KTX2** solo cuando el medidor pase de ~45 MB (previsible en el online, con muchas ropas a la vez).
- **Atlas compartidos: no** [R]. Meshy da una textura por modelo, rehacer UV rompería el re-texturizado, y cada tipo de objeto ya es una sola malla instanciada. Se controla con el tamaño.
- **Cambios en `src/assets.js`** (para Sonnet, en A0d):
  1. Al cargar: `metalness = 0` y quitar `metalnessMap` de todos los materiales.
  2. `anisotropy = 4` en la textura de color (vista inclinada; coste mínimo) 💡.
  3. `frustumCulled = false` en las mallas con esqueleto: Three.js usa la caja de la pose de reposo y el personaje puede desaparecer en el borde [T].
  4. Dos archivos para el jugador (`player.glb` mundo, `player_alto.glb` creador); el alto se carga solo al abrir el creador.
  5. Ropa = cambiar `material.map` sobre un material clonado (§4).
  6. Solo si se pasa a KTX2: `KTX2Loader` con `detectSupport(renderer)` y `loader.setKTX2Loader(...)`, copiando los archivos `basis_transcoder` de Three.js a `public/basis/`.
  7. El medidor `?debug` suma la memoria de texturas (ancho × alto × 4 × 1,33).

## 4. ¿El re-texturizado mantiene malla, UV y esqueleto?
- **Malla y UV:** sí, si se activa «Keep Original Texture and UV» en la app (en la API, `enable_original_uv: true`) [M]. ⚠️ Meshy se contradice sobre si viene activado por defecto: comprobarlo SIEMPRE antes de pulsar.
- **Esqueleto:** ninguna página de Meshy dice qué pasa al re-texturizar un modelo ya con esqueleto. **No hace falta saberlo** [R]: como malla y UV no cambian, una ropa es solo una imagen. Se re-texturiza el modelo del paso 4 (sin esqueleto), se extrae su imagen de color a `public/models/skins/` y el juego la pone sobre el cuerpo ya animado. Rig y animaciones se hacen una vez por cuerpo.
- **Comprobar en A0d** (1 ropa, 10 créditos): (1) el GLB re-texturizado tiene el mismo número de vértices y los mismos UV que el original (lo compara un script); (2) puesta sobre el cuerpo animado, la textura no tiene costuras ni partes corridas; (3) sigue encajando en el nivel «mundo».

## 5. Cara, boca y manos
- **Boca y ojos: pintados en la textura** [R]. La boca original es una línea fina y no hay geometría que la sostenga; el paso 4 con la imagen como guía es lo que la hace aparecer. La cara modelada de Adaptativo Alto se conserva solo para el creador.
- **Añadir al texto de la imagen de referencia** (cabe en 800 caracteres quitando «neutral face»): `Large simple wide-open eyes with dark outlines, thick eyebrows, clearly visible closed mouth with defined darker lips, bold readable face, hair off the forehead, even front lighting on the face. Thick mitten-like gloved hands, fingers together.`
- **Por qué** [R]: rasgos grandes y de alto contraste sobreviven a la reducción y se leen a 20 píxeles; pelo fuera de la frente evita que tape los ojos; manos tipo manopla no se rompen al reducir y aguantan un esqueleto sin huesos de dedos.
- **Pruebas de 0 créditos antes de seguir:** (1) Remesh Fijo 3K sobre el modelo YA texturizado: si conserva la textura, anotarlo (resuelve la duda ⚠️; no cambia la receta); (2) comparar la cara del nivel «mundo» de `gltf-transform` con el modelo a tamaño de juego, no de cerca.

## 6. Comprobaciones para A0d (iPhone 14, `?debug`)
| # | Qué | Pasa si |
|---|---|---|
| 1 | Clips | Un solo GLB trae todos los clips con los nombres de `models.config.js`. Si Meshy da un GLB por animación, Sonnet los une |
| 2 | Esqueleto | Jugador y zombi tienen los mismos nombres de hueso; un clip de uno se reproduce en el otro; ≤ 💡 40 huesos |
| 3 | Escala | Altura ≈ 0,9 unidades (la del relleno) ajustando `scale` |
| 4 | Peso | `player.glb` ≤ 600 KB; cada zombi ≤ 300 KB; todo el hito A ≤ 5 MB |
| 5 | Nada negro ni invisible | Ningún material sale negro; ningún personaje desaparece en el borde |
| 6 | Ropa | Las 3 comprobaciones de §4 |
| 7 | **Prueba de carga** `?debug=carga` | Jugador + 40 zombis animados + 120 props, 5 minutos seguidos (el iPhone baja potencia al calentarse). Tres tandas con el zombi a 500, 800 y 1 200 triángulos; apuntar fps, peor cuadro, triángulos de las dos pasadas, llamadas de dibujo y ms de animación. Vale el nivel más alto con ≥ 58 fps y peor cuadro ≤ 25 ms |
| 8 | Sombras | Repetir la mejor tanda con zombis sin sombra real: la diferencia decide entre (a), (b) y (c) de §1 |
| 9 | Memoria | Texturas ≤ 64 MB según el medidor |
| 10 | Vista | Captura a tamaño de juego (se distinguen silueta y capas de color) y captura del modelo alto de cerca (se ven ojos y boca) |

## Fuentes
- Meshy · Remesh (guía y API): https://docs.meshy.ai/en/webapp/guides/3d-model/remesh · https://docs.meshy.ai/en/api/remesh
- Meshy · tutorial de retopología (dice que la textura no sobrevive al remesh): https://www.meshy.ai/tutorials/ai-retopology-guide
- Meshy · Retexture API (`enable_original_uv`): https://docs.meshy.ai/en/api/retexture
- Meshy · Rigging (guía y API; límites y textura): https://docs.meshy.ai/en/webapp/guides/3d-model/rigging · https://docs.meshy.ai/en/api/rigging
- Meshy · precios (app y API, no coinciden): https://docs.meshy.ai/en/webapp/pricing · https://docs.meshy.ai/en/api/pricing
- Meshy · texturas PBR y resoluciones: https://docs.meshy.ai/en/webapp/guides/3d-model/ai-texturing · https://www.meshy.ai/tutorials/pbr-texturing-with-meshy
- Meshy · personaje animado en three.js: https://www.meshy.ai/developers/cookbook/recipes/animate-character-in-threejs/
