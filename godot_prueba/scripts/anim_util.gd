class_name AnimUtil
extends RefCounted
## Utilidades para usar en Godot los mismos esqueletos y animaciones que el juego de Three.js.
## Los clips vienen de datos/clips_*.json, que genera tools/exportar_clips_godot.mjs muestreando las funciones de pose ya existentes (src/anim_humano.js y src/anim_zombi.js).

static func buscar_esqueleto(raiz: Node) -> Skeleton3D:
	var lista := raiz.find_children("*", "Skeleton3D", true, false)
	if lista.size() > 0:
		return lista[0] as Skeleton3D
	return null

## Nombre normalizado de un hueso: minúsculas, sin ':' '_' ni espacios y sin el prefijo «mixamorig». Godot puede cambiar «mixamorig:Hips» por «mixamorig_Hips».
static func clave(nombre: String) -> String:
	var n := nombre.to_lower().replace(":", "").replace("_", "").replace(" ", "")
	if n.begins_with("mixamorig"):
		n = n.substr(9)
	return n

## Diccionario clave normalizada («hips», «leftarm»…) → índice de hueso.
static func mapa_huesos(esqueleto: Skeleton3D) -> Dictionary:
	var m := {}
	for i in esqueleto.get_bone_count():
		m[clave(esqueleto.get_bone_name(i))] = i
	return m

## Crea una librería de animaciones a partir del JSON exportado. Las pistas apuntan a los huesos reales del esqueleto cargado.
static func cargar_clips(ruta_json: String, raiz_modelo: Node, esqueleto: Skeleton3D) -> AnimationLibrary:
	var lib := AnimationLibrary.new()
	var f := FileAccess.open(ruta_json, FileAccess.READ)
	if f == null:
		push_error("No se encuentra " + ruta_json)
		return lib
	var datos = JSON.parse_string(f.get_as_text())
	if typeof(datos) != TYPE_DICTIONARY:
		push_error("JSON de animaciones no válido: " + ruta_json)
		return lib
	var mapa := mapa_huesos(esqueleto)
	var ruta_esq := str(raiz_modelo.get_path_to(esqueleto))
	for nombre in datos:
		var c: Dictionary = datos[nombre]
		var anim := Animation.new()
		anim.length = float(c["dur"])
		anim.loop_mode = Animation.LOOP_LINEAR if c["loop"] else Animation.LOOP_NONE
		var tiempos: Array = c["t"]
		var huesos: Dictionary = c["huesos"]
		for h in huesos:
			var idx: int = mapa.get(String(h).to_lower(), -1)
			if idx < 0:
				continue
			var ruta := NodePath(ruta_esq + ":" + esqueleto.get_bone_name(idx))
			var d: Dictionary = huesos[h]
			if d.has("q"):
				var q: Array = d["q"]
				var pista := anim.add_track(Animation.TYPE_ROTATION_3D)
				anim.track_set_path(pista, ruta)
				for k in tiempos.size():
					anim.rotation_track_insert_key(pista, float(tiempos[k]), Quaternion(q[k * 4], q[k * 4 + 1], q[k * 4 + 2], q[k * 4 + 3]))
			if d.has("p"):
				var p: Array = d["p"]
				var pista_p := anim.add_track(Animation.TYPE_POSITION_3D)
				anim.track_set_path(pista_p, ruta)
				for k in tiempos.size():
					anim.position_track_insert_key(pista_p, float(tiempos[k]), Vector3(p[k * 3], p[k * 3 + 1], p[k * 3 + 2]))
		lib.add_animation(nombre, anim)
	return lib
