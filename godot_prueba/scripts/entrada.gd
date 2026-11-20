extends Node
## Controles (autoload «Entrada»): teclado + ratón, mando (PlayStation por Bluetooth vale: Godot lo reconoce como mando estándar) y táctil.
## Todo se define por código para no depender del editor. Para cambiar teclas, edita _configurar().
## Mando (nombres PlayStation, DualSense/DualShock): stick izq. mover · stick der. apuntar · R2 (o R1) disparar · L2 apuntar fijo · L1 correr (mantener) · L3 correr (fijo, pulsar) · ○ agacharse / deslizar · □ recargar · Options reiniciar · Create depurar.
## Cambia solo entre ratón/teclado y mando según lo último que toques (`usando_mando`). Vibración con `vibrar()`.

var tactil := false
var usando_mando := false   # último dispositivo tocado: mando (true) o teclado/ratón (false)
var correr_fijo := false    # L3 pulsado: sigue corriendo hasta soltar el stick, apuntar o agacharse
var vibracion_activa := true
signal dispositivo_cambiado(mando: bool)
var tactil_mover := Vector2.ZERO
var tactil_apuntar := Vector2.ZERO
var tactil_dispara := false
var _id_izq := -1
var _id_der := -1
var _centro_izq := Vector2.ZERO
var _centro_der := Vector2.ZERO
const RADIO_STICK := 70.0

func _ready() -> void:
	_configurar()

func _accion(nombre: String, zona_muerta: float = 0.2) -> void:
	if not InputMap.has_action(nombre):
		InputMap.add_action(nombre, zona_muerta)

func _tecla(nombre: String, tecla: Key) -> void:
	var ev := InputEventKey.new()
	ev.physical_keycode = tecla
	InputMap.action_add_event(nombre, ev)

func _eje(nombre: String, eje: JoyAxis, signo: float) -> void:
	var ev := InputEventJoypadMotion.new()
	ev.axis = eje
	ev.axis_value = signo
	InputMap.action_add_event(nombre, ev)

func _boton(nombre: String, boton: JoyButton) -> void:
	var ev := InputEventJoypadButton.new()
	ev.button_index = boton
	InputMap.action_add_event(nombre, ev)

func _raton(nombre: String, boton: MouseButton) -> void:
	var ev := InputEventMouseButton.new()
	ev.button_index = boton
	InputMap.action_add_event(nombre, ev)

func _configurar() -> void:
	for a in ["mover_izq", "mover_der", "mover_arr", "mover_abj", "apuntar_izq", "apuntar_der", "apuntar_arr", "apuntar_abj"]:
		_accion(a, 0.25)
	for a in ["disparar", "apuntar"]:
		_accion(a, 0.5)
	for a in ["correr", "correr_fijo", "agacharse", "recargar", "reiniciar", "depurar", "medidor", "grabar", "textura"]:
		_accion(a)
	# Movimiento: WASD / flechas / stick izquierdo
	_tecla("mover_izq", KEY_A); _tecla("mover_izq", KEY_LEFT); _eje("mover_izq", JOY_AXIS_LEFT_X, -1.0)
	_tecla("mover_der", KEY_D); _tecla("mover_der", KEY_RIGHT); _eje("mover_der", JOY_AXIS_LEFT_X, 1.0)
	_tecla("mover_arr", KEY_W); _tecla("mover_arr", KEY_UP); _eje("mover_arr", JOY_AXIS_LEFT_Y, -1.0)
	_tecla("mover_abj", KEY_S); _tecla("mover_abj", KEY_DOWN); _eje("mover_abj", JOY_AXIS_LEFT_Y, 1.0)
	# Apuntar con el stick derecho
	_eje("apuntar_izq", JOY_AXIS_RIGHT_X, -1.0)
	_eje("apuntar_der", JOY_AXIS_RIGHT_X, 1.0)
	_eje("apuntar_arr", JOY_AXIS_RIGHT_Y, -1.0)
	_eje("apuntar_abj", JOY_AXIS_RIGHT_Y, 1.0)
	# Acciones
	_raton("disparar", MOUSE_BUTTON_LEFT); _eje("disparar", JOY_AXIS_TRIGGER_RIGHT, 1.0); _boton("disparar", JOY_BUTTON_RIGHT_SHOULDER)
	_raton("apuntar", MOUSE_BUTTON_RIGHT); _eje("apuntar", JOY_AXIS_TRIGGER_LEFT, 1.0)
	_tecla("correr", KEY_SHIFT); _boton("correr", JOY_BUTTON_LEFT_SHOULDER)
	_boton("correr_fijo", JOY_BUTTON_LEFT_STICK)
	_tecla("agacharse", KEY_C); _tecla("agacharse", KEY_CTRL); _boton("agacharse", JOY_BUTTON_B)
	_tecla("recargar", KEY_R); _boton("recargar", JOY_BUTTON_X)
	_tecla("reiniciar", KEY_ENTER); _boton("reiniciar", JOY_BUTTON_START)
	_tecla("depurar", KEY_F3); _boton("depurar", JOY_BUTTON_BACK)
	_tecla("medidor", KEY_M); _tecla("medidor", KEY_F2)
	_tecla("grabar", KEY_G)
	_tecla("textura", KEY_T); _tecla("textura", KEY_F4)

