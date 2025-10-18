import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1),
});

export const listCategoriesSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
