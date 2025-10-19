import type { IAuthorRepository } from "../repositories";

export class AuthorService {
  constructor(private authorRepository: IAuthorRepository) {}

  async create(input: { name: string; bio?: string }) {
    return this.authorRepository.create({ name: input.name.trim(), bio: input.bio });
  }

  async list(input: { skip: number; take: number; search?: string }) {
    return this.authorRepository.list(input);
  }
}
