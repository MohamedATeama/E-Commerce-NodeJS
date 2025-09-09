import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { createCoupon, deleteCoupon, getAllCoupons, getCoupon, updateCoupon } from "./coupon.controller.js";

const couponRouter = Router();

couponRouter.use(protectedRoutes, allowedTo("admin"))

couponRouter
  .route('/')
  .get(getAllCoupons)
  .post(createCoupon)

couponRouter
  .route("/:id")
  .get(getCoupon)
  .put(updateCoupon)
  .delete(deleteCoupon)

export default couponRouter;