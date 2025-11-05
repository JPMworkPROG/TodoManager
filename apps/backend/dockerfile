# Stage 1: Build
FROM node:20-alpine AS builder

# Install OpenSSL required by Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package.json ./
COPY prisma ./prisma/

# Install dependencies and generate package-lock.json
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

# Install OpenSSL required by Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package.json from context
COPY package.json ./
COPY prisma ./prisma/

# Copy package-lock.json from builder (generated during npm install)
# Use fallback to npm install if lock file doesn't exist
COPY --from=builder /app/package-lock.json* ./

# Install only production dependencies
# Use npm ci if package-lock.json exists, otherwise use npm install
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Set DATABASE_URL environment variable (needed for Prisma)
# Using absolute path to avoid issues with relative paths in Docker
ENV DATABASE_URL=file:/app/prisma/db/todomanager.db

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/documentation ./documentation

# Generate Prisma Client in production image
# npx will download prisma CLI if needed
RUN npx prisma generate

# Copy pre-configured SQLite database (created before building the image)
# The database should be created locally with: npm run db:prepare
# Create directory first with proper permissions
RUN mkdir -p ./prisma/db && chmod 755 ./prisma/db

# Copy database file (will fail if file doesn't exist - ensure it's created before build)
COPY prisma/db/todomanager.db ./prisma/db/todomanager.db

# Ensure the database file and directory have correct permissions (read/write for SQLite)
# SQLite needs write permissions on the directory for temporary files
RUN chmod 664 ./prisma/db/todomanager.db && \
    chmod 755 ./prisma/db && \
    ls -la ./prisma/db/

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["npm", "start"]

