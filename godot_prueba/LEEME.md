# Prueba independiente en Godot 4 · Tiny Zombies

Escena 3D para evaluar Godot con **nuestros personajes y mecánicas reales**, antes de decidir si migramos el juego. **No toca el proyecto de Three.js** ni duplica sus recursos: los modelos se leen por enlaces simbólicos a `public/models/…` y las animaciones se generan a partir de las que ya existen.

> **Estado (20 nov, tras ejecutarlo en Godot 4.7 para Linux sin pantalla):** el proyecto **importa los dos GLB sin errores** (incluidas las texturas WebP), **arranca sin errores de scripts**, y se probó con un banco de pruebas automático (`pruebas/captura.gd`) que simula entradas y guarda capturas: movimiento, disparo, recarga, zombis que se despiertan, investigan, persiguen, reciben impactos y mueren con **ragdoll de huesos físicos**. Esas pruebas se hicieron con renderizado por software (Mesa llvmpipe), así que **los fps y el aspecto final en tu Mac y en el iPhone siguen sin medir**. Las animaciones siguen siendo las provisionales por código; se sustituirán por las de Mixamo.

## 1 · Requisitos de tu MacBook Pro 2019 (Intel i5, 8 GB)
Según la documentación oficial de Godot (versión estable 4.7, junio de 2026):
- **macOS:** el editor funciona desde macOS 10.13 con el renderizador *Compatibility* (el que usamos) y desde 10.15 con los modernos. Tu Mac cumple de sobra.
- **CPU:** Intel x86_64 o Apple Silicon. Tu i5 está soportado (el ejemplo recomendado de la documentación es un Core i5-8500).
- **Gráfica:** *Compatibility* pide una gráfica integrada con OpenGL 3.3. Tu Intel Iris Plus / UHD de 2019 lo cumple (macOS da OpenGL 4.1; está «obsoleto» para Apple pero funciona).
- **RAM:** mínimo 4 GB, recomendado 8 GB para el editor: justo lo que tienes. Con otras apps abiertas puede ir justo: cierra el navegador mientras pruebas.
- **Disco:** ~200 MB el editor; las plantillas de exportación (para iPhone) 1,3 GB aparte.
Un aviso: la documentación de la versión en desarrollo (4.8) sube el mínimo de macOS; **usa la 4.7 estable**.

## 2 · Instalar y abrir
1. Descarga **Godot 4.7 estable (versión «Standard», no «.NET»)** para macOS en https://godotengine.org/download/macos (es un binario «universal»: sirve para Intel y Apple Silicon). Arrástralo a Aplicaciones. La primera vez, clic derecho → Abrir (macOS pide confirmar).
2. Consigue el proyecto **con git** (no con el ZIP de GitHub: los enlaces a los modelos se romperían):
   ```
   git clone -b claude/lucid-lamport-3cmdfz https://github.com/oliiveer18/tiny-zombies.git
   ```
3. En Godot: **Importar** → elige `tiny-zombies/godot_prueba/project.godot` → **Importar y editar**. La primera vez importa los modelos (puede tardar un par de minutos).
4. Pulsa **F5** (jugar). Si pregunta por la escena principal: `escenas/principal.tscn`.

## 3 · Controles
| | Teclado y ratón | Mando PlayStation (Bluetooth) | Táctil (iPhone, sin probar) |
|---|---|---|---|
| Mover | W A S D / flechas | Stick izquierdo | Mitad izquierda: arrastrar |
| Apuntar | Ratón | Stick derecho | Mitad derecha: arrastrar |
| Disparar | Clic izquierdo | R2 (o R1) | Arrastrar a la derecha |
| Apuntar fijo | Clic derecho | L2 | — |
| Correr | Mayús | Pulsar L3 | — |
| Agacharse | C / Ctrl | ○ | — |
| Recargar | R | □ | — |
| Reiniciar | Intro | Options | — |
| Panel de depuración | F3 | Create | — |
Para conectar el mando: Bluetooth del Mac → mantén **PS + Create** hasta que parpadee. Godot lo detecta solo.

