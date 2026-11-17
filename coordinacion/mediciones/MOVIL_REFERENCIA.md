# Móvil de referencia para medir

**iPhone 14** (decisión del usuario, 15 nov 2026). Todas las cifras del juego (objetivos: mínimo 30 fps, sostenido 40, ideal 60; peor cuadro ≤ 33 ms; triángulos, llamadas y memoria se apuntan como indicadores, sin tope: ver `docs/CALIDAD_GRAFICA.md`) se miden aquí con `?debug`. Las capturas del medidor van en esta carpeta, con el nombre del subpaso.

## Mediciones
| Fecha | Versión | Escena | fps | Peor cuadro | CPU | Triángulos | Llamadas | Captura |
|---|---|---|---|---|---|---|---|---|
| 2026-11-17 | v0.1.81 | Mapa de prueba, cámara Tiny, vertical, 12 zombis de relleno, panel de barras abierto | 58 | 27,0 ms | 2,0 ms (máx. 3,0) | 30 404 | ≈ 70 | `2026-11-17_iphone_camara_tiny.jpg` |
| 2026-11-17 | v0.1.91 | Prueba de carga `?carga` completa, vertical 390 × 699 (Safari con barras), ajustes por defecto | 51 (base) | 25 ms | 2,2 ms | 27 456 | 58 | `2026-11-17_carga_v0.1.91.md` (22 filas) |
| 2026-11-17 | v0.1.92 | `?carga` v2 (37 filas), vertical 390 × 699 | 53-60 (controles) | 18-25 ms | 1,8-2,0 ms | 27 456 | 58 | `2026-11-17_carga_v0.1.92.png` |
| 2026-11-17 | v0.1.92 | `?carga=inv` (37 filas) | 55-60 (controles) | 18-24 ms | 1,6-1,8 ms | 27 456 | 58 | `2026-11-17_carga_inv_v0.1.92.png` |
| 2026-11-17 | v0.1.92 | `?carga=resistencia`: 10 min, 12 personajes + 4 luces + explosiones | 42-44 (min 0-7) · 52 (min 7-10) | 28-34 ms; dos picos de 180 y 134 ms | 3,2 → 2,6 ms | 315 456 | 82 | `2026-11-17_resistencia_v0.1.92.png` |
| 2026-11-17 | v0.1.92 | **Juego real**, mapa de prueba, 4,1 min jugando (disparos, granadas), calidad A | media 55 · 1 % peor 40 · bajo 40 fps: 1 % del tiempo · bajo 30: 0 % | 26 ms | ≈ 3 ms | ≈ 29 000 | 67 | `2026-11-17_juego_debug_v0.1.92.png` |
