import { Router } from "express";
import { createBrand, deleteBrand, getAllBrands, getBrand, updateBrand } from "./brand.controller.js";
import { uploadSingleImage } from './../../middlewares/uploadImages.js';
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const brandRouter = Router();

brandRouter
  .route('/')
  .get(getAllBrands)
  .post(protectedRoutes, allowedTo("admin"), uploadSingleImage('logo', 'brands'), createBrand)

brandRouter
  .route("/:id")
  .get(getBrand)
  .put(protectedRoutes, allowedTo("admin"), uploadSingleImage('logo', 'brands'), updateBrand)
  .delete(protectedRoutes, allowedTo("admin"), deleteBrand)

export default brandRouter;