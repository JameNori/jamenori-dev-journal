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

// Get all categories (with search)
router.get("/", getAllCategories);

// Get one category
router.get("/:categoryId", getCategoryById);

// Create category - ต้องมี protectAdmin
router.post(
  "/",
  protectAdmin,
  createCategoryValidationRules,
  validateRequest,
  createCategory
);

// Update category - ต้องมี protectAdmin
router.put(
  "/:categoryId",
  protectAdmin,
  updateCategoryValidationRules,
  validateRequest,
  updateCategory
);

// Delete category - ต้องมี protectAdmin
router.delete("/:categoryId", protectAdmin, deleteCategory);

export default router;
