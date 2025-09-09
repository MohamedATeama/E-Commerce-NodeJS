import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { createCashOrder, createCheckoutSession, getAllOrders, getUserOrders } from "./order.controller.js";

const orderRouter = Router();

orderRouter.route("/:id")
  .post(protectedRoutes, allowedTo("user"), createCashOrder)

orderRouter.route("/")
  .get(protectedRoutes, allowedTo("admin"), getAllOrders)

orderRouter.route("/userOrders")
  .get(protectedRoutes, allowedTo("user"), getUserOrders)

orderRouter.route("/checkout/:id")
  .post(protectedRoutes, allowedTo("user"), createCheckoutSession)

export default orderRouter