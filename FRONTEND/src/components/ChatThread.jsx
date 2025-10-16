import React from "react";

function ChatThread({ messages, userId }) {
  return (
    <div className="chat-thread">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`chat-message ${
            msg.sender_id === userId ? "sent" : "received"
          }`}
        >
          <p>{msg.body}</p>
          <span>{new Date(msg.created_at).toLocaleTimeString()}</span>
        </div>
      ))}
    </div>
  );
}

export default ChatThread;
