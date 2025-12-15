import React, { useState, useEffect } from "react";
import { FolderKanban, Plus } from "lucide-react";

function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    deadline: "",
    description: "",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(saved);
  }, []);

  const saveProjects = (list) => {
    localStorage.setItem("projects", JSON.stringify(list));
    setProjects(list);
  };

  const addProject = () => {
    if (!form.name) return alert("Project name required");

    const data = {
      id: Date.now(),
      ...form,
    };

    const updated = [...projects, data];
    saveProjects(updated);

    setForm({ name: "", deadline: "", description: "" });
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-teal-400 flex items-center gap-2">
          <FolderKanban /> Projects
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus /> New Project
        </button>
      </div>

      {/* Projects */}
      <div className="grid md:grid-cols-3 gap-4">
        {projects.length === 0 && (
          <p className="text-slate-400 col-span-full text-center">
            No projects yet.
          </p>
        )}

        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-slate-800 p-4 rounded-xl border border-teal-700 shadow"
          >
            <h2 className="text-xl font-semibold text-teal-400">{p.name}</h2>
            <p className="text-slate-300 mt-1">
              Deadline: {p.deadline || "No deadline"}
            </p>
            <p className="text-slate-400 text-sm mt-2">{p.description}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 w-96 p-6 rounded-xl shadow-xl border border-teal-600">
            <h2 className="text-xl font-bold text-teal-400 mb-4">
              Create Project
            </h2>

            <input
              type="text"
              placeholder="Project Name"
              className="w-full border border-slate-700 px-3 py-2 rounded-lg mb-3 bg-slate-800 text-white focus:outline-teal-400"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="date"
              className="w-full border border-slate-700 px-3 py-2 rounded-lg mb-3 bg-slate-800 text-white focus:outline-teal-400"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />

            <textarea
              placeholder="Project Description"
              className="w-full border border-slate-700 px-3 py-2 rounded-lg mb-4 bg-slate-800 text-white focus:outline-teal-400"
              value={form.description}
              rows={3}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={addProject}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectPage;
