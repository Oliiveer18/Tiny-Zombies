// Sustituye cada archivo de /public/models/ por tu GLB de Meshy con el MISMO nombre.
// scale: escala uniforme · offset: [x,y,z] · placeholder: forma usada si el GLB no existe
// clips: nombre del clip en el GLB para cada acción lógica (si falta, se anima por código).
// Zombis (PAQ-03 / 010 §7): el juego pide clips por nombre lógico (idle dormido · wake despertando · walk deambula · run persigue · attack · hit · die).
// Para poner el modelo definitivo basta cambiar `file` (y `anims` si los clips van aparte) y, a la derecha de cada nombre lógico, el nombre real del clip.
// Si falta un clip se usa el anterior de la lista; si no hay ninguno, el movimiento por código.
export const MODELS = {
  player:  { file:'personajes/cuerpos/protagonista.glb', scale:1.0, offset:[0,0,0], gen:'humano', relleno:.8, placeholder:{shape:'capsule',color:0x4a8fd8,h:0.9},  clips:{idle:'idle',walk:'walk',run:'run',shoot_side:'shoot_side',shoot_back:'shoot_back',shoot_fwd:'shoot_fwd',reload:'reload',die:'die'} },
  // player (antes): { file:'personajes/cuerpos/jugador_a.glb', anims:'personajes/anims/humano.glb', scale:0.53, ... } con los 8 clips de Meshy
  // zombie: modelo de Meshy pasado por tools/reduce → rehacer_textura → esqueleto_auto (1 de alto; `scale` = altura en metros, aún no definitiva). gen:'zombi' = clips generados por src/anim_zombi.js
  zombie:  { file:'zombie.glb',  scale:1.4, offset:[0,0,0], gen:'zombi', relleno:.8, placeholder:{shape:'capsule',color:0x6a9a5a,h:0.9},  clips:{idle:'idle',stand:'stand',wake:'wake',walk:'walk',run:'run',attack:'attack',die:'die'} },
  runner:  { file:'runner.glb',  scale:0.9, offset:[0,0,0], placeholder:{shape:'capsule',color:0xb0a040,h:0.85}, clips:{idle:'idle',wake:'wake',walk:'walk',run:'run',attack:'attack',hit:'hit',die:'die'} },
  tank:    { file:'tank.glb',    scale:1.5, offset:[0,0,0], placeholder:{shape:'capsule',color:0x8a3a3a,h:1.0},  clips:{idle:'idle',wake:'wake',walk:'walk',run:'run',attack:'attack',hit:'hit',die:'die'} },
  fence:   { file:'fence.glb',   scale:1, offset:[0,0,0], placeholder:{shape:'box',color:0x6b4a2b,s:[1.6,0.8,0.1]},  radius:0.8 },
  barrel:  { file:'barrel.glb',  scale:1, offset:[0,0,0], placeholder:{shape:'cyl',color:0x8a4a2a,s:[0.35,0.9,0.35]}, radius:0.4 },
  barrier: { file:'barrier.glb', scale:1, offset:[0,0,0], placeholder:{shape:'box',color:0xe8731a,s:[1.4,0.6,0.35]},  radius:0.7 },
  crate:   { file:'crate.glb',   scale:1, offset:[0,0,0], placeholder:{shape:'box',color:0x8a6a3a,s:[0.8,0.8,0.8]},   radius:0.5 },
  sack:    { file:'sack.glb',    scale:1, offset:[0,0,0], placeholder:{shape:'box',color:0xb09a70,s:[0.7,0.4,0.5]},   radius:0.4 },
  car:     { file:'car.glb',     scale:1, offset:[0,0,0], placeholder:{shape:'box',color:0x5a5f66,s:[2.6,0.9,1.3]},   radius:1.4 },
};
