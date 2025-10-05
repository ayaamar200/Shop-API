import { Router } from "express";

import { login, signup } from "../services/auth.service.js";
import { loginValidator, signupValidator } from "../utils/validators/auth.validator.js";
const router = Router();

router.route("/signup").post(signupValidator, signup);

router.route("/login").post(loginValidator, login);


export default router;
