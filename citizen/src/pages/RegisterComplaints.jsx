// import React, { useState, useRef, useEffect } from "react";
// import {
//   Bolt,
//   X,
//   Camera, // Changed CloudUpload to Camera
//   Crosshair,
//   Check,
//   ArrowRight,
//   Info,
//   Loader2,
//   Send,
//   MapPin,
//   RefreshCw, // Icon to retake/flip camera if needed
//   Image as ImageIcon, // Fallback icon
// } from "lucide-react";

// const RegisterComplaints = () => {
//   // --- State Management ---
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     ward: "",
//     landmark: "",
//     address: "",
//     category: "",
//     description: "",
//     notes: "",
//   });

//   // Image States
//   const [previews, setPreviews] = useState([]);

//   // Camera States
//   const [isCameraOpen, setIsCameraOpen] = useState(false);
//   const videoRef = useRef(null);
//   const streamRef = useRef(null);

//   // UI States
//   const [isDetectingGPS, setIsDetectingGPS] = useState(false);
//   const [gpsLocked, setGpsLocked] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [errors, setErrors] = useState({});

//   const totalSteps = 4;

//   // --- Logic & Handlers ---

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
//   };

//   // --- Camera Functions ---

//   const startCamera = async () => {
//     if (previews.length >= 3) {
//       alert("Maximum 3 photos allowed");
//       return;
//     }

//     setIsCameraOpen(true);
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: "environment" }, // Prefer back camera on mobile
//       });
//       streamRef.current = stream;
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//     } catch (err) {
//       console.error("Error accessing camera:", err);
//       alert("Unable to access camera. Please allow permissions.");
//       setIsCameraOpen(false);
//     }
//   };

//   const stopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop());
//       streamRef.current = null;
//     }
//     setIsCameraOpen(false);
//   };

//   const capturePhoto = () => {
//     const video = videoRef.current;
//     if (!video) return;

//     // Create a canvas to draw the frame
//     const canvas = document.createElement("canvas");
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//     // Convert to Data URL (Base64)
//     const imgUrl = canvas.toDataURL("image/jpeg");

//     setPreviews((prev) => [...prev, imgUrl]);
//     stopCamera();
//   };

//   const removePhoto = (indexToRemove) => {
//     setPreviews(previews.filter((_, index) => index !== indexToRemove));
//   };

//   // Cleanup camera on unmount
//   useEffect(() => {
//     return () => {
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   // --- GPS Logic ---
//   const handleGPS = () => {
//     setIsDetectingGPS(true);
//     setTimeout(() => {
//       setFormData((prev) => ({
//         ...prev,
//         address: "45/A, Tech Park Avenue",
//         landmark: "Opposite Metro Station",
//         ward: "Ward 12",
//       }));
//       setIsDetectingGPS(false);
//       setGpsLocked(true);
//       setErrors((prev) => ({ ...prev, address: null }));
//     }, 1500);
//   };

//   // --- Validation ---
//   const validateStep = (currentStep) => {
//     const newErrors = {};
//     let isValid = true;

//     if (currentStep === 2) {
//       if (!formData.ward) newErrors.ward = true;
//       if (!formData.address) newErrors.address = true;
//     }
//     if (currentStep === 3) {
//       if (!formData.category) newErrors.category = true;
//       if (!formData.description) newErrors.description = true;
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       isValid = false;
//     }
//     return isValid;
//   };

//   const handleNext = () => {
//     if (step < totalSteps) {
//       if (validateStep(step)) setStep((prev) => prev + 1);
//     } else {
//       setIsSubmitted(true);
//     }
//   };

//   const handleBack = () => {
//     if (step > 1) setStep((prev) => prev - 1);
//   };

//   // --- Design Variables ---
//   const progressWidth = ((step - 1) / (totalSteps - 1)) * 100;

//   return (
//     <div className="relative flex flex-col min-h-screen overflow-x-hidden font-sans bg-slate-50 text-slate-800 selection:bg-blue-200">
//       <style>{`
//         @import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap');
//         body { font-family: 'Satoshi', sans-serif; }

//         /* Floating Label Transition */
//         .peer:placeholder-shown ~ .floating-label {
//           top: 18px; font-size: 0.95rem; color: #64748b;
//         }
//         .peer:focus ~ .floating-label,
//         .peer:not(:placeholder-shown) ~ .floating-label {
//           top: 8px; font-size: 0.7rem; color: #2563eb; font-weight: 600;
//         }
//         @keyframes radar {
//           0% { width: 0; height: 0; opacity: 0.6; }
//           100% { width: 100px; height: 100px; opacity: 0; }
//         }
//         .animate-radar { animation: radar 2s infinite; }
//       `}</style>

