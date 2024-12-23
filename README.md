# Zapier Workflow

This project is designed to automate your tasks using a custom workflow similar to Zapier. It leverages modern web technologies to provide a seamless experience for creating and managing automated workflows.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# Tech Stack
- Next.js: For the client-side application.
- Node.js + Express.js: For the server-side application.
- Kafka: For event streaming.
- Webhooks: For real-time notifications and integrations.
- Prisma ORM: For database management and queries.
- PostgreSQL: As the relational database.

PORT
# Ports
Client: http://localhost:3000
Backend: http://localhost:8000
Hooks: http://localhost:8080
Kafka: http://localhost:9092
DB: 5432

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `client`: another [Next.js](http://localhost:3000.org/) app
- `server`: a [Node.js](http://localhost:8000.org/) app
- `hooks`: another [Node.js](http://localhost:8080.org/) app
- `Sweeper`: another [Next.js](http://localhost:9092.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
yarn build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
yarn dev
```