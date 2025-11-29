import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    cartItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: String,
        price: Number,
      },
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,

    // Only guest cart
    guestId: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const CartModel = model("Cart", cartSchema);
export default CartModel;
