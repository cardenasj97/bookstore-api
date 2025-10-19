import type { IBookRepository } from "../repositories";

export class BookService {
  constructor(private bookRepository: IBookRepository) {}

  async create(input: {
    title: string;
    description?: string;
    publishedAt?: Date;
    authorIds?: number[];
    categoryIds?: number[];
  }) {
    return this.bookRepository.create(input);
  }

  async list(input: {
    skip: number;
    take: number;
    search?: string;
    authorId?: number;
    categoryId?: number;
  }) {
    return this.bookRepository.list(input);
  }

  async update(id: number, input: {
    title?: string;
    description?: string;
    publishedAt?: Date;
    authorIds?: number[];
    categoryIds?: number[];
  }) {
    return this.bookRepository.update(id, input);
  }

  async delete(id: number) {
    return this.bookRepository.delete(id);
  }
}
