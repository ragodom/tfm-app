# Historial de evolución del prototipo

Este documento recoge los principales hitos funcionales alcanzados durante el desarrollo del prototipo del TFM.

Las versiones comprendidas entre v0.1 y v0.9 se han reconstruido retrospectivamente a partir del proceso de desarrollo, las pruebas realizadas y los cambios introducidos durante la implementación.

El control formal de versiones mediante Git comienza a partir de la versión v0.10.

---
## v0.11 - Gestión de alumnado

### Cambios
- Creación del workflow `TFM - Gestión perfiles`.
- Listado de perfiles almacenados en Supabase.
- Alta de nuevos perfiles desde Next.js.
- Cálculo automático de `perfil_completo`.
- Diferenciación visual entre perfiles completos e incompletos.
- Selección de un perfil para la generación de actividades.
- Persistencia temporal del perfil seleccionado mediante localStorage.

### Resultado
La aplicación permite gestionar perfiles de alumnado desde la interfaz web y seleccionar qué perfil se utilizará posteriormente para personalizar las actividades.

## v0.10 - 26/08/2026

### Estado
Primera versión registrada formalmente mediante control de versiones.

### Cambios principales
- Integración de una interfaz web desarrollada con Next.js.
- Conexión de Next.js con el workflow principal de generación de actividades.
- Incorporación de `actividad_id` en la respuesta del workflow.
- Registro de intentos desde la interfaz web.
- Cálculo automático del número de intento.
- Detección automática de puntuaciones inferiores al 50 %.
- Generación de actividades de refuerzo.
- Visualización de las actividades de refuerzo desde Next.js.
- Incorporación de guardrails deterministas.
- Unificación de múltiples fragmentos recuperados mediante RAG.
- Almacenamiento de actividades, intentos y refuerzos en Supabase.
- Versionado del esquema actual de la base de datos.

### Resultado
El prototipo permite completar desde la interfaz web el ciclo:

generación de actividad → realización → registro del intento → análisis del resultado → generación de refuerzo.

---

## v0.9 - Integración inicial de Next.js

### Cambios
- Creación de una aplicación web con Next.js.
- Conexión con el webhook de generación de actividades de n8n.
- Visualización inicial de las actividades generadas.

### Resultado
La generación puede iniciarse desde una interfaz web sin utilizar Postman.

---

## v0.8 - Unificación del contexto RAG

### Problema detectado
La recuperación vectorial podía devolver varios fragmentos como elementos independientes, provocando ejecuciones duplicadas y el almacenamiento de más de una actividad para una única solicitud.

### Solución
Se añadieron nodos de unificación del contexto RAG antes de las etapas de procesamiento mediante IA.

### Resultado
Una solicitud genera una única ejecución lógica aunque el sistema RAG recupere varios fragmentos.

---

## v0.7 - Registro de intentos y refuerzo

### Cambios
- Creación del workflow de registro de intentos.
- Registro de puntuación, duración, finalización y errores.
- Numeración automática de intentos.
- Detección de resultados inferiores al 50 %.
- Generación automática de actividades de refuerzo.
- Asociación entre actividad original y actividad de refuerzo.

### Resultado
El sistema puede adaptar una nueva actividad utilizando resultados reales de intentos anteriores.

---

## v0.6 - Incorporación de guardrails deterministas

### Problema detectado
La evaluación realizada mediante modelos de lenguaje podía considerar válidos algunos ejemplos, generalizaciones o inferencias que no estaban respaldados explícitamente por el material recuperado mediante RAG.

### Solución
Se añadieron nodos Code con reglas deterministas después de las etapas de evaluación.

### Resultado
La decisión final de validez combina evaluación mediante IA y comprobaciones deterministas.

---

## v0.5 - Regeneración automática

### Cambios
- Incorporación de una segunda etapa de generación cuando una actividad es rechazada.
- Nueva evaluación de la actividad regenerada.
- Derivación a revisión del profesorado cuando la regeneración tampoco supera la validación.

### Resultado
El sistema dispone de un mecanismo de recuperación ante actividades no válidas.

---

## v0.4 - Separación de responsabilidades entre modelos

### Cambios
- IA1: análisis y planificación.
- IA2: generación de actividades.
- IA3: evaluación de las actividades.
- Uso de salidas estructuradas en formato JSON.

### Resultado
Se evita concentrar todo el proceso de generación y validación en una única llamada al modelo.

---

## v0.3 - Workflow principal de generación

### Cambios
- Creación del webhook de generación.
- Recuperación del perfil.
- Validación de existencia y completitud del perfil.
- Enrutamiento condicional.
- Generación y almacenamiento de actividades.

---

## v0.2 - Incorporación de RAG

### Cambios
- Creación de la tabla `documentos_rag`.
- Activación de pgvector.
- Generación de embeddings.
- Creación de la función `match_documentos_rag`.
- Recuperación de material docente mediante similitud vectorial.

### Resultado
El contenido académico utilizado para generar actividades queda limitado al material docente recuperado.

---

## v0.1 - Estructura inicial de datos

### Cambios
- Creación de la tabla `perfiles`.
- Creación de la tabla `actividades`.
- Creación de la tabla `intentos`.
- Definición inicial de relaciones entre perfiles, actividades e intentos.