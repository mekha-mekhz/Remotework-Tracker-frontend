import React, { useEffect, useState } from "react";
import api from "../components/api";
import { useAuth } from "../context/Authcontext";

function Chat() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchManagers = async () => {
    try {
      const res = await api.get("/managers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setManagers(res.data.managers || []);
    } catch (err) {
      console.error("Error fetching managers:", err);
    }
  };

  const fetchConversation = async (managerId) => {
    try {
      const res = await api.get(`/messages/conversation/${managerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.messages);
    } catch (err) {
      console.error("Error fetching conversation:", err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage || !selectedManager) return;
    try {
      await api.post(
        "/messages/send",
        { receiverId: selectedManager._id, message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage("");
      fetchConversation(selectedManager._id);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex gap-6">
      {/* Left panel: manager selection */}
      <div className="w-1/4 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
        <h2 className="font-bold text-teal-400 mb-3 text-lg">Managers</h2>
        <select
          className="w-full p-2 rounded bg-slate-800 text-slate-200 border border-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
          value={selectedManager?._id || ""}
          onChange={(e) => {
            const manager = managers.find((m) => m._id === e.target.value);
            setSelectedManager(manager);
            fetchConversation(manager._id);
          }}
        >
          <option value="">Select a Manager</option>
          {managers.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name} ({m.email})
            </option>
          ))}
        </select>

        {/* Recent chats preview */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-2">
          {messages.slice(-5).map((msg) => (
            <div
              key={msg._id}
              className={`p-2 rounded-lg max-w-full break-words ${
                msg.sender._id === selectedManager?._id
                  ? "bg-slate-800 text-slate-200 text-left"
                  : "bg-teal-500 text-slate-950 text-right"
              }`}
            >
              {msg.message}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel: conversation */}
      <div className="w-3/4 flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h2 className="font-bold text-teal-400 mb-3 text-lg">
          {selectedManager ? selectedManager.name : "Select a manager to chat"}
        </h2>

        <div className="flex-1 overflow-y-auto space-y-2 mb-3">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-3 rounded-lg max-w-[75%] break-words ${
                msg.sender._id === selectedManager?._id
                  ? "bg-slate-800 text-slate-200 text-left"
                  : "bg-lime-500 text-slate-950 text-right ml-auto"
              }`}
            >
              {msg.message}
            </div>
          ))}
        </div>

        {selectedManager && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-slate-950 font-semibold"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
