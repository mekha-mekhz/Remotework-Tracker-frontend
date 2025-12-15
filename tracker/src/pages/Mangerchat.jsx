import React, { useEffect, useState } from "react";
import api from "../components/api";

function ManagerChat() {
  const [chats, setChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const token = localStorage.getItem("token");

  // Fetch users who messaged this manager
  const fetchChats = async () => {
    try {
      const res = await api.get("/messages/chats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(res.data.chats || []);
    } catch (err) {
      console.error("Error fetching chats", err);
    }
  };

  // Fetch conversation with selected user
  const fetchConversation = async (userId) => {
    try {
      const res = await api.get(`/messages/conversation/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Error fetching conversation", err);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage || !selectedUser) return;
    try {
      await api.post(
        "/messages/send",
        { receiverId: selectedUser._id, message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage("");
      fetchConversation(selectedUser._id);
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="p-6 min-h-screen flex gap-6 bg-slate-950 text-white">
      {/* Left: Users list */}
      <div className="w-1/4 bg-slate-900 rounded-lg shadow p-3 flex flex-col">
        <h2 className="font-bold text-teal-400 mb-3 text-lg">Chats</h2>
        <div className="flex-1 overflow-y-auto space-y-2">
          {chats.length === 0 ? (
            <p className="text-slate-400">No chats available</p>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.user._id}
                className={`p-3 rounded-lg cursor-pointer transition ${
                  selectedUser?._id === chat.user._id
                    ? "bg-teal-600"
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
                onClick={() => {
                  setSelectedUser(chat.user);
                  fetchConversation(chat.user._id);
                }}
              >
                <p className="font-semibold">{chat.user.name}</p>
                <p className="text-sm text-slate-300 truncate">{chat.lastMessage}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right: Conversation */}
      <div className="w-3/4 flex flex-col bg-slate-900 rounded-lg shadow p-4">
        <h2 className="font-bold mb-3 text-teal-400 text-lg">
          {selectedUser ? selectedUser.name : "Select a chat"}
        </h2>
        <div className="flex-1 overflow-y-auto mb-3 space-y-2">
          {messages.length === 0 && selectedUser && (
            <p className="text-slate-400 text-center">No messages yet</p>
          )}
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-2 rounded-lg max-w-[70%] ${
                msg.sender._id === selectedUser?._id
                  ? "bg-slate-700 text-left"
                  : "bg-teal-600 text-white text-right ml-auto"
              }`}
            >
              {msg.message}
            </div>
          ))}
        </div>

        {selectedUser && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-teal-400 text-white"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 rounded-lg"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerChat;
