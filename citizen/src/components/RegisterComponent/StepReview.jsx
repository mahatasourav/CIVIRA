import React from "react";

const StepReview = ({ formData, captures }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">
        Review Submission
      </h2>

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm mb-6">
        <div className="space-y-3">
          <div className="flex justify-between border-b pb-2 border-slate-200">
            <span className="text-slate-500">Category</span>
            <span className="font-bold">{formData.category}</span>
          </div>
          <div className="flex justify-between border-b pb-2 border-slate-200">
            <span className="text-slate-500">Location</span>
            <span className="font-bold text-right truncate max-w-[200px]">
              {formData.address}
            </span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-slate-500">Photos</span>
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
  );
};

export default StepReview;
