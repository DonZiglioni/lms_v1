# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1

# --- Build Stage ---
FROM node:22.13.1-bullseye-slim AS builder

WORKDIR /app

# Install OS dependencies for Prisma and Next.js (if needed)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openssl \
    libssl1.1 \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy only package.json and package-lock.json for dependency install
COPY --link package.json package-lock.json ./

COPY .env .env

COPY prisma/schema.prisma ./prisma/schema.prisma

# Install dependencies with cache
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the application code
COPY --link . .

# Generate Prisma client (postinstall runs this, but ensure it's available for build)
RUN npx prisma generate


# Build the Next.js app
RUN --mount=type=cache,target=/root/.npm \
    npm run build

# Remove dev dependencies for production
RUN npm prune --production

# --- Production Stage ---
FROM node:22.13.1-bullseye-slim AS final
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --ingroup appgroup appuser

# Copy only necessary files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
# COPY --from=builder /app/next.config.js ./  # If present
COPY --from=builder /app/next.config.ts ./ 
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/next-env.d.ts ./
COPY --from=builder /app/tsconfig.json ./
# COPY --from=builder /app/next.config.mjs ./  # If present

# Copy any other files Next.js needs at runtime (e.g., middleware, etc.)
COPY --from=builder /app/middleware.ts ./
COPY --from=builder /app ./

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Expose the port Next.js runs on
EXPOSE 3000

USER appuser

CMD ["npm", "start"]
