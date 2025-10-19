import { redis } from "../../lib/redis";

export class ReportService {
  async generate(userId: number) {
    // Simulate heavy work: aggregate DB, etc.
    await new Promise(r => setTimeout(r, 1500));
    const result = { topBooks: ["1984", "Foundation"], generatedAt: new Date().toISOString() };
    await redis.set(`report:${userId}`, JSON.stringify(result), "EX", 60);
    return result;
  }

  async getCached(userId: string) {
    const data = await redis.get(`report:${userId}`);
    return data ? JSON.parse(data) : null;
  }
}
