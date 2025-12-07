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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Pending User Approvals</h1>

      {pendingUsers.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <div className="space-y-4">
          {pendingUsers.map((user) => (
            <div
              key={user._id}
              className="p-4 bg-gray-100 rounded-xl flex justify-between items-center"
            >
              <div>
                <p><b>Name:</b> {user.name}</p>
                <p><b>Email:</b> {user.email}</p>
                <p><b>Position:</b> {user.position}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => approveUser(user._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectUser(user._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
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
