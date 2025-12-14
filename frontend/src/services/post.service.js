import axios from "axios";
import { tokenUtils } from "../utils/token.js";

// ตั้งค่า base URL จาก environment variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Post Service
export const postService = {
  // Create post
  createPost: async (formData) => {
    const token = tokenUtils.getToken();

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.post(`${API_URL}/posts`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  // Update post
  updatePost: async (postId, formData) => {
    const token = tokenUtils.getToken();

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.put(`${API_URL}/posts/${postId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  // Get all posts
  getAllPosts: async (params = {}) => {
    const { page, limit, category, keyword } = params;
    const queryParams = new URLSearchParams();

    if (page) queryParams.append("page", page);
    if (limit) queryParams.append("limit", limit);
    if (category) queryParams.append("category", category);
    if (keyword) queryParams.append("keyword", keyword);

    const response = await axios.get(
      `${API_URL}/posts?${queryParams.toString()}`
    );

    return response.data;
  },

  // Get post by ID
  getPostById: async (postId) => {
    const response = await axios.get(`${API_URL}/posts/${postId}`);
    return response.data;
  },

  // Delete post
  deletePost: async (postId) => {
    const token = tokenUtils.getToken();

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.delete(`${API_URL}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  // Like/Unlike post
  toggleLike: async (postId) => {
    const token = tokenUtils.getToken();

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.post(
      `${API_URL}/posts/${postId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  // Check if user has liked the post
  checkUserLike: async (postId) => {
    const token = tokenUtils.getToken();

    if (!token) {
      return { hasLiked: false };
    }

    try {
      const response = await axios.get(
        `${API_URL}/posts/${postId}/like/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      // ถ้า error (เช่น 401) ให้ return false
      return { hasLiked: false };
    }
  },

  // Get comments for a post
  getComments: async (postId) => {
    const response = await axios.get(`${API_URL}/posts/${postId}/comments`);
    return response.data;
  },

  // Create comment
  createComment: async (postId, content) => {
    const token = tokenUtils.getToken();

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.post(
      `${API_URL}/posts/${postId}/comments`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};

export default postService;
