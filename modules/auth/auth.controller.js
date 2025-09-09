import expressAsyncHandler from "express-async-handler";
import { User } from "../user/user.model.js";
import { createToken } from "../../utils/createToken.js";
import bcrypt from 'bcrypt'
import ApiError from "../../utils/apiError.js";
import jwt from "jsonwebtoken";

export const signup = expressAsyncHandler(async (req, res) => {
  const user = await User.create(req.body)
  const token = createToken(user._id, user.role)
  res.status(201).json({ message: "success", token })
})

export const login = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password!", 401))
  }
  const token = createToken(user._id, user.role)
  res.status(200).json({ message: "success", token })
})

export const protectedRoutes = expressAsyncHandler(async (req, res, next) => {
  let token = "";
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return next(new ApiError("Your are not log in! please log in first", 401))
  }
  let decodeToken = null;
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) return next(new ApiError(err, 401));
    decodeToken = payload;
  });
  const user = await User.findById(decodeToken._id);
  if (!user) {
    return next(new ApiError("User not found!", 401))
  }
  if (user.passwordChangedAt) {
    const changedTime = parseInt(user.passwordChangedAt.getTime() / 1000);
    if (changedTime > decodeToken.iat) return next(new ApiError("Your password has been changed recently, please log in again", 401))
  }
  req.user = user;
  next();
})

export const allowedTo = (...roles) => expressAsyncHandler(async (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return next(new ApiError("You are not allowed to access this routes!", 403))
  }
  next();
})