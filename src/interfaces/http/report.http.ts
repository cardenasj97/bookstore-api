import { container } from "../../di/container";
import type { Request, Response } from "express";
import { reportQueue } from "../../infra/queues/bullmq";

export const postReport = async (req: Request, res: Response) => {
  const { userId } = req.body;
  
  await reportQueue.add("generate", { userId });
  return res.status(202).json({ message: "Report generation queued" });
};

export const getReport = async (req: Request, res: Response) => {
  const { userId } = req.query;
  const cachedReport = await container
    .resolve("reportService")
    .getCached(userId);

  return cachedReport
    ? res.json(cachedReport)
    : res.status(404).json({ error: "Report not found" });
};
