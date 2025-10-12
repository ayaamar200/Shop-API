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
import { allowRoles, protect } from "../services/auth.service.js";

const router = Router();

router.use("/:category/subcategories", subCategoryRoute);

router
  .route("/")
  .get(getAllCategories)
  .post(
    protect,
    allowRoles("admin"),
    uploadCategoryImage,
    imageProcessing,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getSpecificCategoryValidator, getSpecificCategory)
  .put(
    protect,
    allowRoles("admin"),
    uploadCategoryImage,
    imageProcessing,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    protect,
    allowRoles("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

export default router;
