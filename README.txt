# 🚀 STV — Santander Territorio Vivo

> Dashboard territorial + asistente urbano inteligente para transformar datos de Santander en indicadores, insights y recomendaciones accionables.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/) 
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/) 
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/) 
[![Prisma](https://img.shields.io/badge/Prisma-schema-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/) 
[![Tests](https://img.shields.io/badge/tests-9%20passing-success)](#pruebas)

---

## 📌 Resumen

**STV (Santander Territorio Vivo)** es una plataforma web orientada a smart city que ofrece una visión operativa de Santander a partir de datos urbanos y los transforma en información útil para la toma de decisiones.

La aplicación combina tres capas principales:
- **Movilidad:** estaciones de bicicletas, disponibilidad, capacidad, ocupación, estados críticos e indicadores operativos.
- **Sostenibilidad:** red ciclista, nodos sostenibles y métricas derivadas del inventario urbano.
- **Comercio:** zonas de oportunidad calculadas a partir de movilidad, disponibilidad de bicicletas, cobertura y riesgo operativo.

Además, incorpora **STV Urban AI**, un asistente urbano con:

- conversaciones por usuario
- preferencias personales
- memoria contextual
- entrenamiento manual
- aprendizaje implícito a partir de mensajes
- recuperación de conocimiento personal mediante búsqueda léxica
- recomendaciones personalizadas
- integración opcional con OpenAI Responses API

La versión incluida es una **demo funcional y extensible**, con arquitectura preparada para producción.

---

## 📚 Índice

1. [Qué resuelve](#qué-resuelve)
2. [Demo y funcionamiento](#demo-y-funcionamiento)
3. [Funcionalidades principales](#funcionalidades-principales)
4. [Arquitectura del proyecto](#arquitectura-del-proyecto)
5. [Stack tecnológico](#stack-tecnológico)
6. [Requisitos](#requisitos)
7. [Instalación](#instalación)
8. [Variables de entorno](#configuración-mediante-variables-de-entorno)
9. [API REST](#api-rest)
10. [Ejemplos de uso de la API](#ejemplos-de-uso-de-la-api)
11. [Autenticación de la demo](#autenticación-de-la-demo)
12. [Memoria y RAG](#memoria-y-rag)
13. [Datos](#datos)
14. [Consideración archivos grandes](#consideración-importante-para-github-archivos-grandes)
15. [Seguridad implementada](#seguridad-implementada)
16. [Pruebas](#pruebas)
17. [Integración con OpenAI](#integración-con-openai)
18. [Modelo de datos](#modelo-de-datos-preparado-para-producción)
19. [Limitaciones conocidas](#limitaciones-conocidas-de-esta-versión)
20. [Roadmap técnico](#roadmap-técnico)
21. [Arquitectura de referencia](#arquitectura-de-referencia-para-producción)
22. [Scripts disponibles](#scripts-disponibles)
23. [Estructura conceptual del backend](#estructura-conceptual-del-backend)
24. [Caso de uso de ejemplo](#caso-de-uso-de-ejemplo)
25. [Estado del proyecto](#estado-del-proyecto)
26. [Autoría](#autoría)
27. [Licencia](#licencia)

---

## Qué resuelve

STV transforma datos urbanos dispersos en una lectura ejecutiva y accionable. En vez de mostrar datos crudos, calcula y presenta:

| Área | Resultado |
|---|---|
| Movilidad | KPIs, estaciones críticas, disponibilidad y ranking operativo |
| Sostenibilidad | kilómetros de red, segmentos y nodos |
| Comercio | zonas priorizadas, score de oportunidad y riesgo |
| IA urbana | respuestas contextualizadas y recomendaciones |
| Personalización | preferencias, memoria y entrenamiento por usuario |
| Seguridad API | CORS configurable, rate limiting, sanitización y headers de seguridad |

---

## Demo y funcionamiento

La aplicación expone el frontend desde Express. Flujo general:

```text
Navegador
   ↓
Frontend estático
   ↓
Express API
   ↓
Servicios de dominio
   ├── Movilidad
   ├── Sostenibilidad
   ├── Comercio
   ├── Chatbot
   ├── Memoria/RAG
   └── Recomendaciones
        ↓
Datos locales JSON

              └──> OpenAI Responses API (opcional)
```

### Flujo de una consulta al chatbot

```text
Mensaje del usuario
        ↓
Identificación del usuario
        ↓
Clasificación de intención
        ↓
Carga de preferencias y memoria
        ↓
Búsqueda de conocimiento personal
        ↓
Snapshot urbano
        ↓
Motor de recomendaciones
        ↓
OpenAI (opcional)
   o fallback local determinista
        ↓
Respuesta + contexto + recomendaciones
        ↓
Persistencia en memoria de la demo
```

---

## Funcionalidades principales

### Dashboard territorial

La pantalla principal ofrece una lectura ejecutiva con:

- índice global de ciudad
- KPIs por capa
- insights accionables
- ranking operativo
- mapa interactivo (Leaflet)
- leyendas y contexto por capa

### Movilidad

Procesa datasets GBFS locales para estaciones y bicicletas. Normaliza a la estructura del proyecto con:

- identificador de estación
- nombre
- latitud / longitud
- capacidad
- bicicletas disponibles
- estado operativo
- distancia respecto a una localización

### Sostenibilidad

El backend, a partir del inventario de carriles bici:

- interpreta geometrías `LINESTRING`
- convierte coordenadas UTM → lat/lon
- estima longitudes de segmentos
- genera representación ligera para map
- calcula indicadores y nodos sostenibles

### Oportunidad comercial

Define clusters geográficos y calcula un **score de oportunidad** usando movilidad y demanda, permitiendo ordenar zonas por:

- oportunidad
- flujo potencial
- ocupación
- disponibilidad de bicicletas
- riesgo de saturación

### STV Urban AI

Áreas de la interfaz:

1. **Chat** — consultas movilidad/ambiente/ocio
2. **Entrenar** — notas, preferencias y correcciones
3. **Preferencias** — configuración del asistente

Dominios internos:

```text
mobility
environment
social
general
```

Preferencias soportadas (ej.): rutas seguras, evitar contaminación, minimizar ruido, preferencia por ambientes tranquilos o premium, presupuesto y distancia máxima a pie.

---

## Arquitectura del proyecto

Estructura principal:

```text
STV primera version/
│
├── Backend/
│   ├── config/
│   │   └── appConfig.js
│   ├── data/
│   │   ├── csv/
│   │   └── json/
│   ├── loaders/
│   │   ├── jsonLoader.js
│   │   └── loader.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── rateLimiter.js
│   │   └── security.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── routes/
│   │   ├── biciRoutes.js
│   │   ├── ciudadRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── memoryRoutes.js
│   │   ├── recommendationRoutes.js
│   │   ├── trainRoutes.js
│   │   ├── urbanRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   ├── biciService.js
│   │   ├── chatMemoryRepository.js
│   │   ├── chatbotService.js
│   │   ├── ciudadService.js
│   │   ├── insightsBiciService.js
│   │   ├── openaiService.js
│   │   ├── ragService.js
│   │   ├── recommendationService.js
│   │   └── urbanContextService.js
│   ├── tests/
│   │   ├── chatbotService.test.js
│   │   └── ciudadService.test.js
│   ├── Logica.js
│   ├── package.json
│   └── package-lock.json
│
├── Frontend/
│   ├── css/
│   │   └── estilos.css
│   ├── img/
│   │   └── favicon.png
│   ├── js/
│   │   └── Logica.js
│   └── Alfa.html
│
├── docs/
│   └── urban-chatbot-architecture.md
│
├── .gitignore
└── README.md
```

---

## Stack tecnológico

**Frontend:** HTML5, CSS3, JavaScript (ES Modules), Leaflet 1.9.4, diseño responsive

**Backend:** Node.js, Express 5, CORS, `csv-parser`, API REST, SSE para `/api/chat/stream`

**IA:** motor local determinista (fallback), clasificación basada en reglas, recuperación léxica y entrenamiento, integración opcional con OpenAI Responses API

**Persistencia:** esquema Prisma (PostgreSQL) definido, aunque la demo usa memoria en proceso

---

## Requisitos

- Node.js 18 o superior
- npm
- navegador moderno con soporte ES Modules

No es necesario instalar PostgreSQL, Redis ni una base vectorial para ejecutar la demo.

---

## Instalación

Clona el repositorio y entra en el backend:

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_REPOSITORIO>/Backend
npm install
```

Arranca el servidor:

```bash
npm start
```

La aplicación estará disponible en:

```text
http://localhost:3000
```

Express sirve `Frontend/` automáticamente. También puedes abrir `Frontend/Alfa.html` con Live Server (API: `http://127.0.0.1:3000/api`).

---

## Configuración mediante variables de entorno

| Variable | Por defecto | Descripción |
|---|---:|---|
| `PORT` | `3000` | Puerto del servidor Express |
| `NODE_ENV` | `development` | Entorno de ejecución |
| `OPENAI_API_KEY` | (vacío) | Activa la integración con OpenAI |
| `OPENAI_MODEL` | `gpt-5` | Modelo utilizado por la integración OpenAI |
| `CORS_ORIGIN` | (vacío) | Orígenes permitidos (coma-separados) |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Ventana temporal del rate limiter |
| `RATE_LIMIT_MAX` | `120` | Máximo de peticiones por usuario/ruta |

Ejemplo `.env`:

```env
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=tu_clave
OPENAI_MODEL=gpt-5
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:5500
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120
```

> Seguridad: no subas un `.env` real al repositorio. `.gitignore` ya contempla `.env`.

---

## API REST

### Estado

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/health` | Comprueba que la API está operativa |

### Dashboard urbano

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/ciudad/resumen` | Resumen ejecutivo global |
| `GET` | `/api/ciudad/movilidad` | KPIs e insights de movilidad |
| `GET` | `/api/ciudad/sostenibilidad` | Red ciclista y nodos sostenibles |
| `GET` | `/api/ciudad/comercio` | Zonas y score de oportunidad |

### Bicicletas

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/bicis/mapa` | Información preparada para representar estaciones |
| `GET` | `/api/bicis/resumen` | Resumen operativo de bicicletas y estaciones |
| `GET` | `/api/bike-stations` | Estaciones urbanas |

### IA y chatbot

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/chat` | Envía un mensaje al asistente |
| `POST` | `/api/chat/stream` | SSE para streaming preparado |
| `GET` | `/api/chat/conversations` | Lista conversaciones del usuario |
| `GET` | `/api/chat/conversations/:id` | Obtiene una conversación |
| `POST` | `/api/train` | Añade entrenamiento personalizado |
| `GET` | `/api/train` | Lista entrenamientos del usuario |
| `GET` | `/api/memory` | Recupera memoria y favoritos |
| `POST` | `/api/memory` | Añade memoria explícita |
| `POST` | `/api/memory/favorites` | Guarda un favorito |
| `GET` | `/api/recommendations` | Genera recomendaciones según contexto |

### Usuario

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/user/me` | Usuario y preferencias actuales |
| `GET` | `/api/user/preferences` | Obtiene preferencias |
| `PUT` | `/api/user/preferences` | Actualiza preferencias |

### Contexto urbano

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/air-quality` | Zonas de calidad ambiental estimada |
| `GET` | `/api/social-zones` | Zonas sociales priorizadas |

---

## Ejemplos de uso de la API

### Health check

```bash
curl http://localhost:3000/api/health
```

Respuesta de ejemplo:

```json
{
  "status": "ok",
  "service": "STV API",
  "timestamp": "2026-09-05T13:46:32.865Z"
}
```

### Consulta al chatbot

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-user" \
  -d '{
    "message": "Quiero estaciones con bicicletas disponibles cerca",
    "location": {
      "lat": 43.4623,
      "lon": -3.80998
    }
  }'
```

### Entrenamiento

```bash
curl -X POST http://localhost:3000/api/train \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-user" \
  -d '{
    "type": "preference",
    "content": "Prefiero ocio tranquilo y evitar zonas con mucho ruido.",
    "tags": ["ocio", "ruido"],
    "favorite": true
  }'
```

### Preferencias

```bash
curl -X PUT http://localhost:3000/api/user/preferences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-user" \
  -d '{
    "social": { "vibe": "tranquilo" },
    "mobility": { "preferSafeRoutes": true },
    "environment": { "avoidHighPollution": true }
  }'
```

---

## Autenticación de la demo

La demo incluye una resolución de usuario simple para pruebas. Usuarios incluidos:

```
Bearer demo-user
Bearer demo-admin
```

Admite también `x-user-id` para crear usuarios sandbox dinámicos.

> Importante: esto NO es un sistema de identidad de producción; está pensado para demo.

Próxima evolución: JWT firmado, refresh tokens, RBAC, sesiones y auditoría.

---

## Memoria y RAG

Implementa RAG básico por búsqueda léxica local. Proceso:

```text
Consulta
   ↓
tokenización
   ↓
comparación contra memoria + training
   ↓
score textual
   ↓
ordenación por relevancia
   ↓
contexto privado del usuario
```

Tipos de conocimiento: `note`, `correction`, `preference`, `document`.

Evolución prevista: campos `vector` en Prisma para migrar a PostgreSQL+pgvector, Qdrant, Pinecone, Weaviate, etc.

---

## Datos

### JSON usados por la demo

En `Backend/data/json/` (ejemplos):

```text
carril_bici.json
free_bike_status.json
station_information.json
system_hours.json
system_pricing_plans.json
vehicle_types.json
```

El loader carga automáticamente los `.json` disponibles al iniciar.

### CSV disponibles

En `Backend/data/csv/` hay datasets con consumo horario, códigos postales, autoconsumo, puntos de recarga, etc. Nota: la demo procesa principalmente JSON.

---

## Consideración importante para GitHub: archivos grandes

Algunos CSV superan 100 MB. Revisa antes de `git push`:

```
Backend/data/csv/1-consumo-horario-por-codigo-postal-5-digitos-begasa.csv
Backend/data/csv/1-consumo-horario-por-codigo-postal-5-digitos-e-redes.csv
```

Se recomienda Git LFS:

```bash
git lfs install
git lfs track "Backend/data/csv/*.csv"
git add .gitattributes
git add .
git commit -m "docs: add advanced project documentation"
git push
```

O mantener datasets pesados fuera del repo y documentar su obtención.

---

## Seguridad implementada

Medidas incluidas:

- `x-powered-by` desactivado
- cabeceras de seguridad
- CORS configurable
- validación de origen en peticiones que modifican estado
- sanitización recursiva del body
- límite JSON de `1mb`
- rate limiting por usuario/ruta
- separación de memoria, preferencias y conversaciones por `userId`

Rate limiter por defecto:

```text
Ventana: 60 segundos
Límite: 120 peticiones por usuario/ruta
```

Pendientes para producción: autenticación JWT/OIDC, KMS para secretos, auditoría, cifrado, políticas GDPR, moderación, rate limiting distribuido (Redis), observabilidad.

---

## Pruebas

Ejecuta:

```bash
npm test
```

Suite actual: **9 tests**, todas pasando en la revisión.

Cobertura funcional (resumen): chatbot (respuestas, entrenamiento, aislamiento), ciudad (UTM→lat/lon, capas, ranking).

Salida esperada:

```text
9 tests
9 passed
0 failed
```

---

## Integración con OpenAI

Archivo: `Backend/services/openaiService.js`

Si `OPENAI_API_KEY` NO está definida → fallback local determinista.

Si la clave existe:

1. Construcción del contexto urbano
2. Incorporación de preferencias y conocimiento privado
3. Envío a OpenAI Responses API
4. Integración de la respuesta en el pipeline del chatbot

---

## Modelo de datos preparado para producción

`Backend/prisma/schema.prisma` incluye modelos: User, UserPreferences, Conversation, Message, AiMemory, TrainingItem, Favorite, UrbanDataPoint, ContextHistory, Recommendation, AuditLog.

Relaciones clave basadas en `userId` para aislamiento y trazabilidad.

---

## Limitaciones conocidas de esta versión

| Área | Estado actual | Evolución |
|---|---|---|
| Persistencia | memoria en proceso | PostgreSQL + Prisma |
| RAG | búsqueda léxica | embeddings + vector DB |
| Auth | usuarios demo | JWT/OIDC |
| Rate limit | memoria local | Redis/distribuido |
| Streaming | endpoint SSE preparado | tokens/chunks reales |
| Datos urbanos | snapshots locales | APIs/ingestas programadas |
| IA | OpenAI opcional + fallback | proveedor configurable + observabilidad |
| Escalado | proceso Express único | API stateless + workers |

---

## Roadmap técnico

### Fase 1 — Demo actual

- Dashboard territorial
- Mapa interactivo
- KPIs e insights
- Recomendaciones
- Chatbot urbano
- Entrenamiento de usuario
- Memoria privada
- Tests automatizados
- Integración OpenAI opcional

### Fase 2 — Persistencia real

- PostgreSQL + Prisma
- Redis
- gestión de usuarios
- auditoría
- persistencia de conversaciones y memoria

### Fase 3 — IA avanzada

- embeddings
- vector search
- RAG híbrido
- re-ranking
- herramientas del agente
- respuestas con streaming real

### Fase 4 — Datos urbanos en tiempo real

- APIs municipales
- OpenStreetMap/Overpass
- meteorología
- tráfico
- eventos
- actualización por jobs/workers

### Fase 5 — Producción

- despliegue contenerizado
- CI/CD
- observabilidad
- escalado horizontal
- gestión centralizada de secretos
- seguridad reforzada
- cumplimiento y gobierno de datos

---

## Arquitectura de referencia para producción

```mermaid
flowchart LR
    U[Web / Mobile] --> API[Express API]
    API --> AUTH[Auth / JWT / RBAC]
    API --> CHAT[Chat Orchestrator]
    API --> URBAN[Urban Data Service]
    CHAT --> MEM[Private Memory]
    CHAT --> RAG[RAG Retriever]
    CHAT --> REC[Recommendation Engine]
    CHAT --> LLM[LLM Provider]
    MEM --> PG[(PostgreSQL)]
    RAG --> VDB[(Vector DB)]
    URBAN --> REDIS[(Redis)]
    URBAN --> SOURCES[Municipal / OSM / Weather / Events]
    API --> AUDIT[Audit Logs]
```

Archivo `docs/urban-chatbot-architecture.md` contiene más detalles.

---

## Scripts disponibles

Desde `Backend/`:

```bash
npm start
```

Arranca la API y sirve el frontend.

```bash
npm test
```

Ejecuta la suite de pruebas.

---

## Estructura conceptual del backend

```text
Logica.js
   │
   ├── middleware
   │     ├── auth
   │     ├── security
   │     └── rateLimiter
   │
   ├── routes
   │   └── HTTP/API
   │
   └── services
         ├── reglas de negocio
         ├── contexto urbano
         ├── IA
         ├── memoria
         └── recomendaciones
```

---

## Caso de uso de ejemplo

```text
1. El usuario abre STV.
2. El dashboard carga el resumen de Santander.
3. Cambia a la capa “Movilidad”.
4. Consulta estaciones disponibles.
5. Abre STV Urban AI.
6. Pregunta por una ruta segura.
7. El asistente identifica la intención “mobility”.
8. Recupera sus preferencias.
9. Consulta el snapshot urbano.
10. Genera recomendaciones.
11. Guarda el mensaje y, si procede, aprende la preferencia indicada.
```

---

## Estado del proyecto

**Estado:** funcional / demo avanzada / arquitectura preparada para evolución.

Adecuado para: demostraciones técnicas, portfolio, presentaciones académicas, validación de concepto y prototipos.

---

## Autoría

**STV Team — Santander Territorio Vivo**

Proyecto de tecnologías web, análisis urbano e IA.

---

## Licencia

ISC

> Antes de publicar datasets de terceros, revisa y documenta licencias y condiciones de uso.
