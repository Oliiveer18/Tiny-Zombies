# GODOT · TRASPASO A LA SIGUIENTE SESIÓN (escrito el 20 nov 2026)

> Leer esto primero si la sesión es sobre Godot. Proyecto: `godot_prueba/` (Godot 4.7, renderizador Compatibility). Rama de trabajo: `claude/lucid-lamport-3cmdfz` (NO está en `main`; no subir a `main` sin que el usuario lo diga). Reglas del usuario: `CLAUDE.md` (español, breve y fácil; es no técnico; «Resumen fácil»; no dar por probado lo no probado; no gastar créditos de Meshy; Oli y Lali no existen). **No tocar el proyecto de Three.js.** No cambiar proporciones ni rediseñar personajes sin consultar.

## 1 · Dónde estamos
El usuario **probó la prueba en su Mac y dice: «está bastante bien, me gusta mucho».** Funciona: movimiento, agacharse/deslizar, disparo, zombis (dormir tumbados, levantarse, gritar, investigar, perseguir, atacar, reaccionar a disparos, ragdoll), mando PS5 (probado solo con eventos simulados), animaciones Mixamo (protagonista: andar, correr, apuntar, disparar, recargar, agachado, deslizar, golpe, morir; zombi: andar, correr, atacar, morir, levantarse, golpe, gritar, reposo). Detalle: `docs/CALIDAD_PERSONAJES_GODOT.md` §5–6, `godot_prueba/LEEME.md`, `docs/SESION.md`.

## 2 · Tarea 1 (la más urgente): ARREGLAR LAS TEXTURAS EN EL MAC
**Síntoma (captura del usuario en su Mac):** el protagonista y los zombis se ven con un **patrón metálico/plateado ruidoso**, sin el color pintado (camiseta azul, piel, pelo). En las capturas hechas aquí (Linux, Mesa por software) las texturas **sí** se veían bien, así que el fallo depende de la máquina o de la importación.
**Hipótesis, de más a menos probable (ninguna comprobada):**
1. El mapa de normales (`*_normal.webp`) se interpreta mal en el Mac (importado como color en vez de normal, o compresión VRAM distinta: en Mac se reimporta desde cero porque `.godot/` no viaja en el ZIP).
2. Compresión VRAM / mipmaps / filtro anisotrópico del albedo distinto en la GPU Intel/Apple (`texture_filter` en `personaje_mixamo.gd::_poner_material`).
3. El material no se reutiliza del GLB (`_poner_material` copia el material de `res://modelos/*.glb`) y queda con textura equivocada (p. ej. se usa la de normales como albedo).
**Cómo atacarlo:** (a) añadir una tecla de depuración que cicle: solo albedo → albedo+normal → sin texturas, y pedir al usuario una captura de cada una; (b) revisar los `.import` de `modelos/*.webp` (`compress/normal_map`, `compress/mode`, `mipmaps`); (c) valorar convertir las texturas a PNG (`tools/glb_para_godot.mjs`) o importarlas sin compresión VRAM; (d) comprobar que los GLB del ZIP son reales (no enlaces). Entregar al usuario un ZIP nuevo (ver §5) y verificar con su captura. Aquí no se puede reproducir (sin GPU real): no declarar arreglado hasta verlo en su Mac.

## 3 · Tarea 2: MEDIR FPS Y OPTIMIZAR
El usuario quiere **saber a cuántos fps va** y optimizar. Hoy solo hay el panel F3 (en Mac: Fn+F3 o botón Create del mando) con fps, llamadas de dibujo, triángulos y memoria. Objetivos del proyecto (CLAUDE.md norma 2): **mínimo 30 · sostenido 40 · ideal 60 fps**, peor cuadro ≤ 33 ms; calidad visual primero (no bajar pixelRatio/sombras sin que él lo decida); triángulos y llamadas son indicadores, no límites.
**Qué hacer:**
1. **Medidor fácil para un no técnico:** una tecla (y botón del mando) que muestre en pantalla fps actual, media, **1 % peor** y peor cuadro en ms, y un **«grabar 60 s»** que al terminar escriba un resumen (`user://fps_AAAA-MM-DD.txt`) y lo muestre en pantalla grande para que el usuario lo fotografíe/copie. Incluir: modelo de máquina (`OS.get_processor_name()`, `RenderingServer.get_video_adapter_name()`), resolución, MSAA/sombras activas, número de zombis vivos.
2. **Medir primero en el Mac** (pedir 3 cifras: parado, corriendo con zombis persiguiendo, en combate), luego optimizar con evidencia: sombras (tamaño/distancia), MultiMesh de árboles, malla de navegación, `PhysicalBone3D` en ragdoll (limitar cuántos a la vez, congelar al reposar), skinning de 10 zombis, `generate_lods`, MSAA, `Performance` monitors para ver qué cuesta.
3. Comparar **con Three.js** (`?carga`/`coordinacion/mediciones/`) para decidir la migración. Rellenar `docs/EVALUACION_GODOT.md` con cifras reales.
4. iPhone: exportar a iOS exige Xcode, plantillas de exportación y cuenta de desarrollador (no preparado). No prometerlo sin probar.

