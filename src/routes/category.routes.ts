import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { createCategorySchema, listCategoriesSchema } from "../schemas/category.js";
import {
  getCategories,
  postCategory,
} from "../interfaces/http/category.http.js";

export const categoryRouter = Router();

categoryRouter.post("/", validate(createCategorySchema), postCategory);
categoryRouter.get("/", validate(listCategoriesSchema, "query"), getCategories);
