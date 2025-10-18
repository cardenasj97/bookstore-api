import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export function validate(schema: ZodSchema<any>, source: "body" | "query" = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const data = source === "body" ? req.body : req.query;
    const result = schema.safeParse(data);
    if (!result.success) {
      return next(result.error);
    }
    // attach parsed for typesafe controllers
    if (source === "body") (req as any).parsedBody = result.data;
    else (req as any).parsedQuery = result.data;
    next();
  };
}
