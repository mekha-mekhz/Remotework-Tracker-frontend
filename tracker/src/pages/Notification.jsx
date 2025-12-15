import React, { useEffect, useState } from "react";
import api from "../components/api";
import { motion } from "framer-motion";
import { Bell, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}`, { read: true });
      fetchNotifications();
    } catch (err) {
      console.error("Error updating notification:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    if (type === "task") return <Bell className="text-teal-400" size={22} />;
    if (type === "deadline") return <Clock className="text-orange-400" size={22} />;
    if (type === "warning") return <AlertTriangle className="text-red-400" size={22} />;
    return <Bell className="text-teal-400" size={22} />;
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold text-teal-400 mb-6">
          Notifications
        </h1>

        {loading ? (
          <p className="text-slate-400">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-slate-400 text-center mt-12">
            No notifications available.
          </p>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border shadow-lg flex gap-4
                  ${
                    n.read
                      ? "bg-slate-900 border-slate-800"
                      : "bg-slate-900 border-teal-500/40"
                  }`}
              >
                <div className="pt-1">{getIcon(n.type)}</div>

                <div className="flex-1">
                  <h3 className="font-semibold text-slate-200">
                    {n.title}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>

                {!n.read && (
                  <button
                    onClick={() => markAsRead(n._id)}
                    className="text-sm font-medium text-lime-400
                      hover:text-lime-300 transition"
                  >
                    Mark as read
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
