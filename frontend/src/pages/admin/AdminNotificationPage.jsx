import { AdminNavBar } from "../../components/AdminNavBar";

export default function AdminNotificationPage() {
  const notifications = [
    {
      id: 1,
      type: "comment",
      user: "Jacob Lash",
      action: "Commented on your article",
      article: "The Fascinating World of Cats: Why We Love Our Furry Friends",
      comment:
        "I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.",
      time: "4 hours ago",
    },
    {
      id: 2,
      type: "like",
      user: "Jacob Lash",
      action: "liked your article",
      article: "The Fascinating World of Cats: Why We Love Our Furry Friends",
      time: "4 hours ago",
    },
  ];

  return (
    <div className="flex flex-col bg-white">
      <AdminNavBar title="Notification" />

      <div className="pt-10 pr-[60px] pb-[120px] pl-[60px]">
        <div className="flex flex-col">
          {notifications.map((notification, index) => (
            <div key={notification.id}>
              <div className="flex items-start gap-10 py-4 px-2">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-brown-200">
                  <img
                    src="https://via.placeholder.com/40"
                    alt={notification.user}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <p className="font-poppins text-base leading-6 text-brown-600">
                    <span className="font-bold">{notification.user}</span>{" "}
                    {notification.action}:{" "}
                    <span className="font-bold">{notification.article}</span>
                  </p>
                  {notification.comment && (
                    <p className="font-poppins text-base font-medium leading-6 text-brown-600">
                      "{notification.comment}"
                    </p>
                  )}
                  <p className="font-poppins text-sm font-medium leading-[22px] text-orange">
                    {notification.time}
                  </p>
                </div>
                <button className="font-poppins text-base font-medium leading-6 text-brown-600 underline transition-colors hover:text-brown-400">
                  View
                </button>
              </div>
              {index < notifications.length && (
                <div className="mt-5 mb-5 h-px w-full bg-brown-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
