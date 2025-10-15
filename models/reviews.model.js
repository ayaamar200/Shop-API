import { Schema, model } from "mongoose";
import ProductModel from "./product.model.js";
const reviewSchema = new Schema(
  {
    review: {
      type: String,
    },
    rating: {
      type: Number,
      required: [true, "Review rating is required"],
      min: [1, "Rating must be at least 1.0"],
      max: [5, "Rating must be at most 5.0"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "user",
      select: "username slug profileImage",
    },
  ]);
  next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        nRating: { $sum: 1 },
        avgRatings: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRatings,
    });
  } else {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

const ReviewModel = model("Review", reviewSchema);
export default ReviewModel;
