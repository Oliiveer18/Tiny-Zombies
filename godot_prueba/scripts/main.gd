extends Node3D
## Escena principal de la prueba de Godot: monta el mundo, el jugador, la cámara, los zombis y una interfaz mínima.
## F3 / Create: panel de depuración (fps, llamadas, triángulos, memoria, estados de los zombis). Enter / Options: reiniciar.

var mundo: Mundo
var jugador: Jugador
var camara: CamaraTiny
var zombis: Array[Zombi] = []
var reticula: Reticula
var texto: Label
var depurar: Label
var aviso: Label
var _aviso_t := 0.0
var _reinicio_t := -1.0

func _ready() -> void:
	mundo = Mundo.new()
	add_child(mundo)
	jugador = Jugador.new()
	jugador.position = Vector3(0.0, 0.05, 0.0)
	add_child(jugador)
	camara = CamaraTiny.new()
	camara.objetivo = jugador
	add_child(camara)
	camara.current = true
	jugador.camara = camara
	jugador.murio.connect(func() -> void: _reinicio_t = 2.5)
	_zombis()
	_interfaz()
	mundo.nav_lista.connect(_nav_lista)

func _zombis() -> void:
	# posiciones y orientaciones repartidas por la aldea; la mayoría duerme
	var lista := [
		[-3.0, -9.0], [3.0, -11.0], [8.5, -4.5], [-9.5, -1.0], [9.0, 8.0],
		[-3.5, 9.0], [0.5, 13.0], [12.0, 0.0], [-12.0, -7.0], [4.0, 5.5]
	]
	for i in lista.size():
		var z := Zombi.new()
		z.objetivo = jugador
		z.position = Vector3(lista[i][0], mundo.altura(lista[i][0], lista[i][1]) + 0.05, lista[i][1])
		add_child(z)
		zombis.append(z)

func _nav_lista() -> void:
	for z in zombis:
		if is_instance_valid(z):
			z.nav_listo = true

func _interfaz() -> void:
	var capa := CanvasLayer.new()
	add_child(capa)
	reticula = Reticula.new()
	reticula.visible = false
	capa.add_child(reticula)
	texto = Label.new()
	texto.position = Vector2(16, 12)
	texto.modulate = Color(1, 1, 1, 0.8)
	capa.add_child(texto)
	aviso = Label.new()
	aviso.position = Vector2(16, 36)
	aviso.modulate = Color(1, 1, 1, 0)
	capa.add_child(aviso)
	Input.joy_connection_changed.connect(_mando_cambio)
	if Entrada.hay_mando():
		_avisar("Mando conectado: %s" % Entrada.nombre_mando())
	depurar = Label.new()
	depurar.position = Vector2(16, 60)
	depurar.modulate = Color(0.6, 1.0, 0.6, 0.9)
	depurar.visible = false
	capa.add_child(depurar)

func _mando_cambio(_id: int, conectado: bool) -> void:
	_avisar("Mando conectado: %s" % Entrada.nombre_mando() if conectado else "Mando desconectado")

func _avisar(msg: String) -> void:
	aviso.text = msg
	_aviso_t = 3.0

func _process(delta: float) -> void:
	if _aviso_t > 0.0:
		_aviso_t -= delta
		aviso.modulate.a = clampf(_aviso_t, 0.0, 1.0) * 0.85
	reticula.visible = jugador.apuntando and not jugador.muerto
	if reticula.visible:
		reticula.position = camara.unproject_position(jugador.punto_apunte)
	texto.text = "%d / %d%s    vida %d" % [jugador.balas, Jugador.CARGADOR, "  (recargando)" if jugador.recargando > 0.0 else "", maxi(0, int(jugador.hp))]
	if Input.is_action_just_pressed("depurar"):
		depurar.visible = not depurar.visible
	if depurar.visible:
		_actualizar_depuracion()
	if Input.is_action_just_pressed("reiniciar"):
		get_tree().reload_current_scene()
	if _reinicio_t > 0.0:
		_reinicio_t -= delta
		if _reinicio_t <= 0.0:
			get_tree().reload_current_scene()

func _actualizar_depuracion() -> void:
	var c := {"dormido": 0, "despertando": 0, "investiga": 0, "persigue": 0, "deambula": 0}
	for z in zombis:
		if is_instance_valid(z):
			match z.estado:
				Zombi.Estado.DORMIDO: c["dormido"] += 1
				Zombi.Estado.DESPERTANDO: c["despertando"] += 1
				Zombi.Estado.INVESTIGA: c["investiga"] += 1
				Zombi.Estado.PERSIGUE: c["persigue"] += 1
				Zombi.Estado.DEAMBULA: c["deambula"] += 1
	depurar.text = "fps %d\nllamadas de dibujo %d · triángulos %d\nmemoria %.0f MB · memoria de vídeo %.0f MB\nzombis: dormidos %d · alerta %d · investigan %d · persiguen %d · deambulan %d\nmalla de navegación: %s · mando: %s" % [
		Engine.get_frames_per_second(),
		int(Performance.get_monitor(Performance.RENDER_TOTAL_DRAW_CALLS_IN_FRAME)),
		int(Performance.get_monitor(Performance.RENDER_TOTAL_PRIMITIVES_IN_FRAME)),
		Performance.get_monitor(Performance.MEMORY_STATIC) / 1048576.0,
		Performance.get_monitor(Performance.RENDER_VIDEO_MEM_USED) / 1048576.0,
		c["dormido"], c["despertando"], c["investiga"], c["persigue"], c["deambula"],
		"lista" if zombis.size() > 0 and zombis[0].nav_listo else "horneando…",
		("%s (en uso)" % Entrada.nombre_mando() if Entrada.con_mando() else ("%s (sin tocar)" % Entrada.nombre_mando() if Entrada.hay_mando() else "no"))]
