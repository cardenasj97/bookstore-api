import type { IBookRepository } from "../../../domain/repositories";
import type { Book, Author, Category } from "../../../domain/entities";

let idSeq = 1;

export class BookMemoryRepository implements IBookRepository {
  private books: Book[] = [];
  private authors: Author[] = [];
  private categories: Category[] = [];

  setAuthors(authors: Author[]) {
    this.authors = authors;
  }
  setCategories(categories: Category[]) {
    this.categories = categories;
  }

  async create(data: {
    title: string;
    description?: string;
    publishedAt?: Date;
    authorIds?: number[];
    categoryIds?: number[];
  }) {
    const now = new Date();
    const authors = (data.authorIds || []).map((id) => this.authors.find((a) => a.id === id)).filter(Boolean) as Author[];
    const categories = (data.categoryIds || []).map((id) => this.categories.find((c) => c.id === id)).filter(Boolean) as Category[];
    const book: Book = {
      id: idSeq++,
      title: data.title,
      description: data.description,
      publishedAt: data.publishedAt,
      authors,
      categories,
      createdAt: now,
      updatedAt: now,
    };
    this.books.push(book);
    return book;
  }

  async list(opts: { skip: number; take: number; search?: string; authorId?: number; categoryId?: number }) {
    let items = this.books;
    if (opts.search) {
      const s = opts.search.toLowerCase();
      items = items.filter((b) =>
        (b.title?.toLowerCase().includes(s)) || (b.description?.toLowerCase().includes(s))
      );
    }
    if (opts.authorId) items = items.filter((b) => b.authors.some((a) => a.id === opts.authorId));
    if (opts.categoryId) items = items.filter((b) => b.categories.some((c) => c.id === opts.categoryId));
    const total = items.length;
    // Sort by id descending to match Prisma behavior
    items = [...items].sort((a, b) => b.id - a.id);
    items = items.slice(opts.skip, opts.skip + opts.take);
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
    const book = this.books.find((b) => b.id === id);
    if (!book) {
      throw Object.assign(new Error("Record to update not found"), { code: "P2025" });
    }

    if (data.title !== undefined) book.title = data.title;
    if (data.description !== undefined) book.description = data.description;
    if (data.publishedAt !== undefined) book.publishedAt = data.publishedAt;
    
    if (data.authorIds !== undefined) {
      book.authors = data.authorIds
        .map((id) => this.authors.find((a) => a.id === id))
        .filter(Boolean) as Author[];
    }
    
    if (data.categoryIds !== undefined) {
      book.categories = data.categoryIds
        .map((id) => this.categories.find((c) => c.id === id))
        .filter(Boolean) as Category[];
    }
    
    book.updatedAt = new Date();
    return book;
  }

  async delete(id: number) {
    const index = this.books.findIndex((b) => b.id === id);
    if (index === -1) {
      throw Object.assign(new Error("Record to delete does not exist"), { code: "P2025" });
    }
    const [book] = this.books.splice(index, 1);
    return book;
  }

  reset() {
    this.books = [];
  }
}
