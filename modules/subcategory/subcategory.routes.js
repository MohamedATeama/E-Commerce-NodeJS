import { Router } from "express";
import { createSubcategory, deleteSubcategory, getAllSubcategories, getSubcategory, updateSubcategory } from "./subcategory.controller.js";
import { validate } from "../../middlewares/validate.js";
import { createSubcategoryValidation } from "./subcategory.validation.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const subcategoryRouter = Router({ mergeParams: true });

subcategoryRouter.route('/').get(getAllSubcategories).post(protectedRoutes, allowedTo("admin"), validate(createSubcategoryValidation), createSubcategory)

subcategoryRouter.route("/:id").get(getSubcategory).put(protectedRoutes, allowedTo("admin"), updateSubcategory).delete(protectedRoutes, allowedTo("admin"), deleteSubcategory)

export default subcategoryRouter;