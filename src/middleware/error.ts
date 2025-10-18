import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "ValidationError",
      issues: err.issues,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target =
        (err.meta?.target as string[])?.join(", ") ?? "unknown field";

      return res.status(409).json({
        error: "ConflictError",
        message: `A record with this ${target} already exists`,
      });
    }
  }

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
    console.error(err);
  }

  return res.status(status).json({ error: message });
}
