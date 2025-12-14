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

  // Fetch all managers for dropdown
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

  // Fetch conversation with selected manager
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

  // Send a message
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
    <div className="p-6 min-h-screen flex gap-6">
      {/* Left panel: manager selection */}
      <div className="w-1/4 border rounded p-2">
        <h2 className="font-bold mb-2">Managers</h2>
        <select
          className="w-full border rounded p-2"
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

        {/* Optional: recent chats with managers */}
        <div className="mt-4 space-y-2">
          {messages.slice(-5).map((msg) => (
            <div
              key={msg._id}
              className={`p-2 rounded ${msg.sender._id === selectedManager?._id
                ? "bg-gray-200 text-left"
                : "bg-blue-500 text-white text-right"
                }`}
            >
              {msg.message}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel: conversation */}
      <div className="w-3/4 flex flex-col border rounded p-2">
        <h2 className="font-bold mb-2">
          {selectedManager ? selectedManager.name : "Select a manager to chat"}
        </h2>
        <div className="flex-1 overflow-y-auto mb-2 space-y-2">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-2 rounded ${msg.sender._id === selectedManager?._id
                ? "bg-gray-300 text-left"
                : "bg-blue-500 text-white text-right"
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
              className="flex-1 border rounded p-2"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white p-2 rounded"
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
