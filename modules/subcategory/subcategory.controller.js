import asyncHandler from "express-async-handler";
import { Subcategory } from './subcategory.model.js';
import ApiError from "../../utils/apiError.js";
import slugify from "slugify";
import { Category } from "../category/category.model.js";
import Features from "../../utils/features.js";

export const getAllSubcategories = asyncHandler(async (req, res) => {
  let filterObj = {};
  if (req.params.categoryId) {
    filterObj.category = req.params.categoryId;
  }
  const count = await Subcategory.countDocuments();
  const features = new Features(Subcategory.find(filterObj), req.query)
    .filter()
    .sort()
    .limitFields()
    .search("subcategory")
    .pagination(count);
  const subcategories = await features.mongooseQuery;
  res.json({
    message: "Success", results: count, metadata: features.paginationResult, data: subcategories
  });
});

export const getSubcategory = asyncHandler(async (req, res, next) => {
  const subcategory = await Subcategory.findById(req.params.id);
  subcategory || next(new ApiError("subcategory not found!", 404));
  !subcategory || res.json({ message: "Success", data: subcategory });
});

export const createSubcategory = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  const category = await Category.findById(req.body.category);
  if (!category) {
    return next(new ApiError("Category not found!", 404));
  }
  const subcategory = await Subcategory.create(req.body);
  res.json({ message: "Success", data: subcategory });
});

export const updateSubcategory = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  const subcategory = await Subcategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  subcategory || next(new ApiError("subcategory not found!", 404));
  !subcategory || res.json({ message: "Success", data: subcategory });
});

export const deleteSubcategory = asyncHandler(async (req, res, next) => {
  const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
  subcategory || next(new ApiError("subcategory not found!", 404));
  !subcategory || res.json({ message: "Success", data: subcategory });
});
