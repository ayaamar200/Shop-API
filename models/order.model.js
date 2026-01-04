import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    // Guest identifier (same guestId stored in cookies)
    guestId: {
      type: String,
      index: true,
    },

    // Logged-in user reference (for user orders)
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    // Items coming from the guest or user cart
    orderItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: Number,
        color: String,
        price: { type: Number, required: true },
      },
    ],

    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },

    contactEmail: {
      type: String,
      required: true,
    },

    // Shipping information for guest
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      country: { type: String, required: true },
      city: { type: String, required: true },
      governorate: { type: String, required: true },
      postalCode: { type: String },
      streetAddress: { type: String, required: true },
      building: { type: String },
      notes: { type: String },
    },

    // Payment method (only cash or online)
    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,

    // Order status tracking
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "canceled"],
      default: "pending",
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,

    totalOrderPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "orderItems.product",
    select: "title imageCover ",
  });
  next();
});

// Calculate total price before saving
// orderSchema.pre("save", function (next) {
//   const itemsTotal = this.orderItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   this.totalOrderPrice = itemsTotal + this.taxPrice + this.shippingPrice;

//   next();
// });

const OrderModel = model("Order", orderSchema);
export default OrderModel;
