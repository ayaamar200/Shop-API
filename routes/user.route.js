import { Router } from "express";

import {
  getAllUsers,
  getSpecificUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  imageProcessing,
} from "../services/user.service.js";
import { createUserValidator, deleteUserValidator, getSpecificUserValidator, updateUserValidator } from "../utils/validators/user.validator.js";
const router = Router();

router
  .route("/")
  .get(getAllUsers)
  .post(uploadUserImage, imageProcessing, createUserValidator, createUser);
router
  .route("/:id")
  .get(getSpecificUserValidator, getSpecificUser)
  .put(uploadUserImage, imageProcessing, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

export default router;
