// src/pages/MyDisputes.jsx
import React, { useEffect, useState } from "react";
import api from "../components/api";
import { useAuth } from "../context/Authcontext";

function MyDisputes() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================
  // FETCH MY DISPUTES
  // ======================
  const fetchMyDisputes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/disputes/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ FIX: backend returns ARRAY, not { disputes: [] }
      setDisputes(res.data);
    } catch (err) {
      console.error("Failed to load disputes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDisputes();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-lime-300">
        Loading your disputes...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-teal-900 to-lime-900 text-white">
      <h1 className="text-3xl font-bold text-lime-300 mb-6">
        My Disputes
      </h1>

      {disputes.length === 0 && (
        <p className="text-teal-200">
          You have not raised any disputes.
        </p>
      )}

      <div className="grid gap-6">
        {disputes.map((d) => (
          <div
            key={d._id}
            className="bg-gray-800/60 border border-white/20 rounded-xl p-5 shadow-lg"
          >
            {/* ===== Title ===== */}
            <h2 className="text-xl font-semibold text-lime-300">
              {d.title}
            </h2>

            {/* ===== Description ===== */}
            <p className="text-teal-100 mt-2">
              {d.description}
            </p>

            {/* ===== Meta Info ===== */}
            <div className="grid md:grid-cols-3 gap-4 mt-4 text-sm">
              <div>
                <span className="text-teal-300">Priority:</span>{" "}
                <span className="capitalize">{d.priority}</span>
              </div>

              <div>
                <span className="text-teal-300">Status:</span>{" "}
                <span className={`font-semibold ${statusColor(d.status)}`}>
                  {d.status.replace("_", " ")}
                </span>
              </div>

              <div>
                <span className="text-teal-300">Assigned To:</span>{" "}
                {d.assignedTo ? d.assignedTo : "Not assigned"}
              </div>
            </div>

            {/* ===== Admin Message ===== */}
            <div className="mt-4 bg-black/30 p-4 rounded-lg border border-white/10">
              <p className="text-teal-300 text-sm mb-1">
                Admin Message
              </p>
              <p className="text-white">
                {d.resolutionNotes
                  ? d.resolutionNotes
                  : "No response from admin yet"}
              </p>
            </div>

            {/* ===== Date ===== */}
            <p className="text-xs text-gray-400 mt-3">
              Created on {new Date(d.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======================
   STATUS COLOR HELPER
====================== */
const statusColor = (status) => {
  switch (status) {
    case "open":
      return "text-red-400";
    case "in_progress":
      return "text-yellow-400";
    case "resolved":
      return "text-green-400";
    default:
      return "text-gray-300";
  }
};

export default MyDisputes;
