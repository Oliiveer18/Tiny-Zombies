# PRUEBA EN EL iPHONE · protagonista y zombi normal (20 nov 2026)

Qué probar, en este orden, y qué mirar. Todo en vertical. Abre el juego, ⚙ → mapa de prueba (o `?prueba=1`).
**Antes:** confirma el número de versión que sale abajo a la izquierda y dímelo; el que ves lo pone la publicación.

## 1 · Movimiento del protagonista (2 min)
| Haz | Debe verse |
|---|---|
| Quieto unos segundos | Respira y cambia el peso de un pie a otro; no está congelado |
| Mueve el joystick suave y fuerte | Pasa de andar a correr de forma continua, sin saltos; los pies no patinan |
| Arranca y para en seco | Se inclina hacia delante al arrancar y hacia atrás al frenar |
| Da vueltas con el joystick | Se ladea hacia dentro de la curva |
| Corre | Cuerpo echado hacia delante, zancada larga, algo de rebote |
| Dispara andando y parado | Brazos adelante como sujetando un fusil; pequeño golpe de retroceso en cada disparo; las piernas siguen andando según vayas hacia delante, atrás o de lado |
| Pulsa RECAR. | Baja el arma, mano al cargador, lo mete, amartilla y sube el arma |
**Apúntame:** qué se siente rígido o robótico y en qué movimiento. Aún no hay arma en la mano (será una pieza).

## 2 · Pantalla limpia (1 min)
No debe haber **ningún aro** alrededor del jugador ni círculos blancos en el suelo, ni «!» sobre los zombis. Solo una retícula pequeña que aparece **mientras apuntas** y desaparece al soltar. Si ves algo más, dime qué.

## 3 · Zombis: reacción al ruido y a la vista (5 min)
1. **Quieto 10 s:** los zombis duermen de pie, encorvados, y ninguno se mueve.
2. **Cruza agachado** (botón AGACH.) por el centro hasta la reja: ninguno debe despertar.
3. **Repite andando:** los de los lados **se sobresaltan** (se enderezan, giran la cabeza hacia ti).
4. **Dispara una vez desde el inicio:** los que lo oyen **se paran, giran la cabeza hacia el origen y caminan con cautela hacia allí, moviendo la cabeza de lado a lado.** Si te ven, empiezan a correr hacia ti; si no te ven, llegan al sitio, miran alrededor y se quedan deambulando.
5. **Ponte delante a menos de 5 m** de uno dormido: te debe ver y despertar sin que hagas ruido.
6. **Déjate matar:** «Has caído», vuelves al inicio y los zombis vuelven a dormir.
**Apúntame:** si algo se ve antinatural (giran demasiado rápido, se quedan pasmados, no te encuentran nunca o te encuentran demasiado pronto).

## 4 · Combate (2 min)
Dispara a un zombi: se estremece al impacto y cae hacia atrás al morir. Mira si el golpe del zombi cuando te alcanza se lee (se echa hacia delante con los dos brazos).

## 5 · Rendimiento con varios personajes: `?carga` (3 min)
1. Añade `?carga` al final de la dirección y entra. Hay 12 personajes quietos y sin daño; el medidor muestra fps, peor cuadro, triángulos y llamadas.
2. Espera a que la prueba termine y **haz captura de la pantalla de resultados** (y del medidor si sale).
3. Objetivo: mínimo 30 fps, sostenido 40, ideal 60; peor cuadro ≤ 33 ms.
4. Después juega 2 minutos en el mapa de prueba con `?debug` y fíjate en el resumen de sesión (fps medios, 1 % peor).
**Cada zombi ahora son 8 000 triángulos y el protagonista 10 000** (antes 12 000 el jugador y cápsulas): si baja de 40 fps, dímelo con la captura.

## Qué hay comprobado y qué no
Ver `docs/SESION.md`, entrada «20 nov · Movimiento, pantalla limpia y reacción al ruido». Resumen: lo de arriba se ha comprobado **en un navegador de escritorio sin GPU** (lógica, estados, capturas); **nada de lo que dependa del iPhone** (tacto, fps, aspecto real del movimiento) está comprobado.
