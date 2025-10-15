import { Router } from "express";

import {
  createFilterObj,
  createReview,
  deleteReview,
  getAllReviews,
  getSpecificReview,
  setProductIdAndUserIdToBody,
  updateReview,
} from "../services/review.service.js";
import { allowRoles, protect } from "../services/auth.service.js";
import {
  createReviewValidator,
  deleteReviewValidator,
  getSpecificReviewValidator,
  updateReviewValidator,
} from "../utils/validators/review.validator.js";

const router = Router({ mergeParams: true });


router
  .route("/")
  .get(createFilterObj,getAllReviews)
  .post(protect, allowRoles("user"),setProductIdAndUserIdToBody, createReviewValidator, createReview);
router
  .route("/:id")
  .get(getSpecificReviewValidator, getSpecificReview)
  .put(protect, allowRoles("user"), updateReviewValidator, updateReview)
  .delete(
    protect,
    allowRoles("user", "admin"),
    deleteReviewValidator,
    deleteReview
  );

export default router;
