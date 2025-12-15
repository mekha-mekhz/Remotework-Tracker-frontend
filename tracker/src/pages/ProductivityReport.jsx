import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import api from "../components/api";

function ProductivityReport() {
  const [view, setView] = useState("weekly");
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [weeklyRes, monthlyRes] = await Promise.all([
        api.get("/productivitys/weekly", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/productivitys/monthly", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setWeeklyData(Array.isArray(weeklyRes.data) ? weeklyRes.data : []);
      setMonthlyData(Array.isArray(monthlyRes.data) ? monthlyRes.data : []);
    } catch (err) {
      console.error("Failed to fetch productivity data:", err);
      setWeeklyData([]);
      setMonthlyData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <p className="p-6 text-center text-slate-400">Loading productivity data...</p>;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 font-sans">
      <h1 className="text-3xl font-bold text-teal-400 mb-4">
        📊 Productivity Reports
      </h1>

      {/* Switch Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setView("weekly")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            view === "weekly"
              ? "bg-teal-500 text-slate-950"
              : "bg-slate-900 text-slate-300 border border-slate-700 hover:border-teal-400"
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setView("monthly")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            view === "monthly"
              ? "bg-teal-500 text-slate-950"
              : "bg-slate-900 text-slate-300 border border-slate-700 hover:border-teal-400"
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Weekly Chart */}
      {view === "weekly" && weeklyData.length > 0 && (
        <div className="bg-slate-900 p-6 rounded-xl shadow-lg mb-6">
          <h3 className="text-xl font-semibold text-slate-200 mb-3">
            Weekly Productivity (Hours)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <XAxis dataKey="day" stroke="#94f6a7" />
              <YAxis stroke="#94f6a7" />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderRadius: 8, border: "none", color: "#f0fdf4" }} />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ stroke: "#3b82f6", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Monthly Chart */}
      {view === "monthly" && monthlyData.length > 0 && (
        <div className="bg-slate-900 p-6 rounded-xl shadow-lg mb-6">
          <h3 className="text-xl font-semibold text-slate-200 mb-3">
            Monthly Productivity (Hours)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="week" stroke="#94f6a7" />
              <YAxis stroke="#94f6a7" />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderRadius: 8, border: "none", color: "#f0fdf4" }} />
              <Bar dataKey="hours" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* No Data Fallback */}
      {(view === "weekly" && weeklyData.length === 0) ||
      (view === "monthly" && monthlyData.length === 0) ? (
        <p className="text-center text-slate-400 mt-6">No data available</p>
      ) : null}
    </div>
  );
}

export default ProductivityReport;