//       {/* --- CAMERA OVERLAY (Visible when Camera is Open) --- */}
//       {isCameraOpen && (
//         <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
//           {/* Header */}
//           <div className="absolute top-0 left-0 z-20 flex items-center justify-between w-full p-6">
//             <div className="px-4 py-1 text-sm font-medium text-white rounded-full bg-black/40 backdrop-blur-md">
//               Photo {previews.length + 1}/3
//             </div>
//             <button
//               onClick={stopCamera}
//               className="p-2 text-white transition rounded-full bg-black/40 backdrop-blur-md hover:bg-white/20"
//             >
//               <X size={24} />
//             </button>
//           </div>

//           {/* Video Feed */}
//           <div className="relative flex items-center justify-center flex-1 overflow-hidden">
//             <video
//               ref={videoRef}
//               autoPlay
//               playsInline
//               className="absolute object-cover w-full h-full"
//             />
//             {/* Guide Frame */}
//             <div className="relative z-10 w-64 h-64 border-2 opacity-50 pointer-events-none border-white/50 rounded-xl">
//               <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white"></div>
//               <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white"></div>
//               <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white"></div>
//               <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white"></div>
//             </div>
//           </div>

//           {/* Controls */}
//           <div className="flex items-center justify-center h-32 pb-6 bg-black/80 backdrop-blur-sm">
//             <button
//               onClick={capturePhoto}
//               className="flex items-center justify-center w-20 h-20 transition-transform border-4 border-white rounded-full group active:scale-95"
//             >
//               <div className="w-16 h-16 transition-colors bg-white rounded-full group-hover:bg-slate-200"></div>
//             </button>
//           </div>
//         </div>
//       )}

//       {/* --- Navbar --- */}
//       <nav className="sticky top-0 z-50 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-md">
//         <div className="flex items-center justify-between max-w-4xl px-6 mx-auto">
//           <div className="flex items-center gap-2.5 text-xl font-black tracking-tight text-slate-900">
//             <div className="flex items-center justify-center w-8 h-8 text-white bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
//               <Bolt size={18} fill="currentColor" />
//             </div>
//             CIVIRA
//           </div>
//           <button className="text-slate-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1.5 transition-colors">
//             <X size={16} /> Cancel
//           </button>
//         </div>
//       </nav>

//       {/* --- Main Wizard Container --- */}
//       <div className="relative z-10 w-full max-w-4xl px-6 mx-auto mt-10 mb-20">
//         {/* Progress Tracker (Same as before) */}
//         <div className="relative flex justify-between px-2 mb-12">
//           <div className="absolute top-[15px] left-0 w-full h-[3px] bg-slate-200 -z-10 rounded-full"></div>
//           <div
//             className="absolute top-[15px] left-0 h-[3px] bg-blue-600 shadow-md shadow-blue-600/30 transition-all duration-500 ease-out -z-10 rounded-full"
//             style={{ width: `${progressWidth}%` }}
//           ></div>

//           {[1, 2, 3, 4].map((i) => (
//             <div
//               key={i}
//               className="relative z-10 flex flex-col items-center gap-2 cursor-default group"
//             >
//               <div
//                 className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
//                   i < step
//                     ? "bg-emerald-500 border-emerald-500 text-white"
//                     : i === step
//                     ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_0_4px_rgba(37,99,235,0.15)]"
//                     : "bg-white border-slate-300 text-slate-400"
//                 }`}
//               >
//                 {i < step ? <Check size={14} strokeWidth={3} /> : i}
//               </div>
//               <span
//                 className={`text-[0.7rem] uppercase font-bold tracking-wider transition-colors ${
//                   i === step ? "text-blue-600" : "text-slate-400"
//                 }`}
//               >
//                 {["Photo", "Location", "Details", "Review"][i - 1]}
//               </span>
//             </div>
//           ))}
//         </div>

//         {/* The Card */}
//         <div className="bg-white/70 backdrop-blur-xl border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-3xl p-6 md:p-10 min-h-[450px] relative overflow-hidden transition-all">
//           {/* Step 1: Click Photo */}
//           {step === 1 && (
//             <div className="duration-500 animate-in fade-in slide-in-from-right-8">
//               <h2 className="mb-2 text-2xl font-bold md:text-3xl text-slate-800">
//                 Capture Evidence
//               </h2>
//               <p className="mb-8 text-slate-500">
//                 Click clear photos of the issue. You can take up to 3 photos.
//               </p>

