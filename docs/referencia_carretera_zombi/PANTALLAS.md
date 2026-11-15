> ⚠️ Documento de otro proyecto. Menciona a Oli y Lali: en ESTE juego NO existen; ignorar esas menciones. Manda `../DISENO.md`.

# PANTALLAS · menús y primera sesión (Z0.4d, 8 nov 2026; decisiones §13 cerradas en Z0.4d-2)

Estados: ✅ decidido por el usuario · 💡 propuesto por dirección técnica (nada pasa a ✅ sin que el usuario lo diga) · ⬜ pregunta abierta. Solo documentos: no hay cambios de código. El aspecto sigue `docs/ARTE.md`.

## 1. Principios
1. **Sin tutorial** ✅. El juego se aprende mirando y probando; no hay ventanas de explicación ni textos largos.
2. **Pensado para el pulgar** ✅ (móvil 390×844): botones grandes abajo, nada que obligue a escribir salvo el código de sala.
3. **Pocas pantallas** 💡: título, elegir cómo jugar, elegir personaje (solo), sala (coop), juego, pausa, fin de partida.
4. **El título es el propio juego** 💡: de fondo, el claro de inicio al atardecer, con la hoguera encendida, niebla y la cámara moviéndose despacio. Sin borde de diorama ✅ ni imágenes aparte.
5. **Misma partida en solo o coop** ✅: se puede empezar solo y que el otro jugador se una después, sin perder nada.

## 2. Mapa de pantallas
```
Título ─┬─ Continuar (solo si hay partida guardada) ─────────────→ Juego
        └─ Nueva partida ─┬─ Solo ── Elegir Oli o Lali ─────────→ Juego (claro, atardecer)
                          └─ Coop ─┬─ Crear sala ── Sala ───────→ Juego
                                   └─ Unirme ── Código ─────────→ Juego
Juego ── Pausa ── (Seguir | Opciones | Salir al título)
Juego ── Muerte total ── Fin de partida ── (Nueva partida | Título)
```

## 3. Título 💡
- Botones grandes en la mitad inferior: **Continuar** (si hay partida) y **Nueva partida**; un icono pequeño de **Opciones** (sonido, brillo nocturno).
- En **Continuar** se ve lo útil de la partida: tiempo sobrevivido y récord ✅ (el contador es en tiempo real, horas y minutos), y si es solo o coop.
- Sin partida guardada solo aparece Nueva partida.
- Nueva partida con una partida guardada: avisa de que se borrará («muerte total» ✅) y pide confirmación.
- El nombre del juego es **Endless Aftermath** ✅ (`IDENTIDAD.md` §0); la portada (logo y composición) está en `docs/PORTADA.md`.

## 4. Nueva partida: solo o coop 💡
Dos botones grandes: **Solo** y **Coop**. No hay más ajustes en v1: una sola dificultad (el selector de dificultad llega en el paso 20 de `ROADMAP.md`; `DISENO.md` ya lo prevé).

## 5. Solo: elegir personaje ✅ (elegir Oli o Lali) · detalle 💡
- Dos tarjetas con la figura 3D girando despacio (Oli y Lali), un nombre y nada más.
- Al tocar una se empieza: fundido al claro al atardecer.
- El personaje se queda fijo toda la partida (muerte total); desaparece el botón actual «Cambiar personaje» ✅ (el personaje queda fijo, §13).

## 6. Coop de dos móviles 💡
Técnica actual (`src/red_peer.js`): conexión punto a punto con PeerJS; hoy Oli crea la sala y Lali entra con un código; la sala se recuerda en cada móvil.
**Crear sala** (anfitrión):
1. Elige personaje (Oli o Lali); el otro personaje queda para el invitado.
2. Pantalla de sala: código de 6 caracteres en grande, botón **Compartir enlace** (`?sala=CODIGO`, ya soportado) y el estado «Esperando a tu compañero…».
3. Botón **Empezar ya**: se juega solo y el compañero puede unirse más tarde ✅ (misma partida).
**Unirme** (invitado): abrir el enlace o escribir el código (teclado propio de 6 casillas, sin `prompt` del navegador). Estados visibles: buscando la sala, conectado, sala no encontrada (con «Reintentar»).
**Se une a una partida empezada** 💡: aparece junto al anfitrión con la mochila inicial; los recursos del refugio son compartidos ✅ y la mochila es de cada jugador.
**Quién guarda el mundo** 💡: el móvil del anfitrión (semilla y cambios, guardado v2); el invitado guarda solo su jugador. Si el anfitrión no está, el invitado no puede jugar esa partida en v1 ✅ (opción A, §13): solo se juega mientras el anfitrión esté conectado. Lo que quiera jugar sin él es una partida nueva suya.
**Ajuste por número de jugadores** ✅ (regla simple): la dificultad y el ritmo de los zombis escalan con los jugadores conectados en ese momento (1 o 2) y vuelven a bajar si el otro se va. Los recursos del refugio son compartidos y cada mochila es propia. El personaje del invitado es el que no eligió el anfitrión. El juego detecta solo que entra o sale alguien (jugadores por id): no hay modo solo y modo coop separados.
**Cortes de conexión**: el juego sigue en solitario y reintenta solo (comportamiento actual de `red_peer.js`), con un aviso discreto «buscando a tu compañero…».
Pendiente técnico: los roles ya no son fijos (Oli crea y Lali entra); el rol lo decide quien crea la sala. La norma «jugadores por id» se mantiene.

