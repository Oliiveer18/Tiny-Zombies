class_name Jugador
extends CharacterBody3D
## Protagonista. Movimiento con aceleración y frenada, correr, agacharse, apuntar (ratón o stick), disparo por rayo, recarga, gravedad y pendientes.
## Unidades: el personaje mide 1,0. Velocidades de Three.js (m/s con personaje de 1,4) divididas entre 1,4.

signal murio

const VEL_ANDAR := 1.1
const VEL_CORRER := 2.4
const VEL_AGACHADO := 0.6
const FACTOR_APUNTAR := 0.55
const ACELERACION := 9.0
const FRENADA := 13.0
const GRAVEDAD := 20.0
const CADENCIA := 0.11
const CARGADOR := 30
const T_RECARGA := 1.5
const ALCANCE := 20.0
const DISPERSION := 0.045

var camara: CamaraTiny
var modelo: Modelo3D
var agachado := false
var corre := false
var apuntando := false
var muerto := false
var hp := 100.0
var balas := CARGADOR
var recargando := 0.0
var dir_apunte := Vector3(0, 0, -1)
var punto_apunte := Vector3.ZERO
var velocidad_h := 0.0

var _cd := 0.0
var _t_paso := 0.0
var _yaw := 0.0
var _giro := 0.0
var _acc := 0.0
var _vprev := 0.0
var _lean := 0.0
var _roll := 0.0
var _retro := 0.0
var _cap: CapsuleShape3D
var _col: CollisionShape3D

func _ready() -> void:
	collision_layer = Capas.JUGADOR
	collision_mask = Capas.MUNDO | Capas.MUROS | Capas.ZOMBI | Capas.PROPS
	floor_max_angle = deg_to_rad(50.0)
	floor_snap_length = 0.35
	process_priority = 100  # después de la animación: así las inclinaciones por código van encima
	_cap = CapsuleShape3D.new()
	_cap.radius = 0.22
	_cap.height = 0.95
	_col = CollisionShape3D.new()
	_col.shape = _cap
	_col.position.y = 0.48
	add_child(_col)
	modelo = Modelo3D.new()
	add_child(modelo)
	modelo.cargar("res://modelos/protagonista.glb", "res://datos/clips_humano.json", 1.0)

func _physics_process(delta: float) -> void:
	if muerto:
		return
	_cd = maxf(0.0, _cd - delta)
	_calcular_apunte()
	var m := Entrada.vector_mover()
	apuntando = Entrada.apunta() or Entrada.dispara()
	if Input.is_action_just_pressed("agacharse"):
		_poner_agachado(not agachado)
	corre = Input.is_action_pressed("correr") and not agachado and not apuntando and m.length() > 0.3
	# --- movimiento horizontal con aceleración y frenada ---
	var vel_max := VEL_CORRER if corre else (VEL_AGACHADO if agachado else VEL_ANDAR)
	if apuntando:
		vel_max *= FACTOR_APUNTAR if not corre else 1.0
	var objetivo_v := Vector3(m.x, 0.0, m.y)
	if objetivo_v.length() > 1.0:
		objetivo_v = objetivo_v.normalized()
	objetivo_v *= vel_max
	var hv := Vector3(velocity.x, 0.0, velocity.z)
	var tasa := ACELERACION if objetivo_v.length() > 0.01 else FRENADA
	hv = hv.move_toward(objetivo_v, tasa * delta)
	# --- gravedad y pendientes ---
	if is_on_floor():
		velocity.y = -1.0
	else:
		velocity.y -= GRAVEDAD * delta
	velocity = Vector3(hv.x, velocity.y, hv.z)
	move_and_slide()
	for i in get_slide_collision_count():  # empuja cajas y barriles
		var rb := get_slide_collision(i).get_collider() as RigidBody3D
		if rb != null:
			rb.apply_central_impulse(-get_slide_collision(i).get_normal() * 0.5)
	velocidad_h = Vector2(velocity.x, velocity.z).length()
	# --- ruido de pasos ---
	if velocidad_h > 0.3 and not agachado:
		_t_paso += delta
		if _t_paso > 0.4:
			_t_paso = 0.0
			Ruido.emitir(global_position, Ruido.RADIO_CORRER if corre else Ruido.RADIO_ANDAR)
	# --- orientación: el cuerpo gira suavemente hacia donde se apunta ---
	var yaw_obj := atan2(dir_apunte.x, dir_apunte.z)
	var yaw_nuevo := lerp_angle(_yaw, yaw_obj, 1.0 - exp(-16.0 * delta))
	_giro = angle_difference(_yaw, yaw_nuevo) / maxf(delta, 0.0001)
	_yaw = yaw_nuevo
	modelo.rotation.y = _yaw
	# --- armas ---
	if recargando > 0.0:
		recargando -= delta
		if recargando <= 0.0:
			balas = CARGADOR
			recargando = 0.0
	elif Input.is_action_just_pressed("recargar") and balas < CARGADOR:
		recargando = T_RECARGA
	elif Entrada.dispara() and _cd <= 0.0:
		if balas > 0:
			_disparar()
		else:
			recargando = T_RECARGA
	_animar(hv)

func _poner_agachado(valor: bool) -> void:
	agachado = valor
	_cap.height = 0.6 if agachado else 0.95
	_col.position.y = 0.3 if agachado else 0.48