//               {/* Camera Trigger Area */}
//               <div
//                 onClick={startCamera}
//                 className="group border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50 rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 active:scale-[0.99]"
//               >
//                 <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-transform duration-300 bg-white rounded-full shadow-sm group-hover:scale-110">
//                   <Camera
//                     className="transition-colors text-slate-400 group-hover:text-blue-600"
//                     size={28}
//                   />
//                 </div>
//                 <h3 className="mb-1 text-lg font-bold text-slate-900">
//                   Tap to Take Photo
//                 </h3>
//                 <p className="text-sm text-slate-500">Opens your camera</p>
//               </div>

//               {/* Image Previews */}
//               {previews.length > 0 && (
//                 <div className="flex flex-wrap gap-4 mt-8 animate-in fade-in zoom-in-95">
//                   {previews.map((src, idx) => (
//                     <div
//                       key={idx}
//                       className="relative w-24 h-24 overflow-hidden border-2 border-white shadow-md rounded-xl group"
//                     >
//                       <img
//                         src={src}
//                         alt="Evidence"
//                         className="object-cover w-full h-full"
//                       />
//                       <button
//                         onClick={() => removePhoto(idx)}
//                         className="absolute inset-0 items-center justify-center hidden transition-all cursor-pointer bg-black/40 group-hover:flex"
//                       >
//                         <X className="text-white drop-shadow-md" />
//                       </button>
//                       <div className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 rounded-full shadow-sm">
//                         {idx + 1}
//                       </div>
//                     </div>
//                   ))}

//                   {/* Add More Button (Mini) */}
//                   {previews.length < 3 && (
//                     <button
//                       onClick={startCamera}
//                       className="flex flex-col items-center justify-center w-24 h-24 transition-all border-2 border-dashed rounded-xl border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50"
//                     >
//                       <Camera size={20} />
//                       <span className="mt-1 text-xs font-bold">Add +</span>
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Step 2: Location (Unchanged logic, just re-rendering) */}
//           {step === 2 && (
//             <div className="duration-500 animate-in fade-in slide-in-from-right-8">
//               <h2 className="mb-6 text-2xl font-bold md:text-3xl text-slate-800">
//                 Location Data
//               </h2>

//               {/* Map UI */}
//               <div className="h-64 w-full bg-slate-100 rounded-2xl relative overflow-hidden border border-slate-200 mb-6 flex items-center justify-center bg-[linear-gradient(#cbd5e1_1px,transparent_1px),linear-gradient(90deg,#cbd5e1_1px,transparent_1px)] bg-[size:24px_24px]">
//                 {/* Radar Ping */}
//                 <div className="w-6 h-6 bg-blue-600 rounded-full relative z-10 shadow-[0_0_0_4px_rgba(255,255,255,0.8)] flex items-center justify-center">
//                   <div className="w-2 h-2 bg-white rounded-full"></div>
//                   <div className="absolute border border-blue-500 rounded-full animate-radar"></div>
//                 </div>

//                 <button
//                   onClick={handleGPS}
//                   className={`
//                    absolute bottom-5 right-5 flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-bold transition-all shadow-lg hover:-translate-y-0.5
//                    ${
//                      gpsLocked
//                        ? "bg-emerald-500 border-emerald-500 text-white"
//                        : "bg-white border-white text-slate-700 hover:text-blue-600"
//                    }
//                  `}
//                 >
//                   {isDetectingGPS ? (
//                     <>
//                       <Loader2 className="animate-spin" size={16} /> locating...
//                     </>
//                   ) : gpsLocked ? (
//                     <>
//                       <Check size={16} /> GPS Locked
//                     </>
//                   ) : (
//                     <>
//                       <Crosshair size={16} /> Detect GPS
//                     </>
//                   )}
//                 </button>
//               </div>

//               {/* Form Grid */}
//               <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
//                 <div className="relative group">
//                   <select
//                     name="ward"
//                     value={formData.ward}
//                     onChange={handleInputChange}
//                     className={`peer w-full bg-slate-50 border rounded-xl px-4 pt-6 pb-2 text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none h-[60px] cursor-pointer ${
//                       errors.ward
//                         ? "border-red-400 bg-red-50"
//                         : "border-slate-200"
//                     }`}
//                   >
//                     <option value="" disabled></option>
//                     <option value="Ward 12">Ward 12 - North</option>
//                     <option value="Ward 13">Ward 13 - Market</option>
//                     <option value="Ward 14">Ward 14 - Ind. Area</option>
//                   </select>
//                   <label className="absolute z-10 transition-all duration-200 pointer-events-none floating-label left-4">
//                     Select Ward / Zone
//                   </label>
//                   <div className="absolute -translate-y-1/2 pointer-events-none right-4 top-1/2 text-slate-400">
//                     <MapPin size={18} />
//                   </div>
//                 </div>

