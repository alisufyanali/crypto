import { useEffect, useState } from "react";
import axios from "axios";
import { Bell, Check, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: number;
  title: string | null;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export default function LiveNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      // ✅ Using web routes (no /api prefix)
      const res = await axios.get("/notifications/live");
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unread_count || 0);
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log("User not authenticated, redirecting to login...");
        window.location.href = '/login';
      } else if (error.response?.status === 419) {
        // CSRF token mismatch - reload page
        console.log("Session expired, reloading...");
        window.location.reload();
      } else {
        console.error("Error fetching notifications:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await axios.post(`/notifications/${id}/mark-as-read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post("/notifications/mark-all-read");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await axios.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      const wasUnread = notifications.find((n) => n.id === id)?.is_read === false;
      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="relative focus:outline-none">
        <Bell className="w-6 h-6 text-gray-600 hover:text-gray-800 transition" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 min-w-[20px] h-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-96 max-h-[500px] overflow-y-auto">
        <div className="flex items-center justify-between p-3 border-b sticky top-0 bg-white z-10">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-sm">Loading...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y">
            {notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className={`flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50 ${
                  !n.is_read ? "bg-blue-50 hover:bg-blue-100" : ""
                }`}
                onSelect={(e) => e.preventDefault()}
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <div 
                    className="flex-1 min-w-0"
                    onClick={() => !n.is_read && markAsRead(n.id)}
                  >
                    {n.title && (
                      <p className="font-semibold text-sm text-gray-900 truncate">
                        {n.title}
                      </p>
                    )}
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTimeAgo(n.created_at)}
                    </p>
                  </div>

                  <div className="flex gap-1 flex-shrink-0">
                    {!n.is_read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(n.id);
                        }}
                        className="p-1.5 hover:bg-gray-200 rounded transition"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(n.id);
                      }}
                      className="p-1.5 hover:bg-gray-200 rounded transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <DropdownMenuItem className="text-center text-gray-500 py-8">
            <div className="flex flex-col items-center">
              <Bell className="w-12 h-12 text-gray-300 mb-2" />
              <p className="text-sm">No notifications</p>
            </div>
          </DropdownMenuItem>
        )}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-center text-sm text-blue-600 hover:text-blue-800 cursor-pointer py-3 font-medium"
              onSelect={() => (window.location.href = "/notifications")}
            >
              View all notifications →
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}