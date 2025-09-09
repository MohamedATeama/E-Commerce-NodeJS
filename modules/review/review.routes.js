import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { createReview, deleteReview, getAllReviews, getReview, updateReview } from "./review.controller.js";

const reviewRouter = Router();

reviewRouter.route('/')
  .get(getAllReviews)
  .post(protectedRoutes, allowedTo("user"), createReview)

reviewRouter.route("/:id")
  .get(getReview)
  .put(protectedRoutes, allowedTo("user"), updateReview)
  .delete(protectedRoutes, allowedTo("user", "admin"), deleteReview)

export default reviewRouter;