import type { Request, Response } from "express";
import { container } from "../../di/container";

export async function postCategory(req: Request, res: Response) {
  const svc = container.resolve("categoryService");
  const body = (req as any).parsedBody as { name: string };
  const category = await svc.create(body);
  res.status(201).json(category);
}

export async function getCategories(req: Request, res: Response) {
  const svc = container.resolve("categoryService");
  const { page = 1, pageSize = 10, search } = (req as any).parsedQuery || req.query;
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);
  const result = await svc.list({ skip, take, search: search as string | undefined });
  res.json({ ...result, page: Number(page), pageSize: Number(pageSize) });
}
