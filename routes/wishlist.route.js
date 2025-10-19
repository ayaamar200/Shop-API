import { Router } from "express";

import { allowRoles, protect } from "../services/auth.service.js";

import {
  addProductToWishlist,
  getLoggedUserWishlist,
  removeProductFromWishlist,
} from "../services/wishlist.service.js";
import { addProductToWishlistValidator, removeProductFromWishlistValidator } from "../utils/validators/wishlist.validator.js";

const router = Router();

router.use(protect, allowRoles("user"));

router.route("/").post(addProductToWishlistValidator,addProductToWishlist).get(getLoggedUserWishlist);

router.route("/:productId").delete(removeProductFromWishlistValidator, removeProductFromWishlist);

export default router;
