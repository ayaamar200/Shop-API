import { body, check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import UserModel from "../../models/user.model.js";

export const signupValidator = [
  check("username")
    .notEmpty()
    .withMessage("User username is required")
    .isLength({ min: 3 })
    .withMessage("User username must be at least 3 characters long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("User email is invalid")
    .custom((val) => {
      return new Promise((resolve, reject) => {
        UserModel.findOne({ email: val }).then((user) => {
          if (user) {
            return reject(new Error("Email already exists"));
          }
          resolve(true);
        });
      });
    }),
  check("phone")
    .notEmpty()
    .withMessage("User phone is required")
    .isMobilePhone(["ar-EG", "ar-SA", "en-US"])
    .withMessage("User phone is invalid"),

  check("password")
    .notEmpty()
    .withMessage("User password is required")
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "User password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol"
    )
    .custom((password, { req }) => {
      if (password !== req.body.rePassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  body("rePassword")
    .notEmpty()
    .withMessage("User confirm password is required"),
  validatorMiddleware,
];

export const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("User email is invalid"),
  check("password")
    .notEmpty()
    .withMessage("User password is required")
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "User password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol"
    ),
  validatorMiddleware,
];
