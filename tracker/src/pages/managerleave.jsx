import React, { useEffect, useState } from "react";
import api from "../components/api";

function ManagerLeaves() {
  const token = localStorage.getItem("token");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leave/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data.leaves || []);
    } catch {
      console.error("Failed to load leaves");
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveStatus = async (id, status) => {
    try {
      await api.patch(
        `/leave/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeaves((prev) =>
        prev.map((lv) => (lv._id === id ? { ...lv, status } : lv))
      );
    } catch {
      alert("Failed to update leave");
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const getStatusClass = (status) => {
    if (status === "approved") return "bg-green-500 text-white";
    if (status === "rejected") return "bg-red-500 text-white";
    return "bg-yellow-400 text-black";
  };

  return (
    <div className="p-6 bg-slate-950 min-h-screen">
      <h1 className="text-3xl font-bold text-teal-400 mb-6">Leave Requests</h1>

      {loading ? (
        <p className="text-slate-300">Loading leave requests...</p>
      ) : leaves.length === 0 ? (
        <p className="text-slate-400">No leave requests.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-slate-800 text-white rounded-lg shadow-lg">
            <thead>
              <tr className="bg-teal-700 text-white">
                <th className="p-3 text-left rounded-tl-lg">Employee</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Dates</th>
                <th className="p-3 text-left">Reason</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((lv, idx) => (
                <tr
                  key={lv._id}
                  className={idx % 2 === 0 ? "bg-slate-900" : "bg-slate-800"}
                >
                  <td className="p-3">{lv.user?.name}</td>
                  <td className="p-3">{lv.type}</td>
                  <td className="p-3">
                    {lv.fromDate} → {lv.toDate}
                  </td>
                  <td className="p-3">{lv.reason}</td>
                  <td className={`p-2 text-center rounded-full ${getStatusClass(lv.status)}`}>
                    {lv.status.charAt(0).toUpperCase() + lv.status.slice(1)}
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => updateLeaveStatus(lv._id, "approved")}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateLeaveStatus(lv._id, "rejected")}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManagerLeaves;
