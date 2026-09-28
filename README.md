# Eventos — API de Plataforma de Eventos e Inscripciones

API backend construida con Node.js, Express y MongoDB (Mongoose) para gestionar usuarios, eventos e inscripciones. Es el proyecto base sobre el que se va a trabajar durante todo el curso de Backend II, incorporando en cada módulo autenticación, roles, autorización, arquitectura por capas y buenas prácticas de una API profesional.

## Temática elegida

Plataforma de eventos e inscripciones: permite administrar eventos (charlas, workshops, meetups, etc.), gestionar los usuarios que participan de la plataforma y llevar el registro de quién se inscribe a cada evento. Cada estudiante puede adaptar la temática a su propio proyecto (eventos musicales, torneos, cursos, ferias, etc.); la estructura técnica es la misma en todos los casos.

## Tecnologías utilizadas

- Node.js (módulos ESM)
- Express
- MongoDB + Mongoose
- dotenv
- bcrypt (hash de contraseñas)

## Instalación

```bash
git clone <url-del-repositorio>
cd codigo
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto (usar `.env.example` como referencia) con las siguientes variables:

| Variable      | Descripción                                   |
|---------------|------------------------------------------------|
| `PORT`        | Puerto donde se levanta el servidor            |
| `MONGO_URL`   | Cadena de conexión a MongoDB                   |

`NODE_ENV` y `JWT_SECRET` se incorporan a partir del módulo de autenticación (login con JWT, clase 3) y todavía no se usan.

## Cómo ejecutar el servidor

```bash
npm run dev     # levanta el servidor con recarga automática
npm start       # levanta el servidor en modo normal
```

El servidor queda disponible en `http://localhost:<PORT>`.

## Estructura de carpetas

```
src/
├── server.js          # arranque del servidor y conexión a la base de datos
├── config/            # configuración (conexión a MongoDB, variables de entorno)
├── routes/            # definición de endpoints
├── controllers/        # reciben la request y devuelven la response
├── services/            # lógica de negocio (por ahora solo user.service.js, de ejemplo)
├── repositories/        # acceso al dominio por encima del DAO (vacía por ahora)
├── dao/                 # acceso directo a Mongoose (vacía por ahora)
├── dto/                 # forma de los datos expuestos al cliente (vacía por ahora)
├── models/             # schemas de Mongoose
├── middlewares/         # validaciones y lógica intermedia
└── utils/               # funciones reutilizables
app.js                   # configuración de la app de Express
```

`services/`, `repositories/`, `dao/` y `dto/` ya existen como carpetas desde la Pre-entrega 1, tal como lo pide el SAD del proyecto. `repositories/`, `dao/` y `dto/` siguen vacías (con `.gitkeep`); `services/` tiene un primer ejemplo (`user.service.js`, con `getUserByEmail`) que ya usa `session.controller.js` para el registro. La migración completa del resto de la lógica a estas capas se hace recién en clase 8.

## Roles disponibles

El proyecto está preparado para trabajar con tres roles, que se implementan a partir del módulo de autorización:

- **admin**: gestiona usuarios, categorías, eventos e inscripciones.
- **organizer**: crea y administra eventos.
- **user**: consulta eventos y se inscribe o reserva su lugar.

## Endpoints principales

| Método | Endpoint            | Descripción                              |
|--------|---------------------|-------------------------------------------|
| GET    | `/api/health`        | Verifica que el servidor está activo      |
| GET    | `/api/users`          | Lista los usuarios registrados            |
| POST   | `/api/users`          | Crea un usuario                           |
| GET    | `/api/events`         | Lista los eventos disponibles             |
| POST   | `/api/events`         | Crea un evento                            |
| POST   | `/api/sessions/register` | Registra un usuario nuevo: valida campos obligatorios, normaliza el email, rechaza emails duplicados y guarda la contraseña hasheada con bcrypt |

Login, JWT y la ruta `/api/sessions/current` se incorporan en clase 3.

## Registro de usuarios (`POST /api/sessions/register`)

Recibe `first_name`, `last_name`, `email` y `password` en el body. El `role` nunca se toma del body: todo registro público queda con `role: 'user'`.

```bash
curl -X POST http://localhost:3001/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Sofía","last_name":"García","email":"sofia@email.com","password":"123456"}'
```

Respuestas posibles:

| Código | Cuándo |
|--------|--------|
| 201    | Usuario creado. La respuesta nunca incluye la contraseña, ni siquiera hasheada. |
| 400    | Falta algún campo obligatorio. |
| 409    | Ya existe un usuario registrado con ese email. |

## Ejemplo de uso

```bash
curl http://localhost:3001/api/health
# { "status": "up", "message": "Servidor activo y operando correctamente." }

curl http://localhost:3001/api/events
# { "message": [] }
```

## Estado del proyecto

Pre-entrega 1 (estructura por capas, variables de entorno, endpoints base) y Pre-entrega 2 (modelo `User` completo, registro seguro con validaciones y hash de contraseñas con bcrypt) implementadas. Login, JWT, cookies, Passport, roles y autorización se van a ir incorporando módulo a módulo en las próximas clases.
