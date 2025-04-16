import { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const chatBodyRef = useRef(null);

  useEffect(() => {
    chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`https://finance-assistance-chatbot.onrender.com/query?question=${encodeURIComponent(input)}`);
      if (!response.ok) throw new Error("Query endpoint failed");

      const data = await response.json();
      const botReply = { text: data.answer || "No response from bot.", sender: "bot" };

      setMessages((prev) => [...prev, botReply]);

      await fetch("https://finance-assistance-chatbot.onrender.com/saveChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: auth.currentUser?.email || "anonymous",
          message: newMessage,
          response: data.answer,
        }),
      });

    } catch (error) {
      console.error("SendMessage Error:", error);
      setMessages((prev) => [...prev, { text: "Error fetching response from server.", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout Failed:", error);
    }
  };

  return (
    <div className="chatbox-container">
      <div className="chat-header">
        {/* ✅ Finbot Logo */}
        <img src="/assets/Finbot.png" alt="Finbot Logo" className="logo" style={{ height: "40px", marginRight: "10px" }} />
        <span>Finance Assistant</span>
        <FiLogOut onClick={handleLogout} className="logout-icon" size={20} />
      </div>

      <div className="chat-body" ref={chatBodyRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}>
            {msg.text}
          </div>
        ))}
        {loading && <AiOutlineLoading3Quarters className="loading-icon animate-spin" />}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask something..."
        />
        <button onClick={sendMessage}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}
