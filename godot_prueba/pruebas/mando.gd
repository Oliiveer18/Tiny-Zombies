extends SceneTree
## Prueba de mando sin mando físico: inyecta eventos de DualSense (mismos índices que SDL) y comprueba las acciones.
func _init() -> void:
	await process_frame
	var E = root.get_node("Entrada")
	var ok := true
	var mov := func(eje: int, v: float):
		var e := InputEventJoypadMotion.new(); e.device = 0; e.axis = eje; e.axis_value = v
		Input.parse_input_event(e); await process_frame
	var bot := func(b: int, p: bool):
		var e := InputEventJoypadButton.new(); e.device = 0; e.button_index = b; e.pressed = p
		Input.parse_input_event(e); await process_frame
	await mov.call(JOY_AXIS_LEFT_X, 0.1)
	print("[mando] stick izq 0,10 (zona muerta) -> ", E.vector_mover(), " (esperado 0)")
	ok = ok and E.vector_mover() == Vector2.ZERO
	await mov.call(JOY_AXIS_LEFT_X, 0.5)
	print("[mando] stick izq 0,50 -> ", E.vector_mover())
	ok = ok and E.vector_mover().x > 0.1 and E.vector_mover().x < 0.5
	await mov.call(JOY_AXIS_LEFT_X, 1.0)
	print("[mando] stick izq 1,00 -> ", E.vector_mover())
	ok = ok and absf(E.vector_mover().x - 1.0) < 0.01
	await mov.call(JOY_AXIS_RIGHT_Y, -0.9)
	print("[mando] stick der arriba -> ", E.vector_apuntar_stick(), " apunta=", E.apunta())
	ok = ok and E.apunta() and E.vector_apuntar_stick().y < -0.5
	await mov.call(JOY_AXIS_RIGHT_Y, 0.0)
	await mov.call(JOY_AXIS_TRIGGER_RIGHT, 0.3)
	print("[mando] R2 a 30% dispara=", E.dispara(), " (esperado false)")
	ok = ok and not E.dispara()
	await mov.call(JOY_AXIS_TRIGGER_RIGHT, 0.8)
	print("[mando] R2 a 80% dispara=", E.dispara(), " (esperado true)")
	ok = ok and E.dispara()
	await mov.call(JOY_AXIS_TRIGGER_RIGHT, 0.0)
	await mov.call(JOY_AXIS_TRIGGER_LEFT, 0.9)
	print("[mando] L2 apunta=", E.apunta())
	ok = ok and E.apunta()
	await mov.call(JOY_AXIS_TRIGGER_LEFT, 0.0)
	await bot.call(JOY_BUTTON_LEFT_SHOULDER, true)
	print("[mando] L1 correr=", Input.is_action_pressed("correr"))
	ok = ok and Input.is_action_pressed("correr")
	await bot.call(JOY_BUTTON_LEFT_SHOULDER, false)
	await bot.call(JOY_BUTTON_LEFT_STICK, true); await bot.call(JOY_BUTTON_LEFT_STICK, false)
	print("[mando] L3 correr_fijo=", E.correr_fijo, " usando_mando=", E.usando_mando)
	ok = ok and E.correr_fijo and E.usando_mando
	await bot.call(JOY_BUTTON_B, true)
	print("[mando] ○ agacharse=", Input.is_action_pressed("agacharse")); ok = ok and Input.is_action_pressed("agacharse")
	await bot.call(JOY_BUTTON_B, false)
	await bot.call(JOY_BUTTON_X, true)
	print("[mando] □ recargar=", Input.is_action_pressed("recargar")); ok = ok and Input.is_action_pressed("recargar")
	await bot.call(JOY_BUTTON_X, false)
	var k := InputEventKey.new(); k.physical_keycode = KEY_W; k.pressed = true; Input.parse_input_event(k); await process_frame
	print("[mando] tras pulsar una tecla usando_mando=", E.usando_mando, " (esperado false)"); ok = ok and not E.usando_mando
	E.vibrar(1, 1, 0.1)
	print("[mando] vibrar() sin mando conectado: sin error")
	print("[mando] RESULTADO: ", "OK" if ok else "FALLO")
	quit()
