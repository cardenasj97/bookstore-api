import type { IAuthorRepository } from "../../../domain/repositories";
import type { Author } from "../../../domain/entities";

let idSeq = 1;

export class AuthorMemoryRepository implements IAuthorRepository {
  private store: Author[] = [];

  async create(data: { name: string; bio?: string }) {
    const now = new Date();
    const entity: Author = { id: idSeq++, name: data.name, bio: data.bio, createdAt: now, updatedAt: now };
    this.store.push(entity);
    return entity;
  }

  async list(opts: { skip: number; take: number; search?: string }) {
    let items = this.store;
    if (opts.search) {
      items = items.filter((a) => a.name.toLowerCase().includes(opts.search!.toLowerCase()));
    }
    const total = items.length;
    // Sort by id descending to match Prisma behavior
    items = [...items].sort((a, b) => b.id - a.id);
    items = items.slice(opts.skip, opts.skip + opts.take);
    return { items, total };
  }

  reset() {
    this.store = [];
  }
}
