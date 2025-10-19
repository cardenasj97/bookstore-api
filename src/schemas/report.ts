import { z } from "zod";

export const createReportSchema = z.object({
  userId: z.number().int().positive(),
});

export const getReportSchema = z.object({
  userId: z.string().min(1),
});
