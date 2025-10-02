import { Schema, model } from "mongoose";
const couponSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Coupon name is required"],
      unique: [true, "Coupon name must be unique"],
      uppercase: true,
      trim: true,
    },
    expire: {
      type: Date,
      required: [true, "Coupon expire date is required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount is required"],
    },
  },
  { timestamps: true }
);

const CouponModel = model("Coupon", couponSchema);

export default CouponModel;
