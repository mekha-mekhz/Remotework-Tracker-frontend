import React, { useEffect, useState } from "react";
import api from "../components/api";

function AllReminders() {
  const token = localStorage.getItem("token");

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const fetchReminders = async () => {
    try {
      const res = await api.get("/reminders/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReminders(res.data.reminders || []);
    } catch (err) {
      setMsg("❌ Failed to load reminders");
    } finally {
      setLoading(false);
    }
  };

  const deleteReminder = async (id) => {
    if (!window.confirm("Delete this reminder?")) return;

    try {
      await api.delete(`/reminders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReminders(reminders.filter(r => r._id !== id));
    } catch (err) {
      alert("❌ Failed to delete reminder");
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const now = new Date();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-lime-400">
        📋 All Reminders
      </h2>

      {loading && (
        <p className="text-center text-slate-400">Loading reminders...</p>
      )}

      {msg && (
        <p className="text-center text-red-400 mb-4">{msg}</p>
      )}

      {!loading && reminders.length === 0 && (
        <p className="text-center text-slate-400">
          No reminders found
        </p>
      )}

      <div className="space-y-4">
        {reminders.map((reminder) => {
          const isExpired = new Date(reminder.remindAt) < now;

          return (
            <div
              key={reminder._id}
              className="flex justify-between items-start
                bg-slate-900 border border-slate-700 rounded-xl p-4"
            >
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {reminder.title}
                </h3>

                <p className="text-slate-300 text-sm mt-1">
                  {reminder.message}
                </p>

                <p className="text-slate-400 text-sm mt-2">
                  ⏰ {new Date(reminder.remindAt).toLocaleString()}
                </p>

                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold
                    ${isExpired
                      ? "bg-red-500/20 text-red-400"
                      : "bg-green-500/20 text-green-400"
                    }`}
                >
                  {isExpired ? "🔴 Expired" : "🟢 Upcoming"}
                </span>
              </div>

              <button
                onClick={() => deleteReminder(reminder._id)}
                className="text-red-400 hover:text-red-500 font-semibold"
              >
                ❌
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AllReminders;
