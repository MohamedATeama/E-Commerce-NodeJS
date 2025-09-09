import multer from 'multer' 
import { v4 as uuidv4 } from 'uuid';
import ApiError from '../utils/apiError.js'

const uploadOption = (folderName) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${folderName}`)
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + '-' + file.originalname)
    }
  })

  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image'))
      cb(null, true)
    else
    cb(new ApiError('images only', 401), false)
  }

  return multer({ storage, fileFilter })
}

export const uploadSingleImage = (fileName, folderName) => uploadOption(folderName).single(fileName)

export const uploadMultipleImages = (arrayOfFields, folderName) => uploadOption(folderName).fields(arrayOfFields)