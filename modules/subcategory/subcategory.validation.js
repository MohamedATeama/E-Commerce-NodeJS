import Joi from "joi";

export const createSubcategoryValidation = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  category: Joi.string().required(),
})