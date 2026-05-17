import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import {
  createCategoryValidationRules,
  updateCategoryValidationRules,
  validateRequest,
} from "../validators/category.validators.js";
import protectAdmin from "../middlewares/protectAdmin.js";

const router = express.Router();

router.get("/", getAllCategories);

router.get("/:categoryId", getCategoryById);

router.post(
  "/",
  protectAdmin,
  createCategoryValidationRules,
  validateRequest,
  createCategory
);

router.put(
  "/:categoryId",
  protectAdmin,
  updateCategoryValidationRules,
  validateRequest,
  updateCategory
);

router.delete("/:categoryId", protectAdmin, deleteCategory);

export default router;
