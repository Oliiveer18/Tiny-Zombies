class_name Mundo
extends Node3D
## Escenario de prueba, todo construido por código (sin recursos externos): terreno con colinas y colisión, aldea con casas y vallas,
## árboles y arbustos (MultiMesh), cajas y barriles que se empujan, un coche, una rampa y una malla de navegación horneada.
## Unidades: el personaje mide 1,0. Estilo mate de colores apagados; sin niebla.

signal nav_lista

const N := 81                 # vértices por lado del terreno (80 × 80 unidades)
var ruido := FastNoiseLite.new()
var region: NavigationRegion3D

func _ready() -> void:
	ruido.seed = 7
	ruido.noise_type = FastNoiseLite.TYPE_SIMPLEX_SMOOTH
	ruido.frequency = 0.035
	region = NavigationRegion3D.new()
	add_child(region)
	_entorno()
	_terreno()
	_aldea()
	_vegetacion()
	_props()
	_hornear_nav()

## Altura del terreno en (x, z): llano en la aldea (radio 11), colinas fuera y una loma con pendiente al oeste.
func altura(x: float, z: float) -> float:
	var r := Vector2(x, z).length()
	var f := smoothstep(11.0, 22.0, r)
	var h := ruido.get_noise_2d(x, z) * 2.2 * f
	var d2 := (x + 24.0) * (x + 24.0) + (z - 10.0) * (z - 10.0)
	h += 2.6 * exp(-d2 / 70.0)
	return h

func _mat(color: Color, rugosidad: float = 1.0) -> StandardMaterial3D:
	var m := StandardMaterial3D.new()
	m.albedo_color = color
	m.roughness = rugosidad
	return m

func _entorno() -> void:
	var env := Environment.new()
	env.background_mode = Environment.BG_COLOR
	env.background_color = Color(0.07, 0.09, 0.14)
	env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.ambient_light_color = Color(0.45, 0.52, 0.68)
	env.ambient_light_energy = 0.8
	env.tonemap_mode = Environment.TONE_MAPPER_FILMIC
	env.tonemap_exposure = 0.95
	var we := WorldEnvironment.new()
	we.environment = env
	add_child(we)
	var sol := DirectionalLight3D.new()
	sol.rotation_degrees = Vector3(-52.0, -35.0, 0.0)
	sol.light_color = Color(1.0, 0.85, 0.65)
	sol.light_energy = 1.25
	sol.shadow_enabled = true
	sol.directional_shadow_mode = DirectionalLight3D.SHADOW_ORTHOGONAL
	sol.directional_shadow_max_distance = 30.0
	sol.shadow_bias = 0.05
	sol.shadow_normal_bias = 1.0
	add_child(sol)

# ---------- terreno ----------
func _terreno() -> void:
	var datos := PackedFloat32Array()
	datos.resize(N * N)
	var med := (N - 1) * 0.5
	for j in N:
		for i in N:
			datos[j * N + i] = altura(i - med, j - med)
	var st := SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	for j in N - 1:
		for i in N - 1:
			for k in [Vector2i(i, j), Vector2i(i + 1, j), Vector2i(i + 1, j + 1), Vector2i(i, j), Vector2i(i + 1, j + 1), Vector2i(i, j + 1)]:
				_vertice(st, k.x, k.y, med, datos)
	var mi := MeshInstance3D.new()
	mi.mesh = st.commit()
	var mat := _mat(Color.WHITE)
	mat.vertex_color_use_as_albedo = true
	mi.material_override = mat
	region.add_child(mi)
	var cuerpo := StaticBody3D.new()
	cuerpo.collision_layer = Capas.MUNDO
	cuerpo.collision_mask = 0
	var cs := CollisionShape3D.new()
	var hs := HeightMapShape3D.new()
	hs.map_width = N
	hs.map_depth = N
	hs.map_data = datos
	cs.shape = hs
	cuerpo.add_child(cs)
	region.add_child(cuerpo)

