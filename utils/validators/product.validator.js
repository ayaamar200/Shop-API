import { check } from "express-validator";

import slugify from "slugify";
import CategoryModel from "../../models/category.model.js";
import SubCategoryModel from "../../models/subcategory.model.js";
import BrandModel from "../../models/brand.model.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";

export const getSpecificProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id is required")
    .isMongoId()
    .withMessage("Invalid Brand id format"),
  validatorMiddleware,
];

export const createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .isLength({ min: 3, max: 100 })
    .withMessage("Product title must be between 3 and 100 characters long"),

  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 20, max: 2000 })
    .withMessage(
      "Product description must be between 20 and 2000 characters long"
    ),

  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isInt({ min: 0 })
    .withMessage("Product quantity must be a non-negative integer"),
  check("sold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Product sold must be a non-negative integer"),

  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ min: 0 })
    .withMessage("Product price must be a non-negative number")
    .isLength({ max: 32 })
    .withMessage("Product price must not exceed 32 characters"),

  // check("priceAfterDiscount")
  //   .optional()
  //   .isFloat({ min: 0 })
  //   .withMessage("Product price after discount must be a non-negative number")
  //   .custom((val, { req }) => {
  //     if (val >= req.body.price) {
  //       throw new Error(
  //         "Price after discount must be less than the original price"
  //       );
  //     }
  //     return true;
  //   }),

  check("imageCover").notEmpty().withMessage("Product image cover is required"),

  check("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array of strings"),

  check("category")
    .notEmpty()
    .withMessage("Product must belong to a category")
    .isMongoId()
    .withMessage("Invalid Category ID format")
    .custom(async (categoryId) => {
      const exists = await CategoryModel.exists({ _id: categoryId });
      if (!exists) {
        throw new Error(`Category Not Found for This id ${categoryId}`);
      }
      return true;
    }),

  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid Subcategory ID format")
    .custom(async (subcategories, { req }) => {
      if (!Array.isArray(subcategories))
        // skip validation if not provided
        return true;

      // 1. Check all subcategory IDs exist in DB
      const existingSubs = await SubCategoryModel.find({
        _id: { $in: subcategories },
      }).select("_id category");

      if (existingSubs.length !== subcategories.length) {
        throw new Error("Some subcategory IDs are invalid");
      }

      // 2. Check all belong to the same parent category
      const invalid = existingSubs.filter(
        (sub) => sub.category.toString() !== req.body.category
      );

      if (invalid.length > 0) {
        throw new Error(
          `Some subcategories do not belong to category ${req.body.category}`
        );
      }

      return true;
    }),

  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid Brand ID format")
    .custom(async (brandId) => {
      if (!brandId) return true;
      const exists = await BrandModel.exists({ _id: brandId });
      if (!exists) {
        throw new Error(`No brand found for ID: ${brandId}`);
      }
      return true;
    }),

  check("ratingsAverage")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings average must be between 1.0 and 5.0"),
  check("ratingsQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Ratings quantity must be a non-negative integer"),
  validatorMiddleware,
];

export const updateProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id is required")
    .isMongoId()
    .withMessage("Invalid Brand id format"),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  ,
  validatorMiddleware,
];

export const deleteProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id is required")
    .isMongoId()
    .withMessage("Invalid Brand id format"),
  validatorMiddleware,
];
