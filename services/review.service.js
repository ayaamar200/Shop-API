import ReviewModel from "../models/reviews.model.js";
import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handler-factory.js";

export const createReview = createOne(ReviewModel, "Review");

export const updateReview = updateOne(ReviewModel, "Review");

export const deleteReview = deleteOne(ReviewModel, "Review");

export const getAllReviews = getAll(ReviewModel, "Review");

export const getSpecificReview = getOne(ReviewModel, "Review");
