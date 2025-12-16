import React from "react";

const StepDetails = ({ formData, onChange, errors }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">
        Issue Specifics
      </h2>
      <div className="flex flex-col gap-6">
        <select
          name="category"
          value={formData.category}
          onChange={onChange}
          className={`w-full h-[60px] bg-slate-50 border rounded-xl px-4 outline-none focus:border-blue-500 ${
            errors.category ? "border-red-400" : "border-slate-200"
          }`}
        >
          <option value="" disabled>
            Select Category
          </option>
          <option value="Sanitation">Sanitation</option>
          <option value="Roads">Roads</option>
          <option value="Electric">Electric</option>
        </select>

        <input
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Short Description"
          className={`w-full bg-slate-50 border rounded-xl p-4 h-[60px] outline-none focus:border-blue-500 ${
            errors.description ? "border-red-400" : "border-slate-200"
          }`}
        />

        <textarea
          name="notes"
          value={formData.notes}
          onChange={onChange}
          placeholder="Additional Notes"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 h-32 resize-none outline-none focus:border-blue-500"
        ></textarea>
      </div>
    </div>
  );
};

export default StepDetails;
