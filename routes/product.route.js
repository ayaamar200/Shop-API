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
  setCategoryIdToBody,
  createFilterObj,
} from "../services/product.service.js";
import reviewsRoutes from "./review.route.js";
import { allowRoles, protect } from "../services/auth.service.js";
const router = Router({ mergeParams: true });

router.use("/:productId/reviews", reviewsRoutes);

router
  .route("/")
  .get(createFilterObj, getAllProducts)
  .post(
    protect,
    allowRoles("admin"),
    uploadProductImage,
    imageProcessing,
    setCategoryIdToBody,
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
