import { useState } from "react";

function MessageModal({ listingId, senderId, receiverId, onClose, addNotification }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      addNotification("Message cannot be empty", "error");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include JWT token if required: Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          senderId,
          receiverId,
          listingId,
          message,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      addNotification("Message sent successfully!", "success");
      setMessage("");
      onClose();
    } catch (err) {
      console.error(err);
      addNotification("Failed to send message", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="message-modal">
      <textarea
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
      />
      <div className="message-actions">
        <button onClick={onClose} className="btn-secondary">Cancel</button>
        <button onClick={handleSend} className="btn-primary" disabled={sending}>
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default MessageModal;
