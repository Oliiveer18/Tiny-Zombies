# 009 · Primer personaje de referencia, Mixamo y sistema de animación (Fable, 17 nov 2026)

Diseño de fondo para ART-1, ART-2 y los paquetes PAQ-A1 a PAQ-A3. Origen de cada dato: **[C]** código · **[D]** decisión vigente (`docs/DECISIONES.md`) · **[R]** razonamiento · 💡 por comprobar. No gasta créditos: los créditos de Meshy siguen en pausa [D 3.6] hasta el punto que marca §6.

## 1. Qué hay hoy y por qué no basta [C]
- `player.js` mezcla 8 clips de Meshy con pesos (`idle`, `walk`, `run`, tres de disparo, `reload`, `die`) y ajusta la cadencia a la velocidad real. Es una mezcla de **cuerpo entero**: al disparar, las piernas dejan de andar como andaban; el clip `shoot_side` obliga a girar todo el modelo 90°; andar hacia atrás es el clip de andar al revés; no hay pasos laterales, ni agachado (se encoge el modelo), ni golpe recibido.
- Los zombis usan otra función (`play`) sin mezcla. No hay nada compartido.
- Resultado: se nota el salto entre animaciones. Es justo lo que el usuario no quiere.

## 2. Decisión sobre el esqueleto: lo pone Mixamo, no Meshy (F · 17 nov)
ART-1 preveía probar clips de Mixamo sobre un esqueleto de Meshy, con «que Mixamo ponga su esqueleto» como plan B. **Se pasa directamente al plan B como vía principal** [R]:
- Los clips de Mixamo están hechos para el esqueleto de Mixamo (misma postura de reposo, mismos ejes). Sobre otro esqueleto hay que «traducirlos», y eso produce justo los defectos que se quieren evitar (miembros torcidos, pies que flotan). Con su propio esqueleto encajan sin traducción.
- Todos los humanos (jugador, NPC, rivales) compartirán **el mismo esqueleto**, así que un clip sirve para todos y se guarda una sola vez (ya previsto en [D 3.10]).
- Meshy se usa para lo que hace bien: forma y textura. Su esqueleto y su biblioteca de animaciones quedan como reserva.
- Coste: 0 créditos. Inconveniente real: **Mixamo necesita un ordenador** (la web no funciona bien en el móvil) y una cuenta gratuita de Adobe. Es trabajo manual del usuario de unos 15 minutos por personaje; no tiene API.

Huesos 💡: jugador y NPC con «2 Chain Fingers» (41 huesos: las manos cierran sobre el arma); zombis con «No Fingers» (25). El coste real de 40 personajes animados lo dirá la prueba `?carga` [D 2.7].

## 3. Especificación del primer personaje de referencia (ART-2)
**Proporciones y escala** [D 3.2, 3.3]
| Medida | Valor |
|---|---|
| Altura total | 4,5 cabezas · 1,50 m en el juego 💡 (≈ 105 píxeles en vertical) |
| Cabeza | 1 cabeza = 0,33 m; algo grande, cara legible (ojos, cejas, boca modelados, no solo pintados) |
| Hombros | 1,6-1,7 cabezas de ancho; torso robusto, cuello corto |
| Piernas | ≈ 45 % de la altura (2 cabezas); botas grandes, pies bien separados |
| Brazos | manos a media altura del muslo; manos y antebrazos algo gruesos (se leen desde arriba) |
| Carácter | adulto, serio, compacto; ni niño, ni juguete, ni soldado realista |

**Requisitos para que Mixamo lo acepte** [R]
1. **Pose en T** (brazos horizontales, palmas abajo), simétrico, mirando al frente, piernas separadas el ancho de la cadera, dedos algo separados.
2. **Cuerpo solo, con la ropa pintada o pegada al cuerpo** (pantalón, camisa o chaqueta ajustada, botas, guantes, rodilleras). **Sin casco, chaleco, mochila ni arma**: son piezas aparte que se pegan a un hueso [D 3.10, 3.11]. Así el esqueleto automático no se confunde y las piezas se combinan entre personajes.
3. Nada colgando ni suelto: sin capas, correas largas, bufandas ni pelo largo. Pelo corto o cabeza rapada (el casco lo cubre casi siempre).
4. Brazos y piernas claramente separados del cuerpo; axilas y entrepierna abiertas.
5. Una sola malla cerrada, con textura completa (color, relieve, rugosidad).

**Calidad** [D 3.12; guía `CALIDAD_GRAFICA.md` §6]: de Meshy se guarda el modelo alto. Versión de juego orientativa: cuerpo 8 000-10 000 triángulos, textura 2 048 mientras no haya medición (se ve de cerca en el futuro creador de personaje), piezas 500-1 500 cada una. Nada de esto es un tope.

