import { Router } from "express";
import { login, signup } from "./auth.controller.js";
import { checkEmail } from "../../middlewares/checkEmail.js";

const authRouter = Router();

authRouter.post("/signup", checkEmail, signup)
authRouter.post("/login", login)


export default authRouter