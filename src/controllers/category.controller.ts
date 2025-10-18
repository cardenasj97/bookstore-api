import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { getPagination } from "../utils/pagination.js";
import { listCategoriesSchema } from "../schemas/category.js";

export async function createCategory(req: Request, res: Response) {
  const body = (req as any).parsedBody as { name: string };
  const category = await prisma.category.create({ data: body });
  res.status(201).json(category);
}

export async function listCategories(req: Request, res: Response) {
  const parsed = listCategoriesSchema.parse(req.query);
  const { skip, take, page, pageSize } = getPagination(parsed);
  const where = parsed.search ? { name: { contains: parsed.search, mode: "insensitive" as const } } : {};
  const [items, total] = await Promise.all([
    prisma.category.findMany({ where, skip, take, orderBy: { id: "desc" } }),
    prisma.category.count({ where }),
  ]);
  res.json({ items, page, pageSize, total });
}
