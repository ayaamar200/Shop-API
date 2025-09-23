const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

const CategoryModel = require("../models/category.model");
const { uploadSingleFile } = require("../middlewares/upload-file.middleware");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handler-factory");

// upload single image
exports.uploadCategoryImage = uploadSingleFile("image");

// image processing
exports.imageProcessing = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  const fileName = `category-${req.file.originalname.split(".")[0]}.jpeg`;
  await sharp(req.file.buffer)
    .resize({
      width: 400,
      height: 400,
    })
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(`uploads/categories/${fileName}`);

  // save image to database
  req.body.image = fileName;
  next();
});
{
}

// @desc    Create Category
// @route   POST  /api/v1/categories
// @access  Private
exports.createCategory = createOne(CategoryModel, "Category");

// @desc    Update Specific Category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = updateOne(CategoryModel, "Category");

// @desc    Delete Specific Category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = deleteOne(CategoryModel, "Category");

// @desc    Get list of Categories
// @route   GET /api/v1/categories
// @access  Public
exports.getAllCategories = getAll(CategoryModel, "Category");

// @desc    Get Specific Category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getSpecificCategory = getOne(CategoryModel, "Category");
