// Mapa de prueba = el callejón (src/data/lugares/callejon_01.json), un lugar reutilizable en el juego real (diseño: RESPUESTAS_FABLE/005).
// Se activa desde el menú de Controles (engranaje) o con ?prueba=1 en la dirección; ?prueba=0 lo desactiva.
import callejon from './data/lugares/callejon_01.json';
let on=false;
try{const m=/[?&]prueba=(\d)/.exec(location.search);if(m)localStorage.setItem('tz_prueba',m[1]==='1'?'1':'');on=localStorage.getItem('tz_prueba')==='1';}catch(e){}
export const TEST=on;
export function setTest(v){try{localStorage.setItem('tz_prueba',v?'1':'');}catch(e){}}
// x: derecha, z: hacia abajo en pantalla; el jugador empieza en (0,0).
export const LUGAR=callejon;
export const LAYOUT={props:callejon.props,zombies:callejon.zombies};