## 4 · Tareas siguientes (por orden, solo si 1 y 2 van bien)
- Más animaciones (el usuario las trae de Mixamo): girar, strafe/atrás con rifle, zombi dormido real, recoger, etc. Procedimiento: copiar FBX a `godot_prueba/mixamo/`, poner `nodes/root_scale=58.8235` en su `.fbx.import`, añadir a `scripts/config.gd`, inspeccionar con `pruebas/inspecciona_fbx.gd`, ver con `pruebas/visor.gd`.
- Calidad: `AnimationTree` con mezclas (andar/correr según velocidad, capas de torso), IK de manos/pies, arma real (hoy es un fusil procedural en `personaje_mixamo.gd::poner_arma`), sonidos, efectos.
- Mando: probar con el PS5 real (vibración por Bluetooth en macOS sin confirmar; gatillos adaptativos/giroscopio/panel táctil no los soporta Godot).

## 5 · Cómo trabajar y probar (resumen operativo)
- **Godot en el entorno:** `/tmp/godot/Godot_v4.7-stable_linux.x86_64` (si no existe, el usuario autorizó descargarlo; hosts permitidos en su entorno personal; verificar SHA-512).
- **Banco de capturas:** `cd godot_prueba && xvfb-run -a -s "-screen 0 960x540x24" /tmp/godot/Godot_v4.7-stable_linux.x86_64 --path . --rendering-driver opengl3 --resolution 960x540 res://pruebas/captura.tscn -- <carpeta_salida> <basico|zombis|agachar>` (**tarda varios minutos: lanzar en segundo plano y esperar con un bucle `until`**; el argumento es `zombis`, no `guion_zombis`). Visor de clips: `pruebas/visor.tscn`. Mando simulado: `-s res://pruebas/mando.gd` (cabecera `--headless`).
- **ZIP para el Mac** (el usuario NO tiene git ni espacio): `cd /home/user/Tiny-Zombies && zip -rq godot_prueba_mac.zip godot_prueba -x "godot_prueba/.godot/*" "godot_prueba/pruebas/*"` (≈7 MB; sigue los enlaces simbólicos de los GLB), enviarlo con `SendUserFile`, y **borrar el ZIP del repo** (hook de untracked). Instrucciones para el usuario: descomprimir, abrir Godot 4.7 Standard, Importar `godot_prueba/project.godot`, jugar con el botón ▶ (en Mac F5 es Fn+F5).
- **Entrega:** commit + push a la rama (con las líneas de atribución del sistema), `docs/SESION.md` con «Resumen fácil», actualizar `docs/CONTINUAR.md`. No subir a `main`.
- **Escala:** personaje = 1,0 en Godot (1,4 m en Three.js).
- **Pendientes ajenos a Godot** (no tocar salvo que el usuario lo pida): regresión flaky «8a» de Three.js sin repetir (por eso `main` no tiene la última física de zombis), corredor/tanque/equipo en pausa.

## 6 · Prompt para la sesión nueva
Está al final de la conversación en que se escribió este documento; texto base: «Lee `CLAUDE.md` y `docs/GODOT_SIGUIENTE_SESION.md` y sigue: (1) arregla las texturas del protagonista y los zombis, que en mi Mac se ven plateadas y ruidosas; (2) añade un medidor de fps fácil de usar y optimiza. Respóndeme en español, fácil y corto. No toques el juego de Three.js.»
