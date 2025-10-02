import { body, check } from "express-validator";
import slugify from "slugify";
import bcrypt from "bcrypt";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import UserModel from "../../models/user.model.js";

export const createUserValidator = [
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
    })
    .optional(),

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
    ),
  body("rePassword")
    .notEmpty()
    .withMessage("User confirm password is required")
    .custom((rePassword, { req }) => {
      if (rePassword !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("profileImage").optional(),
  check("role").optional(),
  validatorMiddleware,
];

export const getSpecificUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id is required")
    .isMongoId()
    .withMessage("Invalid User id format"),
  validatorMiddleware,
];

export const updateUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id is required")
    .isMongoId()
    .withMessage("Invalid User id format"),
  check("username")
    .optional()
    .isLength({ min: 3 })
    .withMessage("User username must be at least 3 characters long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
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
    })
    .optional(),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA", "en-US"])
    .withMessage("User phone is invalid"),

  check("profileImage").optional(),
  check("role").optional(),
  validatorMiddleware,
];

export const deleteUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id is required")
    .isMongoId()
    .withMessage("Invalid User id format"),
  validatorMiddleware,
];

export const deactivateUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id is required")
    .isMongoId()
    .withMessage("Invalid User id format"),

  validatorMiddleware,
];

export const changeUserPasswordValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id is required")
    .isMongoId()
    .withMessage("Invalid User id format"),

  body("currentPassword")
    .notEmpty()
    .withMessage("User current password is required")
    .custom(async (val, { req }) => {
      // 1- verify new password
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        throw new Error("User not found for this id");
      }
      const isMatch = await bcrypt.compare(val, user.password);
      if (!isMatch) {
        throw new Error("User current password is incorrect");
      }
      return true;
    }),

  body("newPassword")
    .notEmpty()
    .withMessage("User new password is required")
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

  body("rePassword")
    .notEmpty()
    .withMessage("User confirm password is required")
    .custom((rePassword, { req }) => {
      if (rePassword !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  validatorMiddleware,
];
