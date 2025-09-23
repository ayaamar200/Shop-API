const SubCategoryModel = require("../models/subcategory.model");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handler-factory");

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
