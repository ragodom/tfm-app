# Historial de evolución del prototipo

Este documento recoge los principales hitos funcionales alcanzados durante el desarrollo del prototipo del TFM.

Las versiones comprendidas entre v0.1 y v0.9 se han reconstruido retrospectivamente a partir del proceso de desarrollo, las pruebas realizadas y los cambios introducidos durante la implementación.

El control formal de versiones mediante Git comienza a partir de la versión v0.10.

---
## v0.16 - Correcciones finales y validación funcional

- Realizada batería final de pruebas de extremo a extremo.
- Corregida la respuesta HTTP para perfiles incompletos:
  - `PERFIL_INCOMPLETO` devuelve HTTP 422.
- Corregido un error de sintaxis detectado en `Unificar contexto RAG`.
- Validado el mecanismo de regeneración automática de actividades.
- Validado el registro de intentos con y sin generación de refuerzo.
- Validado el rechazo de actividades de refuerzo que no superan los controles.
- Validada la generación correcta de refuerzos a partir de errores concretos.
- Añadido acceso "Cambiar alumno" desde el generador de actividades.
- Mejorada la validación y presentación de errores en la carga de archivos PDF.
- Añadida validación preventiva en frontend para PDFs superiores a 5 MB.
- Mantenido el guardrail equivalente en n8n para proteger el backend.
- Eliminados archivos temporales utilizados durante las pruebas.

## v0.15

- Añadida carga de material docente mediante archivos PDF.
- Incorporada extracción de texto desde PDF en n8n.
- Reutilización del subworkflow de normalización para material textual y PDF.
- Integrada detección de duplicados también para documentos PDF.
- Añadida protección de duplicados a nivel de base de datos mediante huella de contenido e índice UNIQUE.
- Añadida validación de integridad entre materiales y chunks RAG.
- Añadido límite de 5 MB para archivos PDF:
  - validación preventiva en frontend;
  - validación de backend en n8n.
- Añadida respuesta controlada para archivos demasiado grandes.
- Adaptada la API de Next.js para reenviar JSON y multipart/form-data.
- Mejorada la interfaz de selección de archivos PDF.
- Validada la carga correcta, el bloqueo de duplicados y el rechazo de archivos de gran tamaño.

## v0.14 - Gestión del ciclo de vida del material docente

- Se amplía la gestión del material docente desde la aplicación web.
- Se incorpora la eliminación de materiales docentes.
- La eliminación de un material elimina automáticamente sus fragmentos RAG asociados mediante la relación `ON DELETE CASCADE`.
- Se incorpora la posibilidad de desactivar materiales sin eliminar su contenido fuente.
- Al desactivar un material:
  - su estado pasa a `inactivo`;
  - sus fragmentos vectorizados se eliminan de `documentos_rag`;
  - el material deja de participar en la recuperación RAG;
  - el texto original y normalizado se conservan para permitir su posterior reactivación.
- Se incorpora la reactivación de materiales docentes.
- Al reactivar un material:
  - se recupera su `texto_normalizado`;
  - se regeneran los chunks utilizando la configuración 800/120;
  - se vuelven a generar los embeddings;
  - los nuevos fragmentos se vinculan mediante `material_id`;
  - se actualizan el estado y el número de chunks.
- La interfaz de material docente permite eliminar, desactivar y reactivar materiales.
- Se incorpora detección determinista de materiales duplicados a partir del contenido normalizado.
- Los contenidos duplicados se bloquean antes de generar nuevos chunks o embeddings.
- Se valida mediante pruebas que un contenido duplicado no genera un nuevo material ni fragmentos RAG adicionales.

## v0.13 - Normalización y segmentación del material docente RAG

- Se incorpora un subworkflow reutilizable para la normalización determinista del material docente.
- La normalización se implementa mediante Python sin modificar el contenido académico.
- Se eliminan espacios y saltos de línea innecesarios preservando la indentación de fragmentos de código.
- Se incorpora un Recursive Character Text Splitter con un tamaño de chunk de 800 caracteres y un solapamiento de 120.
- Se crea la tabla `materiales_docentes` para separar el documento lógico de sus fragmentos vectorizados.
- Se incorpora la relación `material_id` entre `materiales_docentes` y `documentos_rag`.
- Se almacena el número de fragmentos generados para cada material.
- La interfaz de material docente pasa a mostrar un único registro por material, independientemente del número de chunks.
- Se valida la recuperación vectorial de los nuevos fragmentos desde el workflow principal `TFM`.
- El antiguo workflow independiente de carga RAG queda sustituido por el flujo integrado de gestión y normalización del material docente.

## v0.12 - Gestión de material docente RAG

- Se incorpora un nuevo workflow de n8n para la gestión del material docente utilizado por el sistema RAG.
- Se implementan las operaciones de listado y creación de documentos mediante un webhook.
- Los nuevos materiales se almacenan en Supabase mediante PGVector Store.
- Se generan embeddings con `text-embedding-3-small`.
- Se almacenan metadatos asociados al material: título, tema y fuente.
- Se incorpora una nueva API interna en Next.js para comunicar la aplicación web con el workflow de gestión de material RAG.
- Se desarrolla la sección `/material-docente`.
- La interfaz permite introducir nuevo contenido docente desde la aplicación.
- El material almacenado puede consultarse desde la propia interfaz.
- Se añade respuesta explícita desde n8n tras la inserción del documento para confirmar correctamente la operación al frontend.
- Se mantiene pendiente la normalización estructural del contenido y su transformación a Markdown antes de la generación de embeddings.

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