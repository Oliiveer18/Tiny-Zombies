# REFERENCIA_VISUAL · el estilo objetivo del juego

## ⚠️ Dirección vigente desde el 17 nov 2026 (manda sobre el resto de este documento)
**Referencia principal: Tiny Troopers (Global Ops y Joint Ops).** No se copia: identidad propia inspirada en ese tipo de juego. Lo de abajo (vídeo del cenital industrial) queda como referencia secundaria de luz, suelo y efectos.
- **Personajes:** compactos pero no infantiles ni de juguete; **4-5 cabezas de alto**; cabeza algo grande sin exagerar; cuerpo robusto y proporcionado; cara expresiva; casco, mochila, chaleco y arma reconocibles y con detalle; materiales cuidados. Tampoco soldados realistas.
- **El jugador actual (~3 cabezas, juguete) NO es referencia** para modelos nuevos. El primer personaje nuevo será la referencia visual del resto de personajes y enemigos.
- **Cámara DEFINITIVA ✅ (elegida por el usuario en el iPhone, 17 nov): «Tiny», 16,4 m y 58°, centrada en el jugador.** Las demás quedan solo como historial. Medido en iPhone 14 apaisado: Cerca 9,0 m / 57° → personaje 1/8 del alto · **A** 10,7 m / 58° → 1/10 · **B** 10,7 m / 61° → 1/11 · **C** 10,5 m / 64° → 1/12 · Tiny original 16,4 m / 58° → 1/16.
- **Como el personaje se ve pequeño**, el detalle debe estar en la forma y en el contraste de color de las piezas, no en textura fina.
- **Créditos de Meshy: en pausa** hasta validar cámara y proporciones.
- **Prioridad de calidad ✅ (usuario, 17 nov):** máxima calidad visual con rendimiento fluido. No se rebajan polígonos, texturas, sombras ni detalle para cumplir un número; el antiguo tope de 40 000 triángulos está retirado. Estrategia y reglas en `CALIDAD_GRAFICA.md`.
- **Criterios que salen de la cámara elegida** (✅ la cámara; 💡 las cifras). **Orientación oficial: VERTICAL ✅ (usuario, 17 nov; reversible si las pruebas de jugabilidad y visibilidad lo justifican).** Criterios para vertical:
  - **Tamaño en pantalla:** personaje ≈ 1/16 del alto → en vertical ≈ **105 píxeles** (cabeza ≈ 23); en horizontal serían ≈ 49.
  - **Lo que se ve:** 14 m de fondo (5,4 m por detrás del jugador y 8,7 m por delante). De ancho, en vertical ≈ 4,6 m abajo y 7,1 m arriba; en horizontal ≈ 21 m y 33 m.
  - **Diseño en vertical:** el juego se lee de abajo arriba. Lugares y combates en profundidad, pasos de ≥ 3 m, nada importante pegado al borde lateral, zona útil del centro hacia arriba (los mandos tapan el tercio inferior). El juego debe seguir funcionando al girar el móvil: no se construye nada que impida volver al horizontal.
  - **Proporciones:** dentro del 4-5 cabezas aprobado, apuntar a **4,5** 💡; se confirma con el primer personaje.
  - **Visibilidad de personajes:** primero silueta y bloques de color (casco, chaleco, mochila y arma con volumen y color propios, contraste con el suelo, un color dominante por bando, aro en el suelo); a 105 píxeles **también se ve el detalle medio** (bolsillos, correas, hebillas, cara), así que se modela y se pinta, sin escatimar. Cada modelo se aprueba en una captura a tamaño real de juego.
  - **Detalle y presupuesto:** sin tope por modelo; guía orientativa en `CALIDAD_GRAFICA.md` §6. El modelo alto de Meshy se guarda siempre.
  - **Efectos:** chispas, fogonazo y retícula ya se agrandan solos con esta cámara (R1).
  - **Rendimiento:** no se dibuja ni se anima lo que no se ve; es ahorro sin pérdida de calidad.
- **Escala del mundo 💡 (a validar con el primer personaje nuevo):** personaje 1,5 m (el actual mide 1,26-1,48 m según la pose) · puerta 1,9 m · muro 3,2 m · caja 0,8 m · barrera 0,6 m de alto · coche 3,4 m de largo (hoy 2,6 m, escala de juguete). Tamaño del mapa de prueba: sin fijar.


El usuario aportó una captura y un vídeo (15 s) de un juego cenital de otro autor y dijo: «el juego debería ser de este estilo; algo así se vería el personaje, pero con nuestro tipo de skins». Archivos en `referencia_visual/`: `captura_referencia.png`, `video_fotograma_1/3/5.png`. El vídeo original (28 MB) no está en el repositorio: lo guarda el usuario aparte. Es referencia de ESTILO, no código ni assets a copiar.

