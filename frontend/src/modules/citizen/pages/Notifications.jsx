import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAppContext } from "@/context/AppContext";

export default function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { unreadCount, setUnreadCount } = useAppContext();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("CIVIRA_token");

      console.log("API_BASE_URL:", API_BASE_URL);

      console.log("Fetching notifications with token:", token);

      const response = await axios.get(`${API_BASE_URL}/api/notification`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Notifications response:", response.data);
      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("CIVIRA_token");

      console.log(
        `Marking notification ${notificationId} as read with token:`,
        token,
      );

      await axios.patch(
        `${API_BASE_URL}/api/notification/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("notfication maked as read successfully");

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notificationId ? { ...item, isRead: true } : item,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getNotificationIcon = (title) => {
    switch (title) {
      case "Complaint Accepted":
        return <Clock size={20} />;

      case "Complaint Resolved":
        return <CheckCircle2 size={20} />;

      case "Complaint Rejected":
        return <AlertTriangle size={20} />;

      default:
        return <Bell size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}

        <div className="flex items-center gap-3">
          <Bell className="text-blue-600" size={30} />
          <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>
        </div>

        {/* Loading */}

        {loading && (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            Loading notifications...
          </div>
        )}

        {/* Empty */}

        {!loading && notifications.length === 0 && (
          <div className="rounded-xl bg-white p-12 text-center shadow">
            <Bell className="mx-auto mb-4 text-slate-400" size={50} />

            <h2 className="text-xl font-semibold">No Notifications</h2>

            <p className="mt-2 text-slate-500">You're all caught up.</p>
          </div>
        )}

        {/* Notifications */}

        {!loading && notifications.length > 0 && (
          <div className="overflow-hidden rounded-2xl border bg-white shadow">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={async () => {
                  if (!notification.isRead) {
                    await markAsRead(notification._id);
                  }

                  navigate(`/complaints/${notification.complaintId._id}`);
                  setUnreadCount((prev) => Math.max(prev - 1, 0));
                }}
                className={`flex cursor-pointer gap-4 border-b p-5 transition hover:bg-slate-50 ${
                  notification.isRead ? "bg-white" : "bg-blue-50"
                }`}
              >
                {/* Icon */}

                <div className="mt-1 text-blue-600">
                  {getNotificationIcon(notification.title)}
                </div>

                {/* Content */}

                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800">
                    {notification.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    {notification.message}
                  </p>

                  <p className="mt-3 text-xs text-slate-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Unread Dot */}

                {!notification.isRead && (
                  <div className="mt-2 h-3 w-3 rounded-full bg-blue-600" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
