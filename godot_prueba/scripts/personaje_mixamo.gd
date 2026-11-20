class_name PersonajeMixamo
extends Modelo3D
## Personaje con el rig y las animaciones de Mixamo (esqueleto de 33 huesos). Se aprovecha el material (texturas) de nuestro GLB original sobre la malla de Mixamo.
## Las animaciones se cargan de FBX sueltos: cada uno trae un clip «mixamo_com» que se copia con el nombre que se le da aquí.
## Los clips de andar y correr de Mixamo NO vienen «in place»: se les quita el desplazamiento de la cadera y se guarda su velocidad natural (m/s) para ajustar el paso al suelo.

var velocidad_natural := {}   # nombre de clip → m/s que recorre el clip tal cual (para que los pies no patinen)

func cargar_rig(ruta_rig: String, ruta_glb_material: String, clips: Dictionary, escala: float = 1.0) -> bool:
	var ps := load(ruta_rig) as PackedScene
	if ps == null:
		push_error("No se pudo cargar el rig " + ruta_rig)
		return false
	raiz = ps.instantiate() as Node3D
	add_child(raiz)
	raiz.scale = Vector3.ONE * escala
	esqueleto = AnimUtil.buscar_esqueleto(raiz)
	if esqueleto == null:
		push_error("El rig no tiene esqueleto: " + ruta_rig)
		return false
	huesos = AnimUtil.mapa_huesos(esqueleto)
	_poner_material(ruta_glb_material)
	anim = raiz.find_children("*", "AnimationPlayer", true, false)[0] as AnimationPlayer
	var lib := AnimationLibrary.new()
	for nombre in clips:
		var c: Dictionary = clips[nombre]
		var a := _extraer_clip(String(c["ruta"]))
		if a == null:
			continue
		a = a.duplicate()
		a.loop_mode = Animation.LOOP_LINEAR if c.get("bucle", false) else Animation.LOOP_NONE
		if c.get("quitar_avance", false):
			velocidad_natural[nombre] = _quitar_avance(a)
		lib.add_animation(nombre, a)
	for n in anim.get_animation_library_list():
		anim.remove_animation_library(n)
	anim.add_animation_library("", lib)
	anim.root_node = anim.get_path_to(raiz)
	return true

## Toma el material del GLB original (textura de color, relieve y rugosidad) y lo pone sobre la malla del rig.
func _poner_material(ruta_glb: String) -> void:
	var mat := MaterialPersonaje.crear(ruta_glb)
	for m in raiz.find_children("*", "MeshInstance3D", true, false):
		var mi := m as MeshInstance3D
		for i in mi.mesh.get_surface_count():
			mi.set_surface_override_material(i, mat)

func _extraer_clip(ruta: String) -> Animation:
	var ps := load(ruta) as PackedScene
	if ps == null:
		push_error("No se pudo cargar la animación " + ruta)
		return null
	var escena := ps.instantiate()
	var res: Animation = null
	for ap in escena.find_children("*", "AnimationPlayer", true, false):
		for n in (ap as AnimationPlayer).get_animation_list():
			res = (ap as AnimationPlayer).get_animation(n)
	var copia: Animation = res.duplicate() if res != null else null
	escena.queue_free()
	return copia

## Quita la tendencia lineal horizontal de la cadera (el avance) y devuelve los m/s que avanzaba el clip.
func _quitar_avance(a: Animation) -> float:
	for i in a.get_track_count():
		if a.track_get_type(i) == Animation.TYPE_POSITION_3D and String(a.track_get_path(i)).to_lower().ends_with("hips"):
			var n := a.track_get_key_count(i)
			if n < 2:
				return 0.0
			var p0: Vector3 = a.track_get_key_value(i, 0)
			var p1: Vector3 = a.track_get_key_value(i, n - 1)
			var t1 := a.track_get_key_time(i, n - 1)
			var avance := Vector2(p1.x - p0.x, p1.z - p0.z)
			for k in n:
				var f := a.track_get_key_time(i, k) / maxf(t1, 0.0001)
				var p: Vector3 = a.track_get_key_value(i, k)
				p.x -= avance.x * f
				p.z -= avance.y * f
				a.track_set_key_value(i, k, p)
			return avance.length() / maxf(t1, 0.0001)
	return 0.0

## Fusil provisional (formas simples) enganchado a la mano derecha. En la mano de Mixamo, el eje Y apunta hacia delante y el Z hacia arriba.
## Es solo para comprobar el agarre; el arma definitiva será una pieza de Meshy enganchada al mismo hueso.
var arma: BoneAttachment3D
func poner_arma(nombre_hueso: String = "mixamorig_RightHand") -> void:
	arma = BoneAttachment3D.new()
	arma.bone_name = nombre_hueso
	esqueleto.add_child(arma)
	# Dimensiones adaptadas a las proporciones compactas: las manos de este personaje están a 0,2 una de otra (en un humano normal, 0,35)
	var piezas := [
		[Vector3(0.036, 0.34, 0.06), Vector3(0.0, 0.08, 0.045)],    # cuerpo
		[Vector3(0.03, 0.12, 0.08), Vector3(0.0, -0.14, 0.03)],     # culata
		[Vector3(0.025, 0.045, 0.09), Vector3(0.0, 0.06, -0.015)],  # cargador
		[Vector3(0.022, 0.09, 0.03), Vector3(0.0, 0.1, 0.09)],      # mira
	]
	arma.rotation.x = 0.29  # la mano izquierda queda ≈ 17° por encima del eje de la mano derecha (medido en todos los clips)
	var mat := StandardMaterial3D.new()
	mat.albedo_color = Color(0.1, 0.11, 0.12)
	mat.roughness = 0.7
	for p in piezas:
		var mi := MeshInstance3D.new()
		var bm := BoxMesh.new()
		bm.size = p[0]
		mi.mesh = bm
		mi.material_override = mat
		mi.position = p[1]
		arma.add_child(mi)
	var canon := MeshInstance3D.new()
	var cm := CylinderMesh.new()
	cm.top_radius = 0.011
	cm.bottom_radius = 0.011
	cm.height = 0.18
	canon.mesh = cm
	canon.material_override = mat
	canon.position = Vector3(0.0, 0.34, 0.045)
	arma.add_child(canon)
