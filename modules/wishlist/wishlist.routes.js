import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { addToWishlist, getWishlist, removeFromWishlist } from "./wishlist.controller.js";

const wishlistRouter = Router();

wishlistRouter.route("/")
  .patch(protectedRoutes, allowedTo("user"), addToWishlist)
  .get(protectedRoutes, allowedTo("user"), getWishlist)

wishlistRouter.delete("/:id", protectedRoutes, allowedTo("user"), removeFromWishlist)

export default wishlistRouter