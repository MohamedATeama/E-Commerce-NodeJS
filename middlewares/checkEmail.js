import { User } from "../modules/user/user.model.js"
import ApiError from "../utils/apiError.js"

export const checkEmail = async (req, res, next) => {
  const isExist = await User.findOne({ email: req.body.email })
  if (isExist) next(new ApiError("Email already exist!", 409))
  next()
}