**Piezas del primer personaje** (se generan después del cuerpo, cada una por separado): casco, chaleco con bolsillos, mochila, fusil. Cada una con volumen y color propios, para que se lean a 105 píxeles.

**Aspecto (lo decide el usuario antes de gastar créditos; propuesta de Fable 💡):** superviviente con equipo militar reunido a trozos, no un soldado de uniforme. Tres opciones de paleta, con el suelo oscuro del juego en mente:
- **A (recomendada):** chaqueta verde oliva, pantalón arena, chaleco gris carbón, casco oliva con funda gastada, y un **acento naranja óxido** (pañuelo o brazalete) como color del jugador.
- **B:** azul marino y gris, chaleco negro, acento amarillo.
- **C:** marrón cuero y caqui, chaleco verde oscuro, acento rojo.
El usuario elige una (o cambia lo que quiera) al ver primero **la imagen de referencia**, que es lo barato; el 3D se genera solo con la imagen aprobada.

## 4. Tubería de producción (quién hace qué)
| Paso | Quién | Coste |
|---|---|---|
| 1. Texto para la imagen de referencia (pose en T, de frente) | Fable (en el traspaso de ART-2) | — |
| 2. Generar 4 imágenes, elegir una | Usuario en Meshy | ≈ 36 créditos 💡 |
| 3. Imagen → 3D, reducir («adaptativo alto») y texturizar | Usuario en Meshy | ≈ 35 créditos 💡 |
| 4. Descargar el GLB **sin esqueleto** y subirlo al chat de Sonnet | Usuario | — |
| 5. Convertirlo en un archivo para Mixamo (`tools/para_mixamo.mjs`) | Sonnet | — |
| 6. Subirlo a mixamo.com, colocar los 8 puntos, elegir «2 Chain Fingers», descargar el personaje (FBX, con piel, pose en T) | Usuario, **en un ordenador** | gratis |
| 7. Convertir a GLB de juego, recolocar las texturas originales, comprobar (`tools/de_mixamo.mjs`) | Sonnet | — |
| 8. Captura a tamaño real de juego → aprobación | Usuario | — |
Los clips se descargan **una sola vez** (paso propio de ART-1) y valen para todos los humanos.

## 5. Animaciones de Mixamo: lo que hay y lo que falta
Todo Mixamo es gratuito y se puede usar en un juego comercial. No se pueden redistribuir los archivos sueltos: los FBX originales van a `arte_fuente/` (que no se publica); en el juego solo va el GLB ya procesado. La lista sale del conocimiento del catálogo; **los nombres exactos se confirman al descargarlos** 💡 (si un nombre no aparece, se busca «rifle» y se filtra por «Packs»).

| Necesidad | En Mixamo | Estado |
|---|---|---|
| Quieto apuntando, andar y correr en 8 direcciones con fusil | «Rifle 8-Way Locomotion Pack» y «Pro Rifle Pack» | **Hay** |
| Agachado quieto y andando en 8 direcciones | «Pro Rifle Pack» | **Hay** |
| Giro en el sitio 90° izquierda / derecha | «Pro Rifle Pack» | **Hay** |
| Esprintar | «Pro Rifle Pack» / «Rifle Run» | **Hay** |
| Recargar | «Reloading» | Hay (genérica: una sola para todas las armas) |
| Lanzar granada | «Toss Grenade» / «Throw Object» | **Hay** |
| Golpe recibido | «Hit Reaction» (varias) | **Hay** |
| Muertes (de frente, de espaldas, de lado) | «Pro Rifle Pack», «Dying», «Death From The Front» | **Hay** |
| Empujar, recoger del suelo, abrir | «Push», «Picking Up», «Opening» | Hay (genéricas, sin arma) |
| Saltar obstáculo, deslizarse (paso A8) | «Jump Over», «Running Slide» | Hay (se bajan cuando toque) |
| Zombi: quieto, andar, correr, atacar, morir, golpe, levantarse | serie «Zombie …» | **Hay** |
| NPC: hablar, sentado, asustado agachado | «Talking», «Sitting», «Cowering» | Hay |
| **Disparo (retroceso)** | — | **No hace falta clip:** se hace por código (§7.4), más limpio y sincronizado con cada bala |
| **Recarga distinta por arma** | — | **Falta.** Solución: una recarga genérica con velocidad y pausa ajustadas por arma (datos) |
| **Forzar candado, arrastrar contenedor** | — | **Falta.** Solución: pose de «agachado» + movimiento de brazos por código; arrastrar = andar hacia atrás con brazos fijos |
| **Mano izquierda exacta sobre el arma** | — | **Falta** (necesitaría IK, pospuesto [D 3.9]). Los clips de fusil ya traen las manos colocadas; se acepta el pequeño desajuste a 105 píxeles y se reevalúa al verlo |
| **Zombi tanque y corredor con carácter propio** | parcial | Se parte de los clips de zombi con velocidad y postura alteradas por código |
Descarga siempre: FBX, «Without Skin», 30 fps, sin reducción de fotogramas, **«In Place»** marcado cuando exista la casilla.

