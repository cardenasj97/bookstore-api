import { prisma } from "../lib/prisma.js";

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
});

beforeEach(async () => {
  // Clean up between tests
  await prisma.book.deleteMany({});
  await prisma.author.deleteMany({});
  await prisma.category.deleteMany({});
});

