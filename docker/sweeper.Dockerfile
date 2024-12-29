FROM node:20-alpine3.20 AS builder

WORKDIR /app

COPY package.json yarn.lock turbo.json ./
COPY packages/ ./packages
COPY apps/sweeper ./apps/sweeper

RUN yarn install
RUN yarn turbo build --filter=sweeper...
RUN cd packages/database && npx prisma generate

FROM node:20-alpine3.20
WORKDIR /app

COPY --from=builder /app/apps/sweeper/dist ./dist
COPY --from=builder /app/apps/sweeper/package.json .
COPY --from=builder /app/packages      ./packages
COPY --from=builder /app/node_modules ./node_modules
RUN cd packages/database && npx prisma generate

CMD ["node", "dist/index.js"]