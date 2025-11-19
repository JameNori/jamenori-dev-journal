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
router.post("/posts", createPostValidationRules, validateRequest, createPost);

// Get all (pagination + filter + search)
router.get("/posts", getAllPosts);

// Get one post
router.get("/posts/:postId", getPostById);

// Update post
router.put(
  "/posts/:postId",
  updatePostValidationRules,
  validateRequest,
  updatePost
);

// Delete post
router.delete("/posts/:postId", deletePost);

export default router;
