import React, { useState } from "react";
import Profile from "../pages/Profile";
import Leave from "../pages/Leave";
import Productivity from "./Productivity";
import Notification from "./Notification";
import Attendance from "./Attendance";
import ProductivityReport from "./ProductivityReport";
import Chat from "./Chats";
import CreateDispute from "./CreateDispute";
import CreateReminder from "./CreateReminder";
import UserStatus from "./UserStatus";
import UserStatusAdmin from "./UserStatusAdmin";
import { useAuth } from "../context/Authcontext";
import MyDisputes from "./MyDisputes";

function PremiumDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "status", label: "My Status" },
    { key: "leaves", label: "Leaves" },
    { key: "attendance", label: "Attendance" },
    { key: "productivity", label: "Productivity" },
    { key: "notification", label: "Notifications" },
    { key: "productivityreport", label: "Report" },
    { key: "chat", label: "Chat" },
    { key: "createdispute", label: "Disputes" },
    { key: "createReminder", label: "Reminders" },
    { key: "mydisputes", label: "My Disputes" }

  ];

  if (user?.role === "admin" || user?.role === "manager") {
    tabs.push({ key: "teamstatus", label: "Team Status" });
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-lime-300 to-teal-300 text-transparent bg-clip-text">
        Premium Dashboard
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-full font-semibold transition border border-white/20
              ${activeTab === tab.key
                ? "bg-gradient-to-r from-lime-400 to-teal-400 text-black"
                : "bg-white/10 hover:bg-white/20"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6">
        {activeTab === "profile" && <Profile />}
        {activeTab === "status" && <UserStatus />}
        {activeTab === "leaves" && <Leave />}
        {activeTab === "attendance" && <Attendance />}
        {activeTab === "productivity" && <Productivity />}
        {activeTab === "notification" && <Notification />}
        {activeTab === "productivityreport" && <ProductivityReport />}
        {activeTab === "chat" && <Chat />}
        {activeTab === "createdispute" && <CreateDispute />}
        {activeTab === "createReminder" && <CreateReminder />}
        {activeTab === "teamstatus" && <UserStatusAdmin />}
        {activeTab === "mydisputes" && <MyDisputes />}

      </div>
    </div>
  );
}

export default PremiumDashboard;
