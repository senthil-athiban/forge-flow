# image 1
FROM node:20-alpine3.20 AS builder
WORKDIR /app

# Copy the deps
COPY package.json turbo.json yarn.lock ./

# copy the shared deps
COPY packages/ ./packages/

# Copy the specific service
COPY apps/server ./apps/server/

RUN yarn install
RUN yarn turbo build --filter=server...
RUN cd packages/database && npx prisma generate

FROM node:20-alpine3.20
WORKDIR /app
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
RUN cd packages/database && npx prisma generate

EXPOSE 8000

CMD ["node", "dist/index.js"]
