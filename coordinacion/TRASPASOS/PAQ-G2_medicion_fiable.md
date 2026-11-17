# PAQ-G2 · Medición fiable: prueba de carga v2, resistencia y resumen de sesión

- **Estado:** ver `docs/CONTINUAR.md` · **Implementado por Fable** (decisión del usuario del 17 nov: por ahora sin Sonnet) · **Base:** `480390e`
- **Decisiones que aplica:** `docs/DECISIONES.md` 2.5 (objetivos 30 / 40 / 60), 2.11-2.13 · **Motivo:** `docs/CALIDAD_GRAFICA.md` §2b (la primera prueba real tiene datos contradictorios y no mide el rendimiento sostenido).
- **Calidad gráfica:** no cambia ningún ajuste por defecto del juego. Solo cambia cómo se mide.

## Qué incluye
1. **Objetivos nuevos en pantalla.** `?debug` y `?carga` usan 30 / 40 / 60: verde ≥ 40 fps y peor cuadro ≤ 33 ms, ámbar 30-39, rojo < 30.
2. **`?carga` v2** (37 filas, ≈ 2 min 30 s; mismo motor de medición: 1 s de espera + 3 s de medida):
   - Las familias de siempre (geometría, personajes, luces) con los mismos escalones.
   - **Filas de control:** la escena base se repite entre familia y familia. Si los controles no coinciden, el móvil cambió de ritmo y las filas no son comparables.
   - **Calidad medida con carga** (20 personajes), para que la pantalla no recorte a 60: por defecto · MSAA 2 · sin MSAA · res 3 sin MSAA · res 3 MSAA 2 · res 3 MSAA 4 · sin bloom · sin sombras · sombra 2 048.
   - **Desglose de 40 personajes:** normal · sin sombra · animación parada · animación a media frecuencia · repartidos por el mapa · repartidos con descarte por cámara.
   - Cada fila guarda los ajustes que había **de verdad** (resolución, MSAA pedido y comprobado en la tarjeta, sombra, bloom) y el percentil 95 del tiempo de cuadro. Salen en «Copiar resultados».
   - `?carga=inv`: la misma prueba con las familias en orden inverso (descarta el efecto del orden).
3. **`?carga=resistencia`:** 10 minutos con carga fija (12 personajes + 4 luces + una explosión cada 5 s), una fila cada 30 s. Sirve para ver si el móvil se calienta y baja de ritmo.
4. **Resumen de sesión en `?debug`:** media de fps, fps del 1 % de cuadros más lentos y porcentaje del tiempo por debajo de 40 y de 30, desde que se empezó a jugar.

## Archivos tocados
`src/carga.js`, `src/debug.js`, `src/renderer.js` (solo `calidadActual`, que ahora informa de si el antialias real coincide con el pedido).

## Pruebas hechas (Chromium táctil 390 × 699; render por software, así que los fps no significan nada aquí)
| # | Prueba | Resultado |
|---|---|---|
| 1 | `npm run build` | Compila; `carga.js` sigue en archivo aparte |
| 2 | `?carga` con toque | Arranca en < 300 ms; 37 pasos sin retroceder; termina en «Prueba completada» con 37 filas; 0 errores |
| 3 | Ajustes por fila | Cada fila de calidad muestra el ajuste pedido (res 2/3, MSAA 0/2/4, sombra 0/1 024/2 048, bloom) y **todas las filas de control vuelven a res 2 · MSAA 4 · sombra 1 024 · bloom**: los ajustes se restauran bien. El antialias real coincide con el pedido en todas |
| 4 | Desglose | «sin sombra» baja de 987 000 a 507 000 triángulos; «anim. parada» 0 mezcladores; «repartidos + descarte» baja a 555 000 (el descarte funciona con personajes animados) |
| 5 | `?carga=inv` | Mismas 37 filas en orden inverso de familias; 0 errores |
| 6 | `?carga=resistencia` | Arranca, cuenta atrás de ≈ 10 min, una fila cada 30 s con la carga puesta (12 mezcladores); interrumpirla muestra la pantalla de aviso con lo medido |
| 7 | Tabla final | Las 37 filas visibles sin recorte (se corrigió un recorte durante la prueba); sin desplazamiento lateral; «Repetir» vuelve al paso 1 |
| 8 | `?debug` en el mapa de prueba | Muestra los objetivos nuevos y el resumen de sesión; 0 errores |

**No comprobado:** nada en el iPhone real; la prueba de resistencia solo se ejecutó 70 s de sus 10 min.

## Lo que se decide con sus resultados (PAQ-G3)
- Si los controles son estables → presupuestos de escena (60 % de la carga que baja a 40 fps).
- Coste real de MSAA, bloom y sombras con carga → qué ajuste de calidad se propone al usuario (con capturas).
- Qué parte del personaje cuesta → descarte por cámara, sombras ajustadas, detalle por tamaño en pantalla, por ese orden según lo que diga el desglose.
- Resistencia → si a los 10 min se mantiene ≥ 40 fps.
