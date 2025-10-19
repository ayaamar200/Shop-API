import { body, check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import UserModel from "../../models/user.model.js";

export const signupValidator = [
  check("username")
    .notEmpty()
    .withMessage("User Name is required")
    .isLength({ min: 3 })
    .withMessage("User Name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("User Name must be at most 32 characters long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage("Email must end with a valid domain (e.g., .com, .net, .org)")
    .custom((val) => {
      return new Promise((resolve, reject) => {
        UserModel.findOne({ email: val }).then((user) => {
          if (user) {
            return reject(new Error("Account already exists"));
          }
          resolve(true);
        });
      });
    }),

  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any")
    .withMessage("Invalid phone number")
    .matches(/^(\+?\d{1,3})?[-.\s]?\d{8,14}$/)
    .withMessage(
      "Invalid phone number format. Accepts local or international (e.g., +201001234567 or 01012345678)"
    ),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol"
    )
    .custom((password, { req }) => {
      if (password !== req.body.rePassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  body("rePassword").notEmpty().withMessage("Confirm Password is required"),
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
