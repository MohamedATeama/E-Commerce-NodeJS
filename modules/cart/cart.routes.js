import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { addToCart, applyCoupon, clearCart, getCart, removeFromCart, updateQuantity } from "./cart.controller.js";

const cartRouter = Router();

cartRouter.route("/")
  .post(protectedRoutes, allowedTo("user"), addToCart)
  .get(protectedRoutes, allowedTo("user"), getCart)
  .delete(protectedRoutes, allowedTo("user"), clearCart)

cartRouter.route("/:id")
  .put(protectedRoutes, allowedTo("user"), updateQuantity)
  .delete(protectedRoutes, allowedTo("user"), removeFromCart)

  cartRouter.post("/applyCoupon", protectedRoutes, allowedTo("user"), applyCoupon)

export default cartRouter