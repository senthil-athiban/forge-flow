FROM node:20-alpine3.20 AS builder

WORKDIR /app

COPY package.json yarn.lock turbo.json ./
COPY packages/ ./packages
COPY apps/processor ./apps/processor

RUN yarn install
RUN yarn turbo build --filter=processor...

FROM node:20-alpine3.20
WORKDIR /app
COPY --from=builder /app/apps/processor/dist ./dist
COPY --from=builder /app/apps/processor/package.json .
COPY --from=builder /app/packages      ./packages
COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "dist/index.js"]