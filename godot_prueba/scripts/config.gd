class_name Config
extends RefCounted
## Rutas y clips de Mixamo de cada personaje. «quitar_avance» = el clip de Mixamo avanza (no viene «in place») y hay que anular ese desplazamiento.
static func clips_protagonista() -> Dictionary:
	return {
		"andar": {"ruta": "res://mixamo/p_andar.fbx", "bucle": true, "quitar_avance": true},
		"correr": {"ruta": "res://mixamo/p_correr.fbx", "bucle": true, "quitar_avance": true},
		"apuntar": {"ruta": "res://mixamo/p_apuntar.fbx", "bucle": true},
		"disparar": {"ruta": "res://mixamo/p_disparar.fbx", "bucle": true},
		"recargar": {"ruta": "res://mixamo/p_recargar.fbx", "bucle": false},
	}
static func clips_zombi() -> Dictionary:
	return {
		"andar": {"ruta": "res://mixamo/z_andar.fbx", "bucle": true, "quitar_avance": true},
		"correr": {"ruta": "res://mixamo/z_correr.fbx", "bucle": true, "quitar_avance": true},
		"atacar": {"ruta": "res://mixamo/z_atacar.fbx", "bucle": true},
		"morir": {"ruta": "res://mixamo/z_morir.fbx", "bucle": false},
	}
