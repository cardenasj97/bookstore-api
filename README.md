# Week 1 – Bookstore API (PostgreSQL + Prisma + Express + Zod)

A clean, production-ready starter to practice DB modeling, migrations, validation, pagination, and basic CRUD.

## Stack
- Node 18+, TypeScript, Express
- PostgreSQL + Prisma
- Zod validation
- Docker Compose for local DB

## Getting Started

1) Copy `.env.example` to `.env` and adjust if needed.
```
cp .env.example .env
```

2) Start Postgres:
```
docker compose up -d
```

3) Install deps:
```
pnpm i   # or npm i / yarn
```

4) Generate Prisma client & run migrations:
```
pnpm prisma:generate
pnpm prisma:migrate
```

5) Start the API in dev mode:
```
pnpm dev
```

- Health check: `GET http://localhost:3000/health`

## Endpoints

### Authors
- `POST /authors` – create `{ name, bio? }`
- `GET /authors?page=1&pageSize=10&search=doe`

### Categories
- `POST /categories` – create `{ name }`
- `GET /categories?page=1&pageSize=10&search=sci`

### Books
- `POST /books` – create `{ title, description?, publishedAt?, authorIds?: number[], categoryIds?: number[] }`
- `GET /books?page=1&pageSize=10&search=algorithms&authorId=1&categoryId=2`

All list endpoints return:
```json
{ "items": [...], "page": 1, "pageSize": 10, "total": 42 }
```

## Notes
- Uses Prisma implicit many-to-many relations for `Book <-> Author` and `Book <-> Category`.
- Validation via `zod` in a simple `validate` middleware.
- Add tests with Jest + Supertest as a stretch goal.
