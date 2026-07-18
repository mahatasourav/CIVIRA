import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaTag,
  FaImages,
} from "react-icons/fa";
import { useOfficerContext } from "@/context/OfficerContext";
import { toast } from "react-toastify";

const ComplaintDetailsOfficer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");

  const [resolutionImages, setResolutionImages] = useState([]);

  const api = axios.create({
    baseURL: API_BASE_URL,
  });

  useEffect(() => {
    fetchComplaint();
  }, []);

  const fetchComplaint = async () => {
    try {
      const token = localStorage.getItem("officerToken");

      const response = await api.get(`/api/officer/complaint/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setComplaint(response.data.complaint);
        console.log("Complaint Details:", response.data.complaint);
        setStatus(response.data.complaint.complaint_status);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptComplaint = async () => {
    try {
      const token = localStorage.getItem("officerToken");

      const response = await api.put(
        `/api/officer/complaint/${id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);

        setComplaint((prev) => ({
          ...prev,
          complaint_status: "In Progress",
        }));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to accept complaint",
      );
    }
  };

  const handleRejectComplaint = async () => {
    try {
      const token = localStorage.getItem("officerToken");

      const response = await api.put(
        `/api/officer/complaint/${id}/reject`,
        {
          remarks,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);

        setComplaint((prev) => ({
          ...prev,
          complaint_status: "Rejected",
        }));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reject complaint",
      );
    }
  };

  const handleResolveComplaint = async () => {
    try {
      const token = localStorage.getItem("officerToken");

      const formData = new FormData();

      formData.append("remarks", remarks);

      resolutionImages.forEach((image) => {
        formData.append("images", image);
      });

      const response = await api.put(
        `/api/officer/complaint/${id}/resolve`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);

        setComplaint((prev) => ({
          ...prev,
          complaint_status: "Resolved",
        }));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to resolve complaint",
      );
    }
  };

  const updateStatus = async () => {
    try {
      const token = localStorage.getItem("officerToken");

      const response = await api.put(
        `/api/officer/complaint/${id}`,
        {
          complaint_status: status,
          remarks,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        alert("Complaint Updated Successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-40 text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary font-semibold"
      >
        <FaArrowLeft />
        Back
      </button>

      <div className="rounded-3xl bg-gradient-to-r from-primary-dark to-primary p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold">Complaint Details</h1>

        <p className="mt-2">Complaint ID : {complaint._id}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow border p-6">
            <h2 className="text-xl font-semibold mb-5">
              Complaint Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <p className="text-gray-500">Category</p>
                <h3 className="font-semibold">{complaint.category}</h3>
              </div>

              <div>
                <p className="text-gray-500">Status</p>

                <h3 className="font-semibold">{complaint.complaint_status}</h3>
              </div>

              <div>
                <p className="text-gray-500">Description</p>

                <p>{complaint.description}</p>
              </div>

              <div>
                <p className="text-gray-500">Created</p>

                <div className="flex items-center gap-2">
                  <FaCalendarAlt />

                  {new Date(complaint.createdAt).toLocaleString()}
                </div>
              </div>

              <div>
                <p className="text-gray-500">Location</p>

                <div className="flex gap-2 items-center">
                  <FaMapMarkerAlt />
                  {complaint.address},{complaint.city},{complaint.state}
                </div>
              </div>

              <div>
                <p className="text-gray-500">Ward</p>

                <h3>{complaint.wardNo}</h3>
              </div>
            </div>
          </div>

          {/* Citizen Evidence */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">
              Citizen Evidence (Before)
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {complaint.evidenceIds
                ?.filter((img) => img.type === "citizen")
                .map((img) => (
                  <img
                    key={img._id}
                    src={img.image_url}
                    alt="Citizen Evidence"
                    className="rounded-xl h-48 w-full object-cover border"
                  />
                ))}
            </div>
          </div>

          {/* Officer Resolution Evidence */}
          {complaint.complaint_status === "Resolved" && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">
                Resolution Evidence (After)
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {complaint.evidenceIds
                  ?.filter((img) => img.type === "officer")
                  .map((img) => (
                    <img
                      key={img._id}
                      src={img.image_url}
                      alt="Officer Evidence"
                      className="rounded-xl h-48 w-full object-cover border"
                    />
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow border p-6">
            <h2 className="text-xl font-semibold mb-5">Citizen Details</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaUser />

                {complaint.userId?.name}
              </div>

              <div className="flex items-center gap-3">
                <FaEnvelope />

                {complaint.userId?.email}
              </div>

              <div className="flex items-center gap-3">
                <FaPhone />

                {complaint.userId?.phone}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow border p-6">
            <h2 className="text-xl font-semibold mb-6">Complaint Action</h2>

            {/* Current Status */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Current Status</p>

              <span className="inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                {complaint.complaint_status}
              </span>
            </div>

            {/* Registered */}
            {complaint.complaint_status === "Registered" && (
              <div className="space-y-3">
                <button
                  onClick={handleAcceptComplaint}
                  className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Accept Complaint
                </button>

                <button
                  onClick={handleRejectComplaint}
                  className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
                >
                  Reject Complaint
                </button>
              </div>
            )}

            {/* In Progress */}
            {complaint.complaint_status === "In Progress" && (
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block font-medium">
                    Upload Resolution Photos
                  </label>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setResolutionImages([...e.target.files])}
                    className="w-full rounded-lg border p-3"
                  />

                  {resolutionImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {resolutionImages.map((file, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="h-24 w-full rounded-lg border object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-medium">
                    Resolution Remarks
                  </label>

                  <textarea
                    rows="4"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Write what work has been completed..."
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                <button
                  onClick={handleResolveComplaint}
                  className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  Mark as Resolved
                </button>
              </div>
            )}
            {/* Resolved */}
            {complaint.complaint_status === "Resolved" && (
              <div className="rounded-xl bg-green-50 p-5 text-center">
                <h3 className="text-lg font-semibold text-green-700">
                  Complaint Resolved
                </h3>

                <p className="mt-2 text-sm text-green-600">
                  Resolution proof has already been uploaded.
                </p>
              </div>
            )}

            {/* Rejected */}
            {complaint.complaint_status === "Rejected" && (
              <div className="rounded-xl bg-red-50 p-5 text-center">
                <h3 className="text-lg font-semibold text-red-700">
                  Complaint Rejected
                </h3>

                <p className="mt-2 text-sm text-red-600">
                  This complaint has been rejected.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsOfficer;
