import express from "express";
import { createPost, getAllPosts } from "../controllers/post.controller.js";
import {
  createPostValidationRules,
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

export default router;
