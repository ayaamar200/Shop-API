import { Router } from "express";
// import {
//   getSpecificReviewValidator,
//   createReviewValidator,
//   updateReviewValidator,
//   deleteReviewValidator,
// } from "../utils/validators/brand.validator.js";

import {
  createReview,
  deleteReview,
  getAllReviews,
  getSpecificReview,
  updateReview,
} from "../services/review.service.js";
import { allowRoles, protect } from "../services/auth.service.js";

const router = Router();

router
  .route("/")
  .get(getAllReviews)
  .post(protect, allowRoles("user"), createReview);
router
  .route("/:id")
  .get(getSpecificReview)
  .put(protect, allowRoles("user"), updateReview)
  .delete(protect, allowRoles("user", "admin"), deleteReview);

export default router;
