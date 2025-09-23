// @desc   Routes for product-related endpoints
const express = require("express");
const {
  getSpecificProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/product.validator");
const {
  getAllProducts,
  getSpecificProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../services/product.service");
const router = express.Router();


router
  .route("/")
  .get(getAllProducts)
  .post(createProductValidator, createProduct);
router
  .route("/:id")
  .get(getSpecificProductValidator, getSpecificProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
