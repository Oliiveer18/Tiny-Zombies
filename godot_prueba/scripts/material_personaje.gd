class_name MaterialPersonaje
## Material mate de los personajes. Se construye desde cero con SOLO la textura de color del GLB (sin metal, sin mapa de rugosidad),
## porque en el Mac de la prueba el material copiado del GLB se veía plateado y ruidoso.
## Tecla F4 (o Share/Select + L3): cambia el modo en vivo: 0 solo color · 1 color + relieve · 2 sin texturas.
static var activos: Array[StandardMaterial3D] = []
static var modo := 0

static func crear(ruta_glb: String) -> StandardMaterial3D:
	var original := (load(ruta_glb) as PackedScene).instantiate()
	var color_tex: Texture2D = null
	var normal_tex: Texture2D = null
	for m in original.find_children("*", "MeshInstance3D", true, false):
		var mm := (m as MeshInstance3D).get_active_material(0)
		if mm is StandardMaterial3D:
			color_tex = (mm as StandardMaterial3D).albedo_texture
			normal_tex = (mm as StandardMaterial3D).normal_texture
	original.free()
	var mat := StandardMaterial3D.new()
	mat.albedo_texture = color_tex
	mat.set_meta("color", color_tex)
	mat.set_meta("normal", normal_tex)
	mat.metallic = 0.0
	mat.metallic_specular = 0.2
	mat.roughness = 1.0
	mat.cull_mode = BaseMaterial3D.CULL_BACK
	mat.texture_filter = BaseMaterial3D.TEXTURE_FILTER_LINEAR_WITH_MIPMAPS
	activos.append(mat)
	_aplicar(mat)
	return mat

static func ciclar() -> int:
	modo = (modo + 1) % 3
	activos = activos.filter(func(m: StandardMaterial3D) -> bool: return is_instance_valid(m))
	for m in activos:
		_aplicar(m)
	return modo

static func _aplicar(mat: StandardMaterial3D) -> void:
	var c = mat.get_meta("color")
	var n = mat.get_meta("normal")
	mat.albedo_texture = c if modo < 2 else null
	mat.albedo_color = Color.WHITE if modo < 2 else Color(0.6, 0.6, 0.6)
	mat.normal_enabled = modo == 1 and n != null
	mat.normal_texture = n if modo == 1 else null
	mat.normal_scale = 0.6

static func nombre_modo() -> String:
	return ["solo color", "color + relieve", "sin texturas"][modo]
