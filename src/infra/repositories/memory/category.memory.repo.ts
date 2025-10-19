import type { ICategoryRepository } from "../../../domain/repositories";
import type { Category } from "../../../domain/entities";

let idSeq = 1;

export class CategoryMemoryRepository implements ICategoryRepository {
  private store: Category[] = [];

  async create(data: { name: string }) {
    const now = new Date();
    const entity: Category = { id: idSeq++, name: data.name, createdAt: now, updatedAt: now };
    this.store.push(entity);
    return entity;
  }

  async list(opts: { skip: number; take: number; search?: string }) {
    let items = this.store;
    if (opts.search) {
      items = items.filter((c) => c.name.toLowerCase().includes(opts.search!.toLowerCase()));
    }
    const total = items.length;
    // Sort by id descending to match Prisma behavior
    items = [...items].sort((a, b) => b.id - a.id);
    items = items.slice(opts.skip, opts.skip + opts.take);
    return { items, total };
  }

  async findByName(name: string) {
    return this.store.find((c) => c.name.toLowerCase() == name.toLowerCase()) ?? null;
  }

  reset() {
    this.store = [];
  }
}
