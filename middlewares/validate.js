import ApiError from "../utils/apiError.js";

export const validate = (schema) => {
  return async (req, res, next) => {

    const fileInputs = {};

    if (req.file) {
      if (req.file.fieldname === 'image') {
        fileInputs.image = req.file;
      }
      if (req.file.fieldname === 'logo') {
        fileInputs.logo = req.file;
      }
    }

    if (req.files) {
      if (req.files.cover) fileInputs.cover = req.files.cover[0];
      if (req.files.images) fileInputs.images = req.files.images;
    }

      const toValidate = {
        ...fileInputs,
        ...req.body,
        ...req.query,
        ...req.params,
      };

    let {error} = schema.validate(toValidate, {abortEarly: false});
    if (!error) {
      next();
    } else {
      let errMsg = error.details.map(err => err.message);
      next(new ApiError(errMsg, 401));
    }
  }
}