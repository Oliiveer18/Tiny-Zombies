// Base determinista de la simulación: semilla, hash de enteros, generador y reloj de juego en ticks enteros.
// Regla (CLAUDE.md norma 3): aquí solo Math.imul y + - * /; nada de Math.random/sin/pow ni reloj de pared.
export const WORLD_SEED=7; // semilla del mundo actual (Tiny: arena fija); en A1 será una por partida
// Hash de enteros: mezcla la semilla y varios enteros (rx, rz, canal...) y devuelve un entero sin signo de 32 bits.
export function hash(seed,...ints){let h=seed|0;for(const v of ints){h=Math.imul(h^(v|0),0x9E3779B1);h^=h>>>15;h=Math.imul(h,0x85EBCA6B);h^=h>>>13;}h=Math.imul(h,0xC2B2AE35);h^=h>>>16;return h>>>0;}
export const hash01=(seed,...ints)=>hash(seed,...ints)/4294967296;
// Generador con estado (mulberry32): misma semilla, misma secuencia.
export function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
// Reloj de juego: un entero de ticks (20 por segundo de juego). Todo lo demás (hora, día, estación, clima) se derivará de ese entero.
export const TICK_RATE=20;
export const clock={ticks:0,acc:0};
export function advanceClock(dt){clock.acc+=dt;const n=Math.floor(clock.acc*TICK_RATE);if(n>0){clock.ticks+=n;clock.acc-=n/TICK_RATE;}}
export const gameSeconds=()=>clock.ticks/TICK_RATE;
export const saveClock=()=>({ticks:clock.ticks});
export function loadClock(s){clock.ticks=s?.ticks|0;clock.acc=0;}
export function resetClock(){clock.ticks=0;clock.acc=0;}
