# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install OpenSSL
RUN apk add --no-cache openssl

# Root workspace files
COPY package.json .
COPY yarn.lock .
COPY turbo.json .

# Copy packages (shared deps)
COPY packages/ ./packages/

# Copy specific service
COPY apps/hooks/ ./apps/hooks/

# Install & build
RUN yarn install
RUN yarn turbo build --filter=hooks...

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

# Install OpenSSL
RUN apk add --no-cache openssl

# Copy built files from builder stage to final image
COPY --from=builder /app/apps/hooks/dist ./dist
COPY --from=builder /app/apps/hooks/package.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "dist/index.js"]