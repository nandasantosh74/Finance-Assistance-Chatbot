import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { getCsvAnswer } from "./utils/csvHelper.js";
import { getLlamaResponse } from "./utils/llamaHelper.js";
import ChatMessage from "./models/ChatMessage.js";

dotenv.config();  // Load environment variables from .env file

const app = express();
const PORT = 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  // No need to specify useNewUrlParser and useUnifiedTopology options anymore.
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(cors());
app.use(express.json());

// Default Route
app.get("/", (req, res) => {
  res.send("Finance Assistance Chatbot API is running!");
});

// API Route to handle chatbot queries
app.get("/query", async (req, res) => {
  const { question } = req.query;

  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  try {
    const csvAnswer = await getCsvAnswer(question);

    // Save user question to MongoDB
    const chatMessage = new ChatMessage({
      user: "User",  // Modify based on your app's user system
      message: question,
      sender: "user",
    });

    await chatMessage.save();  // Save the user message

    if (csvAnswer) {
      return res.json({ answer: csvAnswer });
    }

    const aiResponse = await getLlamaResponse(question);

    // Save AI response to MongoDB
    const aiMessage = new ChatMessage({
      user: "Bot",  // The response is from the bot
      message: aiResponse,
      sender: "bot",
    });

    await aiMessage.save();  // Save the bot's response

    return res.json({ answer: aiResponse });

  } catch (error) {
    console.error("Error processing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API Route to fetch chat history (last 10 messages)
app.get("/chatHistory", async (req, res) => {
  try {
    const chatHistory = await ChatMessage.find()
      .sort({ timestamp: -1 })
      .limit(10); // Fetch latest 10 messages
    res.status(200).json(chatHistory);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

app.post("/saveChat", async (req, res) => {

  const { user, message, response } = req.body;
  console.log("Received /saveChat payload:", req.body);

  if (!user || !message || !message.text || !message.sender || !response) {
    return res.status(400).json({ error: "user, message.text, message.sender, and response are required" });
  }

  try {
    const userMessage = new ChatMessage({
      user: user,
      message: message.text,
      sender: message.sender,
    });
    await userMessage.save();

    const botMessage = new ChatMessage({
      user: user,
      message: response,
      sender: "bot",
    });
    await botMessage.save();

    res.status(200).json({ message: "Chat messages saved successfully" });
  } catch (error) {
    console.error("Error saving chat messages:", error);
    res.status(500).json({ error: "Failed to save chat messages" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});