import express, { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { createCashOrder, createCheckoutSession, createOnlineOrder, getAllOrders, getUserOrders } from "./order.controller.js";

const orderRouter = Router();

orderRouter.route("/:id")
  .post(protectedRoutes, allowedTo("user"), createCashOrder)

orderRouter.route("/")
  .get(protectedRoutes, allowedTo("admin"), getAllOrders)

orderRouter.route("/userOrders")
  .get(protectedRoutes, allowedTo("user"), getUserOrders)

orderRouter.route("/checkout/:id")
  .post(protectedRoutes, allowedTo("user"), createCheckoutSession)

orderRouter.post('/webhook', express.json({ type: 'application/json' }), createOnlineOrder)

export default orderRouter