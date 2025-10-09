import React, { useState, useEffect } from "react";
import ChatThread from "./ChatThread";
import ChatInput from "./ChatInput";

function ChatBox({ listingId, user }) {
  const [messages, setMessages] = useState([]);
  console.log("Rendering ChatBox for listing:", listingId);


  useEffect(() => {
    // Dummy data tied to listing
    const dummyMessages = [
      { sender: "me", text: "Is this still available?", timestamp: "18:45" },
      { sender: "seller", text: "Yes, it is!", timestamp: "18:46" },
    ];
    setMessages(dummyMessages);
  }, [listingId]);

  const handleSend = (text) => {
    const newMessage = {
      sender: "me",
      text,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMessage]);

    // Future: emit via WebSocket
  };

  if (!user?.isLoggedIn) return null;

  return (
    <div className="chat-box">
      <ChatThread messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  );
}

export default ChatBox;
