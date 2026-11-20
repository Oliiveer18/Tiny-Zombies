class_name Zombi
extends CharacterBody3D
## Zombi normal. Mismos estados que en Three.js (dormido → despertando → investiga | persigue → deambula) pero con:
## · navegación real (NavigationAgent3D sobre una malla de navegación horneada): rodea obstáculos en vez de empujar contra ellos;
## · vista con cono y rayo contra muros, oído con atenuación por muros;
## · altura real del impacto (en Three.js desde arriba la altura era un sorteo);
## · ragdoll con huesos físicos al morir.

signal murio(zombi: Zombi)

enum Estado { DORMIDO, DESPERTANDO, INVESTIGA, PERSIGUE, DEAMBULA, MUERTO }

const USAR_RAGDOLL := true
const VEL_DEAMBULA := 0.3     # el clip de Mixamo recorre 0,24 m/s
const VEL_INVESTIGA := 0.27
const VEL_PERSIGUE := 1.0     # el clip recorre 1,06 m/s
const VISTA := 3.6            # 5 m de Three.js / 1,4
const VISTA_AGACHADO := 0.6
const VISTA_CORRIENDO := 1.6
const GRAVEDAD := 20.0
const DANO := 8.0

var objetivo: Jugador
var estado := Estado.DORMIDO
var hp := 3.0
var nav_listo := false
var modelo: PersonajeMixamo
var agente: NavigationAgent3D
var obj_pos := Vector3.ZERO
var causa := "vista"
var alerta := false
var t_estado := 0.0
var t_desp := 0.9

var _yaw := 0.0
var _vista_t := 0.0
var _sin_ver := 0.0
var _ataque_cd := 0.0
var _nav_t := 0.0
var _ult_dest := Vector3(1e9, 0, 1e9)
var _dest_deambula := Vector3.ZERO
var _pausa := 0.0
var _mira := 0.0
var _tt := 0.0
var _golpe_t := 9.0
var _golpe_dir := Vector3.ZERO
var _golpe_hueso := "spine2"
var _golpe_amp := 16.0
var _encorvado := 0.0

func _ready() -> void:
	add_to_group("zombis")
	collision_layer = Capas.ZOMBI
	collision_mask = Capas.MUNDO | Capas.MUROS | Capas.PROPS | Capas.ZOMBI
	floor_max_angle = deg_to_rad(50.0)
	floor_snap_length = 0.35
	process_priority = 100
	_yaw = randf() * TAU
	var col := CollisionShape3D.new()
	var cap := CapsuleShape3D.new()
	cap.radius = 0.22
	cap.height = 0.95
	col.shape = cap
	col.position.y = 0.48
	add_child(col)
	modelo = PersonajeMixamo.new()
	add_child(modelo)
	modelo.cargar_rig("res://mixamo/zombi_rig.fbx", "res://modelos/zombi.glb", Config.clips_zombi())
	modelo.rotation.y = _yaw
	agente = NavigationAgent3D.new()
	agente.path_desired_distance = 0.4
	agente.target_desired_distance = 0.5
	agente.radius = 0.25
	add_child(agente)
	Ruido.sonido.connect(_oir)
	_vista_t = randf() * 0.2
	_poner_estado(Estado.DORMIDO)

func _poner_estado(e: Estado) -> void:
	estado = e
	t_estado = 0.0
	if e == Estado.PERSIGUE:
		_sin_ver = 0.0
		for z in get_tree().get_nodes_in_group("zombis"):  # contagio: despierta a los dormidos cercanos
			if z != self and z.estado == Estado.DORMIDO and z.global_position.distance_to(global_position) < 3.0:
				z.despertar(obj_pos, "contagio", 0.5)
	elif e == Estado.DEAMBULA:
		_pausa = 1.0
		_dest_deambula = global_position

