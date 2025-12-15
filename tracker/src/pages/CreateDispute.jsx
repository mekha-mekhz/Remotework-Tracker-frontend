// src/pages/CreateDispute.jsx
import React, { useState } from "react";
import api from "../components/api";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";

function CreateDispute() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/disputes/create", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Dispute reported successfully");
      navigate("/premium-users");
    } catch (err) {
      console.error(err);
      alert("Failed to report dispute");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 via-teal-800 to-lime-900 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-teal-800 text-white rounded-2xl shadow-xl p-6 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-lime-300 text-center">
          Report a Dispute
        </h2>

        <input
          name="title"
          placeholder="Dispute Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 rounded bg-teal-900 border border-teal-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          rows="4"
          className="w-full p-3 mb-4 rounded bg-teal-900 border border-teal-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
        />

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="w-full p-3 mb-6 rounded bg-teal-900 border border-teal-700 focus:outline-none focus:ring-2 focus:ring-lime-400"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button
          type="submit"
          className="w-full px-4 py-3 bg-lime-500 text-black font-semibold rounded-lg hover:bg-lime-600 transition"
        >
          Submit Dispute
        </button>
      </form>
    </div>
  );
}

export default CreateDispute;
