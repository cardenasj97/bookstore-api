import { prisma } from "../../../lib/prisma";
import type { IBookRepository } from "../../../domain/repositories";

export class BookPrismaRepository implements IBookRepository {
  async create(data: {
    title: string;
    description?: string;
    publishedAt?: Date;
    authorIds?: number[];
    categoryIds?: number[];
  }) {
    return prisma.book.create({
      data: {
        title: data.title,
        description: data.description,
        publishedAt: data.publishedAt,
        authors: data.authorIds?.length
          ? { connect: data.authorIds.map((id) => ({ id })) }
          : undefined,
        categories: data.categoryIds?.length
          ? { connect: data.categoryIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { authors: true, categories: true },
    });
  }

  async list(opts: {
    skip: number;
    take: number;
    search?: string;
    authorId?: number;
    categoryId?: number;
  }) {
    const where: any = {};
    if (opts.search) {
      where.OR = [
        { title: { contains: opts.search, mode: "insensitive" } },
        { description: { contains: opts.search, mode: "insensitive" } },
      ];
    }
    if (opts.authorId) where.authors = { some: { id: opts.authorId } };
    if (opts.categoryId) where.categories = { some: { id: opts.categoryId } };

    const [items, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip: opts.skip,
        take: opts.take,
        orderBy: { id: "desc" },
        include: { authors: true, categories: true },
      }),
      prisma.book.count({ where }),
    ]);
    return { items, total };
  }

  async update(
    id: number,
    data: {
      title?: string;
      description?: string;
      publishedAt?: Date;
      authorIds?: number[];
      categoryIds?: number[];
    }
  ) {
    const updateData: any = {
      title: data.title,
      description: data.description,
      publishedAt: data.publishedAt,
    };

    if (data.authorIds !== undefined) {
      updateData.authors = data.authorIds.length
        ? { set: data.authorIds.map((id) => ({ id })) }
        : { set: [] };
    }

    if (data.categoryIds !== undefined) {
      updateData.categories = data.categoryIds.length
        ? { set: data.categoryIds.map((id) => ({ id })) }
        : { set: [] };
    }

    const book = await prisma.book.update({
      where: { id },
      data: updateData,
      include: { authors: true, categories: true },
    });
    return book;
  }

  async delete(id: number) {
    const book = await prisma.book.delete({
      where: { id },
      include: { authors: true, categories: true },
    });
    return book;
  }
}
