// Set DATABASE_URL before importing prisma
process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5433/bookstore_test";

import { prisma } from "../lib/prisma.js";
import { isTestDatabaseRunning, getTestDatabaseMessage } from "../utils/test-db-check.js";

// Check if test database is running before running tests
if (!isTestDatabaseRunning()) {
  console.error(getTestDatabaseMessage());
  process.exit(1);
}

// Suppress console logs during tests
beforeAll(async () => {
  // Set NODE_ENV to test to suppress pino logs
  process.env.NODE_ENV = "test";
  
  // Clean up database before tests
  await prisma.book.deleteMany({});
  await prisma.author.deleteMany({});
  await prisma.category.deleteMany({});
});

afterAll(async () => {
  // Clean up and close connection after tests
  await prisma.book.deleteMany({});
  await prisma.author.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.$disconnect();
  
  // Close Redis and BullMQ connections
  const { redis } = await import("../lib/redis.js");
  const { reportQueue } = await import("../infra/queues/bullmq.js");
  await reportQueue.close();
  await redis.quit();
});

beforeEach(async () => {
  // Clean up between tests
  await prisma.book.deleteMany({});
  await prisma.author.deleteMany({});
  await prisma.category.deleteMany({});
});

