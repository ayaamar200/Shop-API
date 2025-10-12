import { Schema, model } from "mongoose";
const reviewSchema = new Schema({
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
}, { timestamps: true });

const ReviewModel = model("Review", reviewSchema);
export default ReviewModel;