import { Queue, Worker } from "bullmq";
import { redis as connection } from "../../lib/redis";
import { logger } from "../../lib/logger";
import { container } from "../../di/container";
import { ReportService } from "../../domain/services/report.service";

export const reportQueue = new Queue("reportQueue", { connection });

/** Attach worker. Call ONLY in the worker process. */
export function attachReportWorker() {
  const worker = new Worker(
    "reportQueue",
    async (job) => {
      const { userId } = job.data as { userId: number };
      const reportService = container.resolve<ReportService>("reportService");
      await reportService.generate(userId);
    },
    { connection, concurrency: 5 }
  );

  worker.on("completed", (job) => logger.info({ jobId: job.id }, "Report job completed"));
  worker.on("failed", (job, err) => logger.error({ jobId: job?.id, err }, "Report job failed"));
  logger.info("📥 report worker attached");
}
