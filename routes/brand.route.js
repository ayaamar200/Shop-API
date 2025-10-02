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
const router = Router();

router
  .route("/")
  .get(getAllBrands)
  .post(uploadBrandImage, imageProcessing, createBrandValidator, createBrand);
router
  .route("/:id")
  .get(getSpecificBrandValidator, getSpecificBrand)
  .put(uploadBrandImage, imageProcessing, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

export default router;
