import asyncHandler from "express-async-handler";
import { Brand } from "./brand.model.js";
import ApiError from "../../utils/apiError.js";
import slugify from "slugify";
import fs from 'fs'
// import { redis } from "../../index.js";

export const getAllBrands = asyncHandler(async (req, res) => {
  const cache = await redis.getex("brands")
  if (!cache) {
    const brands = await Brand.find();
    redis.setex("brands", 10, JSON.stringify(brands))
    res.json({ message: "Success", data: brands });
  } else {
    res.json({ message: "Success from cache", data: cache });
  }
});

export const getBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  brand || next(new ApiError("brand not found!", 404));
  !brand || res.json({ message: "Success", data: brand });
});

export const createBrand = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  if (req.file) req.body.logo = req.file.filename
  const brand = await Brand.create(req.body);
  res.json({ message: "Success", data: brand });
});

export const updateBrand = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const brand = await Brand.findById(req.params.id);
    if (brand.logo) {
      const imgName = brand.logo.split("/");
      const filePath = `D:/Practice/e-commerce-API/uploads/brands/${imgName[imgName.length - 1]
        }`;
      fs.unlinkSync(filePath);
    }
  }
  req.body.slug = slugify(req.body.name);
  if (req.file) req.body.logo = req.file.filename
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  brand || next(new ApiError("brand not found!", 404));
  !brand || res.json({ message: "Success", data: brand });
});

export const deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  brand || next(new ApiError("brand not found!", 404));
  !brand || res.json({ message: "Success", data: brand });
});
