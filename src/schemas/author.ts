import { z } from "zod";

export const createAuthorSchema = z.object({
  name: z.string().min(1),
  bio: z.string().max(1000).optional(),
});

export const listAuthorsSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
});

export type CreateAuthorInput = z.infer<typeof createAuthorSchema>;
