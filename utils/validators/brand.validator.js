const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator.middleware");
const slugify = require("slugify");

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 3, max: 32 })
    .withMessage("Brand name must be between 3 and 32 characters long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.getSpecificBrandValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id is required")
    .isMongoId()
    .withMessage("Invalid Brand id format"),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id is required")
    .isMongoId()
    .withMessage("Invalid Brand id format"),
  check("name")
    .optional()
    .isLength({ min: 3, max: 32 })
    .withMessage("Brand name must be between 3 and 32 characters long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id is required")
    .isMongoId()
    .withMessage("Invalid Brand id format"),
  validatorMiddleware,
];
