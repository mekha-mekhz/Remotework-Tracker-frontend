// src/pages/AdminDisputes.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../components/api";

function AdminDisputes() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================
  // LOAD DISPUTES
  // ======================
  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/disputes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDisputes(res.data.disputes || []);
    } catch (err) {
      console.error("❌ Failed to fetch disputes", err);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // DELETE DISPUTE
  // ======================
  const deleteDispute = async (id) => {
    if (!window.confirm("Delete this dispute permanently?")) return;

    try {
      await api.delete(`/disputes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Dispute deleted");
      fetchDisputes();
    } catch (err) {
      alert("❌ Failed to delete dispute");
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-lime-300">
        Loading disputes...
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-lime-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-lime-300">
        Manage Disputes
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-teal-800 shadow-lg rounded-xl overflow-hidden">
          <thead className="bg-teal-700 text-lime-200">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Reported By</th>
              <th className="p-3 text-left">Assigned To</th>
              <th className="p-3 text-left">Priority</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Admin Msg</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {disputes.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-lime-200">
                  No disputes found
                </td>
              </tr>
            )}

            {disputes.map((d) => (
              <tr
                key={d._id}
                className="border-b border-teal-600 hover:bg-teal-700 transition"
              >
                <td className="p-3 font-medium">{d.title}</td>

                <td className="p-3">
                  {d.reportedBy
                    ? `${d.reportedBy.name}`
                    : "Unknown"}
                </td>

                <td className="p-3">
                  {d.assignedTo ? d.assignedTo.name : "—"}
                </td>

                <td className="p-3 capitalize">{d.priority}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      d.status === "open"
                        ? "bg-red-600"
                        : d.status === "in_progress"
                        ? "bg-yellow-500 text-black"
                        : d.status === "resolved"
                        ? "bg-lime-500 text-black"
                        : "bg-gray-500"
                    }`}
                  >
                    {d.status.replace("_", " ")}
                  </span>
                </td>

                {/* ADMIN MESSAGE INDICATOR */}
                <td className="p-3">
                  {d.adminMessage ? (
                    <span className="text-lime-400 font-semibold">
                      Sent
                    </span>
                  ) : (
                    <span className="text-gray-400">
                      Not sent
                    </span>
                  )}
                </td>

                <td className="p-3 flex gap-2">
                  {/* EDIT */}
                  <button
                    onClick={() =>
                      navigate(`/admin/disputes/edit/${d._id}`)
                    }
                    className="px-3 py-1 bg-lime-500 text-black rounded hover:bg-lime-600 font-semibold"
                  >
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => deleteDispute(d._id)}
                    className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDisputes;
