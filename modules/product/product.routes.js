import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "./product.controller.js";
import { uploadMultipleImages } from "../../middlewares/uploadImages.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const productRouter = Router();

productRouter.route('/').get(getAllProducts).post(protectedRoutes, allowedTo("admin"), uploadMultipleImages([{name: "cover", maxCount: 1}, {name: "images", maxCount: 10}], "products"), createProduct);

productRouter.route("/:id").get(getProduct).put(protectedRoutes, allowedTo("admin"), uploadMultipleImages([{ name: "cover", maxCount: 1 }, { name: "images", maxCount: 10 }], "products"), updateProduct).delete(protectedRoutes, allowedTo("admin"), deleteProduct)

export default productRouter;