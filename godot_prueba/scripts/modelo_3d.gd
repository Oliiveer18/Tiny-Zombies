class_name Modelo3D
extends Node3D
## Un personaje: carga el GLB (modelo, texturas y esqueleto originales), le pone los clips, ajusta los materiales a acabado mate,
## permite sumar rotaciones por código a los huesos (inclinaciones, cabeza, retroceso) y activar un ragdoll con huesos físicos.

var raiz: Node3D
var esqueleto: Skeleton3D
var anim: AnimationPlayer
var huesos := {}
var ragdoll_activo := false
var _sim: PhysicalBoneSimulator3D

func cargar(ruta_glb: String, ruta_clips: String, escala: float) -> bool:
	var recurso := load(ruta_glb)
	if recurso == null or not (recurso is PackedScene):
		push_error("No se pudo cargar el modelo " + ruta_glb + " (¿se ha importado? abre el proyecto en el editor una vez)")
		return false
	raiz = (recurso as PackedScene).instantiate() as Node3D
	add_child(raiz)
	raiz.scale = Vector3.ONE * escala
	esqueleto = AnimUtil.buscar_esqueleto(raiz)
	if esqueleto == null:
		push_error("El modelo no tiene esqueleto: " + ruta_glb)
		return false
	_ajustar_materiales(raiz)
	huesos = AnimUtil.mapa_huesos(esqueleto)
	anim = AnimationPlayer.new()
	raiz.add_child(anim)  # su raíz de pistas es el padre (el modelo): las rutas de los huesos salen de ahí
	anim.add_animation_library("", AnimUtil.cargar_clips(ruta_clips, raiz, esqueleto))
	return true

## Acabado mate como en la dirección artística: sin metal (con el entorno sin reflejos saldría negro) y rugosidad alta.
func _ajustar_materiales(nodo: Node) -> void:
	for m in nodo.find_children("*", "MeshInstance3D", true, false):
		var mi := m as MeshInstance3D
		if mi.mesh == null:
			continue
		for i in mi.mesh.get_surface_count():
			var mat := mi.get_active_material(i)
			if mat is StandardMaterial3D:
				var nuevo := (mat as StandardMaterial3D).duplicate() as StandardMaterial3D
				nuevo.metallic = 0.0
				nuevo.metallic_texture = null
				nuevo.roughness = 0.85
				nuevo.roughness_texture = null
				nuevo.cull_mode = BaseMaterial3D.CULL_BACK
				nuevo.texture_filter = BaseMaterial3D.TEXTURE_FILTER_LINEAR_WITH_MIPMAPS_ANISOTROPIC
				mi.set_surface_override_material(i, nuevo)

func reproducir(nombre: String, mezcla: float = 0.2, velocidad: float = 1.0) -> void:
	if anim == null or not anim.has_animation(nombre):
		return
	anim.speed_scale = velocidad
	if anim.current_animation != nombre or not anim.is_playing():
		anim.play(nombre, mezcla)

## Suma una rotación (grados: x = cabecear, y = girar, z = ladear) a un hueso, encima de lo que ha puesto la animación en este cuadro.
func sumar(nombre_hueso: String, grados: Vector3) -> void:
	if ragdoll_activo:
		return
	var i: int = huesos.get(nombre_hueso, -1)
	if i < 0:
		return
	var q := esqueleto.get_bone_pose_rotation(i)
	esqueleto.set_bone_pose_rotation(i, q * Quaternion.from_euler(Vector3(deg_to_rad(grados.x), deg_to_rad(grados.y), deg_to_rad(grados.z))))

## Ragdoll con huesos físicos (PhysicalBone3D) creados por código. Cápsulas por hueso, articulaciones de cono y sin colisión entre ellos.
func activar_ragdoll(impulso: Vector3) -> void:
	if ragdoll_activo or esqueleto == null:
		return
	ragdoll_activo = true
	anim.stop()
	_sim = PhysicalBoneSimulator3D.new()
	esqueleto.add_child(_sim)
	var claves := ["hips", "spine", "spine2", "neck", "head", "leftarm", "leftforearm", "lefthand", "rightarm", "rightforearm", "righthand", "leftupleg", "leftleg", "leftfoot", "rightupleg", "rightleg", "rightfoot"]
	var hijo := {"hips": "spine", "spine": "spine2", "spine2": "neck", "neck": "head", "leftarm": "leftforearm", "leftforearm": "lefthand", "rightarm": "rightforearm", "rightforearm": "righthand", "leftupleg": "leftleg", "leftleg": "leftfoot", "rightupleg": "rightleg", "rightleg": "rightfoot"}
	var cuerpos: Array[PhysicalBone3D] = []
	for c in claves:
		var idx: int = huesos.get(c, -1)
		if idx < 0:
			continue
		var pb := PhysicalBone3D.new()
		pb.name = "PB_" + c
		_sim.add_child(pb)
		pb.bone_name = esqueleto.get_bone_name(idx)
		var largo := 0.1
		var dir := Vector3.UP
		if hijo.has(c) and huesos.has(hijo[c]):
			var desp := esqueleto.get_bone_rest(huesos[hijo[c]]).origin
			largo = maxf(desp.length(), 0.08)
			dir = desp.normalized()
		var radio := clampf(largo * 0.3, 0.03, 0.08)
		var forma := CapsuleShape3D.new()
		forma.radius = radio
		forma.height = largo + radio * 2.0
		var cs := CollisionShape3D.new()
		cs.shape = forma
		pb.add_child(cs)
		var base := Basis.IDENTITY
		if dir.dot(Vector3.UP) < 0.999 and dir.dot(Vector3.UP) > -0.999:
			base = Basis(Quaternion(Vector3.UP, dir))
		cs.transform = Transform3D(base, dir * largo * 0.5)
		pb.mass = 4.0 if (c == "hips" or c == "spine" or c == "spine2") else 1.5
		pb.collision_layer = Capas.RAGDOLL
		pb.collision_mask = Capas.MUNDO | Capas.MUROS | Capas.PROPS
		if c == "hips":
			pb.joint_type = PhysicalBone3D.JOINT_TYPE_NONE
		else:
			pb.joint_type = PhysicalBone3D.JOINT_TYPE_CONE
			pb.set("joint_constraints/swing_span", 55.0)
			pb.set("joint_constraints/twist_span", 35.0)
		cuerpos.append(pb)
	for a in cuerpos:
		for b in cuerpos:
			if a != b:
				a.add_collision_exception_with(b)
	await get_tree().physics_frame
	_sim.physical_bones_start_simulation()
	for pb in cuerpos:
		pb.apply_central_impulse(impulso * pb.mass * 0.35)
