import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { notificationService } from "../services/notification.service.js";
import { formatTimeAgo } from "../lib/utils.js";

export function NotificationDropdown({ children, isMobile = false }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [alignOffset, setAlignOffset] = useState(0);
  const triggerRef = useRef(null);

  // Calculate alignOffset for mobile to center the dropdown
  useEffect(() => {
    if (isMobile && isOpen) {
      const calculateOffset = () => {
        const viewportWidth = window.innerWidth;
        const dropdownWidth = viewportWidth - 24; // calc(100vw - 24px)

        // Find the actual trigger button element
        const triggerButton = triggerRef.current?.querySelector(
          'button[aria-label="Notifications"]'
        );

        if (triggerButton) {
          const triggerRect = triggerButton.getBoundingClientRect();
          const triggerRightEdge = triggerRect.right;

          // When align="end", dropdown's right edge aligns with trigger's right edge
          // Dropdown center = trigger right edge - (dropdownWidth / 2)
          // We want dropdown center = viewportWidth / 2
          // So: trigger right edge - (dropdownWidth / 2) + alignOffset = viewportWidth / 2
          // alignOffset = viewportWidth / 2 - trigger right edge + (dropdownWidth / 2)
          const offset =
            viewportWidth / 2 - triggerRightEdge + dropdownWidth / 2;
          setAlignOffset(offset);
        } else {
          // Fallback: estimate trigger position
          // Trigger is in a flex container with justify-between, so it's on the right
          // Assuming approximately 12px from viewport right edge
          const triggerRightEdge = viewportWidth - 12;
          const offset =
            viewportWidth / 2 - triggerRightEdge + dropdownWidth / 2;
          setAlignOffset(offset);
        }
      };

      // Use requestAnimationFrame to ensure DOM is ready
      const rafId = requestAnimationFrame(() => {
        calculateOffset();
      });
      window.addEventListener("resize", calculateOffset);
      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", calculateOffset);
      };
    } else {
      setAlignOffset(0);
    }
  }, [isMobile, isOpen]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await notificationService.getNotifications(1, 5); // Fetch first 5 notifications
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewClick = async (notification) => {
    // Mark as read
    try {
      await notificationService.markAsRead(notification.id);
      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }

    // Close dropdown and navigate
    setIsOpen(false);
    navigate(`/post/${notification.post.id}`);
  };

  const handleViewAllClick = () => {
    setIsOpen(false);
    // Only navigate to admin notification page if user is admin
    // This will be handled by the parent component
    navigate("/admin/notification");
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <div ref={triggerRef}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      </div>
      <DropdownMenuContent
        align="end"
        alignOffset={isMobile ? alignOffset : undefined}
        className={`${
          isMobile
            ? "w-[calc(100vw-24px)] rounded-2xl border border-brown-300 bg-brown-100 shadow-[2px_2px_16px_rgba(0,0,0,0.1)] p-4"
            : "w-[400px] rounded-2xl border border-brown-300 bg-white shadow-lg p-4"
        }`}
      >
        <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="font-poppins text-sm text-brown-400">Loading...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="font-poppins text-sm text-brown-400">
                No notifications
              </p>
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-brown-100 transition-colors cursor-pointer"
                  onClick={() => handleViewClick(notification)}
                >
                  {/* User Avatar */}
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-brown-200 flex-shrink-0">
                    {notification.actor?.profilePic ? (
                      <img
                        src={notification.actor.profilePic}
                        alt={notification.actor.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-brown-200">
                        <span className="font-poppins text-xs font-medium text-brown-600">
                          {(notification.actor?.name || "U")[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <p className="font-poppins text-sm leading-5">
                      <span className="font-bold text-brown-600">
                        {notification.actor?.name || "Anonymous"}
                      </span>{" "}
                      <span className="font-medium text-brown-400">
                        {notification.type === "comment"
                          ? "Commented on your article"
                          : "liked your article"}
                      </span>
                      :{" "}
                      <span className="font-medium line-clamp-1 text-brown-400">
                        {notification.post?.title || "Unknown article"}
                      </span>
                    </p>
                    {notification.comment && (
                      <p className="font-poppins text-xs font-medium leading-5 text-brown-600 line-clamp-2">
                        "{notification.comment}"
                      </p>
                    )}
                    <p className="font-poppins text-xs font-medium leading-5 text-orange">
                      {formatTimeAgo(notification.created_at)}
                    </p>
                  </div>
                </div>
              ))}
              {/* View All Button */}
              <button
                onClick={handleViewAllClick}
                className="mt-2 pt-2 border-t border-brown-300 text-center font-poppins text-sm font-medium text-brown-600 hover:text-brown-400 transition-colors"
              >
                View all notifications
              </button>
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
