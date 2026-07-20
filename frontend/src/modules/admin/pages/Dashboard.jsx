import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaUserPlus,
  FaClipboardList,
  FaChartLine,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        setDashboard(data.data);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to fetch dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = [
    {
      title: "Total Officers",
      value: dashboard?.officers?.total || 0,
      icon: <FaUsers size={28} />,
      color: "bg-blue-500",
    },
    {
      title: "Total Complaints",
      value: dashboard?.complaints?.total || 0,
      icon: <FaClipboardList size={28} />,
      color: "bg-green-500",
    },
    {
      title: "Pending Complaints",
      value: dashboard?.complaints?.pending || 0,
      icon: <FaChartLine size={28} />,
      color: "bg-yellow-500",
    },
    {
      title: "Resolved Complaints",
      value: dashboard?.complaints?.resolved || 0,
      icon: <FaClipboardList size={28} />,
      color: "bg-purple-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

        <p className="text-gray-500 mt-2">
          Welcome to the CIVIRA Administration Panel
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between"
          >
            <div>
              <p className="text-gray-500">{item.title}</p>

              <h2 className="text-3xl font-bold mt-2">{item.value}</h2>
            </div>

            <div
              className={`${item.color} w-16 h-16 rounded-full flex items-center justify-center text-white`}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <Link
          to="/admin/create-officer"
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
        >
          <div className="flex items-center gap-4">
            <FaUserPlus className="text-3xl text-green-600" />

            <div>
              <h2 className="font-bold text-xl">Create Officer</h2>

              <p className="text-gray-500">
                Register a new officer for a ward.
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/manage-officers"
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
        >
          <div className="flex items-center gap-4">
            <FaUsers className="text-3xl text-blue-600" />

            <div>
              <h2 className="font-bold text-xl">Manage Officers</h2>

              <p className="text-gray-500">View, edit and manage officers.</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Officer Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-500">Active Officers</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {dashboard?.officers?.active || 0}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-500">Suspended Officers</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">
            {dashboard?.officers?.suspended || 0}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-500">Waiting for Officer</p>
          <h2 className="text-3xl font-bold text-orange-500 mt-2">
            {dashboard?.complaints?.waitingForOfficer || 0}
          </h2>
        </div>
      </div>

      {/* Complaint Summary */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Complaint Overview</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-gray-500">Pending</p>
            <h3 className="text-2xl font-bold text-yellow-500">
              {dashboard?.complaints?.pending || 0}
            </h3>
          </div>

          <div className="text-center">
            <p className="text-gray-500">In Progress</p>
            <h3 className="text-2xl font-bold text-blue-500">
              {dashboard?.complaints?.inProgress || 0}
            </h3>
          </div>

          <div className="text-center">
            <p className="text-gray-500">Resolved</p>
            <h3 className="text-2xl font-bold text-green-600">
              {dashboard?.complaints?.resolved || 0}
            </h3>
          </div>

          <div className="text-center">
            <p className="text-gray-500">Waiting Officer</p>
            <h3 className="text-2xl font-bold text-red-500">
              {dashboard?.complaints?.waitingForOfficer || 0}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
