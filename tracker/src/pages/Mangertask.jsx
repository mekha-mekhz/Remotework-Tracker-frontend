import React, { useEffect, useState } from "react";
import api from "../components/api";
import { useAuth } from "../context/Authcontext";

function ManagerTaskList() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.tasks || []);
    } catch {
      console.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="p-6 bg-slate-950 min-h-screen">
      <h1 className="text-3xl font-bold text-teal-400 mb-6">Task List</h1>

      {loading ? (
        <p className="text-slate-300">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-slate-400">No tasks assigned.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-slate-800 text-white rounded-lg shadow-lg">
            <thead>
              <tr className="bg-teal-700 text-white">
                <th className="p-3 text-left rounded-tl-lg">Title</th>
                <th className="p-3 text-left">Assigned To</th>
                <th className="p-3 text-left">Priority</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t, idx) => (
                <tr
                  key={t._id}
                  className={idx % 2 === 0 ? "bg-slate-900" : "bg-slate-800"}
                >
                  <td className="p-3">{t.title}</td>
                  <td className="p-3">{t.assignedTo?.name || "Unassigned"}</td>
                  <td className={`p-3 font-semibold ${t.priority === "high" ? "text-red-400" : t.priority === "medium" ? "text-lime-400" : "text-teal-400"}`}>
                    {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
                  </td>
                  <td className={`p-3 font-medium ${t.status === "completed" ? "text-green-400" : t.status === "in-progress" ? "text-teal-300" : "text-yellow-400"}`}>
                    {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => deleteTask(t._id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManagerTaskList;
