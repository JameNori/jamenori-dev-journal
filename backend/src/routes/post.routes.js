import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";
import {
  createPostValidationRules,
  updatePostValidationRules,
  validateRequest,
} from "../validators/post.validators.js";

const router = express.Router();

// Create
router.post("/", createPostValidationRules, validateRequest, createPost);

// Get all (pagination + filter + search)
router.get("/", getAllPosts);

// Get one post
router.get("/:postId", getPostById);

// Update post
router.put(
  "/:postId",
  updatePostValidationRules,
  validateRequest,
  updatePost
);

// Delete post
router.delete("/:postId", deletePost);

export default router;
