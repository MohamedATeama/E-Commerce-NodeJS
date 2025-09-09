import asyncHandler from "express-async-handler";
import { Category } from './category.model.js';
import ApiError from "../../utils/apiError.js";
import slugify from "slugify";
import fs from 'fs'
import Features from "../../utils/features.js";

export const getAllCategories = asyncHandler(async (req, res) => {
  const count = await Category.countDocuments();
  const features = new Features(Category.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .search("category")
    .pagination(count);
  const categories = await features.mongooseQuery;
  res.json({ message: "Success", results: count, metadata: features.paginationResult, data: categories });
})

export const getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  category || next(new ApiError("category not found!", 404))
  !category || res.json({ message: "Success", data: category });
})

export const createCategory = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  if (req.file) req.body.image = req.file.filename;
  const category = await Category.create(req.body);
  res.json({ message: "Success", data: category });
})

export const updateCategory = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const category = await Category.findById(req.params.id);
    if (category.image) {
      const imgName = category.image.split('/')
      const filePath = `uploads/categories/${imgName[imgName.length - 1]}`;
      fs.unlinkSync(filePath)
    }
  }
  req.body.slug = slugify(req.body.name);
  if (req.file) req.body.image = req.file.filename;
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  category || next(new ApiError("category not found!", 404));
  !category || res.json({ message: "Success", data: category });
})

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  category || next(new ApiError("category not found!", 404));
  !category || res.json({ message: "Success", data: category });
})