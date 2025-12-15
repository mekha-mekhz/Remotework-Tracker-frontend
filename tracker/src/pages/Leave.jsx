import React, { useState, useEffect } from "react";
import api from "../components/api";
import { useNavigate } from "react-router-dom";

function Leave() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [myLeaves, setMyLeaves] = useState([]);

  const loadLeaves = async () => {
    try {
      const res = await api.get("/leave/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyLeaves(res.data.leaves || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  return (
    <div
      className="
        min-h-screen p-6
        bg-gradient-to-br from-gray-900 via-gray-800 to-black
        text-white
      "
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <h1
          className="
            text-3xl font-bold
            bg-gradient-to-r from-lime-300 to-teal-300
            text-transparent bg-clip-text
          "
        >
          My Leaves
        </h1>

        <button
          onClick={() => navigate("/apply-leave")}
          className="
            px-5 py-2 rounded-lg font-semibold
            bg-gradient-to-r from-lime-400 to-teal-400
            text-black shadow-lg hover:opacity-90 transition
          "
        >
          + Apply Leave
        </button>
      </div>

      {/* Content Card */}
      <div
        className="
          bg-white/10 backdrop-blur-md
          border border-white/20
          rounded-2xl shadow-2xl
          p-6
        "
      >
        {myLeaves.length === 0 ? (
          <p className="text-gray-300 text-center">
            No leave records yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-300 border-b border-white/20">
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Start Date</th>
                  <th className="px-4 py-3">End Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {myLeaves.map((x) => (
                  <tr key={x._id} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3">{x.leaveType}</td>
                    <td className="px-4 py-3">
                      {new Date(x.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(x.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`
                          px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            x.status === "Approved"
                              ? "bg-lime-400 text-black"
                              : x.status === "Rejected"
                              ? "bg-red-500 text-white"
                              : "bg-teal-400 text-black"
                          }
                        `}
                      >
                        {x.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leave;
