extends SceneTree
## Inspección de los personajes con rig de Mixamo: huesos, altura, mallas y materiales.
func _init() -> void:
	for ruta in OS.get_cmdline_user_args():
		var raiz: Node = (load(ruta) as PackedScene).instantiate()
		var esq: Skeleton3D = raiz.find_children("*", "Skeleton3D", true, false)[0]
		var nombres := []
		for i in esq.get_bone_count():
			nombres.append(esq.get_bone_name(i).replace("mixamorig_", ""))
		print("[rig] ", ruta.get_file(), " · ", esq.get_bone_count(), " huesos: ", ", ".join(nombres))
		print("[rig]   ruta del esqueleto: ", raiz.get_path_to(esq), " · escala raíz ", (raiz as Node3D).scale, " · hijos raíz: ", raiz.get_children().map(func(c): return c.name))
		for m in raiz.find_children("*", "MeshInstance3D", true, false):
			var mi := m as MeshInstance3D
			var aabb := mi.get_aabb()
			print("[rig]   malla ", mi.name, " · superficies ", mi.mesh.get_surface_count(), " · AABB tamaño ", aabb.size, " pos ", aabb.position, " · material0 ", mi.get_active_material(0))
		var hips := esq.get_bone_global_rest(esq.find_bone("mixamorig_Hips")).origin
		print("[rig]   cadera en reposo (global del esqueleto): ", hips, " · pie izq: ", esq.get_bone_global_rest(esq.find_bone("mixamorig_LeftFoot")).origin)
		raiz.queue_free()
	quit()
