import React, { useState } from "react";
import api from "../components/api";
import { useNavigate } from "react-router-dom";

function CreateReminder() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    message: "",
    remindAt: "",
    type: "custom",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const minDateTime = new Date().toISOString().slice(0, 16);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.message || !form.remindAt) {
      setMsg("⚠️ All fields are required");
      return;
    }

    if (new Date(form.remindAt) <= new Date()) {
      setMsg("⚠️ Reminder must be set in the future");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      await api.post("/reminders", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMsg("⏰ Reminder set successfully!");

      setForm({
        title: "",
        message: "",
        remindAt: "",
        type: "custom",
      });

      // OPTIONAL: auto navigate after 1.5 sec
      setTimeout(() => navigate("/all-reminders"), 1500);

    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Failed to create reminder"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      
      {/* 🔗 View All Reminders Button */}
      <button
        onClick={() => navigate("/all-reminders")}
        className="w-full py-2 rounded-lg font-semibold
          bg-slate-800 text-lime-400 border border-lime-400/40
          hover:bg-slate-700 transition"
      >
        📋 View All Reminders
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-lime-400">
          Set Reminder
        </h2>

        {msg && (
          <div className="text-center p-2 rounded bg-slate-800 text-lime-300 border border-lime-400/30">
            {msg}
          </div>
        )}

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Reminder Title"
          className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700"
        />

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Reminder Message"
          rows="3"
          className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700"
        />

        <input
          type="datetime-local"
          name="remindAt"
          value={form.remindAt}
          min={minDateTime}
          onChange={handleChange}
          className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700"
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700"
        >
          <option value="custom">Custom</option>
          <option value="task">Task</option>
          <option value="leave">Leave</option>
          <option value="dispute">Dispute</option>
        </select>

        <button
          disabled={loading}
          className="w-full py-2 rounded-lg font-semibold
            bg-gradient-to-r from-lime-500 to-teal-500
            text-black hover:from-lime-600 hover:to-teal-600
            disabled:opacity-60"
        >
          {loading ? "Setting..." : "Set Reminder"}
        </button>
      </form>
    </div>
  );
}

export default CreateReminder;
