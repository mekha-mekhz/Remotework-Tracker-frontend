import React, { useState } from "react";
import Profile from "../pages/Profile";
import Leave from "../pages/Leave";
import Productivity from "./Productivity";
import Notification from "./Notification";
import Attendance from "./Attendance";
import ProductivityReport from "./ProductivityReport";
import Chat from "./chat";
import CreateDispute from "./CreateDispute";

function PremiumDashboard() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "leaves", label: "Leaves" },
    { key: "attendance", label: "Attendance" },
    { key: "productivity", label: "Productivity" },
    { key: "notification", label: "Notifications" },
    { key: "productivityreport", label: "Productivity Report" },
    { key: "chat", label: "Chat" },
        { key: "createdispute", label: "Disputes" },

  ];

  return (
    <div
      className="
        min-h-screen p-6
        bg-gradient-to-br from-gray-900 via-gray-800 to-black
        text-white
      "
    >
      {/* Header */}
      <h1
        className="
          text-3xl font-bold mb-8 text-center
          bg-gradient-to-r from-lime-300 to-teal-300
          text-transparent bg-clip-text
        "
      >
        Premium Dashboard
      </h1>

      {/* ===== Tabs ===== */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-5 py-2 rounded-full font-semibold transition
                backdrop-blur-md border border-white/20
                ${
                  isActive
                    ? "bg-gradient-to-r from-lime-400 to-teal-400 text-black shadow-lg"
                    : "bg-white/10 text-gray-200 hover:bg-white/20"
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ===== Content ===== */}
      <div
        className="
          max-w-6xl mx-auto
          bg-white/10 backdrop-blur-md
          border border-white/20
          rounded-2xl shadow-2xl
          p-6
        "
      >
        {activeTab === "profile" && <Profile />}
        {activeTab === "leaves" && <Leave />}
        {activeTab === "attendance" && <Attendance />}
        {activeTab === "productivity" && <Productivity />}
        {activeTab === "notification" && <Notification />}
        {activeTab === "productivityreport" && <ProductivityReport />}
        {activeTab === "chat" && <Chat />}
                {activeTab === "createdispute" && <CreateDispute />}

      </div>
    </div>
  );
}

export default PremiumDashboard;
