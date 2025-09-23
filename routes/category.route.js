// @desc   Routes for category-related endpoints

const express = require("express");
const {
  getSpecificCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/category.validator");
const {
  getAllCategories,
  getSpecificCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  imageProcessing,
} = require("../services/category.service");
const router = express.Router();
const subCategoryRoute = require("./subcategory.route");

router.use("/:category/subcategories", subCategoryRoute);


router
  .route("/")
  .get(getAllCategories)
  .post(uploadCategoryImage,imageProcessing,createCategoryValidator, createCategory);
router
  .route("/:id")
  .get(getSpecificCategoryValidator, getSpecificCategory)
  .put(uploadCategoryImage,imageProcessing,updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
