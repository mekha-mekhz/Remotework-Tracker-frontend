import React, { useState, useEffect } from "react";
import api from "../components/api";

function TimeTracker() {
  const token = localStorage.getItem("token");
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchToday = async () => {
    setLoading(true);
    try {
      const res = await api.get("/attendance/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const todayStr = new Date().toISOString().split("T")[0];
      const today = res.data.entries.find((e) => e.date === todayStr);
      setTodayAttendance(today || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  const checkIn = async () => {
    try {
      await api.post(
        "/attendance/checkin",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchToday();
    } catch (err) {
      alert(err.response?.data?.message || "Check-in failed");
    }
  };

  const checkOut = async () => {
    try {
      await api.post(
        "/attendance/checkout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchToday();
    } catch (err) {
      alert(err.response?.data?.message || "Check-out failed");
    }
  };

  const lastSession =
    todayAttendance?.sessions?.[todayAttendance.sessions.length - 1];
  const canCheckIn = !lastSession || lastSession.checkOut;
  const canCheckOut = lastSession && !lastSession.checkOut;

  return (
    <div
      className="
        min-h-screen flex items-center justify-center px-4
        bg-gradient-to-br from-gray-900 via-gray-800 to-black
        text-white
      "
    >
      <div
        className="
          w-full max-w-md
          bg-white/10 backdrop-blur-md
          border border-white/20
          rounded-2xl p-6
          shadow-2xl
        "
      >
        {/* Header */}
        <h1
          className="
            text-center text-2xl font-bold mb-6
            bg-gradient-to-r from-lime-300 to-teal-300
            text-transparent bg-clip-text
          "
        >
          ⏱️ Time Tracker
        </h1>

        {loading ? (
          <p className="text-center text-gray-300">Loading...</p>
        ) : (
          <>
            {/* Summary */}
            <div
              className="
                mb-4 p-4 rounded-lg
                bg-black/30 border border-white/20
              "
            >
              <p className="text-sm text-gray-300">
                Total Hours Today
              </p>
              <p className="text-2xl font-bold text-teal-300">
                {todayAttendance?.totalHours || 0}
              </p>
            </div>

            {/* Sessions */}
            <div className="mb-5">
              <h3 className="font-semibold mb-2 text-gray-200">
                Sessions
              </h3>

              {todayAttendance?.sessions?.length ? (
                todayAttendance.sessions.map((s, i) => (
                  <div
                    key={i}
                    className="
                      flex justify-between text-sm
                      bg-black/30 border border-white/10
                      px-3 py-2 rounded mb-2
                    "
                  >
                    <span>
                      {new Date(s.checkIn).toLocaleTimeString()}
                    </span>
                    <span className="text-gray-400">
                      {s.checkOut
                        ? new Date(s.checkOut).toLocaleTimeString()
                        : "In Progress"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">
                  No sessions yet today
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              {canCheckIn && (
                <button
                  onClick={checkIn}
                  className="
                    flex-1 py-2 rounded-lg
                    bg-gradient-to-r from-lime-400 to-teal-400
                    text-black font-semibold
                    hover:opacity-90 transition
                  "
                >
                  ✅ Check In
                </button>
              )}

              {canCheckOut && (
                <button
                  onClick={checkOut}
                  className="
                    flex-1 py-2 rounded-lg
                    bg-gradient-to-r from-teal-400 to-lime-400
                    text-black font-semibold
                    hover:opacity-90 transition
                  "
                >
                  ⏹️ Check Out
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TimeTracker;
