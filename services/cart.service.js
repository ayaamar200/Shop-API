import asyncHandler from "express-async-handler";
import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";
import CouponModel from "../models/coupon.model.js";
import ApiError from "../utils/api-error.js";

const calcTotalCartPrice = (cart) => {
  cart.totalPriceAfterDiscount = undefined;
  cart.totalCartPrice = cart.cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  return cart.totalCartPrice;
};

const buildCartFilter = (req) => {
  if (req.user) {
    return { user: req.user._id };
  }

  return { guestId: req.guestId };
};

export const addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;

  const productModel = await ProductModel.findById(productId);

  // product sold out??
  if (!productModel || productModel.quantity <= 0) {
    return next(new ApiError("Product is sold out", 404));
  }

  const filter = buildCartFilter(req);

  let cart = await CartModel.findOne(filter);
  if (!cart) {
    // create cart for guest or logged-in user
    cart = await CartModel.create({
      ...filter,
      cartItems: [{ product: productId, color, price: productModel.price }],
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === productId.toString() && item.color === color
    );

    if (productIndex !== -1) {
      cart.cartItems[productIndex].quantity += 1;
    } else {
      cart.cartItems.push({
        product: productId,
        color,
        price: productModel.price,
      });
    }
  }

  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product added to cart successfully.",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

export const getCart = asyncHandler(async (req, res, next) => {
  const filter = buildCartFilter(req);

  const cart = await CartModel.findOne(filter).populate("cartItems.product");
  if (!cart)
    return res.status(200).json({ status: "success", data: { cartItems: [] } });

  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

export const removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const filter = buildCartFilter(req);
  const cart = await CartModel.findOneAndUpdate(
    filter,
    {
      $pull: {
        cartItems: {
          _id: req.params.cartItemId,
        },
      },
    },
    { new: true }
  );

  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

export const clearCart = asyncHandler(async (req, res, next) => {
  const filter = buildCartFilter(req);

  await CartModel.findOneAndDelete(filter);
  res.status(200).json({
    status: "success",
  });
});

export const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const filter = buildCartFilter(req);

  const cart = await CartModel.findOne(filter).populate("cartItems.product");
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.cartItemId
  );
  if (itemIndex !== -1) cart.cartItems[itemIndex].quantity = quantity;
  else return next(new ApiError("Cart item not found", 404));

  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

export const applyCoupon = asyncHandler(async (req, res, next) => {
  const filter = buildCartFilter(req);

  const coupon = await CouponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError("Invalid or expired Coupon", 404));
  }
  const cart = await CartModel.findOne(filter);
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  cart.totalPriceAfterDiscount = Number(
    cart.totalCartPrice - (cart.totalCartPrice * coupon.discount) / 100
  ).toFixed(2);

  await cart.save();
  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
