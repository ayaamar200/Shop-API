import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import CategoryModel from "../../models/category.model.js";
import slugify from "slugify";

export const getSpecificSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id is required")
    .isMongoId()
    .withMessage("Invalid Brand id format"),
  validatorMiddleware,
];

export const createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("SubCategory name must be between 2 and 50 characters long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("Parent Category ID is required")
    .isMongoId()
    .withMessage("Invalid Parent Category ID format")
    .custom(async (categoryId) => {
      const exists = await CategoryModel.exists({ _id: categoryId });
      if (!exists) {
        throw new Error(`Category Not Found for This id ${categoryId}`);
      }
      return true;
    }),
  check("image").optional(),

  validatorMiddleware,
];

export const updateSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id is required")
    .isMongoId()
    .withMessage("Invalid Brand id format"),
  check("name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid Parent Category ID format")
    .custom(async (categoryId) => {
      const exists = await CategoryModel.exists({ _id: categoryId });
      if (!exists) {
        throw new Error(`Category Not Found for This id ${categoryId}`);
      }
      return true;
    }),
  validatorMiddleware,
];

export const deleteSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id is required")
    .isMongoId()
    .withMessage("Invalid Brand id format"),
  validatorMiddleware,
];