## Qué se ve (descripción de las imágenes)
- **Cámara:** cenital inclinada, jugador pequeño en pantalla (ocupa ~1/15 del alto), el mundo se ve en bloques amplios. Es el mismo tipo de encuadre que Tiny.
- **Personaje:** figura estilizada de proporciones compactas (cabeza grande, cuerpo corto), con equipo táctico muy legible desde arriba: casco claro, chaleco oscuro con bolsillos, camuflaje claro en brazos y piernas, botas grandes. Arma larga que se ve de lado. Silueta clara aunque sea pequeño.
- **Luz:** ambiente azul muy oscuro con **pozos de luz cálida naranja** bajo farolas, sin luz plana. El contraste frío/cálido es lo que da el aspecto.
- **Suelo:** placas industriales oscuras con **marcas pintadas** (líneas amarillas, flechas, rayas diagonales, rótulos como «IMPACT ZONE», «EQUIPMENT BAY», «SUPPLY STORAGE»). El suelo cuenta el sitio donde estás.
- **Objetos:** cajas de madera (algunas apiladas), barriles oxidados de varios colores con manchas, vallas de tablones, barreras naranjas de obra, bloques de hormigón. Todo con volumen, desgaste y sombras.
- **Efectos:** chispas y humo al impactar, destellos del arma, explosiones con humo oscuro y **escombros que salen volando y quedan en el suelo**.
- **HUD (vídeo):** barra de resistencia fina abajo y texto de controles; todo discreto.

## Controles y acciones que aparecen en el vídeo (texto pequeño, leído a partir de las imágenes; el usuario quiere los movimientos tácticos ✅)
Mover, correr (SHIFT), **correr táctico (doble SHIFT)**, **saltar obstáculos (ESPACIO)**, **deslizarse/agacharse (CTRL)**, apuntar (clic derecho), disparar (clic izquierdo), recargar, **lanzar granada manteniendo E y soltando (con cancelar apuntado)**, reiniciar, **cambiar de cámara (TAB)** y un panel de ajustes (F1). Lo de saltar, deslizarse, correr táctico, apuntar con modo propio y cambiar de cámara NO está en Tiny hoy.

## Qué significa para este juego
1. **Tiny ya está en este estilo:** misma cámara, mismos objetos (valla, barril, barrera, caja, coche) y misma física de escombros. La base elegida es la correcta.
2. **Lo que Tiny aún no tiene y esta referencia sí:**
   - luces cálidas puntuales (farolas, hogueras, ventanas) sobre fondo azul;
   - marcas pintadas y desgaste en el suelo, que además sirven para contar la historia de cada lugar;
   - más variedad de objetos y apilados;
   - escombros persistentes tras las explosiones;
   - movimientos tácticos: saltar obstáculos, deslizarse, agacharse y correr táctico (el usuario los quiere ✅, paso A8 del `ROADMAP.md`).
3. **Personajes:** mismo nivel de legibilidad desde arriba. Cuerpo compacto, silueta clara, ropa con capas de color distintas del suelo oscuro.

## «Nuestras skins» = arte propio, distinto de la referencia ✅
El usuario aclaró que NO se copian los colores ni la vestimenta del juego de la referencia: el aspecto de los personajes ha de ser claramente diferente (otra paleta, otra ropa, otro equipo, otros detalles). Se toma de la referencia solo el estilo general: cámara, proporciones compactas, silueta legible y luz.

## Cómo se usa esta referencia
- Es la guía para el arte de Meshy (`MODELOS_MESHY.md`): proporciones compactas, silueta clara, equipo legible.
- Es la guía de luz y suelo para los hitos A2 y C del `ROADMAP.md`.
- No se copian ni el nombre, ni el logo, ni los rótulos, ni modelos del juego de la referencia: se hace arte propio.


## Corrección (16 nov, 22:20, tras revisar el vídeo con el usuario)
Los personajes de la referencia son **semi-realistas, de proporciones normales y pequeños en pantalla**; la nota anterior de «cabeza grande, cuerpo corto» era una lectura imprecisa. El usuario eligió **semi-realista con proporciones normales** para personajes y objetos. La luz de la referencia es casi negra azulada con charcos cálidos de farola; el suelo, placas industriales oscuras con pintura vial. Pendiente: ajustar luz y suelo hacia eso SIN perder legibilidad (el usuario ya pidió antes que no estuviera demasiado oscuro).

**Actualización 22:25:** el texto «semi-realista» produjo una foto. Estilo elegido: estilizado de juego móvil (formas simplificadas, texturas pintadas). Ver MESHY_PEDIDOS.md.
