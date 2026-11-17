extends Node
## Ruido del juego (autoload «Ruido»). Cualquiera emite un sonido y los zombis lo oyen según su radio.
## Unidades: el personaje mide 1,0 (el mundo está a esa escala; en Three.js medía 1,4 m, así que los radios están divididos entre 1,4).
signal sonido(posicion: Vector3, radio: float, quien: String)

const RADIO_DISPARO := 21.0
const RADIO_ANDAR := 2.1
const RADIO_CORRER := 4.3
const RADIO_OBJETO := 5.7

func emitir(posicion: Vector3, radio: float, quien: String = "jugador") -> void:
	if radio > 0.0:
		sonido.emit(posicion, radio, quien)
