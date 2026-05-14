import express from "express";
import {
  handleGetProfile,
  handleUpdateProfile,
  handleGetAdminProfile,
} from "../controllers/profile.controller.js";
import {
  updateProfileValidationRules,
  validateRequest,
} from "../validators/profile.validators.js";
import protectUser from "../middlewares/protectUser.js";
import { imageFileUpload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/admin", handleGetAdminProfile);

router.get("/", protectUser, handleGetProfile);

router.put(
  "/",
  protectUser,
  imageFileUpload,
  updateProfileValidationRules,
  validateRequest,
  handleUpdateProfile,
);

export default router;
