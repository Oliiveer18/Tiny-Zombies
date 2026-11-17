# EVALUACIÓN · prueba de Godot 4 frente a Three.js (plantilla + lo ya sabido)

Estado: **la prueba está escrita pero NO ejecutada** (`godot_prueba/`; el entorno de preparación no pudo ejecutar Godot). Todo lo marcado «MEDIDO» queda vacío hasta que se juegue en el Mac. Lo marcado «expectativa» es una opinión razonada sin comprobar, no un resultado.

## Lo comprobado de verdad hasta ahora
- Versión estable actual: **Godot 4.7 (junio de 2026)**; 4.6 (enero 2026) también tiene soporte. Fuente: política de versiones de la documentación oficial.
- Requisitos: el MacBook Pro 2019 (i5 Intel, 8 GB) **cumple** los del renderizador *Compatibility* (macOS ≥ 10.13, OpenGL 3.3, 4 GB mínimo / 8 GB recomendados). Fuente: página de requisitos de sistema de la documentación estable.
- Las animaciones del juego actual **se pueden reutilizar sin reescribirlas**: `tools/exportar_clips_godot.mjs` las muestrea (8 clips del protagonista y 7 del zombi, 264 KB en total).
- Los scripts pasan las comprobaciones estáticas (sangrías, paréntesis, referencias entre archivos, datos).

## Hoja de evaluación (rellenar tras jugar)
| Criterio | Cómo medirlo | MEDIDO | Expectativa previa (sin comprobar) |
|---|---|---|---|
| **Calidad visual** | Capturas a tamaño de juego junto a la referencia; ¿se ven los personajes mates y con peso? ¿sombras y luz comparables? | _pendiente_ | El renderizador *Compatibility* tiene menos efectos que Three.js con post-proceso (sin bloom ni suavizado avanzado de serie); el acabado mate de los personajes debería poder igualarse. |
| **Movimiento** | ¿Arranca, frena, gira y agacha con naturalidad? ¿Los pies patinan? ¿Las capas por código se notan? | _pendiente_ | Las mismas poses y la misma capa procedural: debería verse igual. Lo que cambia es la mezcla de clips (aquí con fundidos del reproductor, sin mezcla por pesos continua). |
| **Físicas** | Pendientes, rampa, empuje de cajas, ragdoll, impactos | _pendiente_ | Es la gran ventaja esperada: motor de físicas completo y ragdoll con huesos físicos de serie, frente a la física propia ligera de Three.js. Riesgo: el ragdoll creado por código no está probado. |
| **IA** | ¿Rodean obstáculos? ¿Oyen/ven/investigan/persiguen como en Three.js? | _pendiente_ | La malla de navegación horneada resuelve el problema conocido de los zombis atascados en rejas. Hay que verificar el horneado en tiempo de ejecución. |
| **Facilidad de desarrollo** | Tiempo y errores para cada cambio; ¿se entiende el código? | _parcial, abajo_ | Ver nota. |
| **Rendimiento** | F3 en el Mac y, sobre todo, en el iPhone: fps medios, llamadas, triángulos, memoria; 10 y 40 zombis | _pendiente_ | Nunca se ha medido nada de Godot en tu hardware. La animación de huesos y la física van en C++ (previsiblemente más baratas por personaje que en JS), pero la geometría es la misma. Lo decisivo es el iPhone. |

## Facilidad de desarrollo: lo que sí se vivió al escribirlo (opinión, sin ejecutar)
- **A favor de Godot:** navegación, colisiones, pendientes, cuerpos rígidos, ragdoll, entradas de mando, cámara y sombras vienen hechos y se usan con pocas líneas; en Three.js los escribimos a mano (física propia, percepción, etc.).
- **En contra:** reescribir en GDScript la lógica que hoy está en JavaScript (percepción, estados, capas de animación); aprender el motor; sin poder ejecutarlo aquí, cada API usada es una apuesta (por eso el primer arranque probablemente falle en algo pequeño).
- **Reutilizado sin rehacer:** modelos, texturas, esqueletos y animaciones (a través de datos).
- **Coste de una migración completa (estimación):** alto. El juego actual tiene decenas de módulos con pruebas y decisiones acumuladas; migrarlo es rehacer todo menos el arte.

## Cómo decidir (propuesta)
Migrar solo si, en el Mac **y sobre todo en el iPhone**: (1) el rendimiento con 40 zombis es claramente mejor o igual con mayor calidad; (2) el movimiento y las físicas se ven mejor de verdad, no solo parecido; (3) el coste de migrar compensa frente a seguir mejorando Three.js. Si falla (1) en el iPhone, no se migra.

## Lo que no se ha podido comprobar (por si se te pasa)
Todo lo que implica ejecutar Godot: que abra el proyecto, que importe los GLB (incluidas las texturas WebP), que los huesos se llamen como se espera, que las animaciones se apliquen, que el horneado de navegación funcione, que el ragdoll funcione, los controles de mando y táctiles, los fps.
