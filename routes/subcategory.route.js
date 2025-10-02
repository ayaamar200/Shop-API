import { Router } from "express";
import {
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
  getSpecificSubCategoryValidator,
} from "../utils/validators/subcategory.validator.js";
import {
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSpecificSubCategory,
  createFilterObj,
  setCategoryIdToBody,
  uploadSubcategoryImage,
  imageProcessing,
} from "../services/subcategory.service.js";
// mergeParams to get access to params from parent router (category)
const router = Router({ mergeParams: true });

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
export default router;
