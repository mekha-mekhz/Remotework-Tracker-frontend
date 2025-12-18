import React, { useState } from "react";
import api from "../components/api";

function ApplyLeave() {
  const [form, setForm] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState({}); // ✅ Validation errors

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear endDate if startDate is after it
    if (name === "startDate" && form.endDate && value > form.endDate) {
      setForm({ ...form, startDate: value, endDate: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ✅ Frontend validation
  const validate = () => {
    const tempErrors = {};
    if (!form.leaveType) tempErrors.leaveType = "Leave type is required";
    if (!form.startDate) tempErrors.startDate = "Start date is required";
    else if (form.startDate < today) tempErrors.startDate = "Start date cannot be in the past";
    if (!form.endDate) tempErrors.endDate = "End date is required";
    else if (form.endDate < form.startDate) tempErrors.endDate = "End date must be after start date";
    if (!form.reason.trim()) tempErrors.reason = "Reason is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // ❌ Stop if validation fails

    setLoading(true);
    setMsg("");

    try {
      await api.post("/leave/apply", form);
      setMsg("✅ Leave applied successfully!");

      setForm({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });
      setErrors({});
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-teal-400">
          Apply Leave
        </h2>

        {msg && (
          <div className="mb-4 p-2 text-center rounded bg-slate-800 text-lime-400 border border-lime-500/30">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Leave Type */}
          <div>
            <label className="block mb-1 text-slate-300 font-medium">Leave Type</label>
            <select
              name="leaveType"
              value={form.leaveType}
              onChange={handleChange}
              className="w-full p-2 rounded bg-slate-800 text-slate-200 border border-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
            >
              <option value="">Select Leave Type</option>
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="annual">Annual Leave</option>
              <option value="emergency">Emergency Leave</option>
            </select>
            {errors.leaveType && <p className="text-red-400 text-sm mt-1">{errors.leaveType}</p>}
          </div>

          {/* Start Date */}
          <div>
            <label className="block mb-1 text-slate-300 font-medium">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              min={today}
              className="w-full p-2 rounded bg-slate-800 text-slate-200 border border-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
            />
            {errors.startDate && <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>}
          </div>

          {/* End Date */}
          <div>
            <label className="block mb-1 text-slate-300 font-medium">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              min={form.startDate || today}
              className="w-full p-2 rounded bg-slate-800 text-slate-200 border border-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
            />
            {errors.endDate && <p className="text-red-400 text-sm mt-1">{errors.endDate}</p>}
          </div>

          {/* Reason */}
          <div>
            <label className="block mb-1 text-slate-300 font-medium">Reason</label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Enter reason for leave"
              className="w-full h-24 p-2 rounded bg-slate-800 text-slate-200 border border-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
            />
            {errors.reason && <p className="text-red-400 text-sm mt-1">{errors.reason}</p>}
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full py-2 rounded-lg font-semibold bg-gradient-to-r from-teal-500 to-lime-500 hover:from-teal-600 hover:to-lime-600 text-slate-950 transition disabled:opacity-60"
          >
            {loading ? "Applying..." : "Apply Leave"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ApplyLeave;
