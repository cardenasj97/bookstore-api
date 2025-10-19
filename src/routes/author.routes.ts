import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { createAuthorSchema, listAuthorsSchema } from "../schemas/author.js";
import { getAuthors, postAuthor } from "../interfaces/http/author.http.js";

export const authorRouter = Router();

authorRouter.post("/", validate(createAuthorSchema), postAuthor);
authorRouter.get("/", validate(listAuthorsSchema, "query"), getAuthors);