//                 <div className="relative group">
//                   <input
//                     type="text"
//                     name="landmark"
//                     value={formData.landmark}
//                     onChange={handleInputChange}
//                     placeholder=" "
//                     className="peer w-full bg-slate-50 border border-slate-200 rounded-xl px-4 pt-6 pb-2 text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all h-[60px]"
//                   />
//                   <label className="absolute transition-all duration-200 pointer-events-none floating-label left-4">
//                     Nearest Landmark
//                   </label>
//                 </div>
//               </div>

//               <div className="relative group">
//                 <input
//                   type="text"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   placeholder=" "
//                   className={`peer w-full bg-slate-50 border rounded-xl px-4 pt-6 pb-2 text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all h-[60px] ${
//                     errors.address
//                       ? "border-red-400 bg-red-50"
//                       : "border-slate-200"
//                   }`}
//                 />
//                 <label className="absolute transition-all duration-200 pointer-events-none floating-label left-4">
//                   Specific Street Address
//                 </label>
//               </div>
//             </div>
//           )}

//           {/* Step 3: Details (Unchanged logic) */}
//           {step === 3 && (
//             <div className="duration-500 animate-in fade-in slide-in-from-right-8">
//               <h2 className="mb-6 text-2xl font-bold md:text-3xl text-slate-800">
//                 Issue Specifics
//               </h2>
//               <div className="relative mb-6">
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleInputChange}
//                   className={`peer w-full bg-slate-50 border rounded-xl px-4 pt-6 pb-2 text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none h-[60px] cursor-pointer ${
//                     errors.category
//                       ? "border-red-400 bg-red-50"
//                       : "border-slate-200"
//                   }`}
//                 >
//                   <option value="" disabled></option>
//                   <option value="Sanitation">Sanitation & Garbage</option>
//                   <option value="Roads">Road Maintenance / Potholes</option>
//                   <option value="Electrical">
//                     Street Lighting / Electrical
//                   </option>
//                   <option value="Water">Water Supply / Drainage</option>
//                 </select>
//                 <label className="absolute transition-all duration-200 pointer-events-none floating-label left-4">
//                   Issue Category
//                 </label>
//               </div>
//               <div className="relative mb-6">
//                 <input
//                   type="text"
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   placeholder=" "
//                   className={`peer w-full bg-slate-50 border rounded-xl px-4 pt-6 pb-2 text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all h-[60px] ${
//                     errors.description
//                       ? "border-red-400 bg-red-50"
//                       : "border-slate-200"
//                   }`}
//                 />
//                 <label className="absolute transition-all duration-200 pointer-events-none floating-label left-4">
//                   Short Description
//                 </label>
//               </div>
//               <div className="relative">
//                 <textarea
//                   name="notes"
//                   value={formData.notes}
//                   onChange={handleInputChange}
//                   placeholder=" "
//                   className="w-full h-32 px-4 pt-6 pb-2 transition-all border outline-none resize-none peer bg-slate-50 border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
//                 ></textarea>
//                 <label className="absolute transition-all duration-200 pointer-events-none floating-label left-4">
//                   Additional Notes (Optional)
//                 </label>
//               </div>
//             </div>
//           )}

