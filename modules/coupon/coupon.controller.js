import asyncHandler from "express-async-handler";
import ApiError from "../../utils/apiError.js";
import { Coupon } from "./coupon.model.js";

export const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.json({ message: "Success", data: coupons });
});

export const getCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);
  coupon || next(new ApiError("coupon not found!", 404));
  !coupon || res.json({ message: "Success", data: coupon });
});

export const createCoupon = asyncHandler(async (req, res, next) => {
  const isExist = await Coupon.findOne({ code: req.body.code })
  if (isExist) return next(new ApiError("coupon exist!", 409))
  const coupon = await Coupon.create(req.body);
  res.json({ message: "Success", data: coupon });
});

export const updateCoupon = asyncHandler(async (req, res, next) => {
  if (req.body.code) {
    const isExist = await Coupon.findOne({ code: req.body.code })
    if (isExist) next(new ApiError("coupon exist!", 409))
  }
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  coupon || next(new ApiError("coupon not found!", 404));
  !coupon || res.json({ message: "Success", data: coupon });
});

export const deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  coupon || next(new ApiError("coupon not found!", 404));
  !coupon || res.json({ message: "Success", data: coupon });
});
