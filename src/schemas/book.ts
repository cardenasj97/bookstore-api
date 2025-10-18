import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  publishedAt: z.coerce.date().optional(),
  authorIds: z.array(z.number().int().positive()).default([]),
  categoryIds: z.array(z.number().int().positive()).default([]),
});

export const listBooksSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  authorId: z.coerce.number().int().positive().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
});

export const updateBookSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  publishedAt: z.coerce.date().optional(),
  authorIds: z.array(z.number().int().positive()).optional(),
  categoryIds: z.array(z.number().int().positive()).optional(),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
