import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./components/Auth/Auth.jsx";
import Chatbot from "./components/Chatbot.jsx"; // ✅ Import Chatbot
import "./styles.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} /> {/* ✅ Authentication Page */}
        <Route path="/chat" element={<Chatbot />} /> {/* ✅ Chatbot Page */}
      </Routes>
    </Router>
  );
}

export default App;
