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
        price: { type: Number, required: true },
      },
    ],

    totalCartPrice: {
      type: Number,
      default: 0,
    },
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

// Ensure total price is always correct
// cartSchema.pre("save", function (next) {
//   if (!this.cartItems || this.cartItems.length === 0) {
//     this.totalCartPrice = 0;
//     this.totalPriceAfterDiscount = undefined;
//     return next();
//   }

//   this.totalCartPrice = this.cartItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   next();
// });

const CartModel = model("Cart", cartSchema);
export default CartModel;
