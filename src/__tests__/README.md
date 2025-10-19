# Tests

Comprehensive test suite for the Bookstore API using Jest and Supertest.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run a specific test file
npm test -- authors.test.ts

# Run tests matching a pattern
npm test -- --testNamePattern="should create"
```

## Test Configuration

The tests are configured to:
- Run serially (`maxWorkers: 1`) to avoid database conflicts
- Clean up the database before each test
- Suppress logs during test execution (NODE_ENV=test)
- **Use a real database via Prisma** (not mocked)

### Database Testing Approach

**The tests use a real PostgreSQL database**, not in-memory mocks. This is intentional because:
- ✅ **Realistic**: Tests actual database constraints, relations, and behavior
- ✅ **Complete**: Tests the full stack including Prisma client
- ✅ **Reliable**: Avoids mock/implementation drift
- ✅ **Simple**: No complex mocking infrastructure needed

**⚠️ IMPORTANT**: Configure a separate test database to avoid data loss!

### Setting Up a Test Database

1. Create a separate test database:
   ```sql
   CREATE DATABASE bookstore_test;
   ```

2. Set `DATABASE_URL` for tests in your `.env.test` file:
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/bookstore_test"
   ```

3. Run migrations on the test database:
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/bookstore_test" npx prisma migrate deploy
   ```

## Notes

- **Database is cleaned between each test** using `deleteMany()` in `beforeEach`
- The test suite includes both positive and negative test cases
- Error logs in test output are expected for tests that verify error handling
- Tests run serially to prevent race conditions on shared database

