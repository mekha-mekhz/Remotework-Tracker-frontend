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
    openDisputes: 0,
  });

  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const profileRes = await api.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdminProfile(profileRes.data.user);

        const usersRes = await api.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const users = usersRes.data.users || [];

        const tasksRes = await api.get("/admin/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const disputesRes = await api.get("/disputes/stats/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats({
          totalUsers: users.length,
          pendingApprovals: users.filter(u => !u.approved).length,
          activeTasks: (tasksRes.data.tasks || []).filter(
            t => t.status === "todo" || t.status === "in_progress"
          ).length,
          openDisputes: disputesRes.data?.openDisputes || 0,
        });
      } catch (err) {
        console.error("Admin dashboard error", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-lime-900 p-8 text-white">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-lime-300">Admin Dashboard</h1>
          <p className="text-teal-200">System overview & navigation</p>
        </div>

        {adminProfile && (
          <div className="flex items-center gap-4">
            <img
              src={adminProfile.profilePhoto || "/default.jpg"}
              className="w-14 h-14 rounded-full border-2 border-lime-400"
              alt="Admin"
            />
            <div>
              <p className="font-semibold">{adminProfile.name}</p>
              <p className="text-sm text-teal-200">{adminProfile.role}</p>
            </div>
          </div>
        )}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Pending Approvals" value={stats.pendingApprovals} />
        <StatCard title="Active Tasks" value={stats.activeTasks} />
        <StatCard title="Open Disputes" value={stats.openDisputes} />
      </div>

      {/* NAVIGATION BUTTONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NavButton label="Manage Users" route="/admin/users" />
        <NavButton label="User Activity Status" route="/admin/user-status" />
        <NavButton label="Manage Tasks" route="/admin/tasks" />
        <NavButton label="Reports" route="/admin/reports" />
        <NavButton label="Disputes" route="/admin/disputes" />
        <NavButton label="Approvals" route="/admin/approval" />
      </div>
    </div>
  );
}

/* ===== COMPONENTS ===== */

const StatCard = ({ title, value }) => (
  <div className="bg-gray-800/60 p-6 rounded-xl shadow">
    <p className="text-teal-200 text-sm">{title}</p>
    <h2 className="text-3xl font-bold text-lime-300">{value}</h2>
  </div>
);

const NavButton = ({ label, route }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(route)}
      className="bg-lime-600 hover:bg-lime-700 p-6 rounded-xl text-lg font-semibold shadow transition"
    >
      {label}
    </button>
  );
};

export default AdminDashboard;