func despertar(pos: Vector3, motivo: String, factor: float = 1.0) -> void:
	alerta = estado != Estado.DORMIDO
	causa = motivo
	obj_pos = pos
	t_desp = randf_range(0.6, 1.2) * factor * (0.6 if alerta else 1.0)
	_poner_estado(Estado.DESPERTANDO)

# ---------- percepción ----------
func _oir(pos: Vector3, radio: float, _quien: String) -> void:
	if estado == Estado.MUERTO or not is_inside_tree():
		return
	var d := global_position.distance_to(pos)
	if d > radio:
		return
	var n := _muros_entre(pos + Vector3(0, 0.6, 0), global_position + Vector3(0, 0.6, 0))
	if n > 2:
		return
	if d > radio / pow(2.0, n):
		return
	match estado:
		Estado.DORMIDO, Estado.DEAMBULA:
			despertar(pos, "ruido")
		Estado.DESPERTANDO, Estado.INVESTIGA:
			obj_pos = pos

func _muros_entre(a: Vector3, b: Vector3) -> int:
	var n := 0
	var excluir: Array[RID] = []
	var espacio := get_world_3d().direct_space_state
	for i in 3:
		var q := PhysicsRayQueryParameters3D.create(a, b, Capas.MUROS)
		q.exclude = excluir
		var r := espacio.intersect_ray(q)
		if r.is_empty():
			break
		n += 1
		excluir.append(r["rid"])
	return n

func _ve_al_jugador() -> bool:
	if objetivo == null or objetivo.muerto:
		return false
	var d := objetivo.global_position - global_position
	d.y = 0.0
	var alcance := VISTA
	if objetivo.corre:
		alcance *= VISTA_CORRIENDO
	elif objetivo.agachado:
		alcance *= VISTA_AGACHADO
	if d.length() > alcance:
		return false
	var f := Vector3(sin(_yaw), 0.0, cos(_yaw))
	if d.length() > 0.05 and f.dot(d.normalized()) < cos(deg_to_rad(60.0)):
		return false
	var q := PhysicsRayQueryParameters3D.create(global_position + Vector3(0, 0.6, 0), objetivo.global_position + Vector3(0, 0.5, 0), Capas.MUROS)
	return get_world_3d().direct_space_state.intersect_ray(q).is_empty()

func _percibir(delta: float) -> void:
	_vista_t -= delta
	if _vista_t > 0.0:
		return
	_vista_t = 0.2  # 5 veces por segundo
	if not _ve_al_jugador():
		return
	var p := objetivo.global_position
	match estado:
		Estado.DORMIDO:
			despertar(p, "vista")
		Estado.DESPERTANDO:
			obj_pos = p
			causa = "vista"
		Estado.INVESTIGA, Estado.DEAMBULA:
			obj_pos = p
			_poner_estado(Estado.PERSIGUE)
		Estado.PERSIGUE:
			obj_pos = p
			_sin_ver = 0.0

# ---------- movimiento ----------
func _physics_process(delta: float) -> void:
	if estado == Estado.MUERTO:
		return
	t_estado += delta
	_tt += delta
	_ataque_cd = maxf(0.0, _ataque_cd - delta)
	_nav_t -= delta
	_percibir(delta)
	var atacando := false
	match estado:
		Estado.DORMIDO:
			_frenar(delta)
		Estado.DESPERTANDO:
			_frenar(delta)
			_mirar_hacia(obj_pos, delta)
			if t_estado >= t_desp:
				_poner_estado(Estado.INVESTIGA if causa == "ruido" else Estado.PERSIGUE)
		Estado.INVESTIGA:
			if _ir_a(obj_pos, VEL_INVESTIGA, delta) or t_estado > 14.0:
				_poner_estado(Estado.DEAMBULA)
		Estado.PERSIGUE:
			_sin_ver += delta
			var cerca := objetivo != null and not objetivo.muerto and objetivo.global_position.distance_to(global_position) < 0.8 and _sin_ver < 1.0
			if cerca:
				atacando = true
				_frenar(delta)
				_mirar_hacia(objetivo.global_position, delta)
				if _ataque_cd <= 0.0:
					_ataque_cd = 0.9
					objetivo.recibir_dano(DANO)
			else:
				_ir_a(obj_pos, VEL_PERSIGUE, delta)
			if _sin_ver > 8.0:
				_poner_estado(Estado.DEAMBULA)
		Estado.DEAMBULA:
			if _pausa > 0.0:
				_pausa -= delta
				_frenar(delta)
				if _pausa <= 0.0:
					_dest_deambula = obj_pos + Vector3(randf_range(-2.0, 2.0), 0.0, randf_range(-2.0, 2.0))
			elif _ir_a(_dest_deambula, VEL_DEAMBULA, delta):
				_pausa = randf_range(1.0, 2.0)
	_animar(atacando)