func _vertice(st: SurfaceTool, i: int, j: int, med: float, datos: PackedFloat32Array) -> void:
	var h := datos[j * N + i]
	var hx0 := datos[j * N + maxi(i - 1, 0)]
	var hx1 := datos[j * N + mini(i + 1, N - 1)]
	var hz0 := datos[maxi(j - 1, 0) * N + i]
	var hz1 := datos[mini(j + 1, N - 1) * N + i]
	var n := Vector3(hx0 - hx1, 2.0, hz0 - hz1).normalized()
	var x := i - med
	var z := j - med
	var t := clampf(ruido.get_noise_2d(i * 3.1, j * 3.1) * 0.5 + 0.5, 0.0, 1.0)
	var col := Color(0.28, 0.34, 0.2).lerp(Color(0.4, 0.38, 0.24), t)
	if Vector2(x, z).length() < 11.0:
		col = Color(0.36, 0.33, 0.28).lerp(Color(0.3, 0.28, 0.25), t)   # tierra pisada en la aldea
	elif n.y < 0.9:
		col = col.lerp(Color(0.36, 0.28, 0.2), clampf((0.9 - n.y) * 6.0, 0.0, 1.0))  # tierra en las pendientes
	st.set_normal(n)
	st.set_color(col)
	st.add_vertex(Vector3(x, h, z))

# ---------- construcciones ----------
func _caja(pos: Vector3, tam: Vector3, color: Color, capa: int = Capas.MUROS) -> StaticBody3D:
	var b := StaticBody3D.new()
	b.position = pos
	b.collision_layer = capa
	b.collision_mask = 0
	var mi := MeshInstance3D.new()
	var bm := BoxMesh.new()
	bm.size = tam
	mi.mesh = bm
	mi.material_override = _mat(color)
	b.add_child(mi)
	var cs := CollisionShape3D.new()
	var bs := BoxShape3D.new()
	bs.size = tam
	cs.shape = bs
	b.add_child(cs)
	region.add_child(b)
	return b

func _casa(cx: float, cz: float, ancho: float, fondo: float, color: Color, alto: float = 1.7, puerta: float = 0.8) -> void:
	var g := 0.12
	_caja(Vector3(cx, alto * 0.5, cz - fondo * 0.5), Vector3(ancho, alto, g), color)
	_caja(Vector3(cx - ancho * 0.5, alto * 0.5, cz), Vector3(g, alto, fondo), color)
	_caja(Vector3(cx + ancho * 0.5, alto * 0.5, cz), Vector3(g, alto, fondo), color)
	var lado := (ancho - puerta) * 0.5
	_caja(Vector3(cx - puerta * 0.5 - lado * 0.5, alto * 0.5, cz + fondo * 0.5), Vector3(lado, alto, g), color)
	_caja(Vector3(cx + puerta * 0.5 + lado * 0.5, alto * 0.5, cz + fondo * 0.5), Vector3(lado, alto, g), color)
	_caja(Vector3(cx, 0.03, cz), Vector3(ancho - 0.2, 0.06, fondo - 0.2), color.darkened(0.35), 0)  # suelo, sin colisión

