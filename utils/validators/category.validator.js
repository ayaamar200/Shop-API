const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator.middleware");
const slugify = require("slugify");

exports.getSpecificCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id is required")
    .isMongoId()
    .withMessage("Invalid Brand id format"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 32 })
    .withMessage("Category name must be between 3 and 32 characters long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
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

exports.deleteCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id is required")
    .isMongoId()
    .withMessage("Invalid Brand id format"),
  validatorMiddleware,
];
