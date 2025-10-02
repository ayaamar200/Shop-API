import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    cartItem: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        price: Number,
      },
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const CartModel = model("Cart", cartSchema);

export default CartModel;
