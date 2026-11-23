# Mockup — Propuesta B: Plataforma para la red Keralty

Mockup navegable para mostrar cómo funcionaría la plataforma descrita en la [Propuesta B](../docs/PROPUESTAS.md#6-propuesta-b--plataforma-para-la-red-keralty). Es una maqueta para presentar la idea: **no procesa documentos reales ni se conecta a correo, IA o Imperium**. Todo funciona con datos ficticios.

## Mockup navegable (ya construido)

Maqueta de la plataforma de triaje asistido de tutelas para la red de clínicas. **No procesa documentos reales ni se conecta a correo, IA o Imperium.** Todo funciona en el navegador con datos ficticios.

## Cómo abrirlo

Abre `index.html` con doble clic (Chrome, Edge o Firefox). No necesita instalación ni servidor. La tipografía (Figtree) se descarga de Google Fonts; sin internet se usa una fuente de respaldo.

## Cómo recorrerlo

Abajo hay una **barra de recorrido guiado** de 7 pasos con botones *Anterior* y *Siguiente*. Cada paso cambia de rol y de pantalla automáticamente:

1. Inicio de sesión: clínica y rol.
2. Bandeja ordenada por urgencia (rol Operativo).
3. Detalle del caso T-0412: evidencia resaltada, regla aplicada y confirmación.
4. Líder de área: el caso confirmado aparece en *Mis casos*.
5. Revisión en GRIS: caso duplicado comparado lado a lado.
6. Administrador de clínica: tabla de reglas y umbral editable.
7. Administrador de red: indicadores consolidados, sin casos individuales.

También se puede entrar con cualquier rol desde el inicio de sesión. El botón **Reiniciar demo** devuelve todo al estado inicial. **Ocultar notas** quita los recuadros «Qué mirar», y **A− / A+** cambia el tamaño del texto.

## Pantallas incluidas

Inicio de sesión · Bandeja de casos · Detalle del caso · Revisión en GRIS · Mis casos · Configuración de la clínica · Usuarios y roles · Indicadores de la clínica · Vista de la red · Auditoría · Notificaciones.

## Archivos

| Archivo | Contenido |
|---|---|
| `index.html` | Página única |
| `css/styles.css` | Estilo inspirado en keralty.com (Figtree, azul `#002F87`, verde `#008767`, tarjetas redondeadas, botones tipo píldora) |
| `js/app.js` | Pantallas, roles, recorrido guiado y acciones |
| `data/data.js` | Casos, reglas, áreas, usuarios e indicadores ficticios |

## Datos

- 3 clínicas ficticias, 18 casos de ejemplo (14 en la clínica principal).
- Cubren los seis tipos de actuación y los cuatro colores del semáforo, un duplicado, una competencia dudosa, un texto ilegible y un plazo vencido.
- No hay nombres reales de personas, pacientes ni despachos. No se incluye el logo de Keralty.
- Las reglas (R03–R12) son **ilustrativas**; las oficiales se validan con Jurídica.
- Los cambios que haces en la demo se guardan en el navegador (localStorage) hasta que pulses *Reiniciar demo*.

---

# Especificación del mockup

## Objetivo de la demo

Mostrar en pocos minutos que:

1. Un caso entra, se extrae y se clasifica solo, **con la evidencia del documento a la vista**.
2. La persona revisa, confirma o corrige, y el caso llega al área responsable.
3. Cada clínica ve solo sus casos y configura sus propias reglas.
4. La red tiene una vista consolidada de indicadores.

## Pantallas

| # | Pantalla | Rol principal | Qué debe mostrar |
|---|---|---|---|
| 1 | Inicio de sesión | Todos | Ingreso y selección de clínica según los permisos del usuario |
| 2 | Bandeja de casos | Operativo, Jurídica | Cola ordenada por urgencia: semáforo, horas restantes, tipo de actuación, área sugerida, estado. Filtros por color, área y estado. |
| 3 | Detalle del caso | Operativo, Jurídica | Documento con los fragmentos de evidencia resaltados; campos extraídos; resumen en lenguaje claro; semáforo en dos ejes (jurídico y clínico) con la regla aplicada; área sugerida; acciones: confirmar, corregir, reasignar; historial del caso |
| 4 | Revisión de casos en GRIS | Operativo, Jurídica | Motivo (competencia dudosa, posible duplicado, texto incompleto) y comparación lado a lado con el caso relacionado |
| 5 | Mis casos | Líder de área | Casos asignados a su área, con plazo y estado; marcar avance o respuesta enviada |
| 6 | Configuración de la clínica | Administrador de clínica | Áreas y responsables, tabla de reglas (condición → salida), umbrales del semáforo |
| 7 | Usuarios y roles | Administrador de clínica | Alta de usuarios y asignación de roles |
| 8 | Indicadores de la clínica | Jurídica, administrador | Casos por color, horas restantes, carga por área, % de clasificaciones corregidas, vencimientos |
| 9 | Vista de la red | Administrador de red | Indicadores consolidados por clínica, sin acceso a casos individuales |
| 10 | Auditoría | Administrador | Registro de quién vio, cambió o validó cada caso |
| 11 | Notificaciones | Todos | Alertas de casos en ROJO y GRIS, asignaciones nuevas, plazos próximos a vencer |

## Flujo sugerido para la presentación

1. Iniciar sesión como **operativo** de una clínica → la bandeja muestra un caso nuevo en ROJO (medida provisional).
2. Abrir el detalle → mostrar la evidencia resaltada, la regla aplicada (*"ROJO por R04"*) y el área sugerida → confirmar.
3. Cambiar al rol de **líder de área** → el caso aparece en *Mis casos* con su plazo.
4. Volver a la bandeja → abrir un caso en GRIS por posible duplicado → vincularlo con el caso original.
5. Entrar como **administrador de clínica** → mostrar la tabla de reglas y cambiar un umbral.
6. Entrar como **administrador de red** → mostrar los indicadores consolidados de varias clínicas.

## Roles

| Rol | Puede |
|---|---|
| Operativo | Ver la cola de ingreso, validar extracciones y gestionar duplicados |
| Jurídica | Revisar y confirmar la clasificación; ajustar las reglas de su clínica |
| Líder de área | Ver y gestionar los casos asignados a su área |
| Administrador de clínica | Gestionar usuarios, áreas, responsables y umbrales |
| Administrador de red | Ver indicadores consolidados entre clínicas |

## Datos

- Usar **solo datos ficticios**. Se pueden generar casos de ejemplo inspirados en la base sintética de Kantera (`insumos/`, local), guardándolos aquí como archivos JSON propios.
- Los casos deben cubrir: los seis tipos de actuación, los cuatro colores del semáforo, al menos un duplicado, un caso de competencia dudosa y un plazo vencido.
- Usar al menos 3 clínicas ficticias para mostrar la separación entre clínicas y la vista de la red.
- No incluir nombres reales de personas, pacientes ni despachos judiciales.

## Referencias

- Esquema del caso: [PROPUESTAS.md, sección 4.1](../docs/PROPUESTAS.md#41-esquema-del-caso)
- Semáforo y reglas: [PROPUESTAS.md, secciones 4.2 y 4.3](../docs/PROPUESTAS.md#42-reglas-como-datos)
- Arquitectura y roles: [PROPUESTAS.md, sección 6](../docs/PROPUESTAS.md#6-propuesta-b--plataforma-para-la-red-keralty)