## Zona muerta circular con reescalado (no salta de 0 a 0,25) y curva suave: el inicio del recorrido es fino y el final llega a 1.
func _stick(v: Vector2, zona: float) -> Vector2:
	var l := v.length()
	if l <= zona:
		return Vector2.ZERO
	var n := minf((l - zona) / (1.0 - zona), 1.0)
	return v / l * pow(n, 1.25)

func vector_mover() -> Vector2:
	if tactil and tactil_mover.length() > 0.05:
		return tactil_mover
	return _stick(Input.get_vector("mover_izq", "mover_der", "mover_arr", "mover_abj", 0.0), 0.18)

func vector_apuntar_stick() -> Vector2:
	var v := _stick(Input.get_vector("apuntar_izq", "apuntar_der", "apuntar_arr", "apuntar_abj", 0.0), 0.2)
	if v.length() < 0.05 and tactil:
		return tactil_apuntar
	return v

func dispara() -> bool:
	return Input.is_action_pressed("disparar") or tactil_dispara

func apunta() -> bool:
	return Input.is_action_pressed("apuntar") or vector_apuntar_stick().length() > 0.25

func hay_mando() -> bool:
	return Input.get_connected_joypads().size() > 0

## ¿Se controla ahora con el mando? (hay uno conectado y es lo último que se ha tocado)
func con_mando() -> bool:
	return usando_mando and hay_mando()

func nombre_mando() -> String:
	var ids := Input.get_connected_joypads()
	return Input.get_joy_name(ids[0]) if ids.size() > 0 else ""

## Vibración (débil = motor agudo, fuerte = motor grave). Solo si se juega con mando.
func vibrar(debil: float, fuerte: float, duracion: float) -> void:
	if not vibracion_activa or not con_mando():
		return
	for id in Input.get_connected_joypads():
		Input.start_joy_vibration(id, clampf(debil, 0.0, 1.0), clampf(fuerte, 0.0, 1.0), duracion)

func _marcar(mando: bool) -> void:
	if usando_mando != mando:
		usando_mando = mando
		dispositivo_cambiado.emit(mando)

## Táctil (iPhone): mitad izquierda de la pantalla = mover, mitad derecha = apuntar y disparar (arrastrar). Sin dibujar sticks todavía.
func _input(evento: InputEvent) -> void:
	if evento is InputEventJoypadButton:
		_marcar(true)
		if evento.pressed and evento.button_index == JOY_BUTTON_LEFT_STICK:
			correr_fijo = not correr_fijo
	elif evento is InputEventJoypadMotion:
		if absf(evento.axis_value) > 0.5:
			_marcar(true)
	elif evento is InputEventKey or evento is InputEventMouseButton:
		_marcar(false)
	elif evento is InputEventMouseMotion and (evento as InputEventMouseMotion).relative.length() > 2.0:
		_marcar(false)
	if evento is InputEventScreenTouch:
		tactil = true
		var mitad := get_viewport().get_visible_rect().size.x * 0.5
		if evento.pressed:
			if evento.position.x < mitad and _id_izq == -1:
				_id_izq = evento.index
				_centro_izq = evento.position
			elif evento.position.x >= mitad and _id_der == -1:
				_id_der = evento.index
				_centro_der = evento.position
		else:
			if evento.index == _id_izq:
				_id_izq = -1
				tactil_mover = Vector2.ZERO
			elif evento.index == _id_der:
				_id_der = -1
				tactil_apuntar = Vector2.ZERO
				tactil_dispara = false
	elif evento is InputEventScreenDrag:
		if evento.index == _id_izq:
			tactil_mover = ((evento.position - _centro_izq) / RADIO_STICK).limit_length(1.0)
		elif evento.index == _id_der:
			tactil_apuntar = ((evento.position - _centro_der) / RADIO_STICK).limit_length(1.0)
			tactil_dispara = tactil_apuntar.length() > 0.25
