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

// Notification Service
export const notificationService = {
  /**
   * ดึง notifications ของ user พร้อม pagination
   * @param {number} page - หน้า (default: 1)
   * @param {number} limit - จำนวนต่อหน้า (default: 10)
   * @returns {Promise<Object>} - { notifications, total, totalPages, currentPage, limit, nextPage }
   */
  getNotifications: async (page = 1, limit = 10) => {
    const token = tokenUtils.getToken();

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`${API_URL}/notifications`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  /**
   * ดึงจำนวน unread notifications
   * @returns {Promise<number>} - จำนวน unread notifications
   */
  getUnreadCount: async () => {
    const token = tokenUtils.getToken();

    if (!token) {
      return { count: 0 };
    }

    try {
      const response = await axios.get(
        `${API_URL}/notifications/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      return { count: 0 };
    }
  },

  /**
   * Mark notification เป็น read
   * @param {number} notificationId - ID ของ notification
   * @returns {Promise<Object>} - Response data
   */
  markAsRead: async (notificationId) => {
    const token = tokenUtils.getToken();

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.patch(
      `${API_URL}/notifications/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};

export default notificationService;
