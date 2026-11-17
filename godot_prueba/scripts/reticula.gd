class_name Reticula
extends Control
## Retícula mínima: un aro pequeño que solo aparece mientras se apunta (nada permanente en pantalla).
func _draw() -> void:
	draw_arc(Vector2.ZERO, 7.0, 0.0, TAU, 24, Color(1, 1, 1, 0.85), 1.5, true)
