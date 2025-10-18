import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { getPagination } from "../utils/pagination.js";
import { listAuthorsSchema } from "../schemas/author.js";

export async function createAuthor(req: Request, res: Response) {
  const body = (req as any).parsedBody as { name: string; bio?: string };
  const author = await prisma.author.create({ data: body });
  res.status(201).json(author);
}

export async function listAuthors(req: Request, res: Response) {
  const parsed = listAuthorsSchema.parse(req.query);
  const { skip, take, page, pageSize } = getPagination(parsed);
  const where = parsed.search ? { name: { contains: parsed.search, mode: "insensitive" as const } } : {};
  const [items, total] = await Promise.all([
    prisma.author.findMany({ where, skip, take, orderBy: { id: "desc" } }),
    prisma.author.count({ where }),
  ]);
  res.json({ items, page, pageSize, total });
}
