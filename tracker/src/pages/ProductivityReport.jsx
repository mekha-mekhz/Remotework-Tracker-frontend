import React, { useState, useEffect } from "react";
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
import api from "../components/api"; // your axios instance

function ProductivityReport() {
  const [view, setView] = useState("weekly");
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch data from backend
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

      // Ensure both are arrays
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
    return <p className="p-6 text-center">Loading productivity data...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        📊 Productivity Reports
      </h1>

      {/* Switch Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setView("weekly")}
          className={`px-4 py-2 rounded-lg ${
            view === "weekly"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border"
          }`}
        >
          Weekly
        </button>

        <button
          onClick={() => setView("monthly")}
          className={`px-4 py-2 rounded-lg ${
            view === "monthly"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border"
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Weekly Chart */}
      {view === "weekly" && weeklyData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-3">
            Weekly Productivity (Hours)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Monthly Chart */}
      {view === "monthly" && monthlyData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-3">
            Monthly Productivity (Hours)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* No Data Fallback */}
      {(view === "weekly" && weeklyData.length === 0) ||
      (view === "monthly" && monthlyData.length === 0) ? (
        <p className="text-center text-gray-500 mt-6">No data available</p>
      ) : null}
    </div>
  );
}

export default ProductivityReport;
