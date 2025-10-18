import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { createBookSchema, updateBookSchema } from "../schemas/book.js";
import {
  createBook,
  deleteBook,
  listBooks,
  updateBook,
} from "../controllers/book.controller.js";

export const bookRouter = Router();

bookRouter.post("/", validate(createBookSchema), createBook);
bookRouter.get("/", listBooks);
bookRouter.put("/:id", validate(updateBookSchema), updateBook);
bookRouter.delete("/:id", deleteBook);
