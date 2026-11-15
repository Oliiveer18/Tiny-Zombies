# COORDINACIÓN · dos chats, un repositorio

El usuario trabaja con DOS chats distintos que no se ven entre sí: uno con **Sonnet** (escribe el código) y otro con **Fable 5.2** (diseña y revisa). Todo lo que uno necesite saber del otro está escrito AQUÍ. El usuario es el mensajero y solo dice una frase corta, por ejemplo: «lee CLAUDE.md y haz la petición 003».

## Reparto
- **Sonnet:** implementa subpasos, actualiza `docs/CONTINUAR.md` y `REGISTRO.md` al terminar cada uno, redacta las peticiones para Fable.
- **Fable:** escribe documentos (diseños técnicos, revisiones, simuladores de equilibrio). **No edita código.** Una petición = una sesión = un archivo en `RESPUESTAS_FABLE/`.
- **Usuario:** decide, prueba en el móvil y pone capturas de `?debug` en `mediciones/`.

## Ramas (forma única de entrega 💡: ramas en GitHub; el ZIP solo si el usuario lo pide)
- `main`: siempre compila (lo comprueba `.github/workflows/build.yml`).
- `sonnet/<subpaso>`: trabajo de código; se fusiona a `main` solo si compila y el usuario mide bien en el móvil.
- `fable/<tema>`: solo documentos; se fusionan sin problema.

## Reglas para Fable (ahorrar tokens)
1. Leer SOLO lo que dice la petición (normalmente `CLAUDE.md`, `docs/CONTINUAR.md` y 1-2 secciones de `docs/DISENO.md`). No explorar todo el repositorio.
2. Entregar un único archivo en `RESPUESTAS_FABLE/NNN_titulo.md`, con la longitud máxima que pida la petición, y marcar la petición como HECHA en `PETICIONES_FABLE.md`.
3. Si falta información, escribirlo como pregunta al principio de la respuesta, sin inventar.
4. Mantener las normas de `CLAUDE.md` (semilla, determinismo, rendimiento en móvil, Oli y Lali no existen).

## Cuándo entra Fable (solo en puntos de alto valor)
Antes de A1 y A2 (diseño técnico del mundo por regiones, semilla y guardado) · antes de C (simulador de equilibrio) · al cerrar cada hito A, B y C (revisión de determinismo, rendimiento y riesgos) · cuando Sonnet se atasque en un error tras dos intentos. Estimado: 8-12 sesiones en todo el proyecto.

## Formato de petición (copiar en `PETICIONES_FABLE.md`)
```
### NNN · Título · estado: PENDIENTE | HECHA
- Objetivo:
- Leer (archivos y secciones exactas):
- Entregar: RESPUESTAS_FABLE/NNN_titulo.md, máximo N páginas, con estas secciones:
- Criterio de éxito (cifras o comprobaciones):
- Fuera de alcance:
```
