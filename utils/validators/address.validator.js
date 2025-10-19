import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validator.middleware.js";

export const addAddressValidator = [
  check("alias").optional().isString().withMessage("Alias must be a string"),
  check("details")
    .notEmpty()
    .withMessage("Details is required")
    .isString()
    .withMessage("Details must be a string")
    .isLength({ min: 5 })
    .withMessage("Details must be at least 5 characters long"),
  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone(["ar-EG", "ar-SA", "en-US"])
    .withMessage("Invalid phone number format"),
  check("city")
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string"),
  check("postalCode")
    .optional()
    .isNumeric()
    .withMessage("Postal code must be a number")
    .isPostalCode("any")
    .withMessage("Invalid postal code format"),
  check("governorate")
    .optional()
    .isString()
    .withMessage("Governorate must be a string"),

  validatorMiddleware,
];

export const removeAddressValidator = [
  check("addressId")
    .notEmpty()
    .withMessage("Address ID is required")
    .isMongoId()
    .withMessage("Invalid Address ID format"),
  validatorMiddleware,
];