func _ir_a(destino: Vector3, vel: float, delta: float) -> bool:
	var d := destino - global_position
	d.y = 0.0
	if d.length() < 0.45:
		_frenar(delta)
		return true
	var siguiente := destino
	if nav_listo:
		if _nav_t <= 0.0 or destino.distance_to(_ult_dest) > 0.4:
			agente.target_position = destino
			_ult_dest = destino
			_nav_t = 0.4
		siguiente = agente.get_next_path_position()
	var dir := siguiente - global_position
	dir.y = 0.0
	if dir.length() < 0.05:
		dir = d
	_mover(dir.normalized(), vel, delta)
	return false

func _mover(dir: Vector3, vel: float, delta: float) -> void:
	var hv := Vector3(velocity.x, 0.0, velocity.z).move_toward(dir * vel, 6.0 * delta)
	velocity = Vector3(hv.x, velocity.y, hv.z)
	_gravedad(delta)
	move_and_slide()
	_yaw = lerp_angle(_yaw, atan2(dir.x, dir.z), 1.0 - exp(-8.0 * delta))
	modelo.rotation.y = _yaw

func _frenar(delta: float) -> void:
	var hv := Vector3(velocity.x, 0.0, velocity.z).move_toward(Vector3.ZERO, 10.0 * delta)
	velocity = Vector3(hv.x, velocity.y, hv.z)
	_gravedad(delta)
	move_and_slide()

func _gravedad(delta: float) -> void:
	if is_on_floor():
		velocity.y = -1.0
	else:
		velocity.y -= GRAVEDAD * delta

func _mirar_hacia(pos: Vector3, delta: float) -> void:
	var d := pos - global_position
	d.y = 0.0
	if d.length() > 0.05:
		_yaw = lerp_angle(_yaw, atan2(d.x, d.z), 1.0 - exp(-8.0 * delta))
		modelo.rotation.y = _yaw

# ---------- animación ----------
func _animar(atacando: bool) -> void:
	var v := Vector2(velocity.x, velocity.z).length()
	var nat_andar: float = maxf(modelo.velocidad_natural.get("andar", 0.24), 0.1)
	var nat_correr: float = maxf(modelo.velocidad_natural.get("correr", 1.06), 0.1)
	match estado:
		Estado.DORMIDO:
			modelo.congelar("morir", 0.0)  # no hay clip de reposo de zombi: primer fotograma de la muerte (de pie) + encorvado por código
		Estado.DESPERTANDO:
			modelo.congelar("morir", 0.0)
		Estado.INVESTIGA, Estado.DEAMBULA:
			if v > 0.06:
				modelo.reproducir("andar", 0.3, clampf(v / nat_andar, 0.5, 2.0))
			else:
				modelo.congelar("morir", 0.0)
		Estado.PERSIGUE:
			if atacando:
				modelo.reproducir("atacar", 0.15, 1.0)
			elif v > 0.1:
				modelo.reproducir("correr", 0.2, clampf(v / nat_correr, 0.5, 2.0))
			else:
				modelo.congelar("morir", 0.0)

