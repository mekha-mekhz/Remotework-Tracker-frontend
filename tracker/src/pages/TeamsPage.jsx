// import React, { useState, useEffect } from "react";
// import api from "../components/api";

// function TeamsPage() {
//   const [teams, setTeams] = useState([]);
//   const [teamName, setTeamName] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const token = localStorage.getItem("token");

//   const loadTeams = async () => {
//     const res = await api.get("/teams", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setTeams(res.data.teams || []);
//   };

//   const createTeam = async (e) => {
//     e.preventDefault();
//     if (!teamName.trim()) return alert("Enter team name");

//     await api.post(
//       "/teams/create",
//       { name: teamName },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     setTeamName("");
//     setShowForm(false);
//     loadTeams();
//   };

//   useEffect(() => {
//     loadTeams();
//   }, []);

//   return (
//     <div className="p-6 min-h-screen bg-gray-50">

//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold">Teams Manager</h2>

//         {/* Add Team Button */}
//         <button
//           onClick={() => setShowForm(!showForm)}
//           className="px-5 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700"
//         >
//           {showForm ? "Close" : "+ Add Team"}
//         </button>
//       </div>

//       {/* ADD TEAM FORM (toggles) */}
//       {showForm && (
//         <form
//           onSubmit={createTeam}
//           className="bg-white p-5 rounded-xl shadow mb-6 border"
//         >
//           <label className="block font-semibold mb-1">Team Name</label>
//           <input
//             value={teamName}
//             onChange={(e) => setTeamName(e.target.value)}
//             className="w-full p-3 border rounded-lg mb-4"
//             placeholder="Enter team name..."
//           />

//           <button
//             type="submit"
//             className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
//           >
//             Create Team
//           </button>
//         </form>
//       )}

//       {/* TEAM RECORDS TABLE */}
//       <div className="bg-white shadow rounded-xl overflow-x-auto">
//         <table className="w-full text-left">
//           <thead className="bg-teal-600 text-white">
//             <tr>
//               <th className="p-3">Team Name</th>
//               <th className="p-3">Members</th>
//               <th className="p-3">Created On</th>
//             </tr>
//           </thead>

//           <tbody>
//             {teams.length === 0 ? (
//               <tr>
//                 <td colSpan="3" className="p-4 text-center text-gray-500">
//                   No teams found
//                 </td>
//               </tr>
//             ) : (
//               teams.map((t) => (
//                 <tr
//                   key={t._id}
//                   className="border-b hover:bg-gray-50 transition"
//                 >
//                   <td className="p-3 font-medium">{t.name}</td>
//                   <td className="p-3">{t.members?.length || 0}</td>
//                   <td className="p-3">
//                     {new Date(t.createdAt).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//     </div>
//   );
// }

// export default TeamsPage;
import React, { useState, useEffect } from "react";
import { Plus, Users } from "lucide-react";

 function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState("");

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("teams")) || [];
    setTeams(saved);
  }, []);

  const saveTeams = (newList) => {
    localStorage.setItem("teams", JSON.stringify(newList));
    setTeams(newList);
  };

  const addTeam = () => {
    if (!teamName) return alert("Team name is required");

    const newTeam = {
      id: Date.now(),
      name: teamName,
      members: members ? members.split(",").map((m) => m.trim()) : [],
    };

    const updated = [...teams, newTeam];
    saveTeams(updated);

    setTeamName("");
    setMembers("");
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-teal-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-teal-700 flex items-center gap-2">
          <Users /> Teams
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={20} /> New Team
        </button>
      </div>

      {/* Teams */}
      <div className="grid md:grid-cols-3 gap-4">
        {teams.map((t) => (
          <div
            key={t.id}
            className="bg-white p-4 rounded-xl border border-teal-200 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-teal-700">{t.name}</h2>
            <p className="text-gray-600 text-sm mt-1">
              Members: {t.members.join(", ") || "No members"}
            </p>
          </div>
        ))}

        {teams.length === 0 && (
          <p className="text-gray-600">No teams created.</p>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-96 rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-teal-700 mb-4">
              Create Team
            </h2>

            <input
              type="text"
              placeholder="Team Name"
              className="w-full border px-3 py-2 rounded-lg mb-3"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Members (comma separated)"
              className="w-full border px-3 py-2 rounded-lg mb-4"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={addTeam}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default TeamsPage