import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import ProductModel from "../../models/product.model.js";

export const addProductToCartValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID format")
    .bail()
    .custom(async (val) => {
      const product = await ProductModel.findById(val);
      if (!product) {
        throw new Error("Product not found");
      }
      return true;
    }),
  check("color")
    .optional()
    .isString()
    .withMessage("Color must be a valid string"),

  validatorMiddleware,
];

export const removeSpecificCartItemValidator = [
  check("cartItemId")
    .notEmpty()
    .withMessage("Cart item ID is required")
    .isMongoId()
    .withMessage("Invalid cart item ID format"),
  validatorMiddleware,
];

export const updateCartItemQuantityValidator = [
  check("cartItemId")
    .notEmpty()
    .withMessage("Cart item ID is required")
    .isMongoId()
    .withMessage("Invalid cart item ID format"),
  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  validatorMiddleware,
];

export const applyCouponValidator = [
  check("coupon")
    .notEmpty()
    .withMessage("Coupon code is required")
    .isString()
    .withMessage("Coupon must be a string"),
  validatorMiddleware,
];
