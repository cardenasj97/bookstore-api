import type { Author, Book, Category } from "./entities";

// Authors
export interface IAuthorRepository {
  create(data: { name: string; bio?: string }): Promise<Author>;
  list(opts: {
    skip: number;
    take: number;
    search?: string;
  }): Promise<{ items: Author[]; total: number }>;
}

// Categories
export interface ICategoryRepository {
  create(data: { name: string }): Promise<Category>;
  list(opts: {
    skip: number;
    take: number;
    search?: string;
  }): Promise<{ items: Category[]; total: number }>;
  findByName(name: string): Promise<Category | null>;
}

// Books
export interface IBookRepository {
  create(data: {
    title: string;
    description?: string;
    publishedAt?: Date;
    authorIds?: number[];
    categoryIds?: number[];
  }): Promise<Book>;
  list(opts: {
    skip: number;
    take: number;
    search?: string;
    authorId?: number;
    categoryId?: number;
  }): Promise<{ items: Book[]; total: number }>;
  update(
    id: number,
    data: {
      title?: string;
      description?: string;
      publishedAt?: Date;
      authorIds?: number[];
      categoryIds?: number[];
    }
  ): Promise<Book>;
  delete(id: number): Promise<Book>;
}