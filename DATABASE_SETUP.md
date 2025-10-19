# Database Setup

This project uses two separate PostgreSQL databases:

## 🟢 Development Database (Port 5432)

**Auto-starts** when you run `npm run dev`

- Container: `bookstore_db`
- Database: `bookstore`
- Port: `5432`
- Connection: `postgresql://postgres:postgres@localhost:5432/bookstore`

### Usage
```bash
npm run dev              # Automatically starts dev DB and runs server
```

### Manual Control
```bash
docker compose up -d     # Start manually
docker compose down      # Stop manually
```

---

## 🔵 Test Database (Port 5433)

**Manual lifecycle** - you control when it starts/stops

- Container: `bookstore_test_db`
- Database: `bookstore_test`
- Port: `5433`
- Connection: `postgresql://postgres:postgres@localhost:5433/bookstore_test`
- Storage: In-memory (tmpfs) for speed

### Usage

```bash
# 1. Start test database
npm run test:db start

# 2. Run tests as many times as needed
npm test
npm test:watch
npm test:coverage

# 3. Stop when done
npm run test:db stop
```

### Commands
```bash
npm run test:db start    # Start test DB
npm run test:db stop     # Stop test DB
npm run test:db restart  # Fresh restart
npm run test:db status   # Check status
```

---

## Key Features

### Development Database
- ✅ Auto-starts with `npm run dev`
- ✅ Persistent data (uses Docker volume)
- ✅ Single database for all dev work

### Test Database
- ✅ Manual lifecycle control
- ✅ Health check prevents tests running without DB
- ✅ In-memory storage (faster, isolated)
- ✅ Separate from dev DB (no conflicts)
- ✅ Auto-runs migrations on start

---

## What Happens If...

### You run `npm test` without starting test DB?
```
❌ Test database is not running

To start the test database, run:
  npm run test:db start

Then run your tests with:
  npm test
```
Tests exit immediately with this helpful message.

### You run `npm run dev` without dev DB?
The `predev` script automatically starts it for you! 🎉

### Both databases are running?
No problem! They run on different ports:
- Dev: `5432`
- Test: `5433`

---

## Environment Variables

The `.env` file contains:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bookstore"
NODE_ENV="development"
```

Test commands override this with:
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/bookstore_test
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Start test DB | `npm run test:db start` |
| Run tests | `npm test` |
| Stop test DB | `npm run test:db stop` |
| Check test DB status | `npm run test:db status` |

