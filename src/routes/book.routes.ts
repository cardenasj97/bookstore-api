import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { createBookSchema, listBooksSchema, updateBookSchema } from "../schemas/book.js";
import { deleteBook, getBooks, postBook, putBook } from "../interfaces/http/book.http.js";

export const bookRouter = Router();

bookRouter.post("/", validate(createBookSchema), postBook);
bookRouter.get("/", validate(listBooksSchema, "query"), getBooks);
bookRouter.put("/:id", validate(updateBookSchema), putBook);
bookRouter.delete("/:id", deleteBook);
