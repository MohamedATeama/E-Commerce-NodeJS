import asyncHandler from "express-async-handler";
import ApiError from "../../utils/apiError.js";
import fs from 'fs'
import Features from "../../utils/features.js";
import { User } from "./user.model.js";
import { createToken } from "../../utils/createToken.js";
import bcrypt from 'bcrypt'

export const getAllUsers = asyncHandler(async (req, res) => {
  const count = await User.countDocuments();
  const features = new Features(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .search("user")
    .pagination(count);
  const users = await features.mongooseQuery;
  res.json({ message: "Success", results: count, metadata: features.paginationResult, data: users });
})

export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  user || next(new ApiError("User not found!", 404))
  !user || res.json({ message: "Success", data: user });
})

export const createUser = asyncHandler(async (req, res) => {
  if (req.file) req.body.image = req.file.filename;
  const user = await User.create(req.body);
  res.json({ message: "Success", data: user });
})

export const updateUser = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const user = await User.findById(req.params.id);
    if (user.image && !user.image.includes("user.jpg")) {
      const imgName = user.image.split('/')
      const filePath = `uploads/categories/${imgName[imgName.length - 1]}`;
      fs.unlinkSync(filePath)
    }
  }
  if (req.file) req.body.image = req.file.filename;
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  user || next(new ApiError("User not found!", 404));
  !user || res.json({ message: "Success", data: user });
})

export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  user || next(new ApiError("User not found!", 404));
  !user || res.json({ message: "Success", data: user });
})

export const changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
  if (!user) return next(new ApiError("User not found!", 401))
  
  if (!await bcrypt.compare(req.body.oldPassword, user.password)) return next(new ApiError("current password is wrong!", 401))
  
  await User.findByIdAndUpdate(req.user._id, { password: req.body.newPassword, passwordChangedAt: Date.now() }, { new: true })
  const token = createToken(user._id, user.role)
  res.status(200).json({ message: "success", token })
})