
// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../components/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    activeTasks: 0,
    totalDisputes: 0,
    openDisputes: 0,
    resolvedDisputes: 0,
  });

  const [adminProfile, setAdminProfile] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const profileRes = await api.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdminProfile(profileRes.data.user);

        const usersRes = await api.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const users = usersRes.data.users || [];
        const totalUsers = users.length;
        const pendingApprovals = users.filter(u => !u.approved).length;

        const tasksRes = await api.get("/admin/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tasks = tasksRes.data.tasks || [];
        const activeTasks = tasks.filter(t => t.status === "todo" || t.status === "in_progress").length;

        const disputesRes = await api.get("/admin/disputes/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { totalDisputes, openDisputes, resolvedDisputes } = disputesRes.data || {};

        setStats({
          totalUsers,
          pendingApprovals,
          activeTasks,
          totalDisputes: totalDisputes || 0,
          openDisputes: openDisputes || 0,
          resolvedDisputes: resolvedDisputes || 0,
        });
      } catch (err) {
        console.error("Error fetching admin dashboard data:", err);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-lime-900 p-8 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-lime-300">Admin Dashboard</h1>
          <p className="text-teal-200 mt-1">Overview & management</p>
        </div>
        {adminProfile && (
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <img
              src={adminProfile.profilePhoto || "/default.jpg"}
              alt="Admin"
              className="w-14 h-14 rounded-full border-2 border-lime-400 object-cover"
            />
            <div>
              <p className="font-semibold text-lime-300">{adminProfile.name}</p>
              <p className="text-teal-200 text-sm">{adminProfile.role}</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
     

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-6">
        {[
          { label: "Manage Users", route: "/admin/users", color: "bg-lime-600 hover:bg-lime-700" },
          { label: "Manage Tasks", route: "/admin/tasks", color: "bg-teal-600 hover:bg-teal-700" },
          { label: "View Reports", route: "/admin/reports", color: "bg-lime-500 hover:bg-lime-600" },
          { label: "Disputes", route: "/admin/disputes", color: "bg-teal-400 text-black hover:bg-teal-500" },
          { label: "Role & Permissions", route: "/admin/roles", color: "bg-lime-700 hover:bg-lime-800" },
          { label: "Registration Approval", route: "/admin/approval", color: "bg-teal-700 hover:bg-teal-800" },
        ].map((btn, idx) => (
          <button
            key={idx}
            onClick={() => navigate(btn.route)}
            className={`${btn.color} px-6 py-4 rounded-xl shadow-lg transition font-semibold`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;

