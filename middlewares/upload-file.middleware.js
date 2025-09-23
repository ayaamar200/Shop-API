const multer = require("multer");
const ApiError = require("../utils/api-error");

exports.uploadSingleFile = (fieldName) => {
  // Memory Storage engine
  const storage = multer.memoryStorage();

  const fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images are allowed", 400), false);
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  });

  return upload.single(fieldName);
};
