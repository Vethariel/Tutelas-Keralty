# Triaje asistido de tutelas — Estructura de presupuesto

Reto Kantera – Universidad Nacional de Colombia · Clínica Universitaria Colombia (Keralty / Colsanitas)

Complemento de [PROPUESTAS.md](PROPUESTAS.md).

> **Estado:** estimación preliminar, construida solo con información pública y con los datos del reto. Los precios de proveedores de IA y nube cambian a menudo, los salarios son referencias de mercado y los volúmenes son supuestos. Este documento muestra **cómo se compone el costo** y **en qué orden de magnitud está**; no es una cotización. Precios consultados el **17 de noviembre de 2026**. El 18 de noviembre se ajustó el recurso humano a un equipo pequeño con desarrollo asistido por IA (sección 7).

---

## Contenido

1. [Resumen](#1-resumen)
2. [Supuestos base](#2-supuestos-base)
3. [Estructura de costos](#3-estructura-de-costos)
4. [Consumo de tokens](#4-consumo-de-tokens)
5. [Proveedores de IA por API](#5-proveedores-de-ia-por-api)
6. [Modelo propio (autoalojado)](#6-modelo-propio-autoalojado)
7. [Recurso humano](#7-recurso-humano)
8. [Presupuesto de la Propuesta A](#8-presupuesto-de-la-propuesta-a)
9. [Presupuesto de la Propuesta B](#9-presupuesto-de-la-propuesta-b)
10. [Comparación y sensibilidad](#10-comparación-y-sensibilidad)
11. [Riesgos de costo](#11-riesgos-de-costo)
12. [Fuentes](#12-fuentes)

---

## 1. Resumen

| | Propuesta A: Piloto en la clínica | Propuesta B: Plataforma para la red Keralty |
|---|---|---|
| Duración | ~5–6 semanas de calendario (2–3 semanas de desarrollo) | ~4,5 meses hasta el piloto en 2 clínicas |
| Equipo | 1 ingeniero de producto + apoyo puntual en QA y seguridad | 2 ingenieros senior + QA, DevOps y diseño a tiempo parcial |
| Costo de desarrollo | **~29–38 M COP** (incluye 15 % de contingencia) | **~350–400 M COP** (incluye 20 % de contingencia) |
| Costo de operación mensual | **~1,0–1,4 M COP** | **~16–19 M COP** con 5 clínicas (~3,5 M COP por clínica) |
| IA (tokens) al mes | USD 2–35 | USD 60–1.300, según el modelo y el volumen |
| Total del primer año | **~40–50 M COP** | **~480–530 M COP** |

Cuatro conclusiones:

1. **El equipo es pequeño porque el desarrollo es asistido por IA.** Escribir el código ya no es lo que más tiempo toma. El presupuesto se concentra en una persona que entiende el problema de negocio y tiene la pericia técnica para llevarlo a la realidad, y en lo que la IA no reemplaza: **validar, probar y asegurar**.
2. **El costo de la IA es marginal.** Procesar una tutela cuesta entre **USD 0,002 y 0,22** (entre 8 y 700 pesos), según el modelo. Lo que define el presupuesto son las **personas** y, en la Propuesta B, el **cumplimiento** (seguridad y protección de datos), no los tokens.
3. **Un modelo propio no se justifica por costo.** Una sola GPU en la nube encendida todo el mes cuesta más que el consumo por API de toda la red en el escenario más alto con modelos económicos. Solo tendría sentido si una política de datos impide usar un proveedor externo.
4. **En el marco del reto, la Propuesta A no tiene costo de personal para la clínica**, porque el equipo académico la desarrolla. Lo que la clínica aporta son horas de sus equipos (~125 horas) y, a lo sumo, unos pocos dólares al mes de IA.

---

## 2. Supuestos base

| Supuesto | Valor usado | Comentario |
|---|---|---|
| Tasa de cambio (TRM) | **3.300 COP por USD** | La TRM estuvo entre 3.200 y 3.300 en noviembre de 2026. Los costos de IA y nube se facturan en dólares. |
| Volumen de la Propuesta A | **300 casos al mes** (base) y 600 (alto) | 7–10 correos diarios reportados en el área, más duplicados y reprocesos |
| Volumen de la Propuesta B | 1.500 / 5.000 / 12.000 casos al mes | Escenarios hipotéticos de 2, 5 y 10 clínicas de la red. **No hay datos reales de volumen de la red.** |
| Tamaño del documento | 15 páginas (típico) y 40 (exigente) | Escrito de tutela, auto admisorio y anexos. Se asumen ~600 tokens por página de texto en español. |
| Sobrecosto operativo | +25 % de tokens | Reintentos, reprocesos, duplicados y pruebas |
| Forma de trabajo | **Desarrollo asistido por IA** | El código se genera y revisa con herramientas de IA; las horas se concentran en diseño, validación, pruebas y seguridad (sección 7.1) |
| Contratación | **Contratistas por horas** | Tarifas de mercado colombiano 2026; ya incluyen los costos del contratista, sin factor prestacional adicional |
| Horas por mes | 160 | Para convertir dedicación en horas |
| Contingencia | 15 % en A · 20 % en B | Sobre el costo de desarrollo. En B es mayor por la dependencia de pocas personas clave (sección 11). |

---

## 3. Estructura de costos

Los costos se agrupan en seis rubros, comunes a las dos propuestas:

| Rubro | Qué incluye | Tipo | Peso en A | Peso en B |
|---|---|---|---|---|
| **1. Desarrollo** | Personas que construyen la solución: diseño, desarrollo, IA, pruebas | Inversión (una vez) | Alto | Muy alto |
| **2. Contrapartes internas** | Horas de Jurídica, el área clínica, TI y el equipo operativo para validar y aprobar | Costo de oportunidad | Medio | Medio |
| **3. IA** | Tokens consumidos por la extracción y el resumen | Operación (variable) | Muy bajo | Bajo |
| **4. Infraestructura** | Nube, base de datos, almacenamiento, OCR, monitoreo | Operación (fija + variable) | Nulo (se usa Workspace) | Medio |
| **5. Cumplimiento y seguridad** | Evaluación de impacto de datos, pruebas de penetración, asesoría legal | Inversión + recurrente | Bajo | Alto |
| **6. Operación y soporte** | Mantenimiento, ajuste de reglas, soporte a usuarios | Operación (fija) | Bajo | Alto |

---

## 4. Consumo de tokens

### 4.1 Tokens por caso

Cada tutela requiere **una llamada principal** al modelo de IA para extraer los campos del esquema y redactar el resumen. Las reglas de semáforo y direccionamiento no consumen tokens, porque son deterministas.

| Componente | Escenario típico | Escenario exigente |
|---|---|---|
| Texto del documento (después del OCR) | ~9.000 tokens (15 páginas) | ~24.000 tokens (40 páginas) |
| Instrucciones, esquema JSON y catálogos | ~2.000 tokens | ~2.000 tokens |
| Ejemplos o contexto adicional | — | ~2.000 tokens |
| **Entrada total** | **~11.000 tokens** | **~28.000 tokens** |
| **Salida** (JSON, evidencia, resumen y razonamiento) | **~1.500 tokens** | **~3.000 tokens** |

### 4.2 Tokens al mes

Incluye el sobrecosto operativo del 25 %. M = millones de tokens.

| Escenario | Casos al mes | Entrada al mes | Salida al mes |
|---|---|---|---|
| A — base | 300 | 4,1–10,5 M | 0,6–1,1 M |
| A — alto | 600 | 8,3–21 M | 1,1–2,3 M |
| B — 2 clínicas | 1.500 | 21–53 M | 2,8–5,6 M |
| B — 5 clínicas | 5.000 | 69–175 M | 9,4–19 M |
| B — 10 clínicas | 12.000 | 165–420 M | 23–45 M |

### 4.3 Consumo durante el desarrollo

Para evaluar y ajustar los prompts se procesan los 60 casos sintéticos y el conjunto "difícil" (~120 casos) varias veces con distintos modelos (estimado: ~20.000 llamadas con documentos cortos). **Presupuesto sugerido: USD 50–150 en total** (~0,2–0,5 M COP).

### 4.4 Cómo reducir el consumo

- **Enviar texto, no imágenes.** El OCR se hace antes; enviar el PDF como imagen al modelo multiplica los tokens de entrada.
- **Enviar solo lo relevante.** El auto admisorio y el escrito suelen bastar; los anexos clínicos largos se pueden omitir o resumir aparte.
- **Caché de prompt.** Las instrucciones y el esquema (~2.000 tokens) son iguales en todas las llamadas; con caché, esa parte cuesta una fracción.
- **Procesamiento por lotes.** Para casos que no sean urgentes, los lotes cuestan la mitad. Los casos en ROJO siempre se procesan en tiempo real.
- **Enrutamiento por dificultad** (sección 5.4).

---

## 5. Proveedores de IA por API

### 5.1 Precios de referencia

En USD por millón de tokens, tarifa estándar. Las tarifas cambian con frecuencia; hay que verificarlas antes de comprometer el presupuesto.

| Modelo | Proveedor / canal | Entrada | Salida | Observaciones |
|---|---|---|---|---|
| Claude Haiku 5.5 | Anthropic API | 0,10 | 0,50 | Hasta 100.000 tokens de entrada; por encima, 0,50 / 2,50 |
| Gemini 3.1 Flash-Lite | Google (AI Studio / Vertex AI) | 0,25 | 1,50 | |
| GPT-5 mini | OpenAI | 0,25 | 2,00 | Fuente no oficial; podría retirarse en diciembre de 2026 |
| Gemini 3.5 Flash-Lite | Google | 0,30 | 2,50 | |
| Gemini 3.8 Flash | Google | 0,75 → **1,50** | 3,75 → **7,50** | Duplica precio el 1 de enero de 2027; el cálculo usa la tarifa nueva |
| Claude Sonnet 5.5 | Anthropic API | 2,00 | 10,00 | |
| Gemini 3.1 Pro (preview) | Google | 2,00 | 12,00 | Hasta 200.000 tokens; por encima, 4 / 18 |
| Claude Opus 5.5 | Anthropic API | 4,00 | 20,00 | |

Descuentos aplicables:
- **Lotes (batch):** 50 % en Gemini, Claude y OpenAI.
- **Caché de prompt:** la lectura de la parte en caché cuesta una fracción del precio de entrada.

**Claude en Vertex AI** tiene tarifas propias, que fija Google como socio. Conviene usarlo si la clínica quiere una sola factura y un solo contrato en Google Cloud, pero hay que verificar el precio en la página de Vertex.

### 5.2 Costo por caso y costo mensual

En USD, rango entre el escenario típico y el exigente, incluyendo el sobrecosto del 25 %.

| Modelo | Por caso | A base (300) | A alto (600) | B 2 clínicas (1.500) | B 5 clínicas (5.000) | B 10 clínicas (12.000) |
|---|---|---|---|---|---|---|
| Claude Haiku 5.5 | 0,002–0,005 | 0,7–1,6 | 1,4–3,2 | 3,5–8,1 | 12–27 | 28–65 |
| Gemini 3.1 Flash-Lite | 0,006–0,014 | 1,9–4,3 | 3,8–8,6 | 9–22 | 31–72 | 75–173 |
| GPT-5 mini | 0,007–0,016 | 2,2–4,9 | 4,3–9,8 | 11–24 | 36–81 | 86–195 |
| Gemini 3.5 Flash-Lite | 0,009–0,020 | 2,6–6,0 | 5,3–12 | 13–30 | 44–99 | 106–239 |
| Gemini 3.8 Flash (tarifa 2027) | 0,035–0,081 | 10–24 | 21–48 | 52–121 | 173–403 | 416–968 |
| Claude Sonnet 5.5 | 0,046–0,108 | 14–32 | 28–65 | 69–161 | 231–538 | 555–1.290 |
| Gemini 3.1 Pro | 0,050–0,115 | 15–35 | 30–69 | 75–173 | 250–575 | 600–1.380 |
| Claude Opus 5.5 | 0,093–0,215 | 28–65 | 56–129 | 139–323 | 463–1.075 | 1.110–2.580 |

Como referencia en pesos: en la Propuesta A, aun con el modelo más caro de la tabla, la IA cuesta como máximo **~430.000 COP al mes**. Con un modelo económico, cuesta **menos de 20.000 COP al mes**.

Estos cálculos no aplican los descuentos de caché ni de lotes, así que son un techo razonable.

### 5.3 Qué modelo usar

El costo no decide la elección: decide la **calidad de extracción** medida con el conjunto de evaluación (ver PROPUESTAS.md, sección 4.4). El proceso recomendado es:

1. Evaluar 3 o 4 modelos con los mismos casos: uno económico de cada proveedor y uno intermedio.
2. Elegir el más económico que cumpla la meta: **ningún caso urgente clasificado como no urgente** y plazos extraídos correctamente.
3. Repetir la evaluación cada vez que se cambie de modelo o de versión.

### 5.4 Enrutamiento por dificultad

Un modelo económico procesa todos los casos. Los que salen con baja confianza o con campos faltantes (estimado: 10–20 %) se reprocesan con un modelo intermedio.

Ejemplo: 85 % con Gemini Flash-Lite y 15 % con Claude Sonnet 5.5 → **~USD 0,012–0,028 por caso**:

| Escenario | Costo mensual |
|---|---|
| A base (300) | USD 4–9 |
| B 5 clínicas (5.000) | USD 62–142 |
| B 10 clínicas (12.000) | USD 148–341 |

### 5.5 Condiciones de datos (no negociables)

El precio no es lo único que importa en la elección del canal:

| Condición | Implicación |
|---|---|
| **No usar niveles gratuitos con datos reales** | En el nivel gratuito de Google AI Studio, los datos pueden usarse para mejorar los productos de Google. Solo se aceptan canales pagos con contrato empresarial (Vertex AI, Anthropic API, Azure/OpenAI empresarial). |
| **Contrato y tratamiento de datos** | El proveedor debe firmar un acuerdo de tratamiento de datos que cumpla la Ley 1581 de 2012 y las políticas de Keralty. |
| **Ubicación del procesamiento** | Verificar en qué región se procesan los datos y si eso implica una transferencia internacional. |
| **Retención** | Preferir opciones que no retengan los datos enviados, o que permitan configurar la retención. |
| **Datos sintéticos en el reto** | Mientras se usen solo los casos sintéticos, cualquier canal pago sirve para las pruebas. |

---

## 6. Modelo propio (autoalojado)

Consiste en ejecutar un modelo de pesos abiertos en infraestructura controlada por la clínica o por la red, sin enviar datos a un proveedor de IA.

### 6.1 Opciones y costos

| Opción | Costo de referencia | Comentario |
|---|---|---|
| **GPU en Google Cloud** (g2-standard-4, 1 × NVIDIA L4 de 24 GB) | USD 0,71 por hora bajo demanda | Encendida todo el mes: **~USD 516** (~1,7 M COP). Solo en horario laboral (12 h × 22 días): **~USD 187** (~0,6 M COP). Con alta disponibilidad (2 instancias): **~USD 1.030**. |
| **GPU spot en Google Cloud** | ~USD 0,28–0,33 por hora | Más barata, pero Google puede apagarla en cualquier momento. No sirve para casos urgentes. |
| **Servidor propio con GPU** | Orden de decenas de millones de COP (requiere cotización) | Más el costo de alojamiento, energía, mantenimiento y reposición. |
| **Operación del modelo (MLOps)** | 20–40 horas al mes del ingeniero de producto: **~3–7 M COP al mes** | Actualizaciones, monitoreo, seguridad y reevaluación de calidad |

Un modelo que cabe en una L4 (alrededor de 8 a 14 mil millones de parámetros, cuantizado) tendrá menos calidad de extracción que los modelos comerciales. Hay que medirlo con el mismo conjunto de evaluación antes de elegirlo.

### 6.2 Punto de equilibrio

| Escenario | API económica + enrutamiento | Modelo propio (1 GPU encendida todo el mes + operación) |
|---|---|---|
| A base | USD 4–9 al mes | USD 516 + 3–7 M COP al mes |
| B 10 clínicas | USD 148–341 al mes | USD 516–1.030 + 3–7 M COP al mes |

**Con estos volúmenes, el modelo propio siempre es más caro.** Su único argumento es de **política de datos**: que Jurídica o Seguridad de la Información no autoricen enviar documentos a un proveedor externo.

Por eso las dos propuestas dejan la capa de IA **aislada e intercambiable**. Si esa política aparece, se cambia el módulo de IA sin rehacer el resto.

---

## 7. Recurso humano

### 7.1 Por qué un equipo pequeño

Con herramientas de IA, construir una primera versión funcional toma días o pocas semanas. Lo difícil no se acelera al mismo ritmo:

- La IA ahorra alrededor del **46 % del tiempo en tareas rutinarias** de programación, pero **menos del 10 % en trabajo complejo**.
- En una medición sobre más de 14.000 desarrolladores, el tiempo para tener código listo bajó un 32 %, pero **el tiempo de revisión subió un 41 % y los defectos un 50 %**.

Es decir, el trabajo se traslada de **escribir** código a **validarlo**. Por eso el equipo se organiza así:

1. **Un ingeniero de producto senior** como pieza central: entiende el problema de negocio, diseña la solución, desarrolla con IA y toma las decisiones técnicas.
2. **Revisión independiente**: alguien distinto de quien escribió el código lo prueba (QA) y revisa su seguridad.
3. **Apoyo especializado puntual**: infraestructura, diseño y asesoría en protección de datos, solo cuando se necesitan.

### 7.2 Tarifas de referencia

Tarifas por hora de contratistas en Colombia (2026). Ya incluyen los costos del contratista.

| Perfil | COP por hora | USD aproximados | Referencia de mercado |
|---|---|---|---|
| Ingeniero de producto senior (negocio + técnica, desarrollo con IA) | 165.000 | ~50 | Senior independiente en Colombia: USD 32–41 la mayoría de contratos; especializado, USD 35–60 |
| Desarrollador senior | 150.000 | ~45 | Ídem |
| Analista de pruebas (QA) | 100.000 | ~30 | |
| DevOps / seguridad de infraestructura | 170.000 | ~52 | Perfil especializado, parte alta del rango |
| Diseño UX | 110.000 | ~33 | |
| Asesoría en seguridad y protección de datos | 200.000 | ~60 | Consultoría especializada (estimado) |

Como contraste, una agencia cobra por un senior en Latinoamérica entre USD 50 y 90 por hora. Contratar por agencia subiría el costo de personal en un 20–80 %.

### 7.3 Perfiles y responsabilidades

| Perfil | Responsabilidades | A | B |
|---|---|---|---|
| Ingeniero de producto senior | Entender el proceso, diseñar, desarrollar con IA, evaluar modelos, decidir la arquitectura, relación técnica con la clínica | 120–160 h | 100 % · 4,5 meses |
| Desarrollador senior | Desarrollo y revisión cruzada de código; conoce todo el sistema para reducir la dependencia de una sola persona | — | 100 % · 3,5 meses |
| Analista de pruebas (QA) | Pruebas funcionales y de regresión, independientes de quien desarrolla | 30–40 h | 50 % · 3 meses |
| DevOps / seguridad de infraestructura | Nube con servicios administrados, despliegue, monitoreo, respaldos, endurecimiento | — | 25 % · 3 meses |
| Revisión de seguridad | Permisos, accesos y manejo de datos | 10–16 h | Incluida en DevOps y asesoría |
| Diseño UX | Pantallas, flujo de uso, tablero | Lo cubre el ingeniero de producto | 80 h |
| Asesoría en seguridad y protección de datos | Evaluación de impacto, contratos, controles | Lo cubren las áreas de la clínica | 80–120 h |

**No se incluye un gestor de proyecto.** El ingeniero de producto entiende el negocio y coordina la parte técnica, y la clínica o la red designa una contraparte interna que prioriza y aprueba.

### 7.4 Contrapartes internas

Horas que deben aportar las áreas de la clínica o de la red. No son un pago, pero sí un costo de oportunidad y un requisito para avanzar. **Estas horas no se reducen con IA.**

| Contraparte | Aporte | Horas en A | Horas en B |
|---|---|---|---|
| Equipo jurídico | Validar reglas, umbrales y catálogo; revisar resultados | ~40 | ~120 |
| Área clínica (Oncología) | Validar urgencia clínica y direccionamiento | ~30 | ~80 |
| Equipo operativo | Explicar el proceso actual, probar el prototipo | ~30 | ~100 |
| TI y Seguridad de la Información | Aprobar el acceso al buzón, la IA y el manejo de datos | ~24 | ~150 |
| Contraparte de producto (solo B) | Priorizar, aprobar entregas, coordinar las clínicas | — | ~150 |
| **Total** | | **~124 horas** | **~600 horas** |

---

## 8. Presupuesto de la Propuesta A

### 8.1 Cronograma (~5–6 semanas)

El desarrollo toma 2–3 semanas de esfuerzo. El calendario es más largo porque depende de las validaciones con Jurídica y de las aprobaciones de TI.

| Fase | Semanas | Entregable |
|---|---|---|
| 0. Núcleo y evaluación | 1–2 | Esquema del caso, tabla de reglas, evaluación con los 60 casos y el conjunto difícil, elección de modelo |
| 1. Ingreso, extracción y gestión | 2–3 | Apps Script que lee el correo, aplica OCR, extrae con IA y aplica las reglas; hoja de gestión, alertas y tablero |
| 2. Pruebas y revisión de seguridad | 4 | QA independiente, revisión de permisos y accesos, correcciones |
| 3. Validación con los equipos | 5–6 | Sesiones con Jurídica, el área clínica y el equipo operativo; ajustes; demo |

### 8.2 Costo de desarrollo

| Rol | Horas | M COP |
|---|---|---|
| Ingeniero de producto: núcleo y evaluación (30 h), Apps Script (30 h), hoja, alertas y Looker (20 h), ajustes y documentación (20 h), validación con los equipos (30 h) | 120–160 | 19,8–26,4 |
| QA / validación independiente | 30–40 | 3,0–4,0 |
| Revisión de seguridad | 10–16 | 2,0–3,2 |
| **Subtotal personal** | **160–216** | **24,8–33,6** |
| Tokens durante el desarrollo | | 0,2–0,5 |
| Contingencia (15 %) | | 3,7–5,0 |
| **Total desarrollo** | | **~29–38** |

Como referencia de mercado, en Colombia una agencia cotiza un producto mínimo de un flujo entre 15 y 30 M COP, sin pruebas de seguridad ni validación con usuarios.

**Dentro del reto**, el equipo académico hace este trabajo, así que **el desembolso de la clínica es prácticamente cero**. La tabla sirve para dimensionar cuánto costaría contratarlo, o internalizarlo después del reto.

### 8.3 Costo de operación mensual

| Rubro | Costo mensual | Comentario |
|---|---|---|
| Google Workspace, Apps Script, Drive (OCR), Sheets, Looker Studio | 0 adicional | Se asume que la clínica ya tiene Workspace |
| Proyecto de Google Cloud para Vertex AI | 0 fijo | Solo se paga el consumo |
| IA (300–600 casos) | USD 2–35 → **~0,01–0,12 M COP** | Según el modelo; con enrutamiento, USD 4–9 |
| Soporte técnico (6–8 h) | **~1,0–1,3 M COP** | Ajustes al script, cambios de Google, incidentes |
| Ajuste de reglas por Jurídica (4 h) | Interno | Costo de oportunidad |
| **Total** | **~1,0–1,4 M COP** | |

### 8.4 Primer año

| Concepto | M COP |
|---|---|
| Desarrollo (con contingencia) | ~29–38 |
| Operación (~10,5 meses × 1,0–1,4 M) | ~11–14 |
| **Total del primer año (valor de mercado)** | **~40–50** |
| **Desembolso de la clínica dentro del reto** | **IA (< 1,5 M al año) + ~124 horas internas** |

### 8.5 Límites de la Propuesta A

- **Cuotas de Apps Script:** ejecuciones de hasta 6 minutos y límites diarios de correo y llamadas externas. Sobran para 300–600 casos al mes; con varias veces ese volumen, pasar a la Propuesta B.
- **Licencias de Workspace:** si la edición de la clínica no incluye Gemini o Looker Studio Pro, no hace falta comprarlos: Vertex AI se paga por consumo y Looker Studio en su versión gratuita basta.

---

## 9. Presupuesto de la Propuesta B

### 9.1 Cronograma (~4,5 meses hasta el piloto)

Solo 2 de los 4,5 meses son de escribir código. El resto es diseño, seguridad, pruebas y piloto, que dependen de terceros y no se aceleran con IA.

| Fase | Meses | Entregable |
|---|---|---|
| 1. Descubrimiento y diseño | 0,5 | Requisitos de la red, arquitectura, diseño de pantallas, inicio de la evaluación de impacto en datos |
| 2. Producto mínimo | 2 | Conectores, procesamiento, motor de reglas por clínica, interfaz con roles, auditoría, notificaciones (reutilizando el núcleo de la Propuesta A) |
| 3. Seguridad y pruebas | 1 | Pruebas de penetración, corrección de hallazgos, pruebas de carga y regresión |
| 4. Piloto en 2 clínicas | 1 | Despliegue, capacitación, medición |
| 5. Extensión a la red | Desde el mes 5 | Incorporación gradual de clínicas (incluida en la operación) |

### 9.2 Costo de desarrollo

| Rol / concepto | Dedicación | M COP |
|---|---|---|
| Ingeniero de producto / líder técnico | 100 % · 4,5 meses (720 h) | 118,8 |
| Desarrollador senior | 100 % · 3,5 meses (560 h) | 84,0 |
| Analista de pruebas (QA) | 50 % · 3 meses (240 h) | 24,0 |
| DevOps / seguridad de infraestructura | 25 % · 3 meses (120 h) | 20,4 |
| Diseño UX | 80 h | 8,8 |
| **Subtotal personal** | **1.720 h** | **256,0** |
| Asesoría en seguridad y protección de datos | 80–120 h | 16–24 |
| Pruebas de penetración (web + API, a cotizar) | USD 5.000–15.000 | 17–50 |
| Infraestructura de desarrollo y pruebas (4,5 meses × USD 200–300) | | 3–4,5 |
| Tokens de desarrollo y pruebas | | 0,5–1,5 |
| **Subtotal** | | **~293–336** |
| Contingencia (20 %) | | ~59–67 |
| **Total desarrollo** | | **~350–400** |

### 9.3 Infraestructura mensual (producción)

Estimación de orden de magnitud sobre Google Cloud con servicios administrados. Hay que validarla con la calculadora de precios de Google para la región que se elija.

| Componente | Servicio de referencia | USD al mes |
|---|---|---|
| Backend y procesamiento | Cloud Run (API + workers) | 80–250 |
| Base de datos | Cloud SQL PostgreSQL con alta disponibilidad | 200–450 |
| Documentos y respaldos | Cloud Storage | 20–60 |
| Cola de procesamiento | Pub/Sub o Cloud Tasks | 5–20 |
| Red, balanceador y firewall de aplicación | Load Balancing + Cloud Armor | 30–100 |
| Monitoreo y registros | Cloud Logging / Monitoring | 30–100 |
| Secretos, correo de notificaciones, dominio | Varios | 10–50 |
| **Subtotal fijo** | | **~400–1.000** |
| OCR (15–40 páginas por caso) | Document AI Enterprise OCR, USD 1,50 por 1.000 páginas | 34–90 (2 clínicas) · 113–300 (5) · 270–720 (10) |
| IA con enrutamiento | Sección 5.4 | 18–40 (2 clínicas) · 62–142 (5) · 148–341 (10) |

### 9.4 Costo de operación mensual

| Rubro | 2 clínicas | 5 clínicas | 10 clínicas |
|---|---|---|---|
| Ingeniería (mantenimiento, mejoras, soporte)* | 13,2 M (80 h) | 13,2 M (80 h) | 19,8 M (120 h) |
| QA y revisión de seguridad | 1,3 M | 1,3 M | 2,0 M |
| Infraestructura fija | 1,3–3,3 M | 1,3–3,3 M | 2–4 M |
| OCR + IA | 0,2–0,4 M | 0,6–1,5 M | 1,4–3,5 M |
| **Total mensual** | **~16–18 M** | **~16–19 M** | **~25–29 M** |
| **Por clínica** | **~8–9 M** | **~3,5 M** | **~2,5–3 M** |

\* Preferiblemente el mismo ingeniero de producto o el desarrollador senior del desarrollo, para no perder el conocimiento del sistema.

**La plataforma solo es rentable con varias clínicas:** el costo fijo de ingeniería pesa más que el consumo.

### 9.5 Costos de cumplimiento recurrentes

| Concepto | Frecuencia | Estimado |
|---|---|---|
| Pruebas de penetración | Anual | 17–50 M COP (USD 5.000–15.000, a cotizar) |
| Revisión de contratos de transmisión de datos por clínica | Al incorporar cada clínica | Horas de Jurídica |
| Evaluación de impacto en protección de datos | Al inicio y ante cambios grandes | Incluida en la asesoría |
| Auditoría de accesos | Continua | Incluida en monitoreo y operación |

Si la red exige certificación ISO 27001 para la plataforma, es un proyecto aparte con un costo considerable.

### 9.6 Primer año

| Concepto | M COP |
|---|---|
| Desarrollo (con contingencia) | ~350–400 |
| Operación (~7,5 meses, pasando de 2 a 5 clínicas, ~17 M al mes) | ~125–135 |
| **Total del primer año** | **~480–530** |

---

## 10. Comparación y sensibilidad

### 10.1 Cómo se reparte el costo

| Rubro | A (primer año) | B (primer año) |
|---|---|---|
| Personas (desarrollo y operación) | ~88 % | ~72 % |
| Contingencia | ~10 % | ~12 % |
| Cumplimiento y seguridad | Interno | ~10 % |
| Infraestructura y OCR | 0 % | ~5 % |
| IA (tokens) | ~1 % | < 1 % |

### 10.2 Comparación con un equipo tradicional

Si el proyecto se hiciera con un equipo tradicional, sin desarrollo asistido por IA y con roles separados (gestor de proyecto, varios desarrolladores backend y frontend, QA y DevOps de tiempo completo), el costo sería mucho mayor:

| | Equipo tradicional | Equipo ajustado (este documento) |
|---|---|---|
| A: duración | ~10 semanas, 4 personas | ~5–6 semanas, 1 persona + apoyo |
| A: primer año | ~103 M COP | **~40–50 M COP** |
| B: duración | ~8 meses, 8–9 personas | ~4,5 meses, 2 personas + apoyo |
| B: desarrollo | ~1.000 M COP | **~350–400 M COP** |
| B: primer año | ~1.100–1.200 M COP | **~480–530 M COP** |
| B: costo por clínica al mes (5 clínicas) | ~7 M COP | **~3,5 M COP** |

La reducción viene de **menos personas escribiendo código**, no de tarifas más bajas. Las horas de validación, pruebas, seguridad y contrapartes internas se mantienen.

### 10.3 Qué mueve el presupuesto

| Variable | Si cambia… | Efecto |
|---|---|---|
| Tarifas del equipo | ±20 % | ±15–18 % sobre el total |
| Contratación por agencia en vez de contratistas | USD 50–90 por hora | +20–80 % sobre el costo de personal |
| Duración del desarrollo de B | +1 mes | ~+50 M COP |
| Aprobaciones institucionales lentas | Calendario más largo | Más meses de equipo esperando; la contingencia cubre ~1 mes |
| Modelo de IA | De Flash-Lite a Opus | En A: de < 20.000 a ~430.000 COP al mes. En B (10 clínicas): de ~0,3 a ~8,5 M COP al mes |
| Volumen de casos | ×2 | Duplica IA y OCR, que siguen siendo una fracción menor |
| TRM | ±10 % | ±10 % sobre IA, infraestructura y pruebas de penetración |
| Modelo propio en vez de API | Si la política de datos lo exige | +5–8 M COP al mes de GPU y operación |
| Política de datos | Si exige alojamiento en Colombia | Puede requerir otro proveedor de nube o servidor propio; costo por cotizar |

---

## 11. Riesgos de costo

| Riesgo | Impacto | Mitigación |
|---|---|---|
| **Dependencia de una persona clave** | Si el ingeniero de producto se va, el proyecto se frena | Documentación al día, reglas como datos y no en el código, todo en el repositorio, un segundo ingeniero que conozca el sistema completo (en B), contingencia del 20 % |
| **Más defectos en código generado con IA** | Retrabajo y fallas en producción | QA independiente, revisión de seguridad, conjunto de evaluación automatizado, pruebas de penetración antes del piloto |
| **Aprobaciones institucionales lentas** | Alargan el calendario y el costo de personal | Empezar las aprobaciones en la primera semana; usar datos sintéticos mientras tanto |
| **Cambios de precio de los proveedores de IA** | Gemini 3.8 Flash duplica precio en enero de 2027; algunos modelos se retiran | Capa de IA intercambiable; reevaluar el modelo cada trimestre con el conjunto de evaluación |
| **Retiro de modelos** | Hay que migrar y volver a evaluar | Presupuestar horas de reevaluación en la operación |
| **Documentos más largos de lo previsto** | Más tokens y más páginas de OCR | Enviar solo las secciones relevantes; medir el tamaño real en el piloto |
| **Volumen real distinto del supuesto** | Cambia el costo por clínica de B | Medir el volumen en el piloto de A antes de decidir B |
| **Exigencias de seguridad mayores** | Certificaciones, auditorías, alojamiento local | Plantearlas en la fase de descubrimiento de B |

---

## 12. Fuentes

Consultadas el 17 de noviembre de 2026. Los valores de terceros son referencias y deben confirmarse con las fuentes oficiales.

**IA y nube**
- [Precios de Gemini — Google AI Studio](https://aistudio.google.com/docs/pricing)
- [Precios de IA generativa en Vertex AI — Google Cloud](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- Precios de Claude: tabla de precios de la API de Anthropic, actualizada al 3 de noviembre de 2026
- [Precios de GPT-5 mini — AnotherWrapper](https://anotherwrapper.com/llm-pricing/gpt-5-mini-2025-08-07)
- [Precios de la API de OpenAI 2026 — nOps](https://www.nops.io/blog/openai-api-pricing/)
- [Precios de máquinas con aceleradores — Google Cloud](https://cloud.google.com/products/compute/pricing/accelerator-optimized)
- [Precios de GPU — Google Cloud](https://cloud.google.com/products/compute/gpus-pricing)
- [L4 en Google Cloud — Deploybase](https://deploybase.ai/articles/l4-on-google-cloud-pricing-specs-how-to-rent)
- [Precios de Document AI — Google Cloud](https://cloud.google.com/document-ai/pricing)

**Desarrollo asistido por IA y cotizaciones de mercado**
- [Datos de METR, McKinsey y GitHub sobre productividad con IA — ValueAdd VC](https://valueaddvc.com/blog/ai-coding-productivity-study-data-what-metr-mckinsey-and-github-actually-found-in-2026)
- [Velocidad de desarrollo y deuda técnica con IA 2026 — CodeNinety](https://codeninety.com/research/developer-productivity-and-ai-tech-debt-2026)
- [Tarifas de desarrolladores en Colombia — Lemon.io](https://lemon.io/rate-calculator/colombia/)
- [Tarifas de desarrolladores en Colombia, Q4 2026 — OctogleHire](https://www.octoglehire.com/rates/colombia)
- [Tarifas de desarrollo web en Colombia 2026 — Elsasto](https://elsasto.com/blog/tarifas-desarrollo-web-colombia-2026)
- [Tarifas nearshore 2026 — HireInSouth](https://www.hireinsouth.com/post/nearshore-development-rates)
- [Costo de un MVP en Colombia 2026 — Togrow](https://togrowagencia.com/mvp-producto-minimo-viable-que-es-costo/)
- [Costo de una app en Colombia 2026 — Granweb](https://www.granweb.io/co/blog/desarrollar-una-app-colombia-2026)
- [Software a medida en Colombia — DIPA Solutions](https://www.dipasolutions.com/es/blog/desarrollo-software-medida-colombia/)
- [Costo de software a medida en la era de la IA — Gintic](https://gintic.com.co/costo-desarrollo-software-medida-ia-colombia/)
- [Costo de las pruebas de penetración — DeepStrike](https://deepstrike.io/blog/costo-de-las-pruebas-de-penetracion)
- [Cuánto cuesta un pentest — Startup Defense](https://www.startupdefense.io/es-us/blog/cuanto-cuesta-un-pentest)

**Tasa de cambio**
- [TRM del 13 de noviembre de 2026 — Diario del Sur](https://www.diariodelsur.com.co/noticias/dolar-alcanzo-su-nivel-mas-alto-en-mas-de-un-mes-este-13-de-noviembre)
- [Análisis semanal del dólar, 6 de noviembre de 2026 — Global66](https://www.global66.com/blog/dolar-hoy-colombia-analisis-semanal-06-noviembre-2026/)

**Salarios y costos laborales**
- [Salario de backend developer en Bogotá 2026 — JobRise](https://jobrise.io/es/blog/salario-backend-developer-bogota-2026/)
- [Empleos backend developer en Bogotá 2026 — JobRise](https://jobrise.io/es/blog/empleos-backend-developer-bogota-2026-guia/)
- [Salarios en tecnología en Colombia 2026 — Portafolio](https://www.portafolio.co/tecnologia/salarios-en-tecnologia-en-colombia-2026-cuanto-ganan-perfiles-en-inteligencia-artificial-datos-y-software-491946)
- [Salario de Data Engineer en Colombia — Payscale](https://www.payscale.com/research/CO/Job=Data_Engineer/Salary)
- [Salario de backend developer — Indeed Colombia](https://co.indeed.com/career/backend-developer/salaries)
- [Costo real de un empleado en Colombia 2026 — Buk](https://www.buk.co/blog/costo-real-de-un-empleado-en-colombia-2026)
- [Costo de un empleado en Colombia 2026 — Aleluya](https://aleluya.com/blog/nomina/costo-de-un-empleado-en-colombia-2026/)
- [Salario mínimo 2026 — Consultorsalud](https://consultorsalud.com/aumento-del-salario-minimo-en-colombia-2026/)
