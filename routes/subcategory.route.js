const express = require("express");
const {
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
  getSpecificSubCategoryValidator,
} = require("../utils/validators/subcategory.validator");
const {
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSpecificSubCategory,
  createFilterObj,
  setCategoryIdToBody,
  uploadSubcategoryImage,
  imageProcessing,
} = require("../services/subcategory.service");
// mergeParams to get access to params from parent router (category)
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj, getAllSubCategories)
  .post(
    uploadSubcategoryImage,
    imageProcessing,
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  );

router
  .route("/:id")
  .get(getSpecificSubCategoryValidator, getSpecificSubCategory)
  .put(
    uploadSubcategoryImage,
    imageProcessing,
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(deleteSubCategoryValidator, deleteSubCategory);
module.exports = router;
