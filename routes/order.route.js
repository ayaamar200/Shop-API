import { Router } from "express";
import {
  checkoutSession,
  createCashOrder,
  filterOrders,
  getAllOrders,
  getOrder,
  updateOrderToDelivered,
  updateOrderToPaid,
} from "../services/order.service.js";

import {
  allowRoles,
  protect,
  attachUserIfAuthenticated,
} from "../services/auth.service.js";

const router = Router();

router.post(
  "/checkout-session/:cartId",
  attachUserIfAuthenticated,
  checkoutSession
);

router.route("/").get(attachUserIfAuthenticated, filterOrders, getAllOrders);
router
  .route("/admin")
  .get(protect, allowRoles("admin"), filterOrders, getAllOrders);


router.route("/:id/pay").put(protect, allowRoles("admin"), updateOrderToPaid);
router
  .route("/:id/delivered")
  .put(protect, allowRoles("admin"), updateOrderToDelivered);

router.route("/:id").get(attachUserIfAuthenticated, getOrder);

router
  .route("/:cartId")
  .post(attachUserIfAuthenticated, createCashOrder);
export default router;
