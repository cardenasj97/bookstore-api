import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { createCategorySchema } from "../schemas/category.js";
import { createCategory, listCategories } from "../controllers/category.controller.js";

export const categoryRouter = Router();

categoryRouter.post("/", validate(createCategorySchema), createCategory);
categoryRouter.get("/", listCategories);
