import * as notificationService from "../services/notification.service.js";

/**
 * Get Notifications
 * Endpoint: GET /notifications
 * Query params: page, limit
 * Success: 200 + { notifications, total, totalPages, currentPage, limit, nextPage }
 * 401: ถ้าไม่มี token
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: User authentication required",
      });
    }

    const { page = 1, limit = 10 } = req.query;

    const result = await notificationService.getNotifications(
      userId,
      page,
      limit
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching notifications:", error);

    return res.status(500).json({
      message:
        "Server could not fetch notifications because database connection",
    });
  }
};

/**
 * Get Unread Count
 * Endpoint: GET /notifications/unread-count
 * Success: 200 + { count }
 * 401: ถ้าไม่มี token
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: User authentication required",
      });
    }

    const count = await notificationService.getUnreadCount(userId);

    return res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching unread count:", error);

    return res.status(500).json({
      message:
        "Server could not fetch unread count because database connection",
    });
  }
};

/**
 * Mark Notification as Read
 * Endpoint: PATCH /notifications/:id/read
 * Success: 200 + { message: "Notification marked as read" }
 * 401: ถ้าไม่มี token
 * 404: ถ้าไม่เจอ notification หรือไม่ใช่เจ้าของ
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: User authentication required",
      });
    }

    const success = await notificationService.markAsRead(id, userId);

    if (!success) {
      return res.status(404).json({
        message: "Notification not found or you don't have permission",
      });
    }

    return res.status(200).json({
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);

    return res.status(500).json({
      message:
        "Server could not mark notification as read because database connection",
    });
  }
};
