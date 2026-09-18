Generación de actividades educativas personalizadas mediante IA y RAG
Repositorio correspondiente al prototipo desarrollado en el Trabajo Fin de Máster sobre automatización de la generación de actividades educativas personalizadas mediante inteligencia artificial, RAG y flujos de trabajo implementados con n8n.

El sistema utiliza información del perfil del alumnado para contextualizar las actividades y materiales docentes proporcionados por el profesorado como fuente de conocimiento académico.

Arquitectura general
El prototipo está compuesto por los siguientes elementos:

Next.js, React y TypeScript para la aplicación web.
n8n para la automatización y orquestación de los procesos.
PostgreSQL / Supabase para la persistencia de datos.
pgvector para el almacenamiento y recuperación de representaciones vectoriales.
RAG (Retrieval-Augmented Generation) para recuperar contenido académico relevante antes de la generación.
OpenAI para las etapas de planificación, generación, evaluación y generación de embeddings.
Guardrails deterministas para complementar la validación realizada mediante inteligencia artificial.
Estructura del repositorio
La aplicación web desarrollada con Next.js se encuentra en la raíz del repositorio.

.
├── app/                         # Aplicación web Next.js
├── public/                      # Recursos estáticos
├── workflows-n8n/              # Exportaciones de los workflows de n8n
├── package.json
├── package-lock.json
└── README.mdon/deploying) for more details.
