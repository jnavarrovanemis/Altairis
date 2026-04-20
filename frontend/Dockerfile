# ETAPA 1: Construcción
FROM node:22-alpine AS build
WORKDIR /app

# Instalamos pnpm
RUN npm install -g pnpm

# Copiamos archivos de configuración de pnpm
COPY package.json pnpm-lock.yaml* ./

# Instalamos dependencias (esto crea el node_modules real en Linux)
RUN pnpm install --frozen-lockfile

# Copiamos el código (el .dockerignore evitará que sobrescribamos node_modules)
COPY . .

# Ejecutamos el build usando pnpm
RUN pnpm run build

# ETAPA 2: Ejecución
FROM node:22-alpine AS runner
WORKDIR /app

# Copiamos lo estrictamente necesario de la etapa anterior
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

# Usamos pnpm para arrancar (más seguro)
CMD ["node_modules/.bin/next", "start"]