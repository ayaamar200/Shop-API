import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import ReviewModel from "../../models/reviews.model.js";

export const createReviewValidator = [
  check("review").optional(),
  check("rating")
    .notEmpty()
    .withMessage("Review rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1.0 and 5.0"),
  check("user")
    .notEmpty()
    .withMessage("Review must belong to a user")
    .isMongoId()
    .withMessage("Invalid User id format"),
  check("product")
    .notEmpty()
    .withMessage("Review must belong to a product")
    .isMongoId()
    .withMessage("Invalid Product id format")
    .custom(async (val, { req }) => {
      //   check if logged in user create review for this product before
      const review = await ReviewModel.findOne({
        user: req.user._id,
        product: val,
      });
      if (review) {
        throw new Error("You have already reviewed this product");
      }
      return true;
    }),

  validatorMiddleware,
];

export const getSpecificReviewValidator = [
  check("id")
    .notEmpty()
    .withMessage("Review id is required")
    .isMongoId()
    .withMessage("Invalid Review id format"),
  validatorMiddleware,
];

export const updateReviewValidator = [
  check("id")
    .notEmpty()
    .withMessage("Review id is required")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom(async (val, { req }) => {
      const review = await ReviewModel.findById(val);
      if (!review) {
        throw new Error(`Review Not Found for This id ${val}`);
      }
      if (review.user.toString() !== req.user._id.toString()) {
        throw new Error("You are not allowed to update this review");
      }
      return true;
    }),

  check("review").optional(),
  check("rating")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1.0 and 5.0"),

  check("user").optional().isMongoId().withMessage("Invalid User id format"),
  check("product")
    .optional()
    .isMongoId()
    .withMessage("Invalid Product id format"),

  validatorMiddleware,
];

export const deleteReviewValidator = [
  check("id")
    .notEmpty()
    .withMessage("Review id is required")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom(async (val, { req }) => {
      if (req.user.role === "user") {
        const review = await ReviewModel.findById(val);
        if (!review) {
          throw new Error(`Review Not Found for This id ${val}`);
        }
        // Check ownership
        if (review.user.toString() !== req.user._id.toString()) {
          throw new Error("You are not allowed to update this review");
        }
      }
      return true;
    }),

  validatorMiddleware,
];
