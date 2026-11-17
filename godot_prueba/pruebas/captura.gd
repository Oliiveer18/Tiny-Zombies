extends Node
## Banco de pruebas SIN intervención humana: arranca la escena, simula entradas y guarda capturas PNG.
## Uso: godot --path godot_prueba --rendering-driver opengl3 res://pruebas/captura.tscn -- <carpeta_salida> [guion]
## Se usa para comprobar el resultado de verdad en un entorno sin pantalla (Xvfb + OpenGL por software).
var principal: Node
var salida := "/tmp/capturas"
var n := 0

func _ready() -> void:
	var args := OS.get_cmdline_user_args()
	if args.size() > 0:
		salida = args[0]
	DirAccess.make_dir_recursive_absolute(salida)
	principal = (load("res://escenas/principal.tscn") as PackedScene).instantiate()
	add_child(principal)
	var guion := args[1] if args.size() > 1 else "basico"
	await get_tree().create_timer(1.0).timeout
	await call("guion_" + guion)
	get_tree().quit()

func esperar(seg: float) -> void:
	await get_tree().create_timer(seg).timeout

func foto(nombre: String) -> void:
	await RenderingServer.frame_post_draw
	var img := get_viewport().get_texture().get_image()
	img.save_png("%s/%02d_%s.png" % [salida, n, nombre])
	n += 1

func guion_basico() -> void:
	await foto("inicio")
	Input.action_press("mover_der", 1.0)
	await esperar(2.0)
	await foto("andando")
	Input.action_press("correr")
	await esperar(1.5)
	await foto("corriendo")
	Input.action_release("correr")
	Input.action_release("mover_der")
	Input.action_press("apuntar_arr", 1.0)
	await esperar(0.6)
	Input.action_press("disparar")
	await esperar(0.5)
	await foto("disparando")
	Input.action_release("disparar")
	await esperar(0.4)
	Input.action_press("recargar")
	await esperar(0.1)
	Input.action_release("recargar")
	await esperar(0.7)
	await foto("recargando")

## Pruebas de IA y combate: acerca al jugador a los zombis, dispara y comprueba estados, reacciones y ragdoll.
func zombi_cercano() -> Zombi:
	var jug: Jugador = principal.jugador
	var mejor: Zombi = null
	for z in principal.zombis:
		if is_instance_valid(z) and z.estado != Zombi.Estado.MUERTO:
			if mejor == null or z.global_position.distance_to(jug.global_position) < mejor.global_position.distance_to(jug.global_position):
				mejor = z
	return mejor

func apuntar_hacia(pos: Vector3) -> void:
	var jug: Jugador = principal.jugador
	var d := pos - jug.global_position
	d.y = 0
	d = d.normalized()
	for a in ["apuntar_izq", "apuntar_der", "apuntar_arr", "apuntar_abj"]:
		Input.action_release(a)
	if d.x < 0: Input.action_press("apuntar_izq", -d.x)
	else: Input.action_press("apuntar_der", d.x)
	if d.z < 0: Input.action_press("apuntar_arr", -d.z)
	else: Input.action_press("apuntar_abj", d.z)

func estados() -> String:
	var s := []
	for z in principal.zombis:
		if is_instance_valid(z):
			s.append(Zombi.Estado.keys()[z.estado].substr(0, 4))
	return " ".join(s)

func guion_zombis() -> void:
	var jug: Jugador = principal.jugador
	await esperar(1.5)  # deja hornear la navegación
	var z := zombi_cercano()
	jug.global_position = z.global_position + Vector3(2.2, 0.1, 2.2)
	await esperar(0.5)
	print("[prueba] zombi objetivo ", z.name, " nav_listo=", z.nav_listo, " estados: ", estados())
	apuntar_hacia(z.global_position)
	await esperar(0.4)
	await foto("antes")
	Input.action_press("disparar")
	await esperar(0.35)
	print("[prueba] tras disparos: hp=", z.hp, " estado=", Zombi.Estado.keys()[z.estado], " balas=", jug.balas, " | ", estados())
	await foto("impacto")
	await esperar(0.5)
	apuntar_hacia(z.global_position)
	await foto("reaccion")
	await esperar(1.5)
	print("[prueba] estado final zombi: ", Zombi.Estado.keys()[z.estado], " ragdoll=", z.modelo.ragdoll_activo, " | ", estados())
	await foto("despues")
	Input.action_release("disparar")
	await esperar(2.5)
	await foto("ragdoll")
	print("[prueba] fin; hp jugador=", jug.hp)
