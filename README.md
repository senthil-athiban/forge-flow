# Forge flow

![Forge flow](https://github.com/senthil-athiban/zapier/raw/master/apps/client/public/dash.png)

This project is designed to automate your tasks using a custom workflow similar to Zapier. It leverages modern web technologies to provide a seamless experience for creating and managing automated workflows.

## Architecture

![Architecture Diagram](https://github.com/senthil-athiban/zapier/raw/master/apps/client/public/architecture.png)

## Demo

[Watch Demo Video](https://drive.google.com/file/d/1tKFF3rOvpaRXOhbXXlMmB8WPwDpQR6J3/view?usp=sharing)

## Getting Started
First, Install the dependencies

```bash
yarn
```
run the development server:

```bash
yarn dev
```

# Tech Stack

## Frontend
- Next.js 14: React framework for client-side application
- TailwindCSS: For styling and UI components
- ShadcnUI: For pre-built accessible components

## Backend
- Node.js + Express.js: For server-side application
- Prisma ORM: For database management and queries
- PostgreSQL: As the relational database

## Event-Driven Architecture
- Apache Kafka
  - Message broker for async communication
  - Event streaming between microservices
  - Reliable message delivery with topic partitioning

## Authentication & Authorization
- JWT: Token-based authentication (Access + Refresh tokens)
- Passport.js: OAuth integration
  - Google OAuth2.0
  - GitHub OAuth

## Sweeper Service
- Implements Transactional Outbox pattern
- Monitors outbox table for new events
- Ensures reliable message delivery
- Responsibilities:
  - Extract events from outbox table
  - Publish to Kafka topics
  - Handle failed publications
  - Maintain delivery ordering
  - Prevent dual-write problems

## Processor Service
- Processes workflow executions
- Handles different notification types
- Manages integration endpoints
- Responsibilities:
  - Consume Kafka events
  - Execute workflow actions
    - Slack notifications
    - Discord messages
    - Email sending
  - Handle execution failures
  - Maintain execution logs

## Integrations
- Slack: Workspace and channel management
- Discord: Server and channel integration
- Webhook: Custom HTTP endpoints

## Development Tools
- TypeScript: For type safety
- ESLint: Code linting
- Prettier: Code formatting
- Turborepo: Monorepo management

## Event Flow
```mermaid
    A[Webhook Event] --> B[Webhook Service]
    B --> C[(Database)]
    C --> D[Sweeper Service]
    D --> E[Kafka]
    E --> F[Processor Service]
    F --> G[External Services]
```

# Ports
- Client: http://localhost:3000
- Backend: http://localhost:8000
- Hooks: http://localhost:8080
- Kafka: http://localhost:9092
- DB: 5432

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages
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
