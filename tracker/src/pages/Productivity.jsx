import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Productivity() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    title: "",
    targetHours: "",
  });

  const addGoal = (e) => {
    e.preventDefault();
    const newGoal = {
      _id: Date.now(),
      title: form.title,
      targetHours: Number(form.targetHours),
      progress: 0,
    };
    setGoals([newGoal, ...goals]);
    setForm({ title: "", targetHours: "" });
  };

  const updateProgress = (goalId, newValue) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal._id === goalId
          ? { ...goal, progress: Math.min(newValue, goal.targetHours) }
          : goal
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-teal-400 mb-6">
          Productivity Goals
        </h1>

        {/* ===== ADD GOAL ===== */}
        <form
          onSubmit={addGoal}
          className="bg-slate-900 border border-slate-800
            p-5 rounded-xl shadow-lg mb-8"
        >
          <h2 className="text-lg font-semibold text-slate-200 mb-4">
            Create Goal
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Goal Title (ex: Learn React)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="p-3 rounded bg-slate-800 text-slate-200
                border border-slate-700 focus:outline-none
                focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
              required
            />

            <input
              type="number"
              placeholder="Target Hours"
              value={form.targetHours}
              onChange={(e) =>
                setForm({ ...form, targetHours: e.target.value })
              }
              className="p-3 rounded bg-slate-800 text-slate-200
                border border-slate-700 focus:outline-none
                focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 px-6 py-2 rounded-lg font-semibold
              bg-gradient-to-r from-teal-500 to-lime-500
              hover:from-teal-600 hover:to-lime-600
              text-slate-950 transition"
          >
            Add Goal
          </button>
        </form>

        {/* ===== GOAL LIST ===== */}
        <h2 className="text-xl font-semibold text-slate-200 mb-4">
          My Goals
        </h2>

        {goals.length === 0 ? (
          <div className="text-center py-6 text-slate-400">
            No goals yet.
          </div>
        ) : (
          <div className="space-y-5">
            {goals.map((goal) => {
              const progressPercent = Math.min(
                (goal.progress / goal.targetHours) * 100,
                100
              );

              return (
                <motion.div
                  key={goal._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 border border-slate-800
                    p-5 rounded-xl shadow-lg"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg text-slate-200">
                        {goal.title}
                      </h3>
                      <p className="text-sm mt-1 text-slate-400">
                        {goal.progress} / {goal.targetHours} hours
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-slate-800 rounded mt-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-lime-500
                        transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Update Progress */}
                  <div className="mt-4 flex gap-4 items-center">
                    <input
                      type="number"
                      value={goal.progress}
                      min="0"
                      max={goal.targetHours}
                      onChange={(e) =>
                        updateProgress(goal._id, Number(e.target.value))
                      }
                      className="p-2 w-32 rounded bg-slate-800 text-slate-200
                        border border-slate-700 focus:outline-none
                        focus:border-lime-400 focus:ring-1 focus:ring-lime-400"
                    />
                    <span className="text-slate-400 text-sm">
                      Update hours completed
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
