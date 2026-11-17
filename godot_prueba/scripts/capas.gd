class_name Capas
extends RefCounted
## Capas de colisión (máscaras de bits). Los nombres coinciden con los de project.godot.
const MUNDO := 1      # terreno
const JUGADOR := 2
const ZOMBI := 4
const PROPS := 8      # cajas, barriles (se empujan)
const RAGDOLL := 16
const MUROS := 32     # paredes, árboles, vallas: bloquean vista y oído