func _aldea() -> void:
	_casa(-6.5, -5.0, 5.0, 4.0, Color(0.55, 0.5, 0.42))
	_casa(5.5, -7.5, 4.0, 4.5, Color(0.5, 0.45, 0.4))
	_casa(7.0, 3.5, 3.5, 3.5, Color(0.45, 0.42, 0.38))
	_casa(-7.0, 6.0, 4.5, 3.5, Color(0.5, 0.47, 0.38))
	# vallas
	for i in 7:
		_caja(Vector3(-2.5 + i * 0.7, 0.3, 3.8), Vector3(0.6, 0.6, 0.06), Color(0.42, 0.3, 0.2))
	for i in 5:
		_caja(Vector3(2.2, 0.3, -2.5 + i * 0.7), Vector3(0.06, 0.6, 0.6), Color(0.42, 0.3, 0.2))
	# coche abandonado
	_caja(Vector3(1.5, 0.28, 0.5), Vector3(1.8, 0.45, 0.8), Color(0.32, 0.36, 0.4))
	_caja(Vector3(1.4, 0.65, 0.5), Vector3(1.0, 0.3, 0.7), Color(0.28, 0.32, 0.36))
	# rampa con plataforma (para probar pendientes y gravedad)
	var gy := altura(-14.0, 6.0)
	var rampa := _caja(Vector3(-14.0, gy + 0.55, 5.0), Vector3(2.2, 0.15, 4.2), Color(0.4, 0.36, 0.3), Capas.MUNDO)
	rampa.rotation_degrees.x = -14.0
	_caja(Vector3(-14.0, gy + 1.05, 8.4), Vector3(2.6, 0.2, 2.6), Color(0.4, 0.36, 0.3), Capas.MUNDO)
	# farolas
	for p in [Vector3(-2.0, 0.0, -2.0), Vector3(3.5, 0.0, 6.5)]:
		_caja(p + Vector3(0, 0.9, 0), Vector3(0.08, 1.8, 0.08), Color(0.18, 0.2, 0.22))
		var luz := OmniLight3D.new()
		luz.position = p + Vector3(0, 1.75, 0)
		luz.light_color = Color(1.0, 0.7, 0.4)
		luz.light_energy = 1.6
		luz.omni_range = 5.5
		add_child(luz)

# ---------- vegetación ----------
func _vegetacion() -> void:
	var rng := RandomNumberGenerator.new()
	rng.seed = 11
	var pos: Array[Vector3] = []
	var intentos := 0
	while pos.size() < 90 and intentos < 2000:
		intentos += 1
		var x := rng.randf_range(-38.0, 38.0)
		var z := rng.randf_range(-38.0, 38.0)
		if Vector2(x, z).length() < 15.0:
			continue
		if Vector2(x + 14.0, z - 6.0).length() < 4.0:
			continue
		pos.append(Vector3(x, altura(x, z), z))
	var troncos := _multimalla(CylinderMesh.new(), pos.size())
	var copas := _multimalla(CylinderMesh.new(), pos.size())
	(troncos.mesh as CylinderMesh).top_radius = 0.05
	(troncos.mesh as CylinderMesh).bottom_radius = 0.08
	(troncos.mesh as CylinderMesh).height = 0.9
	(copas.mesh as CylinderMesh).top_radius = 0.0
	(copas.mesh as CylinderMesh).bottom_radius = 0.55
	(copas.mesh as CylinderMesh).height = 1.5
	for i in pos.size():
		var s := rng.randf_range(0.8, 1.35)
		troncos.set_instance_transform(i, Transform3D(Basis.from_scale(Vector3(s, s, s)), pos[i] + Vector3(0, 0.45 * s, 0)))
		troncos.set_instance_color(i, Color(0.28, 0.2, 0.14))
		copas.set_instance_transform(i, Transform3D(Basis.from_scale(Vector3(s, s, s)), pos[i] + Vector3(0, 1.45 * s, 0)))
		copas.set_instance_color(i, Color(0.16, 0.3, 0.17).lerp(Color(0.24, 0.34, 0.15), rng.randf()))
		var cuerpo := StaticBody3D.new()
		cuerpo.position = pos[i] + Vector3(0, 0.6, 0)
		cuerpo.collision_layer = Capas.MUROS
		cuerpo.collision_mask = 0
		var cs := CollisionShape3D.new()
		var cil := CylinderShape3D.new()
		cil.radius = 0.12
		cil.height = 1.2
		cs.shape = cil
		cuerpo.add_child(cs)
		region.add_child(cuerpo)
	_instancias(troncos)
	_instancias(copas)
	# arbustos (sin colisión)
	var arbustos := _multimalla(SphereMesh.new(), 70)
	(arbustos.mesh as SphereMesh).radius = 0.28
	(arbustos.mesh as SphereMesh).height = 0.44
	for i in 70:
		var x := rng.randf_range(-38.0, 38.0)
		var z := rng.randf_range(-38.0, 38.0)
		if Vector2(x, z).length() < 12.0:
			x += 14.0
		arbustos.set_instance_transform(i, Transform3D(Basis.from_scale(Vector3(rng.randf_range(0.8, 1.4), 1.0, rng.randf_range(0.8, 1.4))), Vector3(x, altura(x, z) + 0.12, z)))
		arbustos.set_instance_color(i, Color(0.22, 0.32, 0.16).lerp(Color(0.3, 0.34, 0.2), rng.randf()))
	_instancias(arbustos)

