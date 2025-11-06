# Este Dockerfile reutiliza os builds dos Dockerfiles individuais
# Construindo as imagens do backend e frontend e combinando em uma única imagem

# Stage 1: Construir backend usando o Dockerfile do backend
FROM node:20-alpine AS backend-builder
RUN apk add --no-cache openssl
WORKDIR /app

# Seguir a mesma lógica do apps/backend/Dockerfile
COPY apps/backend/package.json ./
COPY apps/backend/prisma ./prisma/
RUN npm install
COPY apps/backend ./
RUN npx prisma generate
RUN npm run build

# Stage 2: Construir frontend usando a mesma lógica do apps/frontend/Dockerfile
FROM node:20-alpine AS frontend-deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY apps/frontend/package.json ./
RUN npm install

FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY --from=frontend-deps /app/node_modules ./node_modules
COPY apps/frontend ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Imagem final combinando backend e frontend
# Reutiliza a estrutura de produção dos Dockerfiles individuais
FROM node:20-alpine AS production
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

ENV DATABASE_URL=file:/app/backend/prisma/db/todomanager.db
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar backend (seguindo apps/backend/Dockerfile stage production)
WORKDIR /app/backend
COPY apps/backend/package.json ./
COPY apps/backend/prisma ./prisma/
COPY --from=backend-builder /app/package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi
COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/documentation ./documentation
RUN npx prisma generate
RUN mkdir -p ./prisma/db && chmod 755 ./prisma/db
COPY apps/backend/prisma/db/todomanager.db ./prisma/db/todomanager.db
RUN chmod 664 ./prisma/db/todomanager.db && \
    chmod 755 ./prisma/db

# Copiar frontend (seguindo apps/frontend/Dockerfile stage runner)
WORKDIR /app/frontend
COPY --from=frontend-builder /app/.next/standalone ./
COPY --from=frontend-builder /app/.next/static ./.next/static

# Expor portas
EXPOSE 3000 3001

# Health check (do apps/backend/Dockerfile)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Iniciar ambos os serviços usando comando inline
# Usa sh -c para executar ambos os processos em paralelo
CMD sh -c "cd /app/backend && node dist/index.js & cd /app/frontend && PORT=3001 HOSTNAME=0.0.0.0 node server.js & wait"
