"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  category: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationBell({
  schoolId,
  teacherId,
}: {
  schoolId: string;
  teacherId?: string;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get("/notifications", {
        params: { school_id: schoolId, teacher_id: teacherId || undefined, limit: 10 },
      });
      setNotifications(res.data || []);
      setUnreadCount((res.data || []).filter((n: Notification) => !n.is_read).length);
    } catch (err) {
      // silent
    }
  }, [schoolId, teacherId]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // every 30s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const categoryColor = (cat: string) => {
    switch (cat) {
      case "risk": return "bg-red-100 text-red-800";
      case "fee": return "bg-yellow-100 text-yellow-800";
      case "result": return "bg-blue-100 text-blue-800";
      case "attendance": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-0 -right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-xs text-gray-500"
            >
              Close
            </button>
          </div>
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-gray-400 text-center">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                  !n.is_read ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor(n.category)}`}>
                    {n.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(n.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm font-medium mt-1">{n.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}