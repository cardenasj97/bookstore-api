import type { ICategoryRepository } from "../repositories";

export class CategoryService {
  constructor(private categoryRepository: ICategoryRepository) {}

  async create(input: { name: string }) {
    const existing = await this.categoryRepository.findByName(input.name);
    if (existing) {
      throw Object.assign(new Error("A record with this name already exists."), { status: 409 });
    }
    return this.categoryRepository.create(input);
  }

  async list(input: { skip: number; take: number; search?: string }) {
    return this.categoryRepository.list(input);
  }
}
