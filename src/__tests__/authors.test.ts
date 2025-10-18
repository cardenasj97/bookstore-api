import { describe, test, expect } from "@jest/globals";
import request from "supertest";
import { app } from "../app.js";
import { prisma } from "../lib/prisma.js";

describe("Authors API", () => {
  describe("POST /authors", () => {
    test("should create an author with name and bio", async () => {
      const response = await request(app).post("/authors").send({
        name: "J.K. Rowling",
        bio: "British author, best known for the Harry Potter series",
      });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: "J.K. Rowling",
        bio: "British author, best known for the Harry Potter series",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    test("should create an author with name only", async () => {
      const response = await request(app).post("/authors").send({
        name: "George R.R. Martin",
      });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: "George R.R. Martin",
        bio: null,
      });
    });

    test("should fail when name is missing", async () => {
      const response = await request(app).post("/authors").send({
        bio: "Some bio",
      });

      expect(response.status).toBe(400);
    });

    test("should fail when name is empty string", async () => {
      const response = await request(app).post("/authors").send({
        name: "",
      });

      expect(response.status).toBe(400);
    });

    test("should fail when bio exceeds 1000 characters", async () => {
      const response = await request(app).post("/authors").send({
        name: "Test Author",
        bio: "a".repeat(1001),
      });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /authors", () => {
    test("should return empty list when no authors exist", async () => {
      const response = await request(app).get("/authors");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        items: [],
        page: 1,
        pageSize: 10,
        total: 0,
      });
    });

    test("should return list of authors", async () => {
      await prisma.author.createMany({
        data: [
          { name: "Author 1", bio: "Bio 1" },
          { name: "Author 2", bio: "Bio 2" },
          { name: "Author 3" },
        ],
      });

      const response = await request(app).get("/authors");

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(3);
      expect(response.body.total).toBe(3);
      expect(response.body.page).toBe(1);
      expect(response.body.pageSize).toBe(10);
    });

    test("should support pagination", async () => {
      await prisma.author.createMany({
        data: Array.from({ length: 25 }, (_, i) => ({
          name: `Author ${i + 1}`,
        })),
      });

      const page1 = await request(app).get("/authors?page=1&pageSize=10");
      expect(page1.body.items).toHaveLength(10);
      expect(page1.body.total).toBe(25);
      expect(page1.body.page).toBe(1);

      const page2 = await request(app).get("/authors?page=2&pageSize=10");
      expect(page2.body.items).toHaveLength(10);
      expect(page2.body.page).toBe(2);

      const page3 = await request(app).get("/authors?page=3&pageSize=10");
      expect(page3.body.items).toHaveLength(5);
      expect(page3.body.page).toBe(3);
    });

    test("should support search by name", async () => {
      await prisma.author.createMany({
        data: [
          { name: "J.K. Rowling" },
          { name: "George R.R. Martin" },
          { name: "Stephen King" },
        ],
      });

      const response = await request(app).get("/authors?search=rowling");

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].name).toBe("J.K. Rowling");
    });

    test("should be case insensitive in search", async () => {
      await prisma.author.create({
        data: { name: "J.K. Rowling" },
      });

      const response = await request(app).get("/authors?search=ROWLING");

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
    });

    test("should return authors in descending order by id", async () => {
      const author1 = await prisma.author.create({
        data: { name: "Author 1" },
      });
      const author2 = await prisma.author.create({
        data: { name: "Author 2" },
      });
      const author3 = await prisma.author.create({
        data: { name: "Author 3" },
      });

      const response = await request(app).get("/authors");

      expect(response.body.items[0].id).toBe(author3.id);
      expect(response.body.items[1].id).toBe(author2.id);
      expect(response.body.items[2].id).toBe(author1.id);
    });

    test("should limit pageSize to maximum 100", async () => {
      const response = await request(app).get("/authors?pageSize=200");
      
      expect(response.status).toBe(400);
    });
  });
});

