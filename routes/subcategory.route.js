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
import { allowRoles, protect } from "../services/auth.service.js";
// mergeParams to get access to params from parent router (category)
const router = Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj, getAllSubCategories)
  .post(
    protect,
    allowRoles("admin"),
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
    protect,
    allowRoles("admin"),
    uploadSubcategoryImage,
    imageProcessing,
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    protect,
    allowRoles("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );
export default router;
