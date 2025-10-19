# Database Management Scripts

This directory contains scripts for managing both development and test database lifecycles.

## Development Database

The dev database starts automatically when you run `npm run dev`. It uses the main `docker-compose.yml` file and runs on port 5432.

**Manual control:**
```bash
docker compose up -d    # Start dev DB
docker compose down     # Stop dev DB
```

## Test Database

## Usage

### Start the test database
```bash
npm run test:db start
```

This will:
- Start a PostgreSQL container on port 5433
- Wait for it to be ready
- Run database migrations
- Create a state file to track the database status

### Run tests
```bash
npm test
```

Tests will automatically check if the database is running and exit with an error if it's not.

### Stop the test database
```bash
npm run test:db stop
```

This will stop and remove the test database container and volumes.

### Check status
```bash
npm run test:db status
```

Shows whether the test database is currently running.

### Restart
```bash
npm run test:db restart
```

Stops and starts the database fresh.

## How it works

1. **Separate container**: The test database runs in `bookstore_test_db` on port 5433 (separate from dev db on 5432)
2. **State tracking**: A `.test-db-state.json` file tracks whether the database is running
3. **Health check**: Tests check if the database is running before executing
4. **In-memory option**: The test database uses tmpfs for faster performance
5. **Automatic migrations**: Migrations run automatically when starting the test database

## Test workflow

```bash
# Start the test database once
npm run test:db start

# Run tests as many times as you want
npm test
npm test:watch
npm test:coverage

# When done, stop the database
npm run test:db stop
```

