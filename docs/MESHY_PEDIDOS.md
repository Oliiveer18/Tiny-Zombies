# Pedidos a Meshy · estilo ESTILIZADO DE JUEGO MÓVIL (como el vídeo de referencia)

> ⏸️ **EN PAUSA (decisión del usuario, 17 nov):** no gastar más créditos de Meshy hasta validar la cámara (R1) y fijar las proporciones. Estilo vigente: inspirado en Tiny Troopers, **4-5 cabezas de alto**, compacto pero no infantil ni de juguete (`REFERENCIA_VISUAL.md`). Los textos de abajo se revisarán antes de usarlos (quitar «chunky», fijar las cabezas); el jugador actual no es referencia. **Calidad (17 nov): no pedir mallas «bajas» por sistema;** las frases «Malla baja: objetivo ≈ 800 triángulos» de abajo quedan anuladas: se genera con buena calidad, se guarda el modelo alto y la versión de juego se saca en el repositorio (`CALIDAD_GRAFICA.md` §6).

Decidido por el usuario el 16 nov (22:25): **estilizado de juego móvil** (formas simplificadas y fuertes, texturas pintadas; ni fotorrealista ni juguete puro; la prueba «semi-realista» dio una foto y se descartó), mapa **compacto** y **modelos primero**. Esto sustituye el «chunky toy-like» de las recetas 003, 005 §7, 006 §4 y 007 §8 (las cifras de triángulos, texturas y huesos de la 006 siguen valiendo). Arte propio: no copiar colores, ropa ni rótulos del juego de referencia.

> **18 nov:** el texto del zombi y el del jugador vigentes están en `docs/DIRECCION_ARTISTICA.md` (lenguaje común, pendiente de aprobación). El texto de esta sección queda como versión anterior; los pasos 2-5 siguen valiendo.

## ★ VIGENTE · ZOMBI NORMAL v1 (17 nov, Fable · diseño 010) — pendiente del visto bueno del usuario al gasto
Sustituye al «ZOMBI A» de más abajo (queda como historial). Nada de corredor, tanque ni variantes hasta aprobar este.

### Ficha del modelo
| | Especificación |
|---|---|
| Quién es | Hombre adulto, civil, convertido hace poco. Creíble e inquietante; ni monstruo de dibujos ni foto |
| Proporciones | **5 cabezas de alto**, cabeza de tamaño normal. Complexión media, brazos un poco largos, manos algo grandes. 1,50 m en el juego |
| Cabeza | Pómulos y cuencas marcados, mandíbula y dientes visibles, pelo corto, oscuro y apelmazado (da contraste visto desde arriba). Rasgos con volumen, no solo pintados |
| Piel | Gris verdosa apagada, **más clara que el suelo** |
| Ropa | Sudadera **azul grisáceo** (color identificativo del tipo normal), ceñida y rota; vaqueros grises gastados; una zapatilla y un pie descalzo. Sin capucha ni nada que cuelgue más de un palmo |
| Heridas | Pocas y grandes: mancha de sangre rojo oscuro en un hombro (se ve desde la cámara) y mordedura en un antebrazo |
| Pose | **T estricta**, erguido, simétrico, brazos horizontales, piernas algo separadas, dedos un poco abiertos. La postura encorvada la pondrá la animación |
| Geometría | Una sola malla cerrada, sin piezas sueltas. Modelo alto guardado; versión de juego 5 000-8 000 triángulos (la saco yo) |
| Textura | Color + relieve (PBR), 2K, mate, sin metal. Yo la rehago con `tools/rehacer_textura.mjs` |
| Mixamo | Se descarga **sin esqueleto**. Requisitos: T, brazos y piernas separados del cuerpo, manos sin fundirse, nada colgando. Esqueleto previsto «No Fingers (25)» |

### Paso 1 · Imagen (Text to Image) — 796 caracteres, pegar entero
```
3D rendered stylized game character, full body, front view, strict T-pose: arms straight out horizontally, palms down, fingers slightly spread, legs slightly apart, standing fully upright. Plain light grey background, soft even studio lighting. Modern stylized mobile action game look: clean strong shapes, hand-painted matte textures. Adult proportions, 5 heads tall, normal-sized head. NOT photorealistic, NOT a toy, NOT cartoon, NOT a 2D illustration. Zombie, former civilian man, medium build: pale grey-green skin, sunken dark eye sockets, sharp cheekbones, exposed teeth, short matted dark hair. Tight torn slate-blue sweatshirt, large dark red bloodstain on one shoulder, big bite wound on one forearm, faded grey jeans, one worn sneaker, one bare foot. No weapon, no loose cloth, no text.
```
Ajustes: modelo de imagen de más calidad (Nano Banana Pro o equivalente) · **Pose: T-Pose** · 4 imágenes · estilo predeterminado. **≈ 36 créditos** (4 × 9; con el modelo medio, 4 × 6 = 24).
Elegir la que cumpla: brazos realmente horizontales y separados · cuerpo entero sin cortar · parece un modelo 3D, no un dibujo ni una foto · cabeza no grande · azul de la sudadera claro de leer · manos con dedos distinguibles. **Enseñármelas antes de seguir**; si ninguna vale, ajusto el texto (máximo 2 tandas).

