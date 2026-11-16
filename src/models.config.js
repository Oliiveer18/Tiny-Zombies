// Sustituye cada archivo de /public/models/ por tu GLB de Meshy con el MISMO nombre.
// scale: escala uniforme · offset: [x,y,z] · placeholder: forma usada si el GLB no existe
// clips: nombre del clip en el GLB para cada acción lógica (si falta, se anima por código).
export const MODELS = {
  player:  { file:'personajes/cuerpos/jugador_a.glb', anims:'personajes/anims/humano.glb',  scale:0.53,   offset:[0,0,0], placeholder:{shape:'capsule',color:0x4a8fd8,h:0.9},  clips:{idle:'idle',walk:'walk',run:'run',shoot_side:'shoot_side',shoot_back:'shoot_back',shoot_fwd:'shoot_fwd',reload:'reload',die:'die'} },
  zombie:  { file:'zombie.glb',  scale:1,   offset:[0,0,0], placeholder:{shape:'capsule',color:0x6a9a5a,h:0.9},  clips:{run:'run',attack:'attack',die:'die'} },
  runner:  { file:'runner.glb',  scale:0.9, offset:[0,0,0], placeholder:{shape:'capsule',color:0xb0a040,h:0.85}, clips:{run:'run',attack:'attack',die:'die'} },
  tank:    { file:'tank.glb',    scale:1.5, offset:[0,0,0], placeholder:{shape:'capsule',color:0x8a3a3a,h:1.0},  clips:{run:'run',attack:'attack',die:'die'} },
  fence:   { file:'fence.glb',   scale:1, offset:[0,0,0], placeholder:{shape:'box',color:0x6b4a2b,s:[1.6,0.8,0.1]},  radius:0.8 },
  barrel:  { file:'barrel.glb',  scale:1, offset:[0,0,0], placeholder:{shape:'cyl',color:0x8a4a2a,s:[0.35,0.9,0.35]}, radius:0.4 },
  barrier: { file:'barrier.glb', scale:1, offset:[0,0,0], placeholder:{shape:'box',color:0xe8731a,s:[1.4,0.6,0.35]},  radius:0.7 },
  crate:   { file:'crate.glb',   scale:1, offset:[0,0,0], placeholder:{shape:'box',color:0x8a6a3a,s:[0.8,0.8,0.8]},   radius:0.5 },
  sack:    { file:'sack.glb',    scale:1, offset:[0,0,0], placeholder:{shape:'box',color:0xb09a70,s:[0.7,0.4,0.5]},   radius:0.4 },
  car:     { file:'car.glb',     scale:1, offset:[0,0,0], placeholder:{shape:'box',color:0x5a5f66,s:[2.6,0.9,1.3]},   radius:1.4 },
};
