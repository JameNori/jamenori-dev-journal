import { Router } from "express";
import * as notificationController from "../controllers/notification.controller.js";
import protectUser from "../middlewares/protectUser.js";

const notificationRouter = Router();

// All notification routes require authentication
notificationRouter.use(protectUser);

notificationRouter.get("/", notificationController.getNotifications);

notificationRouter.get("/unread-count", notificationController.getUnreadCount);

notificationRouter.patch("/:id/read", notificationController.markAsRead);

export default notificationRouter;
