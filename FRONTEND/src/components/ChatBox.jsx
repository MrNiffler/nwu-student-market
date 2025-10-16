import React, { useEffect, useState } from "react";
import { fetchAPI, postAPI } from "../api/api";
import "../style.css";

function ChatBox({ listingId, user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // Fetch messages
  const fetchMessages = async () => {
    if (!listingId) return;
    try {
      const data = await fetchAPI(`listings/${listingId}/messages`);
      setMessages(data.data || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // auto-refresh
    return () => clearInterval(interval);
  }, [listingId]);

  const handleSend = async () => {
    if (!text.trim() || !user.isLoggedIn) return;
    try {
      await postAPI(`listings/${listingId}/messages`, {
        userId: user.id,
        text,
      });
      setText("");
      fetchMessages(); // Refresh after sending
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-thread">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.userId === user.id ? "sent" : "received"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;
