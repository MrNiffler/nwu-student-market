import React from "react";

function ChatThread({ messages }) {
  return (
    <div className="chat-thread">
      {messages.map((msg, index) => (
        <div key={index} className={`chat-message ${msg.sender === "me" ? "sent" : "received"}`}>
          <p>{msg.text}</p>
          <span>{msg.timestamp}</span>
        </div>
      ))}
    </div>
  );
}

export default ChatThread;
