import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminNavBar } from "../../components/AdminNavBar";
import { notificationService } from "../../services/notification.service.js";
import { formatTimeAgo } from "../../lib/utils.js";

export default function AdminNotificationPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Fetch notifications
  const fetchNotifications = async (page = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await notificationService.getNotifications(page, limit);
      setNotifications(response.notifications || []);
      setCurrentPage(response.currentPage || 1);
      setTotalPages(response.totalPages || 1);
      setTotal(response.total || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError(
        error.response?.data?.message ||
          "Failed to fetch notifications. Please try again."
      );
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(currentPage);
  }, []);

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

    // Navigate to post
    navigate(`/post/${notification.post.id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchNotifications(page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col bg-white">
      <AdminNavBar title="Notification" />

      <div className="pt-10 pr-[60px] pb-[120px] pl-[60px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="font-poppins text-base text-brown-500">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <p className="font-poppins text-base text-red-500">{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="font-poppins text-base text-brown-400">
              No notifications yet
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div className="flex items-start gap-10 py-4 px-4">
                    {/* User Avatar - 48x48px */}
                    <div className="h-12 w-12 overflow-hidden rounded-full bg-brown-200 flex-shrink-0">
                      {notification.actor?.profilePic ? (
                        <img
                          src={notification.actor.profilePic}
                          alt={notification.actor.name || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-brown-200">
                          <span className="font-poppins text-sm font-medium text-brown-600">
                            {(notification.actor?.name || "U")[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 flex flex-col gap-0">
                      {/* User name, action, and article title - แยก typography properties */}
                      <div className="flex flex-wrap items-baseline gap-0">
                        {/* User name - font-bold, 16px, line-height 24px */}
                        <span className="font-poppins text-base font-bold leading-6 text-brown-600">
                          {notification.actor?.name || "Anonymous"}
                        </span>
                        <span className="font-poppins text-base font-medium leading-6 text-brown-400 ml-1">
                          {notification.type === "comment"
                            ? "Commented on your article"
                            : "liked your article"}
                          :
                        </span>
                        {/* Article title - font-bold, 16px, line-height 24px */}
                        <span className="font-poppins text-base font-medium leading-6 text-brown-400 ml-1">
                          {notification.post?.title || "Unknown article"}
                        </span>
                      </div>
                      {/* Comment text - if exists - font-medium, 16px, line-height 24px */}
                      {notification.comment && (
                        <p className="font-poppins text-base font-medium leading-6 text-brown-600 mt-0">
                          "{notification.comment}"
                        </p>
                      )}
                      {/* Timestamp - font-medium, 14px, line-height 22px, orange color */}
                      <p className="font-poppins text-sm font-medium leading-[22px] text-orange mt-0">
                        {formatTimeAgo(notification.created_at)}
                      </p>
                    </div>

                    {/* View Button */}
                    <button
                      onClick={() => handleViewClick(notification)}
                      className="font-poppins text-base font-medium leading-6 text-brown-600 underline transition-colors hover:text-brown-400 flex-shrink-0 self-start"
                    >
                      View
                    </button>
                  </div>
                  {/* Divider - ต้องมีทุก notification (ยกเว้นอันสุดท้าย) */}
                  {index < notifications.length - 1 && (
                    <div className="h-px w-full bg-brown-300" />
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 font-poppins text-base font-medium text-brown-600 disabled:text-brown-300 disabled:cursor-not-allowed hover:text-brown-400 transition-colors"
                >
                  Previous
                </button>
                <span className="font-poppins text-base font-medium text-brown-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 font-poppins text-base font-medium text-brown-600 disabled:text-brown-300 disabled:cursor-not-allowed hover:text-brown-400 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