func _multimalla(malla: Mesh, cuantos: int) -> MultiMesh:
	var mm := MultiMesh.new()
	mm.transform_format = MultiMesh.TRANSFORM_3D
	mm.use_colors = true
	mm.mesh = malla
	mm.instance_count = cuantos
	return mm

func _instancias(mm: MultiMesh) -> void:
	var mmi := MultiMeshInstance3D.new()
	mmi.multimesh = mm
	var mat := _mat(Color.WHITE)
	mat.vertex_color_use_as_albedo = true
	mmi.material_override = mat
	add_child(mmi)

# ---------- objetos con física ----------
func _cuerpo_fisico(pos: Vector3, forma: Shape3D, malla: Mesh, color: Color, masa: float) -> void:
	var rb := RigidBody3D.new()
	rb.position = pos
	rb.mass = masa
	rb.collision_layer = Capas.PROPS
	rb.collision_mask = Capas.MUNDO | Capas.MUROS | Capas.PROPS | Capas.JUGADOR | Capas.ZOMBI
	var pm := PhysicsMaterial.new()
	pm.friction = 0.8
	pm.bounce = 0.05
	rb.physics_material_override = pm
	var mi := MeshInstance3D.new()
	mi.mesh = malla
	mi.material_override = _mat(color)
	rb.add_child(mi)
	var cs := CollisionShape3D.new()
	cs.shape = forma
	rb.add_child(cs)
	add_child(rb)

func _props() -> void:
	for p in [Vector3(-2.2, 0.3, -6.5), Vector3(-1.4, 0.3, -6.7), Vector3(-1.8, 0.85, -6.6), Vector3(3.0, 0.3, 1.8), Vector3(-3.5, 0.3, 2.0), Vector3(8.0, 0.3, -2.0), Vector3(0.5, 0.3, 8.0)]:
		var bs := BoxShape3D.new()
		bs.size = Vector3(0.6, 0.6, 0.6)
		var bm := BoxMesh.new()
		bm.size = bs.size
		_cuerpo_fisico(p, bs, bm, Color(0.5, 0.38, 0.24), 10.0)
	for p in [Vector3(-4.0, 0.35, 0.0), Vector3(-4.6, 0.35, 0.5), Vector3(4.5, 0.35, 5.5), Vector3(9.0, 0.35, 8.0)]:
		var cil := CylinderShape3D.new()
		cil.radius = 0.28
		cil.height = 0.7
		var cm := CylinderMesh.new()
		cm.top_radius = 0.28
		cm.bottom_radius = 0.28
		cm.height = 0.7
		_cuerpo_fisico(p, cil, cm, Color(0.55, 0.22, 0.14), 14.0)

# ---------- navegación ----------
func _hornear_nav() -> void:
	var nm := NavigationMesh.new()
	nm.agent_radius = 0.3
	nm.agent_height = 1.0
	nm.agent_max_climb = 0.3
	nm.agent_max_slope = 45.0
	nm.cell_size = 0.25
	nm.cell_height = 0.2
	region.navigation_mesh = nm
	region.bake_finished.connect(func() -> void: nav_lista.emit())
	region.bake_navigation_mesh(true)