### Paso 2 · Image to 3D (solo con la imagen aprobada)
Meshy 6 (o el más reciente) · Resolución «Estándar» · **Textura apagada** · **T-Pose activada** · Mejora de imagen activada · Simetría automática · licencia Privada. **≈ 20-25 créditos.**
### Paso 3 · Remesh
Triángulos · **Adaptativo Alto** (≈ 30 000-40 000). 0 créditos. No usar Fijo 3K/10K (borra cara y dedos).
### Paso 4 · Textura
Sobre el modelo ya reducido · con la misma imagen como guía · **PBR activado** · 2K (no 4K ni 8K). **≈ 10 créditos.**
### Paso 5 · Descarga
GLB, **sin rigging ni animaciones**. Subir al chat el GLB y los créditos que quedan.

**Coste estimado: ≈ 66-71 créditos el intento completo** (36 + 20-25 + 0 + 10). Reserva razonable: **≈ 105** si hay que repetir el 3D una vez. Cifras de las pruebas del 16 nov y de la ayuda de Meshy: mirar siempre la cotización en pantalla antes de pulsar.

**Arranque común de OBJETOS** (pegar antes de cada texto):
`3D rendered stylized game prop, chunky simplified shapes with worn edges, hand-painted matte textures, dark muted palette with small warm orange accents, single object, three-quarter view seen from above, plain light grey background, soft studio lighting, strong readable silhouette, NOT photorealistic, no text, no logos.`

**Arranque común de PERSONAJES** (límite de Meshy: 800 caracteres en total):
`3D rendered stylized game character, full body, front view, A-pose, plain light grey background, soft studio lighting. Stylized mobile top-down shooter look: simplified chunky shapes, hand-painted matte textures, clean smooth forms, slightly oversized head, hands and boots, about 5 heads tall, strong readable silhouette. NOT photorealistic, NOT a photo, NOT a 2D illustration.`

## 1º · ZOMBI A (es lo primero: hoy es una cápsula verde y es lo más visto)
**Paso 1 · imagen** (texto completo, pegar entero; la 1.ª prueba con «semi-realista» salió fotorrealista y se descartó):
```
3D rendered stylized game character, full body, front view, A-pose, plain light grey background, soft studio lighting. Stylized mobile top-down shooter look: simplified chunky shapes, hand-painted matte textures, clean smooth forms, slightly oversized head, hands and boots, about 5 heads tall, strong readable silhouette. NOT photorealistic, NOT a photo, NOT a 2D illustration. Zombie: pale grey-green skin, sunken dark eyes, open mouth, torn dirty shirt and trousers, bare feet. Arms slightly away from body, legs slightly apart, hunched but symmetrical. No weapon, no text, no logos.
```
Si Meshy ofrece en «Estilos» una opción tipo cartoon/estilizado o 3D render, pruébala en lugar de «Predeterminado» (⚠️ no sé cómo se llaman). Si sale demasiado juguete o demasiado realista, dime y subo o bajo «5 heads tall».
**Paso 2 · Image to 3D** con la imagen elegida (Meshy 6 o 6 Lite; con textura PBR). Malla baja: objetivo ≈ 800 triángulos (yo lo reduzco si sale más).
**Paso 3 · Rigging humanoide** (esqueleto automático). Comprobar que brazos y piernas quedan bien separados (el zombi usa el MISMO esqueleto que el jugador).
**Paso 4 · Animaciones** de la biblioteca de Meshy: `idle`, `walk`, `run`, `attack`, `die` (zombi; si no hay `attack`, vale un golpe o arañazo).
**Paso 5 · Descargar en GLB** como `zombie.glb` y mandármelo, con los créditos que te queden. Yo lo paso por las herramientas, te digo triángulos y KB y lo pruebo.
Tanque (más ancho) y corredor (más delgado) se hacen después con la misma base.

## Después, objetos (en este orden)
2. **Bidón de combustible:** `Steel fuel drum, upright, two raised rings, screw cap on top, scratched dull red paint with rust streaks, small hazard diamond without text.`
3. **Caja de madera:** `Heavy wooden supply crate, rough planks, metal corner brackets, chipped paint, one cracked plank, stencil-free.`
4. **Contenedor de basura grande:** `Large rectangular metal dumpster on four small wheels, closed two-part lid, dark green chipped paint, rust at the edges, dented side.`
5. **Reja (una hoja):** `One single flat gate leaf made of vertical iron bars, 1.5 m wide and 2 m tall, thick square frame, two horizontal crossbars, spear-shaped tips, two hinge pins on the left edge, flaking dark green paint, rust. Standing upright, seen from the front, nothing behind it.`
6. **Farola:** `Old street lamp post, thin dark iron pole with square base, single hanging glass lantern at the top, slightly bent, rust.`
7. **Después:** papelera, caja de cartón, barrera de obra naranja, valla de tablones, coche, cuerpo base de NPC calvo (ropa ajustada), chaleco, casco, mochila, rifle, zombi B.

## Consejos
- Pide 2-3 versiones y elige la que mejor se vea DESDE ARRIBA, pequeña en pantalla.
- Paleta común para dar identidad al lugar: grises y verdes oscuros, óxido, acentos naranja cálido; rojos y amarillos solo como aviso (bidones, pintura vial).
- Mándame cada GLB; lo paso por `tools/prep_pieza.mjs`, te digo triángulos y KB y lo pruebo en el móvil.
