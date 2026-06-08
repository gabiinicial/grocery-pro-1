# ─────────────────────────────────────────────────────────
# ETAPA 1: builder
# Compila el TypeScript y genera el código JavaScript final.
# ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero los archivos de dependencias para aprovechar
# el caché de Docker: si package.json no cambió, no reinstala.
COPY package*.json ./

# Instalamos TODAS las dependencias (incluyendo devDependencies para compilar)
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Genera el cliente de Prisma (ORM) a partir del schema
RUN npx prisma generate

# Compila TypeScript → JavaScript en la carpeta /dist
RUN npm run build


# ─────────────────────────────────────────────────────────
# ETAPA 2: runner (imagen final, más liviana)
# Solo copia lo necesario para producción.
# ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Solo instalamos dependencias de producción
COPY package*.json ./
RUN npm install --omit=dev

# Copiamos el código compilado desde la etapa builder
COPY --from=builder /app/dist ./dist

# Copiamos el schema de Prisma y el cliente generado
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Puerto que expone el backend (debe coincidir con el de tu .env)
EXPOSE 4000

# Antes de iniciar: corre las migraciones pendientes y arranca el servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
