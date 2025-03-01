# Stage 1: Dependencies
FROM node:20-alpine3.20 AS deps
WORKDIR /app
COPY package.json yarn.lock ./
COPY apps/client/package.json ./apps/client/
COPY packages/ ./packages/
RUN yarn install --frozen-lockfile

# Stage 2: Builder
FROM node:20-alpine3.20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set next.js to output standalone
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn turbo build --filter=client...

# Stage 3: Runner
FROM node:20-alpine3.20 AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create system group and user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built files
COPY --from=builder --chown=nextjs:nodejs /app/apps/client/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/client/.next/static ./apps/client/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/client/public ./apps/client/public

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

ENV NEXT_PUBLIC_BACKEND_DOMAIN=${NEXT_PUBLIC_BACKEND_DOMAIN}
ENV NEXT_PUBLIC_HOOKS_DOMAIN=${NEXT_PUBLIC_HOOKS_DOMAIN}

CMD ["node", "./apps/client/server.js"]