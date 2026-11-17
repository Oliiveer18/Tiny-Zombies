extends Node
## Efectos visuales sencillos (autoload «Efectos»): trazador, fogonazo e impacto. Todo se libera solo.

func trazador(desde: Vector3, hasta: Vector3) -> void:
	var largo := desde.distance_to(hasta)
	if largo < 0.1:
		return
	var mi := MeshInstance3D.new()
	var caja := BoxMesh.new()
	caja.size = Vector3(0.025, 0.025, largo)
	mi.mesh = caja
	var mat := StandardMaterial3D.new()
	mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	mat.albedo_color = Color(1.0, 0.85, 0.5)
	mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	mi.material_override = mat
	mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(mi)
	mi.global_position = (desde + hasta) * 0.5
	mi.look_at(hasta, Vector3.UP)
	var tw := create_tween()
	tw.tween_property(mat, "albedo_color:a", 0.0, 0.08)
	tw.tween_callback(mi.queue_free)

func fogonazo(pos: Vector3) -> void:
	var luz := OmniLight3D.new()
	luz.light_color = Color(1.0, 0.8, 0.5)
	luz.light_energy = 2.2
	luz.omni_range = 3.0
	luz.shadow_enabled = false
	add_child(luz)
	luz.global_position = pos
	get_tree().create_timer(0.05).timeout.connect(luz.queue_free)

func impacto(pos: Vector3, normal: Vector3, sangre: bool) -> void:
	var p := CPUParticles3D.new()
	p.emitting = true
	p.one_shot = true
	p.amount = 10 if sangre else 8
	p.lifetime = 0.45
	p.explosiveness = 1.0
	p.direction = normal
	p.spread = 55.0
	p.initial_velocity_min = 1.2
	p.initial_velocity_max = 2.6
	p.gravity = Vector3(0, -9.0, 0)
	var esfera := SphereMesh.new()
	esfera.radius = 0.025
	esfera.height = 0.05
	esfera.radial_segments = 6
	esfera.rings = 3
	p.mesh = esfera
	var mat := StandardMaterial3D.new()
	mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	mat.albedo_color = Color(0.45, 0.06, 0.06) if sangre else Color(0.75, 0.7, 0.6)
	p.material_override = mat
	add_child(p)
	p.global_position = pos
	get_tree().create_timer(1.0).timeout.connect(p.queue_free)
