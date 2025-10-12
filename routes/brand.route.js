import { Router } from "express";
import {
  getSpecificBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} from "../utils/validators/brand.validator.js";
import {
  getAllBrands,
  getSpecificBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  imageProcessing,
} from "../services/brand.service.js";
import { allowRoles, protect } from "../services/auth.service.js";
const router = Router();

router
  .route("/")
  .get(getAllBrands)
  .post(
    protect,
    allowRoles("admin"),
    uploadBrandImage,
    imageProcessing,
    createBrandValidator,
    createBrand
  );
router
  .route("/:id")
  .get(getSpecificBrandValidator, getSpecificBrand)
  .put(
    protect,
    allowRoles("admin"),
    uploadBrandImage,
    imageProcessing,
    updateBrandValidator,
    updateBrand
  )
  .delete(protect, allowRoles("admin"), deleteBrandValidator, deleteBrand);

export default router;
