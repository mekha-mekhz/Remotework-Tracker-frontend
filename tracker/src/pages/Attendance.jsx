// src/pages/Attendance.jsx
import React, { useState, useEffect } from "react";
import api from "../components/api";
import { useAuth } from "../context/Authcontext";

function Attendance() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [todayAttendance, setTodayAttendance] = useState(null);
  const [allAttendance, setAllAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await api.get("/attendance/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const entries = res.data.entries || [];
      const todayStr = new Date().toISOString().split("T")[0];

      const today = entries.find(
        (e) => new Date(e.date).toISOString().split("T")[0] === todayStr
      );

      setTodayAttendance(today || null);
      setAllAttendance(entries);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    const interval = setInterval(fetchAttendance, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkIn = async () => {
    try {
      await api.post("/attendance/checkin", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAttendance();
    } catch (err) {
      alert(err.response?.data?.message || "Check-in failed");
    }
  };

  const checkOut = async () => {
    try {
      await api.post("/attendance/checkout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAttendance();
    } catch (err) {
      alert(err.response?.data?.message || "Check-out failed");
    }
  };

  const formatTime = (date) =>
    date ? new Date(date).toLocaleTimeString() : "-";

  const todayTotalHours =
    todayAttendance?.sessions?.reduce(
      (sum, s) =>
        sum +
        (s.checkOut
          ? (new Date(s.checkOut) - new Date(s.checkIn)) / 3600000
          : 0),
      0
    ) || 0;

  const getTodayStatus = () => {
    if (!todayAttendance) return "Absent";
    return todayTotalHours >= 1 ? "Present" : "Absent";
  };

  const lastSession = todayAttendance?.sessions?.slice(-1)[0];

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <h1 className="text-3xl font-bold text-teal-400 mb-6">
        Attendance
      </h1>

      {/* ===== TODAY ATTENDANCE ===== */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-200 mb-4">
          Today's Attendance
        </h2>

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : (
          <>
            <div className="flex flex-col gap-2 text-slate-300">
              <p>
                Total Hours:{" "}
                <span className="text-lime-400 font-semibold">
                  {todayTotalHours.toFixed(2)}
                </span>
              </p>

              <p>
                Status:{" "}
                <span
                  className={
                    getTodayStatus() === "Present"
                      ? "text-lime-400 font-semibold"
                      : "text-red-400 font-semibold"
                  }
                >
                  {getTodayStatus()}
                </span>
              </p>
            </div>

            <div className="mt-4 flex gap-4">
              {(!lastSession || lastSession.checkOut) && (
                <button
                  onClick={checkIn}
                  className="px-4 py-2 rounded-lg font-semibold
                    bg-teal-500 hover:bg-teal-600
                    text-slate-950 transition"
                >
                  Check In
                </button>
              )}

              {lastSession && !lastSession.checkOut && (
                <button
                  onClick={checkOut}
                  className="px-4 py-2 rounded-lg font-semibold
                    bg-red-500 hover:bg-red-600
                    text-slate-950 transition"
                >
                  Check Out
                </button>
              )}
            </div>

            {todayAttendance?.sessions?.length > 0 && (
              <div className="mt-5">
                <h3 className="text-slate-300 font-semibold mb-2">
                  Today's Sessions
                </h3>

                <div className="space-y-2">
                  {todayAttendance.sessions.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between
                        bg-slate-800 p-2 rounded text-slate-300"
                    >
                      <span>In: {formatTime(s.checkIn)}</span>
                      <span>
                        Out:{" "}
                        {s.checkOut
                          ? formatTime(s.checkOut)
                          : "In Progress"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ===== ALL ATTENDANCE ===== */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-slate-200 mb-4">
          All Attendance
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-slate-300">
            <thead>
              <tr className="bg-slate-800 text-slate-200">
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Check-in</th>
                <th className="px-3 py-2">Check-out</th>
                <th className="px-3 py-2">Hours</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {allAttendance.map((entry) => {
                const entryTotalHours =
                  entry.sessions?.reduce(
                    (sum, s) =>
                      sum +
                      (s.checkOut
                        ? (new Date(s.checkOut) -
                            new Date(s.checkIn)) /
                          3600000
                        : 0),
                    0
                  ) || 0;

                return (
                  <tr
                    key={entry._id}
                    className="border-b border-slate-800
                      hover:bg-slate-800/60 transition"
                  >
                    <td className="px-3 py-2">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>

                    <td className="px-3 py-2">
                      {entry.sessions?.map((s, i) => (
                        <div key={i}>{formatTime(s.checkIn)}</div>
                      ))}
                    </td>

                    <td className="px-3 py-2">
                      {entry.sessions?.map((s, i) => (
                        <div key={i}>
                          {s.checkOut
                            ? formatTime(s.checkOut)
                            : "In Progress"}
                        </div>
                      ))}
                    </td>

                    <td className="px-3 py-2 text-lime-400 font-semibold">
                      {entryTotalHours.toFixed(2)}
                    </td>

                    <td
                      className={`px-3 py-2 font-semibold ${
                        entryTotalHours >= 1
                          ? "text-lime-400"
                          : "text-red-400"
                      }`}
                    >
                      {entryTotalHours >= 1 ? "Present" : "Absent"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
