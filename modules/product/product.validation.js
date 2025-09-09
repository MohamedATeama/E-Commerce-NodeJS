import Joi from "joi";

export const createCategoryValidation = Joi.object({
  title: Joi.string().min(1).max(50).required(),
  desc: Joi.string().min(30).max(1000).required(),
  price: Joi.number().min(0).required(),
  priceAfterDiscount: Joi.number().min(0).required(),
  category: Joi.string().required(),
  subcategory: Joi.string().required(),
  brand: Joi.string().required(),
  cover: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid('image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp').required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().min(1).max(5 * 1024 * 1024).required(),
  }).required(),
  images: Joi.array().items(
    Joi.object({
      fieldname: Joi.string().required(),
      originalname: Joi.string().required(),
      encoding: Joi.string().required(),
      mimetype: Joi.string().valid('image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp').required(),
      destination: Joi.string().required(),
      filename: Joi.string().required(),
      path: Joi.string().required(),
      size: Joi.number().min(1).max(5 * 1024 * 1024).required(),
    })
  ).required(),
  stock: Joi.number().min(0).required(),
  rateAvg: Joi.number().min(0).max(5).optional(),
  rateCount: Joi.number().optional(),
  sold: Joi.number().optional(),
})