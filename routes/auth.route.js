import { Router } from "express";

import { forgotPassword, login, resetPassword, signup, verifyResetCode } from "../services/auth.service.js";
import {
  loginValidator,
  signupValidator,
} from "../utils/validators/auth.validator.js";
const router = Router();

router.route("/signup").post(signupValidator, signup);
router.route("/login").post(loginValidator, login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/verifyResetCode").post(verifyResetCode);
router.route("/resetPassword").put(resetPassword);




export default router;
