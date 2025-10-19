import { prisma } from "../../../lib/prisma";
import type { ICategoryRepository } from "../../../domain/repositories";

export class CategoryPrismaRepository implements ICategoryRepository {
  async create(data: { name: string }) {
    return prisma.category.create({ data });
  }

  async list(opts: { skip: number; take: number; search?: string }) {
    const where = opts.search
      ? { name: { contains: opts.search, mode: "insensitive" as const } }
      : {};
    const [items, total] = await Promise.all([
      prisma.category.findMany({ where, skip: opts.skip, take: opts.take, orderBy: { id: "desc" } }),
      prisma.category.count({ where }),
    ]);
    return { items, total };
  }

  async findByName(name: string) {
    return prisma.category.findUnique({ where: { name } });
  }
}
