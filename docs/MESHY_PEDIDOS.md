# Pedidos a Meshy · estilo ESTILIZADO DE JUEGO MÓVIL (como el vídeo de referencia)

> ⏸️ **EN PAUSA (decisión del usuario, 17 nov):** no gastar más créditos de Meshy hasta validar la cámara (R1) y fijar las proporciones. Estilo vigente: inspirado en Tiny Troopers, **4-5 cabezas de alto**, compacto pero no infantil ni de juguete (`REFERENCIA_VISUAL.md`). Los textos de abajo se revisarán antes de usarlos (quitar «chunky», fijar las cabezas); el jugador actual no es referencia.

Decidido por el usuario el 16 nov (22:25): **estilizado de juego móvil** (formas simplificadas y fuertes, texturas pintadas; ni fotorrealista ni juguete puro; la prueba «semi-realista» dio una foto y se descartó), mapa **compacto** y **modelos primero**. Esto sustituye el «chunky toy-like» de las recetas 003, 005 §7, 006 §4 y 007 §8 (las cifras de triángulos, texturas y huesos de la 006 siguen valiendo). Arte propio: no copiar colores, ropa ni rótulos del juego de referencia.

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
