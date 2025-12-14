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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Leaves</h1>
        <button
          onClick={() => navigate("/apply-leave")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Apply Leave
        </button>
      </div>

      {myLeaves.length === 0 ? (
        <p className="text-gray-600 mt-2">No leave records yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border divide-y divide-gray-200 bg-white rounded-lg shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Start Date</th>
                <th className="px-4 py-2 text-left">End Date</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {myLeaves.map((x) => (
                <tr key={x._id}>
                  <td className="px-4 py-2">{x.leaveType}</td>
                  <td className="px-4 py-2">{new Date(x.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{new Date(x.endDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{x.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leave;
