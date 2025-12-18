// src/pages/AdminEditDispute.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../components/api";

function AdminEditDispute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [dispute, setDispute] = useState(null);
  const [status, setStatus] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [loading, setLoading] = useState(true);

  // ======================
  // LOAD DISPUTE DETAILS
  // ======================
  useEffect(() => {
    const fetchDispute = async () => {
      try {
        const res = await api.get(`/disputes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDispute(res.data.dispute);
        setStatus(res.data.dispute.status);
        setResolutionNotes(res.data.dispute.resolutionNotes || "");
      } catch (err) {
        alert("❌ Failed to load dispute");
      } finally {
        setLoading(false);
      }
    };

    fetchDispute();
  }, [id, token]);

  // ======================
  // UPDATE DISPUTE
  // ======================
  const updateDispute = async () => {
    if (!status && !resolutionNotes) {
      alert("Nothing to update");
      return;
    }

    try {
      await api.put(
        `/disputes/${id}`,
        { status, resolutionNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Dispute updated & message sent to user");
      navigate("/admin/disputes");
    } catch (err) {
      alert("❌ Failed to update dispute");
    }
  };

  if (loading) {
    return (
      <p className="text-center text-lime-300 p-6">
        Loading dispute details...
      </p>
    );
  }

  if (!dispute) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-teal-900 p-6 text-white">
      <h1 className="text-3xl font-bold text-lime-300 mb-6 text-center">
        Edit Dispute
      </h1>

      <div className="bg-slate-800 p-6 rounded-xl shadow-lg max-w-2xl mx-auto space-y-4">

        {/* TITLE */}
        <div>
          <p className="text-teal-300 font-semibold">Title</p>
          <p>{dispute.title}</p>
        </div>

        {/* DESCRIPTION */}
        <div>
          <p className="text-teal-300 font-semibold">Description</p>
          <p className="text-sm text-gray-200">{dispute.description}</p>
        </div>

        {/* STATUS */}
        <div>
          <label className="block text-teal-300 font-semibold mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 bg-slate-700 rounded border"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* ADMIN MESSAGE */}
        <div>
          <label className="block text-teal-300 font-semibold mb-1">
            Message to User
          </label>
          <textarea
            rows="4"
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            placeholder="Explain the update to the user..."
            className="w-full p-2 bg-slate-700 rounded border"
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={updateDispute}
            className="flex-1 bg-lime-500 text-black font-semibold py-2 rounded hover:bg-lime-600 transition"
          >
            Update & Notify User
          </button>

          <button
            onClick={() => navigate("/admin/disputes")}
            className="flex-1 bg-gray-600 py-2 rounded hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminEditDispute;
