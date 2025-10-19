# Bookstore API

A REST API for managing books, authors, and categories with full CRUD operations, pagination, and search capabilities.

## Tech Stack

- **Runtime:** Node.js 18+ with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Validation:** Zod schemas
- **Testing:** Jest + Supertest
- **Logging:** Pino with structured request logging
- **Dev Tools:** Docker Compose for local PostgreSQL

## Features

- ✅ CRUD operations for Books, Authors, and Categories
- ✅ Many-to-many relationships (Books ↔ Authors, Books ↔ Categories)
- ✅ Pagination and search on all list endpoints
- ✅ Request validation with Zod
- ✅ Structured logging with request IDs
- ✅ Full test coverage with Jest
- ✅ Type-safe database queries with Prisma

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (for PostgreSQL)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment:**
```bash
cp .env.example .env
```

3. **Start PostgreSQL:**
```bash
docker compose up -d
```

4. **Run migrations:**
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. **Seed database (optional):**
```bash
npm run prisma:seed
```

6. **Start development server:**
```bash
npm run dev
```

API will be available at `http://localhost:3000`

## API Endpoints

### Health Check
```
GET /health
```

### Authors
```
POST   /authors                    # Create author
GET    /authors                    # List authors (paginated, searchable)
```

### Categories
```
POST   /categories                 # Create category
GET    /categories                 # List categories (paginated, searchable)
```

### Books
```
POST   /books                      # Create book
GET    /books                      # List books (paginated, filterable by author/category, searchable)
PUT    /books/:id                  # Update book
DELETE /books/:id                  # Delete book
```

### Reports
```
POST   /reports                    # Queue report generation (async)
GET    /reports?userId=:id         # Get cached report
```

## Project Structure

```
src/
├── __tests__/                    # Integration tests
│   ├── authors.test.ts
│   ├── books.test.ts
│   ├── categories.test.ts
│   └── setup.ts
├── di/                           # Dependency injection
│   └── container.ts              # Awilix DI container
├── domain/                       # Business logic layer
│   ├── entities.ts               # Domain entities (Author, Book, Category)
│   ├── repositories.ts           # Repository interfaces
│   └── services/                 # Business logic services
│       ├── author.service.ts
│       ├── book.service.ts
│       ├── category.service.ts
│       └── report.service.ts
├── infra/                        # Infrastructure layer
│   ├── queues/                   # Background job queues
│   │   └── bullmq.ts             # BullMQ queue & worker setup
│   └── repositories/             # Repository implementations
│       └── prisma/               # Prisma ORM repositories
│           ├── author.prisma.repo.ts
│           ├── book.prisma.repo.ts
│           └── category.prisma.repo.ts
├── interfaces/                   # Interface layer
│   ├── http/                     # HTTP controllers
│   │   ├── author.http.ts
│   │   ├── book.http.ts
│   │   ├── category.http.ts
│   │   └── report.http.ts
│   └── worker/                   # Background workers
│       └── report.worker.ts      # Report generation worker
├── lib/                          # Shared utilities
│   ├── logger.ts                 # Pino logger
│   ├── prisma.ts                 # Prisma client
│   └── redis.ts                  # Redis client (maxRetriesPerRequest: null)
├── middleware/                   # Express middleware
│   ├── error.ts                  # Global error handler
│   └── validate.ts               # Zod request validation
├── routes/                       # Route definitions
│   ├── author.routes.ts
│   ├── book.routes.ts
│   ├── category.routes.ts
│   └── report.routes.ts
├── schemas/                      # Zod validation schemas
│   ├── author.ts
│   ├── book.ts
│   ├── category.ts
│   └── report.ts
├── utils/                        # Helper utilities
│   └── test-db-check.ts
├── app.ts                        # Express app setup
└── server.ts                     # Server entry point
```

## Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

- **Domain Layer** (`domain/`): Business logic, entities, and repository interfaces
- **Infrastructure Layer** (`infra/`): External dependencies (database, cache, queues)
- **Interface Layer** (`interfaces/`): HTTP controllers and background workers
- **Dependency Injection**: Awilix container manages all dependencies with singleton/scoped lifecycles

### Background Jobs

The API uses **BullMQ** for async job processing:

1. Client sends `POST /reports` → job queued in Redis
2. API responds with `202 Accepted` immediately
3. Worker process picks up job from Redis queue
4. Report generated and cached in Redis (60s TTL)
5. Client fetches result with `GET /reports?userId=:id`
