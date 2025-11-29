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
import { ensureGuestId } from "../middlewares/assignGuestId.middleware.js";
import { allowRoles, protect } from "../services/auth.service.js";

const router = Router();

router.use(ensureGuestId);
router
  .route("/")
  .post(addProductToCartValidator, addProductToCart)
  .get(getCart)
  .delete(clearCart);

router
  .route("/applyCoupon")
  .put(protect, allowRoles("user"), applyCouponValidator, applyCoupon);

router
  .route("/:cartItemId")
  .put(updateCartItemQuantityValidator, updateCartItemQuantity)
  .delete(removeSpecificCartItemValidator, removeSpecificCartItem);

export default router;
