import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { addAddress, getAddresses, removeAddress } from "./address.controller.js";

const addressRouter = Router();

addressRouter.route("/")
  .patch(protectedRoutes, allowedTo("user"), addAddress)
  .get(protectedRoutes, allowedTo("user"), getAddresses)

addressRouter.delete("/:id", protectedRoutes, allowedTo("user"), removeAddress)

export default addressRouter