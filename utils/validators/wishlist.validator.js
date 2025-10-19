import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import ProductModel from "../../models/product.model.js";

export const addProductToWishlistValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Wishlist id is required")
    .isMongoId()
    .withMessage("Invalid Wishlist id format")
    .custom(async (val) => {
      const product = await ProductModel.findById(val);
      if (!product) {
        throw new Error("No product found with this ID");
      }
      return true;
    }),
  validatorMiddleware,
];

export const removeProductFromWishlistValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid Product ID format"),
  validatorMiddleware,
];
