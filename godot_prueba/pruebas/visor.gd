extends Node3D
## Visor de animaciones: pone un personaje con una animación en un instante dado y guarda capturas (cámara de cerca y la del juego).
## Uso: godot --path godot_prueba --rendering-driver opengl3 res://pruebas/visor.tscn -- <carpeta> <personaje: p|z> <clip> <t1,t2,...> [vista: lado|tres|arriba]
var salida := "/tmp/visor"
func _ready() -> void:
	var a := OS.get_cmdline_user_args()
	salida = a[0]
	DirAccess.make_dir_recursive_absolute(salida)
	var quien: String = a[1]
	var clip: String = a[2]
	var tiempos: PackedStringArray = String(a[3]).split(",")
	var vista := a[4] if a.size() > 4 else "tres"
	var luz := DirectionalLight3D.new()
	luz.rotation_degrees = Vector3(-45, -30, 0)
	luz.light_energy = 1.2
	add_child(luz)
	var env := Environment.new()
	env.background_mode = Environment.BG_COLOR
	env.background_color = Color(0.35, 0.37, 0.42)
	env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.ambient_light_color = Color(0.7, 0.72, 0.8)
	env.ambient_light_energy = 0.9
	var we := WorldEnvironment.new()
	we.environment = env
	add_child(we)
	var suelo := MeshInstance3D.new()
	var pl := PlaneMesh.new()
	pl.size = Vector2(6, 6)
	suelo.mesh = pl
	var sm := StandardMaterial3D.new()
	sm.albedo_color = Color(0.3, 0.3, 0.32)
	suelo.material_override = sm
	add_child(suelo)
	var m := PersonajeMixamo.new()
	add_child(m)
	if quien == "p":
		m.cargar_rig("res://mixamo/protagonista_rig.fbx", "res://modelos/protagonista.glb", Config.clips_protagonista())
	else:
		m.cargar_rig("res://mixamo/zombi_rig.fbx", "res://modelos/zombi.glb", Config.clips_zombi())
	if OS.get_cmdline_user_args().size() > 5 and OS.get_cmdline_user_args()[5] == "arma" and quien == "p":
		m.poner_arma()
	if OS.get_cmdline_user_args().size() > 5 and OS.get_cmdline_user_args()[5] == "ejes":
		for lado in ["Right", "Left"]:
			var ba := BoneAttachment3D.new()
			ba.bone_name = "mixamorig_%sHand" % lado
			m.esqueleto.add_child(ba)
			for e in [[Vector3(0.25, 0.01, 0.01), Color.RED], [Vector3(0.01, 0.25, 0.01), Color.GREEN], [Vector3(0.01, 0.01, 0.25), Color.BLUE]]:
				var mi := MeshInstance3D.new()
				var bm := BoxMesh.new()
				bm.size = e[0]
				mi.mesh = bm
				var mt := StandardMaterial3D.new()
				mt.albedo_color = e[1]
				mt.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
				mi.material_override = mt
				mi.position = e[0] * 0.5
				ba.add_child(mi)
	var cam := Camera3D.new()
	add_child(cam)
	cam.fov = 30
	match vista:
		"lado": cam.position = Vector3(3.2, 0.6, 0); 
		"arriba": cam.position = Vector3(0, 5.5, 3.4)
		_: cam.position = Vector3(2.4, 1.1, 2.6)
	cam.look_at(Vector3(0, 0.5, 0))
	await get_tree().create_timer(0.3).timeout
	var i := 0
	for ts in tiempos:
		m.anim.play(clip)
		m.anim.seek(float(ts), true)
		m.anim.pause()
		await get_tree().create_timer(0.15).timeout
		await RenderingServer.frame_post_draw
		get_viewport().get_texture().get_image().save_png("%s/%s_%s_%02d_%s.png" % [salida, quien, clip, i, ts])
		i += 1
	get_tree().quit()
