import axios from "axios";
import { tokenUtils } from "../utils/token.js";

// ตั้งค่า base URL จาก environment variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// สร้าง axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth Service
export const authService = {
  // Register
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Login
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });

    // เก็บ token เมื่อ login สำเร็จ
    if (response.data.access_token) {
      tokenUtils.setToken(response.data.access_token);
    }

    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const token = tokenUtils.getToken();

    if (!token) {
      throw new Error("No token found");
    }

    const response = await api.get("/auth/get-user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  // Reset password
  resetPassword: async (oldPassword, newPassword) => {
    const token = tokenUtils.getToken();

    if (!token) {
      throw new Error("No token found");
    }

    const response = await api.put(
      "/auth/reset-password",
      { oldPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  // Logout
  logout: () => {
    tokenUtils.removeToken();
    // Dispatch custom event เพื่อ notify components อื่นๆ
    window.dispatchEvent(new CustomEvent('auth:logout'));
  },
};

export default authService;
