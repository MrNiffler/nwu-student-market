import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";

function MessageModal({ conversationId, receiverId, onClose, addNotification }) {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      addNotification("Message cannot be empty", "error");
      return;
    }
    setSending(true);
    try {
      await api.post(`/messages/conversations/${conversationId}/messages`, {
        sender_id: user.id,
        body: message,
      });
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