## 6. Orden de trabajo y dónde se gastan créditos
1. **ART-1 (0 créditos):** probar la tubería completa con el cuerpo que ya existe (`jugador_a`). Sonnet prepara el archivo, el usuario lo pasa por Mixamo y descarga los packs, Sonnet lo convierte. Sirve de **relleno animado**.
2. **PAQ-A1 y PAQ-A2 (0 créditos):** el sistema de animación se construye y se afina sobre ese relleno. Como el personaje definitivo usará el mismo esqueleto, **al llegar se sustituye el cuerpo y todas las animaciones siguen funcionando**.
3. **ART-2 (primeros créditos):** en paralelo, imagen de referencia → aprobación del usuario → 3D → Mixamo → captura en el juego → aprobación. Los créditos se desbloquean cuando ART-1 esté ACEPTADA (se sabe que la tubería funciona) y el usuario haya elegido el aspecto.
4. **PAQ-A3 y ART-4:** zombis y NPC sobre el mismo sistema.
Así ningún crédito depende de algo sin probar, y el código de animación no espera al arte.

## 7. Sistema de animación (arquitectura para Sonnet)
Un único módulo `src/anim.js` para **todos** los personajes (jugador, NPC, zombis). Es dibujo, no simulación [norma 3]: lee el estado del personaje (`x, z, velocidad, dirección de apuntado, postura, acción, vida`) y nunca lo cambia. Todo lo configurable va en datos: `src/data/anim/humano.json`, `zombi.json` [norma 4]. Usa `AnimationMixer` de Three.js [C: ya se usa], sin librerías.

**Principio:** el personaje no «está en una animación». Cada cuadro, su pose es una **mezcla continua** calculada a partir de números (velocidad, dirección, cuánto apunta…). No hay cambios de estado bruscos: solo pesos que suben y bajan suavemente.

### 7.1 Capa de piernas: espacio de mezcla de locomoción
- Entrada: velocidad del personaje **relativa a hacia dónde mira** (adelante/atrás, izquierda/derecha) y postura (de pie / agachado).
- Clips: quieto + andar en 8 direcciones + correr en 8 direcciones (+ lo mismo agachado). En cada cuadro se mezclan como mucho **4 clips**: los dos de dirección más cercanos × las dos velocidades más cercanas (quieto ↔ andar ↔ correr).
- **Paso sincronizado:** todos los clips de locomoción comparten una misma «fase del paso» (0-1). Cada clip tiene en los datos en qué momento apoya el pie izquierdo; al mezclarlos, los pies apoyan a la vez. Sin esto la mezcla de dos andares produce piernas que flotan.
- **Pies sin patinar:** la fase avanza según la distancia recorrida de verdad (`velocidad real / longitud de zancada mezclada`), no según el reloj. La longitud de zancada de cada clip se mide una vez con la herramienta y va en los datos. (Hoy ya se hace algo parecido para dos clips [C]; se generaliza.)
- Andar hacia atrás y de lado son clips propios: se acabó reproducir el andar al revés.

### 7.2 Capa de torso: acciones
- Huesos de la mitad superior (columna, hombros, brazos, cuello, cabeza). La tabla de qué hueso es de qué capa va en los datos; la columna reparte (primer hueso 30 % torso, segundo 60 %, tercero 100 %) para que la cintura no se parta.
- Técnica: al cargar, cada clip se separa en dos sub-clips (pistas de piernas / pistas de torso). El mezclador de Three.js mezcla por hueso, así que dos sub-clips sobre huesos distintos son dos capas independientes.
- Acciones de torso: apuntar (pose base con arma), recargar, lanzar granada, usar/empujar, forzar. Mientras se recarga **las piernas siguen con su locomoción** sin enterarse.
- Si no hay acción, el torso toma la mitad superior de la propia locomoción (brazos que acompañan al andar con el arma baja).

### 7.3 Capa aditiva y de cuerpo entero
- **Aditiva** (se suma encima, no sustituye): golpe recibido según la dirección del impacto, respiración. Con `makeClipAdditive` de Three.js.
- **Cuerpo entero** (manda sobre todo, entra y sale con fundido): muerte, saltar obstáculo, deslizarse. Son las únicas «animaciones completas».

