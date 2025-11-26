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

export const addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;

  const productModel = await ProductModel.findById(productId);
  let cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) {
    // create cart for user
    cart = await CartModel.create({
      user: req.user._id,
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
    message: "Product added to your cart successfully.",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

export const getLoggedUserCarts = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOne({ user: req.user._id }).populate(
    "cartItems.product"
  );
  if (!cart) {
    return next(new ApiError("There is no cart for this user", 404));
  }
  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

export const removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: {
        cartItems: {
          _id: req.params.cartItemId,
        },
      },
    },
    { new: true }
  );

  calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

export const clearUserCart = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOneAndDelete({ user: req.user._id });
  res.status(200).json({
    status: "success",
  });
});

export const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("There is no cart for this user", 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.cartItemId
  );
  if (itemIndex !== -1) {
    cart.cartItems[itemIndex].quantity = quantity;
  } else {
    return next(new ApiError("There is no Car tItem for this user", 404));
  }

  calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

export const applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await CouponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError("Coupon is invalid or has expired", 404));
  }
  const cart = await CartModel.findOne({ user: req.user._id });

  cart.totalPriceAfterDiscount = (
    cart.totalCartPrice -
    (cart.totalCartPrice * coupon.discount) / 100
  ).toFixed(2);

  await cart.save();
  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
