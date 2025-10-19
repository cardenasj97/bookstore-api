import "dotenv/config";
import { attachReportWorker } from "../../infra/queues/bullmq";

attachReportWorker();
console.log("🧵 Report worker listening");

process.on("SIGINT", () => process.exit(0));
