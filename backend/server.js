import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { getCsvAnswer } from "./utils/csvHelper.js";
import { getLlamaResponse } from "./utils/llamaHelper.js";
import ChatMessage from "./models/ChatMessage.js";

dotenv.config();

const app = express();
const PORT = 5000;

const allowedOrigins = [
  "http://localhost:5173", 
  "https://www.finbot.solutions", 
  "https://finance-assistance-chatbot.onrender.com",
];

// Enable CORS globally
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle OPTIONS requests explicitly (Preflight Request Handling)
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Default Route
app.get("/", (req, res) => {
  res.send("Finance Assistance Chatbot API is running!");
});

// API Route to handle chatbot queries
app.get("/query", async (req, res) => {
  const { question } = req.query;

  if (!question) return res.status(400).json({ error: "Question is required" });

  try {
    const csvAnswer = await getCsvAnswer(question);

    const chatMessage = new ChatMessage({ user: "User", message: question, sender: "user" });
    await chatMessage.save();

    if (csvAnswer) return res.json({ answer: csvAnswer });

    const aiResponse = await getLlamaResponse(question);

    const aiMessage = new ChatMessage({ user: "Bot", message: aiResponse, sender: "bot" });
    await aiMessage.save();

    return res.json({ answer: aiResponse });

  } catch (error) {
    console.error("Error processing query:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// API Route to fetch chat history (last 10 messages)
app.get("/chatHistory", async (req, res) => {
  try {
    const chatHistory = await ChatMessage.find().sort({ timestamp: -1 }).limit(10);
    res.status(200).json(chatHistory);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// API Route to save chat messages
app.post("/saveChat", async (req, res) => {
  const { user, message, response } = req.body;
  console.log("Received /saveChat payload:", req.body);

  if (!user || !message || !message.text || !message.sender || !response) {
    return res.status(400).json({ error: "user, message.text, message.sender, and response are required" });
  }

  try {
    await ChatMessage.create({ user, message: message.text, sender: message.sender });
    await ChatMessage.create({ user, message: response, sender: "bot" });

    res.status(200).json({ message: "Chat messages saved successfully" });
  } catch (error) {
    console.error("Error saving chat messages:", error);
    res.status(500).json({ error: "Failed to save chat messages" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
