import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { getPagination } from "../utils/pagination.js";
import { listBooksSchema, updateBookSchema } from "../schemas/book.js";

export async function createBook(req: Request, res: Response) {
  const body = (req as any).parsedBody as {
    title: string;
    description?: string;
    publishedAt?: Date;
    authorIds?: number[];
    categoryIds?: number[];
  };

  const book = await prisma.book.create({
    data: {
      title: body.title,
      description: body.description,
      publishedAt: body.publishedAt,
      authors:
        body.authorIds && body.authorIds.length
          ? {
              connect: body.authorIds.map((id) => ({ id })),
            }
          : undefined,
      categories:
        body.categoryIds && body.categoryIds.length
          ? {
              connect: body.categoryIds.map((id) => ({ id })),
            }
          : undefined,
    },
    include: { authors: true, categories: true },
  });

  res.status(201).json(book);
}

export async function listBooks(req: Request, res: Response) {
  const parsed = listBooksSchema.parse(req.query);
  const { skip, take, page, pageSize } = getPagination(parsed);

  const where: any = {};
  if (parsed.search) {
    where.OR = [
      { title: { contains: parsed.search, mode: "insensitive" } },
      { description: { contains: parsed.search, mode: "insensitive" } },
    ];
  }
  if (parsed.authorId) {
    where.authors = { some: { id: parsed.authorId } };
  }
  if (parsed.categoryId) {
    where.categories = { some: { id: parsed.categoryId } };
  }

  const [items, total] = await Promise.all([
    prisma.book.findMany({
      where,
      skip,
      take,
      orderBy: { id: "desc" },
      include: { authors: true, categories: true },
    }),
    prisma.book.count({ where }),
  ]);

  res.json({ items, page, pageSize, total });
}

export async function updateBook(req: Request, res: Response) {
  const body = (req as any).parsedBody as {
    title: string;
    description?: string;
    publishedAt?: Date;
    authorIds?: number[];
    categoryIds?: number[];
  };

  const book = await prisma.book.update({
    where: { id: Number(req.params.id) },
    data: body,
  });

  res.json(book);
}

export async function deleteBook(req: Request, res: Response) {
  const book = await prisma.book.delete({
    where: { id: Number(req.params.id) },
  });
  res.json(book);
}
