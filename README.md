# Generación de actividades educativas personalizadas mediante IA y RAG

Repositorio correspondiente al prototipo desarrollado en el Trabajo Fin de Máster sobre automatización de la generación de actividades educativas personalizadas mediante inteligencia artificial, RAG y flujos de trabajo implementados con n8n.

El prototipo combina una aplicación web desarrollada con Next.js, flujos de automatización implementados en n8n, PostgreSQL/Supabase para la persistencia de datos y un sistema RAG para la recuperación de contenido académico.

## Estructura del repositorio

La aplicación web desarrollada con Next.js se encuentra en la raíz del repositorio.

```text
.
├── app/                         # Aplicación web Next.js
├── public/                      # Recursos estáticos
├── workflows-n8n/              # Exportaciones de los workflows de n8n
├── package.json
├── package-lock.json
└── README.md
```

## Workflows de n8n

El prototipo utiliza seis workflows:

| Workflow | Función | Archivo |
|---|---|---|
| TFM - Generación | Generación y validación de actividades | [Ver workflow](./workflows/TFM_generacion.json) |
| TFM - Estado generación | Consulta del estado de las solicitudes | [Ver workflow](./workflows/TFM_estado_generacion.json) |
| TFM - Registro intento y refuerzo | Registro de intentos y generación de refuerzos | [Ver workflow](./workflows/TFM_registro_refuerzo.json) |
| TFM - Gestión material RAG | Gestión e indexación del material docente | [Ver workflow](./workflows/TFM_gestion_material_rag.json) |
| TFM - Normalización material docente | Normalización del contenido antes de su indexación | [Ver workflow](./workflows/TFM_normalizacion_material_docente.json) |
| TFM - Gestión Perfiles | Gestión de los perfiles del alumnado | [Ver workflow](./workflows/TFM_gestion_perfiles.json) |

## Ejecución en entorno local

Instalar las dependencias:

```bash
npm install
```

Configurar las variables de entorno necesarias y ejecutar:

```bash
npm run dev
```

La aplicación estará disponible por defecto en:

```text
http://localhost:3000
```

> Las claves, tokens, contraseñas y demás credenciales privadas no se incluyen en este repositorio.

## Autor

**Raúl Gordillo Domínguez**
