// src/pages/TaskManager.jsx
import React, { useEffect, useState } from "react";
import api from "../components/api";

function TaskManager() {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    assignedTo: "",
  });

  // Fetch all tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await api.get("/tasks", { headers });
        setTasks(res.data.tasks || []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (task) => {
    setEditTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      assignedTo: task.assignedTo?._id || "",
    });
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const oldData = editTask;

      const res = await api.put(`/tasks/${editTask._id}`, formData, { headers });

      setTasks((prev) =>
        prev.map((t) => (t._id === editTask._id ? res.data.task : t))
      );

      setHistory((prev) => [
        ...prev,
        {
          id: Date.now(),
          action: "Edited",
          oldData,
          newData: res.data.task,
          time: new Date().toLocaleString(),
        },
      ]);

      alert("Task updated successfully");
      setEditTask(null);
    } catch (err) {
      alert("Failed to update task");
    }
  };

  const handleDeleteTask = async (task) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await api.delete(`/tasks/${task._id}`, { headers });

      setTasks((prev) => prev.filter((t) => t._id !== task._id));

      setHistory((prev) => [
        ...prev,
        {
          id: Date.now(),
          action: "Deleted",
          oldData: task,
          newData: null,
          time: new Date().toLocaleString(),
        },
      ]);

      alert("Task deleted successfully");
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  if (loading) return <p className="text-center mt-10 text-lime-300">Loading tasks...</p>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-teal-900 via-teal-800 to-lime-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-lime-300">📋 Task Manager Dashboard</h1>

      {/* ACTIVE TASKS TABLE */}
      <h2 className="text-xl font-bold mb-3 text-lime-200">Active Tasks</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-teal-800 border rounded-lg border-lime-500 shadow-md">
          <thead>
            <tr className="bg-teal-700 text-lime-200">
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Priority</th>
              <th className="px-4 py-2 border">Assigned To</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="odd:bg-teal-800 even:bg-teal-900">
                <td className="px-4 py-2 border">{task.title}</td>
                <td className="px-4 py-2 border">{task.priority}</td>
                <td className="px-4 py-2 border">{task.assignedTo?.name || "-"}</td>
                <td className="px-4 py-2 border flex gap-2">
                  <button
                    className="bg-lime-500 px-2 py-1 text-black rounded hover:bg-lime-600"
                    onClick={() => handleEditClick(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 px-2 py-1 text-white rounded hover:bg-red-700"
                    onClick={() => handleDeleteTask(task)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT FORM */}
      {editTask && (
        <div className="bg-teal-800 p-6 rounded shadow-md max-w-md mb-10 border border-lime-400">
          <h2 className="text-2xl font-semibold mb-4 text-lime-300">Edit Task</h2>
          <form onSubmit={handleUpdateTask} className="flex flex-col gap-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border px-3 py-2 rounded bg-teal-700 text-white"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border px-3 py-2 rounded bg-teal-700 text-white"
            />
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="border px-3 py-2 rounded bg-teal-700 text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <button
              type="submit"
              className="bg-lime-500 text-black px-4 py-2 rounded hover:bg-lime-600"
            >
              Update Task
            </button>
          </form>
        </div>
      )}

      {/* HISTORY TABLE */}
      <h2 className="text-xl font-bold mb-3 text-lime-200">🕒 Task History (Edited / Deleted)</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-teal-800 border rounded-lg border-lime-500 shadow-md">
          <thead>
            <tr className="bg-teal-700 text-lime-200">
              <th className="px-4 py-2 border">Action</th>
              <th className="px-4 py-2 border">Task</th>
              <th className="px-4 py-2 border">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id} className="odd:bg-teal-800 even:bg-teal-900">
                <td className="px-4 py-2 border">{h.action}</td>
                <td className="px-4 py-2 border">{h.oldData.title}</td>
                <td className="px-4 py-2 border">{h.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskManager;
