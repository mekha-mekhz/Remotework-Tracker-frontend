// src/pages/AdminReports.jsx
import React, { useEffect, useState } from "react";
import api from "../components/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

function AdminReports() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTasks: 0,
    completedTasks: 0,
    pendingDisputes: 0,
    resolvedDisputes: 0,
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);

        const usersRes = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const totalUsers = usersRes.data.length;

        const tasksRes = await api.get("/tasks", { headers: { Authorization: `Bearer ${token}` } });
        const activeTasks = tasksRes.data.tasks.filter(t => t.status !== "done").length;
        const completedTasks = tasksRes.data.tasks.filter(t => t.status === "done").length;

        const disputesRes = await api.get("/disputes/stats/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pendingDisputes = disputesRes.data.openDisputes;
        const resolvedDisputes = disputesRes.data.resolvedDisputes;

        setStats({
          totalUsers,
          activeTasks,
          completedTasks,
          pendingDisputes,
          resolvedDisputes,
        });
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  if (loading)
    return <p className="text-lime-300 p-6 text-center">Loading reports...</p>;

  const taskData = [
    { name: "Active Tasks", count: stats.activeTasks },
    { name: "Completed Tasks", count: stats.completedTasks },
  ];

  const disputeData = [
    { name: "Pending Disputes", value: stats.pendingDisputes },
    { name: "Resolved Disputes", value: stats.resolvedDisputes },
  ];

  const COLORS = ["#A3E635", "#14B8A6"]; // Lime + Teal

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-lime-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-lime-300">Admin Reports</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {[
          { label: "Total Users", value: stats.totalUsers },
          { label: "Active Tasks", value: stats.activeTasks },
          { label: "Completed Tasks", value: stats.completedTasks },
          { label: "Pending Disputes", value: stats.pendingDisputes },
          { label: "Resolved Disputes", value: stats.resolvedDisputes },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-teal-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition"
          >
            <p className="text-lime-200">{card.label}</p>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Tasks Bar Chart */}
        <div className="bg-teal-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-lime-200">Tasks Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={taskData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#A3E635" />
              <YAxis stroke="#A3E635" />
              <Tooltip />
              <Bar dataKey="count" fill="#14B8A6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Disputes Pie Chart */}
        <div className="bg-teal-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-lime-200">Disputes Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={disputeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#14B8A6"
                label
              >
                {disputeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-teal-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-lime-200">Detailed Reports</h2>
        <table className="min-w-full border-collapse border border-lime-400">
          <thead>
            <tr className="bg-teal-700 text-lime-200">
              <th className="border p-2 text-left">Report Type</th>
              <th className="border p-2 text-left">Count</th>
            </tr>
          </thead>
          <tbody>
            {[
              { type: "Total Users", count: stats.totalUsers },
              { type: "Active Tasks", count: stats.activeTasks },
              { type: "Completed Tasks", count: stats.completedTasks },
              { type: "Pending Disputes", count: stats.pendingDisputes },
              { type: "Resolved Disputes", count: stats.resolvedDisputes },
            ].map((row, idx) => (
              <tr key={idx} className="odd:bg-teal-800 even:bg-teal-900">
                <td className="border p-2">{row.type}</td>
                <td className="border p-2">{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminReports;
