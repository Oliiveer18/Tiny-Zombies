# Móvil de referencia para medir

**iPhone 14** (decisión del usuario, 15 nov 2026). Todas las cifras del juego (objetivos: mínimo 30 fps, sostenido 40, ideal 60; peor cuadro ≤ 33 ms; triángulos, llamadas y memoria se apuntan como indicadores, sin tope: ver `docs/CALIDAD_GRAFICA.md`) se miden aquí con `?debug`. Las capturas del medidor van en esta carpeta, con el nombre del subpaso.

## Mediciones
| Fecha | Versión | Escena | fps | Peor cuadro | CPU | Triángulos | Llamadas | Captura |
|---|---|---|---|---|---|---|---|---|
| 2026-11-17 | v0.1.81 | Mapa de prueba, cámara Tiny, vertical, 12 zombis de relleno, panel de barras abierto | 58 | 27,0 ms | 2,0 ms (máx. 3,0) | 30 404 | ≈ 70 | `2026-11-17_iphone_camara_tiny.jpg` |
| 2026-11-17 | v0.1.91 | Prueba de carga `?carga` completa, vertical 390 × 699 (Safari con barras), ajustes por defecto | 51 (base) | 25 ms | 2,2 ms | 27 456 | 58 | `2026-11-17_carga_v0.1.91.md` (22 filas) |