//           {/* Step 4: Review (Unchanged logic) */}
//           {step === 4 && (
//             <div className="duration-500 animate-in fade-in slide-in-from-right-8">
//               <h2 className="mb-6 text-2xl font-bold md:text-3xl text-slate-800">
//                 Review Submission
//               </h2>
//               <div className="flex flex-col gap-4 p-6 mb-6 border shadow-sm bg-slate-50 rounded-2xl border-slate-100">
//                 <div className="flex justify-between pb-3 border-b border-slate-200">
//                   <span className="text-sm font-medium text-slate-500">
//                     Issue Category
//                   </span>
//                   <span className="font-bold text-slate-900">
//                     {formData.category || "--"}
//                   </span>
//                 </div>
//                 <div className="flex justify-between pb-3 border-b border-slate-200">
//                   <span className="text-sm font-medium text-slate-500">
//                     Location
//                   </span>
//                   <span className="font-bold text-right text-slate-900">
//                     {formData.address || "--"}
//                   </span>
//                 </div>
//                 <div className="flex justify-between pb-3 border-b border-slate-200">
//                   <span className="text-sm font-medium text-slate-500">
//                     Description
//                   </span>
//                   <span className="font-bold text-right text-slate-900">
//                     {formData.description || "--"}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm font-medium text-slate-500">
//                     Photos Captured
//                   </span>
//                   <span className="flex items-center gap-2 font-bold text-slate-900">
//                     {previews.length}{" "}
//                     <span className="text-xs font-normal text-slate-400">
//                       (Verified)
//                     </span>
//                   </span>
//                 </div>
//               </div>
//               <div className="flex items-start gap-3 p-4 border border-blue-100 bg-blue-50 rounded-xl">
//                 <Info size={20} className="text-blue-600 mt-0.5 shrink-0" />
//                 <p className="text-sm font-medium leading-relaxed text-slate-600">
//                   By submitting, you certify that this information is accurate.
//                   False reporting to the C.I.V.I.R.A network may lead to account
//                   suspension.
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Navigation Buttons */}
//           <div className="flex justify-between mt-10">
//             <button
//               onClick={handleBack}
//               disabled={step === 1}
//               className={`px-8 py-3.5 rounded-xl font-bold transition-all ${
//                 step === 1
//                   ? "opacity-0 pointer-events-none"
//                   : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
//               }`}
//             >
//               Back
//             </button>
//             <button
//               onClick={handleNext}
//               className={`px-8 py-3.5 rounded-xl font-bold flex items-center gap-3 shadow-lg hover:-translate-y-0.5 transition-all ${
//                 step === totalSteps
//                   ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30"
//                   : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30"
//               }`}
//             >
//               {step === totalSteps ? (
//                 <>
//                   Submit Report <Send size={18} />
//                 </>
//               ) : (
//                 <>
//                   Next Step <ArrowRight size={18} />
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* --- Success Modal (Unchanged) --- */}
//       {isSubmitted && (
//         <div className="fixed inset-0 z-[100] bg-slate-900/20 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
//           <div className="w-full max-w-sm p-12 text-center duration-300 bg-white shadow-2xl rounded-3xl animate-in zoom-in-95">
//             <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-4xl border-2 rounded-full shadow-lg bg-emerald-50 text-emerald-500 border-emerald-500 shadow-emerald-200">
//               <Check size={40} />
//             </div>
//             <h2 className="mb-2 text-2xl font-black text-slate-900">
//               Report Submitted!
//             </h2>
//             <p className="mb-8 leading-snug text-slate-500">
//               Your complaint has been successfully registered on the blockchain
//               ledger.
//             </p>
//             <div className="p-4 mb-8 border bg-slate-50 rounded-xl border-slate-200 dashed">
//               <span className="block mb-1 text-xs font-bold tracking-wider uppercase text-slate-400">
//                 Ticket ID
//               </span>
//               <span className="font-mono text-2xl font-black tracking-widest text-blue-600">
//                 #CIV-8892
//               </span>
//             </div>
//             <button
//               onClick={() => window.location.reload()}
//               className="w-full py-3.5 rounded-xl font-bold bg-slate-900 text-white hover:bg-black transition-all"
//             >
//               Return to Dashboard
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RegisterComplaints;
import React, { useState, useRef, useEffect } from "react";
import {
  Bolt,
  X,
  Camera,
  Crosshair,
  Check,
  ArrowRight,
  Info,
  Loader2,
  Send,
  MapPin,
  AlertTriangle,
  FileText,
} from "lucide-react";

// --- Helper: Convert Base64 to Blob for FormData ---
const dataURLtoBlob = (dataurl) => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

