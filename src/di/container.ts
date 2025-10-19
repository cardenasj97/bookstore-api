import { asClass, createContainer, InjectionMode } from "awilix";
import { AuthorPrismaRepository } from "../infra/repositories/prisma/author.prisma.repo";
import { BookPrismaRepository } from "../infra/repositories/prisma/book.prisma.repo";
import { CategoryPrismaRepository } from "../infra/repositories/prisma/category.prisma.repo";
import { AuthorService } from "../domain/services/author.service";
import { CategoryService } from "../domain/services/category.service";
import { BookService } from "../domain/services/book.service";
import { ReportService } from "../domain/services/report.service";

export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

container.register({
  authorRepository: asClass(AuthorPrismaRepository).singleton(),
  categoryRepository: asClass(CategoryPrismaRepository).singleton(),
  bookRepository: asClass(BookPrismaRepository).singleton(),
  authorService: asClass(AuthorService).singleton(),
  categoryService: asClass(CategoryService).singleton(),
  bookService: asClass(BookService).singleton(),
  reportService: asClass(ReportService).scoped(),
});
