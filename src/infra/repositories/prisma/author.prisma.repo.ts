import { prisma } from "../../../lib/prisma";
import type { IAuthorRepository } from "../../../domain/repositories";

export class AuthorPrismaRepository implements IAuthorRepository {
  async create(data: { name: string; bio?: string }) {
    return prisma.author.create({ data });
  }

  async list(opts: { skip: number; take: number; search?: string }) {
    const where = opts.search
      ? { name: { contains: opts.search, mode: "insensitive" as const } }
      : {};
    const [items, total] = await Promise.all([
      prisma.author.findMany({ where, skip: opts.skip, take: opts.take, orderBy: { id: "desc" } }),
      prisma.author.count({ where }),
    ]);
    return { items, total };
  }
}