## Capa por código: la cabeza busca al jugador o el ruido, barre de lado a lado buscando, y el hueso golpeado cede con un muelle amortiguado.
func _process(delta: float) -> void:
	if estado == Estado.MUERTO or modelo == null or modelo.esqueleto == null:
		return
	if estado != Estado.DORMIDO:
		var destino := obj_pos
		if estado == Estado.PERSIGUE and objetivo != null:
			destino = objetivo.global_position
		var d := destino - global_position
		var m := rad_to_deg(angle_difference(_yaw, atan2(d.x, d.z))) if d.length() > 0.1 else 0.0
		m = clampf(m, -55.0, 55.0)
		if estado == Estado.INVESTIGA or estado == Estado.DEAMBULA:
			m = clampf(m + 26.0 * sin(_tt * 1.7), -60.0, 60.0)
		_mira = lerpf(_mira, m, minf(1.0, delta * 6.0))
		modelo.sumar("neck", Vector3(0.0, _mira * 0.4, 0.0))
		modelo.sumar("head", Vector3(0.0, _mira * 0.6, 0.0))
	var enc := 0.0
	if estado == Estado.DORMIDO:
		enc = 1.0
	elif estado == Estado.DESPERTANDO:
		enc = 1.0 - clampf(t_estado / maxf(t_desp, 0.1), 0.0, 1.0)
	_encorvado = lerpf(_encorvado, enc, minf(1.0, delta * 8.0))
	if _encorvado > 0.02:
		modelo.sumar("spine", Vector3(14.0 * _encorvado, 0.0, 0.0))
		modelo.sumar("spine2", Vector3(12.0 * _encorvado, 0.0, 0.0))
		modelo.sumar("head", Vector3(26.0 * _encorvado, 0.0, 6.0 * _encorvado))
	if _golpe_t < 0.7:
		_golpe_t += delta
		var f := Vector3(sin(_yaw), 0.0, cos(_yaw))
		var adelante := _golpe_dir.dot(f)
		var lateral := _golpe_dir.x * f.z - _golpe_dir.z * f.x
		var a := exp(-_golpe_t * 6.5) * cos(_golpe_t * 24.0) * _golpe_amp
		modelo.sumar(_golpe_hueso, Vector3(adelante * a, 0.0, -lateral * a * 0.6))
		if _golpe_hueso != "spine":
			modelo.sumar("spine", Vector3(adelante * a * 0.35, 0.0, -lateral * a * 0.2))

# ---------- daño ----------
## Lo llama el jugador al disparar. `punto` es el punto real del impacto: su altura decide la zona.
func recibir_disparo(dir: Vector3, punto: Vector3, dano: float) -> void:
	if estado == Estado.MUERTO:
		return
	hp -= dano
	var dy := punto.y - global_position.y
	var lat := (punto - global_position).cross(dir).y
	if dy > 0.78:
		_golpe_hueso = "head"
		_golpe_amp = 30.0
	elif dy > 0.42:
		_golpe_hueso = "spine2"
		_golpe_amp = 20.0 if absf(lat) > 0.12 else 16.0
	else:
		_golpe_hueso = "hips"
		_golpe_amp = 14.0
	_golpe_t = 0.0
	_golpe_dir = dir
	velocity += dir * 0.6
	if hp <= 0.0:
		morir(dir)
	elif estado != Estado.PERSIGUE and objetivo != null:
		obj_pos = objetivo.global_position
		_poner_estado(Estado.PERSIGUE)

func morir(dir: Vector3) -> void:
	estado = Estado.MUERTO
	remove_from_group("zombis")
	collision_layer = 0
	collision_mask = 0
	set_physics_process(false)
	if USAR_RAGDOLL:
		modelo.activar_ragdoll(dir * 2.4 + Vector3.UP * 0.8)
	else:
		modelo.reproducir("die", 0.1, 1.0)
	murio.emit(self)
