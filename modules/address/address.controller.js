import expressAsyncHandler from "express-async-handler";
import { User } from "../user/user.model.js";
import ApiError from "../../utils/apiError.js";

export const addAddress = expressAsyncHandler(async (req, res, next) => {
  const address = await User.findByIdAndUpdate(req.user._id, { $push: { addresses: req.body } }, { new: true })
  address || next(new ApiError("address not found!", 404))
  !address || res.json({ message: "success", addresses: address.addresses })
})

export const removeAddress = expressAsyncHandler(async (req, res, next) => {
  const address = await User.findByIdAndUpdate(req.user._id, { $pull: { addresses: {_id: req.params.id} } }, { new: true })
  address || next(new ApiError("address not found!", 404))
  !address || res.json({ message: "success" })
})

export const getAddresses = expressAsyncHandler(async (req, res, next) => {
  const address = await User.findById(req.user._id)
  res.json({ message: "success", addresses: address.addresses })
})