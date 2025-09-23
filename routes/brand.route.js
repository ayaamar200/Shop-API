const express = require("express");
const {
  getSpecificBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brand.validator");
const {
  getAllBrands,
  getSpecificBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  imageProcessing,
} = require("../services/brand.service");
const router = express.Router();

router
  .route("/")
  .get(getAllBrands)
  .post(uploadBrandImage, imageProcessing, createBrandValidator, createBrand);
router
  .route("/:id")
  .get(getSpecificBrandValidator, getSpecificBrand)
  .put(uploadBrandImage, imageProcessing, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
