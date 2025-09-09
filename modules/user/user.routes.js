import { Router } from "express";
import { uploadSingleImage } from "../../middlewares/uploadImages.js";
import { changePassword, createUser, deleteUser, getAllUsers, getUser, updateUser } from "./user.controller.js";
import { checkEmail } from "../../middlewares/checkEmail.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const userRouter = Router();

userRouter.put("/changePassword", protectedRoutes, changePassword)

userRouter
  .route('/')
  .get(protectedRoutes, allowedTo("admin"), getAllUsers)
  .post(protectedRoutes, allowedTo("admin"), uploadSingleImage('image', 'users'), checkEmail, createUser)

userRouter
  .route("/:id")
  .get(protectedRoutes, allowedTo("admin"), getUser)
  .put(protectedRoutes, allowedTo("admin"), uploadSingleImage("image", "users"), checkEmail, updateUser)
  .delete(protectedRoutes, allowedTo("admin"), deleteUser);

export default userRouter;