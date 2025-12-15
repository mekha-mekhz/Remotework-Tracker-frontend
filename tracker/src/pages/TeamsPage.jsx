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
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-teal-400 flex items-center gap-2">
          <Users /> Teams
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={20} /> New Team
        </button>
      </div>

      {/* Teams */}
      <div className="grid md:grid-cols-3 gap-4">
        {teams.length === 0 && (
          <p className="text-slate-400 col-span-full text-center">
            No teams created.
          </p>
        )}

        {teams.map((t) => (
          <div
            key={t.id}
            className="bg-slate-800 p-4 rounded-xl border border-teal-700 shadow"
          >
            <h2 className="text-xl font-semibold text-teal-400">{t.name}</h2>
            <p className="text-slate-300 text-sm mt-1">
              Members: {t.members.join(", ") || "No members"}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 w-96 rounded-xl p-6 shadow-xl border border-teal-600">
            <h2 className="text-xl font-bold text-teal-400 mb-4">
              Create Team
            </h2>

            <input
              type="text"
              placeholder="Team Name"
              className="w-full border border-slate-700 px-3 py-2 rounded-lg mb-3 bg-slate-800 text-white focus:outline-teal-400"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Members (comma separated)"
              className="w-full border border-slate-700 px-3 py-2 rounded-lg mb-4 bg-slate-800 text-white focus:outline-teal-400"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={addTeam}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg"
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

export default TeamsPage;
