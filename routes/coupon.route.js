import { Router } from "express";
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCoupon,
} from "../services/coupon.service.js";
import {
  createCouponValidator,
  getCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
} from "../utils/validators/coupon.validator.js";
import { allowRoles, protect } from "../services/auth.service.js";
const router = Router();

router
  .route("/")
  .get(getAllCoupons)
  .post(protect, allowRoles("admin"), createCouponValidator, createCoupon);
router
  .route("/:id")
  .get(getCouponValidator, getCoupon)
  .put(protect, allowRoles("admin"), updateCouponValidator, updateCoupon)
  .delete(protect, allowRoles("admin"), deleteCouponValidator, deleteCoupon);

export default router;
