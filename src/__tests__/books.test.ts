import { describe, test, expect } from "@jest/globals";
import request from "supertest";
import { app } from "../app.js";
import { prisma } from "../lib/prisma.js";

describe("Books API", () => {
  describe("POST /books", () => {
    test("should create a book with all fields", async () => {
      const author = await prisma.author.create({
        data: { name: "J.K. Rowling" },
      });
      const category = await prisma.category.create({
        data: { name: "Fantasy" },
      });

      const response = await request(app).post("/books").send({
        title: "Harry Potter and the Philosopher's Stone",
        description: "First book in the Harry Potter series",
        publishedAt: "1997-06-26",
        authorIds: [author.id],
        categoryIds: [category.id],
      });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        title: "Harry Potter and the Philosopher's Stone",
        description: "First book in the Harry Potter series",
        publishedAt: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      expect(response.body.authors).toHaveLength(1);
      expect(response.body.authors[0].id).toBe(author.id);
      expect(response.body.categories).toHaveLength(1);
      expect(response.body.categories[0].id).toBe(category.id);
    });

    test("should create a book with only title", async () => {
      const response = await request(app).post("/books").send({
        title: "Simple Book",
      });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        title: "Simple Book",
        description: null,
        publishedAt: null,
      });
      expect(response.body.authors).toEqual([]);
      expect(response.body.categories).toEqual([]);
    });

    test("should create a book with multiple authors and categories", async () => {
      const author1 = await prisma.author.create({
        data: { name: "Author 1" },
      });
      const author2 = await prisma.author.create({
        data: { name: "Author 2" },
      });
      const category1 = await prisma.category.create({
        data: { name: "Category 1" },
      });
      const category2 = await prisma.category.create({
        data: { name: "Category 2" },
      });

      const response = await request(app).post("/books").send({
        title: "Collaborative Book",
        authorIds: [author1.id, author2.id],
        categoryIds: [category1.id, category2.id],
      });

      expect(response.status).toBe(201);
      expect(response.body.authors).toHaveLength(2);
      expect(response.body.categories).toHaveLength(2);
    });

    test("should fail when title is missing", async () => {
      const response = await request(app).post("/books").send({
        description: "Some description",
      });

      expect(response.status).toBe(400);
    });

    test("should fail when title is empty string", async () => {
      const response = await request(app).post("/books").send({
        title: "",
      });

      expect(response.status).toBe(400);
    });

    test("should fail when authorIds contains invalid author", async () => {
      const response = await request(app).post("/books").send({
        title: "Test Book",
        authorIds: [99999],
      });

      expect(response.status).toBe(500);
    });

    test("should fail when categoryIds contains invalid category", async () => {
      const response = await request(app).post("/books").send({
        title: "Test Book",
        categoryIds: [99999],
      });

      expect(response.status).toBe(500);
    });
  });

  describe("GET /books", () => {
    test("should return empty list when no books exist", async () => {
      const response = await request(app).get("/books");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        items: [],
        page: 1,
        pageSize: 10,
        total: 0,
      });
    });

    test("should return list of books with authors and categories", async () => {
      const author = await prisma.author.create({
        data: { name: "Test Author" },
      });
      const category = await prisma.category.create({
        data: { name: "Test Category" },
      });

      await prisma.book.create({
        data: {
          title: "Test Book",
          authors: { connect: [{ id: author.id }] },
          categories: { connect: [{ id: category.id }] },
        },
      });

      const response = await request(app).get("/books");

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0]).toMatchObject({
        title: "Test Book",
      });
      expect(response.body.items[0].authors).toHaveLength(1);
      expect(response.body.items[0].categories).toHaveLength(1);
    });

    test("should support pagination", async () => {
      await prisma.book.createMany({
        data: Array.from({ length: 25 }, (_, i) => ({
          title: `Book ${i + 1}`,
        })),
      });

      const page1 = await request(app).get("/books?page=1&pageSize=10");
      expect(page1.body.items).toHaveLength(10);
      expect(page1.body.total).toBe(25);
      expect(page1.body.page).toBe(1);

      const page2 = await request(app).get("/books?page=2&pageSize=10");
      expect(page2.body.items).toHaveLength(10);
      expect(page2.body.page).toBe(2);

      const page3 = await request(app).get("/books?page=3&pageSize=10");
      expect(page3.body.items).toHaveLength(5);
      expect(page3.body.page).toBe(3);
    });

    test("should support search in title", async () => {
      await prisma.book.createMany({
        data: [
          { title: "Harry Potter" },
          { title: "Lord of the Rings" },
          { title: "The Hobbit" },
        ],
      });

      const response = await request(app).get("/books?search=potter");

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].title).toBe("Harry Potter");
    });

    test("should support search in description", async () => {
      await prisma.book.createMany({
        data: [
          { title: "Book 1", description: "A book about magic" },
          { title: "Book 2", description: "A book about science" },
        ],
      });

      const response = await request(app).get("/books?search=magic");

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].title).toBe("Book 1");
    });

    test("should filter by authorId", async () => {
      const author1 = await prisma.author.create({
        data: { name: "Author 1" },
      });
      const author2 = await prisma.author.create({
        data: { name: "Author 2" },
      });

      await prisma.book.create({
        data: {
          title: "Book by Author 1",
          authors: { connect: [{ id: author1.id }] },
        },
      });
      await prisma.book.create({
        data: {
          title: "Book by Author 2",
          authors: { connect: [{ id: author2.id }] },
        },
      });

      const response = await request(app).get(`/books?authorId=${author1.id}`);

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].title).toBe("Book by Author 1");
    });

    test("should filter by categoryId", async () => {
      const category1 = await prisma.category.create({
        data: { name: "Fantasy" },
      });
      const category2 = await prisma.category.create({
        data: { name: "Science Fiction" },
      });

      await prisma.book.create({
        data: {
          title: "Fantasy Book",
          categories: { connect: [{ id: category1.id }] },
        },
      });
      await prisma.book.create({
        data: {
          title: "Sci-Fi Book",
          categories: { connect: [{ id: category2.id }] },
        },
      });

      const response = await request(app).get(
        `/books?categoryId=${category1.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].title).toBe("Fantasy Book");
    });

    test("should support combined filters", async () => {
      const author = await prisma.author.create({
        data: { name: "Test Author" },
      });
      const category = await prisma.category.create({
        data: { name: "Test Category" },
      });

      await prisma.book.create({
        data: {
          title: "Matching Book",
          description: "Special keyword",
          authors: { connect: [{ id: author.id }] },
          categories: { connect: [{ id: category.id }] },
        },
      });
      await prisma.book.create({
        data: {
          title: "Non-matching Book",
          authors: { connect: [{ id: author.id }] },
        },
      });

      const response = await request(app).get(
        `/books?authorId=${author.id}&categoryId=${category.id}&search=special`
      );

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].title).toBe("Matching Book");
    });

    test("should return books in descending order by id", async () => {
      const book1 = await prisma.book.create({
        data: { title: "Book 1" },
      });
      const book2 = await prisma.book.create({
        data: { title: "Book 2" },
      });
      const book3 = await prisma.book.create({
        data: { title: "Book 3" },
      });

      const response = await request(app).get("/books");

      expect(response.body.items[0].id).toBe(book3.id);
      expect(response.body.items[1].id).toBe(book2.id);
      expect(response.body.items[2].id).toBe(book1.id);
    });
  });

  describe("PUT /books/:id", () => {
    test("should update book title", async () => {
      const book = await prisma.book.create({
        data: { title: "Original Title" },
      });

      const response = await request(app)
        .put(`/books/${book.id}`)
        .send({ title: "Updated Title" });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Updated Title");
    });

    test("should update book description", async () => {
      const book = await prisma.book.create({
        data: { title: "Test Book" },
      });

      const response = await request(app)
        .put(`/books/${book.id}`)
        .send({ description: "New description" });

      expect(response.status).toBe(200);
      expect(response.body.description).toBe("New description");
    });

    test("should update publishedAt date", async () => {
      const book = await prisma.book.create({
        data: { title: "Test Book" },
      });

      const response = await request(app)
        .put(`/books/${book.id}`)
        .send({ publishedAt: "2000-01-01" });

      expect(response.status).toBe(200);
      expect(response.body.publishedAt).toBeTruthy();
    });

    test("should update multiple fields", async () => {
      const book = await prisma.book.create({
        data: { title: "Test Book" },
      });

      const response = await request(app).put(`/books/${book.id}`).send({
        title: "New Title",
        description: "New Description",
        publishedAt: "2000-01-01",
      });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        title: "New Title",
        description: "New Description",
      });
    });

    test("should fail when book does not exist", async () => {
      const response = await request(app)
        .put("/books/99999")
        .send({ title: "New Title" });

      expect(response.status).toBe(500);
    });

    test("should accept empty body (no updates)", async () => {
      const book = await prisma.book.create({
        data: { title: "Test Book" },
      });

      const response = await request(app).put(`/books/${book.id}`).send({});

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Test Book");
    });
  });

  describe("DELETE /books/:id", () => {
    test("should delete a book", async () => {
      const book = await prisma.book.create({
        data: { title: "Book to Delete" },
      });

      const response = await request(app).delete(`/books/${book.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(book.id);

      const deleted = await prisma.book.findUnique({
        where: { id: book.id },
      });
      expect(deleted).toBeNull();
    });

    test("should fail when book does not exist", async () => {
      const response = await request(app).delete("/books/99999");

      expect(response.status).toBe(500);
    });

    test("should delete book and remove relations", async () => {
      const author = await prisma.author.create({
        data: { name: "Test Author" },
      });
      const category = await prisma.category.create({
        data: { name: "Test Category" },
      });
      const book = await prisma.book.create({
        data: {
          title: "Book with Relations",
          authors: { connect: [{ id: author.id }] },
          categories: { connect: [{ id: category.id }] },
        },
      });

      const response = await request(app).delete(`/books/${book.id}`);

      expect(response.status).toBe(200);

      // Verify author and category still exist
      const authorExists = await prisma.author.findUnique({
        where: { id: author.id },
      });
      const categoryExists = await prisma.category.findUnique({
        where: { id: category.id },
      });
      expect(authorExists).toBeTruthy();
      expect(categoryExists).toBeTruthy();
    });
  });
});

