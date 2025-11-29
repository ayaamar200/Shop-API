import { Schema, model } from "mongoose";
const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    cartItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        color: { type: String, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);
const Order = model("Order", orderSchema);
export default Order;
