import { Router } from "express";

import { allowRoles, protect } from "../services/auth.service.js";
import {
  addProductToCart,
  applyCoupon,
  clearUserCart,
  getLoggedUserCarts,
  removeSpecificCartItem,
  updateCartItemQuantity,
} from "../services/cart.service.js";
import {
  addProductToCartValidator,
  applyCouponValidator,
  removeSpecificCartItemValidator,
  updateCartItemQuantityValidator,
} from "../utils/validators/cart.validator.js";

const router = Router();

router.use(protect, allowRoles("user"));

router
  .route("/")
  .post(addProductToCartValidator, addProductToCart)
  .get(getLoggedUserCarts)
  .delete(clearUserCart);

router.route("/applyCoupon").put(applyCouponValidator, applyCoupon);

router
  .route("/:cartItemId")
  .put(updateCartItemQuantityValidator, updateCartItemQuantity)
  .delete(removeSpecificCartItemValidator, removeSpecificCartItem);

export default router;