## 7. Primera sesión (sin tutorial) ✅ · detalle 💡
Empieza al atardecer en el claro, con la cámara encuadrando al personaje y la hoguera por encender (`CONSTRUCCION.md` §9). El juego guía con el propio mundo:
- **Luz y urgencia**: el sol baja de verdad; la noche llega y eso empuja a actuar.
- **Brillos**: los objetos que se pueden recoger (palos, piedras, hierba seca) tienen un destello suave visible desde lejos.
- **Botón de acción contextual**: al acercarte a algo, el botón cambia de icono (recoger, encender, usar); sin texto.
- **Una sola frase** al empezar, que desaparece sola a los pocos segundos y no se repite (ej.: «Cae la noche»). Nada de ventanas.
- **Controles siempre visibles** ✅: mochila, construcción y mapa están desde el primer momento (ya no «van apareciendo»). Para mantener la pantalla despejada: iconos pequeños para esos tres, y movimiento y acción grandes. Se cuida en el diseño de los pasos 10 y 13 del ROADMAP.
- **La primera noche está acotada** (1-3 zombis lentos y débiles, siempre los mismos): es el «tutorial» de combate, sin decirlo.

## 8. En el juego: interfaz y pausa 💡
- Pantalla despejada: movimiento (izquierda), acción (derecha) y poco más (mochila, construcción y mapa como iconos pequeños siempre visibles ✅); salud, hambre y sed como iconos pequeños arriba.
- Botón de **pausa** pequeño arriba. En coop **no detiene el juego** (no se puede parar al otro): solo abre el menú.
- Menú: **Seguir**, **Opciones** (sonido, brillo nocturno), **Salir al título** (la partida se guarda al salir; no hay «guardar» manual).
- Mochila, cuaderno de recetas y mapa se abren desde botones propios (diseño en los pasos 10 y 13 del ROADMAP).

## 9. Fin de partida ✅ (muerte total) · detalle 💡
- Pantalla con **tiempo sobrevivido** y **récord** ✅ y, en una línea, qué ocurrió (cuándo y cómo).
- En coop, el que cae pasa a **mirar con la cámara de su compañero** hasta que caen los dos ✅ («cae uno y el otro sigue»).
- Botones: **Nueva partida** y **Título**. Al empezar una nueva se borra la anterior (ya avisado en §3).

## 10. Aspecto de las pantallas 💡
HTML y CSS sobre el lienzo, con la guía de `ARTE.md`: fondos translúcidos oscuros y cálidos, botones grandes con esquinas suaves y relieve de material (madera o metal viejo, sin pixel), acento ámbar en lo pulsable, tipografía clara y legible. Respuesta a cada toque (pulsación suave, brillo) para la «satisfacción visual» de `ARTE.md` §15. Texto breve y en español.

## 11. Técnica (para respetar desde ya)
- Hoy: `#menu` «¿Quién juega?» con dos botones y `prompt()` para el código de sala; botón «Cambiar personaje». Todo eso se sustituye por las pantallas de este documento.
- Las pantallas son HTML/CSS (no se pintan en 3D) y no cuestan cuadros al juego; el fondo del título reutiliza el motor con una cámara automática.
- Respeta `jugadores por id` y el guardado v2 (paso 9 del ROADMAP): el estado de partida guarda la lista de jugadores y quién es el anfitrión.
- Sin WebGL o sin red: aviso fijo como hoy (`#avisoHD`); el título no depende de la red salvo Coop.

## 12. Cuándo se construye 💡
Título, elección de personaje y primera sesión: con la zona de inicio (paso 8 del ROADMAP, Z0.4g). Sala coop y entrada del segundo jugador: con el coop de 2 móviles (paso 20), salvo que el usuario quiera adelantarlo. Pausa y fin de partida: con el guardado v2 (paso 9) y el zombi básico (paso 11).

## 13. Preguntas cerradas (8 nov 2026, Z0.4d-2) ✅
- ¿El personaje en solitario se puede cambiar durante la partida? **No: queda fijo** toda la partida.
- Si el anfitrión no está, ¿el invitado puede jugar? **Opción A para la v1**: solo mientras el anfitrión esté conectado. Quedan para más adelante, sin decidir: copia del mundo para el invitado (B) o servidor propio (C).
- ¿Cuándo aparecen mochila, construcción y mapa? **Siempre visibles.**
- Una sola partida que empieza en solo y a la que se une otra persona, con ajuste por número de jugadores (§6) ✅.
