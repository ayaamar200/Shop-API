import asyncHandler from "express-async-handler";
import CartModel from "../models/cart.model.js";
import ApiError from "../utils/api-error.js";
import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import { getAll, getOne } from "./handler-factory.js";
import stripe from "../utils/stripe.js";

// Cash Payment
export const createCashOrder = asyncHandler(async (req, res, next) => {
  // Determine contact email:
  // - Logged-in user: use user.email
  // - Guest: must provide contactEmail in body
  const contactEmail = req.user ? req.user.email : req.body.contactEmail;

  if (!contactEmail || !req.body.shippingAddress) {
    return next(
      new ApiError("Contact details and shipping address are required", 400)
    );
  }

  // 1) Get cart by cartId AND verify ownership (security fix)
  const cartFilter = { _id: req.params.cartId };
  
  // Verify cart belongs to current user or guest
  if (req.user) {
    cartFilter.user = req.user._id;
  } else if (req.guestId) {
    cartFilter.guestId = req.guestId;
  } else {
    return next(
      new ApiError("Authentication or guest session required", 401)
    );
  }

  const cart = await CartModel.findOne(cartFilter);

  if (!cart) {
    return next(
      new ApiError("Cart not found or you don't have permission to access it", 404)
    );
  }

  // 2) Calculate order price
  const taxPrice = 0;
  const shippingPrice = 0;

  const orderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = orderPrice + taxPrice + shippingPrice;

  // 3) Create order (for guest or logged-in user)
  const order = await OrderModel.create({
    guestId: cart.guestId,
    user: cart.user,
    orderItems: cart.cartItems,
    contactEmail,
    shippingAddress: req.body.shippingAddress,
    taxPrice,
    shippingPrice,
    totalOrderPrice,
  });

  // 4) Update product stock
  if (order) {
    const bulkOptions = order.orderItems.map((item) => ({
      updateOne: {
        filter: {
          _id: item.product,
          quantity: { $gte: item.quantity },
        },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await ProductModel.bulkWrite(bulkOptions, {});
  }

  // 5) Clear cart
  await CartModel.deleteOne({ _id: req.params.cartId });

  res.status(201).json({
    status: "success",
    message: "Order created successfully.",
    data: order,
  });
});

export const filterOrders = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    req.filterObj = {};
  } else if (req.user) {
    req.filterObj = { user: req.user._id };
  } else if (req.guestId) {
    req.filterObj = { guestId: req.guestId };
  } else {
    req.filterObj = {};
  }

  next();
});

export const getAllOrders = getAll(OrderModel, "Orders");

// Secure getOrder with ownership verification (security fix)
export const getOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Find the order
  const order = await OrderModel.findById(id);
  if (!order) {
    return next(new ApiError("Order not found", 404));
  }

  // Verify ownership/access
  // Admin can access any order
  if (req.user && req.user.role === "admin") {
    return res.status(200).json({
      status: "success",
      message: "Order found",
      data: order,
    });
  }

  // Logged-in user can only access their own orders
  if (req.user) {
    if (order.user && order.user.toString() === req.user._id.toString()) {
      return res.status(200).json({
        status: "success",
        message: "Order found",
        data: order,
      });
    }
    return next(
      new ApiError("You do not have permission to access this order", 403)
    );
  }

  // Guest can only access orders with their guestId
  if (req.guestId) {
    if (order.guestId === req.guestId) {
      return res.status(200).json({
        status: "success",
        message: "Order found",
        data: order,
      });
    }
    return next(
      new ApiError("You do not have permission to access this order", 403)
    );
  }

  // No authentication and no guestId - require authentication
  return next(
    new ApiError("Authentication required to access orders", 401)
  );
});

export const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(new ApiError("No order found with this id", 404));
  }
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

export const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(new ApiError("No order found with this id", 404));
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.orderStatus = "delivered";

  const updatedOrder = await order.save();
  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

// online Payment
export const checkoutSession = asyncHandler(async (req, res, next) => {
  // Verify cart ownership (security fix)
  const cartFilter = { _id: req.params.cartId };
  
  // Verify cart belongs to current user or guest
  if (req.user) {
    cartFilter.user = req.user._id;
  } else if (req.guestId) {
    cartFilter.guestId = req.guestId;
  } else {
    return next(
      new ApiError("Authentication or guest session required", 401)
    );
  }

  const cart = await CartModel.findOne(cartFilter);

  if (!cart) {
    return next(
      new ApiError("Cart not found or you don't have permission to access it", 404)
    );
  }

  // Determine contact email for Stripe session
  const contactEmail = req.user ? req.user.email : req.body.contactEmail;
  if (!contactEmail) {
    return next(
      new ApiError("Contact email is required to create a payment session", 400)
    );
  }

  // 2) Calculate order price
  const taxPrice = 0;
  const shippingPrice = 0;

  const orderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = orderPrice + taxPrice + shippingPrice;

  // create Session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "GBP",
          product_data: {
            name: "Cart Checkout",
            description: "Pay for items in your cart",
          },
          unit_amount: totalOrderPrice * 100, // amount in cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.MY_DOMAIN}/all-orders`,
    cancel_url: `${process.env.MY_DOMAIN}/cart`,
    customer_email: contactEmail,
    client_reference_id: req.params.cartId,
    metadata: {
      ...req.body.shippingAddress,
    },
  });

  res.status(200).json({ status: "success", session });
});

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const contactEmail = session.customer_email;
  const orderPrice = session.amount_total / 100;

  const cart = await CartModel.findById(cartId);
  // create order
  const order = await OrderModel.create({
    guestId: cart.guestId,
    user: cart.user,
    orderItems: cart.cartItems,
    contactEmail,
    shippingAddress,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethod: "card",
  });

  if (order) {
    const bulkOptions = order.orderItems.map((item) => ({
      updateOne: {
        filter: {
          _id: item.product,
          quantity: { $gte: item.quantity },
        },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await ProductModel.bulkWrite(bulkOptions, {});
  }

  // 5) Clear cart
  await CartModel.findByIdAndDelete(cartId);
};

export const webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw body
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    // console.log("Webhook signature verification failed.");
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Check event type
  if (event.type === "checkout.session.completed") {
    await createCardOrder(event.data.object);
  }

  res.status(200).json({ received: true });
});