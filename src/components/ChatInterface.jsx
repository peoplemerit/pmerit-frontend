import { useState } from "react";
import axios from "axios";

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage = { text: userInput, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setIsProcessing(true);
    setUserInput("");

    try {
	  const response = await axios.post("https://pmerit-backend.onrender.com/api/chat", {
		message: newMessage.text,
		});
		
      setMessages((prev) => [...prev, { text: response.data.response, sender: "ai" }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { text: "Sorry, an error occurred.", sender: "ai" }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isProcessing && <div className="message ai">Thinking...</div>}
      </div>

      <div className="input-area">
        <input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your question..."
          disabled={isProcessing}
        />
        <button onClick={sendMessage} disabled={isProcessing}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatInterface;
