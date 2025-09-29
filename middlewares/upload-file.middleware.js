const multer = require("multer");
const ApiError = require("../utils/api-error");

const multerOptions = () => {
  // Memory Storage engine
  const multerStorage = multer.memoryStorage();

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

exports.uploadSingleFile = (fieldName) => multerOptions().single(fieldName);

exports.uploadMultipleFiles = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
