// Mapa de prueba = el callejón (src/data/lugares/callejon_01.json), un lugar reutilizable en el juego real (diseño: RESPUESTAS_FABLE/005).
// Se activa desde el menú de Controles (engranaje) o con ?prueba=1 en la dirección; ?prueba=0 lo desactiva.
import callejon from './data/lugares/callejon_01.json';
let on=false;
try{const m=/[?&]prueba=(\d)/.exec(location.search);if(m)localStorage.setItem('tz_prueba',m[1]==='1'?'1':'');on=localStorage.getItem('tz_prueba')==='1';}catch(e){}
if(/[?&]carga/.test(location.search))on=true; // ?carga fuerza el mapa de prueba sin guardarlo (PAQ-G1: el jugador no recibe daño y los zombis están quietos)
export const TEST=on;
export const CARGA=/[?&]carga/.test(location.search); // prueba de carga: zombis quietos y sin daño
export const VIVO=TEST&&!CARGA; // mapa de prueba «vivo» (PAQ-03): zombis que duermen, oyen, ven y persiguen; el jugador recibe daño
export function setTest(v){try{localStorage.setItem('tz_prueba',v?'1':'');}catch(e){}}
// x: derecha, z: hacia abajo en pantalla; el jugador empieza en (0,0).
export const LUGAR=callejon;
export const LAYOUT={props:callejon.props,zombies:CARGA?[['normal',0,-6],['normal',0,-10],['normal',0,-14],['normal',0,-18],['runner',-2.2,-23.4],['tank',.4,-24.8],['normal',0,-34],['normal',-.7,-35.1],['normal',.7,-35.4],['normal',0,-36.6],['normal',-.8,-32.8],['normal',.8,-33]]:callejon.zombies}; // ?carga conserva la colocación con la que se midió
