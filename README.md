# Grocery Pro — Frontend

Aplicación web para gestión de listas de compras. Construida con **Next.js 15**, **TypeScript** y **Tailwind CSS**.

---

## Inicio rápido (sin Docker)

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local y ajusta NEXT_PUBLIC_API_URL al puerto de tu backend

# Arrancar en desarrollo
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Docker (ejemplo académico)

> **Nota:** Docker es opcional. El frontend Next.js corre fuera de Docker;  
> los contenedores solo gestionan el **backend Express** y **PostgreSQL**.

### Estructura de archivos Docker

```
grocery-pro-1/               ← este repo (frontend)
├── docker/
│   └── backend/
│       └── Dockerfile       ← imagen del backend Express + TypeScript
├── docker-compose.yml       ← orquesta backend + postgres
└── .env.example             ← variables necesarias
```

### Prerrequisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- El repositorio del **backend** clonado en la carpeta hermana `grocery-pro-backend/`

```
proyectos/
├── grocery-pro-1/           ← frontend (este repo)
└── grocery-pro-backend/     ← backend Express
```

### Paso a paso

```bash
# 1. Crear el archivo de variables de entorno
cp .env.example .env

# 2. Editar .env con tus valores reales (contraseñas, JWT_SECRET, etc.)
#    En Windows puedes abrirlo con el bloc de notas:
notepad .env

# 3. Construir las imágenes y levantar los servicios
docker compose up --build

# El backend queda en  → http://localhost:4000
# PostgreSQL queda en  → localhost:5432
```

### Comandos útiles

```bash
# Levantar en segundo plano (modo detached)
docker compose up -d

# Ver logs en tiempo real
docker compose logs -f backend
docker compose logs -f postgres

# Detener todos los servicios
docker compose down

# Detener Y borrar los datos de la base de datos
docker compose down -v

# Entrar a la consola del contenedor del backend
docker compose exec backend sh

# Correr migraciones manualmente dentro del contenedor
docker compose exec backend npx prisma migrate deploy

# Abrir Prisma Studio (cliente visual de BD) dentro del contenedor
docker compose exec backend npx prisma studio
```

### ¿Qué hace cada servicio?

| Servicio   | Imagen base        | Puerto | Descripción                          |
|------------|--------------------|--------|--------------------------------------|
| `postgres`  | `postgres:16-alpine` | 5432   | Base de datos relacional             |
| `backend`   | `node:20-alpine`     | 4000   | API REST Express + Prisma            |

### Variables de entorno principales

| Variable           | Descripción                               | Ejemplo                        |
|--------------------|-------------------------------------------|--------------------------------|
| `DB_USER`          | Usuario de PostgreSQL                     | `grocery_user`                 |
| `DB_PASSWORD`      | Contraseña de PostgreSQL                  | `mi_password_seguro`           |
| `DB_NAME`          | Nombre de la base de datos                | `grocery_pro`                  |
| `JWT_SECRET`       | Clave secreta para firmar tokens JWT      | cadena larga y aleatoria       |
| `JWT_EXPIRES_IN`   | Duración del token                        | `7d`                           |
| `NEXT_PUBLIC_API_URL` | URL del backend que usa el frontend    | `http://localhost:4000`        |

### Conceptos clave (para el aprendizaje)

**¿Por qué dos etapas en el Dockerfile?**  
La etapa `builder` compila el TypeScript. La etapa `runner` solo copia el JavaScript compilado, resultando en una imagen ~60% más liviana.

**¿Por qué `healthcheck` en postgres?**  
El backend intenta conectarse a la base de datos al arrancar. El `healthcheck` hace que Docker espere hasta que PostgreSQL esté realmente listo antes de iniciar el backend (`depends_on: condition: service_healthy`).

**¿Por qué `volumes` en postgres?**  
Sin un volumen, al hacer `docker compose down` perderías todos los datos. El volumen nombrado `postgres_data` persiste los datos en el host.

---

## Stack tecnológico

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Express.js, TypeScript, Prisma ORM
- **Base de datos:** PostgreSQL 16
- **Auth:** JWT (JSON Web Tokens)
- **Contenedores:** Docker + Docker Compose

## Aprende más

- [Documentación de Next.js](https://nextjs.org/docs)
- [Docker Compose reference](https://docs.docker.com/compose/)
- [Prisma con Docker](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-docker)
