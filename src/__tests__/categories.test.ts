import { describe, test, expect } from "@jest/globals";
import request from "supertest";
import { app } from "../app.js";
import { prisma } from "../lib/prisma.js";

describe("Categories API", () => {
  describe("POST /categories", () => {
    test("should create a category", async () => {
      const response = await request(app).post("/categories").send({
        name: "Fantasy",
      });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: "Fantasy",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    test("should fail when name is missing", async () => {
      const response = await request(app).post("/categories").send({});

      expect(response.status).toBe(400);
    });

    test("should fail when name is empty string", async () => {
      const response = await request(app).post("/categories").send({
        name: "",
      });

      expect(response.status).toBe(400);
    });

    test("should fail when creating duplicate category name", async () => {
      await prisma.category.create({
        data: { name: "Science Fiction" },
      });

      const response = await request(app).post("/categories").send({
        name: "Science Fiction",
      });

      expect(response.status).toBe(409); // Unique constraint violation
      expect(response.body).toMatchObject({
        error: "A record with this name already exists.",
      });
    });
  });

  describe("GET /categories", () => {
    test("should return empty list when no categories exist", async () => {
      const response = await request(app).get("/categories");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        items: [],
        page: 1,
        pageSize: 10,
        total: 0,
      });
    });

    test("should return list of categories", async () => {
      await prisma.category.createMany({
        data: [
          { name: "Fantasy" },
          { name: "Science Fiction" },
          { name: "Mystery" },
        ],
      });

      const response = await request(app).get("/categories");

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(3);
      expect(response.body.total).toBe(3);
      expect(response.body.page).toBe(1);
      expect(response.body.pageSize).toBe(10);
    });

    test("should support pagination", async () => {
      await prisma.category.createMany({
        data: Array.from({ length: 25 }, (_, i) => ({
          name: `Category ${i + 1}`,
        })),
      });

      const page1 = await request(app).get("/categories?page=1&pageSize=10");
      expect(page1.body.items).toHaveLength(10);
      expect(page1.body.total).toBe(25);
      expect(page1.body.page).toBe(1);

      const page2 = await request(app).get("/categories?page=2&pageSize=10");
      expect(page2.body.items).toHaveLength(10);
      expect(page2.body.page).toBe(2);

      const page3 = await request(app).get("/categories?page=3&pageSize=10");
      expect(page3.body.items).toHaveLength(5);
      expect(page3.body.page).toBe(3);
    });

    test("should support search by name", async () => {
      await prisma.category.createMany({
        data: [
          { name: "Fantasy" },
          { name: "Science Fiction" },
          { name: "Mystery" },
        ],
      });

      const response = await request(app).get("/categories?search=fantasy");

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].name).toBe("Fantasy");
    });

    test("should be case insensitive in search", async () => {
      await prisma.category.create({
        data: { name: "Fantasy" },
      });

      const response = await request(app).get("/categories?search=FANTASY");

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
    });

    test("should return categories in descending order by id", async () => {
      const cat1 = await prisma.category.create({
        data: { name: "Category 1" },
      });
      const cat2 = await prisma.category.create({
        data: { name: "Category 2" },
      });
      const cat3 = await prisma.category.create({
        data: { name: "Category 3" },
      });

      const response = await request(app).get("/categories");

      expect(response.body.items[0].id).toBe(cat3.id);
      expect(response.body.items[1].id).toBe(cat2.id);
      expect(response.body.items[2].id).toBe(cat1.id);
    });

    test("should limit pageSize to maximum 100", async () => {
      const response = await request(app).get("/categories?pageSize=200");

      expect(response.status).toBe(400);
    });
  });
});
