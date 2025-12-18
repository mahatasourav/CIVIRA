import React, { useState } from "react";
import { Check, Crosshair, Loader2, MapPin, AlertCircle } from "lucide-react";

const StepLocation = ({
  formData,
  onChange,
  errors,
  captures,
  setFormData,
  setErrors,
}) => {
  const [gpsLocked, setGpsLocked] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectError, setDetectError] = useState(null);

  // --- 1. Real Reverse Geocoding Function ---
  const fetchAddressFromCoords = async (lat, lng) => {
    try {
      // Using OpenStreetMap (Nominatim) Free API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            // Nominatim requires a User-Agent to identify the app
            "User-Agent": "Civira-Report-App/1.0",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch address");

      const data = await response.json();
      const addr = data.address;

      // --- 2. Smart Mapping Logic ---
      // We map available OSM tags to your specific fields

      // WARD NO: Best guess is 'neighbourhood', 'suburb', or 'residential'
      const detectedWard =
        addr.neighbourhood ||
        addr.suburb ||
        addr.residential ||
        addr.village ||
        "";

      // LANDMARK: Look for 'amenity', 'building', or 'shop'
      // If the location itself is a shop/amenity, use its name (data.name)
      // Otherwise, check typical landmark fields
      const detectedLandmark =
        data.name ||
        addr.amenity ||
        addr.shop ||
        addr.building ||
        addr.tourism ||
        "";

      // STREET ADDRESS: Combine road + house number
      const streetPart = addr.road || addr.pedestrian || addr.highway || "";
      const housePart = addr.house_number ? `${addr.house_number}, ` : "";
      const cityPart = addr.city || addr.town || addr.county || "";
      const detectedAddress = `${housePart}${streetPart}, ${cityPart}`;

      return {
        ward: detectedWard,
        landmark: detectedLandmark,
        address: detectedAddress,
      };
    } catch (err) {
      console.error("Geocoding failed:", err);
      return null;
    }
  };

  const handleAutoFill = async () => {
    setIsDetecting(true);
    setDetectError(null);

    // 1. Get Coordinates (Prefer photo tags, fallback to live browser GPS)
    let lat, lng;

    // Check if we already have coords from the photos (Step 1)
    const photoWithLoc = captures.find((c) => c.lat);

    if (photoWithLoc) {
      lat = photoWithLoc.lat;
      lng = photoWithLoc.lng;
    } else {
      // Fallback: Get browser current location if no photo tags
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
          });
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch (e) {
        setDetectError("Could not access GPS. Please allow permissions.");
        setIsDetecting(false);
        return;
      }
    }

    // 2. Fetch Address Data
    const result = await fetchAddressFromCoords(lat, lng);

    if (result) {
      setFormData((prev) => ({
        ...prev,
        ward: result.ward || prev.ward, // Only overwrite if we found something
        landmark: result.landmark || prev.landmark,
        address: result.address || prev.address,
      }));

      // Clear errors since we filled data
      setErrors((prev) => ({ ...prev, ward: null, address: null }));
      setGpsLocked(true);
    } else {
      setDetectError("Address not found. Please enter manually.");
    }

    setIsDetecting(false);
  };

  return (
    <div className="duration-500 animate-in fade-in slide-in-from-right-8">
      <h2 className="mb-6 text-2xl font-bold md:text-3xl text-slate-800">
        Location Data
      </h2>

      {/* Helper Message: Photo Auto-detection */}
      {captures.some((c) => c.lat) && (
        <div className="flex items-start gap-3 p-4 mb-6 border bg-emerald-50 border-emerald-100 rounded-xl">
          <Check className="text-emerald-600 mt-0.5 shrink-0" size={18} />
          <p className="text-sm text-emerald-800">
            Coordinates detected from your photos. Click below to fetch the
            address.
          </p>
        </div>
      )}

      {/* Map / GPS Area */}
      <div className="h-48 w-full bg-slate-100 rounded-2xl relative overflow-hidden border border-slate-200 mb-6 flex flex-col items-center justify-center bg-[linear-gradient(#cbd5e1_1px,transparent_1px),linear-gradient(90deg,#cbd5e1_1px,transparent_1px)] bg-[size:24px_24px]">
        <button
          onClick={handleAutoFill}
          disabled={isDetecting}
          className={`
            bg-white border px-6 py-3 rounded-full shadow-lg flex items-center gap-3 text-sm font-bold transition-all hover:-translate-y-1
            ${
              gpsLocked
                ? "border-emerald-500 text-emerald-600 ring-4 ring-emerald-500/10"
                : "text-slate-700 hover:text-blue-600 hover:border-blue-300"
            }
          `}
        >
          {isDetecting ? (
            <>
              <Loader2 className="text-blue-600 animate-spin" size={18} />
              <span className="text-blue-600">Fetching Address...</span>
            </>
          ) : gpsLocked ? (
            <>
              <Check size={18} strokeWidth={3} />
              <span>Address Locked</span>
            </>
          ) : (
            <>
              <Crosshair size={18} />
              <span>Use Current Location</span>
            </>
          )}
        </button>

        {detectError && (
          <div className="absolute bottom-4 flex items-center gap-2 text-xs text-red-500 font-medium bg-white/90 px-3 py-1.5 rounded-full shadow-sm animate-in fade-in slide-in-from-bottom-2">
            <AlertCircle size={14} /> {detectError}
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
        <div className="relative group">
          <input
            name="ward"
            value={formData.ward}
            onChange={onChange}
            placeholder="Ward No / Area"
            className={`w-full bg-slate-50 border rounded-xl p-4 outline-none focus:bg-white focus:border-blue-500 transition-all ${
              errors.ward ? "border-red-400 bg-red-50" : "border-slate-200"
            }`}
          />
          {/* Tooltip for Ward */}
          <span className="absolute -translate-y-1/2 pointer-events-none right-4 top-1/2 text-slate-400">
            <MapPin size={18} />
          </span>
        </div>

        <div className="relative">
          <input
            name="landmark"
            value={formData.landmark}
            onChange={onChange}
            placeholder="Nearest Landmark"
            className="w-full p-4 transition-all border outline-none bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:border-blue-500"
          />
        </div>
      </div>

      <input
        name="address"
        value={formData.address}
        onChange={onChange}
        placeholder="Specific Street Address"
        className={`w-full bg-slate-50 border rounded-xl p-4 outline-none focus:bg-white focus:border-blue-500 transition-all ${
          errors.address ? "border-red-400 bg-red-50" : "border-slate-200"
        }`}
      />
    </div>
  );
};

export default StepLocation;
