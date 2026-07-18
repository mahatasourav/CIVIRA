import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaArrowUp,
} from "react-icons/fa";
import { useOfficerContext } from "@/context/OfficerContext";

const Dashboard = () => {
  const { officer } = useOfficerContext();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const api = axios.create({
    baseURL: API_BASE_URL,
  });

  const [stats, setStats] = useState([
    {
      title: "Total Complaints",
      value: 0,
      icon: <FaClipboardList />,
      color: "bg-primary",
    },
    {
      title: "Pending",
      value: 0,
      icon: <FaClock />,
      color: "bg-warning",
    },
    {
      title: "Resolved",
      value: 0,
      icon: <FaCheckCircle />,
      color: "bg-success",
    },
    {
      title: "rejected",
      value: 0,
      icon: <FaExclamationTriangle />,
      color: "bg-danger",
    },
  ]);

  const [recentComplaints, setRecentComplaints] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("officerToken");

      const response = await api.get("/api/officer/assigned-complaints", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const complaints = response.data.complaints;

        setStats([
          {
            title: "Total Complaints",
            value: complaints.length,
            icon: <FaClipboardList />,
            color: "bg-primary",
          },
          {
            title: "Pending",
            value: complaints.filter(
              (c) =>
                c.complaint_status === "Pending" ||
                c.complaint_status === "Registered",
            ).length,
            icon: <FaClock />,
            color: "bg-warning",
          },
          {
            title: "Resolved",
            value: complaints.filter((c) => c.complaint_status === "Resolved")
              .length,
            icon: <FaCheckCircle />,
            color: "bg-success",
          },
          {
            title: "Rejected",
            value: complaints.filter((c) => c.complaint_status === "Rejected")
              .length,
            icon: <FaExclamationTriangle />,
            color: "bg-danger",
          },
        ]);

        setRecentComplaints(complaints.slice(0, 5));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="rounded-3xl bg-gradient-to-r from-primary-dark to-primary p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold">Welcome, {officer?.officerId}</h1>

        <p className="mt-3 text-blue-100">
          You are responsible for
          <span className="font-semibold"> Ward {officer?.wardNo}</span> in{" "}
          {officer?.city}, {officer?.state}.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
          >
            <div>
              <p className="text-gray-500">{item.title}</p>

              <h2 className="mt-2 text-3xl font-bold">{item.value}</h2>

              <div className="mt-3 flex items-center gap-1 text-sm text-primary">
                <FaArrowUp />
                <span>Updated Today</span>
              </div>
            </div>

            <div
              className={`${item.color} flex h-16 w-16 items-center justify-center rounded-2xl text-2xl text-white shadow-lg`}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Complaints */}
        <div className="rounded-2xl border bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-xl font-semibold">Recent Complaints</h2>

            <button className="font-medium text-primary transition hover:text-primary-dark">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="p-4">Complaint ID</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {recentComplaints.length > 0 ? (
                  recentComplaints.map((item) => (
                    <tr
                      key={item._id}
                      className="border-t transition hover:bg-primary/5"
                    >
                      <td className="p-4 font-medium">{item._id.slice(-6)}</td>

                      <td className="p-4">{item.category}</td>

                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.complaint_status === "Resolved"
                              ? "bg-green-100 text-green-700"
                              : item.complaint_status === "Pending" ||
                                  item.complaint_status === "Registered"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {item.complaint_status}
                        </span>
                      </td>

                      <td className="p-4">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-gray-500">
                      No complaints assigned.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assigned Area */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Assigned Area</h2>

          <div className="space-y-5">
            <div>
              <p className="text-sm text-gray-500">Officer ID</p>
              <h3 className="text-lg font-semibold">{officer?.officerId}</h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">State</p>
              <h3 className="font-semibold">{officer?.state}</h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">City</p>
              <h3 className="font-semibold">{officer?.city}</h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">Ward</p>
              <h3 className="text-2xl font-semibold text-primary">
                {officer?.wardNo}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
