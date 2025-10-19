import type { Request, Response } from "express";
import { container } from "../../di/container";

export async function postBook(req: Request, res: Response) {
  const svc = container.resolve("bookService");
  const body = (req as any).parsedBody as {
    title: string;
    description?: string;
    publishedAt?: Date;
    authorIds?: number[];
    categoryIds?: number[];
  };
  const book = await svc.create(body);
  res.status(201).json(book);
}

export async function getBooks(req: Request, res: Response) {
  const svc = container.resolve("bookService");
  const {
    page = 1,
    pageSize = 10,
    search,
    authorId,
    categoryId,
  } = (req as any).parsedQuery || req.query;
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);
  const result = await svc.list({
    skip,
    take,
    search: search as string | undefined,
    authorId: authorId ? Number(authorId) : undefined,
    categoryId: categoryId ? Number(categoryId) : undefined,
  });
  res.json({ ...result, page: Number(page), pageSize: Number(pageSize) });
}

export async function putBook(req: Request, res: Response) {
  const svc = container.resolve("bookService");
  const body = (req as any).parsedBody as {
    title: string;
    description?: string;
    publishedAt?: Date;
    authorIds?: number[];
    categoryIds?: number[];
  };
  const book = await svc.update(Number(req.params.id), body);
  res.status(200).json(book);
}

export async function deleteBook(req: Request, res: Response) {
  const svc = container.resolve("bookService");
  const book = await svc.delete(Number(req.params.id));
  res.status(200).json(book);
}