### 7.4 Capa por código (después del mezclador, antes de dibujar)
Todo con muelles amortiguados (sin rebote visible) y cada efecto con su barra en `?anim` y posibilidad de apagarlo:
| Efecto | Qué hace |
|---|---|
| **Giro de torso al apuntar** | Las piernas siguen al movimiento, el torso gira hacia el punto de mira, repartido entre los 3 huesos de la columna. Límite ±70° 💡 |
| **Giro en el sitio** | Si el torso pasa del límite estando quieto, las piernas dan un paso de giro (clip de giro de 90°) y el torso se recentra. Sustituye al truco actual de girar el modelo 90° |
| **Inclinación** | El cuerpo se inclina unos grados hacia donde acelera y al frenar; da peso |
| **Retroceso** | Cada bala da un golpe corto a hombros, columna y arma, con fuerza por arma (datos). Sustituye a los clips de disparo |
| **Mirada** | La cabeza gira hacia el objetivo de «Usar» o el enemigo más cercano, máximo 60° |
| **Sacudida por daño** | Impulso en la dirección del golpe, sumado al clip aditivo |
| **Balanceo del arma y respiración** | Movimiento mínimo continuo: el personaje nunca queda congelado |
Sin IK [D 3.9].

### 7.5 Transiciones
- Todos los pesos se acercan a su objetivo con suavizado de muelle crítico (rápido al principio, sin frenazo), no en línea recta. Tiempos en los datos: locomoción 0,15 s · postura 0,25 s · entrar en acción de torso 0,12 s · salir 0,2 s · cuerpo entero 0,1 s 💡.
- Arrancar y frenar no necesitan clips propios: los resuelven la mezcla quieto↔andar, la fase por distancia y la inclinación.
- Una acción puede declarar «no interrumpible hasta el 70 %» (recarga) en los datos.

### 7.6 Rendimiento [CALIDAD_GRAFICA §4]
Sin recorte visual: no se anima lo que no se ve [C: ya existe para zombis lejanos]; personajes a más de 18 m 💡 se actualizan a media frecuencia; clips y esqueleto compartidos entre todos los de una familia; los sub-clips se crean una vez por familia, no por personaje. El coste se mide con `?debug` y `?carga`.

### 7.7 Banco de pruebas `?anim`
Pantalla solo de desarrollo: el personaje en el centro, barras para velocidad, dirección, ángulo de apuntado y postura, botones para cada acción, y un medidor de **patinaje de pies** (cm que se mueve un pie mientras debería estar apoyado). Es lo que permite aceptar el sistema con números y no a ojo.

## 8. Paquetes resultantes (sustituyen a la fila única ART-3)
| Paquete | Contenido | Necesita | Esf. |
|---|---|---|---|
| **ART-1** Tubería Mixamo | `tools/para_mixamo.mjs`, `tools/de_mixamo.mjs`, relleno `jugador_a` con esqueleto y clips de Mixamo | Parte del usuario en un ordenador | LOW + LOW |
| **PAQ-A1** Núcleo de animación | `anim.js`, datos, espacio de mezcla en 8 direcciones con paso sincronizado, dos capas, transiciones, banco `?anim`; aplicado al jugador. Se retiran el giro de 90° y la mezcla de `player.js` | ART-1 ACEPTADA | MED × 2 |
| **PAQ-A2** Capa por código y acciones | Los efectos de §7.4, aditivos, recarga / granada / usar / forzar, agachado real, muerte | PAQ-A1 | MED × 2 |
| **ART-2** Personaje de referencia | §3 y §4 | ART-1 ACEPTADA + aspecto elegido | usuario + LOW |
| **PAQ-A3** Zombis y NPC | Zombis sobre `anim.js` con sus clips, media frecuencia a distancia, medición con 40 | PAQ-A2 + clips de zombi | MED |

**Criterios de aceptación que llevarán PAQ-A1 y PAQ-A2** (medibles en `?anim`): patinaje de pies ≤ 2 cm por apoyo a cualquier velocidad y dirección · al cambiar de dirección 180° ningún hueso gira más de 25° en un cuadro (sin saltos) · recargar andando: la fase de las piernas no cambia al empezar ni al acabar · apuntar a 4 direcciones estando quieto: cuerpo erguido, sin girar el modelo 90° · disparar no cambia ningún peso de clip · coste de animación del jugador ≤ 0,3 ms 💡 y de 40 personajes medido y apuntado · 0 rebajas de calidad gráfica.
