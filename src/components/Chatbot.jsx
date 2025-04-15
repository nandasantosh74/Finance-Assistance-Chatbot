import { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi"; // ✅ Logout Icon
import { getAuth, signOut } from "firebase/auth"; 
import { useNavigate } from "react-router-dom"; 

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const chatBodyRef = useRef(null); // ✅ Scroll Ref

  // ✅ Scroll to latest message
  useEffect(() => {
    chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://finance-assistance-chatbot-4.onrender.com/query?question=" + encodeURIComponent(input));
      const data = await response.json();
      
      setMessages((prev) => [...prev, { text: data.answer, sender: "bot" }]);

      // ✅ Store chat in database
      await fetch("https://finance-assistance-chatbot-4.onrender.com/saveChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: auth.currentUser.email, message: newMessage, response: data.answer }),
      });
    } catch (error) {
      setMessages((prev) => [...prev, { text: "Error fetching response.", sender: "bot" }]);
    }
    setLoading(false);
  };

  // ✅ Handle Enter Key Press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  // ✅ Sign-Out Function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to login
    } catch (error) {
      console.error("Logout Failed:", error);
    }
  };

  return (
    <div className="chatbox-container">
      <div className="chat-header">
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
