// Mapa de prueba: arena pequeña y fija para probar sin perder tiempo (zombis quietos, obstáculos en sitios conocidos, granadas infinitas).
// Se activa desde el menú de Controles (engranaje) o con ?prueba=1 en la dirección; ?prueba=0 lo desactiva.
let on=false;
try{const m=/[?&]prueba=(\d)/.exec(location.search);if(m)localStorage.setItem('tz_prueba',m[1]==='1'?'1':'');on=localStorage.getItem('tz_prueba')==='1';}catch(e){}
export const TEST=on;
export function setTest(v){try{localStorage.setItem('tz_prueba',v?'1':'');}catch(e){}}
// x: derecha, z: hacia abajo en pantalla; el jugador empieza en (0,0). Contenido como datos: [tipo, x, z, giro].
export const LAYOUT={
  props:[
    ['crate',-7,-7,0],['crate',-8.3,-7,.2],['crate',-7.6,-8.3,.5],['crate',-5.5,-9,0],
    ['barrel',6,-6,0],['barrel',7.2,-6.3,0],['barrel',6.6,-7.5,0],['barrel',8,-7.4,0],['barrel',5.6,-7.6,0],
    ['barrier',-9,4,0],['barrier',-7,4,0],['barrier',-5,4,0],['barrier',-3,4,0],
    ['fence',10,2,1.57],['fence',10,4,1.57],['fence',10,6,1.57],['fence',10,8,1.57],
    ['car',-12,-3,.4],['car',12,-14,1.2],
    ['sack',3,5,0],['sack',4.2,5.4,.3],['sack',-2,8,0],['sack',-3.2,8.4,.2],
  ],
  zombies:[ // línea de tiro en el centro (distancias 6, 10, 14, 18), un corredor, un tanque y un grupo para granadas
    ['normal',0,-6],['normal',0,-10],['normal',0,-14],['normal',0,-18],
    ['runner',-4,-12],['tank',4,-12],
    ['normal',-14,-18],['normal',-13,-17],['normal',-15,-17],['normal',-14,-16],['normal',-12.6,-18.4],['normal',-15.4,-18.6],
    ['normal',0,4],
  ],
};
