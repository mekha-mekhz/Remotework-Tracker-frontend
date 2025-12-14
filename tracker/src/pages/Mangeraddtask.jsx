// // src/pages/ManagerAddTask.jsx
// import React, { useState, useEffect } from "react";
// import api from "../components/api";

// function ManagerAddTask() {
//   const token = localStorage.getItem("token");

//   const [users, setUsers] = useState([]);
//   const [loadingUsers, setLoadingUsers] = useState(true);

//   const [newTask, setNewTask] = useState({
//     title: "",
//     description: "",
//     priority: "medium",
//     assignedTo: [], // array of user IDs
//   });

//   // Fetch all normal users
//   const loadUsers = async () => {
//     try {
//       const res = await api.get("/user/all", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(res.data.users || []);
//     } catch (err) {
//       console.error("Failed to load users", err);
//     } finally {
//       setLoadingUsers(false);
//     }
//   };

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const handleChange = (e) => {
//     setNewTask({ ...newTask, [e.target.name]: e.target.value });
//   };

//   // Toggle user selection in assignedTo array
//   const toggleAssignUser = (userId) => {
//     setNewTask((prev) => ({
//       ...prev,
//       assignedTo: prev.assignedTo.includes(userId)
//         ? prev.assignedTo.filter((id) => id !== userId)
//         : [...prev.assignedTo, userId],
//     }));
//   };

//   const handleAddTask = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/tasks", newTask, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert("Task added successfully");
//       setNewTask({ title: "", description: "", priority: "medium", assignedTo: [] });
//     } catch {
//       alert("Failed to add task");
//     }
//   };

//   return (
//     <div className="p-6 bg-gradient-to-br from-lime-50 to-teal-50 min-h-screen">
//       <h1 className="text-3xl font-bold text-teal-700 mb-6">Add New Task</h1>

//       <form
//         className="bg-white p-6 rounded-xl shadow-md max-w-xl border border-teal-200"
//         onSubmit={handleAddTask}
//       >
//         {/* Task Title */}
//         <label className="font-semibold text-teal-700">Task Title</label>
//         <input
//           type="text"
//           name="title"
//           placeholder="Enter task title..."
//           value={newTask.title}
//           onChange={handleChange}
//           required
//           className="w-full p-3 mb-4 border rounded-lg focus:outline-teal-500"
//         />

//         {/* Description */}
//         <label className="font-semibold text-teal-700">Description</label>
//         <textarea
//           name="description"
//           placeholder="Task description..."
//           value={newTask.description}
//           onChange={handleChange}
//           rows={3}
//           className="w-full p-3 mb-4 border rounded-lg focus:outline-teal-500"
//         />

//         {/* Priority */}
//         <label className="font-semibold text-teal-700">Priority</label>
//         <select
//           name="priority"
//           value={newTask.priority}
//           onChange={handleChange}
//           className="w-full p-3 mb-4 border rounded-lg focus:outline-teal-500"
//         >
//           <option value="low">Low</option>
//           <option value="medium">Medium</option>
//           <option value="high">High</option>
//         </select>

//         {/* Assign Users */}
//         <label className="font-semibold text-teal-700">Assign To</label>
//         <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 max-h-60 overflow-y-auto mb-5">
//           {loadingUsers ? (
//             <p className="text-gray-600">Loading users...</p>
//           ) : users.length === 0 ? (
//             <p className="text-gray-600">No users found.</p>
//           ) : (
//             users.map((u) => (
//               <label
//                 key={u._id}
//                 className="flex items-center gap-3 p-2 rounded-lg hover:bg-teal-100 cursor-pointer"
//               >
//                 <input
//                   type="checkbox"
//                   checked={newTask.assignedTo.includes(u._id)}
//                   onChange={() => toggleAssignUser(u._id)}
//                   className="w-4 h-4 text-teal-600 focus:ring-teal-500"
//                 />
//                 <img
//                   src={u.profilePhoto || "/default.jpg"}
//                   alt={u.name}
//                   className="w-8 h-8 rounded-full object-cover"
//                 />
//                 <div>
//                   <p className="font-medium text-teal-800">{u.name}</p>
//                   <p className="text-sm text-gray-600">{u.email}</p>
//                 </div>
//               </label>
//             ))
//           )}
//         </div>

//         <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition">
//           Add Task
//         </button>
//       </form>
//     </div>
//   );
// }

// export default ManagerAddTask;
// src/pages/ManagerAddTask.jsx
import React, { useState, useEffect } from "react";
import api from "../components/api";

function ManagerAddTask() {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignedTo: [], // array of user IDs
  });

  // Fetch all normal users
  const loadUsers = async () => {
    try {
      const res = await api.get("/user/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  // Toggle user selection in assignedTo array
  const toggleAssignUser = (userId) => {
    setNewTask((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(userId)
        ? prev.assignedTo.filter((id) => id !== userId)
        : [...prev.assignedTo, userId],
    }));
  };

  // ==========================
  // ADD TASK + SEND NOTIFICATION
  // ==========================
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      // 1️⃣ Create Task
      await api.post("/tasks", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 2️⃣ Send notification to each assigned user
      for (const userId of newTask.assignedTo) {
        await api.post(
          "/notifications/create",
          {
            title: "New Task Assigned",
            message: `You have been assigned a new task: ${newTask.title}`,
            type: "task",
            userId,
            role: "user",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      alert("Task added successfully and notification sent!");

      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        assignedTo: [],
      });

    } catch {
      alert("Failed to add task");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-lime-50 to-teal-50 min-h-screen">
      <h1 className="text-3xl font-bold text-teal-700 mb-6">Add New Task</h1>

      <form
        className="bg-white p-6 rounded-xl shadow-md max-w-xl border border-teal-200"
        onSubmit={handleAddTask}
      >
        {/* Task Title */}
        <label className="font-semibold text-teal-700">Task Title</label>
        <input
          type="text"
          name="title"
          placeholder="Enter task title..."
          value={newTask.title}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border rounded-lg focus:outline-teal-500"
        />

        {/* Description */}
        <label className="font-semibold text-teal-700">Description</label>
        <textarea
          name="description"
          placeholder="Task description..."
          value={newTask.description}
          onChange={handleChange}
          rows={3}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-teal-500"
        />

        {/* Priority */}
        <label className="font-semibold text-teal-700">Priority</label>
        <select
          name="priority"
          value={newTask.priority}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-teal-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* Assign Users */}
        <label className="font-semibold text-teal-700">Assign To</label>
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 max-h-60 overflow-y-auto mb-5">
          {loadingUsers ? (
            <p className="text-gray-600">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-gray-600">No users found.</p>
          ) : (
            users.map((u) => (
              <label
                key={u._id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-teal-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={newTask.assignedTo.includes(u._id)}
                  onChange={() => toggleAssignUser(u._id)}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                />
                <img
                  src={u.profilePhoto || "/default.jpg"}
                  alt={u.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-teal-800">{u.name}</p>
                  <p className="text-sm text-gray-600">{u.email}</p>
                </div>
              </label>
            ))
          )}
        </div>

        <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition">
          Add Task
        </button>
      </form>
    </div>
  );
}

export default ManagerAddTask;
