import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import slugify from "slugify";

export const getSpecificCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id is required")
    .isMongoId()
    .withMessage("Invalid Brand id format"),
  validatorMiddleware,
];

export const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 32 })
    .withMessage("Category name must be between 3 and 32 characters long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("image").optional(),
  validatorMiddleware,
];

export const updateCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id is required")
    .isMongoId()
    .withMessage("Invalid Brand id format"),
  check("name")
    .optional()
    .isLength({ min: 3, max: 32 })
    .withMessage("Category name must be between 3 and 32 characters long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

export const deleteCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id is required")
    .isMongoId()
    .withMessage("Invalid Brand id format"),
  validatorMiddleware,
];
