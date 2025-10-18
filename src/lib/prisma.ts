import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: [
    { level: "query", emit: "event" },
    { level: "error", emit: "stdout" },
    { level: "warn", emit: "stdout" },
  ],
});

prisma.$on("query", (e) => {
  if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
    // Quick and readable local query log
    console.log(`[prisma] ${e.query} :: ${e.params} :: ${e.duration}ms`);
  }
});
