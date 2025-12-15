// src/pages/Approval.jsx
import React, { useEffect, useState } from "react";
import api from "../components/api";

function Approval() {
  const [pendingUsers, setPendingUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/pending-users");
      setPendingUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const approveUser = async (userId) => {
    try {
      await api.put(`/approve/${userId}`);
      alert("User Approved!");
      fetchUsers();
    } catch (err) {
      alert("Error approving user");
    }
  };

  const rejectUser = async (userId) => {
    try {
      await api.delete(`/reject/${userId}`);
      alert("User Rejected & Removed!");
      fetchUsers();
    } catch (err) {
      alert("Error rejecting user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-lime-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-lime-300">Pending User Approvals</h1>

      {pendingUsers.length === 0 ? (
        <p className="text-lime-200">No pending requests</p>
      ) : (
        <div className="space-y-4">
          {pendingUsers.map((user) => (
            <div
              key={user._id}
              className="p-4 bg-teal-800 rounded-xl flex justify-between items-center shadow hover:shadow-lg transition"
            >
              <div>
                <p><b className="text-lime-300">Name:</b> {user.name}</p>
                <p><b className="text-lime-300">Email:</b> {user.email}</p>
                <p><b className="text-lime-300">Position:</b> {user.position || "-"}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => approveUser(user._id)}
                  className="px-4 py-2 bg-lime-500 text-black rounded-lg hover:bg-lime-600 transition font-semibold"
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectUser(user._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Approval;
