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
      setChats(res.data.chats);
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
      setMessages(res.data.messages);
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
    <div className="p-6 min-h-screen flex gap-6">
      {/* Left: Users list */}
      <div className="w-1/4 border rounded p-2">
        <h2 className="font-bold mb-2">Chats</h2>
        {chats.map((chat) => (
          <div
            key={chat.user._id}
            className={`p-2 mb-1 cursor-pointer rounded ${
              selectedUser?._id === chat.user._id ? "bg-gray-200" : ""
            }`}
            onClick={() => {
              setSelectedUser(chat.user);
              fetchConversation(chat.user._id);
            }}
          >
            {chat.user.name}
            <p className="text-sm text-gray-600">{chat.lastMessage}</p>
          </div>
        ))}
      </div>

      {/* Right: Conversation */}
      <div className="w-3/4 flex flex-col border rounded p-2">
        <h2 className="font-bold mb-2">
          {selectedUser ? selectedUser.name : "Select a chat"}
        </h2>
        <div className="flex-1 overflow-y-auto mb-2 space-y-2">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-2 rounded ${
                msg.sender._id === selectedUser?._id
                  ? "bg-gray-300 text-left"
                  : "bg-blue-500 text-white text-right"
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
              className="flex-1 border rounded p-2"
              placeholder="Type a message..."
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

export default ManagerChat;
