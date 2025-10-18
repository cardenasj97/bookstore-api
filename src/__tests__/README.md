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

## Test Structure

### Test Files

- `authors.test.ts` - Tests for Author endpoints (POST, GET with pagination and search)
- `books.test.ts` - Tests for Book endpoints (POST, GET, PUT, DELETE with relations)
- `categories.test.ts` - Tests for Category endpoints (POST, GET with pagination and search)
- `setup.ts` - Global test setup and teardown (database cleanup)

### Test Coverage

#### Authors API (`/authors`)
- ✅ Create author with name and bio
- ✅ Create author with name only
- ✅ Validation errors (missing/empty name, bio too long)
- ✅ List authors with pagination
- ✅ Search authors by name (case-insensitive)
- ✅ Results ordered by ID descending

#### Categories API (`/categories`)
- ✅ Create category
- ✅ Validation errors (missing/empty name)
- ✅ Duplicate name constraint (409 conflict)
- ✅ List categories with pagination
- ✅ Search categories by name (case-insensitive)
- ✅ Results ordered by ID descending

#### Books API (`/books`)
- ✅ Create book with all fields (title, description, publishedAt, authors, categories)
- ✅ Create book with minimal data (title only)
- ✅ Create book with multiple authors and categories
- ✅ Validation errors (missing title, invalid author/category IDs)
- ✅ List books with pagination
- ✅ Search books by title or description
- ✅ Filter books by author ID
- ✅ Filter books by category ID
- ✅ Combined filters (search + author + category)
- ✅ Update book fields (title, description, publishedAt)
- ✅ Delete book
- ✅ Error handling for non-existent records

## Test Configuration

The tests are configured to:
- Run serially (`maxWorkers: 1`) to avoid database conflicts
- Clean up the database before each test
- Suppress logs during test execution (NODE_ENV=test)
- Use a separate test database (configure via DATABASE_URL in .env)

## Notes

- Tests use the same database as development by default. Consider using a separate test database.
- The test suite includes both positive and negative test cases.
- Error logs in test output are expected for tests that verify error handling.

