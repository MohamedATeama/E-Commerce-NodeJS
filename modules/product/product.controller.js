import asyncHandler from "express-async-handler";
import { Product } from './product.model.js';
import ApiError from "../../utils/apiError.js";
import slugify from "slugify";
import Features from "../../utils/features.js";

export const getAllProducts = asyncHandler(async (req, res) => {
  const count = await Product.countDocuments();
  const features = new Features(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .search("product")
    .pagination(count);
  const products = await features.mongooseQuery;
  res.json({ message: "Success", results: count, metadata: features.paginationResult, data: products });
})

export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  product || next(new ApiError("product not found!", 404))
  !product || res.json({ message: "Success", data: product });
})

export const createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  if (req.files) {
    req.body.cover = req.files.cover[0].filename;
    req.body.images = req.files.images.map(file => file.filename);
  }
  const product = await Product.create(req.body);
  res.json({ message: "Success", data: product });
})

export const updateProduct = asyncHandler(async (req, res, next) => {
  if (req.body.title) req.body.slug = slugify(req.body.title);
  if (req.files.length > 0) {
    req.body.cover = req.files.cover[0].filename;
    req.body.images = req.files.images.map(file => file.filename);
  }
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  product || next(new ApiError("product not found!", 404));
  !product || res.json({ message: "Success", data: product });
})

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  product || next(new ApiError("product not found!", 404));
  !product || res.json({ message: "Success", data: product });
})