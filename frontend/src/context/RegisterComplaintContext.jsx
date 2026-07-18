import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const RegisterComplaintContext = createContext();

export const AppProvider2 = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("CIVIRA_token") || null,
  );
  const [captures, setCaptures] = useState([]);
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  /* ---------- UI State ---------- */
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validImages, setValidImages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /* ---------- Global State ---------- */

  const [formData, setFormData] = useState({
    ward: "",
    wardNumber: "",
    landmark: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    category: "",
    description: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Axios instance
  const api = axios.create({
    baseURL: API_BASE_URL,
  });

  // Attach token automatically
  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // handel image validation api call function

  const handelImageValidation = async () => {
    try {
      if (captures.length === 0) {
        toast.error("Please add at least one photo as evidence.");
        return false;
      }
      setIsLoading(true);

      const formData = new FormData();
      captures.forEach((capture, index) => {
        formData.append(`images`, capture.blob, `capture_${index}.jpg`);
      });
      const response = await api.post(
        "/api/images/validate/ml/model/validation",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log(response.data);

      setValidImages(response.data);

      setFormData((prev) => ({
        ...prev,
        category: response.data.prediction,
      }));

      setIsLoading(false);

      if (response.data.isValid) {
        toast.success("Images validated successfully.");
      } else {
        toast.error("Some images are invalid. Please retake the photos.");
      }
    } catch (error) {
      console.log("Image validation error", error);
      toast.error("Error validating images. Please try again.");
      return false;
    }
  };

  /* ---------- Validation ---------- */
  const validateStep = (currentStep) => {
    const newErrors = {};

    switch (currentStep) {
      case 2:
        if (!formData.city) newErrors.city = true;
        if (!formData.state) newErrors.state = true;
        if (!formData.wardNumber) newErrors.wardNumber = true;
        if (!formData.address) newErrors.address = true;
        if (!formData.landmark) newErrors.landmark = true;
        if (!formData.ward) newErrors.ward = true;
        break;

      case 3:
        if (!formData.category) newErrors.category = true;
        if (!formData.description) newErrors.description = true;
        break;

      default:
        break;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill all required fields before proceeding.");
      return false;
    }

    return true;
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      console.log("Submitting:", formData, captures);

      const fd = new FormData();

      // Form data
      fd.append("data", JSON.stringify(formData));

      // Image metadata
      const metaData = captures.map((c) => ({
        lat: c.lat,
        lng: c.lng,
        accuracy: c.accuracy,
        timestamp: c.timestamp,
        isoTime: c.isoTime,
      }));

      fd.append("meta", JSON.stringify(metaData));

      // Images
      captures.forEach((item, index) => {
        fd.append("images", item.blob, `evidence_${index}.jpg`);
      });

      // API Call
      const response = await api.post("/api/user/register-complaint", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        setIsSuccess(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);

      // Show backend message if available
      toast.error(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- Navigation ---------- */
  const handleNext = () => {
    if (step === 1 && !validImages) {
      console.log("Validating images...");
      handelImageValidation();

      return;
    } // true
    if (step === 1 && captures.length === 0) {
      return;
    }
    if (step < totalSteps) {
      if (validateStep(step)) {
        setStep((prev) => prev + 1);
      }
    } else {
      handleSubmit();
    }
  };

  return (
    <RegisterComplaintContext.Provider
      value={{
        token,
        setToken,
        captures,
        setCaptures,
        formData,
        setFormData,
        errors,
        setErrors,
        step,
        setStep,
        totalSteps,

        handelImageValidation,
        validateStep,
        handleSubmit,

        validImages,
        setValidImages,

        isCameraOpen,
        setIsCameraOpen,
        isSubmitting,
        isSuccess,
        setIsSuccess,
        handleNext,

        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </RegisterComplaintContext.Provider>
  );
};

// Custom hook
export const useRegisterComplaintContext = () =>
  useContext(RegisterComplaintContext);
