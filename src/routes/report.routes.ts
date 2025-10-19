import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { createReportSchema, getReportSchema } from "../schemas/report.js";
import { getReport, postReport } from "../interfaces/http/report.http.js";

export const reportRouter = Router();

reportRouter.post("/", validate(createReportSchema), postReport);
reportRouter.get("/", validate(getReportSchema, "query"), getReport);
