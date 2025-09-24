const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

const { uploadSingleFile } = require("../middlewares/upload-file.middleware");
const SubCategoryModel = require("../models/subcategory.model");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handler-factory");

// upload single image
exports.uploadSubcategoryImage = uploadSingleFile("image");

// image processing
exports.imageProcessing = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  const fileName = `subcategory-${req.file.originalname.split(".")[0]}.jpeg`;
  await sharp(req.file.buffer)
    .resize({
      width: 400,
      height: 400,
    })
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(`uploads/subcategories/${fileName}`);

  // save image to database
  req.body.image = fileName;
  next();
});
{
}

// @desc Nested Route
// @route POST /api/v1/categories/:categoryId/subcategories
// @access Private

// 1.Create SubCategory on Category
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.category;
  next();
};

// 2.Get all Subcategories on Category
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.category) filterObject = { category: req.params.category };
  req.filterObj = filterObject;
  next();
};

// @desc    Create SubCategory
// @route   POST  /api/v1/subcategories
// @access  Private
exports.createSubCategory = createOne(SubCategoryModel, "SubCategory");

// @desc    Update Specific SubCategory
// @route   PUT /api/v1/subcategories/:id
// @access  Private
exports.updateSubCategory = updateOne(SubCategoryModel, "SubCategory");

// @desc    Delete Specific SubCategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
exports.deleteSubCategory = deleteOne(SubCategoryModel, "SubCategory");

// @desc    Get list of SubCategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getAllSubCategories = getAll(SubCategoryModel, "SubCategory");

// @desc    Get specific SubCategory by id
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSpecificSubCategory = getOne(SubCategoryModel, "SubCategory");
