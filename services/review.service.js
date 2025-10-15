import ReviewModel from "../models/reviews.model.js";
import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handler-factory.js";

// 1.Create Review on Product
export function setProductIdAndUserIdToBody(req, res, next) {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
}
// 2.Get all Reviews on Product
export function createFilterObj(req, res, next) {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
}

export const createReview = createOne(ReviewModel, "Review");

export const updateReview = updateOne(ReviewModel, "Review");

export const deleteReview = deleteOne(ReviewModel, "Review");

export const getAllReviews = getAll(ReviewModel, "Review");

export const getSpecificReview = getOne(ReviewModel, "Review");
