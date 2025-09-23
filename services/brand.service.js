const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

const { uploadSingleFile } = require("../middlewares/upload-file.middleware");
const BrandModel = require("../models/brand.model");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handler-factory");

// upload single image
exports.uploadBrandImage = uploadSingleFile("image");

// image processing
exports.imageProcessing = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  const fileName = `brand-${req.file.originalname.split(".")[0]}.jpeg`;
  await sharp(req.file.buffer)
    .resize({
      width: 720,
      height: 200,
    })
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(`uploads/brands/${fileName}`);

  // save image to database
  req.body.image = fileName;
  next();
});
{
}

// @desc    Create Brand
// @route   POST  /api/v1/brands
// @access  Private
exports.createBrand = createOne(BrandModel, "Brand");

// @desc    Update Specific Brand
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand = updateOne(BrandModel, "Brand");

// @desc    Delete Specific Brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = deleteOne(BrandModel, "Brand");

// @desc    Get list of Brands
// @route   GET /api/v1/brands
// @access  Public
exports.getAllBrands = getAll(BrandModel, "Brand");

// @desc    Get Specific Brand by id
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getSpecificBrand = getOne(BrandModel, "Brand");
