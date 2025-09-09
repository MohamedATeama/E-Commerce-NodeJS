import Joi from "joi";

export const createBrandValidation = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  logo: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid('image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp').required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().min(1).max(5 * 1024 * 1024).required(),
  }).required(),
})