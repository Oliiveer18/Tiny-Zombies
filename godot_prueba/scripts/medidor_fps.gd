class_name MedidorFps
extends CanvasLayer
## Medidor de rendimiento fácil. M: mostrar/ocultar los fps. G: grabar 60 s (juega normal mientras graba; al acabar sale un resumen grande,
## se copia al portapapeles y se guarda en user://fps_AAAA-MM-DD_HHMMSS.txt). T: cambia el aspecto de las texturas (solo color / con relieve / sin texturas).
const DURACION := 60.0
var main: Node
var chico: Label
var grande: Label
var _acum := 0.0
var _n := 0
var _t_ref := 0.0
var _fps_vista := 0
var grabando := false
var _t_grab := 0.0
var _ms: PackedFloat32Array = PackedFloat32Array()
var _llamadas := 0.0
var _tris := 0.0
var _persiguen_max := 0
var _fisica_ms := 0.0
var _proceso_ms := 0.0
var _muestras := 0

func _ready() -> void:
	layer = 50
	chico = Label.new()
	chico.position = Vector2(16, 90)
	chico.add_theme_color_override("font_outline_color", Color.BLACK)
	chico.add_theme_constant_override("outline_size", 6)
	chico.add_theme_font_size_override("font_size", 22)
	chico.modulate = Color(1, 1, 0.6)
	chico.visible = false
	add_child(chico)
	grande = Label.new()
	grande.position = Vector2(60, 120)
	grande.add_theme_font_size_override("font_size", 28)
	grande.add_theme_color_override("font_outline_color", Color.BLACK)
	grande.add_theme_constant_override("outline_size", 8)
	grande.visible = false
	add_child(grande)

func _process(delta: float) -> void:
	if Input.is_action_just_pressed("medidor"):
		chico.visible = not chico.visible
		grande.visible = false
	if Input.is_action_just_pressed("textura"):
		MaterialPersonaje.ciclar()
		main.call("_avisar", "Texturas: " + MaterialPersonaje.nombre_modo())
	if Input.is_action_just_pressed("grabar"):
		if grabando:
			_terminar()
		else:
			_empezar()
	_acum += delta
	_n += 1
	if _acum >= 0.5:
		_fps_vista = roundi(_n / _acum)
		_acum = 0.0
		_n = 0
	if grabando:
		_t_grab += delta
		_ms.append(delta * 1000.0)
		_llamadas += Performance.get_monitor(Performance.RENDER_TOTAL_DRAW_CALLS_IN_FRAME)
		_tris += Performance.get_monitor(Performance.RENDER_TOTAL_PRIMITIVES_IN_FRAME)
		_fisica_ms += Performance.get_monitor(Performance.TIME_PHYSICS_PROCESS) * 1000.0
		_proceso_ms += Performance.get_monitor(Performance.TIME_PROCESS) * 1000.0
		_muestras += 1
		_persiguen_max = maxi(_persiguen_max, _persiguen())
		if _t_grab >= DURACION:
			_terminar()
	if chico.visible:
		chico.text = "%d fps%s" % [_fps_vista, "   ● GRABANDO %d s" % int(DURACION - _t_grab) if grabando else "   (G = grabar 60 s · M = ocultar)"]
		chico.modulate = Color(0.6, 1, 0.6) if _fps_vista >= 40 else (Color(1, 1, 0.5) if _fps_vista >= 30 else Color(1, 0.5, 0.5))

func _persiguen() -> int:
	var c := 0
	for z in main.get("zombis"):
		if is_instance_valid(z) and z.estado == Zombi.Estado.PERSIGUE:
			c += 1
	return c

func _vivos() -> int:
	var c := 0
	for z in main.get("zombis"):
		if is_instance_valid(z) and z.hp > 0.0:
			c += 1
	return c

func _empezar() -> void:
	grabando = true
	_t_grab = 0.0
	_ms = PackedFloat32Array()
	_llamadas = 0.0; _tris = 0.0; _fisica_ms = 0.0; _proceso_ms = 0.0; _muestras = 0; _persiguen_max = 0
	chico.visible = true
	grande.visible = false
	main.call("_avisar", "Grabando 60 s: juega normal (corre, dispara, deja que te persigan)")

func _terminar() -> void:
	grabando = false
	if _ms.size() < 10:
		return
	var orden := _ms.duplicate()
	orden.sort()
	var total := 0.0
	for v in orden:
		total += v
	var media := total / orden.size()
	var peor1 := 0.0
	var k := maxi(1, int(orden.size() * 0.01))
	for i in k:
		peor1 += orden[orden.size() - 1 - i]
	peor1 /= k
	var sobre33 := 0
	for v in orden:
		if v > 33.4:
			sobre33 += 1
	var vp := get_viewport()
	var t := Time.get_datetime_dict_from_system()
	var txt := "RESUMEN FPS (%d s)\n" % int(_t_grab)
	txt += "fps media: %.0f   (mínimo pedido 30 · sostenido 40 · ideal 60)\n" % (1000.0 / media)
	txt += "1%% peor: %.0f fps (%.1f ms)\n" % [1000.0 / peor1, peor1]
	txt += "peor cuadro: %.1f ms   cuadros >33 ms: %.1f%%\n" % [orden[orden.size() - 1], 100.0 * sobre33 / orden.size()]
	txt += "dibujo medio: %.0f llamadas · %.0f mil triángulos\n" % [_llamadas / _muestras, _tris / _muestras / 1000.0]
	txt += "CPU medio: proceso %.1f ms · física %.1f ms\n" % [_proceso_ms / _muestras, _fisica_ms / _muestras]
	txt += "zombis vivos %d · máx. persiguiendo a la vez %d\n" % [_vivos(), _persiguen_max]
	txt += "texturas: %s · MSAA %s · sombras sí · vsync %s\n" % [MaterialPersonaje.nombre_modo(), ["no", "2x", "4x", "8x"][vp.msaa_3d], ["no", "sí", "adaptativo", "buzón"][DisplayServer.window_get_vsync_mode()]]
	txt += "pantalla %dx%d\n" % [vp.get_visible_rect().size.x, vp.get_visible_rect().size.y]
	txt += "%s · %s · %s %s\n" % [OS.get_processor_name(), RenderingServer.get_video_adapter_name(), OS.get_name(), Engine.get_version_info()["string"]]
	txt += "\n(copiado al portapapeles · pulsa M para cerrar)"
	DisplayServer.clipboard_set(txt)
	var ruta := "user://fps_%04d-%02d-%02d_%02d%02d%02d.txt" % [t["year"], t["month"], t["day"], t["hour"], t["minute"], t["second"]]
	var f := FileAccess.open(ruta, FileAccess.WRITE)
	if f:
		f.store_string(txt)
		f.close()
	grande.text = txt
	grande.visible = true
	chico.visible = false
