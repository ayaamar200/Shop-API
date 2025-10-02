import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validator.middleware.js";

export const createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon name is required")
    .customSanitizer((val) => val.toUpperCase()),
  check("expire").notEmpty().withMessage("Coupon expire date is required"),
  check("discount").notEmpty().withMessage("Coupon discount is required"),
  validatorMiddleware,
];

export const getCouponValidator = [
  check("id")
    .notEmpty()
    .withMessage("Coupon id is required")
    .isMongoId()
    .withMessage("Invalid Coupon id format"),
  validatorMiddleware,
];

export const updateCouponValidator = [
  check("id")
    .notEmpty()
    .withMessage("Coupon id is required")
    .isMongoId()
    .withMessage("Invalid Coupon id format"),

  validatorMiddleware,
];

export const deleteCouponValidator = [
  check("id")
    .notEmpty()
    .withMessage("Coupon id is required")
    .isMongoId()
    .withMessage("Invalid Coupon id format"),
  validatorMiddleware,
];
