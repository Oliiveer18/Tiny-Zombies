extends SceneTree
## Calcula en el marco de la mano derecha hacia dónde está la mano izquierda en cada clip: si el fusil va sujeto por las dos manos, ese vector es el eje del arma.
func _init() -> void:
	var m := PersonajeMixamo.new()
	root.add_child(m)
	m.cargar_rig("res://mixamo/protagonista_rig.fbx", "res://modelos/protagonista.glb", Config.clips_protagonista())
	var ir: int = m.esqueleto.find_bone("mixamorig_RightHand")
	var il: int = m.esqueleto.find_bone("mixamorig_LeftHand")
	for clip in ["apuntar", "andar", "correr", "disparar", "recargar"]:
		var a := m.anim.get_animation(clip)
		var acum := Vector3.ZERO
		var n := 0
		var lista := []
		var t := 0.0
		while t < a.length:
			m.anim.play(clip)
			m.anim.seek(t, true)
			m.anim.pause()
			await process_frame
			await process_frame
			var gr: Transform3D = m.esqueleto.get_bone_global_pose(ir)
			var gl: Transform3D = m.esqueleto.get_bone_global_pose(il)
			var v := gr.affine_inverse() * gl.origin
			lista.append(v)
			acum += v
			n += 1
			t += a.length / 8.0
		var media := acum / n
		var desv := 0.0
		for v in lista:
			desv += (v - media).length()
		print("[eje] %-9s media (en la mano derecha) %s · longitud %.2f · dispersión media %.3f" % [clip, media.snapped(Vector3.ONE * 0.01), media.length(), desv / n])
	quit()