## 4 · Qué hay en la escena
- **Escenario** (todo por código, sin recursos externos): terreno con colinas y colisión (`HeightMapShape3D`), aldea con 4 casas con puerta, vallas, un coche, una **rampa con plataforma** para probar pendientes, 90 árboles y 70 arbustos (instanciados con `MultiMesh`), 7 cajas y 4 barriles que se **empujan** y reaccionan a los disparos, 2 farolas, sol con sombras. Sin niebla.
- **Protagonista:** el GLB actual con su esqueleto y sus 8 clips. Aceleración y frenada, correr, **agacharse**, giro suave hacia donde apuntas, inclinaciones por código al arrancar, frenar, correr y girar, retroceso al disparar, gravedad, pendientes y empuje de objetos.
- **Cámara:** la «Tiny» (58°, campo de visión 38°) con un pequeño retardo.
- **Disparos:** rayo con dispersión, trazador, fogonazo con luz, partículas de impacto (sangre en zombis, polvo en lo demás), impulso a cajas y barriles.
- **10 zombis** con el GLB actual: duermen; **oyen** (el ruido se atenúa con los muros), **se sobresaltan, miran, investigan** caminando hacia el origen, **ven** (cono + rayo contra muros) y **persiguen** por una **malla de navegación horneada** (rodean obstáculos), atacan, pierden el rastro y deambulan. Reacción **por zona real** del impacto (cabeza, brazo, pecho, pierna) y **ragdoll con huesos físicos** al morir.
- **Interfaz limpia:** solo munición y vida arriba a la izquierda y una retícula mínima mientras apuntas. Nada más (F3 muestra datos de depuración).
- **Escala:** en Godot el personaje mide **1,0** (en Three.js 1,4 m). Velocidades y radios están divididos entre 1,4 para que se vea igual.

## 5 · Lo que NO se ha hecho (a propósito)
Inventarios, progresión, economía, sonido, piezas de equipo, arma en la mano (la postura ya sostiene un fusil, pero no hay arma), corredor y tanque, ni diseño táctil dibujado (solo la lógica).

## 6 · Si algo falla
- **Salida de Godot con errores rojos:** cópiamelos tal cual; lo más probable es un nombre de propiedad que cambió en 4.7.
- **El personaje no aparece / «No se pudo cargar el modelo»:** el proyecto aún no importó los GLB (espera a que termine la barra de importación) o falta el enlace (¿clonaste con git?). Comprueba que existen `godot_prueba/modelos/protagonista.glb` y `zombi.glb` (deben abrirse, no ser archivos de texto).
- **Error al importar los GLB por texturas WebP:** ejecuta `node tools/glb_para_godot.mjs` (necesita `npm install`), que crea copias con PNG en `godot_prueba/modelos_alt/`, y cambia `res://modelos/` por `res://modelos_alt/` en `scripts/jugador.gd` y `scripts/zombi.gd`.
- **Personaje negro o muy oscuro:** los materiales se ajustan en `modelo_3d.gd` (`_ajustar_materiales`).
- **Se mueve en T o sin animar:** los nombres de los huesos de Godot son distintos de los esperados. `AnimUtil.clave()` intenta normalizarlos; mira en Salida si imprime errores de pistas.
- **Errores del ragdoll:** pon `USAR_RAGDOLL = false` en `scripts/zombi.gd` y los zombis usarán el clip de morir.
- **Los zombis van en línea recta, sin rodear:** la malla de navegación no se horneó (F3 muestra «horneando…» o «lista»).
- **Pantalla blanca/negra o lentitud:** ejecuta con *Proyecto → Ejecutar con…* y pon el renderizador en Compatibility (ya es el del proyecto).

## 7 · Cómo evaluar
Rellena `docs/EVALUACION_GODOT.md` (calidad visual, movimiento, físicas, IA, facilidad de desarrollo y rendimiento) con lo que veas. Para el rendimiento: F3 durante 2 minutos jugando; anota fps medios, llamadas de dibujo y triángulos. La prueba de verdad es en el iPhone, que requiere exportar (Xcode, plantillas de exportación, cuenta de desarrollador); no está preparado en esta primera versión.

## 8 · Archivos
`project.godot` (renderizador Compatibility) · `escenas/principal.tscn` · `scripts/` (main, mundo, jugador, zombi, modelo_3d, anim_util, entrada, ruido, efectos, camara_tiny, reticula, capas) · `datos/clips_*.json` (animaciones existentes muestreadas por `tools/exportar_clips_godot.mjs`; se regeneran con `node tools/exportar_clips_godot.mjs`) · `modelos/` (enlaces a los GLB originales).
