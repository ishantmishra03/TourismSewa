// UserInput.jsx
import React, { useState } from "react";

const UserInput = ({ onSubmit }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) {
      onSubmit(trimmed);
      setInput(""); // clear input after sending
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-input">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me about a city in Nepal..."
        autoFocus
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default UserInput;