func _calcular_apunte() -> void:
	var stick := Entrada.vector_apuntar_stick()
	var m := Entrada.vector_mover()
	if stick.length() > 0.25:
		dir_apunte = Vector3(stick.x, 0.0, stick.y).normalized()
	elif Entrada.tactil or Entrada.hay_mando():
		if m.length() > 0.2:
			dir_apunte = Vector3(m.x, 0.0, m.y).normalized()
	elif camara != null:
		var pos_raton := get_viewport().get_mouse_position()
		var origen := camara.project_ray_origin(pos_raton)
		var rayo := camara.project_ray_normal(pos_raton)
		var plano := Plane(Vector3.UP, global_position.y + 0.55)
		var punto = plano.intersects_ray(origen, rayo)
		if punto != null:
			var v: Vector3 = punto - global_position
			v.y = 0.0
			if v.length() > 0.15:
				dir_apunte = v.normalized()
	punto_apunte = global_position + dir_apunte * 4.0 + Vector3(0, 0.55, 0)
	if stick.length() <= 0.25 and not Entrada.tactil and not Entrada.hay_mando() and camara != null:
		var pm := get_viewport().get_mouse_position()
		var plano2 := Plane(Vector3.UP, global_position.y + 0.55)
		var p2 = plano2.intersects_ray(camara.project_ray_origin(pm), camara.project_ray_normal(pm))
		if p2 != null:
			punto_apunte = p2

func _disparar() -> void:
	balas -= 1
	_cd = CADENCIA
	_retro = 1.0
	var dir := dir_apunte
	dir = dir.rotated(Vector3.UP, randf_range(-DISPERSION, DISPERSION) * (0.35 if Entrada.apunta() else 1.0))
	var origen := global_position + Vector3(0, 0.6, 0) + dir * 0.35
	var fin := origen + dir * ALCANCE
	var q := PhysicsRayQueryParameters3D.create(origen, fin, Capas.MUNDO | Capas.MUROS | Capas.ZOMBI | Capas.PROPS)
	q.exclude = [get_rid()]
	var r := get_world_3d().direct_space_state.intersect_ray(q)
	if not r.is_empty():
		fin = r["position"]
		var col = r["collider"]
		if col != null and col.has_method("recibir_disparo"):
			col.recibir_disparo(dir, fin, 1.0)
			Efectos.impacto(fin, r["normal"], true)
		else:
			if col is RigidBody3D:
				(col as RigidBody3D).apply_impulse(dir * 2.2, fin - (col as RigidBody3D).global_position)
			Efectos.impacto(fin, r["normal"], false)
	Efectos.trazador(origen, fin)
	Efectos.fogonazo(origen)
	Ruido.emitir(global_position, Ruido.RADIO_DISPARO)
	if camara != null:
		camara.temblor = 1.0

func _animar(hv: Vector3) -> void:
	var v := hv.length()
	if recargando > 0.0:
		modelo.reproducir("reload", 0.15, 1.0)
	elif apuntando:
		var adel := 0.0
		if v > 0.2:
			adel = hv.normalized().dot(dir_apunte)
		if v < 0.25:
			modelo.reproducir("shoot_side", 0.15, 1.0)
		elif adel < -0.35:
			modelo.reproducir("shoot_back", 0.15, clampf(v / 0.45, 0.6, 2.0))
		else:
			modelo.reproducir("shoot_fwd", 0.15, clampf(v / 0.55, 0.6, 2.0))
	elif v < 0.12:
		modelo.reproducir("idle", 0.25, 1.0)
	elif v < VEL_ANDAR * 1.5:
		modelo.reproducir("walk", 0.2, clampf(v / 0.62, 0.5, 2.2))
	else:
		modelo.reproducir("run", 0.2, clampf(v / 1.48, 0.6, 2.0))

## Capa por código encima de la animación (como en Three.js): inclinación al arrancar/frenar/correr, ladeo al girar, retroceso del arma y agachado.
func _process(delta: float) -> void:
	if modelo == null or modelo.esqueleto == null or muerto:
		return
	var v := velocidad_h
	_acc = lerpf(_acc, (v - _vprev) / maxf(delta, 0.0001), minf(1.0, delta * 5.0))
	_vprev = v
	var sv := clampf(v / VEL_ANDAR, 0.0, 2.5)
	var lean_obj := clampf(_acc * 0.9, -9.0, 9.0) * clampf(sv * 2.0, 0.0, 1.0) + (5.0 if corre else 0.0) * clampf(sv, 0.0, 1.0)
	var roll_obj := clampf(-_giro * 3.2, -9.0, 9.0) * clampf(sv * 1.5, 0.3, 1.0)
	_lean = lerpf(_lean, lean_obj, minf(1.0, delta * 10.0))
	_roll = lerpf(_roll, roll_obj, minf(1.0, delta * 10.0))
	_retro = maxf(0.0, _retro - delta * 10.0)
	var ag := 1.0 if agachado else 0.0
	modelo.sumar("spine", Vector3(_lean * 0.6 - 5.0 * _retro + 12.0 * ag, 0.0, _roll * 0.5))
	modelo.sumar("spine2", Vector3(_lean * 0.4 - 3.5 * _retro + 8.0 * ag, 0.0, _roll * 0.4))
	modelo.sumar("head", Vector3(-_lean * 0.3 - 3.0 * _retro - 10.0 * ag, 0.0, -_roll * 0.3))
	modelo.sumar("leftarm", Vector3(-6.0 * _retro, 0.0, 0.0))
	modelo.sumar("rightarm", Vector3(-8.0 * _retro, 0.0, 0.0))
	modelo.scale.y = lerpf(modelo.scale.y, 0.82 if agachado else 1.0, minf(1.0, delta * 10.0))

func recibir_dano(cantidad: float) -> void:
	if muerto:
		return
	hp -= cantidad
	if hp <= 0.0:
		muerto = true
		modelo.reproducir("die", 0.1, 1.0)
		murio.emit()
