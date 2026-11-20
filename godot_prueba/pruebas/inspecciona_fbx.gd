extends SceneTree
## Inspección de FBX/GLB importados: huesos y animaciones. Uso: godot --headless --path godot_prueba -s res://pruebas/inspecciona_fbx.gd -- res://mixamo/a.fbx res://mixamo/b.fbx
func _init() -> void:
	for ruta in OS.get_cmdline_user_args():
		var ps = load(ruta)
		if ps == null:
			print("[fbx] NO CARGA ", ruta)
			continue
		var raiz: Node = ps.instantiate()
		var esq: Skeleton3D = null
		for n in raiz.find_children("*", "Skeleton3D", true, false):
			esq = n
		var s := "[fbx] %s · esqueleto: " % ruta.get_file()
		if esq != null:
			s += "%d huesos · primeros: %s" % [esq.get_bone_count(), ", ".join([esq.get_bone_name(0), esq.get_bone_name(1), esq.get_bone_name(2)])]
		else:
			s += "NINGUNO"
		print(s)
		for ap in raiz.find_children("*", "AnimationPlayer", true, false):
			for nombre in (ap as AnimationPlayer).get_animation_list():
				var a := (ap as AnimationPlayer).get_animation(nombre)
				var hips := -1
				for i in a.get_track_count():
					if String(a.track_get_path(i)).to_lower().contains("hips") and a.track_get_type(i) == Animation.TYPE_POSITION_3D:
						hips = i
				var desp := ""
				if hips >= 0 and a.track_get_key_count(hips) > 1:
					var p0: Vector3 = a.track_get_key_value(hips, 0)
					var p1: Vector3 = a.track_get_key_value(hips, a.track_get_key_count(hips) - 1)
					desp = " · cadera inicio %s fin %s (desplazamiento horizontal %.2f)" % [p0.snapped(Vector3.ONE * 0.01), p1.snapped(Vector3.ONE * 0.01), Vector2(p1.x - p0.x, p1.z - p0.z).length()]
				print("[fbx]   anim «%s» · %.2f s · %d pistas%s" % [nombre, a.length, a.get_track_count(), desp])
		raiz.queue_free()
	quit()
