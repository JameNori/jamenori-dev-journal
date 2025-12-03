import axios from "axios";
import { tokenUtils } from "../utils/token.js";

// ตั้งค่า base URL จาก environment variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Profile Service
export const profileService = {
  // Get profile
  getProfile: async () => {
    const token = tokenUtils.getToken();

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`${API_URL}/profiles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  // Update profile
  updateProfile: async (formData) => {
    const token = tokenUtils.getToken();

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.put(`${API_URL}/profiles`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  // Get admin profile (public, no token required)
  getAdminProfile: async () => {
    const response = await axios.get(`${API_URL}/profiles/admin`);
    return response.data;
  },
};

export default profileService;
