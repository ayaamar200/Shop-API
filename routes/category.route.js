// @desc   Routes for category-related endpoints

import { Router } from "express";
import {
  getSpecificCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} from "../utils/validators/category.validator.js";
import {
  getAllCategories,
  getSpecificCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  imageProcessing,
} from "../services/category.service.js";
import subCategoryRoute from "./subcategory.route.js";

const router = Router();

router.use("/:category/subcategories", subCategoryRoute);

router
  .route("/")
  .get(getAllCategories)
  .post(
    uploadCategoryImage,
    imageProcessing,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getSpecificCategoryValidator, getSpecificCategory)
  .put(
    uploadCategoryImage,
    imageProcessing,
    updateCategoryValidator,
    updateCategory
  )
  .delete(deleteCategoryValidator, deleteCategory);

export default router;
