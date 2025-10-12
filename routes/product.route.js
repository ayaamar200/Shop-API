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
import { allowRoles, protect } from "../services/auth.service.js";
const router = Router();

router
  .route("/")
  .get(getAllProducts)
  .post(
    protect,
    allowRoles("admin"),
    uploadProductImage,
    imageProcessing,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getSpecificProductValidator, getSpecificProduct)
  .put(
    protect,
    allowRoles("admin"),
    uploadProductImage,
    imageProcessing,
    updateProductValidator,
    updateProduct
  )
  .delete(protect, allowRoles("admin"), deleteProductValidator, deleteProduct);

export default router;
