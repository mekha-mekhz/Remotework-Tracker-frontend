import React, { useState, useEffect } from "react";
import api from "../components/api";

function UserStatusAdmin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/all-status")
      .then(res => setUsers(res.data.users))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6 bg-gray-900 rounded-xl text-white max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-lime-400">All Users Status</h2>
      <table className="w-full border border-gray-700">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-2 border-b border-gray-700">Name</th>
            <th className="p-2 border-b border-gray-700">Email</th>
            <th className="p-2 border-b border-gray-700">Role</th>
            <th className="p-2 border-b border-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} className="hover:bg-gray-700">
              <td className="p-2 border-b border-gray-700">{u.name}</td>
              <td className="p-2 border-b border-gray-700">{u.email}</td>
              <td className="p-2 border-b border-gray-700">{u.role}</td>
              <td className={`p-2 border-b border-gray-700 font-semibold 
                ${u.status === "available" ? "text-green-400" :
                  u.status === "busy" ? "text-red-400" :
                  u.status === "invisible" ? "text-gray-400" :
                  "text-orange-400"}`}>
                {u.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserStatusAdmin;
