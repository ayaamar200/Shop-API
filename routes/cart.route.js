import { Router } from "express";

import {
  addProductToCart,
  applyCoupon,
  clearCart,
  getCart,
  removeSpecificCartItem,
  updateCartItemQuantity,
} from "../services/cart.service.js";
import {
  addProductToCartValidator,
  applyCouponValidator,
  removeSpecificCartItemValidator,
  updateCartItemQuantityValidator,
} from "../utils/validators/cart.validator.js";
import { attachUserIfAuthenticated } from "../services/auth.service.js";

const router = Router();

router
  .route("/")
  .post(attachUserIfAuthenticated, addProductToCartValidator, addProductToCart)
  .get(attachUserIfAuthenticated, getCart)
  .delete(attachUserIfAuthenticated, clearCart);

router
  .route("/applyCoupon")
  .put(attachUserIfAuthenticated, applyCouponValidator, applyCoupon);

router
  .route("/:cartItemId")
  .put(
    attachUserIfAuthenticated,
    updateCartItemQuantityValidator,
    updateCartItemQuantity
  )
  .delete(
    attachUserIfAuthenticated,
    removeSpecificCartItemValidator,
    removeSpecificCartItem
  );

export default router;
