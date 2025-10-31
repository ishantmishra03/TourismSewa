import React, { useState, useRef, useEffect } from "react";
import UserInput from "./UserInput";
import "../styles.css";

// Icons for cards
const cardIcons = {
  summary: "📝",
  error: "⚠️"
};

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, loading]);

  const handleMessageSubmit = async (message) => {
    // Add user message
    setMessages(prev => [...prev, { content: message, sender: "user" }]);
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: message })
      });

      const data = await res.json();

      // Handle errors
      if (data.error) {
        setMessages(prev => [
          ...prev,
          { content: [{ type: "error", content: data.error + (data.raw ? "\n" + data.raw : "") }], sender: "bot" }
        ]);
      } else if (data.text) {
        // Display GPT output in one card (formatted)
        setMessages(prev => [
          ...prev,
          { content: [{ type: "summary", content: data.text }], sender: "bot" }
        ]);
      }

    } catch (e) {
      setMessages(prev => [
        ...prev,
        { content: [{ type: "error", content: "⚠️ Backend not responding." }], sender: "bot" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chatbox">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            {msg.sender === "user" ? (
              <div className="user-msg">{msg.content}</div>
            ) : (
              msg.content.map((card, idx) => (
                <div key={idx} className={`bot-card ${card.type}`}>
                  <p>
                    <strong>{cardIcons[card.type] || ""}</strong>{" "}
                    {card.content.split("\n").map((line, lidx) => <span key={lidx}>{line}<br/></span>)}
                  </p>
                </div>
              ))
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
        {loading && <div className="bot-card summary"><strong>📝</strong> Bot is thinking...</div>}
      </div>
      <UserInput onSubmit={handleMessageSubmit} />
    </div>
  );
};

export default ChatBot;
