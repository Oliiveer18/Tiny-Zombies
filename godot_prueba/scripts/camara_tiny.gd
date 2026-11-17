class_name CamaraTiny
extends Camera3D
## Cámara elevada «Tiny»: misma inclinación (58°) y campo de visión (38° vertical) que el juego de Three.js, centrada en el jugador con un pequeño retardo.
## Distancia 16,4 m / 1,4 = 11,7 unidades (el personaje mide 1,0 aquí).

var objetivo: Node3D
var _pos_suave := Vector3.ZERO
var temblor := 0.0
const DISTANCIA := 11.7
const INCLINACION := 58.0

func _ready() -> void:
	fov = 38.0
	near = 0.5
	far = 120.0
	keep_aspect = Camera3D.KEEP_HEIGHT
	if objetivo != null:
		_pos_suave = objetivo.global_position

func _compensacion() -> Vector3:
	var a := deg_to_rad(INCLINACION)
	return Vector3(0.0, DISTANCIA * sin(a), DISTANCIA * cos(a))

func _process(delta: float) -> void:
	if objetivo == null:
		return
	_pos_suave = _pos_suave.lerp(objetivo.global_position, 1.0 - pow(0.0005, delta))
	temblor = maxf(0.0, temblor - delta * 8.0)
	var t := Vector3(randf_range(-1.0, 1.0), 0.0, randf_range(-1.0, 1.0)) * temblor * 0.05
	global_position = _pos_suave + _compensacion() + t
	look_at(_pos_suave + t, Vector3.UP)
