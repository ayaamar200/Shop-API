// @desc   Routes for product-related endpoints
import { Router } from "express";
import {
  getSpecificProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} from "../utils/validators/product.validator.js";
import {
  getAllProducts,
  getSpecificProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  imageProcessing,
} from "../services/product.service.js";
const router = Router();

router
  .route("/")
  .get(getAllProducts)
  .post(
    uploadProductImage,
    imageProcessing,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getSpecificProductValidator, getSpecificProduct)
  .put(
    uploadProductImage,
    imageProcessing,
    updateProductValidator,
    updateProduct
  )
  .delete(deleteProductValidator, deleteProduct);

export default router;
