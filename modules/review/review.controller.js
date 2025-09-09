import asyncHandler from "express-async-handler";
import ApiError from "../../utils/apiError.js";
import Features from "../../utils/features.js";
import { Review } from "./review.model.js";

export const getAllReviews = asyncHandler(async (req, res) => {
  const count = await Review.countDocuments();
  const features = new Features(Review.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .search("review")
    .pagination(count);
  const reviews = await features.mongooseQuery;
  res.json({
    message: "Success", results: count, metadata: features.paginationResult, data: reviews
  });
});

export const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  review || next(new ApiError("review not found!", 404));
  !review || res.json({ message: "Success", data: review });
});

export const createReview = asyncHandler(async (req, res, next) => {
  const isExist = await Review.findOne({ user: req.user._id, product: req.body.product })
  if (isExist) return next(new ApiError("You created a review before!", 409))
  req.body.user = req.user._id
  const review = await Review.create(req.body);
  res.json({ message: "Success", data: review });
});

export const updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findOneAndUpdate(
    {_id: req.params.id, user: req.user._id},
    req.body,
    {
      new: true,
    }
  );
  review || next(new ApiError("review not found or you are not created review!", 404));
  !review || res.json({ message: "Success", data: review });
});

export const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  review || next(new ApiError("review not found!", 404));
  !review || res.json({ message: "Success", data: review });
});
