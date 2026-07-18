import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Complaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Axios instance
  const api = axios.create({
    baseURL: API_BASE_URL,
  });

  // Attach token automatically
  api.interceptors.request.use((config) => {
    const officerToken = localStorage.getItem("officerToken");

    if (officerToken) {
      config.headers.Authorization = `Bearer ${officerToken}`;
    }

    return config;
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/officer/assigned-complaints");
      console.log("hiii", response.data);

      if (response.data.success) {
        setComplaints(response.data.complaints);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchSearch =
      complaint.description?.toLowerCase().includes(search.toLowerCase()) ||
      complaint.category?.toLowerCase().includes(search.toLowerCase()) ||
      complaint._id.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "All" || complaint.complaint_status === statusFilter;

    return matchSearch && matchStatus;
  });

  const statusBadge = (status) => {
    switch (status) {
      case "Registered":
      case "Pending":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
            <FaClock />
            {status}
          </span>
        );

      case "In Progress":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            <FaSpinner className="animate-spin" />
            In Progress
          </span>
        );

      case "Resolved":
      case "Success":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            <FaCheckCircle />
            Resolved
          </span>
        );

      case "Rejected":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
            Rejected
          </span>
        );

      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40 text-lg font-semibold">
        Loading complaints...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Assigned Complaints
          </h1>

          <p className="mt-1 text-gray-500">
            View and manage complaints assigned to your ward.
          </p>
        </div>

        <div className="flex gap-3">
          {/* Search */}

          <div className="relative">
            <FaSearch className="absolute left-4 top-4 text-primary" />

            <input
              type="text"
              placeholder="Search..."
              className="w-72 rounded-xl border bg-white py-3 pl-11 pr-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter */}

          <select
            className="rounded-xl border border-slate-300 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-primary"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Registered</option>
            <option>Pending</option>
            <option>Resolved</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-primary-dark to-primary text-white">
            <tr>
              <th className="px-6 py-4 text-left">Complaint ID</th>

              <th className="px-6 py-4 text-left">Description</th>

              <th className="px-6 py-4 text-left">Category</th>

              <th className="px-6 py-4 text-center">Ward</th>

              <th className="px-6 py-4 text-center">Status</th>

              <th className="px-6 py-4 text-center">Date</th>

              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((complaint) => (
                <tr
                  key={complaint._id}
                  className="border-b transition hover:bg-primary/5"
                >
                  <td className="px-6 py-4 font-medium">{complaint._id}</td>

                  <td className="px-6 py-4">{complaint.description}</td>

                  <td className="px-6 py-4">{complaint.category}</td>

                  <td className="px-6 py-4 text-center">{complaint.wardNo}</td>

                  <td className="px-6 py-4 text-center">
                    {statusBadge(complaint.complaint_status)}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() =>
                        navigate(`/officer/complaint/${complaint._id}`)
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-dark to-primary px-4 py-2 text-white shadow transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <FaEye />
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-12 text-center text-gray-500">
                  No complaints assigned.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Complaint;
