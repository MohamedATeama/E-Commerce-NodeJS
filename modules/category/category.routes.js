import { Router } from "express";
import { createCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from "./category.controller.js";
import { uploadSingleImage } from "../../middlewares/uploadImages.js";
import { createCategoryValidation } from "./category.validation.js";
import { validate } from "../../middlewares/validate.js";
import subcategoryRouter from "../subcategory/subcategory.routes.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const categoryRouter = Router();

categoryRouter.use("/:categoryId/subcategories", subcategoryRouter)

categoryRouter
  .route('/')
  .get(getAllCategories)
  .post(protectedRoutes, allowedTo("admin"), uploadSingleImage('image', 'categories'), validate(createCategoryValidation), createCategory)

categoryRouter
  .route("/:id")
  .get(getCategory)
  .put(protectedRoutes, allowedTo("admin"), uploadSingleImage("image", "categories"), updateCategory)
  .delete(protectedRoutes, allowedTo("admin"), deleteCategory);

export default categoryRouter;