const RegisterComplaints = () => {
  // --- State Management ---
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ward: "",
    landmark: "",
    address: "",
    category: "",
    description: "",
    notes: "",
  });

  // --- Image & Location State ---
  // Stores objects: { id, previewUrl, blob, lat, lng, gpsError }
  const [captures, setCaptures] = useState([]);

  // --- Camera & GPS Refs ---
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // We use a ref for location to access the latest coords inside the capture closure
  // without triggering re-renders of the camera view.
  const locationRef = useRef({ lat: null, lng: null, error: null });
  const watchIdRef = useRef(null);

  // UI States
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [gpsLocked, setGpsLocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const totalSteps = 4;

  // --- Logic & Handlers ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // --- GPS Tracking (Active when Camera is Open) ---
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      locationRef.current = { lat: null, lng: null, error: "Not supported" };
      return;
    }

    // watchPosition "warms up" the GPS so coords are ready instantly when shutter is pressed
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        locationRef.current = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null,
        };
      },
      (err) => {
        console.warn("GPS Error:", err.message);
        let msg = "Location unavailable";
        if (err.code === 1) msg = "Permission denied";
        locationRef.current = { lat: null, lng: null, error: msg };
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const stopLocationTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  // --- Camera Functions ---

  const startCamera = async () => {
    if (captures.length >= 3) {
      alert("Maximum 3 photos allowed");
      return;
    }

    setIsCameraOpen(true);
    startLocationTracking(); // <--- Start GPS sync

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Prefer back camera
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera. Please allow permissions.");
      setIsCameraOpen(false);
      stopLocationTracking();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    stopLocationTracking(); // <--- Stop GPS sync
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    // 1. Capture Visual (Canvas)
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    const blob = dataURLtoBlob(dataUrl);

    // 2. Capture Location (from active Ref)
    const { lat, lng, error } = locationRef.current;

    // 3. Store composite object
    const newCapture = {
      id: Date.now(),
      previewUrl: dataUrl,
      blob: blob,
      lat: lat,
      lng: lng,
      gpsError: error,
    };

    setCaptures((prev) => [...prev, newCapture]);
    stopCamera();
  };

  const removePhoto = (idToRemove) => {
    setCaptures(captures.filter((c) => c.id !== idToRemove));
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera(); // Handles both camera and GPS cleanup
    };
  }, []);

  // --- Form Submission with FormData ---
  const submitToBackend = async () => {
    setIsSubmitting(true);

    // Create FormData object
    const submissionData = new FormData();

    // 1. Append Text Data
    Object.keys(formData).forEach((key) => {
      submissionData.append(key, formData[key]);
    });

    // 2. Append Files & Metadata
    // We append images as files, and location data as a separate JSON string
    // or distinct fields mapped by index.
    captures.forEach((cap, index) => {
      // Append the actual image file
      submissionData.append(
        `evidence_${index + 1}`,
        cap.blob,
        `photo_${index + 1}.jpg`
      );

      // Append coordinates for this specific image
      submissionData.append(`evidence_${index + 1}_lat`, cap.lat || "");
      submissionData.append(`evidence_${index + 1}_lng`, cap.lng || "");
    });

    // --- DEBUGGING: Log what we are sending ---
    console.log("--- SUBMITTING FORM DATA ---");
    for (var pair of submissionData.entries()) {
      console.log(
        pair[0] + ", " + (pair[1] instanceof Blob ? "[Blob File]" : pair[1])
      );
    }

    // Simulate Network Request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  // --- Validation & Nav ---
  const handleGPS = () => {
    setIsDetectingGPS(true);
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        address: "45/A, Tech Park Avenue",
        landmark: "Opposite Metro Station",
        ward: "Ward 12",
      }));
      setIsDetectingGPS(false);
      setGpsLocked(true);
      setErrors((prev) => ({ ...prev, address: null }));
    }, 1500);
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    let isValid = true;

    if (currentStep === 2) {
      if (!formData.ward) newErrors.ward = true;
      if (!formData.address) newErrors.address = true;
    }
    if (currentStep === 3) {
      if (!formData.category) newErrors.category = true;
      if (!formData.description) newErrors.description = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    }
    return isValid;
  };

  const handleNext = () => {
    if (step < totalSteps) {
      if (validateStep(step)) setStep((prev) => prev + 1);
    } else {
      submitToBackend();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const progressWidth = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="relative flex flex-col min-h-screen overflow-x-hidden font-sans bg-slate-50 text-slate-800 selection:bg-blue-200">
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap');
        body { font-family: 'Satoshi', sans-serif; }
        .peer:placeholder-shown ~ .floating-label { top: 18px; font-size: 0.95rem; color: #64748b; }
        .peer:focus ~ .floating-label, .peer:not(:placeholder-shown) ~ .floating-label { top: 8px; font-size: 0.7rem; color: #2563eb; font-weight: 600; }
        @keyframes radar { 0% { width: 0; height: 0; opacity: 0.6; } 100% { width: 100px; height: 100px; opacity: 0; } }
        .animate-radar { animation: radar 2s infinite; }
      `}</style>

      {/* --- CAMERA OVERLAY --- */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
          <div className="absolute top-0 left-0 z-20 flex items-center justify-between w-full p-6">
            <div className="flex items-center gap-2 px-4 py-1 text-sm font-medium text-white rounded-full bg-black/40 backdrop-blur-md">
              Photo {captures.length + 1}/3
              {/* GPS Indicator in Camera View */}
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <button
              onClick={stopCamera}
              className="p-2 text-white transition rounded-full bg-black/40 backdrop-blur-md hover:bg-white/20"
            >
              <X size={24} />
            </button>
          </div>

          <div className="relative flex items-center justify-center flex-1 overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute object-cover w-full h-full"
            />
            {/* Guide Frame */}
            <div className="relative z-10 w-64 h-64 border-2 opacity-50 pointer-events-none border-white/50 rounded-xl">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white"></div>
            </div>
          </div>

          <div className="flex items-center justify-center h-32 pb-6 bg-black/80 backdrop-blur-sm">
            <button
              onClick={capturePhoto}
              className="flex items-center justify-center w-20 h-20 transition-transform border-4 border-white rounded-full group active:scale-95"
            >
              <div className="w-16 h-16 transition-colors bg-white rounded-full group-hover:bg-slate-200"></div>
            </button>
          </div>
        </div>
      )}

      {/* --- Navbar --- */}
      <nav className="sticky top-0 z-50 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between max-w-4xl px-6 mx-auto">
          <div className="flex items-center gap-2.5 text-xl font-black tracking-tight text-slate-900">
            <div className="flex items-center justify-center w-8 h-8 text-white bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
              <Bolt size={18} fill="currentColor" />
            </div>
            CIVIRA
          </div>
          <button className="text-slate-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1.5 transition-colors">
            <X size={16} /> Cancel
          </button>
        </div>
      </nav>

      {/* --- Main Wizard --- */}
      <div className="relative z-10 w-full max-w-4xl px-6 mx-auto mt-10 mb-20">
        {/* Progress Tracker */}
        <div className="relative flex justify-between px-2 mb-12">
          <div className="absolute top-[15px] left-0 w-full h-[3px] bg-slate-200 -z-10 rounded-full"></div>
          <div
            className="absolute top-[15px] left-0 h-[3px] bg-blue-600 shadow-md shadow-blue-600/30 transition-all duration-500 ease-out -z-10 rounded-full"
            style={{ width: `${progressWidth}%` }}
          ></div>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="relative z-10 flex flex-col items-center gap-2 cursor-default group"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                  i < step
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : i === step
                    ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_0_4px_rgba(37,99,235,0.15)]"
                    : "bg-white border-slate-300 text-slate-400"
                }`}
              >
                {i < step ? <Check size={14} strokeWidth={3} /> : i}
              </div>
              <span
                className={`text-[0.7rem] uppercase font-bold tracking-wider transition-colors ${
                  i === step ? "text-blue-600" : "text-slate-400"
                }`}
              >
                {["Photo", "Location", "Details", "Review"][i - 1]}
              </span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-3xl p-6 md:p-10 min-h-[450px] relative overflow-hidden transition-all">
          {/* Step 1: Capture Evidence */}
          {step === 1 && (
            <div className="duration-500 animate-in fade-in slide-in-from-right-8">
              <h2 className="mb-2 text-2xl font-bold md:text-3xl text-slate-800">
                Capture Evidence
              </h2>
              <p className="mb-8 text-slate-500">
                Click clear photos. Location will be auto-tagged.
              </p>

              <div
                onClick={startCamera}
                className="group border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50 rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 active:scale-[0.99]"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-transform duration-300 bg-white rounded-full shadow-sm group-hover:scale-110">
                  <Camera
                    className="transition-colors text-slate-400 group-hover:text-blue-600"
                    size={28}
                  />
                </div>
                <h3 className="mb-1 text-lg font-bold text-slate-900">
                  Tap to Take Photo
                </h3>
                <p className="text-sm text-slate-500">Auto-tags GPS Location</p>
              </div>

              {/* Captures Preview List */}
              {captures.length > 0 && (
                <div className="flex flex-col gap-3 mt-8 animate-in fade-in zoom-in-95">
                  <h4 className="mb-2 text-sm font-bold tracking-wider uppercase text-slate-400">
                    Attached Evidence
                  </h4>
                  {captures.map((cap, idx) => (
                    <div
                      key={cap.id}
                      className="relative flex items-center gap-4 p-3 overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-16 overflow-hidden rounded-lg shrink-0 bg-slate-100">
                        <img
                          src={cap.previewUrl}
                          alt="Capture"
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* Metadata */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-slate-700">
                            Image {idx + 1}
                          </span>
                          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                            {(cap.blob.size / 1024).toFixed(0)} KB
                          </span>
                        </div>

                        {/* GPS Status Indicator */}
                        {cap.lat ? (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                            <MapPin size={12} fill="currentColor" />
                            <span>
                              {cap.lat.toFixed(6)}, {cap.lng.toFixed(6)}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                            <AlertTriangle size={12} />
                            <span>{cap.gpsError || "No Location Data"}</span>
                          </div>
                        )}
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removePhoto(cap.id)}
                        className="p-2 transition-colors rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}

                  {captures.length < 3 && (
                    <button
                      onClick={startCamera}
                      className="flex items-center justify-center w-full gap-2 py-3 text-sm font-medium transition-all border border-dashed rounded-xl border-slate-300 text-slate-500 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600"
                    >
                      <Camera size={16} /> Add another photo
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Steps 2 & 3 (Location Form & Details) - Rendering only for brevity */}
          {step === 2 && (
            <div className="duration-500 animate-in fade-in slide-in-from-right-8">
              <h2 className="mb-6 text-2xl font-bold md:text-3xl text-slate-800">
                Location Data
              </h2>
              {/* Note to user about auto-fill */}
              {captures.some((c) => c.lat) && (
                <div className="flex items-start gap-3 p-4 mb-6 border bg-emerald-50 border-emerald-100 rounded-xl">
                  <Check
                    className="text-emerald-600 mt-0.5 shrink-0"
                    size={18}
                  />
                  <p className="text-sm text-emerald-800">
                    We detected coordinates from your photos. You can refine the
                    address below manually.
                  </p>
                </div>
              )}

              <div className="h-48 w-full bg-slate-100 rounded-2xl relative overflow-hidden border border-slate-200 mb-6 flex items-center justify-center bg-[linear-gradient(#cbd5e1_1px,transparent_1px),linear-gradient(90deg,#cbd5e1_1px,transparent_1px)] bg-[size:24px_24px]">
                <button
                  onClick={handleGPS}
                  className={`bg-white border px-5 py-2.5 rounded-full text-slate-700 shadow-lg flex items-center gap-2 text-sm font-bold hover:text-blue-600 ${
                    gpsLocked ? "border-emerald-500 text-emerald-600" : ""
                  }`}
                >
                  {isDetectingGPS ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Crosshair size={16} />
                  )}
                  {gpsLocked ? "GPS Verified" : "Use Current Location"}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
                <div className="relative">
                  <input
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                    placeholder="Ward No"
                    className="w-full p-4 border outline-none bg-slate-50 border-slate-200 rounded-xl focus:border-blue-500"
                  />
                </div>
                <div className="relative">
                  <input
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="Landmark"
                    className="w-full p-4 border outline-none bg-slate-50 border-slate-200 rounded-xl focus:border-blue-500"
                  />
                </div>
              </div>
              <input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street Address"
                className={`w-full bg-slate-50 border rounded-xl p-4 outline-none focus:border-blue-500 ${
                  errors.address ? "border-red-400" : "border-slate-200"
                }`}
              />
            </div>
          )}

          {step === 3 && (
            <div className="duration-500 animate-in fade-in slide-in-from-right-8">
              <h2 className="mb-6 text-2xl font-bold md:text-3xl text-slate-800">
                Issue Specifics
              </h2>
              <div className="flex flex-col gap-6">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full h-[60px] bg-slate-50 border rounded-xl px-4 outline-none focus:border-blue-500 ${
                    errors.category ? "border-red-400" : "border-slate-200"
                  }`}
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Roads">Roads</option>
                </select>
                <input
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Short Description"
                  className={`w-full bg-slate-50 border rounded-xl p-4 h-[60px] outline-none focus:border-blue-500 ${
                    errors.description ? "border-red-400" : "border-slate-200"
                  }`}
                />
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Additional Notes"
                  className="w-full h-32 p-4 border outline-none resize-none bg-slate-50 border-slate-200 rounded-xl focus:border-blue-500"
                ></textarea>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="duration-500 animate-in fade-in slide-in-from-right-8">
              <h2 className="mb-6 text-2xl font-bold md:text-3xl text-slate-800">
                Review Submission
              </h2>

              <div className="p-6 mb-6 border shadow-sm bg-slate-50 rounded-2xl border-slate-100">
                {/* Summary list */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category</span>
                    <span className="font-bold">{formData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location</span>
                    <span className="font-bold text-right max-w-[200px] truncate">
                      {formData.address}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="text-slate-500">Evidence</span>
                    <div className="flex gap-1">
                      {captures.map((c, i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded flex items-center justify-center text-[10px] text-white font-bold ${
                            c.lat ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-10">
            <button
              onClick={handleBack}
              disabled={step === 1 || isSubmitting}
              className={`px-8 py-3.5 rounded-xl font-bold transition-all ${
                step === 1
                  ? "opacity-0 pointer-events-none"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className={`px-8 py-3.5 rounded-xl font-bold flex items-center gap-3 shadow-lg hover:-translate-y-0.5 transition-all ${
                step === totalSteps
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isSubmitting ? (
                <>
                  {" "}
                  <Loader2
                    className="animate-spin"
                    size={18}
                  /> Uploading...{" "}
                </>
              ) : step === totalSteps ? (
                <>
                  {" "}
                  Submit Report <Send size={18} />{" "}
                </>
              ) : (
                <>
                  {" "}
                  Next Step <ArrowRight size={18} />{" "}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- Success Modal --- */}
      {isSuccess && (
        <div className="fixed inset-0 z-[100] bg-slate-900/20 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm p-12 text-center bg-white shadow-2xl rounded-3xl animate-in zoom-in-95">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-4xl border-2 rounded-full bg-emerald-50 text-emerald-500 border-emerald-500">
              <Check size={40} />
            </div>
            <h2 className="mb-2 text-2xl font-black text-slate-900">
              Report Submitted!
            </h2>
            <p className="mb-8 text-slate-500">
              Data successfully uploaded via FormData.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3.5 rounded-xl font-bold bg-slate-900 text-white"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterComplaints;
