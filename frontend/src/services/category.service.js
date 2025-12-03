import axios from "axios";
import { tokenUtils } from "../utils/token.js";

// ตั้งค่า base URL จาก environment variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Category Service
export const categoryService = {
  // Get all categories (with optional keyword search)
  getAllCategories: async (keyword = "") => {
    const queryParams = new URLSearchParams();
    if (keyword) {
      queryParams.append("keyword", keyword);
    }

    const response = await axios.get(
      `${API_URL}/categories?${queryParams.toString()}`
    );

    return response.data;
  },

  // Get category by ID
  getCategoryById: async (categoryId) => {
    const response = await axios.get(`${API_URL}/categories/${categoryId}`);
    return response.data;
  },

  // Create category
  createCategory: async (data) => {
    const token = tokenUtils.getToken();

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.post(`${API_URL}/categories`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  // Update category
  updateCategory: async (categoryId, data) => {
    const token = tokenUtils.getToken();

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.put(
      `${API_URL}/categories/${categoryId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  // Delete category
  deleteCategory: async (categoryId) => {
    const token = tokenUtils.getToken();

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.delete(`${API_URL}/categories/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};

export default categoryService;
