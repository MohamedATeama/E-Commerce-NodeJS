import expressAsyncHandler from "express-async-handler";
import { User } from "../user/user.model.js";
import ApiError from "../../utils/apiError.js";

export const addToWishlist = expressAsyncHandler(async (req, res, next) => {
  const wishlist = await User.findByIdAndUpdate(req.user._id, { $addToSet: { wishlist: req.body.product } }, { new: true })
  wishlist || next(new ApiError("wishlist not found!", 404))
  !wishlist || res.json({ message: "success", wishlist: wishlist.wishlist })
})

export const removeFromWishlist = expressAsyncHandler(async (req, res, next) => {
  const wishlist = await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: req.params.id } }, { new: true })
  wishlist || next(new ApiError("wishlist not found!", 404))
  !wishlist || res.json({ message: "success" })
})

export const getWishlist = expressAsyncHandler(async (req, res, next) => {
  const wishlist = await User.findById(req.user._id).populate("wishlist")
  res.json({ message: "success", wishlist: wishlist.wishlist })
})