# Pedidos a Meshy para el mapa de prueba compacto (orden recomendado)

Decidido por el usuario el 16 nov: mapa COMPACTO (≈ 14×20 m: reja, campamento y patio pegados) y **modelos de Meshy primero**. Recetas completas: `coordinacion/RESPUESTAS_FABLE/003`, `005 §7`, `006 §4`, `007 §8`. Cada objeto pequeño: ≈ 150-250 triángulos, textura 256 (lo reduzco yo después con `tools/`). Guarda el GLB original y mándamelo (o súbelo a `arte_fuente/`).

**Arranque común de objetos** (pegar antes de cada texto):
`3D rendered game prop, single object, three-quarter view, plain light grey background, soft studio lighting, chunky stylized mobile top-down shooter style, matte painted, simple clean shapes, NOT realistic, no text, no logos.`

## Orden (de más a menos efecto visual)
1. **Bidón rojo** (sale mucho y explota): `Red metal fuel drum, upright, two raised rings, small cap on top, scratched paint, plain yellow flame hazard diamond without text.`
2. **Caja de madera**: la que ya tienes sirve si te gusta; si no: `Wooden supply crate, planks with metal corners, chipped paint, one cracked plank.`
3. **Contenedor/basurero grande**: `Large rectangular metal dumpster on four small wheels, closed two-part lid, dark green chipped paint, rust at the edges, dented side.`
4. **Reja (una hoja)**: `One single flat gate leaf made of vertical iron bars, 1.5 m wide and 2 m tall, thick square frame, two horizontal crossbars, spear-shaped tips, two hinge pins on the left edge, flaking dark green paint, rust. Standing upright, seen from the front, nothing behind it.`
5. **Farola**: `Old street lamp post, thin dark iron pole with square base, single hanging glass lantern at the top, slightly bent.`
6. **Zombi A** (personaje, pose A, textura PBR): `Zombie office worker: pale grey-green skin, sunken eyes, open mouth, torn white shirt with one sleeve missing, loose dark tie, grey trousers, one shoe missing, hunched but symmetrical. No weapon, no text.` (usa el arranque de personaje de `PROMPTS_MESHY.md` / 006 §4)
7. Después: papelera, caja de cartón, coche, cuerpo de NPC + chaleco + rifle (006 §4), zombi B.

## Consejos
- Genera 2-3 versiones de cada uno y quédate con la que se vea mejor DESDE ARRIBA (la cámara es cenital).
- Colores propios y apagados; que se parezcan entre sí (misma paleta) para dar identidad al lugar.
- Cuando me pases uno, lo paso por `tools/prep_pieza.mjs`, te digo triángulos y KB y lo pruebo en el móvil.
