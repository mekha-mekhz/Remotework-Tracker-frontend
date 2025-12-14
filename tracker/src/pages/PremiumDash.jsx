import React, { useState } from "react";
import Profile from "../pages/Profile";
import Leave from "../pages/Leave";
import Productivity from "./Productivity";
import Notification from "./Notification";
import Attendance from "./Attendance"; // optional
import ProductivityReport from "./ProductivityReport";
import Chat from "./chat";

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
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Premium Dashboard</h1>

      {/* ===== Tabs ===== */}
      <div className="flex flex-wrap gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== Content ===== */}
      <div className="space-y-6">
        {activeTab === "profile" && <Profile />}
        {activeTab === "leaves" && <Leave />}
        {activeTab === "attendance" && <Attendance />}
        {activeTab === "productivity" && <Productivity />}
        {activeTab === "notification" && <Notification />}
        {activeTab === "productivityreport" && <ProductivityReport />}
                {activeTab === "chat" && <Chat />}

      </div>
    </div>
  );
}

export default PremiumDashboard;
