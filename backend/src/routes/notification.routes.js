import { Router } from "express";
import * as notificationController from "../controllers/notification.controller.js";
import protectUser from "../middlewares/protectUser.js";

const notificationRouter = Router();

// All notification routes require authentication
notificationRouter.use(protectUser);

/**
 * GET /notifications
 * Get notifications for the authenticated user
 * Query params: page, limit
 */
notificationRouter.get("/", notificationController.getNotifications);

/**
 * GET /notifications/unread-count
 * Get unread notification count for the authenticated user
 */
notificationRouter.get("/unread-count", notificationController.getUnreadCount);

/**
 * PATCH /notifications/:id/read
 * Mark a notification as read
 */
notificationRouter.patch("/:id/read", notificationController.markAsRead);

export default notificationRouter;
