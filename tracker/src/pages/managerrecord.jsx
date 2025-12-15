// src/pages/ManagerRecords.jsx
import React, { useState } from "react";

function ManagerRecords() {
  // Temporary local records
  const [records, setRecords] = useState([
    { id: 1, action: "Added", title: "Task A", time: "2025-12-03 10:30" },
    { id: 2, action: "Deleted", title: "Task B", time: "2025-12-02 15:00" },
  ]);

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-teal-400">Action Records</h1>

      {records.length === 0 ? (
        <p className="text-slate-400">No records available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-slate-800 rounded-lg shadow-md">
            <thead>
              <tr className="bg-slate-700 text-teal-300">
                <th className="border p-2 text-left">Action</th>
                <th className="border p-2 text-left">Task Title</th>
                <th className="border p-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, idx) => (
                <tr
                  key={r.id}
                  className={idx % 2 === 0 ? "bg-slate-800" : "bg-slate-700"}
                >
                  <td className="border p-2">{r.action}</td>
                  <td className="border p-2">{r.title}</td>
                  <td className="border p-2">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManagerRecords;
