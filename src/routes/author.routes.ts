import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { createAuthorSchema } from "../schemas/author.js";
import { createAuthor, listAuthors } from "../controllers/author.controller.js";

export const authorRouter = Router();

authorRouter.post("/", validate(createAuthorSchema), createAuthor);
authorRouter.get("/", listAuthors);
