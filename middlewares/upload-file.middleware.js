import multer, { memoryStorage } from "multer";
import ApiError from "../utils/api-error.js";

const multerOptions = () => {
  // Memory Storage engine
  const multerStorage = memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images are allowed", 400), false);
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });

  return upload;
};

export function uploadSingleFile(fieldName) {
  return multerOptions().single(fieldName);
}

export function uploadMultipleFiles(arrayOfFields) {
  return multerOptions().fields(arrayOfFields);
}
