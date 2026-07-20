import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { FaBell, FaTrash, FaCheckCircle, FaUserPlus } from "react-icons/fa";
import { useAdminContext } from "@/context/AdminContext";

const AdminNotifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken");
  const Backend_URL = import.meta.env.VITE_API_BASE_URL;
  const { fetchUnreadCount } = useAdminContext();
  const fetchNotifications = async () => {
    console.log("Fetching notifications with token:", token);
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${Backend_URL}/api/admin/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Notifications response:", data);

      if (data.success) {
        setNotifications(data.notifications);
      }
      fetchUnreadCount();
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to fetch notifications.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      const { data } = await axios.patch(
        `${Backend_URL}/api/admin/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);

        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === id
              ? {
                  ...notification,
                  isRead: true,
                }
              : notification,
          ),
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to mark notification.",
      );
    }
  };

  // const handleDelete = async (id) => {
  //   try {
  //     const { data } = await axios.delete(
  //       `${Backend_URL}/api/admin/notifications/${id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     if (data.success) {
  //       toast.success(data.message);

  //       setNotifications((prev) => prev.filter((item) => item._id !== id));
  //     }
  //   } catch (error) {
  //     toast.error(
  //       error.response?.data?.message || "Failed to delete notification.",
  //     );
  //   }
  // };

  const handleCreateOfficer = (notification) => {
    console.log(
      "Navigating to create officer with complaint:",
      notification.complaintId,
    );
    const complaint = notification.complaintId;

    navigate(
      `/admin/create-officer?state=${encodeURIComponent(
        complaint.state,
      )}&city=${encodeURIComponent(complaint.city)}&ward=${encodeURIComponent(
        complaint.wardNo,
      )}&fromNotification=true`,
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>

          <p className="text-slate-500 mt-1">Loading notifications...</p>
        </div>

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div className="mb-4 h-6 w-52 rounded bg-slate-200"></div>

            <div className="mb-2 h-4 w-full rounded bg-slate-200"></div>

            <div className="mb-2 h-4 w-3/4 rounded bg-slate-200"></div>

            <div className="mt-6 flex gap-3">
              <div className="h-10 w-36 rounded-lg bg-slate-200"></div>

              <div className="h-10 w-32 rounded-lg bg-slate-200"></div>

              <div className="h-10 w-24 rounded-lg bg-slate-200"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-800">
            <FaBell className="text-blue-600" />
            Notifications
          </h1>

          <p className="mt-2 text-slate-500">
            Review all important administrator alerts.
          </p>
        </div>

        <div className="rounded-xl bg-blue-600 px-5 py-3 text-white shadow">
          <p className="text-sm">Total Notifications</p>

          <p className="text-2xl font-bold">{notifications.length}</p>
        </div>
      </div>

      {/* Empty State */}

      {notifications.length === 0 ? (
        <div className="rounded-2xl border bg-white py-20 text-center shadow-sm">
          <FaBell className="mx-auto mb-6 text-6xl text-slate-300" />

          <h2 className="text-2xl font-bold text-slate-700">
            No Notifications
          </h2>

          <p className="mt-3 text-slate-500">Everything looks good.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`rounded-2xl border bg-white p-6 shadow transition hover:shadow-lg ${
                !notification.isRead ? "border-blue-500" : "border-slate-200"
              }`}
            >
              {/* Top */}

              <div className="flex items-start justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                    <FaBell className="text-blue-600" />

                    {notification.title}
                  </h2>

                  <p className="mt-2 text-slate-600">{notification.message}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-slate-500">
                    {formatDate(notification.createdAt)}
                  </p>

                  {!notification.isRead && (
                    <span className="mt-2 inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                      Unread
                    </span>
                  )}
                </div>
              </div>

              {/* Complaint Details */}

              {notification.complaintId && (
                <div className="mt-6 rounded-xl bg-slate-50 p-5">
                  <h3 className="mb-3 font-semibold text-slate-700">
                    Complaint Details
                  </h3>

                  <div className="grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase text-slate-400">State</p>

                      <p className="font-medium">
                        {notification.complaintId.state}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase text-slate-400">City</p>

                      <p className="font-medium">
                        {notification.complaintId.city}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase text-slate-400">
                        Ward Number
                      </p>

                      <p className="font-medium">
                        {notification.complaintId.wardNo}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}

              <div className="mt-6 flex flex-wrap gap-3">
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkRead(notification._id)}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700"
                  >
                    <FaCheckCircle />
                    Mark as Read
                  </button>
                )}

                {notification.complaintId && (
                  <button
                    onClick={() => handleCreateOfficer(notification)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
                  >
                    <FaUserPlus />
                    Create Officer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
