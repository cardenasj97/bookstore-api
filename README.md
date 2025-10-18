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
GET    /authors                    # List authors (paginated)
GET    /authors/:id                # Get author by ID
PUT    /authors/:id                # Update author
DELETE /authors/:id                # Delete author
```

### Categories
```
POST   /categories                 # Create category
GET    /categories                 # List categories (paginated)
GET    /categories/:id             # Get category by ID
PUT    /categories/:id             # Update category
DELETE /categories/:id             # Delete category
```

### Books
```
POST   /books                      # Create book
GET    /books                      # List books (paginated, filterable)
GET    /books/:id                  # Get book by ID
PUT    /books/:id                  # Update book
DELETE /books/:id                  # Delete book
```

## Project Structure

```
src/
├── __tests__/          # Test files
├── controllers/        # Route handlers
├── lib/                # Shared utilities (logger, prisma)
├── middleware/         # Express middleware
├── routes/             # Route definitions
├── schemas/            # Zod validation schemas
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
├── app.ts              # Express app setup
└── server.ts           # Server entry point
```
